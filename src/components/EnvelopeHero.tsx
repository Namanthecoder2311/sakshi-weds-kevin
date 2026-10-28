import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart } from 'lucide-react';
import { WEDDING_CONFIG } from '../data/weddingData';
import { royalAudio } from '../utils/audioPlayer';

interface EnvelopeHeroProps {
  isOpen: boolean;
  onOpen: () => void;
}

export const EnvelopeHero: React.FC<EnvelopeHeroProps> = ({ isOpen, onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);

    // Play fanfare
    royalAudio.playWaxSealFanfare();
    royalAudio.startAmbientMusic();

    // Burst floral confetti
    confetti({
      particleCount: 75,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D4AF37', '#BE123C', '#F59E0B', '#FFF1F2']
    });

    setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, 1100);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#1A0B10]/90 backdrop-blur-md transition-all duration-1000 p-4 ${
        isOpen ? 'opacity-0 pointer-events-none scale-105' : 'opacity-100'
      }`}
    >
      {/* Royal Digital Envelope Card */}
      <div className="relative w-full max-w-md aspect-[4/5] sm:aspect-[3/4] max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4AF37] bg-gradient-to-br from-[#4A0817] via-[#5E0B1B] to-[#36040F] flex flex-col items-center justify-between p-6 sm:p-8 text-center text-white select-none">
        
        {/* Background ornate filigree watermark */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <div className="w-80 h-80 rounded-full border-8 border-[#D4AF37] rotate-45 flex items-center justify-center">
            <div className="w-64 h-64 border-4 border-dashed border-[#D4AF37]" />
          </div>
        </div>

        {/* Top Header */}
        <div className="relative z-10 pt-2">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-[#FDE68A] font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            Royal Wedding Invitation
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          </div>
          <h1 className="font-['Cinzel_Decorative'] text-2xl sm:text-3xl font-bold tracking-wider text-[#FBF5E5] drop-shadow-md">
            Sakshi & Kevin
          </h1>
          <p className="font-['Cormorant_Garamond'] italic text-sm text-[#FBCFE8] mt-1">
            {WEDDING_CONFIG.weddingDateFormatted}
          </p>
        </div>

        {/* Center: 3D Wax Seal with Ribbon */}
        <div className="relative z-10 my-auto flex flex-col items-center">
          {/* Vertical Golden Ribbon */}
          <div className="absolute -top-32 bottom-[-130px] w-8 bg-gradient-to-r from-[#AA7C11] via-[#F3E5AB] to-[#AA7C11] shadow-lg opacity-85 z-0" />

          {/* Golden Wax Seal Button */}
          <button
            type="button"
            onClick={handleOpenClick}
            disabled={isOpening}
            className={`relative z-10 w-28 h-28 sm:w-32 sm:h-32 rounded-full cursor-pointer transition-transform duration-500 transform active:scale-95 group ${
              isOpening ? 'scale-125 rotate-45 opacity-0' : 'hover:scale-110'
            }`}
          >
            {/* Glowing Aura Ring */}
            <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F59E0B] opacity-75 blur-md group-hover:opacity-100 transition-opacity animate-pulse" />

            {/* Seal Body */}
            <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#E6C687] via-[#D4AF37] to-[#8B6508] p-1 shadow-2xl border-4 border-[#FFF3A8] flex flex-col items-center justify-center">
              {/* Inner ring */}
              <div className="w-full h-full rounded-full border-2 border-dashed border-[#5A3805]/40 flex flex-col items-center justify-center p-2 bg-gradient-to-br from-[#D4AF37] to-[#AA7C11]">
                <span className="font-['Cinzel_Decorative'] font-extrabold text-2xl sm:text-3xl text-[#3E2503] drop-shadow-xs tracking-wider">
                  S<span className="text-[#881337] text-xl">❤</span>K
                </span>
                <span className="text-[9px] uppercase font-bold tracking-widest text-[#451A03] mt-0.5">
                  16 • 02 • 27
                </span>
              </div>
            </div>
          </button>

          {/* Pulse text prompt */}
          <div className="relative z-10 mt-6 flex items-center gap-2 px-5 py-2 rounded-full bg-black/40 border border-[#D4AF37]/50 backdrop-blur-xs text-[#FDE68A] text-xs font-medium tracking-widest uppercase animate-bounce">
            <Heart className="w-3 h-3 text-[#FDA4AF] fill-[#FDA4AF]" />
            <span>Tap Seal to Open</span>
            <Heart className="w-3 h-3 text-[#FDA4AF] fill-[#FDA4AF]" />
          </div>
        </div>

        {/* Bottom Destination Tag */}
        <div className="relative z-10 pb-2">
          <div className="text-[11px] font-['Cormorant_Garamond'] text-[#E5E5E5] tracking-widest uppercase">
            The Leela Palace • Udaipur, India
          </div>
          <div className="text-[10px] text-[#FBCFE8]/70 italic mt-0.5">
            #SakshiWedsKevin
          </div>
        </div>
      </div>
    </div>
  );
};
