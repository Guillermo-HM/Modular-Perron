
import { useState, useEffect } from 'react';
import '../assets/dashboard.css';

import RecipeChat from '../components/RecipeChat';
import AjustesUsuario from './AjustesUsuario';
import { SavedRecipesModal } from '../components/SavedRecipesModal';
import { WeeklyPlanModal } from '../components/WeeklyPlanModal';
import { AjustesDietaModal } from '../components/AjustesDietaModal';


export const Dashboard = ({ username = 'Guillermo', onLogout }) => {

  // NAVEGACIÓN
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('inicio');

  // MODALES Y COMPONENTES
  const [showRecipeChat, setShowRecipeChat] = useState(false);
  const [showAjustes, setShowAjustes] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showDietaModal, setShowDietaModal] = useState(false);

  // CERRAR MENÚ MÓVIL CON ESCAPE
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // ACCIONES PRINCIPALES
  const startNewRecipeFlow = () => {
    setActiveSection('recetas');
    setIsMobileMenuOpen(false);
    setShowRecipeChat(true);
  };

  const openWeeklyPlan = () => {
    setActiveSection('planes');
    setIsMobileMenuOpen(false);
    setShowPlanModal(true);
  };

  const openSavedRecipes = () => {
    setActiveSection('favoritos');
    setIsMobileMenuOpen(false);
    setShowSavedModal(true);
  };

  const openDietSettings = () => {
    setActiveSection('perfil');
    setIsMobileMenuOpen(false);
    setShowDietaModal(true);
  };

  const openUserSettings = () => {
    setIsMenuOpen(false);
    setIsMobileMenuOpen(false);
    setShowAjustes(true);
  };

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    if (onLogout) onLogout();
  };

  // NAVEGACIÓN
  const navigationItems = [
    {
      id: 'inicio',
      label: 'Inicio',
      icon: '⌂',
      action: () => {
        setActiveSection('inicio');
        setIsMobileMenuOpen(false);
      }
    },
    {
      id: 'recetas',
      label: 'Nueva receta',
      icon: '✦',
      action: startNewRecipeFlow
    },
    {
      id: 'planes',
      label: 'Plan semanal',
      icon: '▦',
      action: openWeeklyPlan
    },
    {
      id: 'favoritos',
      label: 'Favoritos',
      icon: '♡',
      action: openSavedRecipes
    },
    {
      id: 'perfil',
      label: 'Perfil nutricional',
      icon: '◉',
      action: openDietSettings
    }
  ];

  // TARJETAS PRINCIPALES
  const dashboardCardsData = [
    {
      id: 1,
      title: 'Nueva receta',
      badge: 'IA GENERATIVA',
      description:
        'Genera platillos personalizados según tus ingredientes, presupuesto y tiempo disponible.',
      image:
        'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=85',
      icon: '✦',
      buttonText: 'Crear receta',
      action: startNewRecipeFlow
    },
    {
      id: 2,
      title: 'Plan semanal',
      badge: 'ORGANIZACIÓN',
      description:
        'Organiza tus comidas de lunes a domingo y optimiza tus compras.',
      image:
        'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=85',
      icon: '▦',
      buttonText: 'Ver planificación',
      action: openWeeklyPlan
    },
    {
      id: 3,
      title: 'Recetas guardadas',
      badge: 'TU COLECCIÓN',
      description:
        'Accede a tus platillos favoritos y consulta las recetas que has guardado.',
      image:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=85',
      icon: '♡',
      buttonText: 'Explorar recetas',
      action: openSavedRecipes
    },
    {
      id: 4,
      title: 'Perfil nutricional',
      badge: 'PERSONALIZACIÓN',
      description:
        'Configura tus alergias, restricciones y objetivos nutricionales.',
      image:
        'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=85',
      icon: '◉',
      buttonText: 'Configurar perfil',
      action: openDietSettings
    }
  ];

  // PANTALLA DE AJUSTES DE USUARIO
  if (showAjustes) {
    return (
      <AjustesUsuario
        onBack={() => setShowAjustes(false)}
      />
    );
  }

  return (
    <div
      className={`cs-dashboard ${
        isSidebarCollapsed ? 'sidebar-collapsed' : ''
      } ${
        isMobileMenuOpen ? 'mobile-menu-open' : ''
      }`}
    >

      {/* OVERLAY PARA MÓVILES */}
      <div
        className="cs-mobile-overlay"
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* SIDEBAR */}
      <aside className="cs-sidebar" id="csSidebar">

        {/* LOGOTIPO */}
        <div className="cs-brand">
          <div className="cs-brand-icon">
            <img 
              src = {`${import.meta.env.BASE_URL}cooklogo.png`}
              alt = "CookSmart Logo"
              className = "cs-brand-image"
            />
          </div>
          <span className="cs-brand-name">CookSmart</span>
        </div>

        {/* BOTÓN CONTRAER */}
        <button
          className="cs-collapse-btn"
          onClick={() =>
            setIsSidebarCollapsed(!isSidebarCollapsed)
          }
          aria-label={
            isSidebarCollapsed
              ? 'Expandir menú'
              : 'Contraer menú'
          }
          title={
            isSidebarCollapsed
              ? 'Expandir menú'
              : 'Contraer menú'
          }
        >
          {isSidebarCollapsed ? '→' : '←'}
        </button>

        <span className="cs-nav-label">
          MENÚ PRINCIPAL
        </span>

        {/* NAVEGACIÓN */}
        <nav className="cs-navigation">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={`cs-nav-item ${
                activeSection === item.id ? 'active' : ''
              }`}
              onClick={item.action}
              title={
                isSidebarCollapsed ? item.label : undefined
              }
            >
              <span className="cs-nav-icon">
                {item.icon}
              </span>

              <span className="cs-nav-text">
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        {/* USUARIO EN SIDEBAR */}
        <div className="cs-sidebar-bottom">
          <button
            className="cs-user-mini"
            onClick={openUserSettings}
            title="Configuración de usuario"
          >
            <div className="cs-avatar">
              {username.substring(0, 2).toUpperCase()}
            </div>

            <div className="cs-user-info">
              <strong>{username}</strong>
              <span>Mi cuenta</span>
            </div>
          </button>
        </div>

      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="cs-main">

        {/* HEADER */}
        <header className="cs-header">

          <div className="cs-header-left">

            <button
              className="cs-mobile-menu"
              onClick={() =>
                setIsMobileMenuOpen(!isMobileMenuOpen)
              }
              aria-label="Abrir navegación"
              aria-expanded={isMobileMenuOpen}
            >
              ☰
            </button>

            <span className="cs-breadcrumb">
              Inicio <span>/</span> Dashboard
            </span>

          </div>

          <div className="cs-header-right">

            <div className="cs-menu-container">

              <button
                className="cs-header-avatar"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Abrir menú de usuario"
                aria-expanded={isMenuOpen}
              >
                {username.substring(0, 2).toUpperCase()}
              </button>

              {isMenuOpen && (
                <div className="cs-user-dropdown">

                  <div className="cs-dropdown-header">
                    <strong>{username}</strong>
                    <span>Cuenta CookSmart</span>
                  </div>

                  <button
                    onClick={openUserSettings}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                    Ajustes de usuario
                  </button>

                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      openDietSettings();
                    }}
                  >
                    <span>◉</span>
                    Perfil nutricional
                  </button>

                  <div className="cs-dropdown-divider" />

                  <button
                    className="cs-logout-button"
                    onClick={handleLogoutClick}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                    </svg>
                    Cerrar sesión
                  </button>

                </div>
              )}

            </div>

          </div>
        </header>

        {/* BIENVENIDA */}
        <section className="cs-welcome">

          <div>
            <span className="cs-eyebrow">
              TU ESPACIO INTELIGENTE DE COCINA
            </span>

            <h1>
              ¡Hola de nuevo, {username}! 
            </h1>

            <p>
              ¿Qué vamos a preparar hoy?
            </p>
          </div>

        </section>

        {/* BANNER PRINCIPAL */}
        <section className="cs-hero">

          <div className="cs-hero-content">

            <span className="cs-hero-tag">
              ✦ RECOMENDACIONES INTELIGENTES
            </span>

            <h2>
              Come mejor, organiza mejor.
            </h2>

            <p>
              Descubre recetas personalizadas según tus
              ingredientes, presupuesto y objetivos nutricionales.
            </p>

            <button
              className="cs-hero-button"
              onClick={startNewRecipeFlow}
            >
              Crear mi receta <span>→</span>
            </button>

          </div>

          <div className="cs-hero-decoration">
            
          </div>

        </section>

        {/* TARJETAS */}
        <section className="cs-section">

          <div className="cs-section-heading">
            <div>
              <h2>Tu espacio de trabajo</h2>
              <p>
                Todo lo que necesitas para organizar tu alimentación.
              </p>
            </div>
          </div>

          <div className="cs-card-grid">

            {dashboardCardsData.map((card) => (

              <article
                key={card.id}
                className="cs-feature-card"
              >

                <div className="cs-card-image">

                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                  />

                  <span className="cs-card-tag">
                    {card.badge}
                  </span>

                </div>

                <div className="cs-card-body">

                  <div className="cs-card-icon">
                    {card.icon}
                  </div>

                  <h3>{card.title}</h3>

                  <p>{card.description}</p>

                  <button
                    className="cs-card-link"
                    onClick={card.action}
                  >
                    {card.buttonText}
                    <span>→</span>
                  </button>

                </div>

              </article>

            ))}

          </div>

        </section>

        {/* FOOTER */}
        <footer className="cs-footer">
          <span>CookSmart © 2026</span>
          <span>Alimentación inteligente, todos los días.</span>
        </footer>

      </main>

      {/* MODALES Y COMPONENTES EXISTENTES */}

      {showRecipeChat && (
        <RecipeChat
          onBack={() => setShowRecipeChat(false)}
        />
      )}

      {showSavedModal && (
        <SavedRecipesModal
          onClose={() => setShowSavedModal(false)}
        />
      )}

      {showPlanModal && (
        <WeeklyPlanModal
          onClose={() => setShowPlanModal(false)}
        />
      )}

      {showDietaModal && (
        <AjustesDietaModal
          onClose={() => setShowDietaModal(false)}
        />
      )}

    </div>
  );
};

export default Dashboard;
