:- ensure_loaded('../main.pl').
:- begin_tests(presupuesto).

test(costo_unico_para_cada_receta) :-
    forall(receta(R), (findall(C, costo_receta_centavos(R,C), [Costo]), integer(Costo), Costo > 0)).

test(limite_inclusivo_y_centavo_siguiente) :-
    forall(costo_receta_centavos(R,C),
        (receta_dentro_presupuesto(R,C), Inferior is C-1, \+ receta_dentro_presupuesto(R,Inferior))).

test(receta_desconocida_no_es_gratis) :-
    \+ receta_dentro_presupuesto(no_registrada,100000).

test(presupuesto_invalido, [forall(member(P,[0,-1,150.5,invalido]))]) :-
    \+ receta_dentro_presupuesto(huevos_mexicana,P).

test(filtro_antes_de_tres_mejores) :-
    forall((ingrediente(I), member(P,[15000,30000,100000])), (
        obtener_recomendaciones_con_alergias([], [I], 600, Todas),
        ordenar_recomendaciones(Todas, Ordenadas),
        findall(recomendacion(R,S), (member(recomendacion(R,S),Ordenadas), costo_receta_centavos(R,C), C =< P), Permitidas),
        tomar_primeras(3,Permitidas,Esperadas),
        recomendar_con_presupuesto([], [I],600,P,Resultado),
        assertion(Resultado == Esperadas)
    )).

test(alergias_y_tiempo_con_presupuesto) :-
    findall(I,ingrediente(I),Todos),
    forall((alergeno(A), member(P,[15000,30000,100000]), member(T,[30,120,600])), (
        recomendar_con_presupuesto([A],Todos,T,P,Lista),
        forall(member(recomendacion(R,_),Lista), (
            \+ tiene_conflicto_alergias([A],R),
            tiempo_preparacion(R,TR), TR =< T,
            costo_receta_centavos(R,C), C =< P
        ))
    )).

:- end_tests(presupuesto).
