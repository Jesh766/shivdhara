export interface VastuDirection {
  code: 'N' | 'NE' | 'E' | 'SE' | 'S' | 'SW' | 'W' | 'NW';
  name: string;
  sanskritName: string;
  deity: string;
  rulingPlanet: string;
  element: 'Water' | 'Air' | 'Fire' | 'Earth' | 'Space (Akasha)';
  energyQuality: string;
  idealFor: string[];
  avoidInThisZone: string[];
  colors: string[];
  remedies: string;
  degreeRange: string;
}

export const vastuDirectionsData: VastuDirection[] = [
  {
    code: 'NE',
    name: 'Northeast',
    sanskritName: 'Ishan (ईशान)',
    deity: 'Lord Shiva',
    rulingPlanet: 'Jupiter (Brihaspati)',
    element: 'Water',
    energyQuality: 'Highest spiritual resonance, mental peace, pure intuition, and divine grace.',
    idealFor: ['Meditation room & Altar', 'Yoga sanctuary', 'Quiet study desk', 'Water fountains / clear crystal bowls'],
    avoidInThisZone: ['Heavy master storage', 'Toilets / Septic tanks', 'Kitchen / Cooking stove', 'Dark cluttered dump zones'],
    colors: ['Pure White', 'Light Sky Blue', 'Soft Cream', 'Silver'],
    remedies: 'Keep zone immaculate and well-illuminated. Place a clear quartz cluster or clean water vessel to amplify subtle prana.',
    degreeRange: '22.5° – 67.5°'
  },
  {
    code: 'E',
    name: 'East',
    sanskritName: 'Surya (पूर्व / इंद्र)',
    deity: 'Surya Dev / Indra',
    rulingPlanet: 'Sun (Surya)',
    element: 'Air',
    energyQuality: 'Vitality, public recognition, social connection, and vibrant morning prana.',
    idealFor: ['Main entrance (auspicious)', 'Living room seating', 'Windows / balconies', 'Family gathering space'],
    avoidInThisZone: ['Tall solid blockages', 'Heavy Southwest-style wardrobes', 'Dark heavy curtains in the morning'],
    colors: ['Golden Yellow', 'Warm Cream', 'Light Green'],
    remedies: 'Allow maximum early morning sunlight. Place green foliage or a brass sun emblem to activate vitality.',
    degreeRange: '67.5° – 112.5°'
  },
  {
    code: 'SE',
    name: 'Southeast',
    sanskritName: 'Agni (आग्नेय)',
    deity: 'Agni Dev',
    rulingPlanet: 'Venus (Shukra)',
    element: 'Fire',
    energyQuality: 'Metabolic fire, cash flow, creative zest, passion, and operational energy.',
    idealFor: ['Main kitchen & cooking stove', 'Electrical panels / Inverters', 'Fireplace / candle zone', 'Finance department'],
    avoidInThisZone: ['Underground water storage', 'Main master bedroom', 'Extended water bodies'],
    colors: ['Terracotta', 'Soft Rose Pink', 'Warm Amber', 'Pastel Coral'],
    remedies: 'Balance excess water elements with warm lighting. If stove orientation is imperfect, place a natural agate or copper pyramid near the stove.',
    degreeRange: '112.5° – 157.5°'
  },
  {
    code: 'S',
    name: 'South',
    sanskritName: 'Yama (दक्षिण)',
    deity: 'Yama Dev',
    rulingPlanet: 'Mars (Mangal)',
    element: 'Fire',
    energyQuality: 'Courage, physical endurance, stability, and peaceful restorative sleep.',
    idealFor: ['Bedroom (sleep with head to South)', 'High solid walls', 'Heavy furniture / bookcases'],
    avoidInThisZone: ['Large low-lying main water sump', 'Excessive mirrors reflecting sleep space'],
    colors: ['Earthy Red', 'Warm Brown', 'Deep Sandstone'],
    remedies: 'Sleep with head oriented toward South or East for optimal magnetic grounding and deep delta-wave sleep.',
    degreeRange: '157.5° – 202.5°'
  },
  {
    code: 'SW',
    name: 'Southwest',
    sanskritName: 'Nairutya (नैऋत्य)',
    deity: 'Nirriti / Prithvi',
    rulingPlanet: 'Rahu & Saturn',
    element: 'Earth',
    energyQuality: 'Mastery, authority, long-term wealth retention, family harmony, and stability.',
    idealFor: ['Master bedroom (Head of family/CEO desk)', 'Heavy wardrobe / Safe locker', 'Tallest elevation of house'],
    avoidInThisZone: ['Open balconies / large cut-outs', 'Pooja room / Altar', 'Underground water tanks'],
    colors: ['Ochre', 'Earth Brown', 'Muted Beige', 'Golden Yellow'],
    remedies: 'Anchor this zone with heavy stone decor, brass accents, or natural earthy pottery to ground energy.',
    degreeRange: '202.5° – 247.5°'
  },
  {
    code: 'W',
    name: 'West',
    sanskritName: 'Varuna (पश्चिम)',
    deity: 'Varuna Dev',
    rulingPlanet: 'Saturn (Shani)',
    element: 'Space (Akasha)',
    energyQuality: 'Gains, commercial profits, fulfillment, sustained learning, and social networks.',
    idealFor: ['Dining room', 'Children study / study desks', 'Overhead water tank', 'Living room entertainment'],
    avoidInThisZone: ['Sloping downward entrances compared to East'],
    colors: ['Deep Midnight Blue', 'Charcoal Slate', 'Pure White'],
    remedies: 'Place metal wall art, chime bells, or round reflective accents to harmonize Saturnian space elements.',
    degreeRange: '247.5° – 292.5°'
  },
  {
    code: 'NW',
    name: 'Northwest',
    sanskritName: 'Vayu (वायव्य)',
    deity: 'Vayu Dev',
    rulingPlanet: 'Moon (Chandra)',
    element: 'Air',
    energyQuality: 'Fluid movement, dynamic change, customer footfall, helpful friends, and travel.',
    idealFor: ['Guest bedroom', 'Dispatch / finished goods storage', 'Finished products display', 'Garage / parking'],
    avoidInThisZone: ['Master bedroom (causes mental restlessness)', 'Heavy immovable structural vaults'],
    colors: ['Pearl White', 'Light Silver', 'Soft Sage', 'Dove Gray'],
    remedies: 'Hang a melodious 5-rod brass or aluminum wind chime to gently disperse stagnant air and invite supportive relationships.',
    degreeRange: '292.5° – 337.5°'
  },
  {
    code: 'N',
    name: 'North',
    sanskritName: 'Kuber (उत्तर)',
    deity: 'Lord Kuber',
    rulingPlanet: 'Mercury (Budha)',
    element: 'Water',
    energyQuality: 'Opportunity, career growth, financial inflows, and intellect.',
    idealFor: ['Main entrance (highly auspicious)', 'Financial accounts / cash chest', 'Living room / open foyer', 'Study & work desk'],
    avoidInThisZone: ['Heavy solid storage blocking light', 'Kitchen cooking fire (clash of Water & Fire)'],
    colors: ['Emerald Green', 'Sea Green', 'Pastel Mint', 'Light Blue'],
    remedies: 'Keep open and uncluttered. Place a healthy money plant in clean water or green aventurine cluster.',
    degreeRange: '337.5° – 22.5°'
  }
];

