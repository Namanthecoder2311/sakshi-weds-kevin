// Shared opening pieces: image loader, cover painting, “You are invited” frame and birds.
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ART, COUPLE } from './config';
import { GUEST } from './guest';

/** true once loaded, false if missing, null while checking */
export function useImage(src?: string) {
  const [ok, setOk] = useState<boolean | null>(src ? null : false);
  useEffect(() => {
    if (!src) return;
    const i = new Image();
    i.onload = () => setOk(true);
    i.onerror = () => setOk(false);
    i.src = src;
  }, [src]);
  return ok;
}

/* ───────── stand-in scene used until public/art/cover.jpg exists ───────── */
function FallbackScene() {
  const domes = [
    [300, 470, 34],
    [236, 488, 18],
    [364, 488, 18],
    [150, 500, 24],
    [450, 500, 24],
    [96, 520, 13],
    [504, 520, 13],
  ];
  return (
    <svg viewBox="0 0 600 900" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="fb-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#cfe0ee" />
          <stop offset="0.55" stopColor="#f6e9e4" />
          <stop offset="1" stopColor="#f9e3d6" />
        </linearGradient>
        <linearGradient id="fb-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#d6a356" />
          <stop offset="0.5" stopColor="#f2d08e" />
          <stop offset="1" stopColor="#c9914a" />
        </linearGradient>
        <linearGradient id="fb-lake" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#8fcfd4" />
          <stop offset="1" stopColor="#c4e7e4" />
        </linearGradient>
        <filter id="fb-soft">
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>
      <rect width="600" height="900" fill="url(#fb-sky)" />
      <g fill="#fff" opacity="0.8" filter="url(#fb-soft)">
        <ellipse cx="140" cy="300" rx="120" ry="26" />
        <ellipse cx="470" cy="260" rx="130" ry="28" />
        <ellipse cx="320" cy="380" rx="170" ry="24" />
      </g>
      <g fill="url(#fb-gold)">
        <rect x="70" y="520" width="460" height="70" />
        <rect x="210" y="480" width="180" height="110" />
        {domes.map(([x, y, r]) => (
          <path key={`${x}-${y}`} d={`M${x - r} ${y} C${x - r * 1.1} ${y - r * 1.1} ${x - r * 0.2} ${y - r * 1.5} ${x} ${y - r * 1.9} C${x + r * 0.2} ${y - r * 1.5} ${x + r * 1.1} ${y - r * 1.1} ${x + r} ${y}Z`} />
        ))}
      </g>
      <g fill="#b9844a" opacity="0.5">
        {Array.from({ length: 20 }, (_, i) => (
          <path key={i} d={`M${82 + i * 22} 586 v-22 a7 7 0 0 1 14 0 v22z`} />
        ))}
      </g>
      <rect y="588" width="600" height="8" fill="#9dbb7d" />
      <rect y="594" width="600" height="140" fill="url(#fb-lake)" />
      <g opacity="0.18" transform="translate(0 1186) scale(1 -1)">
        <rect x="70" y="520" width="460" height="70" fill="#d6a356" />
      </g>
      <rect y="730" width="600" height="14" fill="#f3e8da" />
      {Array.from({ length: 28 }, (_, i) => (
        <rect key={i} x={6 + i * 22} y="744" width="10" height="50" rx="5" fill="#efe2d0" />
      ))}
      <rect y="792" width="600" height="108" fill="#f1d6cc" />
    </svg>
  );
}

export function CoverPainting({ className }: { className?: string }) {
  const ok = useImage(ART.cover);
  return (
    <div className={className}>
      {ok ? <img src={ART.cover} alt={`${COUPLE.bride} and ${COUPLE.groom} on the palace terrace`} className="h-full w-full object-cover object-bottom" /> : <FallbackScene />}
    </div>
  );
}

/* ───────── “You are invited” (frameless: a soft ivory glow behind the text, gold ornaments) ───────── */
function GoldRule({ flip = false }: { flip?: boolean }) {
  return (
    <div className={`flex items-center justify-center gap-2.5 ${flip ? 'mt-2' : 'mb-2'}`} aria-hidden>
      <span className="h-px w-[clamp(44px,14vw,80px)] bg-gradient-to-r from-transparent to-[#b8893a]" />
      <svg viewBox="0 0 24 12" className="w-6 text-[#b8893a]">
        <path d="M12 1 L15 6 L12 11 L9 6 Z" fill="currentColor" />
        <circle cx="3" cy="6" r="1.4" fill="currentColor" />
        <circle cx="21" cy="6" r="1.4" fill="currentColor" />
      </svg>
      <span className="h-px w-[clamp(44px,14vw,80px)] bg-gradient-to-l from-transparent to-[#b8893a]" />
    </div>
  );
}

export function InvitedFrame() {
  return (
    <div className="relative mx-auto w-[min(88vw,440px)] text-center">
      {/* soft ivory haze so the words read over the painted sky — no hard outline */}
      <div className="pointer-events-none absolute -inset-x-8 -inset-y-7 bg-[radial-gradient(closest-side,rgba(255,251,244,0.93),rgba(255,251,244,0.78)_55%,rgba(255,251,244,0)_100%)]" />
      <div className="relative">
        {GUEST && <p className="mb-2 font-display text-[clamp(1.15rem,5vw,1.5rem)] leading-tight font-bold text-[#8e1d3d] italic">Dear {GUEST},</p>}
        <GoldRule />
        <p className="bg-[linear-gradient(110deg,#6e4a18,#b8893a_45%,#7a5420)] bg-clip-text font-display text-[clamp(1.35rem,6vw,2.1rem)] leading-none font-bold tracking-[0.14em] text-transparent uppercase">
          You are invited
        </p>
        <p className="mt-2 font-serif text-[clamp(0.85rem,3.6vw,1rem)] font-medium text-[#5a3940] italic">to celebrate the wedding of</p>
        <p className="mt-1 font-script text-[clamp(2.4rem,10.5vw,3.4rem)] leading-[1.05] text-[#9c1f45] [text-shadow:0_2px_10px_rgba(255,255,255,0.8)]">
          {COUPLE.bride} &amp; {COUPLE.groom}
        </p>
        <GoldRule flip />
      </div>
    </div>
  );
}

/* ───────── birds that take off when the curtains part ───────── */
export function Birds() {
  const colors = ['#f19ac0', '#f5c04a', '#7ab8e0', '#c99ad8', '#f19ac0', '#7ad0c0'];
  return (
    <div className="pointer-events-none absolute inset-0 z-[4] overflow-hidden" aria-hidden>
      {colors.map((c, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 30 20"
          className="absolute w-[clamp(18px,4.5vw,28px)]"
          style={{ left: `${18 + i * 12}%`, top: `${44 + (i % 3) * 7}%` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], x: (i % 2 ? 1 : -1) * (80 + i * 20), y: -320 - i * 30 }}
          transition={{ duration: 3.4, delay: 1 + i * 0.18, ease: 'easeOut' }}
        >
          <path className="wing" d="M15 10 C10 0 4 2 0 6 C6 6 10 8 15 10 C20 8 24 6 30 6 C26 2 20 0 15 10Z" fill={c} />
        </motion.svg>
      ))}
    </div>
  );
}
