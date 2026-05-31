// ====================================================================
// Database Service — JSON File Storage
// Stores submissions as JSON files in /backend/data/
// Zero external dependencies; can be swapped for Firebase/MongoDB later
// ====================================================================

'use strict';

const fs   = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// ─── Helper: read collection JSON file ───────────────────────────────────────
function readCollection(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return [];
  }
}

// ─── Helper: write collection JSON file ──────────────────────────────────────
function writeCollection(name, data) {
  const file = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

// ─── Insert document ─────────────────────────────────────────────────────────
function insert(collection, document) {
  const docs = readCollection(collection);
  docs.push(document);
  writeCollection(collection, docs);
  return document;
}

// ─── Get all documents ───────────────────────────────────────────────────────
function getAll(collection, { limit = 100, skip = 0 } = {}) {
  const docs = readCollection(collection);
  // Return newest first
  return docs.slice().reverse().slice(skip, skip + limit);
}

// ─── Get one document by id ──────────────────────────────────────────────────
function getById(collection, id) {
  const docs = readCollection(collection);
  return docs.find(d => d.id === id) || null;
}

// ─── Count documents ─────────────────────────────────────────────────────────
function count(collection) {
  return readCollection(collection).length;
}

module.exports = { insert, getAll, getById, count };
