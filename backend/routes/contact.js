// ====================================================================
// Route: POST /api/contact
// Handles contact form submissions from contact_us.html
// ====================================================================

'use strict';

const express                      = require('express');
const { body, validationResult }   = require('express-validator');
const rateLimit                    = require('express-rate-limit');
const { v4: uuidv4 }               = require('uuid');
const db                           = require('../services/db');
const {
  sendEmail,
  contactNotificationHtml,
  contactConfirmationHtml
}                                  = require('../services/email');

const router = express.Router();

// Strict rate limit for contact form: 5 submissions per hour per IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many contact requests. Please try again in 1 hour.' }
});

// Validation rules
const validateContact = [
  body('name')
    .trim()
    .notEmpty().withMessage('Full name is required.')
    .isLength({ min: 2, max: 80 }).withMessage('Name must be 2–80 characters.'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim()
    .matches(/^[+\d\s\-()]{7,20}$/).withMessage('Please enter a valid phone number.'),
  body('email')
    .optional({ checkFalsy: true })
    .trim()
    .isEmail().withMessage('Please enter a valid email address.')
    .normalizeEmail(),
  body('message')
    .trim()
    .notEmpty().withMessage('Please describe your requirements.')
    .isLength({ min: 10, max: 2000 }).withMessage('Message must be 10–2000 characters.')
];

// ─── GET /api/contact — route info ───────────────────────────────────────────
router.get('/', (req, res) => {
  res.json({
    success: true,
    endpoint: 'POST /api/contact',
    description: 'Submit a contact / technical inquiry',
    fields: { name: 'required', company: 'optional', industry: 'optional', phone: 'optional', email: 'optional (or provide phone)', message: 'required' }
  });
});

// ─── POST /api/contact ────────────────────────────────────────────────────────
router.post('/', contactLimiter, validateContact, async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array()
      });
    }

    const { name, company, industry, phone, email, message } = req.body;

    // Build submission record
    const submission = {
      id:          `CNT-${uuidv4().split('-')[0].toUpperCase()}`,
      type:        'contact',
      name:        name.trim(),
      company:     (company || '').trim(),
      industry:    (industry || '').trim(),
      phone:       (phone || '').trim(),
      email:       (email || '').trim(),
      message:     message.trim(),
      ip:          req.ip,
      userAgent:   req.headers['user-agent'],
      submittedAt: new Date().toISOString(),
      status:      'new'
    };

    // Save to database
    db.insert('contacts', submission);

    // Send emails concurrently
    const notifyEmail = process.env.NOTIFY_EMAIL || 'sales@shreebhramani.in';
    await Promise.allSettled([
      // Internal notification to the business
      sendEmail({
        to:      notifyEmail,
        subject: `[Contact Form] New inquiry from ${submission.name} — Ref: ${submission.id}`,
        html:    contactNotificationHtml(submission),
        text:    `New contact inquiry from ${submission.name}.\n\nPhone: ${submission.phone}\nEmail: ${submission.email}\n\nMessage:\n${submission.message}\n\nRef: ${submission.id}`
      }),
      // Confirmation email to customer (if they provided an email)
      ...(submission.email
        ? [sendEmail({
            to:      submission.email,
            subject: `We received your inquiry — Ref: ${submission.id}`,
            html:    contactConfirmationHtml(submission),
            text:    `Hi ${submission.name},\n\nThank you for reaching out to Shree Bhramani Industries. Your inquiry has been received (Ref: ${submission.id}) and our team will respond within 24–48 business hours.\n\nBest regards,\nShree Bhramani Industries`
          })]
        : []
      )
    ]);

    return res.status(201).json({
      success: true,
      message: 'Your inquiry has been submitted. We\'ll contact you within 24–48 hours.',
      referenceId: submission.id
    });

  } catch (err) {
    next(err);
  }
});

module.exports = router;
