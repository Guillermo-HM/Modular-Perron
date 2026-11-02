import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import costos from '../backend/costos.cjs';

const catalogo = costos.calcularCatalogo();
const archivo = fileURLToPath(new URL('../prolog/conocimiento/costos.pl', import.meta.url));
if (process.argv.includes('--check')) {
  costos.verificarCostosProlog(catalogo);
  console.log(`Costos sincronizados: ${catalogo.size} recetas.`);
} else {
  fs.writeFileSync(archivo, costos.textoCostosProlog(catalogo));
  console.log(`Costos generados para ${catalogo.size} recetas. No se modificaron las recetas.`);
}
