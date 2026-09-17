import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import "./login.css";

function SignUp({ onSwitchToLogin, onBackToLanding }) {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      setSuccessMsg(true);
    }
    setLoading(false);
  };

  return (
    <div className="login-wrapper">
      {/* 1. Mueve el botón AQUÍ (fuera de login-card) */}
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
            <h3>Únete a nosotros</h3>
            <p>Crea tu cuenta en pocos pasos y comienza el control de tu dieta.</p>
          </div>
          <div className="brand-footer">
            <span>Est. 2026</span>
          </div>
        </div>

        {/* Panel Derecho */}
        <div className="form-panel">
          <div className="form-header">
            <h2>Registro</h2>
            <p>Ingresa tus datos para crear una nueva cuenta</p>
          </div>

          {errorMsg && <div className="error-badge">{errorMsg}</div>}
          {successMsg && (
            <div style={{ background: "#D1FAE5", color: "#065F46", padding: "10px", borderRadius: "10px", marginBottom: "15px", fontSize: "0.85rem" }}>
              Cuenta creada con éxito. Revisa tu correo o inicia sesión.
            </div>
          )}

          <form onSubmit={handleSignUp} className="login-form">
            <div className="input-field">
              <label htmlFor="displayName">Nombre de usuario</label>
              <input
                id="displayName"
                type="text"
                placeholder="Ej. Cristopher"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>

            <div className="input-field">
              <label htmlFor="email">Correo electrónico</label>
              <input
                id="email"
                type="email"
                placeholder="tuemail@example.com"
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

            <div className="input-field">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "CREANDO CUENTA..." : "REGISTRARME"}
            </button>
          </form>

          <div className="form-footer">
            <p>
              ¿Ya tienes cuenta?{" "}
              <a href="#" className="highlight-link" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }}>
                Inicia sesión aquí
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;