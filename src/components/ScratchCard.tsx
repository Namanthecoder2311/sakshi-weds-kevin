import React, { useRef, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Sparkles, RefreshCw, CheckCircle2 } from 'lucide-react';
import { WEDDING_CONFIG } from '../data/weddingData';
import { royalAudio } from '../utils/audioPlayer';

export const ScratchCard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const isDrawing = useRef(false);

  // Initialize the scratch gold canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // Rich metallic gold gradient
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#B8860B');
    grad.addColorStop(0.2, '#E6C687');
    grad.addColorStop(0.4, '#D4AF37');
    grad.addColorStop(0.7, '#FFF3A8');
    grad.addColorStop(0.85, '#AA7C11');
    grad.addColorStop(1, '#D4AF37');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Decorative sparkling gold dust texture
    for (let i = 0; i < 700; i++) {
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.7)' : 'rgba(170,124,17,0.4)';
      ctx.beginPath();
      ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Border pattern
    ctx.strokeStyle = '#8B6508';
    ctx.lineWidth = 4;
    ctx.strokeRect(6, 6, width - 12, height - 12);
    ctx.strokeStyle = '#FFF8DC';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Scratch instruction text
    ctx.fillStyle = '#5A3805';
    ctx.font = 'bold 15px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH GOLD TO REVEAL ✨', width / 2, height / 2 - 12);

    ctx.fillStyle = '#7C4F07';
    ctx.font = 'italic 12px "Cormorant Garamond", serif';
    ctx.fillText('Use finger or mouse to unlock our date', width / 2, height / 2 + 14);

    setIsRevealed(false);
    setScratchProgress(0);
  }, []);

  useEffect(() => {
    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [initCanvas]);

  const calculateScratchPercentage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    let transparentCount = 0;
    const totalPixels = pixels.length / 4;

    for (let i = 3; i < pixels.length; i += 16) {
      if (pixels[i] === 0) {
        transparentCount++;
      }
    }

    const percent = Math.round((transparentCount / (totalPixels / 4)) * 100);
    setScratchProgress(percent);

    if (percent > 45 && !isRevealed) {
      triggerReveal();
    }
  };

  const triggerReveal = () => {
    setIsRevealed(true);
    setScratchProgress(100);
    royalAudio.playRoyalChime(659.25, 1.8);
    royalAudio.playRoyalChime(880, 2.2);

    // Explode hearts and golden confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4AF37', '#E11D48', '#FFD700', '#FDA4AF']
    });
  };

  const handleScratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    calculateScratchPercentage();
  };

  // Google Calendar Link generator
  const getGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Sakshi & Kevin's Royal Wedding");
    const details = encodeURIComponent(
      "A celebration of love, laughter, and forever! Join us as Sakshi & Kevin tie the knot at The Leela Palace, Udaipur."
    );
    const location = encodeURIComponent(WEDDING_CONFIG.venueAddress);
    const start = "20270216T110000Z";
    const end = "20270216T220000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  // iCal download
  const downloadIcs = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sakshi Weds Kevin//Royal Wedding//EN
