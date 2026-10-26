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

const SVGBookmark = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
  </svg>
);

const SVGClock = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const SVGTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const SVGArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

const SVGArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const SVGBookOpen = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
  </svg>
);

const SVGUtensils = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2v6a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V2"></path>
    <path d="M12 2v20"></path>
    <path d="M18 11v11"></path>
    <path d="M6 11v11"></path>
  </svg>
);

// Función para limpiar llaves con caracteres extra o comillas
const sanitizarKey = (rawKey) => {
  if (!rawKey) return '';
  return String(rawKey)
    .replace(/[\[\]"'\\]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
};

export function SavedRecipesModal({ onClose }) {
  const [savedKeys, setSavedKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('perfiles')
        .select('recetas_guardadas')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      let rawList = data?.recetas_guardadas;
      let keysProcesadas = [];

      if (Array.isArray(rawList)) {
        keysProcesadas = rawList.map(sanitizarKey).filter(Boolean);
      } else if (typeof rawList === 'string' && rawList.trim() !== '') {
        keysProcesadas = rawList
          .replace(/^\{|\}$/g, '')
          .split(',')
          .map(sanitizarKey)
          .filter(Boolean);
      }

      const keysUnicas = [...new Set(keysProcesadas)];
      setSavedKeys(keysUnicas);

    } catch (err) {
      console.error('Error al cargar recetas guardadas:', err);
      setSavedKeys([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveRecipe = async (keyToRemove, e) => {
    e.stopPropagation();
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const updated = savedKeys.filter(k => k !== keyToRemove);

      const { error } = await supabase
        .from('perfiles')
        .update({ recetas_guardadas: updated })
        .eq('id', session.user.id);

      if (error) throw error;
      setSavedKeys(updated);

      if (selectedRecipe?.key === keyToRemove) {
        setSelectedRecipe(null);
      }
    } catch (err) {
      console.error('Error al eliminar receta:', err);
      alert('No se pudo borrar la receta de guardadas.');
    }
  };

  return (
    <div className="recipe-detail-modal-overlay" onClick={onClose}>
      <div className="recipe-detail-modal-card saved-modal-card" onClick={e => e.stopPropagation()}>
        
        {/* CABECERA */}
        <div className="saved-modal-header">
          <div>
            <span className="saved-header-badge">Favoritos</span>
            <h2>Mis Recetas Guardadas</h2>
            <p className="saved-header-desc">
              Accede a tu colección personal de platillos guardados y consulta sus ingredientes y modos de preparación.
            </p>
          </div>
          <button className="saved-close-btn" onClick={onClose} aria-label="Cerrar modal">
            <SVGClose />
          </button>
        </div>

        {/* CUERPO DEL MODAL */}
        <div className="saved-modal-body">
          {loading ? (
            <div className="saved-loading-state">
              <div className="saved-spinner"></div>
              <span>Cargando tus recetas favoritas...</span>
            </div>
          ) : selectedRecipe ? (
            
            /* VISTA DETALLADA DE LA RECETA SELECCIONADA */
            <div className="saved-detail-container">
              <button 
                type="button" 
                className="saved-back-link" 
                onClick={() => setSelectedRecipe(null)}
              >
                <SVGArrowLeft />
                <span>Volver a la lista de guardadas</span>
              </button>

              <div className="saved-detail-header-row">
                <div>
                  <h3 className="saved-detail-title">{selectedRecipe.nombre}</h3>
                  <span className="saved-time-meta">
                    <SVGClock />
                    <span>{selectedRecipe.tiempo}</span>
                  </span>
                </div>
              </div>

              <div className="saved-sections-wrapper">
                <section className="saved-detail-section">
                  <div className="saved-section-title">
                    <SVGUtensils />
                    <h4>Ingredientes necesarios</h4>
                  </div>
                  <ul className="saved-ingredients-list">
                    {(selectedRecipe.ingredientes || []).map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </section>

                <section className="saved-detail-section">
                  <div className="saved-section-title">
                    <SVGBookOpen />
                    <h4>Pasos de preparación</h4>
                  </div>
                  <ol className="saved-steps-list">
                    {(selectedRecipe.pasos || []).map((paso, idx) => (
                      <li key={idx}>{paso}</li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>

          ) : savedKeys.length === 0 ? (

            /* ESTADO VACÍO */
            <div className="saved-empty-state">
              <div className="saved-empty-icon-wrap">
                <SVGBookmark />
              </div>
              <h4>Aún no has guardado ninguna receta</h4>
              <p>Genera recomendaciones desde el recomendador o tu plan semanal y presiona "Guardar" para conservarlas en este catálogo.</p>
            </div>

          ) : (

            /* LISTA DE TARJETAS DE RECETAS GUARDADAS */
            <div className="saved-recipes-grid">
              {savedKeys.map(key => {
                const info = recipesDetailDb[key] || {
                  nombre: key.replace(/_/g, ' '),
                  tiempo: '30 min',
                  ingredientes: ['Consultar ingredientes en el recomendador'],
                  pasos: ['Pasos no disponibles']
                };

                return (
                  <div 
                    key={key} 
                    className="saved-recipe-card"
                    onClick={() => setSelectedRecipe({ ...info, key })}
                  >
                    <div className="saved-card-main-info">
                      <strong className="saved-recipe-name">
                        {info.nombre || key.replace(/_/g, ' ')}
                      </strong>
                      <span className="saved-time-pill">
                        <SVGClock />
                        <span>{info.tiempo}</span>
                      </span>
                    </div>

                    <div className="saved-card-actions">
                      <span className="saved-view-link">
                        <span>Ver receta</span>
                        <SVGArrowRight />
                      </span>

                      <button 
                        type="button"
                        className="saved-delete-btn" 
                        onClick={(e) => handleRemoveRecipe(key, e)}
                        title="Eliminar de guardadas"
                        aria-label="Eliminar receta guardada"
                      >
                        <SVGTrash />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          )}
        </div>

      </div>
    </div>
  );
}