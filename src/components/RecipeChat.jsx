import { useState, useEffect, useRef } from "react";
import "../assets/recipechat.css";
import { ingredientsDb, nombreIngrediente } from "../data/catalogoIngredientes";
import { Blobatar } from "@blobatar/react";
import { useGaze } from "@blobatar/react/gaze";
import "blobatar/gaze.css";
import "blobatar/motion.css";
import { supabase } from "../supabaseClient";
import { recipesDetailDb } from "./recipesDetailDb";

// Manejo de la API mediante Netlify / Vite
const API_URL = import.meta.env.VITE_API_URL;
const formatoPesos = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});
const OPCIONES_PRESUPUESTO = [
  { titulo: "Económico", rango: "Hasta $150 MXN", maximo: 150 },
  { titulo: "Intermedio", rango: "Más de $150 y hasta $300 MXN", maximo: 300 },
  { titulo: "Amplio", rango: "Más de $300 y hasta $1,000 MXN", maximo: 1000 },
];

const BlobatarIcon = () => {
  const { ref, lookAt } = useGaze({ travel: 3 });

  useEffect(() => {
    if (lookAt) {
      lookAt("pointer");
    }
  }, [lookAt]);

  return (
    <div className="bot-avatar-container">
      <Blobatar ref={ref} name="Cooki" animate="always" />
    </div>
  );
};

