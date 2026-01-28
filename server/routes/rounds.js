const express = require('express');
const router = express.Router();
const supabase = require('../db');
const swissSystem = require('../services/swiss');

// GET /api/rounds/current
router.get('/current', async (req, res) => {
    try {
        // Get the latest active or completed round
        // For now, we will just return a simple object or query DB
        const { data: round } = await supabase
            .from('rounds')
            .select('*')
            .order('id', { ascending: false })
            .limit(1)
            .single();

        res.json({ round });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching round' });
    }
});

// POST /api/rounds/generate
router.post('/generate', async (req, res) => {
    const { category } = req.body; // 'Pareja' or 'Trio'

    if (!category) return res.status(400).json({ error: 'Category required' });

    try {
        // 1. Generate Pairing
        const { matches, byeTeam } = await swissSystem.generateRound(category);

        // 2. Create Round Record (if not exists for this "Step")
        // For MVP, we simply assume we creating a new round ID every time we hit generate for now
        // In real app, we need to track "Round Number".

        const { data: newRound, error: roundError } = await supabase
            .from('rounds')
            .insert([{
                number: 1, // HARDCODED FOR MVP TEST
                status: 'active',
                start_time: new Date()
            }])
            .select()
            .single();

        if (roundError) throw roundError;

        // 3. Save Matches
        const matchesToInsert = matches.map(m => ({
            round_id: newRound.id,
            team_home_id: m.team_home_id,
            team_away_id: m.team_away_id,
            status: 'scheduled',
            table_number: 1 // TODO: Assign table numbers logic
        }));

        const { error: matchesError } = await supabase
            .from('matches')
            .insert(matchesToInsert);

        if (matchesError) throw matchesError;

        res.json({ success: true, round: newRound, matches: matchesToInsert });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating round: ' + error.message });
    }
});

module.exports = router;
