% ==============================================================================
% COOKSMART - REGLAS DE RESTRICCIONES
% Archivo: reglas/restricciones.pl
% ==============================================================================


% ------------------------------------------------------------------------------
% 1. ALERGIAS E INTOLERANCIAS DEL USUARIO
% ------------------------------------------------------------------------------

% alergia_usuario(Usuario, Alergeno).
% intolerancia_usuario(Usuario, Restriccion).

% Ejemplos de usuarios para pruebas
alergia_usuario(juan, leche).
alergia_usuario(juan, pescado).

intolerancia_usuario(ana, lactosa).


% ------------------------------------------------------------------------------
% 2. DETECTAR ALERGENOS DE UNA RECETA
% ------------------------------------------------------------------------------

% Una receta contiene un alérgeno cuando alguno de sus ingredientes
% está relacionado con ese alérgeno.

contiene_alergeno(Receta, Alergeno) :-
    alergeno_receta(Receta, Alergeno).


% ------------------------------------------------------------------------------
% 3. DETECTAR CONFLICTO ENTRE USUARIO Y RECETA
% ------------------------------------------------------------------------------

% Existe conflicto cuando el usuario tiene una alergia
% correspondiente a un alérgeno presente en la receta.

tiene_conflicto_alergia(Usuario, Receta) :-
    alergia_usuario(Usuario, Alergeno),
    contiene_alergeno(Receta, Alergeno).


% ------------------------------------------------------------------------------
% 4. DETERMINAR SI UNA RECETA ES COMPATIBLE
% ------------------------------------------------------------------------------

% Una receta es compatible cuando el usuario NO tiene
% ninguna alergia que entre en conflicto con ella.

receta_compatible(Usuario, Receta) :-
    receta(Receta),
    \+ tiene_conflicto_alergia(Usuario, Receta).


% ------------------------------------------------------------------------------
% 5. DETERMINAR SI UNA RECETA NO ES COMPATIBLE
% ------------------------------------------------------------------------------

receta_incompatible(Usuario, Receta) :-
    receta(Receta),
    tiene_conflicto_alergia(Usuario, Receta).