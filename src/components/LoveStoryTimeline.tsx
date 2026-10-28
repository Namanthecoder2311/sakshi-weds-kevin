import React, { useState } from 'react';
import { Heart, Sparkles, Coffee, HeartHandshake, Flame, Infinity } from 'lucide-react';
import { LOVE_STORY_CHAPTERS } from '../data/weddingData';
import { royalAudio } from '../utils/audioPlayer';

export const LoveStoryTimeline: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<string>(LOVE_STORY_CHAPTERS[0].id);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Coffee':
        return <Coffee className="w-5 h-5 text-[#B45309]" />;
      case 'HeartHandshake':
        return <HeartHandshake className="w-5 h-5 text-[#B45309]" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-[#B45309]" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-[#B45309]" />;
      default:
        return <Infinity className="w-5 h-5 text-[#B45309]" />;
    }
  };

  return (
    <section id="our-story" className="py-16 px-4 max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold uppercase tracking-wider mb-2">
          <Heart className="w-3.5 h-3.5 text-[#E11D48] fill-[#E11D48]" />
          Our Journey
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-[#5E0B1B] font-bold">
          Our Love Story
        </h2>
        <p className="font-['Cormorant_Garamond'] italic text-lg text-[#78716C] mt-1 max-w-md mx-auto">
          “From a fleeting conversation to an eternal promise — every chapter brought us here.”
        </p>
      </div>

      {/* Interactive Milestone Cards */}
      <div className="relative border-l-2 border-[#D4AF37]/40 ml-4 sm:ml-8 space-y-8 pb-4">
        {LOVE_STORY_CHAPTERS.map((chapter) => {
          const isSelected = activeChapter === chapter.id;

          return (
            <div
              key={chapter.id}
              onClick={() => {
                setActiveChapter(chapter.id);
                royalAudio.playRoyalChime(550, 0.6);
              }}
              className="relative pl-8 sm:pl-10 cursor-pointer group"
            >
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-[19px] top-1.5 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? 'bg-[#881337] border-[#D4AF37] scale-110 shadow-lg text-white'
                    : 'bg-[#FCF9F2] border-[#D4AF37]/60 group-hover:border-[#881337] shadow-xs'
                }`}
              >
                {getIcon(chapter.icon)}
              </div>

              {/* Card Content */}
              <div
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-br from-white to-[#FAF6ED] border-[#D4AF37] shadow-xl scale-[1.01]'
                    : 'bg-white/80 border-[#E7E5E4] hover:border-[#D4AF37]/50 shadow-xs'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                  <span className="text-[11px] uppercase tracking-widest font-bold text-[#B45309]">
                    {chapter.year}
                  </span>
                  <span className="text-xs italic font-['Cormorant_Garamond'] text-[#9F1239]">
                    {chapter.subtitle}
                  </span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#5E0B1B] mb-2">
                  {chapter.title}
                </h3>

                <p className="font-['Cormorant_Garamond'] text-base sm:text-lg text-[#44403C] leading-relaxed">
                  {chapter.story}
                </p>

                {/* Highlight Badge */}
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#B45309] font-medium bg-[#FEF3C7]/60 px-3 py-1 rounded-full border border-[#FDE68A]">
                  <Sparkles className="w-3 h-3 text-[#D97706]" />
                  <span>{chapter.highlight}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
