import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../assets/Crud.css'; // Asegúrate de enlazar el CSS

export default function AjustesUsuario({ onBack }) {
  const [user, setUser] = useState(null);
  
  // Estados para Datos Personales
  const [displayName, setDisplayName] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');

  // Estados para Credenciales
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [loading, setLoading] = useState(false);

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        
        // 1. Obtener Display Name del sistema de Auth
        setDisplayName(user.user_metadata?.display_name || '');
        setEmail(user.email || '');

        // 2. Obtener Nombre y Apellido de la tabla perfiles
        const { data } = await supabase
          .from('perfiles')
          .select('nombre, apellido')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setNombre(data.nombre || '');
          setApellido(data.apellido || '');
        }
      }
    };
    fetchUserData();
  }, []);

  // --- FUNCIONES DE ACTUALIZACIÓN ---

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Actualiza Auth (El display name del saludo superior)
      const { error: authError } = await supabase.auth.updateUser({
        data: { display_name: displayName }
      });
      if (authError) throw authError;

      // Actualiza Base de Datos (Nombre y Apellido reales)
      const { error: dbError } = await supabase
        .from('perfiles')
        .update({ nombre, apellido })
        .eq('id', user.id);
      if (dbError) throw dbError;

      showToast('Perfil actualizado. (Recarga la página para ver el cambio)');
    } catch (error) {
      showToast('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ email });
      if (error) throw error;
      showToast('Revisa tu bandeja de entrada para confirmar el cambio.');
    } catch (error) {
      showToast('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      showToast('Contraseña actualizada con éxito.');
      setPassword('');
    } catch (error) {
      showToast('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-wrapper">
      <div className="settings-card">
        
        <button className="settings-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
          Volver al inicio
        </button>

        <h2 className="settings-main-title">Configuración de cuenta</h2>

        {/* 1. SECCIÓN: DATOS PERSONALES */}
        <section className="settings-section">
          <h3 className="settings-subtitle">Datos Personales</h3>
          <form onSubmit={handleUpdateProfile}>
            <div className="input-group">
              <label>Nombre de Usuario (Visible en el menú)</label>
              <input 
                type="text" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)} 
              />
            </div>
            <div className="input-row">
              <div className="input-group">
                <label>Nombre </label>
                <input 
                  type="text" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                />
              </div>
              <div className="input-group">
                <label>Apellido</label>
                <input 
                  type="text" 
                  value={apellido} 
                  onChange={(e) => setApellido(e.target.value)} 
                />
              </div>
            </div>
            <button type="submit" className="settings-btn-primary" disabled={loading}>
              Guardar Perfil
            </button>
          </form>
        </section>

        <hr className="settings-divider" />

        {/* 2. SECCIÓN: CORREO */}
        <section className="settings-section">
          <h3 className="settings-subtitle">Correo Electrónico</h3>
          <form onSubmit={handleUpdateEmail}>
            <div className="input-group">
              <label>Nuevo Correo</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="ejemplo@correo.com"
              />
            </div>
            <button type="submit" className="settings-btn-secondary" disabled={loading}>
              Actualizar Correo
            </button>
          </form>
        </section>

        <hr className="settings-divider" />

        {/* 3. SECCIÓN: CONTRASEÑA */}
        <section className="settings-section">
          <h3 className="settings-subtitle">Seguridad</h3>
          <form onSubmit={handleUpdatePassword}>
            <div className="input-group">
              <label>Nueva Contraseña</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Mínimo 6 caracteres"
                minLength={6}
              />
            </div>
            <button type="submit" className="settings-btn-secondary" disabled={loading}>
              Cambiar Contraseña
            </button>
          </form>
        </section>

      </div>

      {toastMessage && (
        <div className = "custom-toast">
          {toastMessage}
        </div>
      )}

    </div>
  );
}