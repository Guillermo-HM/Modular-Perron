% =========================================================
% COOKSMART - BASE DE CONOCIMIENTO DE RECETAS
% =========================================================


% =========================================================
% 1. RECETAS
% =========================================================

receta(tacos_pollo_caseros).
receta(carne_res_verduras).
receta(lomo_cerdo_mostaza).
receta(ceviche_pescado).
receta(pasta_pollo_champinones).
receta(bowl_garbanzos_verduras).
receta(quesadillas_champinones).
receta(salmon_limon_verduras).
receta(arroz_frito_cerdo).
receta(ensalada_pollo).


% =========================================================
% 2. NOMBRES
% =========================================================

nombre_receta(tacos_pollo_caseros, 'Tacos de pollo caseros').
nombre_receta(carne_res_verduras, 'Carne de res salteada con verduras').
nombre_receta(lomo_cerdo_mostaza, 'Lomo de cerdo en salsa de mostaza').
nombre_receta(ceviche_pescado, 'Ceviche de pescado').
nombre_receta(pasta_pollo_champinones, 'Pasta cremosa con pollo y champiñones').
nombre_receta(bowl_garbanzos_verduras, 'Bowl de arroz con garbanzos y verduras').
nombre_receta(quesadillas_champinones, 'Quesadillas de champiñones').
nombre_receta(salmon_limon_verduras, 'Salmon al limón con verduras').
nombre_receta(arroz_frito_cerdo, 'Arroz frito con cerdo y verduras').
nombre_receta(ensalada_pollo, 'Ensalada completa de pollo').


% =========================================================
% 3. TIPO DE RECETA
% =========================================================

tipo_receta(tacos_pollo_caseros, plato_principal).
tipo_receta(carne_res_verduras, plato_principal).
tipo_receta(lomo_cerdo_mostaza, plato_principal).
tipo_receta(ceviche_pescado, plato_principal).
tipo_receta(pasta_pollo_champinones, plato_principal).
tipo_receta(bowl_garbanzos_verduras, plato_principal).
tipo_receta(quesadillas_champinones, plato_principal).
tipo_receta(salmon_limon_verduras, plato_principal).
tipo_receta(arroz_frito_cerdo, plato_principal).
tipo_receta(ensalada_pollo, plato_principal).


% =========================================================
% 4. CATEGORÍAS
% =========================================================

categoria_receta(tacos_pollo_caseros, mexicana).
categoria_receta(carne_res_verduras, internacional).
categoria_receta(lomo_cerdo_mostaza, internacional).
categoria_receta(ceviche_pescado, latinoamericana).
categoria_receta(pasta_pollo_champinones, italiana).
categoria_receta(bowl_garbanzos_verduras, internacional).
categoria_receta(quesadillas_champinones, mexicana).
categoria_receta(salmon_limon_verduras, internacional).
categoria_receta(arroz_frito_cerdo, asiatica).
categoria_receta(ensalada_pollo, internacional).


% =========================================================
% 5. DIFICULTAD
% =========================================================

dificultad(tacos_pollo_caseros, facil).
dificultad(carne_res_verduras, facil).
dificultad(lomo_cerdo_mostaza, facil).
dificultad(ceviche_pescado, facil).
dificultad(pasta_pollo_champinones, facil).
dificultad(bowl_garbanzos_verduras, facil).
dificultad(quesadillas_champinones, facil).
dificultad(salmon_limon_verduras, facil).
dificultad(arroz_frito_cerdo, facil).
dificultad(ensalada_pollo, facil).


% =========================================================
% 6. TIEMPO DE PREPARACIÓN
% =========================================================

tiempo_preparacion(tacos_pollo_caseros, 30).
tiempo_preparacion(carne_res_verduras, 30).
tiempo_preparacion(lomo_cerdo_mostaza, 35).
tiempo_preparacion(ceviche_pescado, 30).
tiempo_preparacion(pasta_pollo_champinones, 30).
tiempo_preparacion(bowl_garbanzos_verduras, 35).
tiempo_preparacion(quesadillas_champinones, 25).
tiempo_preparacion(salmon_limon_verduras, 30).
tiempo_preparacion(arroz_frito_cerdo, 30).
tiempo_preparacion(ensalada_pollo, 25).


% =========================================================
% 7. PORCIONES BASE
% =========================================================

porciones_base(tacos_pollo_caseros, 2).
porciones_base(carne_res_verduras, 2).
porciones_base(lomo_cerdo_mostaza, 2).
porciones_base(ceviche_pescado, 2).
porciones_base(pasta_pollo_champinones, 2).
porciones_base(bowl_garbanzos_verduras, 2).
porciones_base(quesadillas_champinones, 2).
porciones_base(salmon_limon_verduras, 2).
porciones_base(arroz_frito_cerdo, 2).
porciones_base(ensalada_pollo, 2).


