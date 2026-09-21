// test.js
async function probarEndpoints() {
    console.log('🧪 Iniciando pruebas del backend...\n');

    // TEST 1: Limpiar/Registrar alergias del usuario
    console.log('1. Registrando alergias...');
    const resAlergias = await fetch('http://localhost:3001/api/registrar-alergias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario: 'cristopher',
            alergias: [] // Sin alergias por ahora
        })
    });
    console.log('Respuesta alergias:', await resAlergias.json());

    // TEST 2: Prueba con ingredientes para Quesadillas de Champiñones (25 min)
    console.log('\n2. Probando recomendación para Quesadillas de champiñones...');
    const resQuesadillas = await fetch('http://localhost:3001/api/recomendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario: 'cristopher',
            ingredientes: [
                'tortilla_maiz',
                'champinones',
                'cebolla',
                'ajo',
                'queso_oaxaca',
                'aceite_vegetal',
                'sal',
                'pimienta'
            ],
            tiempoMax: 30
        })
    });
    console.log('Respuesta recomendación 1:', await resQuesadillas.json());

    // TEST 3: Prueba con ingredientes para Ceviche de pescado (30 min)
    console.log('\n3. Probando recomendación para Ceviche de pescado...');
    const resCeviche = await fetch('http://localhost:3001/api/recomendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            usuario: 'cristopher',
            ingredientes: [
                'pescado_blanco',
                'cebolla_morada',
                'tomate',
                'pepino',
                'jugo_limon',
                'cilantro',
                'sal',
                'pimienta'
            ],
            tiempoMax: 35
        })
    });
    console.log('Respuesta recomendación 2:', await resCeviche.json());
}

probarEndpoints();