BEGIN:VEVENT
UID:sakshi-kevin-wedding-2027@wedding.com
DTSTAMP:20261028T180000Z
DTSTART:20270216T123000Z
DTEND:20270216T210000Z
SUMMARY:Sakshi & Kevin's Royal Wedding
DESCRIPTION:Sacred Saat Phere and Wedding Celebration of Sakshi & Kevin.
LOCATION:${WEDDING_CONFIG.venueAddress}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', 'Sakshi-Kevin-Wedding-16Feb2027.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="save-the-date" className="py-16 px-4 relative max-w-xl mx-auto">
      {/* Decorative Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-semibold tracking-wider uppercase mb-3 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#D97706]" />
          Interactive Experience
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-[#5E0B1B] font-bold tracking-tight">
          Save The Date
        </h2>
        <p className="font-['Cormorant_Garamond'] italic text-lg text-[#78716C] mt-1">
          Two souls, one heart — scratched in fate, sealed with love.
        </p>
      </div>

      {/* Card Wrapper */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D4AF37]/50 bg-gradient-to-b from-[#FFFDF9] via-[#FAF6ED] to-[#F5ECE1] p-6 md:p-8 text-center"
      >
        {/* Decorative corner flourishes */}
        <div className="absolute top-2 left-2 text-[#D4AF37]/40 text-xl font-serif">❧</div>
        <div className="absolute top-2 right-2 text-[#D4AF37]/40 text-xl font-serif">☙</div>
        <div className="absolute bottom-2 left-2 text-[#D4AF37]/40 text-xl font-serif">❧</div>
        <div className="absolute bottom-2 right-2 text-[#D4AF37]/40 text-xl font-serif">☙</div>

        {/* Scratch Area Container */}
        <div className="relative w-full max-w-sm mx-auto h-48 md:h-52 rounded-xl overflow-hidden shadow-inner border border-[#D4AF37]/40 mb-6 bg-white flex items-center justify-center">
          {/* Revealed Secret Content Underneath */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#FEF2F2] via-[#FFFBEB] to-[#FEF3C7]">
            <div className="text-xs uppercase tracking-widest text-[#B45309] font-semibold mb-1">
              Mark Your Calendar
            </div>
            
            <div className="flex items-center justify-center gap-2 my-1">
              <span className="text-4xl md:text-5xl font-extrabold font-serif text-[#881337] tracking-wider">
                16
              </span>
              <span className="text-2xl text-[#D97706] font-serif">❤</span>
              <div className="text-left">
                <div className="text-lg md:text-xl font-serif font-bold text-[#881337] leading-none">
                  FEBRUARY
                </div>
                <div className="text-sm tracking-widest font-semibold text-[#B45309]">
                  2027
                </div>
              </div>
            </div>

            <div className="text-xs md:text-sm font-medium text-[#78350F] mt-1">
              {WEDDING_CONFIG.venueCity}
            </div>
            <div className="text-[11px] text-[#A16207] italic mt-0.5">
              {WEDDING_CONFIG.muhuratTime}
            </div>

            {isRevealed && (
              <div className="inline-flex items-center gap-1 text-[11px] text-[#15803D] font-semibold mt-2 animate-bounce">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Date Unlocked!
              </div>
            )}
          </div>

          {/* Golden Scratch Canvas Overlay */}
          <canvas
            ref={canvasRef}
            onMouseDown={(e) => {
              isDrawing.current = true;
              handleScratch(e.clientX, e.clientY);
            }}
            onMouseMove={(e) => {
              if (isDrawing.current) handleScratch(e.clientX, e.clientY);
            }}
            onMouseUp={() => (isDrawing.current = false)}
            onMouseLeave={() => (isDrawing.current = false)}
            onTouchStart={(e) => {
              isDrawing.current = true;
              const touch = e.touches[0];
              handleScratch(touch.clientX, touch.clientY);
            }}
            onTouchMove={(e) => {
              if (isDrawing.current) {
                const touch = e.touches[0];
                handleScratch(touch.clientX, touch.clientY);
              }
            }}
            onTouchEnd={() => (isDrawing.current = false)}
            className={`absolute inset-0 w-full h-full cursor-pointer touch-none transition-opacity duration-700 ${
              isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          />
        </div>

        {/* Scratch Progress indicator */}
        {!isRevealed && (
          <div className="max-w-xs mx-auto mb-4">
            <div className="flex justify-between text-xs text-[#78716C] mb-1 font-medium">
              <span>Scratching Progress</span>
              <span>{scratchProgress}%</span>
            </div>
            <div className="w-full bg-[#E7E5E4] rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-[#D97706] to-[#F59E0B] h-2 rounded-full transition-all duration-200"
                style={{ width: `${scratchProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <a
            href={getGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-[#D97706] to-[#B45309] text-white font-medium text-xs md:text-sm tracking-wide shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Add to Google Calendar
          </a>

          <button
            type="button"
            onClick={downloadIcs}
            className="w-full sm:w-auto px-4 py-2.5 rounded-full border border-[#D4AF37] text-[#78350F] bg-white/80 hover:bg-white text-xs md:text-sm font-medium tracking-wide shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            Download Apple / Outlook (.ics)
          </button>

          {isRevealed && (
            <button
              type="button"
              onClick={initCanvas}
              title="Scratch Again"
              className="p-2.5 rounded-full border border-[#D4AF37]/40 text-[#78350F] hover:bg-white/80 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
