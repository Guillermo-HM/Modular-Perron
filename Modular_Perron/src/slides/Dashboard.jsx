import React, { useState } from 'react';
import '../assets/dashboard.css';
import RecipeChat from '../components/RecipeChat'; 

export const Dashboard = ({ username = 'Guillermo', onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showRecipeChat, setShowRecipeChat] = useState(false);

  const handleLogoutClick = () => {
    setIsMenuOpen(false);
    if (onLogout) onLogout();
  };

  const startNewRecipeFlow = () => {
    setShowRecipeChat(true);
  };

  const handleBackToDashboard = () => {
    setShowRecipeChat(false);
  };

  const dashboardCardsData = [
    {
      id: 1,
      title: 'Nueva Receta',
      badge: 'IA Generativa',
      description: 'Genera una receta totalmente personalizada ingresando tu presupuesto actual, ingredientes disponibles y tiempo máximo.',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80',
      buttonText: 'COMENZAR',
      action: startNewRecipeFlow, 
    },
    {
      id: 2,
      title: 'Plan Semanal',
      badge: 'Organización',
      description: 'Organiza tu menú de lunes a domingo optimizando compras para ahorrar tiempo y dinero.',
      image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=600&q=80',
      buttonText: 'VER PLAN',
      action: () => alert('Abriendo plan semanal... (Próximamente)'),
    },
    {
      id: 3,
      title: 'Recetas Guardadas',
      badge: 'Favoritos',
      description: 'Accede a tu colección personal de platillos guardados y ajusta sus porciones.',
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      buttonText: 'EXPLORAR',
      action: () => alert('Abriendo favoritos... (Próximamente)'),
    },
    {
      id: 4,
      title: 'Ajustes de Dieta',
      badge: 'Perfil Nutricional',
      description: 'Configura tus alergias, restricción de calorías o metas nutricionales específicas.',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80',
      buttonText: 'CONFIGURAR',
      action: () => alert('Abriendo configuración de dieta... (Próximamente)'),
    },
  ];

  return (
    <div className="dashboard-wrapper">
      {/* HEADER / NAVBAR SUPERIOR */}
      <header className="dashboard-header">
        <div className="welcome-pill">
          <span>Bienvenido de nuevo, <strong>{username}</strong></span>
        </div>

        <div className="menu-container">
          <button 
            className="menu-toggle-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Abrir menú de usuario"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>

          {isMenuOpen && (
            <div className="user-dropdown-menu">
              <button className="dropdown-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
                <span>Ajustes de Usuario</span>
              </button>
              
              <button className="dropdown-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/>
                </svg>
                <span>Configuraciones</span>
              </button>

              <div className="dropdown-divider" />

              <button className="dropdown-item logout-item" onClick={handleLogoutClick}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                </svg>
                <span>Cerrar Sesión</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CUADRÍCULA DE TARJETAS */}
      <main className="dashboard-grid">
        {dashboardCardsData.map((card) => (
          <div key={card.id} className="card-container">
            <div className="card-back-info">
              <p>{card.description}</p>
            </div>

            <div className="card-front">
              <div className="card-image-wrapper">
                <img src={card.image} alt={card.title} className="card-image" />
                <div className="card-image-overlay" />
                <span className="card-badge">{card.badge}</span>
              </div>
              <div className="card-content">
                <h3 className="card-title">{card.title}</h3>
                <button className="card-action-btn" onClick={card.action}>
                  {card.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      {/* CHAT INTERACTIVO (Overlay encima del Dashboard) */}
      {showRecipeChat && (
        <RecipeChat onBack={handleBackToDashboard} />
      )}
    </div>
  );
};

export default Dashboard;