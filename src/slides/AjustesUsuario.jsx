
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../assets/ajustesUsuario.css';

const ALERGIAS = [
  { id: 'cacahuate', nombre: 'Cacahuates / Frutos Secos' },
  { id: 'mariscos', nombre: 'Mariscos y Crustáceos' },
  { id: 'lacteos', nombre: 'Lácteos / Lactosa' },
  { id: 'gluten', nombre: 'Gluten / Trigo' },
  { id: 'huevo', nombre: 'Huevo' },
  { id: 'soya', nombre: 'Soya' },
  { id: 'pescado', nombre: 'Pescado' },
];

export default function AjustesUsuario({ onBack }) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [comensales, setComensales] = useState(1);
  const [preferencia, setPreferencia] = useState('');
  const [alergias, setAlergias] = useState([]);

  const [cargandoPerfil, setCargandoPerfil] = useState(true);
  const [errorPerfil, setErrorPerfil] = useState('');

  // ==========================================
  // 1. CARGAR PERFIL DESDE SUPABASE
  // ==========================================
  useEffect(() => {
    let activo = true;

    const cargarPerfil = async () => {
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          throw new Error('No se encontró una sesión activa.');
        }

        const { data: perfil, error } = await supabase
          .from('perfiles')
          .select(
            'nombre, apellido, comensales_habituales, preferencia_alimentaria, alergias'
          )
          .eq('id', user.id)
          .maybeSingle();

        if (error) throw error;

        if (!perfil) {
          throw new Error('No se encontró el perfil del usuario.');
        }

        if (!activo) return;

        setNombre(perfil.nombre ?? '');
        setApellido(perfil.apellido ?? '');
        setComensales(perfil.comensales_habituales ?? 1);
        setPreferencia(perfil.preferencia_alimentaria ?? '');
        setAlergias(perfil.alergias ?? []);

      } catch (error) {
        console.error('Error al cargar perfil:', error);

        if (activo) {
          setErrorPerfil(error.message);
        }
      } finally {
        if (activo) {
          setCargandoPerfil(false);
        }
      }
    };

    cargarPerfil();

    return () => {
      activo = false;
    };
  }, []);

  // ==========================================
  // 2. SELECCIONAR O QUITAR ALERGIAS
  // ==========================================
  const cambiarAlergia = (id) => {
    setAlergias((actuales) =>
      actuales.includes(id)
        ? actuales.filter((alergia) => alergia !== id)
        : [...actuales, id]
    );
  };

  // ==========================================
  // 3. INTERFAZ DE AJUSTES
  // ==========================================
  return (
    <div className="ajustes-page">
      <div className="ajustes-container">

        <button
          type="button"
          className="ajustes-volver"
          onClick={onBack}
        >
          ← Volver al Dashboard
        </button>

        <div className="ajustes-header">
          <h1>⚙️ Ajustes de Usuario</h1>
          <p>Personaliza tu experiencia en CookSmart.</p>
        </div>

        {cargandoPerfil && (
          <p>Cargando tus datos...</p>
        )}

        {errorPerfil && (
          <p style={{ color: '#c62828' }}>
            Error: {errorPerfil}
          </p>
        )}

        <section className="ajustes-seccion">
          <h2>Información personal</h2>

          <div className="ajustes-grid">
            <div className="ajustes-campo">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                type="text"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={cargandoPerfil || Boolean(errorPerfil)}
              />
            </div>

            <div className="ajustes-campo">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                type="text"
                placeholder="Tu apellido"
                value={apellido}
                onChange={(e) => setApellido(e.target.value)}
                disabled={cargandoPerfil || Boolean(errorPerfil)}
              />
            </div>
          </div>
        </section>

        <section className="ajustes-seccion">
          <h2>Preferencias culinarias</h2>

          <div className="ajustes-grid">
            <div className="ajustes-campo">
              <label htmlFor="comensales">
                ¿Para cuántas personas cocinas?
              </label>

              <select
                id="comensales"
                value={comensales}
                onChange={(e) =>
                  setComensales(Number(e.target.value))
                }
                disabled={cargandoPerfil || Boolean(errorPerfil)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((cantidad) => (
                  <option key={cantidad} value={cantidad}>
                    {cantidad} {cantidad === 1 ? 'persona' : 'personas'}
                  </option>
                ))}
              </select>
            </div>

            <div className="ajustes-campo">
              <label htmlFor="preferencia">
                Preferencia alimentaria
              </label>

              <select
                id="preferencia"
                value={preferencia}
                onChange={(e) => setPreferencia(e.target.value)}
                disabled={cargandoPerfil || Boolean(errorPerfil)}
              >
                <option value="">Sin preferencia</option>
                <option value="vegetariana">Vegetariana</option>
                <option value="pollo">Prefiero pollo</option>
                <option value="pescado">Prefiero pescado</option>
                <option value="variada">Comida variada</option>
              </select>
            </div>
          </div>
        </section>

        <section className="ajustes-seccion">
          <h2>Alergias y restricciones alimentarias</h2>

          <div className="ajustes-alergias">
            {ALERGIAS.map((alergia) => {
              const seleccionada = alergias.includes(alergia.id);

              return (
                <label
                  key={alergia.id}
                  className={`ajustes-alergia ${
                    seleccionada ? 'seleccionada' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={seleccionada}
                    onChange={() => cambiarAlergia(alergia.id)}
                    disabled={cargandoPerfil || Boolean(errorPerfil)}
                  />
                  <span>{alergia.nombre}</span>
                </label>
              );
            })}
          </div>
        </section>

        <button
          type="button"
          className="ajustes-guardar"
          disabled
        >
          Guardar cambios (próximamente)
        </button>

      </div>
    </div>
  );
}
