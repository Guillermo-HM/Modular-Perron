import React, { useEffect, useState } from "react";
import { Blobatar } from "@blobatar/react";
import "blobatar/motion.css"; // Importante para la animación fluida
import { supabase } from "../supabaseClient";

function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Obtener información del usuario con la sesión activa
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUserData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const displayName = user?.user_metadata?.display_name || "null";

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.badge}>
          <span>✓ Autenticado</span>
        </div>

        {/* Blobatar con animación continua y seguimiento de mirada */}
        <div style={styles.avatarContainer}>
          <Blobatar
            name={displayName}
            size={90}
            animate="always"    /* Mantiene la animación activa continuamente */
            trackCursor={true}  /* Los ojos seguirán la trayectoria del cursor */
          />
        </div>

        <h1 style={styles.title}>Bienvenido, {displayName}</h1>
        <p style={styles.subtitle}>
          Has accedido correctamente a la plataforma.
        </p>

        {user && (
          <div style={styles.userInfo}>
            <p><strong>ID de Usuario:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Último acceso:</strong> {new Date(user.last_sign_in_at).toLocaleString()}</p>
          </div>
        )}

        <button onClick={handleSignOut} style={styles.button}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#F7F8EE",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 20px 40px rgba(42, 59, 24, 0.08)",
    border: "1px solid #DADECA",
    maxWidth: "500px",
    width: "100%",
    textAlign: "center",
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#EFF1E4",
    color: "#2A3B18",
    padding: "6px 16px",
    borderRadius: "20px",
    fontSize: "0.85rem",
    fontWeight: "600",
    marginBottom: "16px",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "16px",
  },
  title: {
    color: "#1D2318",
    fontSize: "1.75rem",
    marginBottom: "8px",
  },
  subtitle: {
    color: "#626A59",
    fontSize: "0.95rem",
    marginBottom: "24px",
  },
  userInfo: {
    backgroundColor: "#F7F8EE",
    padding: "16px",
    borderRadius: "10px",
    textAlign: "left",
    marginBottom: "24px",
    fontSize: "0.85rem",
    color: "#1D2318",
    lineHeight: "1.6",
  },
  button: {
    backgroundColor: "#2A3B18",
    color: "#F7F8EE",
    border: "none",
    padding: "12px 24px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
  },
};

export default Dashboard;