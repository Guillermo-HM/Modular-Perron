import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../assets/recipechat.css';

// Principales alérgenos
const ALERGENOS_BASE = [
  { key: 'lacteos', label: 'Lácteos (Leche, Queso, Mantequilla)' },
  { key: 'gluten', label: 'Gluten / Trigo' },
  { key: 'huevo', label: 'Huevo' },
  { key: 'pescado', label: 'Pescado' },
  { key: 'mariscos', label: 'Mariscos y Crustáceos' },
  { key: 'soya', label: 'Soya' }
];

// Lista de ingredientes para marcar preferencias / rechazos
const INGREDIENTES_DISPONIBLES = [
  'cebolla', 'cebolla_morada', 'ajo', 'pimiento_morron', 'chile_serrano', 
  'brocoli', 'zanahoria', 'tomate', 'pepino', 'calabacita', 'lechuga_romana',
  'champinones', 'garbanzos_cocidos', 'chicharos', 'cilantro', 'perejil', 'epazote'
];

export function AjustesDietaModal({ onClose }) {
  const [alergias, setAlergias] = useState([]);
  const [noGustan, setNoGustan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

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
          Configura tus alergias e ingredientes que no te gustan para que el motor inteligente los excluya automáticamente de todas tus recomendaciones.
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

            {/* SECCIÓN 2: INGREDIENTES QUE NO TE GUSTAN */}
            <section className="dieta-section" style={{ marginTop: '18px' }}>
              <h3>🚫 Ingredientes que prefieres evitar</h3>
              <div className="dieta-checkbox-grid">
                {INGREDIENTES_DISPONIBLES.map(ing => {
                  const isChecked = noGustan.includes(ing);
                  return (
                    <label 
                      key={ing} 
                      className={`dieta-pill-checkbox ${isChecked ? 'active-dislike' : ''}`}
                    >
                      <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => toggleNoGusta(ing)} 
                      />
                      <span style={{ textTransform: 'capitalize' }}>
                        {ing.replace(/_/g, ' ')}
                      </span>
                    </label>
                  );
                })}
              </div>
            </section>

            <button 
              className="save-plan-db-btn" 
              onClick={handleGuardarAjustes}
              disabled={saving}
              style={{ width: '100%', marginTop: '20px', padding: '12px', fontSize: '0.95rem' }}
            >
              {saving ? 'Guardando...' : '💾 Guardar Preferencias'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}