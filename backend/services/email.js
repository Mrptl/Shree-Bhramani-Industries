// ====================================================================
// Email Service — Nodemailer with Gmail SMTP
// ====================================================================

'use strict';

const nodemailer = require('nodemailer');

// Create reusable transporter
let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('[EMAIL] EMAIL_USER / EMAIL_PASS not set in .env — emails will be logged to console only.');
    return null;
  }

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  return transporter;
}

// ─── Send email helper ────────────────────────────────────────────────────────
async function sendEmail({ to, subject, html, text }) {
  const t = getTransporter();

  if (!t) {
    console.log('\n[EMAIL SIMULATION] Would send email:');
    console.log('  To     :', to);
    console.log('  Subject:', subject);
    console.log('  Body   :', text || '(see HTML)');
    console.log('');
    return { simulated: true };
  }

  const info = await t.sendMail({
    from: `"Shree Bhramani Industries" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html
  });

  console.log(`[EMAIL] Sent to ${to} — Message ID: ${info.messageId}`);
  return info;
}

// ─── Contact Form Email Templates ────────────────────────────────────────────
function contactNotificationHtml(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
    .container { max-width: 640px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #00598b 0%, #002d46 100%); padding: 32px 40px; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 14px; }
    .body { padding: 36px 40px; }
    .field { margin-bottom: 20px; }
    .field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 4px; }
    .field value { display: block; font-size: 15px; color: #111827; }
    .message-box { background: #f9fafb; border-left: 4px solid #00598b; border-radius: 4px; padding: 16px; margin-top: 8px; font-size: 15px; color: #374151; line-height: 1.6; }
    .footer { background: #f9fafb; padding: 20px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 0; }
    .badge { display: inline-block; background: #e0f2fe; color: #0369a1; font-size: 11px; font-weight: 700; border-radius: 99px; padding: 3px 12px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 New Contact Form Submission</h1>
      <p>Received on ${new Date(data.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
    </div>
    <div class="body">
      <span class="badge">Ref: ${data.id}</span>
      <div class="field"><label>Full Name</label><value>${data.name}</value></div>
      <div class="field"><label>Company</label><value>${data.company || '—'}</value></div>
      <div class="field"><label>Industry</label><value>${data.industry || '—'}</value></div>
      <div class="field"><label>Phone</label><value>${data.phone || '—'}</value></div>
      <div class="field"><label>Email</label><value>${data.email || '—'}</value></div>
      <div class="field">
        <label>Technical Requirements</label>
        <div class="message-box">${(data.message || '').replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer"><p>© 2024 Shree Bhramani Industries — Engineered for Precision</p></div>
  </div>
</body>
</html>`;
}

function contactConfirmationHtml(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
    .container { max-width: 640px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #00598b 0%, #002d46 100%); padding: 40px; text-align: center; }
    .header h1 { color: #fff; margin: 0; font-size: 26px; font-weight: 800; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; }
    .body { padding: 40px; text-align: center; }
    .icon { font-size: 52px; margin-bottom: 16px; }
    .body h2 { color: #111827; font-size: 20px; margin: 0 0 12px; }
    .body p { color: #6b7280; line-height: 1.7; }
    .ref { display: inline-block; background: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1; font-family: monospace; font-size: 13px; border-radius: 6px; padding: 6px 16px; margin: 16px 0; }
    .cta { margin-top: 28px; }
    .btn { display: inline-block; background: linear-gradient(135deg, #00598b 0%, #002d46 100%); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 700; font-size: 14px; }
    .footer { background: #f9fafb; padding: 20px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Shree Bhramani Industries</h1>
      <p>Industrial Printing & Coding Solutions</p>
    </div>
    <div class="body">
      <div class="icon">✅</div>
      <h2>Thank you, ${data.name.split(' ')[0]}!</h2>
      <p>We've received your inquiry and our technical team will review it shortly. You can expect a response within <strong>24–48 business hours</strong>.</p>
      <div class="ref">Reference: ${data.id}</div>
      <div class="cta">
        <a class="btn" href="https://shreebhramani.in/Our_Printers.html">Browse Our Products</a>
      </div>
    </div>
    <div class="footer"><p>GIDC Industrial Estate, Halol, Gujarat, India 389350<br>© 2026 Shree Bhramani Industries</p></div>
  </div>
</body>
</html>`;
}

// ─── Quote Request Email Templates ───────────────────────────────────────────
function quoteNotificationHtml(data) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Inter', Arial, sans-serif; background: #f4f6f9; margin: 0; padding: 0; }
    .container { max-width: 640px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
    .header { background: linear-gradient(135deg, #b45309 0%, #78350f 100%); padding: 32px 40px; }
    .header h1 { color: #fff; margin: 0; font-size: 22px; font-weight: 700; }
    .header p { color: rgba(255,255,255,0.7); margin: 6px 0 0; font-size: 14px; }
    .body { padding: 36px 40px; }
    .field { margin-bottom: 20px; }
    .field label { display: block; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #6b7280; margin-bottom: 4px; }
    .field value { display: block; font-size: 15px; color: #111827; }
    .message-box { background: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 4px; padding: 16px; margin-top: 8px; font-size: 15px; color: #374151; line-height: 1.6; }
    .footer { background: #f9fafb; padding: 20px 40px; text-align: center; }
    .footer p { font-size: 12px; color: #9ca3af; margin: 0; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; font-size: 11px; font-weight: 700; border-radius: 99px; padding: 3px 12px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💰 New Quote Request</h1>
      <p>Received on ${new Date(data.submittedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
    </div>
    <div class="body">
      <span class="badge">Ref: ${data.id}</span>
      ${data.product ? `<div class="field"><label>Product Interested In</label><value>${data.product}</value></div>` : ''}
      <div class="field"><label>Full Name</label><value>${data.name}</value></div>
      <div class="field"><label>Email</label><value>${data.email}</value></div>
      <div class="field"><label>Industry Segment</label><value>${data.industry || '—'}</value></div>
      <div class="field"><label>Est. Daily Output</label><value>${data.dailyOutput || '—'}</value></div>
      <div class="field">
        <label>Requirements / Message</label>
        <div class="message-box">${(data.message || '').replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer"><p>© 2024 Shree Bhramani Industries — Engineered for Precision</p></div>
  </div>
</body>
</html>`;
}

module.exports = {
  sendEmail,
  contactNotificationHtml,
  contactConfirmationHtml,
  quoteNotificationHtml
};
