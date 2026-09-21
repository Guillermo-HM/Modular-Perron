import { useState } from 'react';

export function BuscadorRecetas() {
    const [ingredientesInput, setIngredientesInput] = useState('');
    const [tiempoMax, setTiempoMax] = useState(40);
    const [usuario, setUsuario] = useState('juan');
    const [recetas, setRecetas] = useState([]);
    const [cargando, setCargando] = useState(false);

    const handleBuscar = async (e) => {
        e.preventDefault();
        setCargando(true);

        // Limpiar ingredientes separados por comas
        const listaIngredientes = ingredientesInput
            .split(',')
            .map((item) => item.trim().toLowerCase())
            .filter((item) => item.length > 0);

        try {
            const respuesta = await fetch('http://localhost:3001/api/recomendar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    usuario,
                    ingredientes: listaIngredientes,
                    tiempoMax: Number(tiempoMax)
                })
            });

            const data = await respuesta.json();
            if (data.OK) {
                setRecetas(data.recetas);
            }
        } catch (error) {
            console.error('Error al consultar recetas:', error);
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Recomendador de Recetas con Prolog</h2>
            
            <form onSubmit={handleBuscar}>
                <div style={{ marginBottom: '12px' }}>
                    <label>Usuario:</label>
                    <input
                        type="text"
                        value={usuario}
                        onChange={(e) => setUsuario(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '12px' }}>
                    <label>Ingredientes en despensa (separados por coma):</label>
                    <input
                        type="text"
                        placeholder="ej. pollo, cebolla, ajo"
                        value={ingredientesInput}
                        onChange={(e) => setIngredientesInput(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                </div>

                <div style={{ marginBottom: '12px' }}>
                    <label>Tiempo máximo (minutos):</label>
                    <input
                        type="number"
                        value={tiempoMax}
                        onChange={(e) => setTiempoMax(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '4px' }}
                    />
                </div>

                <button type="submit" disabled={cargando} style={{ padding: '10px 16px', cursor: 'pointer' }}>
                    {cargando ? 'Consultando motor Prolog...' : 'Obtener Recomendaciones'}
                </button>
            </form>

            <div style={{ marginTop: '20px' }}>
                <h3>Recetas encontradas:</h3>
                {recetas.length === 0 ? (
                    <p>No hay resultados que coincidan.</p>
                ) : (
                    <ul>
                        {recetas.map((receta, idx) => (
                            <li key={idx} style={{ margin: '6px 0', textTransform: 'capitalize' }}>
                                {receta.replace(/_/g, ' ')}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}