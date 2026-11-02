const singulares = { piezas: 'pieza', gramos: 'gramo', dientes: 'diente', cucharadas: 'cucharada', cucharaditas: 'cucharadita', tazas: 'taza', litros: 'litro', rebanadas: 'rebanada', hojas: 'hoja', tallos: 'tallo' };
const plurales = { pieza: 'piezas', gramo: 'gramos', diente: 'dientes', cucharada: 'cucharadas', cucharadita: 'cucharaditas', taza: 'tazas', litro: 'litros', rebanada: 'rebanadas', hoja: 'hojas', tallo: 'tallos' };

export function formatearCantidad(cantidad, unidad) {
  const base = singulares[unidad] || unidad;
  const femenino = ['pieza', 'cucharada', 'cucharadita', 'taza', 'rebanada', 'hoja'].includes(base);
  const entero = Math.floor(cantidad);
  const fraccion = Math.round((cantidad - entero) * 100) / 100;
  const parte = { 0.25: 'un cuarto', 0.5: femenino ? 'media' : 'medio', 0.75: 'tres cuartos' }[fraccion];
  if (fraccion && !parte) throw new Error('Fracción sin formato: '+cantidad);
  if (!entero) return fraccion === 0.5 ? `${parte} ${base}` : `${parte} de ${base}`;
  const numero = entero === 1 ? femenino ? 'una' : 'un' : String(entero);
  return `${numero} ${entero === 1 ? base : plurales[base] || unidad}${fraccion ? ' y '+parte : ''}`;
}

export function formatearIngrediente(ingrediente, nombres) {
  const nombre = nombres[ingrediente.id] || ingrediente.id.replaceAll('_', ' ');
  const texto = `${formatearCantidad(ingrediente.cantidad, ingrediente.unidad)} de ${nombre}${ingrediente.rol === 'opcional' ? ' (opcional)' : ''}`;
  return texto.charAt(0).toUpperCase()+texto.slice(1);
}
