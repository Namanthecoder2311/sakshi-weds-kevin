// ─────────────────────────────────────────────────────────────
//  ALL INVITATION TEXT LIVES HERE.
//  Lines marked ✏️ are placeholders — replace with the real details.
//  The wedding date is intentionally NOT shown anywhere (Sakshi’s wish).
// ─────────────────────────────────────────────────────────────

export const COUPLE = {
  bride: 'Sakshi',
  groom: 'Kevin',
  monogram: ['S', 'K'] as const,
  brideFamily: [
    'Granddaughter of Vimlaben Vasanji Satra',
    'Daughter of Mrs. Anita Satra & Mr. Ashwin Satra',
    'Village – Gundala',
  ],
  groomFamily: ['Grandson of Zaverben Champshi Gala'],
};

export const BLESSING =
  'With blessings as our crown, joy as our music and petals beneath our feet, we joyfully invite you to witness two souls becoming one.';

export type EventItem = {
  id: 'haldi' | 'mehendi' | 'wedding';
  name: string;
  hindi: string;
  day: string; // shown instead of a date
  time: string;
  place: string;
  line: string;
  dress: string;
  swatches: string[];
  accent: string;
};

// ✏️ times & places
export const EVENTS: EventItem[] = [
  {
    id: 'haldi',
    name: 'Haldi',
    hindi: 'हल्दी',
    day: 'Day One',
    time: '10:00 am onwards',
    place: 'Venue to be announced',
    line: 'A morning bathed in turmeric, laughter & sunlight.',
    dress: 'Sunshine Yellow · florals & soft pastels',
    swatches: ['#F2C230', '#F7DA6A', '#FBF3D9'],
    accent: '#D9A11A',
  },
  {
    id: 'mehendi',
    name: 'Mehendi',
    hindi: 'मेहंदी',
    day: 'Day One',
    time: '4:00 pm onwards',
    place: 'Venue to be announced',
    line: 'Henna, music and a thousand quiet wishes.',
    dress: 'Olive & Blush · pastel hues, light embroidery',
    swatches: ['#7D8B45', '#E8A8A0', '#F3E6D6'],
    accent: '#6E8A3C',
  },
  {
    id: 'wedding',
    name: 'Wedding',
    hindi: 'विवाह',
    day: 'Day Two',
    time: '8:00 pm onwards',
    place: 'Celebration Lawn, Borivali',
    line: 'The vow that begins our forever.',
    dress: 'Ivory, Red & Emerald · royal silks, heavy gold',
    swatches: ['#9E2B3A', '#F3E6CC', '#3E7B5B'],
    accent: '#9E2B3A',
  },
];

export const VENUE = {
  name: 'Celebration Lawn',
  area: 'Borivali, Mumbai',
  /** Google Maps link for “Open live location” */
  mapsUrl: 'https://maps.app.goo.gl/CQAQLonroFgD3Fwd7',
};

/** ✏️ Optional: put photos in public/photos and list them, e.g. '/photos/1.jpg' — adds a gallery page */
export const PHOTOS: string[] = [];

/** ✏️ Optional background song: drop an mp3 at public/music.mp3 and set '/music.mp3' */
export const MUSIC = '';

/** Paintings made with ChatGPT / Gemini (see ART_PROMPTS.md). Missing files fall back gracefully. */
export const ART = {
  cover: '/art/cover.webp',
  haldi: '/art/haldi.webp',
  mehendi: '/art/mehendi.webp',
  wedding: '/art/wedding.webp',
};

/** Curtain fabric on the opening screen: 'wine' (royal velvet), 'ivory' (champagne silk) or 'emerald' (velvet).
 *  Preview any of them by adding ?curtain=ivory (etc.) to the URL. */
export const CURTAIN: 'wine' | 'ivory' | 'emerald' = 'wine';

export const THANK_YOU = 'Your love, blessings & presence mean the world to us. Thank you for being a part of our forever.';
