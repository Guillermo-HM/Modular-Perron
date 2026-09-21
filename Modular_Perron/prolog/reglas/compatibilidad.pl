% ==============================================================================
% COOKSMART - REGLAS DE COMPATIBILIDAD
% Archivo: reglas/compatibilidad.pl
% ==============================================================================


% ------------------------------------------------------------------------------
% 1. COMPATIBILIDAD CON EL TIEMPO DISPONIBLE
% ------------------------------------------------------------------------------

% La receta es compatible con el tiempo disponible cuando
% su tiempo de preparación es menor o igual al tiempo que tiene el usuario.

cumple_tiempo(Receta, TiempoDisponible) :-
    tiempo_preparacion(Receta, TiempoReceta),
    TiempoReceta =< TiempoDisponible.


% ------------------------------------------------------------------------------
% 2. COMPATIBILIDAD GENERAL
% ------------------------------------------------------------------------------

% Una receta es compatible cuando:
% - Existe en la base de conocimiento.
% - No tiene conflictos de alergias.
% - Cumple con el tiempo disponible.

receta_compatible_con_usuario(Usuario, Receta, TiempoDisponible) :-
    receta(Receta),
    receta_compatible(Usuario, Receta),
    cumple_tiempo(Receta, TiempoDisponible).