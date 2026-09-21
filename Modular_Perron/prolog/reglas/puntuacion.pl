% ==============================================================================
% COOKSMART - SISTEMA DE PUNTUACION
% Archivo: reglas/puntuacion.pl
% ==============================================================================


% ------------------------------------------------------------------------------
% 1. PESOS DE LA PUNTUACION
% ------------------------------------------------------------------------------

% Los pesos determinan la importancia de cada criterio.

peso(ingredientes, 60).
peso(tiempo, 40).


% ------------------------------------------------------------------------------
% 2. OBTENER LOS INGREDIENTES ESENCIALES DE UNA RECETA
% ------------------------------------------------------------------------------

% Obtiene únicamente los ingredientes marcados como esenciales
% dentro de recetas.pl.

ingredientes_esenciales(Receta, Ingredientes) :-
    findall(
        Ingrediente,
        ingrediente_receta(Receta, Ingrediente, _, _, esencial),
        Ingredientes
    ).


% ------------------------------------------------------------------------------
% 3. CONTAR INGREDIENTES COINCIDENTES
% ------------------------------------------------------------------------------

% Cuenta cuántos ingredientes esenciales de la receta
% tiene disponibles el usuario.

ingredientes_coincidentes([], _, 0).

ingredientes_coincidentes(
    [Ingrediente | Resto],
    Disponibles,
    Total
) :-
    memberchk(Ingrediente, Disponibles),
    ingredientes_coincidentes(Resto, Disponibles, Coincidentes),
    Total is Coincidentes + 1.

ingredientes_coincidentes(
    [Ingrediente | Resto],
    Disponibles,
    Total
) :-
    \+ memberchk(Ingrediente, Disponibles),
    ingredientes_coincidentes(Resto, Disponibles, Total).


% ------------------------------------------------------------------------------
% 4. PUNTUACION DE INGREDIENTES
% ------------------------------------------------------------------------------

% Convierte la coincidencia de ingredientes en una puntuacion
% de 0 a 60 puntos.

puntuacion_ingredientes(Receta, Disponibles, Puntuacion) :-
    ingredientes_esenciales(Receta, Esenciales),
    length(Esenciales, TotalEsenciales),
    ingredientes_coincidentes(Esenciales, Disponibles, Coincidentes),
    peso(ingredientes, Peso),
    Puntuacion is (Coincidentes / TotalEsenciales) * Peso.


% ------------------------------------------------------------------------------
% 5. PUNTUACION DEL TIEMPO
% ------------------------------------------------------------------------------

% Una receta que utiliza menos tiempo del disponible
% obtiene una puntuacion mayor dentro del criterio de tiempo.

puntuacion_tiempo(Receta, TiempoDisponible, Puntuacion) :-
    tiempo_preparacion(Receta, TiempoReceta),
    TiempoDisponible > 0,
    TiempoReceta =< TiempoDisponible,
    peso(tiempo, Peso),
    Diferencia is TiempoDisponible - TiempoReceta,
    Puntuacion is (Peso / 2) +
                  ((Diferencia / TiempoDisponible) * (Peso / 2)).


% ------------------------------------------------------------------------------
% 6. PUNTUACION TOTAL DE UNA RECETA
% ------------------------------------------------------------------------------

% Una receta solamente se puntua si primero es compatible
% con el usuario y cumple el tiempo disponible.

puntuacion_receta(
    Usuario,
    Receta,
    Disponibles,
    TiempoDisponible,
    Puntuacion
) :-
    receta_compatible_con_usuario(
        Usuario,
        Receta,
        TiempoDisponible
    ),

    puntuacion_ingredientes(
        Receta,
        Disponibles,
        PuntosIngredientes
    ),

    puntuacion_tiempo(
        Receta,
        TiempoDisponible,
        PuntosTiempo
    ),

    Total is PuntosIngredientes + PuntosTiempo,

    Puntuacion is round(Total * 100) / 100.