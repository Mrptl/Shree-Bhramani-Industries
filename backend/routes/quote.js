// ====================================================================
// Route: POST /api/quote
// Handles "Get Quote" and "Request a Demo" form submissions
// ====================================================================

'use strict';

const express                    = require('express');
const { body, validationResult } = require('express-validator');
const rateLimit                  = require('express-rate-limit');
const { v4: uuidv4 }             = require('uuid');
const db                         = require('../services/db');
const { sendEmail, quoteNotificationHtml } = require('../services/email');

const router = express.Router();

// Rate limit: 10 quote requests per hour per IP
const quoteLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many quote requests. Please try again later.' }
});

// Validation rules
const validateQuote = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required.')
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('industry')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 100 }).withMessage('Industry field is too long.'),
  body('message')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 3000 }).withMessage('Message must be under 3000 characters.')
];

// ─── GET /api/quote ───────────────────────────────────────────────────────────
router.get('/', (req, res) => {
  res.json({
    success: true,
    endpoint: 'POST /api/quote',
    description: 'Submit a quote / demo request',
    fields: {
      name: 'required',
      email: 'required',
      industry: 'optional',
      dailyOutput: 'optional',
      product: 'optional (pre-filled from product page)',
      message: 'optional'
    }
  });
});

// ─── POST /api/quote ──────────────────────────────────────────────────────────
router.post('/', quoteLimiter, validateQuote, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    const { name, email, industry, dailyOutput, product, message } = req.body;

    // Build submission record
    const submission = {
      id:          `QTE-${uuidv4().split('-')[0].toUpperCase()}`,
      type:        'quote',
      name:        name.trim(),
      email:       email.trim(),
      industry:    (industry || '').trim(),
      dailyOutput: (dailyOutput || '').trim(),
      product:     (product || '').trim(),
      message:     (message || '').trim(),
      ip:          req.ip,
      userAgent:   req.headers['user-agent'],
      submittedAt: new Date().toISOString(),
      status:      'new'
    };

    // Save to database FIRST — always persists regardless of email status
    db.insert('quotes', submission);

    // Notify the business team (non-fatal — log but don't fail the response)
    const notifyEmail = process.env.NOTIFY_EMAIL || 'sales@shreebhramani.in';
    try {
      await sendEmail({
        to:      notifyEmail,
        subject: `[Quote Request] ${submission.name} — ${submission.product || 'General'} — Ref: ${submission.id}`,
        html:    quoteNotificationHtml(submission),
        text:    `New quote request from ${submission.name} (${submission.email}).\nProduct: ${submission.product || 'Not specified'}\nIndustry: ${submission.industry}\nDaily Output: ${submission.dailyOutput}\n\nMessage:\n${submission.message}\n\nRef: ${submission.id}`
      });
    } catch (emailErr) {
      console.error('[EMAIL] Failed to send quote notification:', emailErr.message);
    }

    return res.status(201).json({
      success: true,
      message: 'Your quote request has been received! Our sales team will reach out within 24 hours.',
      referenceId: submission.id
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