% =========================================================
% 8. INGREDIENTES
% =========================================================


% ---------- Tacos de pollo ----------

ingrediente_receta(tacos_pollo_caseros, pollo, 500, gramos, esencial).
ingrediente_receta(tacos_pollo_caseros, tortilla_maiz, 8, piezas, esencial).
ingrediente_receta(tacos_pollo_caseros, cebolla, 0.5, pieza, esencial).
ingrediente_receta(tacos_pollo_caseros, ajo, 1, diente, esencial).
ingrediente_receta(tacos_pollo_caseros, aceite_vegetal, 1, cucharada, esencial).
ingrediente_receta(tacos_pollo_caseros, sal, 1, cucharadita, esencial).
ingrediente_receta(tacos_pollo_caseros, pimienta, 0.5, cucharadita, esencial).
ingrediente_receta(tacos_pollo_caseros, oregano, 0.5, cucharadita, opcional).
ingrediente_receta(tacos_pollo_caseros, comino, 0.25, cucharadita, opcional).
ingrediente_receta(tacos_pollo_caseros, cilantro, 2, cucharadas, opcional).
ingrediente_receta(tacos_pollo_caseros, salsa_verde, 4, cucharadas, opcional).
ingrediente_receta(tacos_pollo_caseros, queso_fresco, 30, gramos, opcional).


% ---------- Carne de res ----------

ingrediente_receta(carne_res_verduras, carne_res, 500, gramos, esencial).
ingrediente_receta(carne_res_verduras, cebolla, 0.5, pieza, esencial).
ingrediente_receta(carne_res_verduras, pimiento_morron, 1, pieza, esencial).
ingrediente_receta(carne_res_verduras, ajo, 1, diente, esencial).
ingrediente_receta(carne_res_verduras, aceite_vegetal, 1, cucharada, esencial).
ingrediente_receta(carne_res_verduras, sal, 1, cucharadita, esencial).
ingrediente_receta(carne_res_verduras, pimienta, 0.5, cucharadita, esencial).
ingrediente_receta(carne_res_verduras, salsa_soya, 2, cucharadas, opcional).
ingrediente_receta(carne_res_verduras, chile_serrano, 1, pieza, opcional).
ingrediente_receta(carne_res_verduras, brocoli, 0.5, taza, opcional).
ingrediente_receta(carne_res_verduras, zanahoria, 0.5, pieza, opcional).
ingrediente_receta(carne_res_verduras, cilantro, 2, cucharadas, opcional).


% ---------- Lomo de cerdo ----------

ingrediente_receta(lomo_cerdo_mostaza, lomo_cerdo, 500, gramos, esencial).
ingrediente_receta(lomo_cerdo_mostaza, aceite_vegetal, 1, cucharada, esencial).
ingrediente_receta(lomo_cerdo_mostaza, cebolla, 0.5, pieza, esencial).
ingrediente_receta(lomo_cerdo_mostaza, ajo, 1, diente, esencial).
ingrediente_receta(lomo_cerdo_mostaza, mostaza, 2, cucharadas, esencial).
ingrediente_receta(lomo_cerdo_mostaza, media_crema, 0.5, taza, esencial).
ingrediente_receta(lomo_cerdo_mostaza, sal, 1, cucharadita, esencial).
ingrediente_receta(lomo_cerdo_mostaza, pimienta, 0.5, cucharadita, esencial).
ingrediente_receta(lomo_cerdo_mostaza, miel, 1, cucharada, opcional).
ingrediente_receta(lomo_cerdo_mostaza, limon, 0.5, pieza, opcional).
ingrediente_receta(lomo_cerdo_mostaza, champinones, 150, gramos, opcional).
ingrediente_receta(lomo_cerdo_mostaza, perejil, 2, cucharadas, opcional).


% ---------- Ceviche de pescado ----------

ingrediente_receta(ceviche_pescado, pescado_blanco, 400, gramos, esencial).
ingrediente_receta(ceviche_pescado, cebolla_morada, 0.5, pieza, esencial).
ingrediente_receta(ceviche_pescado, tomate, 2, piezas, esencial).
ingrediente_receta(ceviche_pescado, pepino, 1, pieza, esencial).
ingrediente_receta(ceviche_pescado, jugo_limon, 0.5, taza, esencial).
ingrediente_receta(ceviche_pescado, cilantro, 2, cucharadas, esencial).
ingrediente_receta(ceviche_pescado, sal, 1, cucharadita, esencial).
ingrediente_receta(ceviche_pescado, pimienta, 0.5, cucharadita, esencial).
ingrediente_receta(ceviche_pescado, chile_serrano, 1, pieza, opcional).
ingrediente_receta(ceviche_pescado, aguacate, 0.5, pieza, opcional).
ingrediente_receta(ceviche_pescado, jugo_naranja, 2, cucharadas, opcional).
ingrediente_receta(ceviche_pescado, tostadas_maiz, 6, piezas, opcional).


