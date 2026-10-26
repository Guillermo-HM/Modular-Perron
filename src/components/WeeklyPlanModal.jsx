import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { recipesDetailDb } from './recipesDetailDb';
import '../assets/recipechat.css';

// Íconos SVG estilizados
const SVGClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SVGCalendar = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const SVGShoppingBag = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const SVGUtensils = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V2"></path>
    <path d="M12 2v20"></path>
    <path d="M18 11v11"></path>
    <path d="M6 11v11"></path>
  </svg>
);

const SVGHistory = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const SVGChevron = ({ open }) => (
  <svg 
    width="16" 
    height="16" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }}
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const SVGPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const SVGCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const SVGClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const SVGSparkles = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z"></path>
  </svg>
);

const SVGSave = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

const SVGArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const SVGArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const SVGBookOpen = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

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
  const [openSections, setOpenSections] = useState({ Proteinas: true });
  
  const [planGenerado, setPlanGenerado] = useState(null);
  const [planesPasados, setPlanesPasados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [planHistorialDetalle, setPlanHistorialDetalle] = useState(null);

  const [recipeDetailModal, setRecipeDetailModal] = useState(null);

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
      alert('Plan Semanal guardado con éxito en tu perfil.');
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
        
        {/* CABECERA */}
        <div className="plan-modal-header">
          <div>
            <span className="plan-header-badge">Organización</span>
            <h2>Plan Semanal de Menú</h2>
            <p className="plan-header-desc">
              Organiza tu alimentación semanal a partir de los ingredientes de tu despensa.
            </p>
          </div>
          <button className="plan-close-btn" onClick={onClose} aria-label="Cerrar modal">
            <SVGClose />
          </button>
        </div>

        {/* NAVEGACIÓN DE PESTAÑAS */}
        <div className="plan-tabs-bar">
          <button 
            type="button"
            className={`plan-tab-item ${paso === 1 ? 'active' : ''}`}
            onClick={() => setPaso(1)}
          >
            <SVGShoppingBag />
            <span>1. Despensa</span>
          </button>

          {planGenerado && (
            <button 
              type="button"
              className={`plan-tab-item ${paso === 2 ? 'active' : ''}`}
              onClick={() => setPaso(2)}
            >
              <SVGUtensils />
              <span>2. Menú Generado</span>
            </button>
          )}

          <button 
            type="button"
            className={`plan-tab-item ${paso === 3 ? 'active' : ''}`}
            onClick={() => setPaso(3)}
          >
            <SVGHistory />
            <span>Historial ({planesPasados.length})</span>
          </button>
        </div>

        {/* CUERPO PRINCIPAL CON SCROLL */}
        <div className="plan-modal-body">

          {/* PASO 1: SELECCIÓN DE DESPENSA */}
          {paso === 1 && (
            <div className="plan-step-container">
              <p className="plan-instruction-text">
                Selecciona los ingredientes disponibles en tu cocina o los que vas a comprar para armar tu menú optimizado:
              </p>

              {/* Resumen de ingredientes elegidos */}
              <div className="plan-summary-box">
                <div className="plan-summary-title">
                  <span>Ingredientes seleccionados</span>
                  <span className="plan-summary-count">{selectedIngredients.length}</span>
                </div>
                <div className="plan-pills-wrap">
                  {selectedIngredients.map(ing => (
                    <button 
                      key={ing} 
                      type="button" 
                      className="plan-selected-pill"
                      onClick={() => toggleIngredient(ing)}
                    >
                      <span>{ing.replace(/_/g, ' ')}</span>
                      <SVGClose />
                    </button>
                  ))}
                  {selectedIngredients.length === 0 && (
                    <span className="plan-empty-hint">Haz clic en los ingredientes de las categorías inferiores para agregarlos.</span>
                  )}
                </div>
              </div>

              {/* Acordeón de categorías */}
              <div className="plan-accordion-wrapper">
                {Object.keys(ingredientsDb).map(cat => {
                  const items = ingredientsDb[cat];
                  const countInCat = items.filter(i => selectedIngredients.includes(i)).length;
                  const isOpen = !!openSections[cat];

                  return (
                    <div key={cat} className={`plan-cat-card ${isOpen ? 'is-open' : ''}`}>
                      <button 
                        type="button" 
                        className="plan-cat-header" 
                        onClick={() => toggleSection(cat)}
                      >
                        <div className="plan-cat-title">
                          <span>{cat}</span>
                          {countInCat > 0 && (
                            <span className="plan-cat-badge">{countInCat}</span>
                          )}
                        </div>
                        <SVGChevron open={isOpen} />
                      </button>

                      {isOpen && (
                        <div className="plan-cat-content">
                          <div className="plan-ingredients-grid">
                            {items.map(ing => {
                              const isSelected = selectedIngredients.includes(ing);
                              return (
                                <button
                                  key={ing}
                                  type="button"
                                  className={`plan-chip-btn ${isSelected ? 'active-chip' : ''}`}
                                  onClick={() => toggleIngredient(ing)}
                                >
                                  <span className="chip-icon">
                                    {isSelected ? <SVGCheck /> : <SVGPlus />}
                                  </span>
                                  <span>{ing.replace(/_/g, ' ')}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Botón Acción */}
              <button 
                type="button"
                className="plan-primary-action-btn"
                onClick={handleGenerarPlan}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="plan-btn-spinner"></div>
                    <span>Evaluando recetas...</span>
                  </>
                ) : (
                  <>
                    <SVGSparkles />
                    <span>Generar Plan Semanal con esta Despensa</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* PASO 2: MENÚ GENERADO */}
          {paso === 2 && planGenerado && (
            <div className="plan-step-container">
              <div className="plan-generated-toolbar">
                <div>
                  <h3 className="plan-subheading">Plan Basado en tu Despensa</h3>
                  <span className="plan-meta-badge">
                    <SVGShoppingBag />
                    <span>{planGenerado.despensa.length} ingredientes considerados</span>
                  </span>
                </div>
                <button 
                  type="button"
                  className="plan-save-db-btn" 
                  onClick={handleGuardarPlan}
                  disabled={saving}
                >
                  <SVGSave />
                  <span>{saving ? 'Guardando...' : 'Guardar Plan'}</span>
                </button>
              </div>

              <div className="plan-days-grid">
                {DIAS_SEMANA.map(({ key, label }) => {
                  const item = planGenerado.menu[key];
                  return (
                    <div 
                      key={key} 
                      className="plan-day-card"
                      onClick={() => handleOpenRecipeDetail(item)}
                    >
                      <div className="plan-day-card-header">
                        <span className="plan-day-label">{label}</span>
                        <span className="plan-match-pill">
                          {item.coincidencia}% coincidencia
                        </span>
                      </div>

                      <div className="plan-day-recipe-name">
                        {item.nombre}
                      </div>

                      <div className="plan-day-card-footer">
                        <span className="plan-time-meta">
                          <SVGClock />
                          <span>{item.tiempo}</span>
                        </span>
                        <span className="plan-view-recipe-link">
                          <SVGBookOpen />
                          <span>Ver Receta</span>
                          <SVGArrowRight />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                type="button"
                className="plan-secondary-back-btn" 
                onClick={() => setPaso(1)}
              >
                <SVGArrowLeft />
                <span>Modificar ingredientes de la despensa</span>
              </button>
            </div>
          )}

          {/* PASO 3: HISTORIAL */}
          {paso === 3 && (
            <div className="plan-step-container">
              {planHistorialDetalle ? (
                <div className="plan-history-detail">
                  <button 
                    type="button"
                    className="plan-history-back-link" 
                    onClick={() => setPlanHistorialDetalle(null)}
                  >
                    <SVGArrowLeft />
                    <span>Volver al historial</span>
                  </button>

                  <div className="plan-history-detail-header">
                    <h3 className="plan-subheading">Plan del {planHistorialDetalle.fechaCreacion || 'Anterior'}</h3>
                    <p className="plan-history-pantry-text">
                      <strong>Despensa usada:</strong> {planHistorialDetalle.despensa?.map(i => i.replace(/_/g, ' ')).join(', ')}
                    </p>
                  </div>

                  <div className="plan-days-grid">
                    {DIAS_SEMANA.map(({ key, label }) => {
                      const item = planHistorialDetalle.menu?.[key] || { nombre: 'Sin registrar', coincidencia: 0 };
                      return (
                        <div 
                          key={key} 
                          className="plan-day-card"
                          onClick={() => handleOpenRecipeDetail(item)}
                        >
                          <div className="plan-day-card-header">
                            <span className="plan-day-label">{label}</span>
                            <span className="plan-match-pill">{item.coincidencia}% coincidencia</span>
                          </div>
                          <div className="plan-day-recipe-name">{item.nombre}</div>
                          <div className="plan-day-card-footer">
                            <span className="plan-view-recipe-link">
                              <SVGBookOpen />
                              <span>Ver Receta</span>
                              <SVGArrowRight />
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : planesPasados.length === 0 ? (
                <div className="plan-empty-history-state">
                  <div className="plan-empty-icon-wrap">
                    <SVGHistory />
                  </div>
                  <h4>No hay planes guardados</h4>
                  <p>Genera un plan a partir de tu despensa y guárdalo para poder consultarlo en esta sección.</p>
                </div>
              ) : (
                <div className="plan-history-list">
                  {planesPasados.map((plan, idx) => (
                    <div 
                      key={idx} 
                      className="plan-history-item-card"
                      onClick={() => setPlanHistorialDetalle(plan)}
                    >
                      <div className="plan-history-item-info">
                        <strong>Plan Semanal #{planesPasados.length - idx}</strong>
                        <span>
                          <SVGCalendar />
                          <span>Generado el {plan.fechaCreacion || 'Recientemente'} ({plan.despensa?.length || 0} ingredientes)</span>
                        </span>
                      </div>
                      <span className="plan-history-arrow">
                        <SVGArrowRight />
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* MODAL SOBREPUESTO DE DETALLE DE RECETA */}
        {recipeDetailModal && (
          <div className="recipe-detail-modal-overlay inner-detail-overlay" onClick={() => setRecipeDetailModal(null)}>
            <div className="recipe-detail-modal-card plan-inner-recipe-card" onClick={e => e.stopPropagation()}>
              
              <div className="plan-inner-header">
                <div>
                  <span className="plan-header-badge">Detalle de Receta</span>
                  <h2>{recipeDetailModal.nombre}</h2>
                  <div className="plan-inner-meta-row">
                    <span className="plan-inner-badge">
                      <SVGClock />
                      <span>{recipeDetailModal.tiempo}</span>
                    </span>
                    {recipeDetailModal.coincidencia !== undefined && (
                      <span className="plan-inner-badge highlight">
                        <span>{recipeDetailModal.coincidencia}% coincidencia</span>
                      </span>
                    )}
                  </div>
                </div>
                <button 
                  type="button"
                  className="plan-close-btn" 
                  onClick={() => setRecipeDetailModal(null)}
                >
                  <SVGClose />
                </button>
              </div>

              <div className="plan-inner-body">
                <section className="plan-recipe-section">
                  <h3>Ingredientes necesarios</h3>
                  <ul className="plan-ingredients-bullet-list">
                    {(recipeDetailModal.ingredientes || []).map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </section>

                <section className="plan-recipe-section">
                  <h3>Pasos de preparación</h3>
                  <ol className="plan-steps-numbered-list">
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