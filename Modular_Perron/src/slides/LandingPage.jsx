import React, { useState } from "react";
import "../assets/landing.css"; // Importación del CSS modular externo

const slides = [
  {
    id: 1,
    title: "Cocina a tu medida con IA",
    subtitle: "Recomendaciones personalizadas según tu tiempo, presupuesto y alergias.",
    badge: "Asistente Inteligente",
    bgGradient: "linear-gradient(135deg, #2A3B18 0%, #3D5323 100%)",
  },
  {
    id: 2,
    title: "Control total de tu dieta",
    subtitle: "Filtra recetas por conteo de calorías, tipo de dieta y restricciones médicas.",
    badge: "Nutrición & Salud",
    bgGradient: "linear-gradient(135deg, #3D5323 0%, #546E34 100%)",
  },
  {
    id: 3,
    title: "Ahorra en cada comida",
    subtitle: "Dile al chat tu presupuesto disponible y obtén menús optimizados.",
    badge: "Economía del Hogar",
    bgGradient: "linear-gradient(135deg, #1D2318 0%, #2A3B18 100%)",
  },
];

function LandingPage({ onLoginClick, onSignUpClick }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="landing-wrapper">
      {/* 1. NAVBAR */}
      <header className="landing-navbar">
        <div className="landing-brand">
          <span className="brand-cook">Cook</span>
          <span className="brand-smart">Smart</span>
        </div>
        <div className="nav-buttons">
          <button className="btn-login" onClick={onLoginClick}>
            {/* SVG de borde animado simétrico */}
            <svg className="btn-login-svg" viewBox="0 0 100 40" preserveAspectRatio="none">
              {/* Trazo Izquierdo */}
              <path
                className="btn-login-border-path path-left"
                d="M 50 39 L 20 39 A 19 19 0 0 1 1 20 A 19 19 0 0 1 20 1 L 50 1"
              />
              {/* Trazo Derecho */}
              <path
                className="btn-login-border-path path-right"
                d="M 50 39 L 80 39 A 19 19 0 0 0 99 20 A 19 19 0 0 0 80 1 L 50 1"
              />
            </svg>
            <span>Login</span>
          </button>
          <button className="btn-signup" onClick={onSignUpClick}>
            <svg className="btn-signup-svg" viewBox="0 0 100 40" preserveAspectRatio="none">
              {/* Trazo Izquierdo (Desde abajo al centro -> arriba al centro) */}
              <path
                className="btn-border-path path-left"
                d="M 50 39 L 20 39 A 19 19 0 0 1 1 20 A 19 19 0 0 1 20 1 L 50 1"
              />
              {/* Trazo Derecho (Desde abajo al centro -> arriba al centro) */}
              <path
                className="btn-border-path path-right"
                d="M 50 39 L 80 39 A 19 19 0 0 0 99 20 A 19 19 0 0 0 80 1 L 50 1"
              />
            </svg>
            <span>Sign Up</span>
          </button>
        </div>
      </header>

      {/* 2. HERO / CARRUSEL PRINCIPAL */}
      <section className="carousel-container">
        {/* Flecha Izquierda */}
        <button className="carousel-arrow" onClick={prevSlide} aria-label="Anterior">
          &#8592;
        </button>

        {/* Viewport de Slides */}
        <div className="slide-viewport">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide-item ${index === currentSlide ? "active" : ""}`}
              style={{ background: slide.bgGradient }}
            >
              <span className="slide-badge">{slide.badge}</span>
              <h1 className="slide-title">{slide.title}</h1>
              <p className="slide-subtitle">{slide.subtitle}</p>
            </div>
          ))}
        </div>

        {/* Flecha Derecha */}
        <button className="carousel-arrow" onClick={nextSlide} aria-label="Siguiente">
          &#8594;
        </button>

        {/* Indicadores de Puntos */}
        <div className="carousel-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir al slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* 3. SECCIÓN DEMO CHAT */}
      <section className="feature-section">
        <div className="feature-pill-container">
          {/* Tarjeta de Chat */}
          <div className="dark-card">
            <div className="chat-header">
              <div className="chat-status-dot" />
              <span>CookSmart AI Bot</span>
            </div>
            <div className="chat-bubble-bot">
              "¡Hola! 👋 Cuéntame: ¿cuánto tiempo tienes para cocinar hoy y qué ingredientes tienes a la mano?"
            </div>
            <div className="chat-bubble-user">
              "Tengo 20 minutos, $100 pesos y no puedo comer lácteos."
            </div>
            <div className="chat-bubble-bot">
              "¡Entendido! Te recomiendo un <strong>Salteado de Pollo con Verduras y Arroz</strong>. ¿Quieres ver la receta paso a paso?"
            </div>
          </div>

          {/* Descripción */}
          <div className="feature-text-content">
            <h2 className="feature-title">Un asistente de cocina que te escucha</h2>
            <p className="feature-description">
              Olvídate de buscar entre cientos de recetas irrelevantes. Conversa directamente con nuestro bot,
              especifica tus alergias, límite de tiempo o presupuesto, y recibe platillos personalizados al instante.
            </p>
            <div className="tag-group">
              <span className="tag">⚡ Recetas rápidas</span>
              <span className="tag">🥑 Dietas & Alergias</span>
              <span className="tag">💰 Ajustado a tu bolsillo</span>
              <span className="tag">🔥 Conteo calórico</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="landing-footer">
        <p className="footer-text">CookSmart rights reserved © 2026</p>
      </footer>
    </div>
  );
}

export default LandingPage;