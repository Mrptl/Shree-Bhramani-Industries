// ====================================================================
// Route: GET /api/products
// Serves the product catalog with specs data for the frontend
// ====================================================================

'use strict';

const express = require('express');
const router  = express.Router();

// Product catalog — mirrors the data in Our_Printers.html
const PRODUCTS = [
  {
    id:       'cij-printer',
    slug:     'cij-printer',
    name:     'Industrial CIJ Printer',
    category: 'Continuous Inkjet',
    image:    '/assets/printer1_gen.png',
    badge:    'Best Seller',
    desc:     'High-speed continuous inkjet printer for non-porous surfaces. Ideal for pharmaceutical, food & beverage, and chemical industries.',
    specs:    [
      'Print Speed: Up to 5 m/s',
      'Resolution: 300 DPI',
      'Characters: 1–5 lines',
      'Ink Types: MEK, Acetone, Water-based',
      'IP Rating: IP55',
      'Operating Temp: 5°C–45°C',
      'Interface: USB, Ethernet, RS232'
    ],
    applications: ['Pharmaceutical', 'Food & Beverage', 'Chemical', 'Automotive']
  },
  {
    id:       'tij-printer',
    slug:     'tij-printer',
    name:     'Compact TIJ Printer',
    category: 'Thermal Inkjet',
    image:    '/assets/printer2_gen.png',
    badge:    'New',
    desc:     'Compact and maintenance-free thermal inkjet for high-resolution coding on cartons, labels, and flexible packaging.',
    specs:    [
      'Resolution: 600 DPI',
      'Print Width: Up to 12.7 mm',
      'Speed: Up to 60 m/min',
      'Ink Cartridge: HP-compatible',
      'Weight: 1.2 kg',
      'Power: 24V DC',
      'Interface: USB, Wi-Fi (optional)'
    ],
    applications: ['Carton Coding', 'Label Printing', 'Flexible Packaging']
  },
  {
    id:       'handheld-coder',
    slug:     'handheld-coder',
    name:     'Handheld Inkjet Coder',
    category: 'Portable Inkjet',
    image:    '/assets/printer3_gen.png',
    badge:    null,
    desc:     'Portable handheld inkjet printer for on-the-go marking on any surface without a production line setup.',
    specs:    [
      'Print Area: 12.7 mm height',
      'Resolution: 300 DPI',
      'Battery: Rechargeable Li-Ion (8 hrs)',
      'Weight: 450 g',
      'Memory: 500 pre-stored messages',
      'Connectivity: Bluetooth, USB',
      'Surfaces: Cardboard, wood, metal, plastic'
    ],
    applications: ['Warehousing', 'Construction', 'Agriculture', 'Retail']
  },
  {
    id:       'fiber-laser',
    slug:     'fiber-laser',
    name:     'Fiber Laser Marking Machine',
    category: 'Laser Marking',
    image:    '/assets/printer4_gen.png',
    badge:    'Premium',
    desc:     'Permanent laser marking on metals and plastics with zero consumables and ultra-precision.',
    specs:    [
      'Laser Power: 20W / 30W / 50W',
      'Marking Area: 100×100 mm to 300×300 mm',
      'Speed: Up to 7,000 mm/s',
      'Wavelength: 1064 nm',
      'Lifetime: 100,000+ hours',
      'Software: EzCad2 compatible',
      'Materials: Steel, Aluminium, Copper, Plastic'
    ],
    applications: ['Metal Parts', 'Electronics', 'Medical Devices', 'Jewellery']
  },
  {
    id:       'uv-printer',
    slug:     'uv-printer',
    name:     'UV Flatbed Printer',
    category: 'UV Inkjet',
    image:    '/assets/printer5_gen.png',
    badge:    null,
    desc:     'Versatile UV flatbed printer capable of printing on virtually any flat surface with photo-quality results.',
    specs:    [
      'Print Area: A3+ (350×600 mm)',
      'Resolution: Up to 1440 DPI',
      'Print Speed: 10 m²/h',
      'Ink: UV-curable CMYK + White + Varnish',
      'Media Thickness: Up to 100 mm',
      'Power: 220V, 1.5 kW',
      'Curing: LED UV lamps'
    ],
    applications: ['Signage', 'Promotional Items', 'Packaging Samples', 'Glass & Acrylic']
  },
  {
    id:       'dod-printer',
    slug:     'dod-printer',
    name:     'DOD Large Character Printer',
    category: 'Drop-on-Demand',
    image:    '/assets/printer6_gen.png',
    badge:    null,
    desc:     'Large character drop-on-demand inkjet for marking corrugated cartons, lumber, and porous surfaces.',
    specs:    [
      'Character Height: 5 mm – 120 mm',
      'Print Width: 1 to 4 heads (extendable)',
      'Speed: Up to 60 m/min',
      'Resolution: 100 DPI standard',
      'Ink: Water-based, solvent, pigmented',
      'Head Gap: 6–20 mm',
      'IP Rating: IP54'
    ],
    applications: ['Corrugated Boxes', 'Lumber & Wood', 'Pipes & Cables', 'Cement Bags']
  },
  {
    id:       'piezo-printer',
    slug:     'piezo-printer',
    name:     'High-Res Piezo Printer',
    category: 'Piezo Inkjet',
    image:    '/assets/printer7_gen.png',
    badge:    null,
    desc:     'High-resolution piezoelectric inkjet for crisp graphics, barcodes, and QR codes on any substrate.',
    specs:    [
      'Resolution: Up to 1200 DPI',
      'Print Width: 50.8 mm per head',
      'Speed: Up to 150 m/min',
      'Ink: UV, solvent, water-based',
      'Heads: Ricoh Gen5/Gen6 compatible',
      'Interface: Ethernet, USB 3.0',
      'Software: Proprietary RIP + ERP integration'
    ],
    applications: ['Barcodes & QR Codes', 'Variable Data', 'Food Packaging', 'Labels']
  },
  {
    id:       'co2-laser',
    slug:     'co2-laser',
    name:     'CO2 Laser Coding System',
    category: 'CO2 Laser',
    image:    '/assets/printer8_gen.png',
    badge:    null,
    desc:     'CO2 laser coder for permanent marking on non-metallic materials including glass, paper, wood, and plastics.',
    specs:    [
      'Laser Power: 10W / 30W / 60W',
      'Wavelength: 10.6 μm',
      'Marking Speed: Up to 12,000 mm/s',
      'Marking Area: Up to 400×400 mm',
      'Cooling: Air-cooled',
      'Lifetime: 20,000+ hours',
      'Materials: PET, Glass, Wood, Rubber, Leather'
    ],
    applications: ['Glass Bottles', 'PET Packaging', 'Wood Products', 'Rubber Seals']
  },
  {
    id:       'conveyor-system',
    slug:     'conveyor-system',
    name:     'Conveyor Print Station',
    category: 'Integrated System',
    image:    '/assets/printer9_gen.png',
    badge:    'Turnkey',
    desc:     'Fully integrated conveyor-mounted printing and inspection station for high-throughput production lines.',
    specs:    [
      'Belt Speed: 0.1 – 3 m/s (variable)',
      'Belt Width: 200 – 1200 mm custom',
      'Print Heads: 1–8 configurable',
      'Vision Inspection: 5MP CCD camera',
      'Reject System: Air jet / pusher',
      'PLC: Siemens / Omron compatible',
      'Power: 3-phase 380V / 50Hz'
    ],
    applications: ['Pharma Lines', 'FMCG', 'Automotive Assembly', 'Food Packaging']
  },
  {
    id:       'smart-controller',
    slug:     'smart-controller',
    name:     'Smart Print Controller',
    category: 'Control System',
    image:    '/assets/printer10_gen.png',
    badge:    null,
    desc:     'Centralized print management hub with real-time monitoring, remote diagnostics, and ERP integration.',
    specs:    [
      'Display: 15.6" Industrial Touchscreen',
      'OS: Embedded Linux (hardened)',
      'Connectivity: Ethernet, Wi-Fi, 4G LTE',
      'Protocols: OPC-UA, MQTT, Modbus TCP',
      'Ports: 8× USB, 4× RS232/485, 2× Ethernet',
      'Storage: 256 GB SSD (expandable)',
      'Certifications: CE, RoHS, IP65 front panel'
    ],
    applications: ['Multi-line Management', 'Remote Monitoring', 'ERP/MES Integration']
  }
];

// ─── GET /api/products — list all ────────────────────────────────────────────
router.get('/', (req, res) => {
  const { category, search, limit = 20 } = req.query;

  let results = [...PRODUCTS];

  if (category) {
    results = results.filter(p =>
      p.category.toLowerCase().includes(category.toLowerCase())
    );
  }

  if (search) {
    const q = search.toLowerCase();
    results = results.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.desc.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: results.length,
    products: results.slice(0, Number(limit))
  });
});

// ─── GET /api/products/:slug — single product ─────────────────────────────────
router.get('/:slug', (req, res) => {
  const product = PRODUCTS.find(p => p.slug === req.params.slug);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }
  res.json({ success: true, product });
});

module.exports = router;
