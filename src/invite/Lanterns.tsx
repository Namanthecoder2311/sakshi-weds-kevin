// Wish-lantern finale: the guest releases a glowing sky lantern with their name on it;
// smaller lanterns drift up around it and gold fireworks burst when it reaches the sky.
import confetti from 'canvas-confetti';
import { AnimatePresence, motion } from 'framer-motion';
import { useId, useState } from 'react';
import { COUPLE } from './config';
import { GUEST } from './guest';

function Lantern({ className = '', glow = true }: { className?: string; glow?: boolean }) {
  const id = useId();
  return (
    <svg
      viewBox="0 0 60 84"
      className={className}
      style={glow ? { filter: 'drop-shadow(0 0 14px rgba(255,170,70,0.95)) drop-shadow(0 0 34px rgba(255,120,40,0.55))' } : undefined}
      aria-hidden
    >
      <defs>
        <radialGradient id={`${id}g`} cx="50%" cy="68%" r="70%">
          <stop offset="0" stopColor="#fff6cf" />
          <stop offset="0.38" stopColor="#ffc15a" />
          <stop offset="0.8" stopColor="#f07a2e" />
          <stop offset="1" stopColor="#c84a1e" />
        </radialGradient>
      </defs>
      {/* paper body */}
      <path d="M15 6 Q30 1 45 6 L54 66 Q30 75 6 66 Z" fill={`url(#${id}g)`} />
      {/* paper ribs */}
      <path d="M22 5 L17 70 M38 5 L43 70 M30 3 V73" stroke="#e8743a" strokeWidth="0.8" opacity="0.45" fill="none" />
      <path d="M15 6 Q30 1 45 6" stroke="#a8461f" strokeWidth="1.6" fill="none" />
      {/* bamboo ring + flame */}
      <ellipse cx="30" cy="67" rx="24" ry="4.2" fill="none" stroke="#8a3a17" strokeWidth="1.6" />
      <path d="M30 72 C34 77 33 81 30 83 C27 81 26 77 30 72Z" fill="#ffd36b" />
      <ellipse cx="30" cy="56" rx="7" ry="10" fill="#fffbe6" opacity="0.55" />
    </svg>
  );
}

const BACKGROUND = Array.from({ length: 9 }, (_, i) => ({
  left: 6 + ((i * 37) % 88),
  size: 20 + ((i * 7) % 16),
  delay: 0.2 + (i % 5) * 0.45,
  dur: 7.5 + (i % 4) * 1.3,
  sway: (i % 2 ? 1 : -1) * (10 + (i % 3) * 8),
}));

function fireworks() {
  const colors = ['#f6d27a', '#ffe9a8', '#f4b6c8', '#e98aa5', '#ffffff'];
  [0.28, 0.5, 0.72, 0.4, 0.62].forEach((x, k) => {
    window.setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 360,
        startVelocity: 26,
        gravity: 0.55,
        ticks: 140,
        scalar: 0.85,
        shapes: ['circle'],
        origin: { x, y: 0.18 + (k % 2) * 0.08 },
        colors,
        disableForReducedMotion: false,
      });
    }, k * 380);
  });
}

/** Lanterns rising inside a positioned parent (the Thank-You section). */
export function WishLanterns({ launches }: { launches: number[] }) {
  const label = GUEST ? `From ${GUEST}` : 'With love';
  // rise distance in pixels (viewport units don't interpolate in the animation library)
  const H = typeof window === 'undefined' ? 800 : window.innerHeight;
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden" aria-hidden>
      {launches.map((n) => (
        <div key={n} className="absolute inset-0">
          {/* the guest's own lantern */}
          <motion.div
            className="absolute bottom-[6%] left-1/2 flex -translate-x-1/2 flex-col items-center"
            initial={{ y: 0, opacity: 0, scale: 1 }}
            animate={{ y: -H * 0.74, opacity: [0, 1, 1, 1, 0.85], scale: [0.9, 1, 0.85, 0.7, 0.55], x: [0, 14, -10, 8, 0] }}
            transition={{ duration: 8, ease: [0.42, 0, 0.3, 1] }}
            onAnimationComplete={fireworks}
          >
            <Lantern className="w-[clamp(64px,18vw,86px)]" />
            <p className="mt-1 rounded-full bg-[#3a0714]/55 px-3 py-0.5 font-script text-[1.35rem] whitespace-nowrap text-[#fff1d0] [text-shadow:0_0_10px_rgba(255,180,80,0.9)]">
              {label}
            </p>
          </motion.div>
          {/* a sky full of companions */}
          {BACKGROUND.map((b, k) => (
            <motion.div
              key={k}
              className="absolute bottom-0"
              style={{ left: `${b.left}%` }}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: -H * 1.02, opacity: [0, 0.9, 0.9, 0], x: [0, b.sway, -b.sway / 2, b.sway / 3] }}
              transition={{ duration: b.dur, delay: b.delay, ease: 'easeOut' }}
            >
              <div style={{ width: b.size }}>
                <Lantern className="w-full opacity-90" glow={k % 2 === 0} />
              </div>
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Button + thank-you line; the lanterns themselves render through WishLanterns. */
export function LanternButton({ onLaunch, launched }: { onLaunch: () => void; launched: boolean }) {
  return (
    <div className="mt-5 flex flex-col items-center">
      <motion.button
        onClick={onLaunch}
        className="rounded-full bg-[linear-gradient(110deg,#d9531f,#f39a3d_50%,#e46a2a)] px-6 py-3 font-sans text-[0.98rem] font-semibold text-white shadow-[0_12px_30px_-8px_rgba(226,87,43,0.85)] ring-2 ring-[#ffd28a]/60"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
        whileTap={{ scale: 0.94 }}
      >
        🏮 {launched ? 'Release another lantern' : 'Release a wish lantern'}
      </motion.button>
      <AnimatePresence>
        {launched && (
          <motion.p
            className="mt-3 max-w-[300px] rounded-2xl bg-[#fffaf4]/85 px-4 py-2 text-center font-display text-[1.05rem] leading-snug font-semibold text-[#9c1f45] italic shadow-sm backdrop-blur-sm"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 7.6, duration: 0.8 }}
          >
            ✨ Your blessings are on their way to {COUPLE.bride} &amp; {COUPLE.groom}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/** Small hook so the section can own the state. */
export function useLanterns() {
  const [launches, setLaunches] = useState<number[]>([]);
  const launch = () => {
    const n = Date.now();
    setLaunches((l) => [...l.slice(-2), n]);
    window.setTimeout(() => setLaunches((l) => l.filter((x) => x !== n)), 14000);
  };
  return { launches, launch, launched: launches.length > 0 };
}
