% ==============================================================================
% COOKSMART - SISTEMA DE RECOMENDACION
% Archivo: reglas/recomendacion.pl
% ==============================================================================


% ------------------------------------------------------------------------------
% 1. OBTENER TODAS LAS RECOMENDACIONES
% ------------------------------------------------------------------------------

% Obtiene las recetas que cumplen las condiciones y su puntuacion.

obtener_recomendaciones(
    Usuario,
    Disponibles,
    TiempoDisponible,
    Recomendaciones
) :-
    findall(
        recomendacion(Receta, Puntuacion),
        puntuacion_receta(
            Usuario,
            Receta,
            Disponibles,
            TiempoDisponible,
            Puntuacion
        ),
        Recomendaciones
    ).


% ------------------------------------------------------------------------------
% 2. ORDENAR LAS RECOMENDACIONES
% ------------------------------------------------------------------------------

% Ordena las recomendaciones de mayor a menor puntuacion.
% Si dos recetas tienen la misma puntuacion, se ordenan
% por el identificador de la receta para mantener un orden estable.

comparar_recomendaciones(
    Orden,
    recomendacion(Receta1, Puntuacion1),
    recomendacion(Receta2, Puntuacion2)
) :-
    compare(OrdenPuntuacion, Puntuacion2, Puntuacion1),

    (
        OrdenPuntuacion == (=)
        ->
        compare(OrdenReceta, Receta1, Receta2),
        Orden = OrdenReceta
        ;
        Orden = OrdenPuntuacion
    ).


ordenar_recomendaciones(
    Recomendaciones,
    Ordenadas
) :-
    predsort(
        comparar_recomendaciones,
        Recomendaciones,
        Ordenadas
    ).


% ------------------------------------------------------------------------------
% 3. LIMITAR EL NUMERO DE RECOMENDACIONES
% ------------------------------------------------------------------------------

% Devuelve como maximo la cantidad de elementos indicada.
% Si existen menos elementos, devuelve los que haya disponibles.

tomar_primeras(0, _, []).

tomar_primeras(_, [], []).

tomar_primeras(
    Cantidad,
    [Primero | Resto],
    [Primero | Resultado]
) :-
    Cantidad > 0,
    NuevaCantidad is Cantidad - 1,
    tomar_primeras(
        NuevaCantidad,
        Resto,
        Resultado
    ).


% ------------------------------------------------------------------------------
% 4. OBTENER LAS TRES MEJORES RECOMENDACIONES
% ------------------------------------------------------------------------------

% Flujo principal:
% 1. Obtiene las recetas compatibles.
% 2. Ordena por puntuacion.
% 3. Devuelve como maximo las tres mejores.

recomendar(
    Usuario,
    Disponibles,
    TiempoDisponible,
    Recomendaciones
) :-
    obtener_recomendaciones(
        Usuario,
        Disponibles,
        TiempoDisponible,
        TodasLasRecomendaciones
    ),

    ordenar_recomendaciones(
        TodasLasRecomendaciones,
        RecomendacionesOrdenadas
    ),

    tomar_primeras(
        3,
        RecomendacionesOrdenadas,
        Recomendaciones
    ).