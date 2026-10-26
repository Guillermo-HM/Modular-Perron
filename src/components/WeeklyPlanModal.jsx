import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { recipesDetailDb } from './recipesDetailDb';
import '../assets/recipechat.css';

// Base de ingredientes organizados por categorías
const ingredientsDb = {
  Proteinas: ['pollo', 'pechuga_pollo', 'carne_res', 'lomo_cerdo', 'cerdo', 'pescado_blanco', 'salmon', 'huevo'],
  Vegetales: ['cebolla', 'cebolla_morada', 'ajo', 'pimiento_morron', 'chile_serrano', 'brocoli', 'zanahoria', 'tomate', 'pepino', 'calabacita', 'lechuga_romana'],
  'Cereales y derivados': ['tortilla_maiz', 'tostadas_maiz', 'pasta', 'arroz_blanco_cocido', 'maiz', 'crutones'],
  Frutas: ['limon', 'jugo_limon', 'jugo_naranja', 'aguacate'],
  Hongos: ['champinones'],
  Leguminosas: ['garbanzos_cocidos', 'chicharos'],
  Lacteos: ['queso_fresco', 'media_crema', 'leche', 'mantequilla', 'queso_parmesano', 'yogurt_natural', 'queso_oaxaca', 'queso_panela'],
  'Grasas y aceites': ['aceite_vegetal', 'aceite_oliva', 'aceite_sesamo'],
  Hierbas: ['cilantro', 'perejil', 'epazote', 'cebollin', 'jengibre_fresco'],
  Condimentos: ['sal', 'pimienta', 'oregano', 'comino', 'nuez_moscada', 'paprika', 'ajo_en_polvo'],
  Salsas: ['salsa_verde', 'salsa_soya', 'mostaza']
};

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
  const [paso, setPaso] = useState(1); // 1: Despensa, 2: Plan Generado, 3: Historial
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [openSections, setOpenSections] = useState({ Proteinas: true, Vegetales: true });
  
  const [planGenerado, setPlanGenerado] = useState(null);
  const [planesPasados, setPlanesPasados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [planHistorialDetalle, setPlanHistorialDetalle] = useState(null);

  // ESTADO PARA ABRIR EL MODAL DE PREPARACIÓN DE LA RECETA
  const [recipeDetailModal, setRecipeDetailModal] = useState(null);

  // Cargar historial de planes guardados desde Supabase
  useEffect(() => {
    fetchHistorialPlanes();
  }, []);

  const fetchHistorialPlanes = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('perfiles')
        .select('plan_semanal')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (Array.isArray(data?.plan_semanal)) {
        setPlanesPasados(data.plan_semanal);
      }
    } catch (err) {
      console.error('Error al cargar historial de planes:', err);
    }
  };

  const toggleIngredient = (ing) => {
    setSelectedIngredients(prev => 
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const toggleSection = (cat) => {
    setOpenSections(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const calcularCoincidencia = (recetaIngredientes) => {
    if (!recetaIngredientes || recetaIngredientes.length === 0) return 0;
    const despensaLimpia = selectedIngredients.map(i => i.toLowerCase().replace(/_/g, ' '));
    
    let coincidencias = 0;
    recetaIngredientes.forEach(ing => {
      const ingLimpio = ing.toLowerCase().replace(/_/g, ' ');
      const coincide = despensaLimpia.some(d => ingLimpio.includes(d) || d.includes(ingLimpio));
      if (coincide) coincidencias++;
    });

    return Math.round((coincidencias / recetaIngredientes.length) * 100);
  };

  const handleGenerarPlan = () => {
    if (selectedIngredients.length === 0) {
      alert('Por favor selecciona al menos algunos ingredientes para tu despensa semanal.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const recetasEvaluadas = Object.keys(recipesDetailDb).map(key => {
        const receta = recipesDetailDb[key];
        const score = calcularCoincidencia(receta.ingredientes);
        return {
          key,
          nombre: receta.nombre,
          tiempo: receta.tiempo,
          coincidencia: score
        };
      });

      recetasEvaluadas.sort((a, b) => b.coincidencia - a.coincidencia);

      const menuSemanal = {};
      DIAS_SEMANA.forEach(({ key: diaKey }, index) => {
        const recetaElegida = recetasEvaluadas[index % recetasEvaluadas.length] || {
          key: 'generica',
          nombre: 'Platillo a la carta',
          tiempo: '30 min',
          coincidencia: 50
        };

        menuSemanal[diaKey] = recetaElegida;
      });

      setPlanGenerado({
        id: Date.now(),
        fechaCreacion: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }),
        despensa: [...selectedIngredients],
        menu: menuSemanal
      });

      setLoading(false);
      setPaso(2);
    }, 400);
  };

  // Abre el modal con la receta completa (Ingredientes y Pasos)
  const handleOpenRecipeDetail = (item) => {
    const rawKey = item.key || String(item.nombre || '').toLowerCase().trim().replace(/\s+/g, '_');
    const detailData = recipesDetailDb[rawKey] || {
      nombre: item.nombre || 'Receta Especial',
      tiempo: item.tiempo || '30 min',
      ingredientes: ['Ingredientes seleccionados de tu despensa'],
      pasos: [
        'Organizar e inspeccionar los ingredientes.',
        'Sazonar y cocinar los ingredientes a fuego medio.',
        'Servir caliente y disfrutar.'
      ]
    };

    setRecipeDetailModal({
      ...detailData,
      coincidencia: item.coincidencia
    });
  };

  const handleGuardarPlan = async () => {
    if (!planGenerado) return;

    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Debes iniciar sesión para guardar tu plan semanal.');
        return;
      }

      const nuevoHistorial = [planGenerado, ...planesPasados];

      const { error } = await supabase
        .from('perfiles')
        .update({ plan_semanal: nuevoHistorial })
        .eq('id', session.user.id);

      if (error) throw error;

      setPlanesPasados(nuevoHistorial);
      alert('¡Plan Semanal guardado con éxito en tu perfil!');
    } catch (err) {
      console.error('Error al guardar el plan:', err);
      alert('Ocurrió un error al guardar el plan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="recipe-detail-modal-overlay" onClick={onClose}>
      <div className="recipe-detail-modal-card plan-semanal-modal" onClick={e => e.stopPropagation()}>
        <button className="close-detail-modal-btn" onClick={onClose}>×</button>

        <h2>📅 Plan Semanal de Menú</h2>

        {/* NAVEGACIÓN SUPERIOR */}
        <div className="plan-tab-buttons">
          <button 
            className={`plan-tab-btn ${paso === 1 ? 'active' : ''}`}
            onClick={() => setPaso(1)}
          >
            🛒 1. Seleccionar Despensa
          </button>
          {planGenerado && (
            <button 
              className={`plan-tab-btn ${paso === 2 ? 'active' : ''}`}
              onClick={() => setPaso(2)}
            >
              🥗 2. Menú Generado
            </button>
          )}
          <button 
            className={`plan-tab-btn ${paso === 3 ? 'active' : ''}`}
            onClick={() => setPaso(3)}
          >
            📁 Historial ({planesPasados.length})
          </button>
        </div>

        {/* PASO 1: SELECCIONAR INGREDIENTES */}
        {paso === 1 && (
          <div className="pantry-selection-step">
            <p className="pantry-instruction">
              Selecciona los ingredientes que planeas comprar para tu despensa de la semana. Armaremos tu menú optimizando estas opciones:
            </p>

            <div className="pantry-selected-summary">
              <strong>Ingredientes elegidos ({selectedIngredients.length}):</strong>
              <div className="pantry-pills-wrap">
                {selectedIngredients.map(ing => (
                  <span key={ing} className="pantry-pill active" onClick={() => toggleIngredient(ing)}>
                    {ing.replace(/_/g, ' ')} ×
                  </span>
                ))}
                {selectedIngredients.length === 0 && (
                  <em style={{ fontSize: '0.85rem', color: '#888' }}>Haz clic en los ingredientes de abajo para agregarlos.</em>
                )}
              </div>
            </div>

            <div className="pantry-categories-accordion">
              {Object.keys(ingredientsDb).map(cat => (
                <div key={cat} className="pantry-cat-group">
                  <button className="pantry-cat-trigger" onClick={() => toggleSection(cat)}>
                    {cat} <span>{openSections[cat] ? '▲' : '▼'}</span>
                  </button>
                  {openSections[cat] && (
                    <div className="pantry-items-grid">
                      {ingredientsDb[cat].map(ing => {
                        const isSelected = selectedIngredients.includes(ing);
                        return (
                          <button
                            key={ing}
                            className={`pantry-item-btn ${isSelected ? 'selected' : ''}`}
                            onClick={() => toggleIngredient(ing)}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {ing.replace(/_/g, ' ')}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button 
              className="generate-plan-action-btn"
              onClick={handleGenerarPlan}
              disabled={loading}
            >
              {loading ? 'Evaluando coincidencia de recetas... 🍳' : '✨ Generar Plan Semanal con esta Despensa'}
            </button>
          </div>
        )}

        {/* PASO 2: VISTA DEL PLAN GENERADO (TARJETAS CLIQUEABLES) */}
        {paso === 2 && planGenerado && (
          <div className="plan-generated-step">
            <div className="plan-header-info">
              <div>
                <h3>Plan Basado en tu Despensa</h3>
                <span className="plan-date-badge">🛒 {planGenerado.despensa.length} ingredientes considerados</span>
              </div>
              <button 
                className="save-plan-db-btn" 
                onClick={handleGuardarPlan}
                disabled={saving}
              >
                {saving ? 'Guardando...' : '💾 Guardar Plan en Perfil'}
              </button>
            </div>

            <div className="days-grid-list">
              {DIAS_SEMANA.map(({ key, label }) => {
                const item = planGenerado.menu[key];
                return (
                  <div 
                    key={key} 
                    className="day-card-item clickable-day-card"
                    onClick={() => handleOpenRecipeDetail(item)}
                    title="Haz clic para ver la receta completa"
                  >
                    <div className="day-header">
                      <strong>{label}</strong>
                      <span className="match-score-badge">
                        Coincidencia: {item.coincidencia}%
                      </span>
                    </div>

                    <div className="day-recipe-name-row">
                      <span className="day-recipe-title">
                        {item.nombre}
                      </span>
                      <span className="open-detail-arrow">📖 Ver Receta ➔</span>
                    </div>

                    <div className="day-recipe-footer">
                      <span>⏱ {item.tiempo}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button className="back-to-pantry-btn" onClick={() => setPaso(1)}>
              ← Modificar ingredientes de la despensa
            </button>
          </div>
        )}

        {/* PASO 3: HISTORIAL DE PLANES PASADOS */}
        {paso === 3 && (
          <div className="plan-historial-container">
            {planHistorialDetalle ? (
              <div className="past-plan-detail">
                <button className="back-to-list-btn" onClick={() => setPlanHistorialDetalle(null)}>
                  ← Volver a lista de historial
                </button>
                <h3>Plan del {planHistorialDetalle.fechaCreacion || 'Anterior'}</h3>
                <small>Despensa: {planHistorialDetalle.despensa?.map(i => i.replace(/_/g, ' ')).join(', ')}</small>

                <div className="days-grid-list" style={{ marginTop: '14px' }}>
                  {DIAS_SEMANA.map(({ key, label }) => {
                    const item = planHistorialDetalle.menu?.[key] || { nombre: 'Sin registrar', coincidencia: 0 };
                    return (
                      <div 
                        key={key} 
                        className="day-card-item clickable-day-card"
                        onClick={() => handleOpenRecipeDetail(item)}
                      >
                        <div className="day-header">
                          <strong>{label}</strong>
                          <span className="match-score-badge">{item.coincidencia}% Coincidencia</span>
                        </div>
                        <div className="day-recipe-name-row">
                          <span className="day-recipe-title">{item.nombre}</span>
                          <span className="open-detail-arrow">📖 ➔</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : planesPasados.length === 0 ? (
              <div className="empty-saved-state">
                <p>Aún no has guardado ningún plan semanal.</p>
                <small>Genera un plan con tu despensa y presiona "Guardar Plan en Perfil" para archivarlo aquí.</small>
              </div>
            ) : (
              <div className="history-plans-list">
                {planesPasados.map((plan, idx) => (
                  <div 
                    key={idx} 
                    className="history-plan-item"
                    onClick={() => setPlanHistorialDetalle(plan)}
                  >
                    <div>
                      <strong>Plan Semanal #{planesPasados.length - idx}</strong>
                      <span>🗓️ Generado el {plan.fechaCreacion || 'Recientemente'} ({plan.despensa?.length || 0} ingredientes)</span>
                    </div>
                    <span className="arrow-icon">➔</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MODAL SOBREPUESTO DE DETALLE DE RECETA Y PREPARACIÓN */}
        {recipeDetailModal && (
          <div className="recipe-detail-modal-overlay inner-detail-overlay" onClick={() => setRecipeDetailModal(null)}>
            <div className="recipe-detail-modal-card" onClick={e => e.stopPropagation()}>
              <button 
                className="close-detail-modal-btn" 
                onClick={() => setRecipeDetailModal(null)}
              >
                ×
              </button>

              <div className="recipe-detail-header">
                <h2>{recipeDetailModal.nombre}</h2>
                <div className="recipe-detail-badges">
                  <span className="recipe-time-badge">⏱ {recipeDetailModal.tiempo}</span>
                  {recipeDetailModal.coincidencia !== undefined && (
                    <span className="recipe-score-badge">Coincidencia: {recipeDetailModal.coincidencia}%</span>
                  )}
                </div>
              </div>

              <div className="recipe-detail-body">
                <section className="recipe-section">
                  <h3>Ingredientes necesarios</h3>
                  <ul className="recipe-ingredients-list">
                    {(recipeDetailModal.ingredientes || []).map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </section>

                <section className="recipe-section">
                  <h3>Pasos de preparación</h3>
                  <ol className="recipe-steps-list">
                    {(recipeDetailModal.pasos || []).map((pasoText, idx) => (
                      <li key={idx}>{pasoText}</li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}