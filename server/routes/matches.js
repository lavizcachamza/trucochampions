const express = require('express');
const router = express.Router();
const supabase = require('../db');

module.exports = (io) => {
    // PUT /api/matches/:id/score
    router.put('/:id/score', async (req, res) => {
        const { id } = req.params;
        const { score_home, score_away, status } = req.body;

        try {
            const { data: match, error } = await supabase
                .from('matches')
                .update({ score_home, score_away, status })
                .eq('id', id)
                .select(`
          *,
          team_home:teams!team_home_id(name),
          team_away:teams!team_away_id(name)
        `)
                .single();

            if (error) throw error;

            // Emit real-time update
            io.emit('match_update', match);

            res.json({ success: true, match });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error updating score' });
        }
    });

    // GET /api/matches/live
    router.get('/live', async (req, res) => {
        try {
            // Get matches for active rounds (simplification)
            // Ideally join with teams to get names
            const { data: matches, error } = await supabase
                .from('matches')
                .select(`
            *,
            team_home:teams!team_home_id(name, category),
            team_away:teams!team_away_id(name, category)
        `)
                .or('status.eq.live,status.eq.scheduled')
                .order('id', { ascending: true });

            if (error) throw error;
            res.json(matches);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching live matches' });
        }
    });

    // GET /api/matches/:id
    router.get('/:id', async (req, res) => {
        // Fetch single match details for Referee
        const { id } = req.params;
        try {
            const { data: match, error } = await supabase
                .from('matches')
                .select(`
                *,
                team_home:teams!team_home_id(name, category),
                team_away:teams!team_away_id(name, category)
            `)
                .eq('id', id)
                .single();

            if (error) throw error;
            res.json(match);
        } catch (error) {
            res.status(500).json({ error: 'Error fetching match' });
        }
    });

    return router;
};
