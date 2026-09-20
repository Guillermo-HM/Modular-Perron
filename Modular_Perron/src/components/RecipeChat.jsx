import React, { useState, useEffect, useRef } from 'react';
import '../assets/recipechat.css';
import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import "blobatar/gaze.css";
import "blobatar/motion.css";

const BlobatarIcon = () => {
  // Inicializamos useGaze
  const { ref, lookAt } = useGaze({ travel: 3 });

  useEffect(() => {
    // Forzamos al hook a apuntar al cursor global una vez montado
    if (lookAt) {
      lookAt("pointer");
    }
  }, [lookAt]);

  return (
    <div className="bot-avatar-container">
      <Blobatar
        ref={ref}
        name="Cooki"
        animate="always"
      />
    </div>
  );
};

const ingredientsDb = {
  Carnes: ['Res', 'pollo', 'Pescado', 'Cerdo'],
  Verduras: ['Jitomate', 'Cebolla', 'Limón', 'Lechuga'],
  Leguminosos: ['Arroz', 'Frijol', 'Garbanzo', 'Lenteja'],
  Frutas: ['Manzana', 'Plátano', 'Naranja'],
  Granos: ['Trigo', 'Avena', 'Maíz']
};

function RecipeChat({ onBack }) {
  const [budget, setBudget] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [tempBudgetInput, setTempBudgetInput] = useState("");
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ Carnes: true });
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [confirmedIngredients, setConfirmedIngredients] = useState([]);
  
  // Nuevo estado para controlar la animación de salida
  const [isClosing, setIsClosing] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStep, confirmedIngredients, budget]);

  // Handler para la salida animada
  const handleClose = () => {
    setIsClosing(true);
    // Esperamos a que termine la animación de CSS (300ms) antes de desmontar el componente
    setTimeout(() => {
      onBack();
    }, 280);
  };

  const handleSendBudget = () => {
    const val = parseFloat(tempBudgetInput);
    if (!isNaN(val) && val >= 0) {
      setBudget(val);
      setCurrentStep(2);
    }
  };

  const openModal = () => {
    setSelectedIngredients([...confirmedIngredients]);
    setIsIngredientsModalOpen(true);
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const addIngredient = (ing) => {
    if (!selectedIngredients.includes(ing)) {
      setSelectedIngredients(prev => [...prev, ing]);
    }
  };

  const removeIngredient = (ing, setFunc) => {
    setFunc(prev => prev.filter(i => i !== ing));
  };

  const confirmIngredientsAction = () => {
    setConfirmedIngredients([...selectedIngredients]);
    setIsIngredientsModalOpen(false);
    setCurrentStep(3);
  };

  const handleFinalSend = () => {
    alert(`¡Datos listos para enviar al backend!\n\nPresupuesto: $${budget}\nIngredientes: ${confirmedIngredients.join(', ')}`);
  };

  return (
    /* Agregamos la clase 'closing' si el usuario presionó el botón de regreso */
    <div className={`recipe-chat-view ${isClosing ? 'closing' : ''}`}>
      <div className="chat-card-frame">
        {/* Botón Volver con handleClose */}
        <button className="chat-back-btn" onClick={handleClose} aria-label="Volver">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>

        {/* ÁREA DE CHAT SUPERIOR */}
        <section className="chat-display-area">
          <div className="chat-bubble-row bot">
            <BlobatarIcon />
            <div className="bubbles-column">
              <div className="chat-bubble">Primero, iniciemos con algunas preguntas</div>
              <div className="chat-bubble">¿Cuál es tu Presupuesto?</div>
            </div>
          </div>

          {budget > 0 && (
            <>
              <div className="chat-bubble-row user">
                <div className="chat-bubble-response">${budget}</div>
              </div>
              <div className="chat-bubble-row bot">
                <BlobatarIcon />
                <div className="chat-bubble">¿Alguna preferencia en la comida?</div>
              </div>
            </>
          )}

          {currentStep === 3 && confirmedIngredients.length > 0 && (
            <div className="chat-bubble-row user">
              <div className="final-ingredients-container">
                {confirmedIngredients.map(ing => (
                  <div key={ing} className="final-pill">
                    <span>{ing}</span>
                    <button onClick={() => removeIngredient(ing, setConfirmedIngredients)} className="pill-remove-btn">×</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </section>

        {/* ÁREA DE CONTROLES INFERIOR */}
        <section className="chat-controls-area">
          <div className="controls-separator">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {currentStep === 1 && (
            <div className="control-group budget-input-group">
              <div className="input-with-symbol">
                <span className="currency-symbol">$</span>
                <input
                  type="number"
                  value={tempBudgetInput}
                  onChange={(e) => setTempBudgetInput(e.target.value)}
                  placeholder="0"
                  className="budget-input"
                />
              </div>
              <button className="send-arrow-btn" onClick={handleSendBudget}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z"/>
                </svg>
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <div className="control-group">
              <button className="big-plus-btn" onClick={openModal}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}

          {currentStep === 3 && (
            <div className="control-group final-buttons-group">
              <button className="modify-ingredients-btn" onClick={openModal}>
                Modificar ingredientes
              </button>
              <button className="final-send-btn" onClick={handleFinalSend}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z"/>
                </svg>
              </button>
            </div>
          )}
        </section>

        {/* MODAL INTERNO */}
        {isIngredientsModalOpen && (
          <div className="ingredients-modal-overlay">
            <div className="ingredients-modal-content">
              <div className="modal-panels-container">
                <div className="modal-panel">
                  {Object.keys(ingredientsDb).map(cat => (
                    <div key={cat} className={`category-accordion ${openSections[cat] ? 'open' : ''}`}>
                      <button className="accordion-trigger" onClick={() => toggleSection(cat)}>
                        {cat} <span>▼</span>
                      </button>
                      <div className="accordion-content">
                        {ingredientsDb[cat].map(ing => (
                          <div key={ing} className="db-ingredient-item">
                            <span>{ing}</span>
                            <button 
                              className="add-to-list-btn" 
                              onClick={() => addIngredient(ing)}
                              disabled={selectedIngredients.includes(ing)}
                            >
                              +
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="modal-panel">
                  {selectedIngredients.map(ing => (
                    <div key={ing} className="selected-ingredient-pill">
                      <span>{ing}</span>
                      <button className="remove-pill-btn" onClick={() => removeIngredient(ing, setSelectedIngredients)}>×</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer-actions">
                <button className="confirm-modal-btn" onClick={confirmIngredientsAction}>
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeChat;