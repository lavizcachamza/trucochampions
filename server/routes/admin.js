const express = require('express');
const router = express.Router();
require('dotenv').config();

// Simple Admin Password from Env
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// POST /api/admin/login
router.post('/login', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, token: 'mock-admin-token' });
    } else {
        res.status(401).json({ error: 'Contraseña incorrecta' });
    }
});

// Middleware to protect admin routes (Simple version)
const isAdmin = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === 'mock-admin-token') {
        next();
    } else {
        res.status(401).json({ error: 'No autorizado' });
    }
};

module.exports = {
    router,
    isAdmin
};
