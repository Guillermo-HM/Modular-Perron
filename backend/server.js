const express = require('express');
const cors = require('cors');
const path = require('path');
const SwiplStdio = require('swipl-stdio');
const { createClient } = require('@supabase/supabase-js');

// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

let supabase = null;

if (SUPABASE_URL && SUPABASE_KEY) {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✔ Supabase configurado.');
} else {
    console.log('⚠ Supabase no configurado. Continuando sin conexión a la base de datos.');
}

// =====================================================
// EXPRESS
// =====================================================

const app = express();
app.use(cors());
app.use(express.json());

// =====================================================
// ENDPOINT DE PRUEBA: AUTENTICACIÓN CON SUPABASE
// =====================================================


app.get('/api/perfil-actual', async (req, res) => {
    try {
        // 1. Verificar que Supabase esté configurado
        if (!supabase) {
            return res.status(503).json({
                OK: false,
                error: 'Supabase no está configurado'
            });
        }

        // 2. Obtener el token enviado por React
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            return res.status(401).json({
                OK: false,
                error: 'Token de autenticación no proporcionado'
            });
        }

        const token = authorization.substring(7);

        // 3. Verificar la identidad del usuario con Supabase
        const {
            data: { user },
            error
        } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                OK: false,
                error: 'Token inválido o sesión expirada'
            });
        }

        // 4. Crear un cliente con el token del usuario
        // para respetar las políticas RLS de Supabase
        const supabaseUsuario = createClient(
            SUPABASE_URL,
            SUPABASE_KEY,
            {
                global: {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                },
                auth: {
                    persistSession: false,
                    autoRefreshToken: false,
                    detectSessionInUrl: false
                }
            }
        );

        // 5. Consultar el perfil del usuario autenticado
        const { data: perfil, error: perfilError } =
            await supabaseUsuario
                .from('perfiles')
                .select('alergias, ingredientes_desagradables, has_completed_onboarding')
                .eq('id', user.id)
                .maybeSingle();

        // 6. Verificar errores de la consulta
        if (perfilError) {
            console.error(
                'Error al consultar perfil:',
                perfilError.message
            );

            return res.status(500).json({
                OK: false,
                error: 'No se pudo consultar el perfil'
            });
        }

        if (!perfil) {
            return res.status(404).json({
                OK: false,
                error: 'No se encontró el perfil del usuario'
            });
        }

        // 7. Devolver las alergias del usuario
        return res.json({
            OK: true,
            usuario: {
                id: user.id
            },
            perfil: {
                alergias: perfil.alergias ?? [],
                has_completed_onboarding:
                    perfil.has_completed_onboarding
            }
        });

    } catch (error) {
        console.error('Error de autenticación:', error);

        return res.status(500).json({
            OK: false,
            error: 'Error interno al verificar la sesión'
        });
    }
});

app.get('/routes', (req, res) => {
    res.json({
        ok: true,
        mensaje: 'Backend activo'
    });
});

app.get(`/api/recomendar`, (req, res) => {
    res.json({
        ok: true,
        mensaje: 'GET recomendar funciona'
    });
});
``

