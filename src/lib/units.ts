export interface Unit { id: string; label: string; factor: number; } // factor vers l'unité de base
export interface Category { id: string; label: string; units: Unit[]; special?: 'temperature'; }

export const categories: Category[] = [
  { id: 'length', label: 'Longueur', units: [
    { id: 'mm', label: 'Millimètre (mm)', factor: 0.001 },
    { id: 'cm', label: 'Centimètre (cm)', factor: 0.01 },
    { id: 'm', label: 'Mètre (m)', factor: 1 },
    { id: 'km', label: 'Kilomètre (km)', factor: 1000 },
    { id: 'in', label: 'Pouce (in)', factor: 0.0254 },
    { id: 'ft', label: 'Pied (ft)', factor: 0.3048 },
    { id: 'yd', label: 'Yard (yd)', factor: 0.9144 },
    { id: 'mi', label: 'Mile (mi)', factor: 1609.344 },
  ]},
  { id: 'distance', label: 'Distance', units: [
    { id: 'm', label: 'Mètre (m)', factor: 1 },
    { id: 'km', label: 'Kilomètre (km)', factor: 1000 },
    { id: 'mi', label: 'Mile (mi)', factor: 1609.344 },
    { id: 'nmi', label: 'Mille marin (nmi)', factor: 1852 },
    { id: 'ft', label: 'Pied (ft)', factor: 0.3048 },
  ]},
  { id: 'area', label: 'Surface', units: [
    { id: 'mm2', label: 'mm²', factor: 0.000001 },
    { id: 'cm2', label: 'cm²', factor: 0.0001 },
    { id: 'm2', label: 'm²', factor: 1 },
    { id: 'ha', label: 'Hectare (ha)', factor: 10000 },
    { id: 'km2', label: 'km²', factor: 1000000 },
    { id: 'ac', label: 'Acre', factor: 4046.8564224 },
    { id: 'ft2', label: 'ft²', factor: 0.09290304 },
  ]},
  { id: 'volume', label: 'Volume', units: [
    { id: 'ml', label: 'Millilitre (ml)', factor: 0.001 },
    { id: 'l', label: 'Litre (l)', factor: 1 },
    { id: 'm3', label: 'm³', factor: 1000 },
    { id: 'gal', label: 'Gallon US', factor: 3.785411784 },
    { id: 'pt', label: 'Pinte US', factor: 0.473176473 },
    { id: 'cup', label: 'Tasse', factor: 0.2365882365 },
  ]},
  { id: 'temperature', label: 'Température', special: 'temperature', units: [
    { id: 'c', label: 'Celsius (°C)', factor: 1 },
    { id: 'f', label: 'Fahrenheit (°F)', factor: 1 },
    { id: 'k', label: 'Kelvin (K)', factor: 1 },
  ]},
  { id: 'weight', label: 'Poids', units: [
    { id: 'mg', label: 'Milligramme (mg)', factor: 0.000001 },
    { id: 'g', label: 'Gramme (g)', factor: 0.001 },
    { id: 'kg', label: 'Kilogramme (kg)', factor: 1 },
    { id: 't', label: 'Tonne (t)', factor: 1000 },
    { id: 'lb', label: 'Livre (lb)', factor: 0.45359237 },
    { id: 'oz', label: 'Once (oz)', factor: 0.028349523125 },
  ]},
  { id: 'speed', label: 'Vitesse', units: [
    { id: 'mps', label: 'm/s', factor: 1 },
    { id: 'kmh', label: 'km/h', factor: 0.277777778 },
    { id: 'mph', label: 'mph', factor: 0.44704 },
    { id: 'kn', label: 'Nœud (kn)', factor: 0.514444444 },
  ]},
  { id: 'time', label: 'Temps', units: [
    { id: 's', label: 'Seconde (s)', factor: 1 },
    { id: 'min', label: 'Minute (min)', factor: 60 },
    { id: 'h', label: 'Heure (h)', factor: 3600 },
    { id: 'd', label: 'Jour (j)', factor: 86400 },
    { id: 'wk', label: 'Semaine', factor: 604800 },
    { id: 'yr', label: 'Année', factor: 31536000 },
  ]},
  { id: 'storage', label: 'Stockage informatique', units: [
    { id: 'b', label: 'Octet (o)', factor: 1 },
    { id: 'kb', label: 'Kilooctet (Ko)', factor: 1024 },
    { id: 'mb', label: 'Mégaoctet (Mo)', factor: 1048576 },
    { id: 'gb', label: 'Gigaoctet (Go)', factor: 1073741824 },
    { id: 'tb', label: 'Téraoctet (To)', factor: 1099511627776 },
  ]},
  { id: 'energy', label: 'Énergie', units: [
    { id: 'j', label: 'Joule (J)', factor: 1 },
    { id: 'kj', label: 'Kilojoule (kJ)', factor: 1000 },
    { id: 'cal', label: 'Calorie (cal)', factor: 4.184 },
    { id: 'kcal', label: 'Kilocalorie (kcal)', factor: 4184 },
    { id: 'wh', label: 'Watt-heure (Wh)', factor: 3600 },
    { id: 'kwh', label: 'Kilowatt-heure (kWh)', factor: 3600000 },
  ]},
];

export function convert(catId: string, fromId: string, toId: string, value: number): number {
  const cat = categories.find(c => c.id === catId)!;
  if (cat.special === 'temperature') {
    let c: number; // vers Celsius
    if (fromId === 'c') c = value; else if (fromId === 'f') c = (value - 32) * 5 / 9; else c = value - 273.15;
    if (toId === 'c') return c; if (toId === 'f') return c * 9 / 5 + 32; return c + 273.15;
  }
  const from = cat.units.find(u => u.id === fromId)!;
  const to = cat.units.find(u => u.id === toId)!;
  return (value * from.factor) / to.factor;
}