% ---------- Pasta cremosa con pollo ----------

ingrediente_receta(pasta_pollo_champinones, pasta, 200, gramos, esencial).
ingrediente_receta(pasta_pollo_champinones, pollo, 300, gramos, esencial).
ingrediente_receta(pasta_pollo_champinones, champinones, 150, gramos, esencial).
ingrediente_receta(pasta_pollo_champinones, cebolla, 0.5, pieza, esencial).
ingrediente_receta(pasta_pollo_champinones, ajo, 1, diente, esencial).
ingrediente_receta(pasta_pollo_champinones, media_crema, 0.5, taza, esencial).
ingrediente_receta(pasta_pollo_champinones, leche, 0.25, taza, esencial).
ingrediente_receta(pasta_pollo_champinones, mantequilla, 1, cucharada, esencial).
ingrediente_receta(pasta_pollo_champinones, queso_parmesano, 30, gramos, esencial).
ingrediente_receta(pasta_pollo_champinones, sal, 1, cucharadita, esencial).
ingrediente_receta(pasta_pollo_champinones, pimienta, 0.5, cucharadita, esencial).
ingrediente_receta(pasta_pollo_champinones, perejil, 2, cucharadas, opcional).
ingrediente_receta(pasta_pollo_champinones, oregano, 0.5, cucharadita, opcional).
ingrediente_receta(pasta_pollo_champinones, nuez_moscada, 0.25, cucharadita, opcional).


% ---------- Bowl de arroz con garbanzos ----------

ingrediente_receta(bowl_garbanzos_verduras, arroz_blanco_cocido, 1, taza, esencial).
ingrediente_receta(bowl_garbanzos_verduras, garbanzos_cocidos, 1, taza, esencial).
ingrediente_receta(bowl_garbanzos_verduras, zanahoria, 0.5, pieza, esencial).
ingrediente_receta(bowl_garbanzos_verduras, pimiento_morron, 0.5, pieza, esencial).
ingrediente_receta(bowl_garbanzos_verduras, calabacita, 0.5, pieza, esencial).
ingrediente_receta(bowl_garbanzos_verduras, cebolla, 0.25, pieza, esencial).
ingrediente_receta(bowl_garbanzos_verduras, ajo, 1, diente, esencial).
ingrediente_receta(bowl_garbanzos_verduras, aceite_oliva, 1, cucharada, esencial).
ingrediente_receta(bowl_garbanzos_verduras, sal, 1, cucharadita, esencial).
ingrediente_receta(bowl_garbanzos_verduras, pimienta, 0.5, cucharadita, esencial).
ingrediente_receta(bowl_garbanzos_verduras, aguacate, 0.5, pieza, opcional).
ingrediente_receta(bowl_garbanzos_verduras, limon, 0.5, pieza, opcional).
ingrediente_receta(bowl_garbanzos_verduras, cilantro, 2, cucharadas, opcional).
ingrediente_receta(bowl_garbanzos_verduras, paprika, 0.5, cucharadita, opcional).
ingrediente_receta(bowl_garbanzos_verduras, comino, 0.25, cucharadita, opcional).
ingrediente_receta(bowl_garbanzos_verduras, yogurt_natural, 2, cucharadas, opcional).


% ---------- Quesadillas de champiñones ----------

ingrediente_receta(quesadillas_champinones, tortilla_maiz, 8, piezas, esencial).
ingrediente_receta(quesadillas_champinones, champinones, 250, gramos, esencial).
ingrediente_receta(quesadillas_champinones, cebolla, 0.5, pieza, esencial).
ingrediente_receta(quesadillas_champinones, ajo, 1, diente, esencial).
ingrediente_receta(quesadillas_champinones, queso_oaxaca, 150, gramos, esencial).
ingrediente_receta(quesadillas_champinones, aceite_vegetal, 1, cucharada, esencial).
ingrediente_receta(quesadillas_champinones, sal, 1, cucharadita, esencial).
ingrediente_receta(quesadillas_champinones, pimienta, 0.5, cucharadita, esencial).
ingrediente_receta(quesadillas_champinones, chile_serrano, 1, pieza, opcional).
ingrediente_receta(quesadillas_champinones, tomate, 1, pieza, opcional).
ingrediente_receta(quesadillas_champinones, epazote, 2, cucharadas, opcional).
ingrediente_receta(quesadillas_champinones, cilantro, 2, cucharadas, opcional).
ingrediente_receta(quesadillas_champinones, salsa_verde, 4, cucharadas, opcional).
ingrediente_receta(quesadillas_champinones, aguacate, 0.5, pieza, opcional).


