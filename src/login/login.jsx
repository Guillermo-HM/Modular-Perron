import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./login.css";

// 1. Agrega onBackToLanding en las props
function Login({ onSwitchToSignUp, onBackToLanding }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      console.log("Sesión iniciada:", data);
    }
    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      {/* 2. Botón flotante para regresar a la Landing Page */}
      <button 
        type="button" 
        className="back-arrow-btn" 
        onClick={onBackToLanding}
        aria-label="Regresar al inicio"
      >
        <span className="back-arrow-icon">&#8592;</span>
        <span className="back-arrow-text">Volver</span>
      </button>

      <div className="login-card">
        {/* Panel Izquierdo */}
        <div className="brand-panel">
          <div className="brand-header">
            <div className="brand-logo-icon">CS</div>
            <div className="brand-title">
              <span>CookSmart</span>
              <small>Project</small>
            </div>
          </div>

          <div className="brand-body">
            <h3>Bienvenido de nuevo</h3>
            <p>
              Accede a la plataforma para poder seguir el control de tu dieta.
            </p>
          </div>

          <div className="brand-footer">
            <span>Est. 2026</span>
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="form-panel">
          <div className="form-header">
            <h2>Iniciar Sesión</h2>
            <p>Ingresa tus credenciales para acceder a tu cuenta</p>
          </div>

          {errorMsg && (
            <div className="error-badge">
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-field">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="forgot-link-wrapper">
              <a href="#" className="secondary-link">¿Olvidaste tu contraseña?</a>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Iniciando sesión..." : "INICIAR SESIÓN"}
            </button>
          </form>

          <div className="form-footer">
            <p>
              ¿No tienes una cuenta?{" "}
              <a 
                href="#" 
                className="highlight-link"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSwitchToSignUp) onSwitchToSignUp();
                }}
              >
                Regístrate aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;