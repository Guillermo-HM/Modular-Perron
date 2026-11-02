% Costo aproximado de ingredientes principales para las porciones de la receta.
:- ensure_loaded('../conocimiento/costos.pl').

receta_dentro_presupuesto(Receta, PresupuestoCentavos) :-
    integer(PresupuestoCentavos),
    PresupuestoCentavos > 0,
    costo_receta_centavos(Receta, CostoCentavos),
    CostoCentavos =< PresupuestoCentavos.

% Filtrar ANTES de ordenar y recortar; se conservan alergias, alias y tiempo.
recomendar_con_presupuesto(Alergias, Disponibles, Tiempo, PresupuestoCentavos, Recomendaciones) :-
    findall(recomendacion(Receta, Puntuacion),
        (receta_dentro_presupuesto(Receta, PresupuestoCentavos),
         puntuacion_receta_con_alergias(Alergias, Receta, Disponibles, Tiempo, Puntuacion)),
        Candidatas),
    ordenar_recomendaciones(Candidatas, Ordenadas),
    tomar_primeras(3, Ordenadas, Recomendaciones).
