% ---------------------------------------------------------
% ALERGENOS RECONOCIDOS POR COOKSMART
% ---------------------------------------------------------

% Restricciones que ya manejaba el sistema
alergeno(pollo).
alergeno(res).
alergeno(cerdo).

% Alergenos y categorias
alergeno(pescado).
alergeno(huevo).
alergeno(leche).
alergeno(maiz).
alergeno(trigo).
alergeno(soya).
alergeno(mostaza).
alergeno(sesamo).

% Categorias ampliadas
alergeno(cacahuate).
alergeno(crustaceos).
alergeno(nueces_arbol).
alergeno(jitomate).
alergeno(tomatillo).
alergeno(chile).
alergeno(aguacate).
alergeno(mango).
alergeno(papaya).
alergeno(citricos).
alergeno(cacao).
alergeno(cilantro).
alergeno(perejil).
alergeno(leguminosas).
alergeno(semilla_calabaza).
alergeno(canela).
alergeno(apio).
alergeno(sulfitos).
alergeno(moluscos).
alergeno(insectos).
alergeno(altramuz).


% ---------------------------------------------------------
% RELACION INGREDIENTE -> ALERGENO
% ---------------------------------------------------------

% Pollo
ingrediente_alergeno(pollo, pollo).
ingrediente_alergeno(pechuga_pollo, pollo).

% Carne de res
ingrediente_alergeno(carne_res, res).

% Carne de cerdo
ingrediente_alergeno(lomo_cerdo, cerdo).
ingrediente_alergeno(cerdo, cerdo).

% Pescado
ingrediente_alergeno(pescado_blanco, pescado).
ingrediente_alergeno(salmon, pescado).

% Huevo
ingrediente_alergeno(huevo, huevo).

% Leche y productos lacteos
ingrediente_alergeno(queso_fresco, leche).
ingrediente_alergeno(media_crema, leche).
ingrediente_alergeno(leche, leche).
ingrediente_alergeno(mantequilla, leche).
ingrediente_alergeno(queso_parmesano, leche).
ingrediente_alergeno(yogurt_natural, leche).
ingrediente_alergeno(queso_oaxaca, leche).
ingrediente_alergeno(queso_panela, leche).

% Maiz
ingrediente_alergeno(tortilla_maiz, maiz).
ingrediente_alergeno(tostadas_maiz, maiz).
ingrediente_alergeno(maiz, maiz).

% Trigo
ingrediente_alergeno(pasta, trigo).
ingrediente_alergeno(crutones, trigo).

% Soya
ingrediente_alergeno(salsa_soya, soya).

% Mostaza
ingrediente_alergeno(mostaza, mostaza).

% Sesamo
ingrediente_alergeno(aceite_sesamo, sesamo).


% ---------------------------------------------------------
% RELACIONES ENTRE ALIMENTOS Y CATEGORIAS DE ALERGENOS
% ---------------------------------------------------------

% Chiles
pertenece_alergeno(chile_serrano, chile).

% Crustaceos
pertenece_alergeno(camaron, crustaceos).
pertenece_alergeno(langosta, crustaceos).
pertenece_alergeno(jaiba, crustaceos).

% Moluscos
pertenece_alergeno(pulpo, moluscos).
pertenece_alergeno(ostion, moluscos).
pertenece_alergeno(calamar, moluscos).
pertenece_alergeno(almeja, moluscos).

% Nueces de arbol
pertenece_alergeno(nuez_castilla, nueces_arbol).
pertenece_alergeno(nuez_pecana, nueces_arbol).
pertenece_alergeno(almendra, nueces_arbol).
pertenece_alergeno(pistache, nueces_arbol).
pertenece_alergeno(nuez_india, nueces_arbol).

% Citricos
pertenece_alergeno(limon, citricos).
pertenece_alergeno(naranja, citricos).
pertenece_alergeno(jugo_limon, citricos).
pertenece_alergeno(jugo_naranja, citricos).

% Leguminosas
pertenece_alergeno(frijol, leguminosas).
pertenece_alergeno(garbanzo, leguminosas).
pertenece_alergeno(lenteja, leguminosas).
pertenece_alergeno(garbanzos_cocidos, leguminosas).

% ---------------------------------------------------------
% RESOLUCION DE ALERGENOS POR INGREDIENTE
% ---------------------------------------------------------

% Caso 1:
% El ingrediente tiene una relacion directa con un alergeno.
alergeno_de_ingrediente(Ingrediente, Alergeno) :-
    ingrediente_alergeno(Ingrediente, Alergeno).

% Caso 2:
% El ingrediente pertenece a una categoria de alergeno.
alergeno_de_ingrediente(Ingrediente, Alergeno) :-
    pertenece_alergeno(Ingrediente, Alergeno).

% Caso 3:
% El ingrediente es por si mismo un alergeno reconocido.
alergeno_de_ingrediente(Ingrediente, Ingrediente) :-
    alergeno(Ingrediente).