% ---------- Salmón al limón ----------

ingrediente_receta(salmon_limon_verduras, salmon, 350, gramos, esencial).
ingrediente_receta(salmon_limon_verduras, aceite_oliva, 1, cucharada, esencial).
ingrediente_receta(salmon_limon_verduras, ajo, 1, diente, esencial).
ingrediente_receta(salmon_limon_verduras, limon, 0.5, pieza, esencial).
ingrediente_receta(salmon_limon_verduras, sal, 1, cucharadita, esencial).
ingrediente_receta(salmon_limon_verduras, pimienta, 0.5, cucharadita, esencial).
ingrediente_receta(salmon_limon_verduras, zanahoria, 1, pieza, esencial).
ingrediente_receta(salmon_limon_verduras, pimiento_morron, 1, pieza, esencial).
ingrediente_receta(salmon_limon_verduras, calabacita, 1, pieza, esencial).
ingrediente_receta(salmon_limon_verduras, mantequilla, 1, cucharadita, opcional).
ingrediente_receta(salmon_limon_verduras, perejil, 2, cucharadas, opcional).
ingrediente_receta(salmon_limon_verduras, paprika, 0.5, cucharadita, opcional).
ingrediente_receta(salmon_limon_verduras, ajo_en_polvo, 0.5, cucharadita, opcional).
ingrediente_receta(salmon_limon_verduras, miel, 1, cucharadita, opcional).


% ---------- Arroz frito con cerdo ----------

ingrediente_receta(arroz_frito_cerdo, arroz_blanco_cocido, 2, tazas, esencial).
ingrediente_receta(arroz_frito_cerdo, cerdo, 300, gramos, esencial).
ingrediente_receta(arroz_frito_cerdo, zanahoria, 1, pieza, esencial).
ingrediente_receta(arroz_frito_cerdo, cebolla, 0.5, pieza, esencial).
ingrediente_receta(arroz_frito_cerdo, ajo, 1, diente, esencial).
ingrediente_receta(arroz_frito_cerdo, huevo, 1, pieza, esencial).
ingrediente_receta(arroz_frito_cerdo, aceite_vegetal, 1, cucharada, esencial).
ingrediente_receta(arroz_frito_cerdo, sal, 1, cucharadita, esencial).
ingrediente_receta(arroz_frito_cerdo, pimienta, 0.5, cucharadita, esencial).
ingrediente_receta(arroz_frito_cerdo, chicharos, 0.5, taza, opcional).
ingrediente_receta(arroz_frito_cerdo, cebollin, 2, cucharadas, opcional).
ingrediente_receta(arroz_frito_cerdo, salsa_soya, 2, cucharadas, opcional).
ingrediente_receta(arroz_frito_cerdo, jengibre_fresco, 0.5, cucharadita, opcional).
ingrediente_receta(arroz_frito_cerdo, aceite_sesamo, 1, cucharadita, opcional).


% ---------- Ensalada completa de pollo ----------

ingrediente_receta(ensalada_pollo, pechuga_pollo, 300, gramos, esencial).
ingrediente_receta(ensalada_pollo, lechuga_romana, 1, pieza, esencial).
ingrediente_receta(ensalada_pollo, tomate, 1, pieza, esencial).
ingrediente_receta(ensalada_pollo, pepino, 1, pieza, esencial).
ingrediente_receta(ensalada_pollo, cebolla_morada, 0.5, pieza, esencial).
ingrediente_receta(ensalada_pollo, aguacate, 0.5, pieza, esencial).
ingrediente_receta(ensalada_pollo, aceite_oliva, 2, cucharadas, esencial).
ingrediente_receta(ensalada_pollo, jugo_limon, 1, cucharada, esencial).
ingrediente_receta(ensalada_pollo, sal, 1, cucharadita, esencial).
ingrediente_receta(ensalada_pollo, pimienta, 0.5, cucharadita, esencial).
ingrediente_receta(ensalada_pollo, maiz, 0.5, taza, opcional).
ingrediente_receta(ensalada_pollo, crutones, 0.5, taza, opcional).
ingrediente_receta(ensalada_pollo, queso_panela, 30, gramos, opcional).
ingrediente_receta(ensalada_pollo, semillas_girasol, 1, cucharada, opcional).
ingrediente_receta(ensalada_pollo, mostaza, 1, cucharadita, opcional).
ingrediente_receta(ensalada_pollo, miel, 1, cucharadita, opcional).


