// ====================================================================
// Route: /api/admin
// Simple admin dashboard API — view submissions
// Protected by a secret key passed as a Bearer token
// ====================================================================

'use strict';

const express = require('express');
const db      = require('../services/db');

const router = express.Router();

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function requireAuth(req, res, next) {
  const secretKey = process.env.SECRET_KEY;

  if (!secretKey || secretKey === 'change_this_to_a_random_secret_key_in_production') {
    return res.status(503).json({
      success: false,
      message: 'Admin API is disabled. Set a strong SECRET_KEY in your .env file to enable it.'
    });
  }

  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  if (!token || token !== secretKey) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Provide a valid Bearer token.' });
  }

  next();
}

// ─── GET /api/admin/dashboard — summary stats ─────────────────────────────────
router.get('/dashboard', requireAuth, (req, res) => {
  res.json({
    success: true,
    stats: {
      totalContacts:     db.count('contacts'),
      totalQuotes:       db.count('quotes'),
      lastUpdated:       new Date().toISOString()
    }
  });
});

// ─── GET /api/admin/contacts ──────────────────────────────────────────────────
router.get('/contacts', requireAuth, (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  const contacts = db.getAll('contacts', { limit: Number(limit), skip: Number(skip) });
  res.json({ success: true, total: db.count('contacts'), contacts });
});

// ─── GET /api/admin/contacts/:id ─────────────────────────────────────────────
router.get('/contacts/:id', requireAuth, (req, res) => {
  const contact = db.getById('contacts', req.params.id);
  if (!contact) return res.status(404).json({ success: false, message: 'Contact not found.' });
  res.json({ success: true, contact });
});

// ─── GET /api/admin/quotes ────────────────────────────────────────────────────
router.get('/quotes', requireAuth, (req, res) => {
  const { limit = 50, skip = 0 } = req.query;
  const quotes = db.getAll('quotes', { limit: Number(limit), skip: Number(skip) });
  res.json({ success: true, total: db.count('quotes'), quotes });
});

// ─── GET /api/admin/quotes/:id ────────────────────────────────────────────────
router.get('/quotes/:id', requireAuth, (req, res) => {
  const quote = db.getById('quotes', req.params.id);
  if (!quote) return res.status(404).json({ success: false, message: 'Quote not found.' });
  res.json({ success: true, quote });
});

module.exports = router;
