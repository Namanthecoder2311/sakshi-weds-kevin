import { Heart, RotateCcw } from 'lucide-react';
import { WEDDING_CONFIG } from '../data/weddingData';

interface WeddingFooterProps {
  onReopenEnvelope: () => void;
}

export const WeddingFooter: React.FC<WeddingFooterProps> = ({ onReopenEnvelope }) => {
  return (
    <footer className="relative bg-gradient-to-b from-[#2E050E] via-[#3D0713] to-[#1F0208] text-[#FDFBF7] py-16 px-4 text-center border-t-4 border-[#D4AF37] mt-12 overflow-hidden">
      {/* Background radial gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        {/* Monogram Seal */}
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8B6508] p-0.5 shadow-xl">
          <div className="w-full h-full rounded-full bg-[#5E0B1B] border border-[#FFF3A8]/40 flex items-center justify-center font-['Cinzel_Decorative'] font-black text-xl text-[#FDFBF7]">
            S<span className="text-[#FDA4AF] text-sm">❤</span>K
          </div>
        </div>

        {/* Thank you note */}
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-[#FDE68A] font-bold block mb-2">
            From the Bottom of Our Hearts
          </span>
          <h2 className="font-['Cinzel_Decorative'] text-3xl sm:text-4xl font-bold text-[#FCF9F2]">
            Thank You
          </h2>
          <p className="font-['Cormorant_Garamond'] italic text-lg sm:text-xl text-[#FBCFE8] max-w-md mx-auto mt-2 leading-relaxed">
            “Your love, blessings & joyous presence will make our wedding day truly unforgettable. We cannot wait to celebrate with you!”
          </p>
        </div>

        {/* Names */}
        <div className="font-['Great_Vibes'] text-4xl sm:text-5xl text-[#FDE68A] py-1">
          Sakshi & Kevin
        </div>

        {/* Date & Location */}
        <div className="text-xs tracking-widest uppercase text-[#FDFBF7]/80 font-medium">
          16th February 2027 • The Leela Palace, Udaipur
        </div>

        {/* Hashtags */}
        <div className="flex items-center justify-center gap-3 text-xs text-[#FDA4AF] font-semibold tracking-wider">
          <span>{WEDDING_CONFIG.weddingHashtag}</span>
          <span>•</span>
          <span>{WEDDING_CONFIG.secondaryHashtag}</span>
        </div>

        {/* Replay Wax Seal button */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onReopenEnvelope}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#D4AF37]/50 text-xs font-semibold tracking-wider uppercase text-[#FDE68A] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Re-open Digital Envelope
          </button>
        </div>

        {/* Brother Dedication watermark */}
        <div className="pt-8 border-t border-white/10 text-[11px] text-[#A8A29E] flex items-center justify-center gap-1.5">
          <span>Crafted with boundless love by Sakshi’s brother for her wedding</span>
          <Heart className="w-3.5 h-3.5 text-[#E11D48] fill-[#E11D48]" />
        </div>
      </div>
    </footer>
  );
};