export const VASTU_DIRECTIONS = vastuDirectionsData;

export const VASTU_DIRECTION_CENTERS: Record<string, number> = {
  N: 0,
  NE: 45,
  E: 90,
  SE: 135,
  S: 180,
  SW: 225,
  W: 270,
  NW: 315,
};

export function getVastuZoneFromDegree(degree: number): VastuDirection {
  const norm = ((degree % 360) + 360) % 360;

  if (norm >= 22.5 && norm < 67.5) return vastuDirectionsData.find(d => d.code === 'NE') || vastuDirectionsData[0];
  if (norm >= 67.5 && norm < 112.5) return vastuDirectionsData.find(d => d.code === 'E') || vastuDirectionsData[1];
  if (norm >= 112.5 && norm < 157.5) return vastuDirectionsData.find(d => d.code === 'SE') || vastuDirectionsData[2];
  if (norm >= 157.5 && norm < 202.5) return vastuDirectionsData.find(d => d.code === 'S') || vastuDirectionsData[3];
  if (norm >= 202.5 && norm < 247.5) return vastuDirectionsData.find(d => d.code === 'SW') || vastuDirectionsData[4];
  if (norm >= 247.5 && norm < 292.5) return vastuDirectionsData.find(d => d.code === 'W') || vastuDirectionsData[5];
  if (norm >= 292.5 && norm < 337.5) return vastuDirectionsData.find(d => d.code === 'NW') || vastuDirectionsData[6];
  return vastuDirectionsData.find(d => d.code === 'N') || vastuDirectionsData[7];
}

