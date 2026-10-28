import React, { useState, useEffect } from 'react';
import { Clock, Heart } from 'lucide-react';
import { WEDDING_CONFIG } from '../data/weddingData';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer: React.FC = () => {
  const calculateTimeLeft = (): TimeLeft => {
    const weddingDate = new Date(WEDDING_CONFIG.weddingDateISO).getTime();
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60)
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds }
  ];

  return (
    <section className="py-14 px-4 relative max-w-xl mx-auto text-center">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold uppercase tracking-wider mb-2">
          <Clock className="w-3.5 h-3.5 text-[#D97706]" />
          Every Heartbeat Matters
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-[#5E0B1B] font-bold">
          Until Forever Begins
        </h2>
        <p className="font-['Cormorant_Garamond'] italic text-lg text-[#78716C] mt-1 flex items-center justify-center gap-2">
          <span>Counting down every sacred moment to</span>
          <span className="font-bold text-[#881337]">16th Feb 2027</span>
        </p>
      </div>

      {/* Ticking Digit Cards */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
        {timeBlocks.map((block) => (
          <div
            key={block.label}
            className="group relative bg-gradient-to-b from-white via-[#FCF9F2] to-[#F5ECE1] rounded-2xl p-3 sm:p-4 shadow-lg border border-[#D4AF37]/50 flex flex-col items-center justify-center transition-transform hover:-translate-y-1"
          >
            {/* Top gold line accent */}
            <div className="absolute top-0 inset-x-4 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent rounded-t-full" />
            
            <div className="text-2xl sm:text-4xl font-serif font-black text-[#881337] tracking-tight group-hover:scale-105 transition-transform duration-200">
              {String(block.value).padStart(2, '0')}
            </div>

            <div className="text-[10px] sm:text-xs uppercase font-semibold text-[#B45309] tracking-widest mt-1">
              {block.label}
            </div>

            {/* Subtle glow dot */}
            <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]/60 mt-1.5" />
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-[#A8A29E] font-medium tracking-wide">
        <Heart className="w-3.5 h-3.5 text-[#E11D48] fill-[#E11D48] animate-pulse" />
        <span>Sakshi & Kevin • The Royal Vows • Udaipur</span>
      </div>
    </section>
  );
};