app.get('/api/test', (req, res) => {
    console.log("✅ Entró a /api/test");

    res.json({
        ok: true,
        mensaje: "test funcionando"
    });
});
``

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
    console.log("🔥 Entró a /api/recomendar");
    console.log("📦 Body recibido:", req.body);

    try {
        const {
            ingredientes = [],
            tiempo = 30,
            alergias = []
        } = req.body;

        // -----------------------------
        // INGREDIENTES
        // -----------------------------

        const listaIngredientes = Array.isArray(ingredientes)
            ? ingredientes
            : [];

        const ingredientesProlog = listaIngredientes
            .map(ing => normalizarPrologAtom(ing))
            .join(',');


        // -----------------------------
        // ALERGIAS
        // -----------------------------

        const listaAlergias = Array.isArray(alergias)
            ? alergias
            : [];

        const alergiasProlog = listaAlergias
            .map(alergia => normalizarPrologAtom(alergia))
            .join(',');


        // -----------------------------
        // TIEMPO
        // -----------------------------

        const tiempoProlog = Number(tiempo);

        if (!Number.isFinite(tiempoProlog) || tiempoProlog <= 0) {
            return res.status(400).json({
                OK: false,
                error: 'Tiempo inválido'
            });
        }


        // -----------------------------
        // CONSULTA A PROLOG
        // -----------------------------

        const consulta =
            `recomendar_con_alergias(` +
            `[${alergiasProlog}], ` +
            `[${ingredientesProlog}], ` +
            `${tiempoProlog}, ` +
            `Recomendaciones).`;

        console.log(`🔎 Consulta Prolog: ${consulta}`);

        const resultadoRaw = await callProlog(consulta);

        console.log("📥 Resultado Prolog:", resultadoRaw);

        const listaRaw = resultadoRaw
            ? resultadoRaw.Recomendaciones
            : null;

        const recetasFormateadas = parsearListaProlog(listaRaw);

        res.json({
            OK: true,
            recetas: recetasFormateadas
        });

    } catch (error) {
        console.error(
            '❌ Error al procesar la recomendación:',
            error
        );

        res.status(500).json({
            OK: false,
            error: error.message
        });
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
// RECOMENDACIONES CON ALERGIAS E INGREDIENTES RECHAZADOS DESDE SUPABASE
// =====================================================

app.post('/api/recomendar-perfil', async (req, res) => {
    try {
        if (!supabase) {
            return res.status(503).json({
                OK: false,
                error: 'Supabase no está configurado'
            });
        }

        // 1. Obtener el token del usuario
        const authorization = req.headers.authorization;

        if (!authorization?.startsWith('Bearer ')) {
            return res.status(401).json({
                OK: false,
                error: 'Token no proporcionado'
            });
        }

        const token = authorization.substring(7);

        // 2. Verificar la identidad con Supabase
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return res.status(401).json({
                OK: false,
                error: 'Sesión inválida o expirada'
            });
        }

        // 3. Consultar el perfil respetando RLS
        const supabaseUsuario = createClient(
            SUPABASE_URL,
            SUPABASE_KEY,
            {
                global: { headers: { Authorization: `Bearer ${token}` } },
                auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
            }
        );

        // MODIFICADO: Incluimos la columna ingredientes_desagradables
        const { data: perfil, error: perfilError } = await supabaseUsuario
            .from('perfiles')
            .select('alergias, ingredientes_desagradables, has_completed_onboarding')
            .eq('id', user.id)
            .maybeSingle();

        if (perfilError) {
            return res.status(500).json({
                OK: false,
                error: 'Error al consultar el perfil'
            });
        }

        // 4. Mapeo flexible de equivalencias
        const equivalencias = {
            lacteos: ['leche'],
            lacteo: ['leche'],
            gluten: ['trigo'],
            mariscos: ['crustaceos', 'moluscos'],
            marisco: ['crustaceos', 'moluscos']
        };

        // MODIFICADO: Unimos alergias e ingredientes que no le gustan en un solo arreglo
        const alergiasGuardadas = perfil?.alergias || [];
        const ingredientesRechazados = perfil?.ingredientes_desagradables || [];

        const listaRestriccionesGuardadas = [
            ...(Array.isArray(alergiasGuardadas) ? alergiasGuardadas : []),
            ...(Array.isArray(ingredientesRechazados) ? ingredientesRechazados : [])
        ];

        const restriccionesTraducidas = [];

        for (const item of listaRestriccionesGuardadas) {
            if (typeof item === 'string') {
                const nombreLimpio = normalizarPrologAtom(item);
                const categorias = equivalencias[nombreLimpio] ?? [nombreLimpio];
                restriccionesTraducidas.push(...categorias);
            }
        }

        const restriccionesUnicas = [...new Set(restriccionesTraducidas)];

        // 5. Obtener ingredientes y tiempo enviados desde React
        const { ingredientes = [], tiempo = 30 } = req.body ?? {};

        const listaIngredientes = Array.isArray(ingredientes) ? ingredientes : [];
        if (listaIngredientes.length === 0) {
            return res.status(400).json({
                OK: false,
                error: 'Debes enviar una lista válida de ingredientes'
            });
        }

        const tiempoProlog = Number(tiempo) || 30;

        // 6. Preparar y ejecutar la consulta en Prolog
        const ingredientesProlog = listaIngredientes
            .map(i => normalizarPrologAtom(i))
            .join(',');

        const restriccionesProlog = restriccionesUnicas
            .map(a => normalizarPrologAtom(a))
            .join(',');

        const consulta = `recomendar_con_alergias([${restriccionesProlog}], [${ingredientesProlog}], ${tiempoProlog}, Recomendaciones).`;
        console.log(`🔎 Consulta Prolog (Perfil + Restricciones): ${consulta}`);

        const resultadoRaw = await callProlog(consulta);

        const recetasFormateadas = parsearListaProlog(
            resultadoRaw?.Recomendaciones
        );

        return res.json({
            OK: true,
            recetas: recetasFormateadas
        });

    } catch (error) {
        console.error('Error al recomendar:', error);

        return res.status(500).json({
            OK: false,
            error: 'No se pudieron generar recomendaciones'
        });
    }
});

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

const PORT = process.env.PORT || 3001;

app.listen(PORT, async() => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
    await inicializarProlog();
});