% =========================================================
% 9. PREPARACIÓN
% =========================================================


% ---------- Tacos de pollo ----------

paso(tacos_pollo_caseros, 1,
    'Pica finamente la cebolla y el ajo.').

paso(tacos_pollo_caseros, 2,
    'Calienta el aceite en un sartén a fuego medio y sofríe la cebolla durante unos minutos. Agrega el ajo y cocina brevemente.').

paso(tacos_pollo_caseros, 3,
    'Agrega el pollo deshebrado, la sal, la pimienta y, si deseas, el orégano y el comino. Mezcla bien y cocina durante unos 5 minutos.').

paso(tacos_pollo_caseros, 4,
    'Calienta las tortillas en un comal o sartén hasta que estén suaves y calientes.').

paso(tacos_pollo_caseros, 5,
    'Sirve el pollo sobre las tortillas y agrega al gusto cilantro, salsa verde y queso fresco.').

paso(tacos_pollo_caseros, 6,
    'Si quieres preparar tacos dorados, coloca el relleno en las tortillas, dóblalas y fríelas hasta que estén doradas y crujientes.').


% ---------- Carne de res ----------

paso(carne_res_verduras, 1,
    'Corta la carne de res en tiras delgadas. Corta la cebolla y el pimiento morrón en tiras y pica finamente el ajo.').

paso(carne_res_verduras, 2,
    'Calienta el aceite en un sartén grande a fuego medio-alto. Agrega la cebolla y el pimiento morrón y cocina durante 3 a 4 minutos, moviendo ocasionalmente.').

paso(carne_res_verduras, 3,
    'Agrega la carne de res al mismo sartén y cocina hasta que esté bien cocida y ligeramente dorada.').

paso(carne_res_verduras, 4,
    'Agrega el ajo, la sal y la pimienta. Si deseas, incorpora la salsa de soya y el chile serrano. Cocina durante 1 a 2 minutos más.').

paso(carne_res_verduras, 5,
    'Si deseas utilizar brócoli o zanahoria, agrégalos junto con las demás verduras y cocina hasta que estén suaves pero todavía firmes.').

paso(carne_res_verduras, 6,
    'Sirve la carne caliente y, si deseas, agrega cilantro al gusto.').


% ---------- Lomo de cerdo ----------

paso(lomo_cerdo_mostaza, 1,
    'Corta el lomo de cerdo en medallones o tiras de tamaño similar. Pica finamente la cebolla y el ajo.').

paso(lomo_cerdo_mostaza, 2,
    'Calienta el aceite en un sartén a fuego medio-alto. Sella el cerdo por ambos lados hasta que esté ligeramente dorado y retíralo temporalmente del sartén.').

paso(lomo_cerdo_mostaza, 3,
    'En el mismo sartén, sofríe la cebolla durante unos minutos. Agrega el ajo y cocina brevemente.').

paso(lomo_cerdo_mostaza, 4,
    'Agrega la mostaza y la media crema. Mezcla a fuego bajo hasta obtener una salsa uniforme. Añade sal y pimienta al gusto.').

paso(lomo_cerdo_mostaza, 5,
    'Regresa el cerdo al sartén y cocina a fuego bajo hasta que esté completamente cocido y la salsa haya tomado consistencia.').

paso(lomo_cerdo_mostaza, 6,
    'Si deseas, agrega un poco de miel, limón, champiñones o perejil para variar el sabor.').


% ---------- Ceviche de pescado ----------

paso(ceviche_pescado, 1,
    'Corta el pescado en cubos pequeños y uniformes. Pica finamente la cebolla morada, el tomate, el pepino y el cilantro.').

paso(ceviche_pescado, 2,
    'Coloca el pescado en un recipiente limpio y agrega el jugo de limón. Mezcla suavemente y deja reposar en refrigeración mientras preparas los demás ingredientes.').

paso(ceviche_pescado, 3,
    'Agrega la cebolla morada, el tomate, el pepino y el cilantro al pescado.').

paso(ceviche_pescado, 4,
    'Añade sal y pimienta al gusto. Si deseas, agrega chile serrano o un poco de jugo de naranja.').

paso(ceviche_pescado, 5,
    'Mezcla cuidadosamente todos los ingredientes y mantén el ceviche refrigerado hasta el momento de servir.').

paso(ceviche_pescado, 6,
    'Sirve acompañado de tostadas de maíz y, si deseas, agrega aguacate al gusto.').


% ---------- Pasta cremosa con pollo ----------

