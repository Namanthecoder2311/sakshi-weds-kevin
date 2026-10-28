import type { WeddingEvent, LoveStoryChapter, BlessingItem } from '../types/wedding';

export const WEDDING_CONFIG = {
  brideName: 'Sakshi',
  groomName: 'Kevin',
  weddingDateISO: '2027-02-16T18:00:00+05:30', // Feb 16, 2027, 6:00 PM IST
  weddingDateFormatted: 'Tuesday, 16th February 2027',
  muhuratTime: 'Auspicious Saat Phere at 6:30 PM IST',
  venueName: 'The Leela Palace & Royal Heritage Lawns',
  venueCity: 'Udaipur, Rajasthan, India',
  venueAddress: 'Lake Pichola, Post Box No. 125, Udaipur, Rajasthan 313001',
  googleMapsUrl: 'https://maps.google.com/?q=The+Leela+Palace+Udaipur',
  weddingHashtag: '#SakshiWedsKevin',
  secondaryHashtag: '#SaVin2027',
  
  // Blessing quotes
  tagline: 'Two souls, one destiny — written in the stars, celebrated on earth.',
  elderBlessing: 'With the divine grace of Almighty and the warm blessings of our beloved elders, we joyfully invite you to witness the sacred union of our children.',
  
  // Families
  brideParents: 'Mr. & Mrs. Satra',
  groomParents: 'Mr. & Mrs. Kevin’s Family',
  
  // Emotional brother message
  brotherDedication: {
    badge: 'Crafted with Love by Sakshi’s Brother',
    title: 'A Brother’s Heartfelt Letter to His Sister & Kevin',
    message: `To my dearest sister Sakshi,\n\nFrom the days of silly arguments over the TV remote to watching you blossom into the most graceful, radiant woman I know—you’ve been the heart and soul of our home.\n\nSeeing you step into this beautiful chapter with Kevin fills my heart with boundless pride and joy. Kevin, you’re officially gaining the sweetest (and most bossy!) partner for life. Welcome to our family brother, take care of our princess!\n\nMay your life together be as magical, joyous, and radiant as the two of you are. I’ll always be standing right behind you both, cheering the loudest!\n\nWith all the love in the universe,\nYour Brother ❤️`
  }
};

