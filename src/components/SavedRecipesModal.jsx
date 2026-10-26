import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { recipesDetailDb } from './recipesDetailDb';
import '../assets/recipechat.css';

// Función para limpiar llaves con caracteres extra o comillas
const sanitizarKey = (rawKey) => {
  if (!rawKey) return '';
  return String(rawKey)
    .replace(/[\[\]"'\\]/g, '') // Elimina [, ], ", ', \
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');      // Convierte espacios en _
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

      // Eliminar duplicados
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

      // Guardar el arreglo simple directamente en Supabase
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

        <h2>Mis Recetas Guardadas</h2>

        {loading ? (
          <p className="loading-text">Cargando tus recetas favoritas...</p>
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
                ingredientes: ['Consultar ingredientes en el recomendador'],
                pasos: ['Pasos no disponibles']
              };

              return (
                <div 
                  key={key} 
                  className="saved-recipe-item"
                  onClick={() => setSelectedRecipe({ ...info, key })}
                >
                  <div className="saved-recipe-info">
                    <strong style={{ textTransform: 'capitalize' }}>
                      {info.nombre || key.replace(/_/g, ' ')}
                    </strong>
                    <span>⏱ {info.tiempo}</span>
                  </div>
                  <button 
                    className="delete-saved-btn" 
                    onClick={(e) => handleRemoveRecipe(key, e)}
                    title="Eliminar de guardadas"
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* VISTA DETALLADA DE LA RECETA SELECCIONADA */}
        {selectedRecipe && (
          <div className="sub-recipe-detail-view">
            <button className="back-to-list-btn" onClick={() => setSelectedRecipe(null)}>
              ← Volver a la lista
            </button>
            <h3 style={{ textTransform: 'capitalize' }}>{selectedRecipe.nombre}</h3>
            <span className="recipe-time-badge">⏱ {selectedRecipe.tiempo}</span>

            <h4>Ingredientes</h4>
            <ul>
              {(selectedRecipe.ingredientes || []).map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>

            <h4>Pasos</h4>
            <ol>
              {(selectedRecipe.pasos || []).map((paso, idx) => (
                <li key={idx}>{paso}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}