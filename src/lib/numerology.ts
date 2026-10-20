import { NumerologyAnalysis } from '../types';

export function reduceToSingleDigit(num: number): number {
  while (num > 9) {
    num = num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0);
  }
  return num === 0 ? 1 : num;
}

export function calculateBirthNumber(day: number): number {
  return reduceToSingleDigit(day);
}

export function calculateLifePathNumber(day: number, month: number, year: number): number {
  const sum = day + month + year;
  return reduceToSingleDigit(sum);
}

// Chaldean letter values
const chaldeanMap: Record<string, number> = {
  a: 1, i: 1, j: 1, q: 1, y: 1,
  b: 2, k: 2, r: 2,
  c: 3, g: 3, l: 3, s: 3,
  d: 4, m: 4, t: 4,
  e: 5, h: 5, n: 5, x: 5,
  u: 6, v: 6, w: 6,
  o: 7, z: 7,
  f: 8, p: 8
};

export function calculateNameNumber(name: string): number {
  const clean = name.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 1;
  const total = clean.split('').reduce((sum, char) => sum + (chaldeanMap[char] || 0), 0);
  return reduceToSingleDigit(total);
}

export const numerologyArchetypes: Record<number, {
  planet: string;
  archetype: string;
  coreVibration: string;
  strengths: string[];
  growthAreas: string[];
  auspiciousColors: string[];
  auspiciousDays: string[];
  recommendedBracelets: string[];
  harmonizingDirections: string[];
  reflectiveGuidance: string;
}> = {
  1: {
    planet: 'Sun (Surya)',
    archetype: 'The Pioneer & Conscious Leader',
    coreVibration: 'Vitality, executive clarity, initiative, and luminous presence.',
    strengths: ['Natural leadership', 'High determination', 'Independent thinking', 'Original vision'],
    growthAreas: ['Impatience with slower rhythms', 'Over-assertiveness', 'Reluctance to delegate'],
    auspiciousColors: ['Golden Yellow', 'Warm Orange', 'Ruby Red', 'Cream'],
    auspiciousDays: ['Sunday', 'Monday'],
    recommendedBracelets: ['Surya Radiant Bracelet (Pyrite & Sunstone)'],
    harmonizingDirections: ['East (Surya)', 'Northeast (Ishan)'],
    reflectiveGuidance: 'Your strength lies in illuminating the path for others. Channel your inner fire into service and empathetic leadership rather than rigid control.'
  },
  2: {
    planet: 'Moon (Chandra)',
    archetype: 'The Intuitive Peacemaker & Empath',
    coreVibration: 'Emotional receptivity, diplomacy, harmony, and creative imagination.',
    strengths: ['Deep empathy', 'Intuitive discernment', 'Collaborative grace', 'Artistic sensitivity'],
    growthAreas: ['Emotional oversensitivity', 'Hesitation in decisions', 'Self-doubt'],
    auspiciousColors: ['Silvery White', 'Pale Cream', 'Seafoam Green'],
    auspiciousDays: ['Monday', 'Friday'],
    recommendedBracelets: ['Chandra Serenity Bracelet (Moonstone & Pearl)'],
    harmonizingDirections: ['Northwest (Vayu)', 'North (Kuber)'],
    reflectiveGuidance: 'Honor your deep intuitive waves while cultivating healthy emotional boundaries. Ground your thoughts in mindful daily rituals.'
  },
  3: {
    planet: 'Jupiter (Guru / Brihaspati)',
    archetype: 'The Wisdom Seeker & Expansive Creator',
    coreVibration: 'Higher wisdom, philosophical optimism, eloquent speech, and mentorship.',
    strengths: ['Inspiring communication', 'Broad vision', 'Generous spirit', 'Love of knowledge'],
    growthAreas: ['Scattered energies', 'Overcommitting resources', 'Excessive idealism'],
    auspiciousColors: ['Bright Yellow', 'Golden Amber', 'Warm Saffron'],
    auspiciousDays: ['Thursday', 'Tuesday'],
    recommendedBracelets: ['Brihaspati Wisdom Bracelet (Citrine & Sandalwood)'],
    harmonizingDirections: ['Northeast (Ishan)', 'East (Surya)'],
    reflectiveGuidance: 'Your words possess creative power. Direct your curiosity into disciplined mastery to turn broad wisdom into tangible transformation.'
  },
  4: {
    planet: 'Rahu (The Visionary Architect)',
    archetype: 'The Structural Innovator & Deep Thinker',
    coreVibration: 'Analytical depth, unconventional perspective, perseverance, and reform.',
    strengths: ['Systemic problem-solving', 'Endurance under pressure', 'Unconventional insight', 'Attention to detail'],
    growthAreas: ['Sudden restlessness', 'Resistance to conventional paths', 'Overthinking'],
    auspiciousColors: ['Smoky Quartz Gray', 'Deep Electric Blue', 'Forest Green'],
    auspiciousDays: ['Saturday', 'Wednesday'],
    recommendedBracelets: ['Rahu Harmonizer Bracelet (Hessonite & Smoky Quartz)'],
    harmonizingDirections: ['Southwest (Nairutya)', 'South (Yama)'],
    reflectiveGuidance: 'You perceive the hidden patterns behind complex systems. Anchor your innovative ideas with steady routines and somatic breathwork.'
  },
  5: {
    planet: 'Mercury (Budha)',
    archetype: 'The Dynamic Communicator & Catalyst',
    coreVibration: 'Mental agility, versatile intellect, commerce acumen, and adaptable movement.',
    strengths: ['Rapid adaptability', 'Persuasive articulation', 'Curiosity and charm', 'Networking instinct'],
    growthAreas: ['Nervous restlessness', 'Boredom with routine', 'Scattered focus'],
    auspiciousColors: ['Emerald Green', 'Mint', 'Turquoise', 'Light Sage'],
    auspiciousDays: ['Wednesday', 'Friday'],
    recommendedBracelets: ['Budha Harmonizer Bracelet (Green Jade & Fluorite)'],
    harmonizingDirections: ['North (Kuber)', 'East (Surya)'],
    reflectiveGuidance: 'Your agile mind absorbs ideas effortlessly. Cultivate stillness and intentional breath to prevent mental exhaustion and anchor your gifts.'
  },
  6: {
    planet: 'Venus (Shukra)',
    archetype: 'The Aesthetic Harmonizer & Nurturer',
    coreVibration: 'Beauty, gracious living, unconditional empathy, devotion, and refined aesthetics.',
    strengths: ['Creating warm sanctuaries', 'Aesthetic discernment', 'Loyalty and care', 'Heart resonance'],
    growthAreas: ['Self-sacrifice to please others', 'Perfectionism in surroundings', 'Attachment'],
    auspiciousColors: ['Rose Pink', 'Pure White', 'Sky Blue', 'Pastel Lilac'],
    auspiciousDays: ['Friday', 'Monday'],
    recommendedBracelets: ['Shukra Harmony & Grace Bracelet (Rose Quartz & Selenite)'],
    harmonizingDirections: ['Southeast (Agni)', 'Northwest (Vayu)'],
    reflectiveGuidance: 'You bring elegance and emotional comfort to everyone you touch. Remember to nurture your own inner sanctuary with equal tenderness.'
  },
  7: {
    planet: 'Ketu (The Contemplative Mystic)',
    archetype: 'The Introspective Sage & Researcher',
    coreVibration: 'Spiritual inquiry, analytical research, solitude, and inner transcendence.',
    strengths: ['Profound insight', 'Love of solitude and research', 'Discerning intuition', 'Detached clarity'],
    growthAreas: ['Social withdrawal', 'Cynicism', 'Difficulty expressing feelings'],
    auspiciousColors: ['Mist Gray', 'Pale Lavender', 'Sea Green', 'White'],
    auspiciousDays: ['Thursday', 'Sunday'],
    recommendedBracelets: ['Ketu Mystic Seeker Bracelet (Labradorite & Cat Eye)'],
    harmonizingDirections: ['Northeast (Ishan)', 'North (Kuber)'],
    reflectiveGuidance: 'Your contemplative nature is your bridge to timeless wisdom. Balance your inward quest with grounded earthly presence.'
  },
  8: {
    planet: 'Saturn (Shani)',
    archetype: 'The Resilient Master & Karmic Builder',
    coreVibration: 'Endurance, organizational mastery, karmic justice, and steadfast resolve.',
    strengths: ['Unshakeable resilience', 'Long-term strategic execution', 'High integrity', 'Pragmatic wisdom'],
    growthAreas: ['Tendency towards self-harshness', 'Pessimism in slow periods', 'Emotional guardedness'],
    auspiciousColors: ['Midnight Blue', 'Deep Indigo', 'Charcoal Black', 'Dark Violet'],
    auspiciousDays: ['Saturday', 'Friday'],
    recommendedBracelets: ['Shani Grounding & Mastery Bracelet (Obsidian & Blue Tiger Eye)'],
    harmonizingDirections: ['West (Varuna)', 'Southwest (Nairutya)'],
    reflectiveGuidance: 'Mastery is built step by deliberate step. Trust in the law of karmic rhythm; celebrate incremental milestones and allow warmth into your work.'
  },
  9: {
    planet: 'Mars (Mangal)',
    archetype: 'The Purposeful Humanitarian & Warrior of Light',
    coreVibration: 'Courage, boundless dynamic energy, universal compassion, and decisive action.',
    strengths: ['Fearless integrity', 'Warm humanitarian drive', 'High physical stamina', 'Protective strength'],
    growthAreas: ['Sudden temper flare-ups', 'Impulsive commitments', 'Frustration with hesitation'],
    auspiciousColors: ['Coral Red', 'Terracotta', 'Deep Crimson', 'Warm Saffron'],
    auspiciousDays: ['Tuesday', 'Thursday'],
    recommendedBracelets: ['Mangal Dynamic Courage Bracelet (Red Carnelian & Bloodstone)'],
    harmonizingDirections: ['South (Yama)', 'Southeast (Agni)'],
    reflectiveGuidance: 'Your courageous drive can move mountains. Align your passionate fire with mindful patience and universal compassion.'
  }
};

export function analyzeNumerology(day: number, month: number, year: number, name?: string): NumerologyAnalysis {
  const birthNumber = calculateBirthNumber(day);
  const lifePathNumber = calculateLifePathNumber(day, month, year);
  const nameNumber = name ? calculateNameNumber(name) : undefined;

  const arch = numerologyArchetypes[birthNumber] || numerologyArchetypes[1];

  return {
    birthNumber,
    lifePathNumber,
    nameNumber,
    rulingPlanet: arch.planet,
    coreVibration: arch.coreVibration,
    strengths: arch.strengths,
    growthAreas: arch.growthAreas,
    auspiciousColors: arch.auspiciousColors,
    auspiciousDays: arch.auspiciousDays,
    recommendedBracelets: arch.recommendedBracelets,
    harmonizingDirections: arch.harmonizingDirections,
    reflectiveGuidance: arch.reflectiveGuidance
  };
}
