:- ensure_loaded('../main.pl').
:- use_module(library(http/json)).

exportar_catalogo :-
    findall(_{id:Receta, nombre:Nombre, tiempo:Tiempo,
        ingredientes:Ingredientes, cantidades:Cantidades, pasos:Pasos}, (
        receta(Receta), nombre_receta(Receta, Nombre),
        tiempo_preparacion(Receta, Tiempo),
        findall(Ingrediente, ingrediente_receta(Receta, Ingrediente, _, _, _), Ingredientes),
        findall(_{id:Ingrediente,cantidad:Cantidad,unidad:Unidad,rol:Rol},
            ingrediente_receta(Receta, Ingrediente, Cantidad, Unidad, Rol), Cantidades),
        findall(Texto, paso(Receta, _, Texto), Pasos)
    ), Catalogo),
    json_write_dict(current_output, Catalogo).
