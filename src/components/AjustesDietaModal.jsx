import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../assets/recipechat.css';

// Íconos SVG reutilizables
const SVGClose = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const SVGShieldWarning = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const SVGBan = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
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

const SVGCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const SVGPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const SVGSave = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
    <polyline points="17 21 17 13 7 13 7 21"></polyline>
    <polyline points="7 3 7 8 15 8"></polyline>
  </svg>
);

// Base de alérgenos principales
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

  const [openSections, setOpenSections] = useState({ Proteinas: true });

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

      alert('Ajustes de dieta actualizados correctamente.');
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
        
        {/* CABECERA */}
        <div className="dieta-modal-header">
          <div>
            <span className="dieta-header-badge">Perfil Nutricional</span>
            <h2>Ajustes de Dieta y Restricciones</h2>
            <p className="dieta-header-desc">
              Configura tus alérgenos e ingredientes no deseados. El motor de recomendación los excluirá automáticamente de tus recetas.
            </p>
          </div>
          <button className="dieta-close-btn" onClick={onClose} aria-label="Cerrar">
            <SVGClose />
          </button>
        </div>

        {loading ? (
          <div className="dieta-loading-state">
            <div className="dieta-spinner"></div>
            <span>Cargando preferencias del perfil...</span>
          </div>
        ) : (
          <div className="dieta-modal-content">
            
            {/* SECCIÓN 1: ALERGIAS */}
            <section className="dieta-section">
              <div className="dieta-section-header">
                <div className="dieta-section-title">
                  <SVGShieldWarning />
                  <h3>Alergias e Intolerancias</h3>
                </div>
                <span className={`dieta-pill-badge ${alergias.length > 0 ? 'active-badge' : ''}`}>
                  {alergias.length} {alergias.length === 1 ? 'seleccionada' : 'seleccionadas'}
                </span>
              </div>

              <div className="dieta-allergy-grid">
                {ALERGENOS_BASE.map(item => {
                  const isChecked = alergias.includes(item.key);
                  return (
                    <div 
                      key={item.key} 
                      className={`dieta-allergy-card ${isChecked ? 'selected' : ''}`}
                      onClick={() => toggleAlergia(item.key)}
                    >
                      <div className="dieta-checkbox-box">
                        {isChecked && <SVGCheck />}
                      </div>
                      <div className="dieta-allergy-details">
                        <span className="dieta-allergy-name">{item.label}</span>
                        <span className="dieta-allergy-sub">{item.sub}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* SECCIÓN 2: INGREDIENTES A EVITAR */}
            <section className="dieta-section">
              <div className="dieta-section-header">
                <div className="dieta-section-title">
                  <SVGBan />
                  <h3>Ingredientes que prefieres evitar</h3>
                </div>
                <span className={`dieta-pill-badge ${noGustan.length > 0 ? 'active-badge-danger' : ''}`}>
                  {noGustan.length} {noGustan.length === 1 ? 'excluido' : 'excluidos'}
                </span>
              </div>

              {/* Resumen flotante de excluidos */}
              <div className="dieta-summary-pills-box">
                {noGustan.length === 0 ? (
                  <span className="dieta-empty-text">No has seleccionado ningún ingrediente a evitar.</span>
                ) : (
                  <div className="dieta-pills-flex">
                    {noGustan.map(ing => (
                      <button 
                        key={ing} 
                        type="button" 
                        className="dieta-dislike-pill" 
                        onClick={() => toggleNoGusta(ing)}
                      >
                        <span>{ing.replace(/_/g, ' ')}</span>
                        <SVGClose />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Acordeón de categorías */}
              <div className="dieta-accordion-container">
                {Object.keys(ingredientsDb).map(cat => {
                  const items = ingredientsDb[cat];
                  const countInCat = items.filter(i => noGustan.includes(i)).length;
                  const isOpen = !!openSections[cat];

                  return (
                    <div key={cat} className={`dieta-accordion-item ${isOpen ? 'is-open' : ''}`}>
                      <button 
                        type="button" 
                        className="dieta-accordion-header" 
                        onClick={() => toggleSection(cat)}
                      >
                        <div className="dieta-accordion-title">
                          <span>{cat}</span>
                          {countInCat > 0 && (
                            <span className="dieta-cat-count-pill">{countInCat}</span>
                          )}
                        </div>
                        <SVGChevron open={isOpen} />
                      </button>

                      {isOpen && (
                        <div className="dieta-accordion-body">
                          <div className="dieta-ingredients-wrap">
                            {items.map(ing => {
                              const isSelected = noGustan.includes(ing);
                              return (
                                <button
                                  key={ing}
                                  type="button"
                                  className={`dieta-ingredient-chip ${isSelected ? 'active-chip' : ''}`}
                                  onClick={() => toggleNoGusta(ing)}
                                >
                                  <span className="chip-icon">
                                    {isSelected ? <SVGClose /> : <SVGPlus />}
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
            </section>

          </div>
        )}

        {/* PIE CON BOTÓN ACCIÓN */}
        {!loading && (
          <div className="dieta-modal-footer">
            <button 
              type="button"
              className="dieta-save-submit-btn" 
              onClick={handleGuardarAjustes}
              disabled={saving}
            >
              <SVGSave />
              <span>{saving ? 'Guardando cambios...' : 'Guardar Preferencias'}</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}