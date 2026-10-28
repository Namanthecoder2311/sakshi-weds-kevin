export interface WeddingEvent {
  id: string;
  name: string;
  hindiName?: string;
  date: string;
  time: string;
  venue: string;
  address: string;
  description: string;
  dressCodeTitle: string;
  dressCodeColors: { name: string; hex: string }[];
  dressSuggestion: string;
  iconName: string;
  themeColor: string;
  calendarTitle: string;
}

export interface LoveStoryChapter {
  id: string;
  year: string;
  title: string;
  subtitle: string;
  story: string;
  icon: string;
  highlight: string;
}

export interface BlessingItem {
  id: string;
  name: string;
  relation: string;
  message: string;
  date: string;
  likes: number;
}

export interface GuestRSVP {
  fullName: string;
  phone: string;
  attending: 'yes' | 'no';
  guestCount: number;
  dietary: 'all' | 'veg' | 'jain';
  songRequest: string;
  blessingMessage: string;
}
