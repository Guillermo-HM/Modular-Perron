import { useState, useEffect, useRef } from 'react';
import '../assets/recipechat.css';
import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import "blobatar/gaze.css";
import "blobatar/motion.css";
import { supabase } from "../supabaseClient";

// Manejo de la API mediante Netlify / Vite
const API_URL = import.meta.env.VITE_API_URL;

const BlobatarIcon = () => {
  const { ref, lookAt } = useGaze({ travel: 3 });

  useEffect(() => {
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
  Proteinas: ['pollo', 'pechuga_pollo', 'carne_res', 'lomo_cerdo', 'cerdo', 'pescado_blanco', 'salmon', 'huevo'],
  Vegetales: ['cebolla', 'cebolla_morada', 'ajo', 'pimiento_morron', 'chile_serrano', 'brocoli', 'zanahoria', 'tomate', 'pepino', 'calabacita', 'lechuga_romana'],
  'Cereales y derivados': ['tortilla_maiz', 'tostadas_maiz', 'pasta', 'arroz_blanco_cocido', 'maiz', 'crutones'],
  Frutas: ['limon', 'jugo_limon', 'jugo_naranja', 'aguacate'],
  Hongos: ['champinones'],
  Leguminosas: ['garbanzos_cocidos', 'chicharos'],
  Lacteos: ['queso_fresco', 'media_crema', 'leche', 'mantequilla', 'queso_parmesano', 'yogurt_natural', 'queso_oaxaca', 'queso_panela'],
  'Grasas y aceites': ['aceite_vegetal', 'aceite_oliva', 'aceite_sesamo'],
  Hierbas: ['cilantro', 'perejil', 'epazote', 'cebollin', 'jengibre_fresco'],
  Condimentos: ['sal', 'pimienta', 'oregano', 'comino', 'nuez_moscada', 'paprika', 'ajo_en_polvo'],
  Salsas: ['salsa_verde', 'salsa_soya', 'mostaza'],
  Endulzante: ['miel'],
  Semillas: ['semillas_girasol'],
};

// Base de conocimiento detallada para las tarjetas flotantes
const recipesDetailDb = {
  tacos_pollo_caseros: {
    nombre: 'Tacos de Pollo Caseros',
    tiempo: '25 min',
    ingredientes: ['Pechuga de pollo', 'Tortillas de maíz', 'Cebolla', 'Ajo', 'Aceite vegetal', 'Sal', 'Pimienta'],
    pasos: [
      'Cortar la pechuga de pollo en tiras o cubos pequeños.',
      'Sazonar el pollo con sal, pimienta y ajo picado.',
      'Calentar un poco de aceite en una sartén a fuego medio y freír el pollo con la cebolla picada hasta que esté dorado.',
      'Calentar las tortillas de maíz en un comal.',
      'Servir el pollo bien caliente sobre las tortillas y acompañar con tu salsa favorita.'
    ]
  },
  lomo_cerdo_mostaza: {
    nombre: 'Lomo de Cerdo a la Mostaza',
    tiempo: '40 min',
    ingredientes: ['Lomo de cerdo', 'Mostaza', 'Ajo', 'Aceite de oliva', 'Sal', 'Pimienta', 'Miel (opcional)'],
    pasos: [
      'Sazonar el lomo de cerdo con sal, pimienta y ajo picado.',
      'Mezclar la mostaza con un toque de miel o aceite de oliva.',
      'Untar la mezcla generosamente sobre la carne.',
      'Sellarlo en una sartén caliente con aceite de oliva por todos sus lados.',
      'Tapar y cocinar a fuego medio-bajo durante 20-25 minutos hasta que esté suave y bien cocido.'
    ]
  },
  quesadillas_champinones: {
    nombre: 'Quesadillas de Champiñones',
    tiempo: '15 min',
    ingredientes: ['Champiñones', 'Queso Oaxaca / Panela', 'Tortillas de maíz', 'Cebolla', 'Ajo', 'Epazote o Cilantro', 'Sal'],
    pasos: [
      'Lavar y rebanar los champiñones.',
      'Sofreír la cebolla y el ajo finamente picados en una sartén; agregar los champiñones y la hierba aromática.',
      'Cocinar hasta que se reduzca el jugo de los champiñones y sazonar con sal al gusto.',
      'Colocar queso y una porción de champiñones dentro de cada tortilla.',
      'Calentar en el comal a fuego medio hasta que el queso se derrita por completo.'
    ]
  },
  ceviche_pescado: {
    nombre: 'Ceviche de Pescado Blanco',
    tiempo: '30 min',
    ingredientes: ['Pescado blanco', 'Jugo de limón', 'Cebolla morada', 'Tomate', 'Pepino', 'Cilantro', 'Sal', 'Pimienta'],
    pasos: [
      'Cortar el pescado blanco en cubos pequeños y colocarlo en un recipiente hondo.',
      'Cubrir el pescado con el jugo de limón fresco y dejar marinar en refrigeración durante 20 minutos.',
      'Picar finamente la cebolla morada, el tomate, el pepino y el cilantro.',
      'Mezclar los vegetales picados con el pescado desmenuzado en el limón.',
      'Sazonar con sal y pimienta al gusto y servir bien frío sobre tostadas de maíz.'
    ]
  },
  ensalada_pollo: {
    nombre: 'Ensalada Fresca de Pollo',
    tiempo: '20 min',
    ingredientes: ['Pechuga de pollo', 'Lechuga romana', 'Tomate', 'Pepino', 'Crutones', 'Aceite de oliva', 'Sal', 'Pimienta'],
    pasos: [
      'Cocinar la pechuga de pollo a la plancha sazonada con sal y pimienta; cortar en tiras.',
      'Lavar, desinfectar y trocear la lechuga romana.',
      'Cortar el tomate y el pepino en rodajas o cubos.',
      'En un tazón grande, integrar la lechuga, el tomate, el pepino y las tiras de pollo.',
      'Añadir un chorrito de aceite de oliva, decorar con crutones y servir.'
    ]
  },
  carne_res_verduras: {
    nombre: 'Carne de Res con Verduras',
    tiempo: '35 min',
    ingredientes: ['Carne de res', 'Pimiento morrón', 'Brócoli', 'Zanahoria', 'Cebolla', 'Salsa de soya', 'Aceite vegetal'],
    pasos: [
      'Cortar la carne de res en fajitas o tiras delgadas.',
      'Picar los pimientos, la cebolla, la zanahoria y el brócoli en trozos medianos.',
      'Saltear la carne en una sartén grande o wok con aceite vegetal a fuego alto.',
      'Agregar las verduras y saltearlas durante 5-7 minutos para que queden crujientes.',
      'Vertir un chorrito de salsa de soya, mezclar todo bien y servir caliente.'
    ]
  }
};

function RecipeChat({ onBack }) {
  const [budget, setBudget] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [tempBudgetInput, setTempBudgetInput] = useState("");
  const [tiempoSeleccionado, setTiempoSeleccionado] = useState(null);
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ Proteinas: true });
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [confirmedIngredients, setConfirmedIngredients] = useState([]);

  // Estados de respuesta de la API
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [searched, setSearched] = useState(false);

  // Estado para la ventana flotante de detalle de receta
  const [activeRecipeModal, setActiveRecipeModal] = useState(null);

  const [isClosing, setIsClosing] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentStep, budget, tiempoSeleccionado, loading, recipes]);

  const handleClose = () => {
    setIsClosing(true);
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

  const seleccionarTiempo = (minutos) => {
    setTiempoSeleccionado(minutos);
    setCurrentStep(3);
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
    setCurrentStep(4);
  };

  // Abre el detalle flotante de la receta seleccionada
  const handleOpenRecipeDetail = (item) => {
    const key = (item.receta || String(item)).toLowerCase().trim().replace(/\s+/g, '_');
    const detailData = recipesDetailDb[key] || {
      nombre: (item.receta || String(item)).replace(/_/g, ' '),
      tiempo: `${tiempoSeleccionado || 30} min`,
      ingredientes: confirmedIngredients.map(i => i.replace(/_/g, ' ')),
      pasos: [
        'Organizar e inspeccionar los ingredientes.',
        'Sazonar y cocinar los ingredientes en una sartén a fuego medio.',
        'Servir caliente y disfrutar.'
      ]
    };

    setActiveRecipeModal({
      ...detailData,
      puntuacion: item.puntuacion
    });
  };

  const handleFinalSend = async () => {
    if (confirmedIngredients.length === 0) {
      alert("Por favor selecciona al menos un ingrediente.");
      return;
    }

    if (tiempoSeleccionado === null) {
      alert("Por favor selecciona cuánto tiempo tienes para cocinar.");
      return;
    }

    setLoading(true);
    setSearched(true);

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error('Debes iniciar sesión para recibir recomendaciones');
      }

      const response = await fetch(`${API_URL}/api/recomendar-perfil`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          ingredientes: confirmedIngredients,
          tiempo: tiempoSeleccionado
        })
      });

      const data = await response.json();

      if (!response.ok || !data.OK) {
        throw new Error(data.error || 'No se pudieron obtener las recetas');
      }

      setRecipes(Array.isArray(data.recetas) ? data.recetas : []);
    } catch (error) {
      console.error('Error al conectar con Prolog:', error);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`recipe-chat-view ${isClosing ? 'closing' : ''}`}>
      <div className="chat-card-frame">
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

          {currentStep >= 2 && (
            <>
              <div className="chat-bubble-row user">
                <div className="chat-bubble-response">${budget}</div>
              </div>
              <div className="chat-bubble-row bot">
                <BlobatarIcon />
                <div className="chat-bubble">¿Cuánto tiempo tienes disponible para cocinar?</div>
              </div>
            </>
          )}

          {tiempoSeleccionado !== null && (
            <>
              <div className="chat-bubble-row user">
                <div className="chat-bubble-response">
                  {tiempoSeleccionado === 30 ? 'Hasta 30 minutos' :
                   tiempoSeleccionado === 60 ? 'Hasta 1 hora' : 'Hasta 2 horas'}
                </div>
              </div>
              <div className="chat-bubble-row bot">
                <BlobatarIcon />
                <div className="chat-bubble">¿Qué ingredientes tienes disponibles? Selecciónalos para buscar recetas.</div>
              </div>
            </>
          )}

          {loading && (
            <div className="chat-bubble-row bot">
              <BlobatarIcon />
              <div className="chat-bubble">Buscando las mejores recetas en el motor Prolog... 🍳</div>
            </div>
          )}

          {!loading && searched && (
            <div className="chat-bubble-row bot">
              <BlobatarIcon />
              <div className="bubbles-column">
                <div className="chat-bubble">¡Aquí están tus sugerencias personalizadas! Presiona una opción para ver la receta completa.</div>
                {recipes.length > 0 ? (
                  <div className="recipes-results-list">
                    {recipes.map((item, index) => (
                      <div 
                        key={index} 
                        className="recipe-card-item clickable-recipe"
                        onClick={() => handleOpenRecipeDetail(item)}
                      >
                        <div className="recipe-card-header">
                          <strong className="recipe-card-title">
                            {item.receta ? item.receta.replace(/_/g, ' ') : String(item).replace(/_/g, ' ')}
                          </strong>
                          <span className="recipe-card-arrow">➔</span>
                        </div>
                        {item.puntuacion && (
                          <span className="recipe-card-score">
                            Coincidencia: {item.puntuacion}%
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="chat-bubble">No encontré recetas que coincidan con tus ingredientes.</div>
                )}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </section>

        {/* ÁREA DE CONTROLES INFERIOR (ESPACIO CLARO) */}
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
            <div className="control-group" style={{ gap: '10px', flexWrap: 'wrap' }}>
              {[
                { minutos: 30, etiqueta: 'Hasta 30 min' },
                { minutos: 60, etiqueta: 'Hasta 1 hora' },
                { minutos: 120, etiqueta: 'Hasta 2 horas' }
              ].map(opcion => (
                <button
                  key={opcion.minutos}
                  type="button"
                  className="modify-ingredients-btn"
                  onClick={() => seleccionarTiempo(opcion.minutos)}
                  style={{ minWidth: '125px', padding: '12px 14px' }}
                >
                  {opcion.etiqueta}
                </button>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="control-group">
              <button className="big-plus-btn" onClick={openModal}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 5v14M5 12h14" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="controls-panel-content">
              {/* VISTA DE INGREDIENTES DENTRO DEL ÁREA DE CONTROL */}
              <div className="bottom-ingredients-scroll">
                {confirmedIngredients.map(ing => (
                  <div key={ing} className="final-pill">
                    <span>{ing.replace(/_/g, ' ')}</span>
                    <button onClick={() => removeIngredient(ing, setConfirmedIngredients)} className="pill-remove-btn">×</button>
                  </div>
                ))}
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="control-group final-buttons-group">
                <button className="modify-ingredients-btn" onClick={openModal}>
                  Modificar ingredientes
                </button>
                <button className="final-send-btn" onClick={handleFinalSend} disabled={loading}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* MODAL INTERNO DE SELECCIÓN DE INGREDIENTES */}
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
                            <span>{ing.replace(/_/g, ' ')}</span>
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
                      <span>{ing.replace(/_/g, ' ')}</span>
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

        {/* VENTANA FLOTANTE DE DETALLE DE LA RECETA */}
        {activeRecipeModal && (
          <div className="recipe-detail-modal-overlay" onClick={() => setActiveRecipeModal(null)}>
            <div className="recipe-detail-modal-card" onClick={(e) => e.stopPropagation()}>
              <button 
                className="close-detail-modal-btn" 
                onClick={() => setActiveRecipeModal(null)}
                aria-label="Cerrar receta"
              >
                ×
              </button>

              <div className="recipe-detail-header">
                <h2>{activeRecipeModal.nombre}</h2>
                <div className="recipe-detail-badges">
                  <span className="recipe-time-badge">⏱ {activeRecipeModal.tiempo}</span>
                  {activeRecipeModal.puntuacion && (
                    <span className="recipe-score-badge">Coincidencia: {activeRecipeModal.puntuacion}%</span>
                  )}
                </div>
              </div>

              <div className="recipe-detail-body">
                <section className="recipe-section">
                  <h3>Ingredientes necesarios</h3>
                  <ul className="recipe-ingredients-list">
                    {activeRecipeModal.ingredientes.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </section>

                <section className="recipe-section">
                  <h3>Pasos de preparación</h3>
                  <ol className="recipe-steps-list">
                    {activeRecipeModal.pasos.map((paso, idx) => (
                      <li key={idx}>{paso}</li>
                    ))}
                  </ol>
                </section>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default RecipeChat;