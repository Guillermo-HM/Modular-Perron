const express = require('express');
const cors = require('cors');
const path = require('path');
const SwiplStdio = require('swipl-stdio');
const { createClient } = require('@supabase/supabase-js');

// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL = 'https://khmeadsalacxzjljkoqv.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFsa2N6amxqa29xdiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzgyMTc1MjQxLCJleHAiOjIwOTc3NTEyNDEsInN1cCI6ImFub24ifQ.bGXQaI3ZNB8KgdNYqEoYvbwp4GFKSvtWc4e212kIZxI';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// =====================================================
// EXPRESS
// =====================================================

const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// PROLOG
// =====================================================

const prolog = new SwiplStdio.Engine();

// =====================================================
// UTILIDADES
// =====================================================

// Normalizar texto: convierte a minúsculas, remueve acentos y caracteres especiales
const normalizarPrologAtom = (str) => {
    if (!str) return 'juan';
    
    const limpio = String(str)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remueve tildes
        .replace(/[^a-z0-9_]/g, "_")    // Reemplaza caracteres especiales
        .replace(/^_+|_+$/g, "");       // Elimina guiones bajos de los bordes

    // En Prolog, si empieza con minúscula y solo contiene a-z, 0-9 y _, es un átomo válido sin comillas
    if (/^[a-z][a-z0-9_]*$/.test(limpio)) {
        return limpio;
    }
    
    return `'${limpio}'`;
};
// =====================================================
// EJECUTAR CONSULTAS EN PROLOG
// =====================================================

async function callProlog(queryStr) {
    try {
        return await prolog.call(queryStr);
    } catch (error) {
        console.error('❌ Error ejecutando Prolog:', error);
        throw error;
    }
}

// =====================================================
// INICIALIZAR PROLOG
// =====================================================

async function inicializarProlog() {
    try {
        console.log('🔄 Cargando base de conocimiento Prolog...');
        
        const prologDir = path.resolve(__dirname, '../prolog').replace(/\\/g, '/');
        console.log('📌 Cambiando directorio de Prolog a:', prologDir);

        // Cambiar el directorio activo para que encuentre las subcarpetas /conocimiento y /reglas
        await callProlog(`working_directory(_, '${prologDir}')`);
        await callProlog(`consult('main.pl')`);

        console.log('✔ Base de conocimiento Prolog cargada correctamente.');
    } catch (error) {
        console.error('❌ Error al cargar archivos .pl:', error);
    }
}

// =====================================================
// ENDPOINT 1: OBTENER RECOMENDACIONES
// =====================================================

app.post('/api/recomendar', async (req, res) => {
  try {
    const { usuario = 'cristopher', ingredientes = [], tiempo = 30 } = req.body;

    const lista = Array.isArray(ingredientes) ? ingredientes : [];
    const ingredientesProlog = lista
      .map(ing => String(ing).toLowerCase().trim().replace(/\s+/g, '_'))
      .join(',');

    const usuarioProlog = String(usuario).toLowerCase().trim();
    const consulta = `recomendar_para_usuario(${usuarioProlog}, [${ingredientesProlog}], ${tiempo}, Receta).`;

    console.log(`🔎 Consulta Prolog: ${consulta}`);

    const resultadoRaw = await callProlog(consulta);

    // Extraemos la variable "Receta" obtenida
    const listaRaw = resultadoRaw ? resultadoRaw.Receta : null;

    // Convertimos la estructura head/tail a un Array limpio
    const recetasFormateadas = parsearListaProlog(listaRaw);

    res.json({ OK: true, recetas: recetasFormateadas });
  } catch (error) {
    console.error('Error al procesar la recomendación:', error);
    res.status(500).json({ OK: false, error: error.message });
  }
});

// Función para convertir la lista enlazada { head, tail } de Prolog a un Array de JS
function parsearListaProlog(prologList) {
  // Si ya es un arreglo simple o falsy, lo retornamos directo
  if (!prologList) return [];
  if (Array.isArray(prologList)) return prologList;

  const resultado = [];
  let actual = prologList;

  // Recorrer la estructura head / tail
  while (actual && actual.head) {
    const elemento = actual.head;
    
    // Si el elemento es un término tipo recomendacion(Receta, Puntuacion)
    if (elemento && typeof elemento === 'object') {
      // Extraer datos si la librería expone la función/argumentos
      const nombre = elemento.args ? elemento.args[0] : elemento.name || elemento;
      const puntuacion = elemento.args ? elemento.args[1] : null;
      
      resultado.push({
        receta: String(nombre),
        puntuacion: puntuacion !== null ? Number(puntuacion) : null
      });
    } else {
      resultado.push(elemento);
    }

    actual = actual.tail;
  }

  return resultado;
}
// =====================================================
// ENDPOINT 2: REGISTRAR / ACTUALIZAR ALERGIAS
// =====================================================

app.post('/api/registrar-alergias', async (req, res) => {
    const { usuario, alergias } = req.body;

    if (!alergias || !Array.isArray(alergias)) {
        return res.status(400).json({
            success: false,
            error: 'Lista de alergias inválida'
        });
    }

    // Usar 'juan' por defecto para ser consistente con el endpoint de recomendar
    const usuarioProlog = normalizarPrologAtom(usuario || 'juan');

    try {
        // Eliminar alergias anteriores
        await callProlog(`retractall(tiene_alergia(${usuarioProlog}, _))`);

        // Registrar las nuevas alergias normalizadas
        for (const alergia of alergias) {
            const alergiaAtom = normalizarPrologAtom(alergia);
            await callProlog(`assertz(tiene_alergia(${usuarioProlog}, ${alergiaAtom}))`);
        }

        console.log(`✔ Alergias actualizadas para ${usuarioProlog}:`, alergias);

        res.json({
            success: true,
            message: 'Alergias registradas correctamente en Prolog'
        });

    } catch (error) {
        console.error('❌ Error al registrar alergias en Prolog:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// =====================================================
// ENDPOINT 3: SINCRONIZAR DESDE SUPABASE
// =====================================================

app.post('/api/sincronizar-usuario', async (req, res) => {
    const { usuarioId } = req.body;

    try {
        const { data: perfil, error } = await supabase
            .from('perfiles')
            .select('alergias')
            .eq('id', usuarioId)
            .single();

        if (error) throw error;

        if (perfil && perfil.alergias) {
            const usuarioProlog = normalizarPrologAtom(usuarioId);

            await callProlog(`retractall(tiene_alergia(${usuarioProlog}, _))`);

            for (const alergia of perfil.alergias) {
                await callProlog(`assertz(tiene_alergia(${usuarioProlog}, ${normalizarPrologAtom(alergia)}))`);
            }
        }

        res.json({
            OK: true,
            message: 'Perfil de Supabase sincronizado con Prolog'
        });

    } catch (error) {
        console.error('❌ Error al sincronizar Supabase con Prolog:', error);
        res.status(500).json({
            OK: false,
            error: error.message
        });
    }
});

// =====================================================
// INICIAR SERVIDOR
// =====================================================

app.listen(3001, async () => {
    console.log('🚀 Servidor backend corriendo en http://localhost:3001');
    await inicializarProlog();
});