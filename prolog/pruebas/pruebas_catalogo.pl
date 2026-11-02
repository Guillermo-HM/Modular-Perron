:- ensure_loaded('../main.pl').
:- begin_tests(catalogo).

test(doscientas_recetas_sin_duplicados) :-
    findall(Receta, receta(Receta), Recetas),
    length(Recetas, 200),
    sort(Recetas, Unicas),
    length(Unicas, 200).

test(datos_completos) :-
    forall(receta(Receta), (
        findall(Nombre, nombre_receta(Receta, Nombre), [_]),
        tiempo_preparacion(Receta, Tiempo), Tiempo > 0,
        porciones_base(Receta, 2),
        tipo_receta(Receta, plato_principal),
        categoria_receta(Receta, _), dificultad(Receta, _),
        consejo_chef(Receta, _), forma_servir(Receta, _),
        ingrediente_receta(Receta, _, _, _, esencial),
        paso(Receta, 1, _)
    )).

test(ingredientes_reconocidos) :-
    forall(ingrediente_receta(_, Ingrediente, Cantidad, _, _),
        (ingrediente(Ingrediente), Cantidad > 0)).

test(nuevos_platillos_recomendables) :-
    forall(member(Receta, [huevos_mexicana,tacos_garbanzos,pasta_tomate,
        ensalada_garbanzos,calabacitas_maiz,arroz_verduras,quesadillas_pollo,
        pollo_brocoli,tacos_res,pescado_tomate]), (
        findall(Ingrediente, ingrediente_receta(Receta, Ingrediente, _, _, _), Disponibles),
        tiempo_preparacion(Receta, Tiempo),
        obtener_recomendaciones_con_alergias([], Disponibles, Tiempo, Recomendaciones),
        member(recomendacion(Receta, _), Recomendaciones)
    )).

test(filtros_tiempo_y_alergias) :-
    findall(Ingrediente, ingrediente(Ingrediente), Disponibles),
    forall(member(Alergias, [[],[leche],[huevo],[pescado],[gluten]]), (
        recomendar_con_alergias(Alergias, Disponibles, 20, Recomendaciones),
        forall(member(recomendacion(Receta, _), Recomendaciones), (
            tiempo_preparacion(Receta, Tiempo), Tiempo =< 20,
            \+ tiene_conflicto_alergias(Alergias, Receta)
        ))
    )).

test(todas_evaluables_con_su_despensa) :-
    forall(receta(Receta), (
        findall(Ingrediente, ingrediente_receta(Receta, Ingrediente, _, _, _), Disponibles),
        tiempo_preparacion(Receta, Tiempo),
        obtener_recomendaciones_con_alergias([], Disponibles, Tiempo, Recomendaciones),
        member(recomendacion(Receta, _), Recomendaciones)
    )).

test(tres_opciones_solo_huevo, [nondet]) :-
    recomendar_con_alergias([], [huevo], 30, Recomendaciones),
    length(Recomendaciones, 3),
    forall(member(recomendacion(Receta, _), Recomendaciones),
        ingrediente_receta(Receta, huevo, _, _, esencial)).

test(rechazos_explicitos) :-
    forall(member(Alergeno-Receta, [
        huevo-huevos_rancheros, leche-omelette_espinacas,
        lacteos-enchiladas_suizas, gluten-sopa_fideo,
        trigo-pasta_ajo_aceite, soya-pollo_teriyaki_casero,
        pescado-tostadas_atun, crustaceos-camarones_ajillo,
        crustaseos-camarones_ajillo, mariscos-camarones_ajillo,
        sulfitos-camarones_ajillo, cacahuate-pollo_salsa_cacahuate,
        nueces_arbol-pasta_pesto_almendra,
        leguminosas-enfrijoladas_queso, chile-chilaquiles_verdes,
        jitomate-picadillo_papas, tomatillo-chilaquiles_verdes,
        citricos-pasta_atun
    ]), \+ receta_compatible_con_alergias([Alergeno], Receta)).

test(rechazo_por_ingrediente_especifico) :-
    forall(member(Ingrediente-Receta, [almendra-pasta_pesto_almendra,
        camaron-camarones_ajillo, espinaca-omelette_espinacas]),
        \+ receta_compatible_con_alergias([Ingrediente], Receta)).

