import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { recipesDetailDb } from './recipesDetailDb';
import '../assets/recipechat.css';

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

      // Validación estricta para asegurar que siempre sea un Arreglo (evita el error .map is not a function)
      if (Array.isArray(rawList)) {
        setSavedKeys(rawList);
      } else if (typeof rawList === 'string' && rawList.trim() !== '') {
        // Si Supabase devuelve la lista como formato texto literal de Postgres "{receta1,receta2}"
        const parsed = rawList
          .replace(/^\{|\}$/g, '')
          .split(',')
          .map(s => s.trim().replace(/^"|"$/g, ''))
          .filter(Boolean);
        setSavedKeys(parsed);
      } else {
        setSavedKeys([]);
      }
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

      const currentList = Array.isArray(savedKeys) ? savedKeys : [];
      const updated = currentList.filter(k => k !== keyToRemove);

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

  const safeSavedKeys = Array.isArray(savedKeys) ? savedKeys : [];

  return (
    <div className="recipe-detail-modal-overlay" onClick={onClose}>
      <div className="recipe-detail-modal-card saved-recipes-modal" onClick={e => e.stopPropagation()}>
        <button className="close-detail-modal-btn" onClick={onClose}>×</button>

        <h2>❤️ Mis Recetas Guardadas</h2>

        {loading ? (
          <p className="loading-text">Cargando tus recetas favoritas...</p>
        ) : safeSavedKeys.length === 0 ? (
          <div className="empty-saved-state">
            <p>Aún no has guardado ninguna receta.</p>
            <small>Usa el recomendador para buscar platillos y guardarlos aquí.</small>
          </div>
        ) : (
          <div className="saved-recipes-list">
            {safeSavedKeys.map(key => {
              const info = recipesDetailDb?.[key] || {
                nombre: String(key).replace(/_/g, ' '),
                tiempo: '30 min',
                ingredientes: [],
                pasos: []
              };

              return (
                <div 
                  key={key} 
                  className="saved-recipe-item"
                  onClick={() => setSelectedRecipe({ ...info, key })}
                >
                  <div className="saved-recipe-info">
                    <strong>{info.nombre}</strong>
                    <span>⏱ {info.tiempo}</span>
                  </div>
                  <button 
                    className="delete-saved-btn" 
                    onClick={(e) => handleRemoveRecipe(key, e)}
                    title="Eliminar de guardadas"
                  >
                    🗑️
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* SUB-MODAL DE DETALLE DE LA RECETA SELECCIONADA */}
        {selectedRecipe && (
          <div className="sub-recipe-detail-view">
            <button className="back-to-list-btn" onClick={() => setSelectedRecipe(null)}>
              ← Volver a la lista
            </button>
            <h3>{selectedRecipe.nombre}</h3>
            <span className="recipe-time-badge">⏱ {selectedRecipe.tiempo}</span>

            <h4>Ingredientes</h4>
            <ul>
              {(Array.isArray(selectedRecipe.ingredientes) ? selectedRecipe.ingredientes : []).map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>

            <h4>Pasos</h4>
            <ol>
              {(Array.isArray(selectedRecipe.pasos) ? selectedRecipe.pasos : []).map((paso, idx) => (
                <li key={idx}>{paso}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}