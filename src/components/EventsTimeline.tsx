import React from 'react';
import { Calendar, Clock, MapPin, Sparkles, Sun, Feather, Music, Crown } from 'lucide-react';
import { WEDDING_EVENTS } from '../data/weddingData';
import type { WeddingEvent } from '../types/wedding';

export const EventsTimeline: React.FC = () => {
  const getEventIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sun':
        return <Sun className="w-6 h-6 text-[#D97706]" />;
      case 'Feather':
        return <Feather className="w-6 h-6 text-[#059669]" />;
      case 'Music':
        return <Music className="w-6 h-6 text-[#4338CA]" />;
      case 'Crown':
        return <Crown className="w-6 h-6 text-[#9F1239]" />;
      default:
        return <Sparkles className="w-6 h-6 text-[#BE123C]" />;
    }
  };

  const getCalendarLink = (event: WeddingEvent) => {
    const title = encodeURIComponent(event.calendarTitle);
    const details = encodeURIComponent(`${event.description} Dress code: ${event.dressCodeTitle}.`);
    const location = encodeURIComponent(`${event.venue}, ${event.address}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
  };

  return (
    <section id="events" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold uppercase tracking-wider mb-2">
          <Calendar className="w-3.5 h-3.5 text-[#D97706]" />
          Celebration Schedule
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-[#5E0B1B] font-bold">
          The Wedding Festivities
        </h2>
        <p className="font-['Cormorant_Garamond'] italic text-lg text-[#78716C] mt-1 max-w-lg mx-auto">
          “Four days of laughter, music, sacred mantras, and eternal memories.”
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {WEDDING_EVENTS.map((event) => (
          <div
            key={event.id}
            className="group relative rounded-3xl p-6 sm:p-7 border border-[#D4AF37]/50 bg-gradient-to-b from-white via-[#FCF9F2] to-[#F5ECE1] shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
          >
            {/* Top Bar with Icon and Hindi Title */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#D4AF37]/40 shadow-xs flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getEventIcon(event.iconName)}
                </div>
                {event.hindiName && (
                  <span className="text-sm font-serif font-bold text-[#881337] bg-[#FEF3C7] px-3 py-1 rounded-full">
                    {event.hindiName}
                  </span>
                )}
              </div>

              {/* Event Name */}
              <h3 className="text-2xl font-serif font-bold text-[#5E0B1B] mb-2">
                {event.name}
              </h3>

              {/* Date & Time */}
              <div className="space-y-1.5 text-xs sm:text-sm text-[#78350F] mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D97706]" />
                  <span className="font-semibold">{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D97706]" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D97706]" />
                  <span>{event.venue}</span>
                </div>
              </div>

              {/* Description */}
              <p className="font-['Cormorant_Garamond'] text-base text-[#44403C] leading-relaxed mb-5">
                {event.description}
              </p>
            </div>

            {/* Dress Code & Calendar Footer */}
            <div className="pt-4 border-t border-[#D4AF37]/30">
              <div className="text-[11px] uppercase tracking-wider font-bold text-[#92400E] mb-1.5 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#D97706]" />
                Dress Code: {event.dressCodeTitle}
              </div>

              {/* Color Swatch Dots */}
              <div className="flex items-center gap-2 mb-3">
                {event.dressCodeColors.map((color) => (
                  <div key={color.name} className="flex items-center gap-1">
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                    <span className="text-[10px] text-[#78716C]">{color.name}</span>
                  </div>
                ))}
              </div>

              {/* Add to Calendar Button */}
              <a
                href={getCalendarLink(event)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl border border-[#D4AF37] hover:bg-[#881337] hover:text-white text-[#78350F] text-xs font-semibold tracking-wide transition-all shadow-xs"
              >
                <Calendar className="w-3.5 h-3.5" />
                Add to My Schedule
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
