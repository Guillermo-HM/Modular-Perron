import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = file => JSON.parse(fs.readFileSync(path.join(root,'catalogo',file),'utf8'));
const ingredientes = read('ingredientes.json');
const alergenos = read('alergenos.json');
const recetas = read('recetas.json');
const atom = value => `'${String(value).replaceAll("'", "''")}'`;
const fact = (name,...args) => `${name}(${args.join(', ')}).`;
const outputs = {};
outputs['prolog/conocimiento/ingredientes.pl'] = [
  ...ingredientes.map(ingrediente=>fact('ingrediente',ingrediente.id)),
  ...ingredientes.map(ingrediente=>fact('tipo_ingrediente',ingrediente.id,ingrediente.tipo)),
  ...ingredientes.flatMap(ingrediente=>ingrediente.alias.filter(alias=>alias!==ingrediente.id).map(alias=>fact('alias_ingrediente',atom(alias),ingrediente.id))),
  'ingrediente_canonico(Entrada, Canonico) :- alias_ingrediente(Entrada, Canonico), !.',
  'ingrediente_canonico(Ingrediente, Ingrediente).',
  'ingredientes_equivalentes(Primero, Segundo) :- ingrediente_canonico(Primero, Canonico), ingrediente_canonico(Segundo, Canonico).'
].join('\n')+'\n';
outputs['prolog/conocimiento/alergenos.pl'] = [
  ...alergenos.map(alergeno=>fact('alergeno',alergeno.id)),
  ...ingredientes.flatMap(ingrediente=>ingrediente.alergenos.map(alergeno=>fact('ingrediente_alergeno',ingrediente.id,alergeno))),
  ...ingredientes.flatMap(ingrediente=>ingrediente.posiblesAlergenos.map(alergeno=>fact('posible_alergeno',ingrediente.id,alergeno))),
  'alergeno_equivalente(Alergeno, Alergeno).',
  ...alergenos.flatMap(alergeno=>alergeno.alias.map(alias=>fact('alergeno_equivalente',atom(alias),alergeno.id))),
  'alergeno_de_ingrediente(Ingrediente, Alergeno) :- ingrediente_alergeno(Ingrediente, Alergeno).',
  'alergeno_de_ingrediente(Ingrediente, Alergeno) :- posible_alergeno(Ingrediente, Alergeno).',
  'alergeno_de_ingrediente(Ingrediente, Ingrediente) :- alergeno(Ingrediente).'
].join('\n')+'\n';
const groups = {};
const add = (name,...args) => (groups[name] ??= []).push(fact(name,...args));
for (const receta of recetas) {
  add('receta',receta.id); add('nombre_receta',receta.id,atom(receta.nombre));
  add('tipo_receta',receta.id,'plato_principal'); add('categoria_receta',receta.id,receta.cocina);
  add('dificultad',receta.id,'facil'); add('tiempo_preparacion',receta.id,receta.tiempo);
  add('porciones_base',receta.id,receta.porciones);
  for (const ingrediente of receta.ingredientes) add('ingrediente_receta',receta.id,ingrediente.id,ingrediente.cantidad,ingrediente.unidad,ingrediente.rol);
  receta.pasos.forEach((paso,index)=>add('paso',receta.id,index+1,atom(paso)));
  add('consejo_chef',receta.id,atom('Mide los ingredientes y revisa las etiquetas antes de preparar.'));
  add('forma_servir',receta.id,atom('Divide en dos porciones; conserva los alimentos a la temperatura adecuada.'));
  for (const etiqueta of new Set([receta.cocina,receta.grupo])) add('etiqueta_receta',receta.id,etiqueta);
}
outputs['prolog/conocimiento/recetas_generadas.pl'] = Object.values(groups).flat().join('\n')+'\n'+
  'alergeno_receta(Receta, Alergeno) :- ingrediente_receta(Receta, Ingrediente, _, _, _), alergeno_de_ingrediente(Ingrediente, Alergeno).\n';
outputs['prolog/conocimiento/recetas.pl'] = ":- ensure_loaded('recetas_generadas.pl').\n";
outputs['src/components/recipesDetailDb.js'] = `import recetas from '../../catalogo/recetas.json' with { type: 'json' };
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
`;
if (process.argv.includes('--check')) {
  for (const [file,text] of Object.entries(outputs)) {
    if (!fs.existsSync(path.join(root,file)) || fs.readFileSync(path.join(root,file),'utf8').replaceAll('\r\n','\n')!==text) throw Error('Catálogo desactualizado: '+file);
  }
  console.log('Catálogo sincronizado: '+recetas.length+' recetas, '+ingredientes.length+' ingredientes y '+alergenos.length+' restricciones.');
} else if (process.argv.includes('--parches')) {
  const destination=path.resolve(process.argv[process.argv.indexOf('--parches')+1]);
  fs.mkdirSync(destination,{recursive:true});
  const patches=[];
  for (const [file,text] of Object.entries(outputs)) {
    const target=path.join(root,file).replaceAll('\\','/');
    if (fs.existsSync(target)) {
      const deletePath=path.join(destination,`cambio-${patches.length}.patch`);
      fs.writeFileSync(deletePath,`*** Begin Patch\n*** Delete File: ${target}\n*** End Patch`); patches.push(deletePath);
    }
    const lines=text.trimEnd().split('\n');
    let previousLine;
    for (let offset=0;offset<lines.length;offset+=90) {
      const chunk=lines.slice(offset,offset+90);
      const patchPath=path.join(destination,`cambio-${patches.length}.patch`);
      fs.writeFileSync(patchPath,'*** Begin Patch\n'+(offset===0?`*** Add File: ${target}\n`:`*** Update File: ${target}\n@@\n ${previousLine}\n`)+chunk.map(line=>'+'+line+'\n').join('')+'*** End Patch');
      patches.push(patchPath); previousLine=chunk.at(-1);
    }
  }
  fs.writeFileSync(path.join(destination,'lista.json'),JSON.stringify(patches));
  console.log(patches.length+' parches preparados.');
} else {
  for (const [file,text] of Object.entries(outputs)) fs.writeFileSync(path.join(root,file),text);
  console.log('Catálogo generado. Ejecuta node pruebas_catalogo.mjs para verificarlo.');
}
