% prolog/main.pl

:- consult('conocimiento/ingredientes.pl').
:- consult('conocimiento/recetas.pl').
:- consult('reglas/restricciones.pl').
:- consult('reglas/compatibilidad.pl').
:- consult('reglas/puntuacion.pl').
:- consult('reglas/recomendacion.pl').

% Consulta principal exposed para ser llamada
recomendar_para_usuario(Usuario, IngredientesDisponibles, TiempoDisponible, Resultado) :-
    recomendar(Usuario, IngredientesDisponibles, TiempoDisponible, Resultado).