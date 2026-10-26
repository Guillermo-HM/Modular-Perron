import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../assets/recipechat.css';

// Base de alérgenos principales
const ALERGENOS_BASE = [
  { key: 'lacteos', label: 'Lácteos (Leche, Queso, Mantequilla)' },
  { key: 'gluten', label: 'Gluten / Trigo' },
  { key: 'huevo', label: 'Huevo' },
  { key: 'pescado', label: 'Pescado' },
  { key: 'mariscos', label: 'Mariscos y Crustáceos' },
  { key: 'soya', label: 'Soya' }
];

// Base completa de ingredientes organizada por categorías
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

export function AjustesDietaModal({ onClose }) {
  const [alergias, setAlergias] = useState([]);
  const [noGustan, setNoGustan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Estado para desplegar/colapsar las categorías del acordeón
  const [openSections, setOpenSections] = useState({ Proteinas: true, Vegetales: true });

  useEffect(() => {
    fetchPerfilDieta();
  }, []);

  const fetchPerfilDieta = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('perfiles')
        .select('alergias, ingredientes_desagradables')
        .eq('id', session.user.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAlergias(Array.isArray(data.alergias) ? data.alergias : []);
        setNoGustan(Array.isArray(data.ingredientes_desagradables) ? data.ingredientes_desagradables : []);
      }
    } catch (err) {
      console.error('Error al cargar ajustes de dieta:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAlergia = (key) => {
    setAlergias(prev => 
      prev.includes(key) ? prev.filter(a => a !== key) : [...prev, key]
    );
  };

  const toggleNoGusta = (ing) => {
    setNoGustan(prev => 
      prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]
    );
  };

  const toggleSection = (cat) => {
    setOpenSections(prev => ({ ...prev, [cat]: !prev[cat] }));
  };

  const handleGuardarAjustes = async () => {
    try {
      setSaving(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Debes iniciar sesión para guardar tus ajustes.');
        return;
      }

      const { error } = await supabase
        .from('perfiles')
        .update({
          alergias: alergias,
          ingredientes_desagradables: noGustan
        })
        .eq('id', session.user.id);

      if (error) throw error;

      alert('¡Ajustes de dieta guardados correctamente!');
      onClose();
    } catch (err) {
      console.error('Error al guardar ajustes:', err);
      alert('Ocurrió un error al guardar tus preferencias.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="recipe-detail-modal-overlay" onClick={onClose}>
      <div className="recipe-detail-modal-card dieta-modal-card" onClick={e => e.stopPropagation()}>
        <button className="close-detail-modal-btn" onClick={onClose}>×</button>

        <h2>🥗 Ajustes de Dieta y Restricciones</h2>
        <p className="pantry-instruction">
          Configura tus alergias e ingredientes que no te gustan para que el motor los excluya automáticamente de todas tus recomendaciones.
        </p>

        {loading ? (
          <p className="loading-text">Cargando tus preferencias de perfil...</p>
        ) : (
          <div className="dieta-sections-body">
            {/* SECCIÓN 1: ALERGIAS Y INTOLERANCIAS */}
            <section className="dieta-section">
              <h3>⚠️ Alergias e Intolerancias</h3>
              <div className="dieta-checkbox-grid">
                {ALERGENOS_BASE.map(item => {
                  const isChecked = alergias.includes(item.key);
                  return (
                    <label 
                      key={item.key} 
                      className={`dieta-pill-checkbox ${isChecked ? 'active-allergy' : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => toggleAlergia(item.key)} 
                      />
                      <span>{item.label}</span>
                    </label>
                  );
                })}
              </div>
            </section>

            {/* SECCIÓN 2: INGREDIENTES A EVITAR (CON ACORDEÓN CATEGORIZADO) */}
            <section className="dieta-section" style={{ marginTop: '18px' }}>
              <h3>🚫 Ingredientes que prefieres evitar</h3>

              {/* Resumen de ingredientes rechazados seleccionados */}
              <div className="pantry-selected-summary" style={{ marginBottom: '10px' }}>
                <strong>Excluidos actualmente ({noGustan.length}):</strong>
                <div className="pantry-pills-wrap">
                  {noGustan.map(ing => (
                    <span 
                      key={ing} 
                      className="pantry-pill active" 
                      style={{ backgroundColor: '#e74c3c' }} 
                      onClick={() => toggleNoGusta(ing)}
                    >
                      {ing.replace(/_/g, ' ')} ×
                    </span>
                  ))}
                  {noGustan.length === 0 && (
                    <em style={{ fontSize: '0.85rem', color: '#888' }}>No has excluido ningún ingrediente aún.</em>
                  )}
                </div>
              </div>

              {/* Acordeón de categorías */}
              <div className="pantry-categories-accordion" style={{ maxHeight: '220px' }}>
                {Object.keys(ingredientsDb).map(cat => (
                  <div key={cat} className="pantry-cat-group">
                    <button className="pantry-cat-trigger" onClick={() => toggleSection(cat)}>
                      {cat} <span>{openSections[cat] ? '▲' : '▼'}</span>
                    </button>
                    {openSections[cat] && (
                      <div className="pantry-items-grid">
                        {ingredientsDb[cat].map(ing => {
                          const isSelected = noGustan.includes(ing);
                          return (
                            <button
                              key={ing}
                              className={`pantry-item-btn ${isSelected ? 'selected' : ''}`}
                              style={isSelected ? { backgroundColor: '#fde8e8', borderColor: '#e74c3c', color: '#c0392b', fontWeight: 'bold' } : {}}
                              onClick={() => toggleNoGusta(ing)}
                            >
                              {isSelected ? '✕ ' : '+ '}
                              {ing.replace(/_/g, ' ')}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            <button 
              className="save-plan-db-btn" 
              onClick={handleGuardarAjustes}
              disabled={saving}
              style={{ width: '100%', marginTop: '16px', padding: '12px', fontSize: '0.95rem' }}
            >
              {saving ? 'Guardando...' : '💾 Guardar Preferencias'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}