export const WEDDING_EVENTS: WeddingEvent[] = [
  {
    id: 'haldi',
    name: 'Phoolon Ki Haldi',
    hindiName: 'हल्दी उत्सव',
    date: 'Sunday, 14th February 2027',
    time: '10:30 AM Onwards',
    venue: 'Lotus Courtyard & Poolside Garden',
    address: 'The Leela Palace, Udaipur',
    description: 'A vibrant morning drenched in golden turmeric, fragrant rose petals, dhol beats, laughter, and pure happiness.',
    dressCodeTitle: 'Sunshine Yellow & Floral Pastels',
    dressCodeColors: [
      { name: 'Marigold Yellow', hex: '#F59E0B' },
      { name: 'Pistachio Green', hex: '#84CC16' },
      { name: 'Blush Ivory', hex: '#FEF3C7' }
    ],
    dressSuggestion: 'Kurta Pyjama, Floral Lehengas, or breezy pastel Indo-westerns. Come ready to be covered in flowers & love!',
    iconName: 'Sun',
    themeColor: '#D97706',
    calendarTitle: 'Sakshi & Kevin - Phoolon Ki Haldi'
  },
  {
    id: 'mehendi',
    name: 'Mehendi & Sufi Soirée',
    hindiName: 'मेहंदी एवं संगीत उत्सव',
    date: 'Sunday, 14th February 2027',
    time: '4:30 PM Onwards',
    venue: 'Royal Haveli Verandah & Waterfront Terrace',
    address: 'The Leela Palace, Udaipur',
    description: 'Intricate henna designs adorning the bride, live folk bangle counters, high tea, chaat stations, and soul-stirring Sufi music.',
    dressCodeTitle: 'Emerald Green, Mint & Festive Florals',
    dressCodeColors: [
      { name: 'Emerald', hex: '#047857' },
      { name: 'Sage Mint', hex: '#6EE7B7' },
      { name: 'Rose Gold', hex: '#FDA4AF' }
    ],
    dressSuggestion: 'Contemporary Anarkalis, Shararas, Bandhgalas or stylish Nehru jackets.',
    iconName: 'Feather',
    themeColor: '#059669',
    calendarTitle: 'Sakshi & Kevin - Mehendi & Sufi Soirée'
  },
  {
    id: 'sangeet',
    name: 'The Grand Sangeet Gala',
    hindiName: 'संगीत संध्या',
    date: 'Monday, 15th February 2027',
    time: '7:30 PM Onwards',
    venue: 'Grand Mewar Ballroom',
    address: 'The Leela Palace, Udaipur',
    description: 'An electrifying evening of high-energy family dance performances, glowing lights, signature cocktails, and non-stop DJ celebration.',
    dressCodeTitle: 'Midnight Glam & Sparkling Metallics',
    dressCodeColors: [
      { name: 'Midnight Navy', hex: '#1E1B4B' },
      { name: 'Shimmering Gold', hex: '#EAB308' },
      { name: 'Champagne Silver', hex: '#E2E8F0' }
    ],
    dressSuggestion: 'Glamorous Gowns, Sequinned Lehengas, Sharp Tuxedos or Jodhpuris. Comfortable dancing shoes mandatory!',
    iconName: 'Music',
    themeColor: '#4338CA',
    calendarTitle: 'Sakshi & Kevin - The Grand Sangeet Gala'
  },
  {
    id: 'wedding',
    name: 'The Royal Wedding Ceremony',
    hindiName: 'विवाह संस्कार (सात फेरे)',
    date: 'Tuesday, 16th February 2027',
    time: 'Baraat: 4:30 PM | Saat Phere: 6:30 PM',
    venue: 'Lakefront Mandap & Amphitheatre Lawns',
    address: 'The Leela Palace, Udaipur',
    description: 'The auspicious moment where Sakshi & Kevin take their sacred vows around the holy fire under the starlit skies.',
    dressCodeTitle: 'Royal Traditional & Regal Heritage',
    dressCodeColors: [
      { name: 'Royal Crimson', hex: '#881337' },
      { name: 'Ivory Cream', hex: '#FDFBF7' },
      { name: 'Antique Gold', hex: '#D4AF37' }
    ],
    dressSuggestion: 'Traditional Silk Sarees, Royal Lehengas, Embroidered Sherwanis with Safas (Turbans).',
    iconName: 'Crown',
    themeColor: '#9F1239',
    calendarTitle: 'Sakshi & Kevin - The Royal Wedding'
  },
  {
    id: 'reception',
    name: 'The Grand Banquet & Reception',
    hindiName: 'प्रीतिभोज एवं स्वागत',
    date: 'Tuesday, 16th February 2027',
    time: '8:30 PM Onwards',
    venue: 'Royal Heritage Banquet Garden',
    address: 'The Leela Palace, Udaipur',
    description: 'A lavish gourmet culinary celebration, cake cutting, toasts, and dancing into the early morning hours with the newlyweds.',
    dressCodeTitle: 'Black Tie Elegance & Royal Silk',
    dressCodeColors: [
      { name: 'Deep Burgundy', hex: '#4C0519' },
      { name: 'Rose Gold', hex: '#FB7185' },
      { name: 'Tuxedo Black', hex: '#0F172A' }
    ],
    dressSuggestion: 'Formal evening wear, elegant drapes, classic suits & royal bandhgalas.',
    iconName: 'Sparkles',
    themeColor: '#BE123C',
    calendarTitle: 'Sakshi & Kevin - Wedding Reception'
  }
];

