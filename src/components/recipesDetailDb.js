import recetas from '../../catalogo/recetas.json' with { type: 'json' };
import ingredientes from '../../catalogo/ingredientes.json' with { type: 'json' };
import { formatearIngrediente } from '../data/formatoCantidades.js';

const nombres = Object.fromEntries(ingredientes.map(ingrediente => [ingrediente.id, ingrediente.nombre]));

export const recipesDetailDb = Object.fromEntries(recetas.map(receta => [receta.id, {
  nombre: receta.nombre,
  tiempo: receta.tiempo+' minutos',
  categoria: receta.grupo.replaceAll('_', ' '),
  descripcion: receta.descripcion,
  porciones: receta.porciones,
  ingredientesIds: receta.ingredientes.map(ingrediente => ingrediente.id),
  ingredientes: receta.ingredientes.map(ingrediente => formatearIngrediente(ingrediente, nombres)),
  pasos: receta.pasos,
  fuente: receta.fuente,
  fuenteTipo: receta.fuenteTipo
}]));
