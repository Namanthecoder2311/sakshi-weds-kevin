import React from 'react';
import { Sparkles } from 'lucide-react';
import { WEDDING_CONFIG } from '../data/weddingData';

export const AnnouncementCard: React.FC = () => {
  return (
    <section className="pt-24 pb-16 px-4 max-w-2xl mx-auto text-center relative">
      {/* Decorative Traditional Indian Mandap / Jharokha Arch Header */}
      <div className="relative rounded-3xl p-6 sm:p-10 border-2 border-[#D4AF37]/60 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F7EFE3] shadow-2xl overflow-hidden">
        
        {/* Top Auspicious Ganesha / Om Symbol or Golden Arch */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-14 h-14 rounded-full border border-[#D4AF37] bg-[#FEF3C7] flex items-center justify-center shadow-inner mb-3">
            <span className="text-2xl font-serif text-[#881337]">ॐ</span>
          </div>
          <div className="text-xs uppercase font-serif tracking-[0.3em] text-[#B45309] font-bold">
            || Shree Ganeshay Namah ||
          </div>
        </div>

        {/* Invitation Text */}
        <p className="font-['Cormorant_Garamond'] italic text-base sm:text-lg text-[#78716C] max-w-md mx-auto leading-relaxed mb-6">
          {WEDDING_CONFIG.elderBlessing}
        </p>

        {/* Wedding Of Heading */}
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-[11px] font-bold tracking-widest uppercase mb-4">
          <Sparkles className="w-3 h-3 text-[#D97706]" />
          Together with their families
          <Sparkles className="w-3 h-3 text-[#D97706]" />
        </div>

        {/* Couple Names */}
        <div className="my-6">
          <h1 className="font-['Cinzel_Decorative'] text-4xl sm:text-5xl font-extrabold text-[#5E0B1B] tracking-wide mb-1">
            {WEDDING_CONFIG.brideName}
          </h1>
          <div className="text-xs uppercase tracking-widest text-[#B45309] font-semibold mb-3">
            Daughter of {WEDDING_CONFIG.brideParents}
          </div>

          <div className="flex items-center justify-center gap-4 my-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="font-['Great_Vibes'] text-3xl sm:text-4xl text-[#B45309]">
              weds
            </span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <h1 className="font-['Cinzel_Decorative'] text-4xl sm:text-5xl font-extrabold text-[#5E0B1B] tracking-wide mt-1 mb-1">
            {WEDDING_CONFIG.groomName}
          </h1>
          <div className="text-xs uppercase tracking-widest text-[#B45309] font-semibold">
            Son of {WEDDING_CONFIG.groomParents}
          </div>
        </div>

        {/* Auspicious Date & Venue summary */}
        <div className="mt-8 pt-6 border-t border-[#D4AF37]/30 flex flex-col sm:flex-row items-center justify-around gap-4 text-[#78350F]">
          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-[#B45309]">
              The Auspicious Date
            </div>
            <div className="text-lg font-serif font-bold text-[#881337]">
              16th February 2027
            </div>
          </div>

          <div className="hidden sm:block w-px h-8 bg-[#D4AF37]/40" />

          <div>
            <div className="text-[11px] uppercase tracking-widest font-bold text-[#B45309]">
              The Royal City
            </div>
            <div className="text-lg font-serif font-bold text-[#881337]">
              Udaipur, Rajasthan
            </div>
          </div>
        </div>

        {/* Poetic Tagline */}
        <div className="mt-6 text-xs italic font-['Cormorant_Garamond'] text-[#A8A29E]">
          {WEDDING_CONFIG.tagline}
        </div>
      </div>
    </section>
  );
};
