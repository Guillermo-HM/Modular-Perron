const fs = require('node:fs');
const path = require('node:path');
const recetas = require('../catalogo/recetas.json');
const ingredientes = require('../catalogo/ingredientes.json');
const precios = require('../catalogo/precios.json');

const LIMITES_PRESUPUESTO = [150, 300, 1000];
const nombres = new Map(ingredientes.map(i => [i.id, i.nombreSeleccion || i.nombre]));
const singular = unidad => ({ piezas: 'pieza', tazas: 'taza', cucharadas: 'cucharada', dientes: 'diente', litros: 'litro' }[unidad] || unidad);

// Las equivalencias de taza/pieza son aproximaciones por alimento, no una
// densidad universal. No se descuenta lo que el usuario tiene en casa.
function calcularCostoIngrediente(ingrediente, tabla = precios) {
  const registro = tabla.ingredientes[ingrediente.id];
  if (!registro) throw new Error(`Falta precio o exclusión explícita: ${ingrediente.id}`);
  if (registro.excluir) return { id: ingrediente.id, excluido: true, motivo: registro.excluir, centavos: 0 };
  const unidad = singular(ingrediente.unidad);
  const factor = ingrediente.unidad === registro.unidad || unidad === registro.unidad
    ? 1 : registro.equivalencias?.[unidad];
  if (!Number.isFinite(factor) || factor <= 0) throw new Error(`Falta conversión: ${ingrediente.id}/${ingrediente.unidad}`);
  if (!Number.isFinite(registro.precio) || registro.precio <= 0 || !Number.isFinite(registro.base) || registro.base <= 0) {
    throw new Error(`Precio inválido: ${ingrediente.id}`);
  }
  if (!Number.isFinite(ingrediente.cantidad) || ingrediente.cantidad <= 0) throw new Error(`Cantidad inválida: ${ingrediente.id}`);
  return {
    id: ingrediente.id,
    nombre: nombres.get(ingrediente.id) || ingrediente.id,
    opcional: ingrediente.rol === 'opcional',
    excluido: false,
    centavos: Math.round(ingrediente.cantidad * factor * registro.precio * 100 / registro.base),
    tipoPrecio: registro.tipoPrecio,
    fuente: registro.fuente ? tabla.fuentes[registro.fuente]?.url : null
  };
}

function calcularCostoReceta(receta, tabla = precios) {
  if (!Number.isInteger(receta.porciones) || receta.porciones <= 0) throw new Error(`Porciones inválidas: ${receta.id}`);
  const detalle = receta.ingredientes.map(i => calcularCostoIngrediente(i, tabla));
  const centavos = detalle.reduce((total, i) => total + i.centavos, 0);
  return {
    receta: receta.id,
    centavos,
    costoEstimado: centavos / 100,
    costoPorPersona: Math.round(centavos / receta.porciones) / 100,
    porciones: receta.porciones,
    fechaPrecios: tabla.fecha,
    incluyeOpcionales: true,
    usaPreciosEstimados: detalle.some(i => !i.excluido && i.tipoPrecio === 'estimacion'),
    detalle
  };
}

function calcularCatalogo() {
  for (const ingrediente of ingredientes) {
    const registro = precios.ingredientes[ingrediente.id];
    if (!registro) throw new Error(`Ingrediente sin política de costo: ${ingrediente.id}`);
    if (!registro.excluir && !['referencia_publicada', 'estimacion'].includes(registro.tipoPrecio)) throw new Error(`Origen inválido: ${ingrediente.id}`);
    if (registro.tipoPrecio === 'referencia_publicada' && !precios.fuentes[registro.fuente]) throw new Error(`Fuente inválida: ${ingrediente.id}`);
  }
  return new Map(recetas.map(r => [r.id, calcularCostoReceta(r)]));
}

function textoCostosProlog(costos = calcularCatalogo()) {
  return '% Generado por node scripts/generar_costos.mjs. Importes en centavos MXN.\n' +
    [...costos].map(([id, costo]) => {
      if (!/^[a-z][a-z0-9_]*$/.test(id)) throw new Error(`ID inválido: ${id}`);
      return `costo_receta_centavos(${id}, ${costo.centavos}).`;
    }).join('\n') + '\n';
}

function verificarCostosProlog(costos) {
  const archivo = path.join(__dirname, '../prolog/conocimiento/costos.pl');
  if (!fs.existsSync(archivo) || fs.readFileSync(archivo, 'utf8').replaceAll('\r\n', '\n') !== textoCostosProlog(costos)) {
    throw new Error('Costos de Prolog desactualizados. Ejecuta node scripts/generar_costos.mjs desde la raíz.');
  }
}

function validarPresupuesto(valor) {
  // Compatibilidad con clientes anteriores: sin este campo conservan su flujo.
  if (valor === undefined) return null;
  if (typeof valor !== 'number' || !LIMITES_PRESUPUESTO.includes(valor)) {
    const error = new Error('Presupuesto inválido. Elige 150, 300 o 1000 pesos.');
    error.status = 400;
    throw error;
  }
  return valor;
}

module.exports = { calcularCostoIngrediente, calcularCostoReceta, calcularCatalogo, textoCostosProlog, verificarCostosProlog, validarPresupuesto };
