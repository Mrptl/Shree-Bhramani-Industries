// ====================================================================
// Shree Bhramani Industries - Backend API Server
// Express.js REST API with Nodemailer notifications & JSON file storage
// ====================================================================

'use strict';

require('dotenv').config();

const express     = require('express');
const cors        = require('cors');
const morgan      = require('morgan');
const path        = require('path');
const rateLimit   = require('express-rate-limit');

const contactRouter  = require('./routes/contact');
const quoteRouter    = require('./routes/quote');
const productsRouter = require('./routes/products');
const adminRouter    = require('./routes/admin');

const app  = express();
const PORT = process.env.PORT || 3000;

// ====================================================================
// CORS — allow configured frontend origins
// ====================================================================
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (Postman, curl, same-origin etc.)
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin "${origin}" not allowed`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// ====================================================================
// Global Rate Limiter — 100 requests per 15 minutes per IP
// ====================================================================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});
app.use(globalLimiter);

// ====================================================================
// Core Middleware
// ====================================================================
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ====================================================================
// Serve Static Frontend from parent directory
// ====================================================================
app.use(express.static(path.join(__dirname, '..')));

// ====================================================================
// Health Check
// ====================================================================
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Shree Bhramani Industries API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// ====================================================================
// API Routes
// ====================================================================
app.use('/api/contact',  contactRouter);
app.use('/api/quote',    quoteRouter);
app.use('/api/products', productsRouter);
app.use('/api/admin',    adminRouter);

// ====================================================================
// SPA Fallback — serve index.html for any unmatched routes
// ====================================================================
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ====================================================================
// Global Error Handler
// ====================================================================
app.use((err, req, res, _next) => {
  console.error('[ERROR]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected server error occurred.',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ====================================================================
// Start Server
// ====================================================================
app.listen(PORT, () => {
  console.log('');
  console.log('┌─────────────────────────────────────────────────────┐');
  console.log('│   Shree Bhramani Industries — Backend API Server    │');
  console.log('├─────────────────────────────────────────────────────┤');
  console.log(`│   Listening on : http://localhost:${PORT}               │`);
  console.log(`│   Environment  : ${(process.env.NODE_ENV || 'development').padEnd(33)}│`);
  console.log('└─────────────────────────────────────────────────────┘');
  console.log('');
});

module.exports = app;
