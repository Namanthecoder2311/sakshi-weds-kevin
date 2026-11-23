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
  groomFamily: [
    'Grandson of Zaverben Champshi Gala',
    'Son of Smt. Pragna Gala and Late Mr. Haresh Gala',
    'Village – Toda',
  ],
};

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
  mapsUrl:
    'https://www.google.com/maps/place/Celebration+Lawn+Borivali/@19.2488106,72.8452875,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7b11f83bb2f2f:0xf5f4c23d49c3397!8m2!3d19.2488106!4d72.8452875!16s%2Fg%2F11lnhmdzvj',
};

/** Photos for the “Our Moments” gallery (public/photos). ✏️ captions are editable. */
export const PHOTOS: { src: string; caption: string; pos: string }[] = [
  { src: '/photos/1.webp', caption: 'Mountains & us', pos: '50% 55%' },
  { src: '/photos/2.webp', caption: 'Hold me close', pos: '50% 50%' },
  { src: '/photos/3.webp', caption: 'Our date night', pos: '50% 38%' },
  { src: '/photos/4.webp', caption: 'Sail away with me', pos: '50% 42%' },
];

/** Background song: drop an mp3 at public/music.mp3 — it plays (fading in) as the doors open.
 *  If the file isn't there, the music button simply doesn't appear. */
export const MUSIC = '/music.mp3';

/** Paintings made with ChatGPT / Gemini (see ART_PROMPTS.md). Missing files fall back gracefully. */
export const ART = {
  cover: '/art/cover.webp',
  haldi: '/art/haldi.webp',
  mehendi: '/art/mehendi.webp',
  wedding: '/art/wedding.webp',
};

export const THANK_YOU = 'Your love, blessings & presence mean the world to us. Thank you for being a part of our forever.';
