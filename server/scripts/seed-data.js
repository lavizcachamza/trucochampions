const supabase = require('../db');

const teams = [
    { name: 'Los Ases', category: 'Pareja', email: 'ases@test.com' },
    { name: 'Truco y Flor', category: 'Pareja', email: 'flor@test.com' },
    { name: 'Los 33', category: 'Pareja', email: '33@test.com' },
    { name: 'Envido Real', category: 'Pareja', email: 'real@test.com' },
    { name: 'Quiero Retruco', category: 'Pareja', email: 'retruco@test.com' },
    { name: 'Ancho de Espada', category: 'Pareja', email: 'espada@test.com' },
    { name: 'Los Vira', category: 'Pareja', email: 'vira@test.com' },
    { name: 'Falta Envido', category: 'Pareja', email: 'falta@test.com' },
];

async function seed() {
    console.log('🌱 Seeding database...');

    for (const t of teams) {
        // Check if exists
        const { data: existing } = await supabase.from('teams').select('id').eq('email', t.email).single();
        if (!existing) {
            const { error } = await supabase.from('teams').insert([{
                name: t.name,
                category: t.category,
                email: t.email,
                phone: '12345678',
                code: 'SEED-' + Math.floor(Math.random() * 1000),
                status: 'checkin' // Auto check-in for testing
            }]);

            if (error) console.error('Error adding ' + t.name, error.message);
            else console.log('✅ Added: ' + t.name);
        } else {
            console.log('Skipped: ' + t.name + ' (exists)');
        }
    }
    console.log('Done!');
}

seed();
