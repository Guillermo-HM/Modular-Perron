% ==============================================================================
% COOKSMART - REGLAS DE RESTRICCIONES
% Archivo: reglas/restricciones.pl
% ==============================================================================

:- dynamic alergia_usuario/2.
:- dynamic intolerancia_usuario/2.
:- dynamic alergeno/2.

% Ejemplos de usuarios para pruebas
alergia_usuario(juan, leche).
alergia_usuario(juan, pescado).

intolerancia_usuario(ana, lactosa).


% Detectar alérgenos en una receta
contiene_alergeno(Receta, Alergeno) :-
    alergeno_receta(Receta, Alergeno).


% Existe conflicto si el usuario tiene una alergia presente en la receta
tiene_conflicto_alergia(Usuario, Receta) :-
    alergia_usuario(Usuario, Alergeno),
    contiene_alergeno(Receta, Alergeno), !.


% Compatibilidad
receta_compatible(Usuario, Receta) :-
    receta(Receta),
    \+ tiene_conflicto_alergia(Usuario, Receta).


receta_incompatible(Usuario, Receta) :-
    receta(Receta),
    tiene_conflicto_alergia(Usuario, Receta).