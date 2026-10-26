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
      if (!session) return;

      const { data, error } = await supabase
        .from('perfiles')
        .select('recetas_guardadas')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;
      setSavedKeys(data?.recetas_guardadas || []);
    } catch (err) {
      console.error('Error al cargar recetas guardadas:', err);
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
      <div className="recipe-detail-modal-card saved-recipes-modal" onClick={e => e.stopPropagation()}>
        <button className="close-detail-modal-btn" onClick={onClose}>×</button>

        <h2>❤️ Mis Recetas Guardadas</h2>

        {loading ? (
          <p className="loading-text">Cargando tus recetas favorited...</p>
        ) : savedKeys.length === 0 ? (
          <div className="empty-saved-state">
            <p>Aún no has guardado ninguna receta.</p>
            <small>Usa el recomendador para buscar platillos y guardarlos aquí.</small>
          </div>
        ) : (
          <div className="saved-recipes-list">
            {savedKeys.map(key => {
              const info = recipesDetailDb[key] || {
                nombre: key.replace(/_/g, ' '),
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
              {selectedRecipe.ingredientes.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>

            <h4>Pasos</h4>
            <ol>
              {selectedRecipe.pasos.map((paso, idx) => (
                <li key={idx}>{paso}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}