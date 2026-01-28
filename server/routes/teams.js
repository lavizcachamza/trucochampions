const express = require('express');
const router = express.Router();
const supabase = require('../db');
const QRCode = require('qrcode');

// Helper to generate Unique Team ID
const generateTeamCode = async () => {
    // Simple random 3 digit generation
    // In production, you might want to check DB for collision or use a sequence
    const random = Math.floor(Math.random() * 900) + 100;
    return `VIZ-2026-${random}`;
};

// POST /api/teams/register
router.post('/register', async (req, res) => {
    const { name, category, email, phone, institution, players } = req.body;

    // 1. Basic Validation
    if (!name || !category || !email || !players || players.length < 2) {
        return res.status(400).json({ error: 'Faltan datos obligatorios.' });
    }

    try {
        // 2. Check for duplicates (Simple check by email)
        const { data: existing } = await supabase
            .from('teams')
            .select('id')
            .eq('email', email)
            .single();

        if (existing) {
            return res.status(400).json({ error: 'Ya existe un equipo registrado con este email.' });
        }

        // 3. Generate Code and QR
        const teamCode = await generateTeamCode();
        const qrData = await QRCode.toDataURL(teamCode);

        // 4. Insert Team
        const { data: team, error: teamError } = await supabase
            .from('teams')
            .insert([
                {
                    code: teamCode,
                    name,
                    category,
                    email,
                    phone,
                    institution,
                    qr_code: qrData,
                    status: 'inscripto'
                }
            ])
            .select()
            .single();

        if (teamError) throw teamError;

        // 5. Insert Players
        const playersData = players.map(p => ({
            team_id: team.id,
            name: p.name,
            age: p.age, // validated as number in frontend
            level: p.level,
            email: p.email,
            phone: p.phone,
            dni: p.dni
        }));

        const { error: playersError } = await supabase
            .from('players')
            .insert(playersData);

        if (playersError) {
            // Rollback would be ideal here, but Supabase API doesn't support transactions easily in client-side JS
            // We would clean up the team if this fails, or use RPC.
            // For MVP, we'll assuming it works or manual fix.
            console.error('Error saving players:', playersError);
            return res.status(500).json({ error: 'Error al guardar jugadores.' });
        }

        // 6. Success
        res.status(201).json({
            success: true,
            team: team,
            message: 'Equipo registrado con éxito.'
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

module.exports = router;

// GET /api/teams (Admin only - ideally protected)
router.get('/', async (req, res) => {
    try {
        const { data: teams, error } = await supabase
            .from('teams')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener equipos' });
    }
});

// PUT /api/teams/:id/status
router.put('/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'checkin', 'pagado', etc.

    try {
        const { data: team, error } = await supabase
            .from('teams')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json({ success: true, team });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado' });
    }
});
