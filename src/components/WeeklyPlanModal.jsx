import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { recipesDetailDb } from './recipesDetailDb';
import '../assets/recipechat.css';

const DIAS_SEMANA = [
  { key: 'lunes', label: 'Lunes' },
  { key: 'martes', label: 'Martes' },
  { key: 'miercoles', label: 'Miércoles' },
  { key: 'jueves', label: 'Jueves' },
  { key: 'viernes', label: 'Viernes' },
  { key: 'sabado', label: 'Sábado' },
  { key: 'domingo', label: 'Domingo' }
];

export function WeeklyPlanModal({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [planes, setPlanes] = useState([]);
  const [vista, setVista] = useState('actual'); // 'actual' | 'historial'
  const [planSeleccionadoHistorial, setPlanSeleccionadoHistorial] = useState(null);
  const [editandoDia, setEditandoDia] = useState(null); // Para cambiar platillo de un día

  useEffect(() => {
    fetchPlanSemanal();
  }, []);

  const fetchPlanSemanal = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('perfiles')
        .select('plan_semanal')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      const rawPlanes = Array.isArray(data?.plan_semanal) ? data.plan_semanal : [];
      setPlanes(rawPlanes);
    } catch (err) {
      console.error('Error al cargar plan semanal:', err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener la semana activa (si no existe, crea una plantilla por defecto)
  const planActual = planes.find(p => p.es_actual) || {
    id: Date.now(),
    titulo: 'Semana Actual',
    rango: '19 Oct - 25 Oct',
    es_actual: true,
    menu: {
      lunes: 'tacos_pollo_caseros',
      martes: 'ceviche_pescado',
      miercoles: 'quesadillas_champinones',
      jueves: 'lomo_cerdo_mostaza',
      viernes: 'ensalada_pollo',
      sabado: 'carne_res_verduras',
      domingo: 'tacos_pollo_caseros'
    }
  };

  const planesPasados = planes.filter(p => !p.es_actual);

  // Actualizar un platillo en el plan actual
  const handleCambiarPlatillo = async (diaKey, nuevaRecetaKey) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const menuActualizado = {
        ...planActual.menu,
        [diaKey]: nuevaRecetaKey
      };

      const planActualizado = { ...planActual, menu: menuActualizado };

      const existeActual = planes.some(p => p.es_actual);
      let nuevosPlanes = [];

      if (existeActual) {
        nuevosPlanes = planes.map(p => p.es_actual ? planActualizado : p);
      } else {
        nuevosPlanes = [planActualizado, ...planes];
      }

      const { error } = await supabase
        .from('perfiles')
        .update({ plan_semanal: nuevosPlanes })
        .eq('id', session.user.id);

      if (error) throw error;

      setPlanes(nuevosPlanes);
      setEditandoDia(null);
    } catch (err) {
      console.error('Error al actualizar día:', err);
      alert('No se pudo actualizar el menú.');
    }
  };

  // Archivar la semana actual y dar paso a una nueva
  const handleArchivarSemanaActual = async () => {
    if (!confirm('¿Deseas archivar la semana actual y moverla al historial?')) return;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const planArchivado = {
        ...planActual,
        es_actual: false,
        titulo: `Plan ${planActual.rango || 'Anterior'}`
      };

      const nuevosPlanes = planes.map(p => p.es_actual ? planArchivado : p);

      const { error } = await supabase
        .from('perfiles')
        .update({ plan_semanal: nuevosPlanes })
        .eq('id', session.user.id);

      if (error) throw error;

      setPlanes(nuevosPlanes);
      alert('¡Semana archivada en el historial correctamente!');
    } catch (err) {
      console.error('Error al archivar semana:', err);
    }
  };

  return (
    <div className="recipe-detail-modal-overlay" onClick={onClose}>
      <div className="recipe-detail-modal-card plan-semanal-modal" onClick={e => e.stopPropagation()}>
        <button className="close-detail-modal-btn" onClick={onClose}>×</button>

        <h2>📅 Plan Semanal de Menú</h2>

        {/* NAVEGACIÓN ENTRE VISTAS */}
        <div className="plan-tab-buttons">
          <button 
            className={`plan-tab-btn ${vista === 'actual' ? 'active' : ''}`}
            onClick={() => { setVista('actual'); setPlanSeleccionadoHistorial(null); }}
          >
            Semana Actual
          </button>
          <button 
            className={`plan-tab-btn ${vista === 'historial' ? 'active' : ''}`}
            onClick={() => setVista('historial')}
          >
            Historial ({planesPasados.length})
          </button>
        </div>

        {loading ? (
          <p className="loading-text">Cargando tu plan nutricional...</p>
        ) : vista === 'actual' ? (
          /* VISTA DE LA SEMANA ACTUAL */
          <div className="plan-actual-container">
            <div className="plan-header-info">
              <div>
                <h3>{planActual.titulo}</h3>
                <span className="plan-date-badge">🗓️ {planActual.rango}</span>
              </div>
              <button className="archive-plan-btn" onClick={handleArchivarSemanaActual}>
                📁 Archivar Semana
              </button>
            </div>

            <div className="days-grid-list">
              {DIAS_SEMANA.map(({ key, label }) => {
                const recetaKey = planActual.menu?.[key];
                const recetaInfo = recipesDetailDb[recetaKey] || {
                  nombre: recetaKey ? recetaKey.replace(/_/g, ' ') : 'Sin asignar',
                  tiempo: '30 min'
                };

                return (
                  <div key={key} className="day-card-item">
                    <div className="day-header">
                      <strong>{label}</strong>
                      <span>⏱ {recetaInfo.tiempo}</span>
                    </div>

                    <div className="day-recipe-name">
                      <span style={{ textTransform: 'capitalize' }}>
                        {recetaInfo.nombre}
                      </span>
                    </div>

                    {editandoDia === key ? (
                      <div className="change-recipe-selector">
                        <select 
                          defaultValue={recetaKey || ''}
                          onChange={(e) => handleCambiarPlatillo(key, e.target.value)}
                        >
                          <option value="" disabled>Selecciona una receta...</option>
                          {Object.keys(recipesDetailDb).map(rKey => (
                            <option key={rKey} value={rKey}>
                              {recipesDetailDb[rKey].nombre}
                            </option>
                          ))}
                        </select>
                        <button className="cancel-edit-btn" onClick={() => setEditandoDia(null)}>Cancelar</button>
                      </div>
                    ) : (
                      <button className="edit-day-btn" onClick={() => setEditandoDia(key)}>
                        ✏️ Cambiar
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* VISTA DE HISTORIAL DE PLANES PASADOS */
          <div className="plan-historial-container">
            {planSeleccionadoHistorial ? (
              <div className="past-plan-detail">
                <button className="back-to-list-btn" onClick={() => setPlanSeleccionadoHistorial(null)}>
                  ← Volver a lista de historial
                </button>
                <h3>{planSeleccionadoHistorial.titulo}</h3>
                <span className="plan-date-badge">🗓️ {planSeleccionadoHistorial.rango}</span>

                <div className="days-grid-list" style={{ marginTop: '14px' }}>
                  {DIAS_SEMANA.map(({ key, label }) => {
                    const rKey = planSeleccionadoHistorial.menu?.[key];
                    const info = recipesDetailDb[rKey] || { nombre: rKey ? rKey.replace(/_/g, ' ') : 'Sin asignar' };
                    return (
                      <div key={key} className="day-card-item readonly">
                        <strong>{label}</strong>
                        <span style={{ textTransform: 'capitalize', display: 'block', marginTop: '4px' }}>
                          {info.nombre}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : planesPasados.length === 0 ? (
              <div className="empty-saved-state">
                <p>Aún no tienes planes semanales archivados.</p>
                <small>Cuando termine tu semana, presiona "Archivar Semana" para guardarla aquí.</small>
              </div>
            ) : (
              <div className="history-plans-list">
                {planesPasados.map((plan, index) => (
                  <div 
                    key={index} 
                    className="history-plan-item"
                    onClick={() => setPlanSeleccionadoHistorial(plan)}
                  >
                    <div>
                      <strong>{plan.titulo || `Plan Semanal #${index + 1}`}</strong>
                      <span>🗓️ {plan.rango || 'Fecha no registrada'}</span>
                    </div>
                    <span className="arrow-icon">➔</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}