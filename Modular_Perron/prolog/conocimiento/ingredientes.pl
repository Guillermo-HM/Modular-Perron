% ==============================================================================
% COOKSMART - BASE DE CONOCIMIENTO: INGREDIENTES
% Archivo: conocimiento/ingredientes.pl
% ==============================================================================


% ------------------------------------------------------------------------------
% 1. DECLARACIÓN DE INGREDIENTES
% ingrediente(Identificador).
% ------------------------------------------------------------------------------

% Proteínas
ingrediente(pollo).
ingrediente(pechuga_pollo).
ingrediente(carne_res).
ingrediente(lomo_cerdo).
ingrediente(cerdo).
ingrediente(pescado_blanco).
ingrediente(salmon).
ingrediente(huevo).

% Cereales y derivados
ingrediente(tortilla_maiz).
ingrediente(tostadas_maiz).
ingrediente(pasta).
ingrediente(arroz_blanco_cocido).
ingrediente(maiz).
ingrediente(crutones).

% Vegetales
ingrediente(cebolla).
ingrediente(cebolla_morada).
ingrediente(ajo).
ingrediente(pimiento_morron).
ingrediente(chile_serrano).
ingrediente(brocoli).
ingrediente(zanahoria).
ingrediente(tomate).
ingrediente(pepino).
ingrediente(calabacita).
ingrediente(lechuga_romana).

% Frutas
ingrediente(limon).
ingrediente(jugo_limon).
ingrediente(jugo_naranja).
ingrediente(aguacate).

% Hongos
ingrediente(champinones).

% Leguminosas
ingrediente(garbanzos_cocidos).
ingrediente(chicharos).

% Lacteos
ingrediente(queso_fresco).
ingrediente(media_crema).
ingrediente(leche).
ingrediente(mantequilla).
ingrediente(queso_parmesano).
ingrediente(yogurt_natural).
ingrediente(queso_oaxaca).
ingrediente(queso_panela).

% Grasas y aceites
ingrediente(aceite_vegetal).
ingrediente(aceite_oliva).
ingrediente(aceite_sesamo).

% Hierbas
ingrediente(cilantro).
ingrediente(perejil).
ingrediente(epazote).
ingrediente(cebollin).
ingrediente(jengibre_fresco).

% Condimentos
ingrediente(sal).
ingrediente(pimienta).
ingrediente(oregano).
ingrediente(comino).
ingrediente(nuez_moscada).
ingrediente(paprika).
ingrediente(ajo_en_polvo).

% Salsas y otros condimentos
ingrediente(salsa_verde).
ingrediente(salsa_soya).
ingrediente(mostaza).

% Endulzante
ingrediente(miel).

% Semillas
ingrediente(semillas_girasol).


% ------------------------------------------------------------------------------
% 2. TIPO DE INGREDIENTE
% tipo_ingrediente(Ingrediente, Tipo).
% ------------------------------------------------------------------------------

% Proteínas
tipo_ingrediente(pollo, proteina).
tipo_ingrediente(pechuga_pollo, proteina).
tipo_ingrediente(carne_res, proteina).
tipo_ingrediente(lomo_cerdo, proteina).
tipo_ingrediente(cerdo, proteina).
tipo_ingrediente(pescado_blanco, proteina).
tipo_ingrediente(salmon, proteina).
tipo_ingrediente(huevo, proteina).

% Cereales y derivados
tipo_ingrediente(tortilla_maiz, cereal).
tipo_ingrediente(tostadas_maiz, cereal).
tipo_ingrediente(pasta, cereal).
tipo_ingrediente(arroz_blanco_cocido, cereal).
tipo_ingrediente(maiz, cereal).
tipo_ingrediente(crutones, cereal).

% Vegetales
tipo_ingrediente(cebolla, vegetal).
tipo_ingrediente(cebolla_morada, vegetal).
tipo_ingrediente(ajo, vegetal).
tipo_ingrediente(pimiento_morron, vegetal).
tipo_ingrediente(chile_serrano, vegetal).
tipo_ingrediente(brocoli, vegetal).
tipo_ingrediente(zanahoria, vegetal).
tipo_ingrediente(tomate, vegetal).
tipo_ingrediente(pepino, vegetal).
tipo_ingrediente(calabacita, vegetal).
tipo_ingrediente(lechuga_romana, vegetal).

% Frutas
tipo_ingrediente(limon, fruta).
tipo_ingrediente(jugo_limon, fruta).
tipo_ingrediente(jugo_naranja, fruta).
tipo_ingrediente(aguacate, fruta).

% Hongos
tipo_ingrediente(champinones, hongo).

% Leguminosas
tipo_ingrediente(garbanzos_cocidos, leguminosa).
tipo_ingrediente(chicharos, leguminosa).

% Lacteos
tipo_ingrediente(queso_fresco, lacteo).
tipo_ingrediente(media_crema, lacteo).
tipo_ingrediente(leche, lacteo).
tipo_ingrediente(mantequilla, lacteo).
tipo_ingrediente(queso_parmesano, lacteo).
tipo_ingrediente(yogurt_natural, lacteo).
tipo_ingrediente(queso_oaxaca, lacteo).
tipo_ingrediente(queso_panela, lacteo).

% Grasas y aceites
tipo_ingrediente(aceite_vegetal, grasa).
tipo_ingrediente(aceite_oliva, grasa).
tipo_ingrediente(aceite_sesamo, grasa).

% Hierbas
tipo_ingrediente(cilantro, hierba).
tipo_ingrediente(perejil, hierba).
tipo_ingrediente(epazote, hierba).
tipo_ingrediente(cebollin, hierba).
tipo_ingrediente(jengibre_fresco, condimento).

% Condimentos
tipo_ingrediente(sal, condimento).
tipo_ingrediente(pimienta, condimento).
tipo_ingrediente(oregano, condimento).
tipo_ingrediente(comino, condimento).
tipo_ingrediente(nuez_moscada, condimento).
tipo_ingrediente(paprika, condimento).
tipo_ingrediente(ajo_en_polvo, condimento).

% Salsas y condimentos
tipo_ingrediente(salsa_verde, salsa).
tipo_ingrediente(salsa_soya, salsa).
tipo_ingrediente(mostaza, salsa).

% Endulzante
tipo_ingrediente(miel, endulzante).

% Semillas
tipo_ingrediente(semillas_girasol, semilla).


% ------------------------------------------------------------------------------
% 3. ALERGENOS
% alergeno(Ingrediente, Alergeno).
% ------------------------------------------------------------------------------

% Pollo
alergeno(pollo, pollo).
alergeno(pechuga_pollo, pollo).

% Carne de res
alergeno(carne_res, res).

% Cerdo
alergeno(lomo_cerdo, cerdo).
alergeno(cerdo, cerdo).

% Pescado
alergeno(pescado_blanco, pescado).
alergeno(salmon, pescado).

% Huevo
alergeno(huevo, huevo).

% Lacteos
alergeno(queso_fresco, leche).
alergeno(media_crema, leche).
alergeno(leche, leche).
alergeno(mantequilla, leche).
alergeno(queso_parmesano, leche).
alergeno(yogurt_natural, leche).
alergeno(queso_oaxaca, leche).
alergeno(queso_panela, leche).

% Maiz
alergeno(tortilla_maiz, maiz).
alergeno(tostadas_maiz, maiz).
alergeno(maiz, maiz).

% Trigo
alergeno(pasta, trigo).
alergeno(crutones, trigo).

% Soya
alergeno(salsa_soya, soya).

% Mostaza
alergeno(mostaza, mostaza).

% Sesamo
alergeno(aceite_sesamo, sesamo).