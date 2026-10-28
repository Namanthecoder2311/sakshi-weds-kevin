import React, { useState } from 'react';
import { Heart, X, Sparkles, Feather } from 'lucide-react';
import { WEDDING_CONFIG } from '../data/weddingData';
import { royalAudio } from '../utils/audioPlayer';

export const BrotherNoteModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    royalAudio.playRoyalChime(523.25, 1.5);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Floating or Embedded Trigger Ribbon */}
      <div className="py-6 px-4 text-center">
        <button
          type="button"
          onClick={handleOpen}
          className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-gradient-to-r from-[#881337] via-[#9F1239] to-[#881337] text-white shadow-xl hover:shadow-2xl border border-[#FDA4AF]/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-[#FDE68A] animate-spin" style={{ animationDuration: '4s' }} />
          <span className="font-serif tracking-wide text-xs sm:text-sm font-semibold text-[#FFF1F2]">
            {WEDDING_CONFIG.brotherDedication.badge}
          </span>
          <Heart className="w-4 h-4 text-[#FDA4AF] fill-[#FDA4AF] group-hover:scale-125 transition-transform" />
        </button>
      </div>

      {/* Royal Letter Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-[#FCF9F2] rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-[#D4AF37] max-h-[90vh] overflow-y-auto custom-scrollbar">
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-[#F5ECE1] hover:bg-[#EAE0D0] text-[#78350F] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Letter Header */}
            <div className="text-center pb-4 border-b border-[#D4AF37]/30">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FEF3C7] border border-[#D4AF37] flex items-center justify-center mb-2 shadow-xs">
                <Feather className="w-6 h-6 text-[#B45309]" />
              </div>
              <span className="text-[11px] uppercase tracking-widest text-[#B45309] font-bold">
                From Brother With Love
              </span>
              <h3 className="text-2xl font-serif font-bold text-[#881337] mt-1">
                A Letter to Sakshi & Kevin
              </h3>
            </div>

            {/* Parchment Body */}
            <div className="py-6 font-['Cormorant_Garamond'] text-lg sm:text-xl text-[#44403C] leading-relaxed space-y-4">
              <p className="font-semibold text-[#881337]">
                To my dearest sister Sakshi,
              </p>
              <p>
                From the days of fighting over the TV remote and sharing secret snacks to watching you grow into the most radiant, graceful, and loving woman—you have always been the heart and joy of our home.
              </p>
              <p>
                Seeing you embark on this breathtaking journey with Kevin fills my heart with boundless pride and happiness. Kevin, you’re not just gaining an incredible life partner, you are officially gaining the brightest sparkle in the world. Welcome to our family brother, take care of our princess!
              </p>
              <p>
                May your life together be as magical, grand, and full of laughter as the two of you are. I’ll always be right here cheering for you both at every step.
              </p>
              <p className="text-right font-serif italic text-[#881337] pt-2">
                Forever your brother & biggest supporter,<br />
                <span className="text-xl font-bold not-italic font-['Great_Vibes'] text-2xl text-[#B45309]">Naman</span> ❤️
              </p>
            </div>

            {/* Wax Seal Stamp in Letter */}
            <div className="pt-4 border-t border-[#D4AF37]/30 flex items-center justify-between text-xs text-[#78716C]">
              <span>#SakshiWedsKevin • 2027</span>
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2 rounded-full bg-[#881337] hover:bg-[#9F1239] text-white font-serif text-xs font-semibold tracking-wide transition-colors"
              >
                Close with Blessings 🕊️
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
