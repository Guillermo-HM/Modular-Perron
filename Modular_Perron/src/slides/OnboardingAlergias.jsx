import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

// Lista de alergias alineada con los átomos de tu archivo Prolog
const ALERGIAS_DISPONIBLES = [
  { id: 'cacahuate', label: 'Cacahuates / Frutos Secos' },
  { id: 'mariscos', label: 'Mariscos y Crustáceos' },
  { id: 'lacteos', label: 'Lácteos / Lactosa' },
  { id: 'gluten', label: 'Gluten / Trigo' },
  { id: 'huevo', label: 'Huevo' },
  { id: 'soya', label: 'Soya' },
  { id: 'pescado', label: 'Pescado' },
];

export default function OnboardingAlergias({ session, onComplete }) {
  const [alergiasSeleccionadas, setAlergiasSeleccionadas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const toggleAlergia = (id) => {
    setAlergiasSeleccionadas((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleGuardar = async () => {
    setCargando(true);
    try {
      const userId = session.user.id;

      // 1. Guardar en la tabla 'perfiles' en Supabase usando el UID del usuario
      const { error: profileError } = await supabase
        .from('perfiles')
        .upsert({
          id: userId,
          alergias: alergiasSeleccionadas,
          has_completed_onboarding: true,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      // 2. Enviar las alergias al servidor Node.js + swipl-stdio
      // Usamos la parte local del correo como identificador simple en Prolog
      const usernameProlog = session.user.email.split('@')[0];

      await fetch('http://localhost:3001/api/registrar-alergias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usuario: usernameProlog,
          alergias: alergiasSeleccionadas,
        }),
      });

      // 3. Completar el proceso de onboarding y pasar al Dashboard
      onComplete();
    } catch (err) {
      console.error('Error al guardar perfiles / alergias:', err);
      alert('Ocurrió un error al guardar tus alergias. Revisa la consola.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '60px auto',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
      backgroundColor: '#fff',
      textAlign: 'center',
      fontFamily: 'sans-serif'
    }}>
      <h2>¡Bienvenido/a! 👋</h2>
      <p style={{ color: '#666', marginBottom: '24px' }}>
        Selecciona tus restricciones o alergias alimentarias para ajustar el recomendador:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        {ALERGIAS_DISPONIBLES.map((alergia) => {
          const isSelected = alergiasSeleccionadas.includes(alergia.id);
          return (
            <button
              key={alergia.id}
              type="button"
              onClick={() => toggleAlergia(alergia.id)}
              style={{
                padding: '12px 16px',
                borderRadius: '10px',
                border: isSelected ? '2px solid #4F46E5' : '1px solid #E5E7EB',
                backgroundColor: isSelected ? '#EEF2FF' : '#F9FAFB',
                color: isSelected ? '#4F46E5' : '#374151',
                fontWeight: isSelected ? '600' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {isSelected ? '✓ ' : ''}{alergia.label}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleGuardar}
        disabled={cargando}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '10px',
          backgroundColor: '#4F46E5',
          color: '#fff',
          fontSize: '16px',
          fontWeight: 'bold',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        {cargando ? 'Guardando...' : 'Guardar y Continuar al Dashboard'}
      </button>
    </div>
  );
}