// Every on-screen figure, copied from guion.md / the brief's "Datos clave" table.
// If the official 2027 Part B premium differs, change it here (and in guion.md, scenes 5).
export const FACTS = {
  cola2027: 3.6,
  cola2026: 2.8,
  avgIncrease: 75,
  // Historical COLAs for the "recent COLAs" bar chart (SSA). 2023 shown to back "el más alto desde 2023".
  colaHistory: [
    {year: 2023, pct: 8.7},
    {year: 2024, pct: 3.2},
    {year: 2025, pct: 2.5},
    {year: 2026, pct: 2.8},
    {year: 2027, pct: 3.6},
  ],
  examples: [
    {from: 1200, to: 1243},
    {from: 1500, to: 1554},
    {from: 2000, to: 2072},
    {from: 2500, to: 2590},
  ],
  partB2026: 202.9,
  partB2027: 209.5, // PROYECTADO
  partBDelta: 6.6,
  miguelGross: 72,
  miguelNet: 65.4,
  taxMaxOld: 184500,
  taxMaxNew: 192300,
  fraYear: 1960,
  fraAge: 67,
  oasiDepletion: 2032,
  combinedDepletion: 2034,
  grocery: {from: 100, to: 103.6},
  partDIncrease: 50,
} as const;
