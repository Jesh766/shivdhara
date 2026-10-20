import { Product, Workshop, BlogPost, Testimonial, Consultation } from '../src/types';

const legacyProducts: Product[] = [
  {
    id: 'prod-num-1',
    name: 'Surya Radiant Numerology Bracelet (Number 1)',
    slug: 'surya-radiant-numerology-bracelet-1',
    description: 'Handcrafted with natural Golden Pyrite, Sunstone, and Tiger Eye beads. Traditionally associated with the Sun (Surya) and Birth/Life Path Number 1 individuals. Formulated to foster clarity, leadership, vitality, and focused willpower in traditional esoteric lore.',
    shortDescription: 'Natural Pyrite & Sunstone bracelet traditionally aligned with Number 1 & solar vitality.',
    price: 2499,
    compareAtPrice: 3200,
    sku: 'SD-BRAC-01',
    stock: 18,
    category: 'bracelets',
    featured: true,
    active: true,
    numerologyNumber: 1,
    rulingPlanet: 'Sun (Surya)',
    material: 'Natural Golden Pyrite, AAA Sunstone, Golden Tiger Eye, Brass accent bead',
    beadSize: '8mm faceted & round beads',
    dimensions: 'Stretchable cord, fits 6.5 - 7.5 inch wrists',
    careInstructions: 'Avoid prolonged contact with water or perfumes. Clean gently with a soft dry cloth. Re-energize in morning sunlight.',
    traditionalAssociation: 'Traditionally associated with the Sun, vitality, ambition, and inner authority.',
    images: [
      'https://images.unsplash.com/photo-1611591475102-4fa0120286eb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-num-3',
    name: 'Brihaspati Wisdom Numerology Bracelet (Number 3)',
    slug: 'brihaspati-wisdom-numerology-bracelet-3',
    description: 'Crafted with genuine Yellow Aventurine, natural Citrine, and Sandalwood accents. In the classical tradition, Jupiter (Guru/Brihaspati) represents higher wisdom, creative expansion, and benevolence for Number 3 souls.',
    shortDescription: 'Natural Citrine & Yellow Aventurine bracelet for wisdom, optimism, and expansive growth.',
    price: 2699,
    compareAtPrice: 3500,
    sku: 'SD-BRAC-03',
    stock: 12,
    category: 'bracelets',
    featured: true,
    active: true,
    numerologyNumber: 3,
    rulingPlanet: 'Jupiter (Guru)',
    material: 'Natural Citrine, Yellow Aventurine, Mysore Sandalwood spacer',
    beadSize: '8mm beads with 10mm guru bead',
    dimensions: 'Elastic nylon cord, fits standard wrists',
    careInstructions: 'Clean with natural sage smoke or soft cloth. Keep away from harsh chemicals.',
    traditionalAssociation: 'Traditionally associated with wisdom, teaching, optimism, and spiritual growth.',
    images: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-num-5',
    name: 'Budha Harmonizer Numerology Bracelet (Number 5)',
    slug: 'budha-harmonizer-numerology-bracelet-5',
    description: 'Strung with authentic Canadian Jade, Green Aventurine, and Fluorite. Associated with Mercury (Budha) and Number 5, known as the number of versatility, swift communication, intellect, and balanced commerce.',
    shortDescription: 'Authentic Green Jade & Fluorite bracelet supporting mental agility and communicative harmony.',
    price: 2399,
    compareAtPrice: 3000,
    sku: 'SD-BRAC-05',
    stock: 22,
    category: 'bracelets',
    featured: true,
    active: true,
    numerologyNumber: 5,
    rulingPlanet: 'Mercury (Budha)',
    material: 'Natural Green Jade, Green Aventurine, Rainbow Fluorite',
    beadSize: '8mm premium round beads',
    dimensions: 'Stretchable, fits 6.5 - 7.8 inch wrists',
    careInstructions: 'Clean gently. Re-energize near green foliage or early morning light.',
    traditionalAssociation: 'Traditionally associated with communication, intellect, adaptable energy, and balance.',
    images: [
      'https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-num-6',
    name: 'Shukra Harmony & Grace Numerology Bracelet (Number 6)',
    slug: 'shukra-harmony-grace-numerology-bracelet-6',
    description: 'Combining Madagascar Rose Quartz, Selenite, and Clear Quartz. In traditional systems, Venus (Shukra) governs love, aesthetic beauty, empathy, and emotional serenity for Number 6 personalities.',
    shortDescription: 'Rose Quartz & Clear Quartz bracelet supporting heart resonance and harmonious relationships.',
    price: 2599,
    compareAtPrice: 3400,
    sku: 'SD-BRAC-06',
    stock: 15,
    category: 'bracelets',
    featured: true,
    active: true,
    numerologyNumber: 6,
    rulingPlanet: 'Venus (Shukra)',
    material: 'Madagascar Rose Quartz, Selenite, High-clarity Quartz',
    beadSize: '8mm matte and polished beads',
    dimensions: 'Stretch cord, fits 6.5 - 7.5 inches',
    careInstructions: 'Store in cool dry space. Clean with mild soft cloth.',
    traditionalAssociation: 'Traditionally associated with aesthetic harmony, empathy, devotion, and nurturing spaces.',
    images: [
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1611591475102-4fa0120286eb?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-num-8',
    name: 'Shani Grounding & Mastery Numerology Bracelet (Number 8)',
    slug: 'shani-grounding-mastery-numerology-bracelet-8',
    description: 'Featuring Blue Tiger Eye, High-Grade Black Obsidian, and Deep Amethyst. Aligned with Saturn (Shani) and Number 8, representing karmic discipline, resilience, organizational mastery, and steadfast groundedness.',
    shortDescription: 'Deep Obsidian & Blue Tiger Eye bracelet for resilience, discipline, and grounding.',
    price: 2799,
    compareAtPrice: 3800,
    sku: 'SD-BRAC-08',
    stock: 14,
    category: 'bracelets',
    featured: true,
    active: true,
    numerologyNumber: 8,
    rulingPlanet: 'Saturn (Shani)',
    material: 'Midnight Blue Tiger Eye, Black Obsidian, Dark Amethyst',
    beadSize: '8mm and 10mm beads',
    dimensions: 'High-tensile stretch cord',
    careInstructions: 'Re-charge on earth/stone or under moonlight. Avoid chemicals.',
    traditionalAssociation: 'Traditionally associated with endurance, discipline, grounding, and steady perseverance.',
    images: [
      'https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'
    ]
  },
  {
    id: 'prod-mala-108',
    name: 'Panchamukhi Sacred Rudraksha Meditation Mala (108 Beads)',
    slug: 'panchamukhi-sacred-rudraksha-meditation-mala',
    description: '108 hand-knotted authentic 5-Mukhi Nepali Rudraksha beads with traditional silk tassel. Designed for daily Japa meditation, breath counting, and cultivating inner stillness.',
    shortDescription: 'Authentic 108-bead Nepali 5-Mukhi Rudraksha Mala for conscious meditation and Japa practice.',
    price: 3499,
    compareAtPrice: 4500,
    sku: 'SD-MALA-108',
    stock: 9,
    category: 'malas',
    featured: true,
    active: true,
    material: 'Natural 5-Mukhi Nepali Rudraksha, Pure Cotton thread, Pure Silk Tassel',
    beadSize: '7mm - 8mm hand-selected seeds',
    dimensions: 'Approx 36 inches around',
    careInstructions: 'Condition occasionally with natural sandalwood or almond oil. Keep in a dedicated sacred pouch.',
    traditionalAssociation: 'Traditionally associated with Lord Shiva, peaceful mind, and focused meditation.',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=800&q=80'
    ]
  }
];

export const initialProducts: Product[] = [
  {
    id: 'bracelet-number-1',
    name: 'Surya Ruby & Sunstone Numerology Bracelet',
    slug: 'surya-ruby-sunstone-numerology-bracelet',
    description: 'A warm solar bracelet combining ruby-toned garnet, sunstone, and golden tiger eye. Traditionally chosen for Number 1 energy: confidence, initiative, leadership, and clear personal direction.',
    shortDescription: 'Solar stones for confident beginnings and focused leadership.',
    price: 2499, compareAtPrice: 2999, sku: 'SD-NB-01', stock: 20, category: 'bracelets', featured: true, active: true,
    numerologyNumber: 1, rulingPlanet: 'Sun (Surya)', material: 'Natural Sunstone, Red Garnet, Golden Tiger Eye', beadSize: '8mm round beads', dimensions: 'Stretch fit for 6.5 - 7.5 inch wrists',
    careInstructions: 'Keep dry and wipe with a soft cloth after use.', traditionalAssociation: 'Traditionally associated with vitality, authority, courage, and new beginnings.',
    images: ['https://images.unsplash.com/photo-1611591475102-4fa0120286eb?auto=format&fit=crop&w=900&q=85']
  },
  {
    id: 'bracelet-number-2',
    name: 'Chandra Pearl & Moonstone Numerology Bracelet',
    slug: 'chandra-pearl-moonstone-numerology-bracelet',
    description: 'A gentle lunar combination of white moonstone, freshwater pearl, and silver-toned hematite. Designed around Number 2 themes of emotional balance, intuition, cooperation, and calm communication.',
    shortDescription: 'Lunar stones for intuition, harmony, and emotional steadiness.',
    price: 2299, compareAtPrice: 2799, sku: 'SD-NB-02', stock: 18, category: 'bracelets', featured: true, active: true,
    numerologyNumber: 2, rulingPlanet: 'Moon (Chandra)', material: 'White Moonstone, Freshwater Pearl, Silver Hematite', beadSize: '8mm polished beads', dimensions: 'Stretch fit for 6.5 - 7.5 inch wrists',
    careInstructions: 'Store away from direct sunlight and perfumes.', traditionalAssociation: 'Traditionally associated with sensitivity, diplomacy, intuition, and receptive strength.',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85']
  },
  {
    id: 'bracelet-number-3',
    name: 'Guru Citrine & Yellow Aventurine Numerology Bracelet',
    slug: 'guru-citrine-yellow-aventurine-numerology-bracelet',
    description: 'Bright citrine and yellow aventurine beads create an optimistic bracelet for Number 3. Its traditional symbolism centres on learning, creativity, generous expression, and expansive personal growth.',
    shortDescription: 'Golden stones for learning, optimism, and creative expression.',
    price: 2699, compareAtPrice: 3299, sku: 'SD-NB-03', stock: 16, category: 'bracelets', featured: true, active: true,
    numerologyNumber: 3, rulingPlanet: 'Jupiter (Guru)', material: 'Natural Citrine, Yellow Aventurine, Sandalwood spacer', beadSize: '8mm round beads', dimensions: 'Stretch fit for 6.5 - 7.5 inch wrists',
    careInstructions: 'Clean with a dry cloth and keep away from harsh chemicals.', traditionalAssociation: 'Traditionally associated with wisdom, teaching, joy, and spiritual expansion.',
    images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85']
  },
  {
    id: 'bracelet-number-4',
    name: 'Rahu Hessonite & Smoky Quartz Numerology Bracelet',
    slug: 'rahu-hessonite-smoky-quartz-numerology-bracelet',
    description: 'Smoky quartz and warm hessonite-inspired tones form a grounded Number 4 bracelet. Traditionally selected for structure, practical thinking, discipline, and steady progress through change.',
    shortDescription: 'Grounding stones for structure, focus, and practical progress.',
    price: 2399, compareAtPrice: 2899, sku: 'SD-NB-04', stock: 14, category: 'bracelets', featured: false, active: true,
    numerologyNumber: 4, rulingPlanet: 'Rahu', material: 'Smoky Quartz, Hessonite Garnet, Matte Onyx', beadSize: '8mm matte and polished beads', dimensions: 'Stretch fit for 6.5 - 7.5 inch wrists',
    careInstructions: 'Keep in a fabric pouch and wipe clean after wearing.', traditionalAssociation: 'Traditionally associated with order, resilience, unconventional insight, and grounded action.',
    images: ['https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=85']
  },
  {
    id: 'bracelet-number-5',
    name: 'Budha Green Aventurine & Jade Numerology Bracelet',
    slug: 'budha-green-aventurine-jade-numerology-bracelet',
    description: 'Green aventurine, jade, and fluorite create a fresh Number 5 bracelet. Traditionally associated with Mercury, it supports themes of adaptability, communication, commerce, curiosity, and mental agility.',
    shortDescription: 'Green stones for adaptable thinking and clear communication.',
    price: 2399, compareAtPrice: 2999, sku: 'SD-NB-05', stock: 22, category: 'bracelets', featured: true, active: true,
    numerologyNumber: 5, rulingPlanet: 'Mercury (Budha)', material: 'Green Aventurine, Canadian Jade, Rainbow Fluorite', beadSize: '8mm premium round beads', dimensions: 'Stretch fit for 6.5 - 7.8 inch wrists',
    careInstructions: 'Avoid prolonged water exposure and clean with a soft cloth.', traditionalAssociation: 'Traditionally associated with intellect, travel, speech, adaptability, and balance.',
    images: ['https://images.unsplash.com/photo-1598560917505-59a3ad559071?auto=format&fit=crop&w=900&q=85']
  },
  {
    id: 'bracelet-number-6',
    name: 'Shukra Rose Quartz & Clear Quartz Numerology Bracelet',
    slug: 'shukra-rose-quartz-clear-quartz-numerology-bracelet',
    description: 'Soft pink rose quartz paired with clear quartz creates a refined Number 6 bracelet. Traditionally associated with Venus, it speaks to love, beauty, empathy, devotion, and harmonious relationships.',
    shortDescription: 'Rose quartz bracelet for heart-led harmony and gentle connection.',
    price: 2599, compareAtPrice: 3199, sku: 'SD-NB-06', stock: 19, category: 'bracelets', featured: true, active: true,
    numerologyNumber: 6, rulingPlanet: 'Venus (Shukra)', material: 'Natural Rose Quartz, Clear Quartz, Selenite accent', beadSize: '8mm polished beads', dimensions: 'Stretch fit for 6.5 - 7.5 inch wrists',
    careInstructions: 'Store in a cool dry place and keep away from harsh sunlight.', traditionalAssociation: 'Traditionally associated with affection, aesthetic harmony, nurturing, and creative beauty.',
    images: ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=900&q=85']
  },
  {
    id: 'bracelet-number-7',
    name: 'Ketu Amethyst & Labradorite Numerology Bracelet',
    slug: 'ketu-amethyst-labradorite-numerology-bracelet',
    description: 'Deep amethyst and labradorite beads make a contemplative Number 7 bracelet. Traditionally chosen for introspection, study, spiritual inquiry, discernment, and quiet inner focus.',
    shortDescription: 'Mystic stones for reflection, study, and inner focus.',
    price: 2799, compareAtPrice: 3399, sku: 'SD-NB-07', stock: 13, category: 'bracelets', featured: false, active: true,
    numerologyNumber: 7, rulingPlanet: 'Ketu', material: 'Natural Amethyst, Labradorite, Matte Quartz', beadSize: '8mm faceted beads', dimensions: 'Stretch fit for 6.5 - 7.5 inch wrists',
    careInstructions: 'Keep away from strong sunlight and store in a soft pouch.', traditionalAssociation: 'Traditionally associated with research, intuition, detachment, and contemplative wisdom.',
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=85']
  },
  {
    id: 'bracelet-number-8',
    name: 'Shani Black Obsidian & Blue Tiger Eye Numerology Bracelet',
    slug: 'shani-black-obsidian-blue-tiger-eye-numerology-bracelet',
    description: 'Black obsidian, blue tiger eye, and dark amethyst create a strong Number 8 bracelet. Traditionally associated with Saturn, it represents resilience, boundaries, patience, responsibility, and earned mastery.',
    shortDescription: 'Protective dark stones for resilience and grounded discipline.',
    price: 2799, compareAtPrice: 3499, sku: 'SD-NB-08', stock: 17, category: 'bracelets', featured: true, active: true,
    numerologyNumber: 8, rulingPlanet: 'Saturn (Shani)', material: 'Black Obsidian, Blue Tiger Eye, Dark Amethyst', beadSize: '8mm and 10mm beads', dimensions: 'High-tensile stretch cord for standard wrists',
    careInstructions: 'Re-energize on a clean stone and avoid chemical cleaners.', traditionalAssociation: 'Traditionally associated with endurance, justice, responsibility, and long-term achievement.',
    images: ['https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&w=900&q=85']
  },
  {
    id: 'bracelet-number-9',
    name: 'Mangal Carnelian & Red Jasper Numerology Bracelet',
    slug: 'mangal-carnelian-red-jasper-numerology-bracelet',
    description: 'Carnelian and red jasper bring warm, active tones to the Number 9 bracelet. Traditionally aligned with Mars, this combination represents courage, service, decisive action, protection, and completion.',
    shortDescription: 'Fiery stones for courage, action, service, and completion.',
    price: 2499, compareAtPrice: 3099, sku: 'SD-NB-09', stock: 21, category: 'bracelets', featured: false, active: true,
    numerologyNumber: 9, rulingPlanet: 'Mars (Mangal)', material: 'Carnelian, Red Jasper, Lava Stone accent', beadSize: '8mm natural round beads', dimensions: 'Stretch fit for 6.5 - 7.5 inch wrists',
    careInstructions: 'Wipe dry after use and store away from moisture.', traditionalAssociation: 'Traditionally associated with courage, compassion, action, protection, and closure.',
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85']
  },
  {
    id: 'bracelet-number-11',
    name: 'Master Number 11 Lapis Lazuli & Clear Quartz Bracelet',
    slug: 'master-number-11-lapis-lazuli-clear-quartz-bracelet',
    description: 'A signature master-number bracelet combining lapis lazuli, clear quartz, and hematite. Designed for Number 11 themes of inspired vision, honest expression, spiritual sensitivity, and purposeful guidance.',
    shortDescription: 'Lapis and quartz for inspired vision and purposeful expression.',
    price: 2999, compareAtPrice: 3699, sku: 'SD-NB-11', stock: 11, category: 'bracelets', featured: true, active: true,
    numerologyNumber: 11, rulingPlanet: 'Master Number 11', material: 'Lapis Lazuli, Clear Quartz, Hematite accent', beadSize: '8mm polished beads with 10mm focal bead', dimensions: 'Stretch fit for 6.5 - 7.5 inch wrists',
    careInstructions: 'Keep dry, store separately, and cleanse with a soft cloth.', traditionalAssociation: 'Traditionally associated with intuition, inspired leadership, truth, and higher purpose.',
    images: ['https://images.unsplash.com/photo-1506630448388-4e683c67ddb0?auto=format&fit=crop&w=900&q=85']
  }
];

export const initialWorkshops: Workshop[] = [
  {
    id: 'ws-numerology',
    title: 'The Language of Numbers: Numerology Masterclass',
    slug: 'numerology-masterclass',
    tagline: 'Unlock the archetypal patterns of your birth date, life path, and personal cycles.',
    description: 'An immersive 2-day live workshop guided personally by Falgun Thakkar. Move beyond generic horoscopes into the classical esoteric science of numbers (Sankhya Shastra), discovering your core vibrational strengths, karmic cycles, and practical alignment techniques.',
    detailedOverview: [
      'Understanding the 9 primordial archetypes from 1 (Sun) to 9 (Mars)',
      'Calculating Moolank (Birth Number), Bhagyank (Destiny Number), and Namank (Name Number)',
      'Grid analysis (Lo Shu Grid) and missing element harmonization',
      'Personal year cycles and choosing opportune timings for significant transitions',
      'Selecting complementary spiritual accessories and daily practices'
    ],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    date: '2026-09-19',
    displayDate: 'September 19 – 20, 2026',
    startTime: '10:00 AM IST',
    endTime: '2:00 PM IST',
    duration: '2 Days (8 Hours Total)',
    location: 'Interactive Live Session (Zoom HD) + Recording Access',
    isOnline: true,
    capacity: 35,
    registeredCount: 28,
    price: 4999,
    instructor: 'Falgun Thakkar',
    instructorBio: 'Founder of SHIV DHARA with years of dedicated inquiry into classical Sankhya Shastra, Vastu Vidya, and mindfulness traditions. Falgun teaches with modern clarity, zero fear-mongering, and actionable spiritual depth.',
    highlights: [
      'Comprehensive PDF Workbook & Personal Numerology Chart Template',
      'Live Q&A with Falgun Thakkar for your specific chart questions',
      '30-day recording access and private community discussion',
      'Complimentary consultation voucher (₹1,000 credit)'
    ],
    curriculum: [
      { phase: 'Day 1 — Module 1', title: 'Foundations of Sankhya Shastra', desc: 'The 9 planetary vibrations, calculation methodologies, and avoiding common reduction mistakes.' },
      { phase: 'Day 1 — Module 2', title: 'The Triad: Birth, Destiny, and Name Resonance', desc: 'Synthesizing your primary numbers into a cohesive personal blueprint.' },
      { phase: 'Day 2 — Module 3', title: 'The Energy Grid & Remedies without Fear', desc: 'Balancing elemental gaps using colors, spatial adjustments, and mindfulness.' },
      { phase: 'Day 2 — Module 4', title: 'Personal Year Cycles & Applied Action', desc: 'Navigating multi-year life waves with calm strategic awareness.' }
    ],
    active: true
  },
  {
    id: 'ws-vastu-living',
    title: 'Vastu for Modern Spaces: Energy Harmony & Abundance',
    slug: 'vastu-for-modern-spaces',
    tagline: 'Practical spatial alignment for contemporary apartments, homes, and workspaces.',
    description: 'Discover how the 8 cardinal and inter-cardinal directions interact with the 5 universal elements (Pancha Mahabhutas). Learn non-destructive remedies, optimal functional placements, and how to create an environment that nurtures calm, vitality, and prosperity.',
    detailedOverview: [
      'The Vastu Purusha Mandala decoded for modern architectural layouts',
      'The 8 Cardinal Directions: North (Kuber), NE (Ishan), East (Surya), SE (Agni), South (Yama), SW (Nairutya), West (Varuna), NW (Vayu)',
      'Rectifying directional imbalances without structural demolition',
      'Creating high-vibration home meditation corners and focused study/work desks',
      'Vastu for sleep quality, emotional peace, and harmonious family living'
    ],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-10',
    displayDate: 'October 10 – 11, 2026',
    startTime: '11:00 AM IST',
    endTime: '3:00 PM IST',
    duration: '2 Days (8 Hours Total)',
    location: 'Interactive Live Session + Optional Mumbai Studio In-Person Seats',
    isOnline: true,
    capacity: 30,
    registeredCount: 22,
    price: 5999,
    instructor: 'Falgun Thakkar',
    instructorBio: 'Spatial energy consultant and founder of SHIV DHARA. Falgun bridges ancient Vastu principles with modern interior aesthetics to create tranquil, purposeful spaces.',
    highlights: [
      'Step-by-step Home Blueprint Audit Template',
      'Directional Compass & Elemental Color Guide',
      'Case studies of modern apartment rectifications',
      'Direct feedback on one floorplan submission'
    ],
    curriculum: [
      { phase: 'Day 1 — Module 1', title: 'The 5 Elements & The Living Grid', desc: 'Understanding space, air, fire, water, and earth in residential environments.' },
      { phase: 'Day 1 — Module 2', title: 'Key Zones: Entrance, Kitchen, Master Bedroom', desc: 'Optimal orientation for core living zones and restorative sleep.' },
      { phase: 'Day 2 — Module 3', title: 'Non-Destructive Energy Rectification', desc: 'Using light, sacred geometry, metals, plants, and mirrors effectively.' },
      { phase: 'Day 2 — Module 4', title: 'Commercial & Workspace Vastu', desc: 'Enhancing productivity, customer welcoming energy, and financial clarity.' }
    ],
    active: true
  },
  {
    id: 'ws-shiva-stillness',
    title: 'Shiv Dhara: The Art of Inner Stillness & Conscious Breathing',
    slug: 'shiv-dhara-inner-stillness-meditation',
    tagline: 'A weekend immersive retreat into diaphragmatic pranayama, mantra resonance, and deep silence.',
    description: 'Step away from digital overstimulation into a sanctuary of profound calm. Guided by Falgun Thakkar, this weekend immersion introduces structured breathwork, sound resonance (Nada), and contemplative awareness to soothe the nervous system.',
    detailedOverview: [
      'Somatic breath control and calming the sympathetic nervous system',
      'Nada sound resonance and OM harmonic centering',
      'Dissolving habitual thought loops through witnessing awareness (Sakshi Bhava)',
      'Establishing an enduring 20-minute daily meditation ritual'
    ],
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
    date: '2026-10-24',
    displayDate: 'October 24 – 25, 2026',
    startTime: '7:00 AM IST',
    endTime: '10:00 AM IST',
    duration: '2 Morning Sessions (6 Hours Total)',
    location: 'Online Live Meditation Sanctuary + Guided Audio Pack',
    isOnline: true,
    capacity: 50,
    registeredCount: 39,
    price: 3499,
    instructor: 'Falgun Thakkar',
    instructorBio: 'Longtime practitioner of Himalayan and traditional meditation techniques, dedicated to making timeless contemplative practices accessible to contemporary seekers.',
    highlights: [
      '4 High-Fidelity Guided Meditation Audio Tracks (Flac/MP3)',
      'Daily 21-Day Mindfulness Integration Roadmap',
      'Breathing journal and sleep optimization protocol'
    ],
    curriculum: [
      { phase: 'Day 1 — Morning', title: 'The Breath as an Anchor', desc: 'Pranayama fundamentals, posture alignment, and physical relaxation.' },
      { phase: 'Day 1 — Deepening', title: 'Stillness Beyond Noise', desc: 'Transcending internal chatter with gentle mindfulness inquiry.' },
      { phase: 'Day 2 — Morning', title: 'Nada Yoga & Sound Resonance', desc: 'Tuning internal frequencies with primordial sound vibration.' },
      { phase: 'Day 2 — Integration', title: 'Living in Alignment', desc: 'Carrying centered calm into intense workdays and relationships.' }
    ],
    active: true
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'The Architecture of Birth Numbers: Understanding Your Core Vibration',
    slug: 'architecture-of-birth-numbers-core-vibration',
    excerpt: 'How Sankhya Shastra looks at the exact day of your birth not as a fatalistic prophecy, but as a symbolic blueprint of inherent strengths and inclinations.',
    content: `Numerology, in its authentic classical tradition, is not a crystal ball of rigid fortune-telling. At SHIV DHARA, we approach Sankhya Shastra (the science of numbers) as a contemplative mirror.

### The Significance of Moolank (Birth Number)
Your Birth Number (calculated by reducing the day of the month you were born to a single digit from 1 to 9) indicates your initial behavioral baseline and instinctive response to the world.

- **Number 1 (Sun):** Natural initiator, driven by clarity, authority, and creative self-expression.
- **Number 2 (Moon):** Intuitive, receptive, prioritizing emotional connection and diplomacy.
- **Number 3 (Jupiter):** Expansive, philosophical, natural communicator and seeker of truth.
- **Number 4 (Rahu):** Structural thinker, unconventional visionary, capable of profound deep focus.
- **Number 5 (Mercury):** Adaptable, curious, dynamic traveler and analytical communicator.
- **Number 6 (Venus):** Aesthetic harmonizer, compassionate caregiver, creating beauty and warmth.
- **Number 7 (Ketu):** Inward investigator, introspective researcher, valuing quiet contemplation.
- **Number 8 (Saturn):** Resilient builder, pragmatic strategist, mastering patience and justice.
- **Number 9 (Mars):** Compassionate warrior, purposeful humanitarian, energetic and brave.

### Moving From Fatalism to Conscious Action
Knowing your core number allows you to recognize when you are operating in its luminous aspect (e.g., leadership for 1, diplomacy for 2) versus its shadow (e.g., obstinacy or hyper-sensitivity). Through tailored mindfulness and environmental alignment, you cultivate intentional living.`,
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    author: 'Falgun Thakkar',
    authorRole: 'Founder, SHIV DHARA',
    category: 'Numerology',
    readTime: '5 min read',
    published: true,
    publishedAt: '2026-08-10'
  },
  {
    id: 'blog-2',
    title: 'The Vastu Purusha Mandala: Harmonizing Space with the 5 Elements',
    slug: 'vastu-purusha-mandala-5-elements-space-harmony',
    excerpt: 'Discover the ancient Indian spatial grid and how balanced directional flow fosters restorative sleep, mental clarity, and domestic tranquility.',
    content: `Every physical dwelling is an energetic vessel. In traditional Indian architecture and Vastu Vidya, a space is not merely four walls and a roof; it is an organic ecosystem shaped by the interaction of solar paths, magnetic fields, and the 5 primordial elements (Pancha Mahabhutas).

### The Northeast (Ishan) — Water & Spirit
The Northeast corner receives the gentle morning ultraviolet rays. In classical Vastu, this is the zone of pure consciousness, intuition, and mental clarity. Keeping this quadrant uncluttered, light, and ideally suited for meditation or reflection helps anchor peace throughout the home.

### The Southeast (Agni) — Fire & Transformation
Governed by the fire element, the Southeast supports digestion, energetic drive, and enthusiasm. Placing the kitchen or heating apparatus in this quadrant honors its transformative nature.

### The Southwest (Nairutya) — Earth & Stability
The heaviest, most grounded corner of any structure is the Southwest. It represents stability, master leadership, and long-term grounding. Placing the primary bedroom or heavy furnishings here provides grounding support for the heads of household.

### Practical Modern Advice
You do not need to tear down walls to bring harmony into an apartment. Subtle shifts in lighting, color palette, plant placement, and intentional spatial zoning can revitalize stale energy and create a peaceful sanctuary.`,
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    author: 'Falgun Thakkar',
    authorRole: 'Founder, SHIV DHARA',
    category: 'Vastu',
    readTime: '6 min read',
    published: true,
    publishedAt: '2026-08-14'
  },
  {
    id: 'blog-3',
    title: 'Returning to Stillness: The Power of Diaphragmatic Breath',
    slug: 'returning-to-stillness-power-of-diaphragmatic-breath',
    excerpt: 'Why conscious breathing is the single most accessible bridge between involuntary stress reflexes and deep, serene neurological calm.',
    content: `In our fast-paced modern world, the breath is often the first physiological function to become shallow, erratic, and constrained. When we breathe rapidly into our upper chest, we inadvertently signal to our brain that we are under threat.

### The Physiology of Stillness
When you consciously engage the diaphragm—allowing the abdomen to gently expand on the inhale and soften on the exhale—the vagus nerve sends immediate calming signals to the heart and nervous system.

### A Simple 3-Step Daily Practice (Shiv Dhara Alignment)
1. **Inhale (4 Seconds):** Breathe smoothly through the nose, drawing vitality into the lower belly.
2. **Hold (4 Seconds):** Rest in the natural stillness between the breaths without straining.
3. **Exhale (6 Seconds):** Release slowly and completely, letting go of accumulated tension.

Practicing this rhythm for even 7 minutes each morning cultivates an unshakable inner center that stays with you throughout your day.`,
    coverImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
    author: 'Falgun Thakkar',
    authorRole: 'Founder, SHIV DHARA',
    category: 'Meditation',
    readTime: '4 min read',
    published: true,
    publishedAt: '2026-08-16'
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Aarav Mehta',
    location: 'Mumbai, India',
    testimonial: 'Falgunji’s numerology consultation gave me tremendous clarity during a major career transition. His calm, logical, and deeply authentic perspective was refreshing—no fear, just profound insight.',
    service: 'Numerology Consultation',
    rating: 5,
    isDemoData: true,
    approved: true,
    createdAt: '2026-07-15'
  },
  {
    id: 'test-2',
    name: 'Sunita Rao',
    location: 'Bengaluru, India',
    testimonial: 'We applied Falgun’s non-invasive Vastu recommendations for our new apartment. The shift in atmosphere was noticeable within days—the living room feels vastly more open, peaceful, and welcoming.',
    service: 'Home Vastu Audit',
    rating: 5,
    isDemoData: true,
    approved: true,
    createdAt: '2026-07-28'
  },
  {
    id: 'test-3',
    name: 'Vikramaditya S.',
    location: 'Dubai, UAE',
    testimonial: 'The Surya Radiant bracelet is exquisite. The weight of the natural pyrite and sunstone is substantial, and the workmanship is unmistakably premium. It feels like a meaningful daily anchor.',
    service: 'Numerology Bracelet (Number 1)',
    rating: 5,
    isDemoData: true,
    approved: true,
    createdAt: '2026-08-02'
  },
  {
    id: 'test-4',
    name: 'Pooja Deshmukh',
    location: 'Pune, India',
    testimonial: 'The Shiv Dhara meditation workshop was transformative. Falgun Thakkar demystified pranayama and helped me build a consistent morning practice that has fundamentally changed my stress levels.',
    service: 'Meditation Workshop',
    rating: 5,
    isDemoData: true,
    approved: true,
    createdAt: '2026-08-09'
  }
];

export const initialFAQs = [
  {
    category: 'Numerology',
    question: 'How is Numerology different from Western or Chaldean numerology?',
    answer: 'Numerology (Sankhya Shastra) links numbers directly to the 9 planetary energies (Navagrahas) of Indian cosmology. It emphasizes the balance between your Birth Number (Moolank), Destiny Number (Bhagyank), and Name Number (Namank), treating numbers as energetic archetypes rather than fatalistic prophecies.'
  },
  {
    category: 'Vastu',
    question: 'Does Vastu consultation require breaking walls or demolition?',
    answer: 'At SHIV DHARA, Falgun Thakkar specializes in non-destructive spatial harmonizations. In 95%+ of cases, energy flow can be effectively balanced through elemental re-zoning, lighting, color therapy, placement shifts, sacred geometry, and natural remedies without structural demolition.'
  },
  {
    category: 'Products',
    question: 'How do I choose the right Numerology Bracelet?',
    answer: 'You can choose based on your Birth Number (the single-digit reduction of the day of the month you were born) or consult Dhara, our AI assistant, to determine your number. Each bracelet is handcrafted with natural grade-A gemstones traditionally resonant with specific archetypes.'
  },
  {
    category: 'Consultations',
    question: 'Are online consultations as effective as in-person visits?',
    answer: 'Yes. Online video consultations are conducted with high precision. For Numerology and Meditation, online is 100% equivalent. For Vastu, clients provide accurate floor plans, directional compass readings, and video walk-throughs which Falgun analyzes meticulously.'
  },
  {
    category: 'Workshops',
    question: 'Do I need prior spiritual or meditation experience to attend a workshop?',
    answer: 'Not at all. All SHIV DHARA workshops are structured from ground principles. Beginners find the instruction clear and accessible, while experienced seekers appreciate the depth of classical nuances.'
  }
];
