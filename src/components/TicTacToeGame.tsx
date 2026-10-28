import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Trophy, RotateCcw } from 'lucide-react';
import { royalAudio } from '../utils/audioPlayer';

interface Cell {
  id: number;
  revealed: boolean;
  value: string;
  subText?: string;
  isSpecial?: boolean;
}

export const TicTacToeGame: React.FC = () => {
  const initialCells: Cell[] = [
    { id: 0, revealed: false, value: '16', subText: 'Day', isSpecial: true },
    { id: 1, revealed: false, value: '❤', subText: 'Love' },
    { id: 2, revealed: false, value: 'S', subText: 'Sakshi', isSpecial: true },
    
    { id: 3, revealed: false, value: '❤', subText: 'Fate' },
    { id: 4, revealed: false, value: '02', subText: 'Month', isSpecial: true },
    { id: 5, revealed: false, value: '❤', subText: 'Destiny' },
    
    { id: 6, revealed: false, value: 'K', subText: 'Kevin', isSpecial: true },
    { id: 7, revealed: false, value: '❤', subText: 'Forever' },
    { id: 8, revealed: false, value: '27', subText: 'Year', isSpecial: true }
  ];

  const [cells, setCells] = useState<Cell[]>(initialCells);
  const [matchCount, setMatchCount] = useState(0);
  const [hasWon, setHasWon] = useState(false);

  const handleTileClick = (id: number) => {
    if (cells[id].revealed) return;

    royalAudio.playRoyalChime(500 + id * 50, 0.8);

    const newCells = cells.map((cell) =>
      cell.id === id ? { ...cell, revealed: true } : cell
    );
    setCells(newCells);

    const newRevealedCount = newCells.filter((c) => c.revealed).length;
    setMatchCount(newRevealedCount);

    if (newRevealedCount === 9 && !hasWon) {
      setHasWon(true);
      royalAudio.playWaxSealFanfare();
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#D4AF37', '#BE123C', '#F59E0B', '#FFF1F2']
      });
    }
  };

  const handleRevealAll = () => {
    setCells(cells.map((c) => ({ ...c, revealed: true })));
    setMatchCount(9);
    setHasWon(true);
    royalAudio.playWaxSealFanfare();
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleReset = () => {
    setCells(initialCells);
    setMatchCount(0);
    setHasWon(false);
  };

  return (
    <section className="py-12 px-4 max-w-lg mx-auto text-center">
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#FFF1F2] text-[#9F1239] text-xs font-semibold uppercase tracking-wider mb-2">
          <Heart className="w-3.5 h-3.5 fill-[#BE123C] text-[#BE123C]" />
          Mini Game
        </span>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#5E0B1B]">
          Scratch to Make a Match
        </h3>
        <p className="text-sm font-['Cormorant_Garamond'] italic text-[#78716C] mt-1">
          Tap each golden tile to uncover Sakshi & Kevin's sacred wedding code!
        </p>
      </div>

      <div className="bg-gradient-to-b from-white to-[#FAF6ED] p-6 rounded-2xl shadow-xl border border-[#D4AF37]/40 relative">
        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto mb-6">
          {cells.map((cell) => (
            <button
              key={cell.id}
              type="button"
              onClick={() => handleTileClick(cell.id)}
              className={`aspect-square rounded-xl relative transition-all duration-300 transform active:scale-95 flex flex-col items-center justify-center p-2 cursor-pointer shadow-sm ${
                cell.revealed
                  ? 'bg-gradient-to-br from-[#FFFBEB] to-[#FEF3C7] border-2 border-[#D4AF37] shadow-inner'
                  : 'bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] border-2 border-[#AA7C11] hover:brightness-105'
              }`}
            >
              {cell.revealed ? (
                <div className="animate-in fade-in zoom-in-75 duration-300 flex flex-col items-center">
                  <span
                    className={`text-2xl md:text-3xl font-serif font-extrabold ${
                      cell.value === '❤' ? 'text-[#E11D48] animate-pulse' : 'text-[#881337]'
                    }`}
                  >
                    {cell.value}
                  </span>
                  {cell.subText && (
                    <span className="text-[10px] uppercase font-semibold text-[#B45309] tracking-wider mt-0.5">
                      {cell.subText}
                    </span>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center text-[#78350F]">
                  <Sparkles className="w-5 h-5 text-[#854D0E] animate-pulse mb-1" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#713F12]">
                    Tap
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Status / Victory Announcement */}
        {hasWon ? (
          <div className="bg-[#FEF2F2] border border-[#FDA4AF] p-4 rounded-xl text-center animate-in fade-in zoom-in duration-500 mb-4">
            <div className="inline-flex items-center gap-1.5 text-[#9F1239] font-bold text-sm mb-1">
              <Trophy className="w-4 h-4 text-[#D97706]" />
              A Perfect Love Match Found!
            </div>
            <p className="text-xs text-[#881337] italic font-['Cormorant_Garamond'] text-sm">
              “16 • 02 • 2027 — Sakshi & Kevin, written in the stars, sealed with love.”
            </p>
          </div>
        ) : (
          <p className="text-xs text-[#A8A29E] font-medium mb-4">
            Tiles uncovered: {matchCount} of 9
          </p>
        )}

        {/* Buttons */}
        <div className="flex items-center justify-center gap-3">
          {!hasWon ? (
            <button
              type="button"
              onClick={handleRevealAll}
              className="px-4 py-2 rounded-full bg-[#FEF3C7] hover:bg-[#FDE68A] text-[#92400E] text-xs font-semibold tracking-wide transition-colors"
            >
              Reveal All Tiles
            </button>
          ) : (
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-full border border-[#D4AF37] text-[#78350F] hover:bg-white text-xs font-semibold tracking-wide transition-colors inline-flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Play Again
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
