import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import LandingPage from "./slides/LandingPage";
import Login from "./login/login"; 
import SignUp from "./login/SignUp";
import Dashboard from "./slides/Dashboard";
import OnboardingAlergias from "./slides/OnboardingAlergias"; // Importamos el nuevo onboarding

function App() {
  const [session, setSession] = useState(null);
  const [currentView, setCurrentView] = useState("landing");
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkUserOnboarding(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      checkUserOnboarding(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserOnboarding = async (session) => {
  setSession(session);
  if (session) {
    // Consulta la tabla 'perfiles' de Supabase
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('has_completed_onboarding')
      .eq('id', session.user.id)
      .single();

    if (perfil && perfil.has_completed_onboarding) {
      setNeedsOnboarding(false);
    } else {
      setNeedsOnboarding(true);
    }
  }
};

  // Si hay sesión activa:
  if (session) {
    // 1. Si no ha registrado alergias por primera vez -> Mostrar Onboarding
    if (needsOnboarding) {
      return (
        <OnboardingAlergias
          session={session}
          onComplete={() => setNeedsOnboarding(false)}
        />
      );
    }

    // 2. Si ya completó onboarding -> Mostrar Dashboard
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