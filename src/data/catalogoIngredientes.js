import ingredientes from '../../catalogo/ingredientes.json' with { type: 'json' };
import alergenos from '../../catalogo/alergenos.json' with { type: 'json' };

export const ingredientsDb = ingredientes.reduce((grupos, ingrediente) => {
  (grupos[ingrediente.grupo] ??= []).push(ingrediente.id);
  return grupos;
}, {});

export const ALERGENOS_BASE = alergenos.map(alergeno => ({
  key: alergeno.id, label: alergeno.nombre, sub: 'Excluir recetas con este ingrediente o categoría'
}));

export const ALERGIAS = alergenos.map(alergeno => ({ id: alergeno.id, nombre: alergeno.nombre }));

const nombres = Object.fromEntries(ingredientes.map(ingrediente => [ingrediente.id, ingrediente.nombre]));

const nombresProteinas = {
  carne_res_molida: 'Carne molida de res',
  atun_agua: 'Atún',
  camaron: 'Camarón',
  pollo: 'Pollo',
  pechuga_pollo: 'Pechuga de pollo',
  carne_res: 'Carne de res',
  lomo_cerdo: 'Lomo de cerdo',
  cerdo: 'Cerdo',
  pescado_blanco: 'Pescado blanco',
  salmon: 'Salmón',
  huevo: 'Huevo',
  calamar: 'Calamar',
  mejillon: 'Mejillón',
  tofu: 'Tofu',
  tocino_cerdo: 'Tocino',
  anchoa: 'Anchoa',
  chorizo_cerdo: 'Chorizo'
};

export function nombreIngrediente(id) {
  return nombresProteinas[id] || nombres[id] || id.replaceAll('_', ' ');
}

export function normalizarAlergias(valores) {
  if (!Array.isArray(valores)) return [];
  return [...new Set(valores.flatMap(valor => {
    const coincidencias = alergenos.filter(alergeno => alergeno.id === valor || alergeno.alias.includes(valor));
    return coincidencias.length ? coincidencias.map(alergeno => alergeno.id) : [valor];
  }))];
}
