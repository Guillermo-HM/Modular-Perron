import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import LandingPage from "./slides/LandingPage";
import Login from "./login/login"; // Tu componente de Login
import SignUp from "./login/SignUp";
import Dashboard from "./slides/Dashboard";

function App() {
  const [session, setSession] = useState(null);
  // Estados de vista posibles: "landing", "login", "signup"
  const [currentView, setCurrentView] = useState("landing");

  useEffect(() => {
    // Revisa si ya hay una sesión activa en Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Si el usuario ya está autenticado, muestra el Dashboard
  if (session) {
  // Extrae 'display_name' de los metadatos del usuario autenticado en Supabase
  const displayName = session.user?.user_metadata?.display_name || "Usuario";

  return (
    <Dashboard
      username={displayName}
      onLogout={async () => {
        await supabase.auth.signOut();
        setSession(null);
      }}
    />
  );
}

  // Si no está autenticado, navega entre las vistas públicas
  return (
    <>
      {currentView === "landing" && (
        <LandingPage
          onLoginClick={() => setCurrentView("login")}
          onSignUpClick={() => setCurrentView("signup")}
        />
      )}

      {currentView === "login" && (
        <Login
          onSwitchToSignUp={() => setCurrentView("signup")}
          onBackToLanding={() => setCurrentView("landing")}
        />
      )}

      {currentView === "signup" && (
        <SignUp
          onSwitchToLogin={() => setCurrentView("login")}
          onBackToLanding={() => setCurrentView("landing")}
        />
      )}
    </>
  );
}

export default App;