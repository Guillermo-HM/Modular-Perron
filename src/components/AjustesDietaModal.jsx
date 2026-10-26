import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../assets/recipechat.css';

// Base de alérgenos principales con etiquetas y sugerencias claras
const ALERGENOS_BASE = [
  { key: 'pollo', label: 'Pollo / Pechuga', sub: 'Pollo, Pechuga de pollo' },
  { key: 'res', label: 'Carne de Res', sub: 'Cortes de res, Molida' },
  { key: 'cerdo', label: 'Carne de Cerdo', sub: 'Lomo, Tocino, Cerdo' },
  { key: 'pescado', label: 'Pescado', sub: 'Pescado blanco, Salmón' },
  { key: 'huevo', label: 'Huevo', sub: 'Blanco, Rojo, Yema' },
  { key: 'leche', label: 'Lácteos / Leche', sub: 'Quesos, Crema, Yogur, Mantequilla' },
  { key: 'maiz', label: 'Maíz / Tortilla', sub: 'Tortillas, Tostadas, Maíz' },
  { key: 'trigo', label: 'Trigo / Gluten', sub: 'Pastas, Pan, Crutones' },
  { key: 'soya', label: 'Soya', sub: 'Salsa de soya, Tofu' },
  { key: 'mostaza', label: 'Mostaza', sub: 'Mostaza preparada/semilla' },
  { key: 'sesamo', label: 'Sésamo / Ajonjolí', sub: 'Aceite de sésamo, Ajonjolí' },
  { key: 'chile', label: 'Chiles Picantes', sub: 'Chile serrano, Jalapeño' },
  { key: 'crustaseos', label: 'Crustáceos', sub: 'Camarón, Langosta, Jaiba' },
  { key: 'moluscos', label: 'Moluscos', sub: 'Pulpo, Calamar, Ostión' },
  { key: 'nueces_arbol', label: 'Nueces de Árbol', sub: 'Almendra, Nuez, Pistache' },
  { key: 'citricos', label: 'Cítricos', sub: 'Limón, Naranja, Toronja' },
  { key: 'leguminosas', label: 'Leguminosas', sub: 'Frijol, Garbanzo, Lenteja' }
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

  // Estado para desplegar/colapsar las categorías
  const [openSections, setOpenSections] = useState({ Proteinas: true, Vegetales: false });

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
        <button className="close-detail-modal-btn" onClick={onClose} aria-label="Cerrar modal">
          ×
        </button>

        <div className="dieta-modal-header">
          <div className="dieta-header-badge">Perfil Nutricional</div>
          <h2>🥗 Ajustes de Dieta y Restricciones</h2>
          <p className="pantry-instruction">
            Personaliza tus alérgenos e ingredientes no deseados. El motor de recomendación los descartará automáticamente de tus recetas.
          </p>
        </div>

        {loading ? (
          <div className="dieta-loading-box">
            <div className="dieta-spinner"></div>
            <p className="loading-text">Cargando tus preferencias de perfil...</p>
          </div>
        ) : (
          <div className="dieta-sections-body">
            {/* SECCIÓN 1: ALERGIAS Y INTOLERANCIAS */}
            <section className="dieta-section">
              <div className="dieta-section-title-row">
                <h3>⚠️ Alergias e Intolerancias</h3>
                <span className="dieta-count-badge warning">
                  {alergias.length} {alergias.length === 1 ? 'activa' : 'activas'}
                </span>
              </div>

              <div className="dieta-checkbox-grid">
                {ALERGENOS_BASE.map(item => {
                  const isChecked = alergias.includes(item.key);
                  return (
                    <div 
                      key={item.key} 
                      className={`dieta-allergy-card ${isChecked ? 'active' : ''}`}
                      onClick={() => toggleAlergia(item.key)}
                    >
                      <div className="dieta-allergy-checkbox">
                        {isChecked && <span>✓</span>}
                      </div>
                      <div className="dieta-allergy-info">
                        <strong>{item.label}</strong>
                        <small>{item.sub}</small>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECCIÓN 2: INGREDIENTES A EVITAR (ACORDEÓN CATEGORIZADO) */}
            <section className="dieta-section" style={{ marginTop: '24px' }}>
              <div className="dieta-section-title-row">
                <h3>🚫 Ingredientes que prefieres evitar</h3>
                <span className="dieta-count-badge danger">
                  {noGustan.length} {noGustan.length === 1 ? 'excluido' : 'excluidos'}
                </span>
              </div>

              {/* Resumen flotante de ingredientes no deseados */}
              <div className="dieta-pantry-summary">
                <div className="pantry-pills-wrap">
                  {noGustan.map(ing => (
                    <span 
                      key={ing} 
                      className="dieta-dislike-pill"
                      onClick={() => toggleNoGusta(ing)}
                      title="Haz clic para quitar de la lista"
                    >
                      {ing.replace(/_/g, ' ')} <small>×</small>
                    </span>
                  ))}
                  {noGustan.length === 0 && (
                    <em className="dieta-empty-hint">No has seleccionado ningún ingrediente a evitar.</em>
                  )}
                </div>
              </div>

              {/* Acordeón de categorías de ingredientes */}
              <div className="dieta-accordion-wrapper">
                {Object.keys(ingredientsDb).map(cat => {
                  const catItems = ingredientsDb[cat];
                  const selectedCountInCat = catItems.filter(i => noGustan.includes(i)).length;
                  const isOpen = openSections[cat];

                  return (
                    <div key={cat} className={`dieta-cat-card ${isOpen ? 'open' : ''}`}>
                      <button 
                        type="button" 
                        className="dieta-cat-header" 
                        onClick={() => toggleSection(cat)}
                      >
                        <div className="dieta-cat-title">
                          <span>{cat}</span>
                          {selectedCountInCat > 0 && (
                            <span className="dieta-cat-badge">{selectedCountInCat}</span>
                          )}
                        </div>
                        <span className={`dieta-cat-arrow ${isOpen ? 'rotated' : ''}`}>▼</span>
                      </button>

                      {isOpen && (
                        <div className="dieta-cat-content">
                          <div className="dieta-pantry-grid">
                            {catItems.map(ing => {
                              const isSelected = noGustan.includes(ing);
                              return (
                                <button
                                  key={ing}
                                  type="button"
                                  className={`dieta-ingredient-btn ${isSelected ? 'selected' : ''}`}
                                  onClick={() => toggleNoGusta(ing)}
                                >
                                  <span className="btn-icon">{isSelected ? '✕' : '+'}</span>
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
            </section>

            {/* BOTÓN DE GUARDAR */}
            <div className="dieta-footer-actions">
              <button 
                type="button"
                className="dieta-save-btn" 
                onClick={handleGuardarAjustes}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="btn-spinner"></span>
                    <span>Guardando cambios...</span>
                  </>
                ) : (
                  <>
                    <span>💾 Guardar Preferencias</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}