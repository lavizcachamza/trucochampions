const express = require('express');
const router = express.Router();
const supabase = require('../db');
const { isAdmin } = require('./admin');

// GET /api/events - List all active events (public)
router.get('/', async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET /api/events/all - List ALL events (admin)
router.get('/all', isAdmin, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST /api/events - Create Event (Admin)
router.post('/', isAdmin, async (req, res) => {
    const { title, description, date, location, image_url } = req.body;
    try {
        const { data, error } = await supabase
            .from('events')
            .insert([{ title, description, date, location, image_url }])
            .select();

        if (error) throw error;
        res.json({ success: true, event: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT /api/events/:id - Update Event (Admin)
router.put('/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const { data, error } = await supabase
            .from('events')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) throw error;
        res.json({ success: true, event: data[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE /api/events/:id - Delete Event (Admin)
router.delete('/:id', isAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
