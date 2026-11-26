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
    'Presently – Vile Parle',
  ],
  groomFamily: [
    'Grandson of Zaverben Champshi Gala',
    'Son of Smt. Pragna Gala and Late Mr. Haresh Gala',
    'Village – Toda',
    'Presently – Vile Parle',
  ],
};

/** Top of the family card (from the printed Gujarati card, in English). */
export const INVOCATIONS = ['Shree Ambhai Namah', 'Shree Ganeshay Namah', 'Shree Mahaviray Namah'];
export const GANESH_VERSE = [
  ['Shree Gauri Nandan Ganesh,', 'Shree Brahma, Vishnu, Mahesh,'],
  ['please grace us with Riddhi & Siddhi,', 'please grace us with all your family.'],
];
export const GREETING = 'With great joy and happiness, we are delighted to share that';
export const BIDAAI_QUOTE =
  'Treating her parents’ home as another’s, draped in the panetar of her father’s love, carrying her mother’s sweet blessings, leaving behind the cherished affection of her brothers and sisters, she steps into the loving embrace of her Mama & Mami…';

/** Wedding-day programme (times only — the date stays hidden). */
export const WEDDING_DAY = [
  { icon: '🎺', name: 'Jaan nu Swagat', meaning: 'Welcoming the groom’s procession', time: '3:45 pm' },
  { icon: '💞', name: 'Hastmelap', meaning: 'The sacred joining of hands', time: '4:30 pm' },
  { icon: '🍽️', name: 'Preeti Bhojan', meaning: 'Dinner with love', time: '5:30 pm' },
  { icon: '✨', name: 'Aashish Sandhya', meaning: 'An evening of blessings', time: '7 – 10 pm' },
];

/** Hosts & family who welcome the guests. */
export const WELCOME = {
  hostsTitle: 'Seeking the honour of welcoming you',
  hosts: ['Matushree Smt. Vimlaben Vasanji Satra (Gundala)', 'Rekhaben Vasanji Satra', 'Matushree Smt. Shantaben Damji Gala (Vadala)'],
  hostsClosing: 'and Jai Jinendra from the entire Satra & Gala families.',
  eagerTitle: 'Eagerly waiting to welcome you',
  eager: [
    'Mrs. Hina Kirti Satra (Gundala)',
    'Mrs. Pushpa Rasik Gangar (Lakhapar)',
    'Smt. Preeti Kirit Bauva (Tumbadi)',
    'Smt. Mohini Mihir Satra (Gundala)',
    'Shri Naman Ashwin Satra (Gundala)',
    'Smt. Pooja Paresh Gala (Vadala)',
    'Shri Nayana Rohit Chheda (Navavas)',
    'Mrs. Rita Naresh Sangoi (Toda)',
    'Mrs. Bharti Deepak Visaria (Mokha)',
    'Mrs. Hiral Harsh Chheda (Navavas)',
  ],
  kidsLine: 'Don’t you dare forget to come to our sister’s wedding!',
  kids: ['Naman', 'Vishal', 'Mihir', 'Hinal – Amit', 'Udit', 'Khushbu', 'Jinkal', 'Kajal – Jay', 'Archita – Devendra', 'Hinal', 'Het', 'Raj', 'Jinay', 'Setvi'],
  presence: 'Your presence is the greatest gift',
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
    time: '3:45 pm onwards',
    place: 'Celebration Lawn, Borivali (West)',
    line: 'The vow that begins our forever.',
    dress: 'Ivory, Red & Emerald · royal silks, heavy gold',
    swatches: ['#9E2B3A', '#F3E6CC', '#3E7B5B'],
    accent: '#9E2B3A',
  },
];

export const VENUE = {
  name: 'Celebration Lawn',
  area: 'Borivali (West), Mumbai',
  address: 'Link Road, below Mandapeshwar Metro Station, Ganpat Patil Nagar, Borivali (West), Mumbai – 400103',
  note: 'Valet parking available',
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