export const LOVE_STORY_CHAPTERS: LoveStoryChapter[] = [
  {
    id: '1',
    year: 'Chapter I',
    title: 'The First Spark',
    subtitle: 'Where Destiny Whispered',
    story: 'What started as a spontaneous conversation turned into hours of effortless laughter. In the middle of an ordinary day, Kevin and Sakshi found something completely extraordinary.',
    icon: 'Coffee',
    highlight: 'Over 4 cups of coffee and time standing still'
  },
  {
    id: '2',
    year: 'Chapter II',
    title: 'Two Worlds, One Harmony',
    subtitle: 'When Conversations Felt Like Home',
    story: 'Between long night calls, shared playlists, road trips, and realizing they shared the exact same sense of humor—friendship effortlessly blossomed into a deep, unshakable love.',
    icon: 'HeartHandshake',
    highlight: 'Countless shared memories & endless inside jokes'
  },
  {
    id: '3',
    year: 'Chapter III',
    title: 'The Magical Proposal',
    subtitle: 'A Ring, A Sunset & A Resounding YES!',
    story: 'Beneath a magical starlit terrace adorned with fairy lights and blooming white roses, Kevin got down on one knee. With happy tears glistening in her eyes, Sakshi said the easiest YES of her life.',
    icon: 'Sparkles',
    highlight: '“In you, I’ve found my forever home.”'
  },
  {
    id: '4',
    year: 'Chapter IV',
    title: 'The Roka & Two Families Becoming One',
    subtitle: 'Sealed with Sweet Blessings',
    story: 'With the gentle clinking of glasses, sweet mithai, proud parents embracing, and both families dancing together, the promise was blessed by everyone they love.',
    icon: 'Flame',
    highlight: 'Laughter, blessings & tears of pure happiness'
  },
  {
    id: '5',
    year: 'Chapter V',
    title: '16th February 2027',
    subtitle: 'Forever Begins Now',
    story: 'Surrounded by the majestic palaces of Udaipur and the people who mean the world to them, Sakshi & Kevin begin their sacred journey of seven lifetimes.',
    icon: 'Infinity',
    highlight: 'The adventure of a lifetime begins.'
  }
];

export const INITIAL_BLESSINGS: BlessingItem[] = [
  {
    id: 'b1',
    name: 'Dad & Mom (Satra Family)',
    relation: 'Bride’s Parents',
    message: 'To our darling daughter Sakshi and our wonderful son Kevin—may your life together be blessed with endless laughter, boundless peace, and unshakeable love. We love you both so much!',
    date: 'Forever & Always',
    likes: 48
  },
  {
    id: 'b2',
    name: 'Naman (Bride’s Brother)',
    relation: 'Brother',
    message: 'Watching you grow up has been my biggest joy, Sakshi! Kevin, you are the luckiest man alive to have my sister, and she is so lucky to have you. Can’t wait to set the dance floor on fire on 16th Feb 2027!',
    date: 'Just now',
    likes: 62
  },
  {
    id: 'b3',
    name: 'Grandmother & Grandfather',
    relation: 'Elders',
    message: 'Sada Suhagan Raho! May God bless both of you with health, prosperity, and companionship that deepens with every passing year. Our heartfelt aashirwad.',
    date: 'Blessings from Elders',
    likes: 39
  },
  {
    id: 'b4',
    name: 'Aunty & Uncle (Kevin’s Side)',
    relation: 'Groom’s Family',
    message: 'We are overjoyed to welcome Sakshi into our hearts and family! Wishing our sweetest couple a lifetime of magical moments.',
    date: 'With Love',
    likes: 35
  }
];

export const GALLERY_PHOTOS = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1000&q=80',
    title: 'Together in Bloom',
    caption: '“You are my today and all of my tomorrows.”'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80',
    title: 'The Palace Stroll',
    caption: 'Laughter that feels like home.'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=80',
    title: 'Golden Hour Promises',
    caption: 'Under the warm Rajasthan sunset, forever felt easy.'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=80',
    title: 'Two Souls, One Rhythm',
    caption: 'Counting down every heartbeat until 16th Feb 2027.'
  }
];