test(matriz_de_recomendaciones) :-
    findall(Ingrediente, ingrediente(Ingrediente), Disponibles),
    forall((member(Tiempo, [10,15,20,30,45,60]),
        member(Alergias, [[],[leche],[huevo],[gluten],[trigo],[crustaseos],
            [mariscos],[cacahuate],[nueces_arbol],[sulfitos],
            [leche,huevo,trigo,soya,pescado,crustaceos,cacahuate,nueces_arbol]])), (
        recomendar_con_alergias(Alergias, Disponibles, Tiempo, Recomendaciones),
        length(Recomendaciones, Cantidad), Cantidad =< 3,
        forall(member(recomendacion(Receta, _), Recomendaciones), (
            tiempo_preparacion(Receta, Preparacion), Preparacion =< Tiempo,
            \+ tiene_conflicto_alergias(Alergias, Receta)
        ))
    )).

test(pasos_numerados_sin_huecos) :-
    forall(receta(Receta), (
        findall(Numero, paso(Receta, Numero, _), Numeros),
        length(Numeros, Cantidad), numlist(1, Cantidad, Numeros)
    )).

test(no_confundir_cacahuate_y_almendra) :-
    receta_compatible_con_alergias([cacahuate], pasta_pesto_almendra),
    receta_compatible_con_alergias([nueces_arbol], pollo_salsa_cacahuate).

test(alergenos_no_relacionados_permiten_comida) :-
    receta_compatible_con_alergias([leche,huevo,trigo,pescado,crustaceos,
        cacahuate,nueces_arbol,soya,sulfitos], ensalada_garbanzos).

test(cada_ingrediente_activa_busqueda) :-
    forall(ingrediente(Ingrediente), (
        recomendar_con_alergias([], [Ingrediente], 1000, Recomendaciones),
        Recomendaciones = [_|_],
        forall(member(recomendacion(Receta, _), Recomendaciones), (
            ingrediente_receta(Receta, Registrado, _, _, _),
            ingredientes_equivalentes(Ingrediente, Registrado)
        ))
    )).

test(opcionales_tambien_cuentan, [nondet]) :-
    obtener_recomendaciones_con_alergias([], [semillas_girasol], 30, Recomendaciones),
    memberchk(recomendacion(ensalada_pollo, _), Recomendaciones),
    puntuacion_ingredientes(ensalada_pollo, [], SinSemillas),
    puntuacion_ingredientes(ensalada_pollo, [semillas_girasol], ConSemillas),
    ConSemillas > SinSemillas.

test(alias_de_ingredientes) :-
    forall(alias_ingrediente(Alias, Canonico), (
        recomendar_con_alergias([], [Alias], 1000, ConAlias),
        recomendar_con_alergias([], [Canonico], 1000, ConCanonico),
        ConAlias == ConCanonico
    )).

test(excluir_alias_ingrediente) :-
    \+ receta_compatible_con_alergias([almendras], pasta_pesto_almendra),
    \+ receta_compatible_con_alergias([mani], pollo_kung_pao).

test(alergenos_compuestos_nuevos) :-
    forall(member(Ingrediente-Alergeno, [
        tofu-soya, miso-soya, udon-trigo, tahini-sesamo,
        salsa_pescado-pescado, calamar-moluscos, mejillon-moluscos,
        nuez_india-nueces_arbol, cacahuate-cacahuate,
        pan_integral-gluten, avena-gluten, leche_coco-coco
    ]), alergeno_de_ingrediente(Ingrediente, Alergeno)).

test(matriz_todas_las_restricciones) :-
    findall(Ingrediente, ingrediente(Ingrediente), Disponibles),
    forall((alergeno(Alergeno), member(Tiempo, [10,15,20,30,45,60,120,1000])), (
        recomendar_con_alergias([Alergeno], Disponibles, Tiempo, Recomendaciones),
        forall(member(recomendacion(Receta, _), Recomendaciones), (
            cumple_tiempo(Receta, Tiempo),
            \+ contiene_alergeno(Receta, Alergeno)
        ))
    )).

test(restriccion_especifica_de_cada_ingrediente) :-
    forall(ingrediente_receta(Receta, Ingrediente, _, _, _),
        \+ receta_compatible_con_alergias([Ingrediente], Receta)).

:- end_tests(catalogo).
