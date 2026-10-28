import React, { useState } from 'react';
import { Sparkles, Shirt, UserCheck } from 'lucide-react';
import { WEDDING_EVENTS } from '../data/weddingData';

export const WardrobePlanner: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string>(WEDDING_EVENTS[0].id);
  const [gender, setGender] = useState<'women' | 'men'>('women');

  const selectedEvent = WEDDING_EVENTS.find((e) => e.id === selectedEventId) || WEDDING_EVENTS[0];

  const wardrobeTips: Record<string, { women: string; men: string; note: string }> = {
    haldi: {
      women: 'Floral yellow lehengas, lightweight chiffon sarees, or breezy palazzo sets with floral gota patti jewelry.',
      men: 'Sunshine yellow cotton or silk kurtas paired with white dhotis or churidars.',
      note: 'Yellow & white shades are perfect! Keep footwear comfortable for the flower showers.'
    },
    mehendi: {
      women: 'Emerald, sage mint or blush sharara suits, cape lehengas, and easy-to-roll-up sleeves for henna application.',
      men: 'Pastel mint or bottle-green printed kurtas with stylish embroidered Nehru jackets.',
      note: 'Bangle bar & henna artists will be available. Sleeves that fold up easily are advised!'
    },
    sangeet: {
      women: 'Dazzling sequin lehengas, cocktail gowns in midnight navy or metallic gold with statement jewelry.',
      men: 'Royal blue, black or charcoal bandhgalas, sleek tuxedos or Indo-western jackets with pocket squares.',
      note: 'Bring your dance shoes! The dance floor will be rocking until sunrise.'
    },
    wedding: {
      women: 'Regal Banarasi / Kanjeevaram silk sarees, ornate heirloom lehengas in royal hues with traditional temple jewelry.',
      men: 'Classic ivory, cream or regal maroon embroidered sherwanis with royal safas (turbans provided at venue).',
      note: 'Royal traditional formal attire. (Kindly leave deep bridal crimson red for the bride!).'
    },
    reception: {
      women: 'Sophisticated modern gowns, contemporary drape sarees, or cocktail evening wear.',
      men: 'Sharp black tie suits, tailored tuxedos, or luxury silk bandhgala suits.',
      note: 'Glamorous evening celebration with toasts and gourmet banquet dinner.'
    }
  };

  const currentTips = wardrobeTips[selectedEvent.id] || wardrobeTips.wedding;

  return (
    <section id="dress-code" className="py-16 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          Style Guide & Color Palette
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-[#5E0B1B] font-bold">
          Wardrobe Planner
        </h2>
        <p className="font-['Cormorant_Garamond'] italic text-lg text-[#78716C] mt-1 max-w-md mx-auto">
          “A touch of inspiration to help you look your most radiant at every celebration.”
        </p>
      </div>

      {/* Event Selector Pill Tabs */}
      <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-6 custom-scrollbar">
        {WEDDING_EVENTS.map((event) => (
          <button
            key={event.id}
            type="button"
            onClick={() => setSelectedEventId(event.id)}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              selectedEventId === event.id
                ? 'bg-[#881337] text-white shadow-md scale-105'
                : 'bg-white border border-[#D4AF37]/40 text-[#78350F] hover:bg-[#FEF3C7]'
            }`}
          >
            {event.name}
          </button>
        ))}
      </div>

      {/* Main Lookbook Box */}
      <div className="bg-gradient-to-br from-white via-[#FAF6ED] to-[#F7EFE3] rounded-3xl p-6 sm:p-8 border border-[#D4AF37]/50 shadow-xl max-w-2xl mx-auto">
        {/* Gender Toggle */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setGender('women')}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              gender === 'women'
                ? 'bg-[#BE123C] text-white shadow-sm'
                : 'bg-white/80 border border-[#FDA4AF] text-[#881337]'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            For The Ladies
          </button>

          <button
            type="button"
            onClick={() => setGender('men')}
            className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
              gender === 'men'
                ? 'bg-[#BE123C] text-white shadow-sm'
                : 'bg-white/80 border border-[#FDA4AF] text-[#881337]'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" />
            For The Gentlemen
          </button>
        </div>

        {/* Selected Event Wardrobe Highlight */}
        <div className="text-center mb-6">
          <span className="text-[11px] uppercase tracking-widest text-[#B45309] font-bold">
            {selectedEvent.name} Palette
          </span>
          <h3 className="text-2xl font-serif font-bold text-[#5E0B1B] mt-1">
            {selectedEvent.dressCodeTitle}
          </h3>

          {/* Color Swatch Circles */}
          <div className="flex items-center justify-center gap-4 mt-4">
            {selectedEvent.dressCodeColors.map((c) => (
              <div key={c.name} className="flex flex-col items-center">
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow-md hover:scale-110 transition-transform"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="text-[11px] font-medium text-[#44403C] mt-1.5">
                  {c.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Attire Description */}
        <div className="bg-white/90 p-5 rounded-2xl border border-[#D4AF37]/30 shadow-xs mb-4">
          <div className="text-xs uppercase tracking-wider font-bold text-[#881337] mb-1">
            Recommended Attire ({gender === 'women' ? 'Women' : 'Men'})
          </div>
          <p className="font-['Cormorant_Garamond'] text-base sm:text-lg text-[#292524] leading-relaxed">
            {gender === 'women' ? currentTips.women : currentTips.men}
          </p>
        </div>

        {/* Stylist Note */}
        <div className="text-xs text-[#78716C] italic font-['Cormorant_Garamond'] text-center">
          💡 Note: {currentTips.note}
        </div>
      </div>
    </section>
  );
};
