# Shree Bhramani Industries — Backend API

Node.js + Express REST API powering the contact forms, quote requests, and product catalog.

---

## ⚡ Quick Start

```bash
cd backend
npm install
copy .env.example .env   # Windows
# cp .env.example .env   # Mac/Linux

# Edit .env with your email credentials (see below)
node server.js
```

Server starts at: **http://localhost:3000**

---

## 📁 Project Structure

```
backend/
├── server.js              ← Entry point, Express app setup
├── routes/
│   ├── contact.js         ← POST /api/contact
│   ├── quote.js           ← POST /api/quote
│   ├── products.js        ← GET  /api/products
│   └── admin.js           ← GET  /api/admin/* (protected)
├── services/
│   ├── email.js           ← Nodemailer + HTML templates
│   └── db.js              ← JSON file-based storage
├── data/                  ← Auto-created; stores JSON files
│   ├── contacts.json
│   └── quotes.json
├── .env.example           ← Copy to .env and fill in secrets
└── .gitignore
```

---

## 🔑 Environment Variables (`.env`)

| Variable | Required | Description |
|---|---|---|
| `PORT` | No | Server port (default: `3000`) |
| `NODE_ENV` | No | `development` or `production` |
| `EMAIL_USER` | **Yes** | Gmail address (e.g. `yourstore@gmail.com`) |
| `EMAIL_PASS` | **Yes** | Gmail **App Password** (not your regular password) |
| `NOTIFY_EMAIL` | **Yes** | Email that receives all form notifications |
| `ALLOWED_ORIGINS` | No | Comma-separated CORS origins |
| `SECRET_KEY` | No | Bearer token for Admin API access |

### How to get a Gmail App Password
1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Search for **"App passwords"**
4. Create a new app password → copy it into `EMAIL_PASS`

---

## 🌐 API Reference

### `GET /api/health`
Server health check.

---

### `POST /api/contact`
Submit a contact / technical inquiry.

**Body (JSON):**
```json
{
  "name": "John Doe",           // required
  "company": "Pharma Ltd",      // optional
  "industry": "Pharma",         // optional
  "phone": "+91 9876543210",    // optional (phone or email required)
  "email": "john@pharma.com",   // optional
  "message": "I need a CIJ printer for my production line..." // required
}
```

**Response (201):**
```json
{ "success": true, "message": "...", "referenceId": "CNT-XXXXXXXX" }
```

---

### `POST /api/quote`
Submit a quote / demo request.

**Body (JSON):**
```json
{
  "name": "John Doe",                     // required
  "email": "john@pharma.com",             // required
  "industry": "Pharmaceuticals",          // optional
  "dailyOutput": "50000 units",           // optional
  "product": "SB-9000 CIJ Printer",      // optional
  "message": "Need pricing for 5 units"  // optional
}
```

**Response (201):**
```json
{ "success": true, "message": "...", "referenceId": "QTE-XXXXXXXX" }
```

---

### `GET /api/products`
List all products.

**Query params:** `?search=laser` or `?category=UV Inkjet` or `?limit=5`

**Response (200):**
```json
{ "success": true, "total": 10, "products": [...] }
```

---

### `GET /api/products/:slug`
Get single product by slug (e.g. `cij-printer`, `fiber-laser`).

---

### `GET /api/admin/dashboard` *(protected)*
Returns submission counts.

**Header:** `Authorization: Bearer YOUR_SECRET_KEY`

---

### `GET /api/admin/contacts` *(protected)*
List all contact submissions (newest first).

---

### `GET /api/admin/quotes` *(protected)*
List all quote submissions (newest first).

---

## 🔒 Security Features

- **Rate Limiting** — 5 contact / 10 quote submissions per IP per hour
- **Input Validation** — All fields validated with `express-validator`
- **CORS** — Restricted to `ALLOWED_ORIGINS`
- **HTTP Security Headers** — Powered by `helmet`
- **Admin Protection** — Bearer token required; disabled until `SECRET_KEY` is set

---

## 🚀 Deployment (Render / Railway)

1. Push the `backend/` folder to GitHub
2. Create a new **Web Service** on Render / Railway
3. Set **Build Command:** `npm install`
4. Set **Start Command:** `node server.js`
5. Add all environment variables in the hosting dashboard
6. Update `ALLOWED_ORIGINS` to your live domain

> Once deployed, update `API_BASE` in `assets/main.js` to your live API URL.