paso(pasta_pollo_champinones, 1,
    'Cocina la pasta siguiendo las indicaciones del paquete. Escúrrela y reserva una pequeña cantidad del agua de cocción.').

paso(pasta_pollo_champinones, 2,
    'Corta el pollo en trozos pequeños y los champiñones en rebanadas. Pica finamente la cebolla y el ajo.').

paso(pasta_pollo_champinones, 3,
    'Derrite la mantequilla en un sartén grande a fuego medio. Agrega el pollo y cocina hasta que esté completamente cocido. Añade la cebolla, el ajo y los champiñones y cocina hasta que estén suaves.').

paso(pasta_pollo_champinones, 4,
    'Retira el pollo y los champiñones del sartén y resérvalos en un recipiente limpio.').

paso(pasta_pollo_champinones, 5,
    'En el mismo sartén, agrega la media crema y la leche. Mezcla a fuego bajo y añade el queso parmesano, la sal y la pimienta hasta formar una salsa cremosa.').

paso(pasta_pollo_champinones, 6,
    'Agrega la pasta a la salsa y mezcla. Si la salsa está demasiado espesa, añade un poco del agua de cocción reservada.').

paso(pasta_pollo_champinones, 7,
    'Regresa el pollo y los champiñones al sartén. Mezcla cuidadosamente y, si deseas, agrega perejil, orégano o una pequeña cantidad de nuez moscada.').


% ---------- Bowl de arroz con garbanzos ----------

paso(bowl_garbanzos_verduras, 1,
    'Corta la zanahoria, el pimiento morrón, la calabacita y la cebolla en trozos pequeños. Pica finamente el ajo.').

paso(bowl_garbanzos_verduras, 2,
    'Calienta el aceite de oliva en un sartén a fuego medio. Agrega la cebolla y el ajo y cocina durante unos minutos.').

paso(bowl_garbanzos_verduras, 3,
    'Agrega la zanahoria, el pimiento morrón y la calabacita. Cocina hasta que las verduras estén suaves pero todavía firmes.').

paso(bowl_garbanzos_verduras, 4,
    'Agrega los garbanzos cocidos, la sal y la pimienta. Si deseas, añade paprika y comino y mezcla durante unos minutos.').

paso(bowl_garbanzos_verduras, 5,
    'Coloca el arroz blanco cocido en un tazón y agrega encima la mezcla de garbanzos y verduras.').

paso(bowl_garbanzos_verduras, 6,
    'Si deseas, agrega aguacate, cilantro, limón o yogurt natural antes de servir.').


% ---------- Quesadillas de champiñones ----------

paso(quesadillas_champinones, 1,
    'Limpia y corta los champiñones en rebanadas. Pica finamente la cebolla y el ajo.').

paso(quesadillas_champinones, 2,
    'Calienta el aceite en un sartén a fuego medio. Agrega la cebolla y cocina durante unos minutos. Añade el ajo y los champiñones.').

paso(quesadillas_champinones, 3,
    'Cocina los champiñones hasta que reduzcan su tamaño y pierdan la mayor parte de su humedad. Agrega sal y pimienta al gusto.').

paso(quesadillas_champinones, 4,
    'Calienta una tortilla en un comal o sartén. Coloca una porción de queso Oaxaca y agrega los champiñones sobre una mitad.').

paso(quesadillas_champinones, 5,
    'Dobla la tortilla y cocina por ambos lados hasta que el queso se derrita y la tortilla esté ligeramente dorada.').

paso(quesadillas_champinones, 6,
    'Sirve las quesadillas calientes y acompaña con salsa, cilantro, aguacate o los ingredientes opcionales que prefieras.').


% ---------- Salmón al limón ----------

paso(salmon_limon_verduras, 1,
    'Corta la zanahoria, el pimiento morrón y la calabacita en piezas de tamaño similar. Pica finamente el ajo.').

paso(salmon_limon_verduras, 2,
    'Sazona los filetes de salmon con sal y pimienta.').

paso(salmon_limon_verduras, 3,
    'Calienta el aceite de oliva en un sartén grande a fuego medio. Agrega la zanahoria, el pimiento morrón y la calabacita y cocina hasta que estén suaves pero todavía firmes. Retira las verduras y resérvalas en un recipiente limpio.').

paso(salmon_limon_verduras, 4,
    'En el mismo sartén, coloca los filetes de salmon y cocina por ambos lados hasta que estén completamente cocidos.').

paso(salmon_limon_verduras, 5,
    'Agrega el ajo y el jugo de limón al sartén. Si deseas, incorpora la mantequilla y el perejil. Cocina durante unos minutos, bañando ligeramente el salmón con la mezcla.').

