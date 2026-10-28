import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX, Sparkles, Share2 } from 'lucide-react';
import { royalAudio } from '../utils/audioPlayer';

export const NavbarAndControls: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 150);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleAudio = () => {
    royalAudio.toggleAmbientMusic((state) => {
      setIsPlaying(state);
    });
  };

  const handleShowerLove = () => {
    royalAudio.playRoyalChime(880, 1.2);
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.8 },
      colors: ['#D4AF37', '#BE123C', '#F59E0B', '#FFF1F2']
    });
  };

  const handleShare = () => {
    const text = `🌸 You're cordially invited to celebrate Sakshi weds Kevin on 16th February 2027! Tap to view the royal digital invitation: ${window.location.href}`;
    if (navigator.share) {
      navigator.share({
        title: "Sakshi & Kevin's Wedding Invitation",
        text,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <>
      {/* Sticky Top Navigation */}
      <header
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FCF9F2]/90 backdrop-blur-md shadow-sm border-b border-[#D4AF37]/30 py-2.5'
            : 'bg-transparent py-4'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-between">
          {/* Logo / Monogram */}
          <a
            href="#"
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6508] p-0.5 shadow-sm group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#5E0B1B] flex items-center justify-center text-white font-['Cinzel_Decorative'] font-bold text-xs tracking-wider">
                S<span className="text-[#FDA4AF] text-[10px]">❤</span>K
              </div>
            </div>
            <div className="text-left">
              <span className="font-serif font-bold text-sm text-[#5E0B1B] block leading-tight">
                Sakshi & Kevin
              </span>
              <span className="text-[10px] text-[#B45309] font-semibold tracking-widest block uppercase">
                16 Feb 2027
              </span>
            </div>
          </a>

          {/* Quick Nav Anchor Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase font-semibold tracking-wider text-[#78350F]">
            <a href="#save-the-date" className="hover:text-[#881337] transition-colors">
              Save The Date
            </a>
            <a href="#our-story" className="hover:text-[#881337] transition-colors">
              Our Story
            </a>
            <a href="#events" className="hover:text-[#881337] transition-colors">
              Festivities
            </a>
            <a href="#dress-code" className="hover:text-[#881337] transition-colors">
              Lookbook
            </a>
            <a href="#venue" className="hover:text-[#881337] transition-colors">
              Venue
            </a>
            <a href="#rsvp" className="hover:text-[#881337] transition-colors">
              RSVP
            </a>
          </nav>

          {/* Top Right Actions */}
          <div className="flex items-center gap-2">
            {/* Music Toggle */}
            <button
              type="button"
              onClick={handleToggleAudio}
              className={`p-2 rounded-full border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isPlaying
                  ? 'bg-[#FEF3C7] border-[#D4AF37] text-[#881337]'
                  : 'bg-white border-gray-200 text-gray-500 hover:text-black'
              }`}
              title={isPlaying ? 'Mute Music' : 'Play Music'}
            >
              {isPlaying ? (
                <>
                  <Volume2 className="w-4 h-4 text-[#B45309] animate-pulse" />
                  <span className="hidden sm:inline text-[11px] text-[#78350F]">Music On</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span className="hidden sm:inline text-[11px]">Music Off</span>
                </>
              )}
            </button>

            {/* Share Button */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full bg-white border border-[#D4AF37]/50 hover:bg-[#FEF3C7] text-[#78350F] transition-colors cursor-pointer"
              title="Share Invitation"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {copied && (
          <div className="text-center bg-[#881337] text-white text-xs py-1 transition-all">
            Link copied! Share with family & friends ✨
          </div>
        )}
      </header>

      {/* Floating Bottom Celebration Button */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2">
        <button
          type="button"
          onClick={handleShowerLove}
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-[#D4AF37] via-[#F59E0B] to-[#D4AF37] text-[#451A03] font-bold text-xs uppercase tracking-wider shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-[#FFFBEB]"
        >
          <Sparkles className="w-4 h-4 text-[#881337] group-hover:rotate-45 transition-transform" />
          <span>Shower Petals 🌸</span>
        </button>
      </div>
    </>
  );
};