function RecipeChat({ onBack }) {
  const [budget, setBudget] = useState("");
  const [presupuestoMaximo, setPresupuestoMaximo] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [tiempoSeleccionado, setTiempoSeleccionado] = useState(null);
  const [isIngredientsModalOpen, setIsIngredientsModalOpen] = useState(false);
  const [openSections, setOpenSections] = useState({ Proteinas: true });
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [confirmedIngredients, setConfirmedIngredients] = useState([]);

  // Estados de respuesta de la API
  const [loading, setLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [searched, setSearched] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState("");

  // Estado para la ventana flotante de detalle de receta
  const [activeRecipeModal, setActiveRecipeModal] = useState(null);

  const [isClosing, setIsClosing] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentStep, budget, tiempoSeleccionado, loading, recipes]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onBack();
    }, 280);
  };

  const seleccionarPresupuesto = (titulo, rango, maximo) => {
    setBudget(`${titulo} (${rango})`);
    setPresupuestoMaximo(maximo);
    setCurrentStep(2);
  };

  const seleccionarTiempo = (minutos) => {
    setTiempoSeleccionado(minutos);
    setCurrentStep(3);
  };

  const volverAlPaso = (paso) => {
    if (loading) return;

    setTiempoSeleccionado(null);
    setSelectedIngredients([]);
    setConfirmedIngredients([]);
    setIsIngredientsModalOpen(false);
    setRecipes([]);
    setSearched(false);
    setErrorBusqueda("");
    setActiveRecipeModal(null);

    if (paso === 1) {
      setBudget("");
      setPresupuestoMaximo(null);
    }

    setCurrentStep(paso);
  };

  const openModal = () => {
    setSelectedIngredients([...confirmedIngredients]);
    setIsIngredientsModalOpen(true);
  };

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const addIngredient = (ing) => {
    if (!selectedIngredients.includes(ing)) {
      setSelectedIngredients((prev) => [...prev, ing]);
    }
  };

  const removeIngredient = (ing, setFunc) => {
    setFunc((prev) => prev.filter((i) => i !== ing));
  };

  const confirmIngredientsAction = () => {
    setConfirmedIngredients([...selectedIngredients]);
    setIsIngredientsModalOpen(false);
    setCurrentStep(4);
  };

  // Estado para rastrear qué recetas tiene guardadas el usuario
  const [savedRecipeKeys, setSavedRecipeKeys] = useState([]);

  // Cargar las recetas guardadas del usuario al montar el componente
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from("perfiles")
          .select("recetas_guardadas")
          .eq("id", session.user.id)
          .maybeSingle();

        if (!error && data?.recetas_guardadas) {
          setSavedRecipeKeys(data.recetas_guardadas);
        }
      } catch (err) {
        console.error("Error al cargar recetas guardadas:", err);
      }
    };

    fetchSavedRecipes();
  }, []);

  // Función para guardar o remover receta de Supabase
  const handleToggleSaveRecipe = async (recipeKey) => {
    if (!recipeKey || typeof recipeKey !== "string") {
      console.error("recipeKey inválida:", recipeKey);
      return;
    }

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        alert("Debes iniciar sesión para guardar recetas.");
        return;
      }

      const currentList = Array.isArray(savedRecipeKeys)
        ? savedRecipeKeys.filter(
            (k) => typeof k === "string" && k.trim() !== "" && k !== "null",
          )
        : [];

      const isAlreadySaved = currentList.includes(recipeKey);
      const updatedList = isAlreadySaved
        ? currentList.filter((k) => k !== recipeKey)
        : [...currentList, recipeKey];

      const { error } = await supabase
        .from("perfiles")
        .update({ recetas_guardadas: updatedList })
        .eq("id", session.user.id);

      if (error) throw error;

      setSavedRecipeKeys(updatedList);
    } catch (err) {
      console.error("Error al actualizar favoritos:", err);
      alert("No se pudo actualizar tu lista de favoritos.");
    }
  };

  // Abre el detalle flotante de la receta seleccionada
  const handleOpenRecipeDetail = (item) => {
    const rawName =
      item && typeof item === "object" ? item.receta || "" : String(item);
    const key = rawName.toLowerCase().trim().replace(/\s+/g, "_");

    const detailData = recipesDetailDb[key] || {
      nombre: rawName.replace(/_/g, " "),
      tiempo: `${tiempoSeleccionado || 30} min`,
      ingredientes: confirmedIngredients.map((i) => i.replace(/_/g, " ")),
      pasos: [
        "Organizar e inspeccionar los ingredientes.",
        "Sazonar y cocinar los ingredientes en una sartén a fuego medio.",
        "Servir caliente y disfrutar.",
      ],
    };

    setActiveRecipeModal({
      ...detailData,
      key: key,
      costoEstimado: item?.costoEstimado,
      fechaPrecios: item?.fechaPrecios,
      usaPreciosEstimados: item?.usaPreciosEstimados,
      puntuacion: item && typeof item === "object" ? item.puntuacion : null,
    });
  };

  const handleFinalSend = async () => {
    if (loading) return;
    if (
      !OPCIONES_PRESUPUESTO.some(
        (opcion) => opcion.maximo === presupuestoMaximo,
      )
    ) {
      alert("Por favor selecciona un presupuesto.");
      return;
    }
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
    setRecipes([]);
    setActiveRecipeModal(null);
    setErrorBusqueda("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        throw new Error("Debes iniciar sesión para recibir recomendaciones");
      }

      const response = await fetch(`${API_URL}/api/recomendar-perfil`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          ingredientes: confirmedIngredients,
          tiempo: tiempoSeleccionado,
          presupuestoMaximo,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.OK) {
        throw new Error(data.error || "No se pudieron obtener las recetas");
      }

      if (
        !Array.isArray(data.recetas) ||
        data.recetas.some(
          (item) =>
            !Number.isFinite(item?.costoEstimado) ||
            item.costoEstimado <= 0 ||
            item.costoEstimado > presupuestoMaximo,
        )
      ) {
        throw new Error(
          "El servidor no devolvió costos válidos para este presupuesto. Verifica que el backend también esté actualizado.",
        );
      }
      setRecipes(data.recetas);
    } catch (error) {
      console.error("Error al conectar con Prolog:", error);
      setRecipes([]);
      setErrorBusqueda(
        error.message ||
          "No se pudo completar la búsqueda. Intenta nuevamente.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`recipe-chat-view ${isClosing ? "closing" : ""}`}>
      <div className="chat-card-frame">
        <button
          className="chat-back-btn"
          onClick={handleClose}
          aria-label="Volver"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
          </svg>
        </button>

        {/* ÁREA DE CHAT SUPERIOR */}
        <section className="chat-display-area">
          <div className="chat-bubble-row bot">
            <BlobatarIcon />
            <div className="bubbles-column">
              <div className="chat-bubble">
                Primero, iniciemos con algunas preguntas
              </div>
              <div className="chat-bubble">
                <p style={{ margin: "0 0 10px" }}>
                  ¿Cuál es tu presupuesto?
                </p>

                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  <li style={{ marginBottom: "8px" }}>
                    Calculamos los ingredientes principales, sin aceites o
                    sazonadores.
                  </li>
                  <li>
                    Podemos sugerirte recetas más económicas que el rango
                    elegido.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {currentStep >= 2 && (
            <>
              <div className="chat-bubble-row user">
                <div className="chat-bubble-response">{budget}</div>
              </div>
              <div className="chat-bubble-row bot">
                <BlobatarIcon />
                <div className="chat-bubble">
                  ¿Cuánto tiempo tienes disponible para cocinar?
                </div>
              </div>
            </>
          )}

          {tiempoSeleccionado !== null && (
            <>
              <div className="chat-bubble-row user">
                <div className="chat-bubble-response">
                  {tiempoSeleccionado === 30
                    ? "Hasta 30 minutos"
                    : tiempoSeleccionado === 60
                      ? "Hasta 1 hora"
                      : tiempoSeleccionado === 120
                        ? "Hasta 2 horas"
                        : "Hasta 10 horas, incluyendo reposo"}
                </div>
              </div>
              <div className="chat-bubble-row bot">
                <BlobatarIcon />
                <div className="chat-bubble">
                  ¿Qué ingredientes tienes disponibles? Selecciónalos para
                  buscar recetas.
                </div>
              </div>
            </>
          )}

          {loading && (
            <div className="chat-bubble-row bot">
              <BlobatarIcon />
              <div className="chat-bubble">
                Buscando las mejores recetas en el motor Prolog...
              </div>
            </div>
          )}

          {!loading && searched && (
            <div className="chat-bubble-row bot">
              <BlobatarIcon />
              <div className="bubbles-column">
                {recipes.length > 0 && (
                  <div className="chat-bubble">
                    ¡Aquí están tus sugerencias personalizadas! Presiona una
                    opción para ver la receta completa.
                  </div>
                )}
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
                            {item.receta
                              ? item.receta.replace(/_/g, " ")
                              : String(item).replace(/_/g, " ")}
                          </strong>
                          <span className="recipe-card-arrow">➔</span>
                        </div>
                        {item.puntuacion && (
                          <span className="recipe-card-score">
                            Coincidencia: {item.puntuacion}%
                          </span>
                        )}
                        {Number.isFinite(item.costoEstimado) && (
                          <span
                            className="recipe-card-score"
                            style={{ display: "block", marginTop: "5px" }}
                          >
                            Aprox. {formatoPesos.format(item.costoEstimado)} MXN
                            · {item.porciones || 2} porciones
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="chat-bubble"
                    role={errorBusqueda ? "alert" : undefined}
                  >
                    {errorBusqueda ||
                      "No encontré recetas con tus ingredientes que cumplan el presupuesto, el tiempo y las restricciones de tu perfil. Prueba aumentar el presupuesto o el tiempo, o revisar tu selección; conserva las alergias que correspondan."}
                  </div>
                )}
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </section>

        {/* ÁREA DE CONTROLES INFERIOR (ESPACIO CLARO) */}
        <section className="chat-controls-area">
          <div className="controls-separator">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path
                d="M12 5v14M5 12l7 7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {currentStep >= 2 && (
            <div
              className="control-group"
              style={{
                display: "grid",
                gridTemplateColumns:
                  currentStep >= 3 ? "repeat(2, minmax(0, 1fr))" : "1fr",
                gap: "12px",
                alignItems: "stretch",
                marginBottom: "14px",
              }}
            >
              <button
                type="button"
                className="modify-ingredients-btn"
                onClick={() => volverAlPaso(1)}
                disabled={loading}
                style={{
                  width: "100%",
                  minHeight: "34px",
                  padding: "6px 10px",
                  fontSize: "0.75rem",
                  fontFamily: "inherit",
                }}
              >
                Cambiar presupuesto
              </button>

              {currentStep >= 3 && (
                <button
                  type="button"
                  className="modify-ingredients-btn"
                  onClick={() => volverAlPaso(2)}
                  disabled={loading}
                  style={{
                    width: "100%",
                    minHeight: "34px",
                    padding: "6px 10px",
                    fontSize: "0.75rem",
                    fontFamily: "inherit",
                  }}
                >
                  Cambiar tiempo
                </button>
              )}
            </div>
          )}

          {currentStep === 1 && (
            <div
              className="control-group"
              style={{ gap: "10px", flexWrap: "wrap" }}
            >
              {OPCIONES_PRESUPUESTO.map((opcion) => (
                <button
                  key={opcion.titulo}
                  type="button"
                  className="modify-ingredients-btn"
                  onClick={() =>
                    seleccionarPresupuesto(
                      opcion.titulo,
                      opcion.rango,
                      opcion.maximo,
                    )
                  }
                  style={{
                    minWidth: "120px",
                    padding: "10px 14px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "2px",
                  }}
                >
                  <span style={{ fontWeight: "700", fontSize: "0.92rem" }}>
                    {opcion.titulo}
                  </span>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      opacity: 0.85,
                      fontWeight: "normal",
                    }}
                  >
                    {opcion.rango}
                  </span>
                </button>
              ))}
            </div>
          )}

          {currentStep === 2 && (
            <div
              className="control-group"
              style={{ gap: "10px", flexWrap: "wrap" }}
            >
              {[
                { minutos: 30, etiqueta: "Hasta 30 min" },
                { minutos: 60, etiqueta: "Hasta 1 hora" },
                { minutos: 120, etiqueta: "Hasta 2 horas" },
                { minutos: 600, etiqueta: "Hasta 10 horas (incluye reposo)" },
              ].map((opcion) => (
                <button
                  key={opcion.minutos}
                  type="button"
                  className="modify-ingredients-btn"
                  onClick={() => seleccionarTiempo(opcion.minutos)}
                  style={{ minWidth: "125px", padding: "12px 14px" }}
                >
                  {opcion.etiqueta}
                </button>
              ))}
            </div>
          )}

          {currentStep === 3 && (
            <div className="control-group">
              <button className="big-plus-btn" onClick={openModal}>
                <svg
                  width="36"
                  height="36"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                </svg>
              </button>
            </div>
          )}

          {currentStep === 4 && (
            <div className="controls-panel-content">
              {/* VISTA DE INGREDIENTES DENTRO DEL ÁREA DE CONTROL */}
              <div className="bottom-ingredients-scroll">
                {confirmedIngredients.map((ing) => (
                  <div key={ing} className="final-pill">
                    <span>{nombreIngrediente(ing)}</span>
                    <button
                      onClick={() =>
                        removeIngredient(ing, setConfirmedIngredients)
                      }
                      className="pill-remove-btn"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="control-group final-buttons-group">
                <button className="modify-ingredients-btn" onClick={openModal}>
                  Modificar ingredientes
                </button>
                <button
                  className="final-send-btn"
                  onClick={handleFinalSend}
                  disabled={loading}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M5.88 4.12L13.76 12l-7.88 7.88L8 22l10-10L8 2z" />
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
                  {Object.keys(ingredientsDb).map((cat) => (
                    <div
                      key={cat}
                      className={`category-accordion ${openSections[cat] ? "open" : ""}`}
                    >
                      <button
                        className="accordion-trigger"
                        onClick={() => toggleSection(cat)}
                      >
                        {cat} <span>▼</span>
                      </button>
                      <div className="accordion-content">
                        {ingredientsDb[cat].map((ing) => (
                          <div key={ing} className="db-ingredient-item">
                            <span>{nombreIngrediente(ing)}</span>
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
                  {selectedIngredients.map((ing) => (
                    <div key={ing} className="selected-ingredient-pill">
                      <span>{nombreIngrediente(ing)}</span>
                      <button
                        className="remove-pill-btn"
                        onClick={() =>
                          removeIngredient(ing, setSelectedIngredients)
                        }
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="modal-footer-actions">
                <button
                  className="confirm-modal-btn"
                  onClick={confirmIngredientsAction}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* VENTANA FLOTANTE DE DETALLE DE LA RECETA */}
        {activeRecipeModal && (
          <div
            className="recipe-detail-modal-overlay"
            onClick={() => setActiveRecipeModal(null)}
          >
            <div
              className="recipe-detail-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
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
                  <span className="recipe-time-badge">
                    ⏱ {activeRecipeModal.tiempo}
                  </span>
                  {activeRecipeModal.puntuacion && (
                    <span className="recipe-score-badge">
                      Coincidencia: {activeRecipeModal.puntuacion}%
                    </span>
                  )}
                </div>

                {/* BOTÓN GUARDAR / GUARDADA */}
                <button
                  className={`save-recipe-btn ${savedRecipeKeys.includes(activeRecipeModal.key) ? "saved" : ""}`}
                  onClick={() => handleToggleSaveRecipe(activeRecipeModal.key)}
                >
                  {savedRecipeKeys.includes(activeRecipeModal.key)
                    ? "En Guardadas"
                    : "Guardar Receta"}
                </button>
              </div>

              <div className="recipe-detail-body" style={{ gap: 0 }}>
                {activeRecipeModal.descripcion && (
                  <p style={{ margin: "0 0 14px", lineHeight: "1.5" }}>
                    {activeRecipeModal.descripcion}
                  </p>
                )}

                <ul
                  style={{
                    margin: "0 0 20px",
                    paddingLeft: "20px",
                    lineHeight: "1.6",
                  }}
                >
                  <li>
                    <strong>Porciones:</strong>{" "}
                    {activeRecipeModal.porciones || 2} personas.
                  </li>
                  {activeRecipeModal.categoria && (
                    <li>
                      <strong>Categoría:</strong> {activeRecipeModal.categoria}.
                    </li>
                  )}
                  {Number.isFinite(activeRecipeModal.costoEstimado) && (
                    <li>
                      <strong>Costo aproximado:</strong>{" "}
                      {formatoPesos.format(activeRecipeModal.costoEstimado)} MXN
                      {" "}en total.
                    </li>
                  )}
                </ul>

                <section
                  className="recipe-section"
                  style={{ marginBottom: "20px" }}
                >
                  <h3>Ingredientes necesarios</h3>
                  <ul className="recipe-ingredients-list">
                    {activeRecipeModal.ingredientes.map((ing, i) => (
                      <li key={i}>{ing}</li>
                    ))}
                  </ul>
                </section>

                <section
                  className="recipe-section"
                  style={{ marginBottom: "20px" }}
                >
                  <h3>Pasos de preparación</h3>
                  <ol className="recipe-steps-list">
                    {activeRecipeModal.pasos.map((paso, idx) => (
                      <li key={idx}>{paso}</li>
                    ))}
                  </ol>
                </section>

                {activeRecipeModal.fuente && (
                  <div style={{ marginBottom: "16px", fontSize: "0.85rem" }}>
                    <a
                      href={activeRecipeModal.fuente}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Consultar receta de referencia
                    </a>
                    {activeRecipeModal.fuenteTipo && (
                      <p style={{ margin: "6px 0 0", lineHeight: "1.5" }}>
                        {activeRecipeModal.fuenteTipo}
                      </p>
                    )}
                  </div>
                )}

                <aside
                  aria-label="Avisos sobre precios y alérgenos"
                  style={{
                    borderTop: "1px solid #e5e7eb",
                    paddingTop: "12px",
                    color: "#59636e",
                  }}
                >
                  {Number.isFinite(activeRecipeModal.costoEstimado) && (
                    <p
                      style={{
                        margin: "0 0 10px",
                        fontSize: "0.8rem",
                        lineHeight: "1.5",
                      }}
                    >
                      Precios de referencia y estimaciones; pueden variar por
                      tienda y ciudad. Incluye los ingredientes principales.
                      Excluye aceites y condimentos de sazón; tampoco incluye gas y luz.
                    </p>
                  )}
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      lineHeight: "1.5",
                    }}
                  >
                    Revisa las etiquetas de productos envasados y evita el
                    contacto con tus alérgenos. El filtro considera ingredientes
                    registrados y algunos riesgos posibles; no garantiza
                    ausencia de trazas.
                  </p>
                </aside>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeChat;