paso(salmon_limon_verduras, 6,
    'Sirve el salmon acompañado de las verduras. Si deseas, agrega paprika, ajo en polvo o una pequeña cantidad de miel.').


% ---------- Arroz frito con cerdo ----------

paso(arroz_frito_cerdo, 1,
    'Corta el cerdo y la zanahoria en trozos pequeños. Pica finamente la cebolla y el ajo.').

paso(arroz_frito_cerdo, 2,
    'Calienta el aceite en un sartén grande o wok a fuego medio-alto. Agrega el cerdo y cocina hasta que esté completamente cocido y ligeramente dorado.').

paso(arroz_frito_cerdo, 3,
    'Agrega la cebolla, la zanahoria y el ajo. Cocina durante unos minutos hasta que las verduras comiencen a suavizarse.').

paso(arroz_frito_cerdo, 4,
    'Mueve los ingredientes hacia un lado del sartén. Agrega el huevo en el espacio libre y revuelve hasta que esté completamente cocido.').

paso(arroz_frito_cerdo, 5,
    'Agrega el arroz blanco cocido y frío. Mezcla todos los ingredientes y cocina durante unos minutos, moviendo constantemente para evitar que se pegue.').

paso(arroz_frito_cerdo, 6,
    'Agrega sal y pimienta. Si deseas, incorpora salsa de soya, chícharos, cebollín, jengibre fresco o aceite de sésamo.').


% ---------- Ensalada completa de pollo ----------

paso(ensalada_pollo, 1,
    'Cocina la pechuga de pollo hasta que esté completamente cocida. Déjala reposar unos minutos y córtala en tiras o cubos.').

paso(ensalada_pollo, 2,
    'Lava y corta la lechuga, el tomate, el pepino y la cebolla morada. Corta el aguacate justo antes de servir.').

paso(ensalada_pollo, 3,
    'Coloca la lechuga en un recipiente grande y agrega el tomate, el pepino, la cebolla morada y el aguacate.').

paso(ensalada_pollo, 4,
    'Agrega el pollo sobre las verduras y mezcla suavemente.').

paso(ensalada_pollo, 5,
    'Prepara el aderezo mezclando el aceite de oliva, el jugo de limón, la sal y la pimienta. Si deseas, agrega mostaza y miel.').

paso(ensalada_pollo, 6,
    'Agrega el aderezo justo antes de servir. Si deseas, incorpora maíz, crutones, queso panela o semillas de girasol.').


% =========================================================
% 10. CONSEJOS DEL CHEF
% =========================================================

consejo_chef(tacos_pollo_caseros,
    'Prueba el pollo antes de servir y ajusta la sal y las especias a tu gusto. Si quieres tortillas más flexibles, mantenlas calientes dentro de un tortillero o envueltas en un paño limpio mientras terminas de preparar los tacos.').

consejo_chef(carne_res_verduras,
    'Para obtener una carne más dorada, evita llenar demasiado el sartén y deja que las tiras de carne tengan contacto directo con la superficie caliente antes de moverlas.').

consejo_chef(lomo_cerdo_mostaza,
    'Sella el cerdo antes de incorporarlo a la salsa para conservar mejor su jugosidad y obtener una preparación con más sabor.').

consejo_chef(ceviche_pescado,
    'Mantén el ceviche refrigerado y utiliza pescado fresco y apto para preparaciones en crudo.').

consejo_chef(pasta_pollo_champinones,
    'No cocines demasiado la salsa después de agregar el queso parmesano. Si queda muy espesa, utiliza un poco del agua de cocción de la pasta para ajustar su consistencia.').

consejo_chef(bowl_garbanzos_verduras,
    'Procura no sobrecocer las verduras para conservar una textura agradable y un poco de firmeza al comerlas.').

consejo_chef(quesadillas_champinones,
    'Cocina bien los champiñones antes de preparar las quesadillas para evitar que suelten demasiada humedad y ablanden la tortilla.').

consejo_chef(salmon_limon_verduras,
    'Evita cocinar demasiado el salmón para conservar una textura jugosa. El limón puede agregarse al final para mantener un sabor más fresco.').

consejo_chef(arroz_frito_cerdo,
    'El arroz cocido y frío facilita que los granos se mantengan separados durante la preparación y ayuda a conseguir una mejor textura.').

consejo_chef(ensalada_pollo,
    'Agrega el aderezo justo antes de servir para evitar que las hojas pierdan su textura y se vuelvan demasiado blandas.').


% =========================================================
% 11. FORMA DE SERVIR
% =========================================================

forma_servir(tacos_pollo_caseros,
    'Sirve los tacos con la cantidad de relleno que prefieras y acompaña con cilantro, salsa verde, limón, guacamole, frijoles o una ensalada.').

forma_servir(carne_res_verduras,
    'Sirve la carne con las verduras y acompaña con arroz, tortillas, frijoles o una ensalada.').

forma_servir(lomo_cerdo_mostaza,
    'Sirve el lomo acompañado de la salsa y puedes complementar con arroz, puré de papa o verduras.').

forma_servir(ceviche_pescado,
    'Sirve el ceviche frío acompañado de tostadas de maíz y, si deseas, aguacate.').

forma_servir(pasta_pollo_champinones,
    'Sirve la pasta caliente y termina con un poco de queso parmesano o perejil si lo deseas.').

forma_servir(bowl_garbanzos_verduras,
    'Sirve el arroz y los garbanzos en un tazón y agrega encima las verduras y los acompañamientos que prefieras.').

forma_servir(quesadillas_champinones,
    'Sirve las quesadillas calientes acompañadas de salsa, cilantro, aguacate o los complementos que prefieras.').

forma_servir(salmon_limon_verduras,
    'Sirve el salmón acompañado de las verduras y agrega la salsa de limón al gusto.').

forma_servir(arroz_frito_cerdo,
    'Sirve el arroz frito caliente y, si deseas, acompaña con cebollín o un poco de salsa de soya.').

forma_servir(ensalada_pollo,
    'Sirve la ensalada inmediatamente después de agregar el aderezo y acompaña con los ingredientes opcionales que prefieras.').


% =========================================================
% 12. ETIQUETAS
% =========================================================

etiqueta_receta(tacos_pollo_caseros, mexicana).
etiqueta_receta(tacos_pollo_caseros, casera).
etiqueta_receta(tacos_pollo_caseros, pollo).
etiqueta_receta(tacos_pollo_caseros, facil).
etiqueta_receta(tacos_pollo_caseros, rapida).

etiqueta_receta(carne_res_verduras, internacional).
etiqueta_receta(carne_res_verduras, carne).
etiqueta_receta(carne_res_verduras, verduras).
etiqueta_receta(carne_res_verduras, facil).
etiqueta_receta(carne_res_verduras, rapida).

etiqueta_receta(lomo_cerdo_mostaza, internacional).
etiqueta_receta(lomo_cerdo_mostaza, cerdo).
etiqueta_receta(lomo_cerdo_mostaza, mostaza).
etiqueta_receta(lomo_cerdo_mostaza, facil).

etiqueta_receta(ceviche_pescado, latinoamericana).
etiqueta_receta(ceviche_pescado, pescado).
etiqueta_receta(ceviche_pescado, fresco).
etiqueta_receta(ceviche_pescado, facil).

etiqueta_receta(pasta_pollo_champinones, italiana).
etiqueta_receta(pasta_pollo_champinones, pasta).
etiqueta_receta(pasta_pollo_champinones, pollo).
etiqueta_receta(pasta_pollo_champinones, cremosa).
etiqueta_receta(pasta_pollo_champinones, facil).

etiqueta_receta(bowl_garbanzos_verduras, internacional).
etiqueta_receta(bowl_garbanzos_verduras, vegetariana).
etiqueta_receta(bowl_garbanzos_verduras, garbanzos).
etiqueta_receta(bowl_garbanzos_verduras, verduras).

etiqueta_receta(quesadillas_champinones, mexicana).
etiqueta_receta(quesadillas_champinones, vegetariana).
etiqueta_receta(quesadillas_champinones, champinones).
etiqueta_receta(quesadillas_champinones, facil).
etiqueta_receta(quesadillas_champinones, rapida).

etiqueta_receta(salmon_limon_verduras, internacional).
etiqueta_receta(salmon_limon_verduras, pescado).
etiqueta_receta(salmon_limon_verduras, salmon).
etiqueta_receta(salmon_limon_verduras, verduras).

etiqueta_receta(arroz_frito_cerdo, asiatica).
etiqueta_receta(arroz_frito_cerdo, arroz).
etiqueta_receta(arroz_frito_cerdo, cerdo).
etiqueta_receta(arroz_frito_cerdo, rapida).

etiqueta_receta(ensalada_pollo, internacional).
etiqueta_receta(ensalada_pollo, pollo).
etiqueta_receta(ensalada_pollo, ensalada).
etiqueta_receta(ensalada_pollo, verduras).
etiqueta_receta(ensalada_pollo, facil).


% =========================================================
% 13. RELACIONES DERIVADAS
% =========================================================

% Obtiene los alérgenos presentes en una receta
% a partir de los ingredientes registrados.

alergeno_receta(Receta, Alergeno) :-
    ingrediente_receta(Receta, Ingrediente, _, _, _),
    alergeno(Ingrediente, Alergeno).