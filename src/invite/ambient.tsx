// Ambient life over the couple painting: birds crossing the sky and floating gold sparkles.
import { motion } from 'framer-motion';

function Bird({ color, delay, top, dur, scale = 1, reverse = false }: { color: string; delay: number; top: string; dur: number; scale?: number; reverse?: boolean }) {
  return (
    <motion.div
      className="absolute"
      style={{ top, left: 0, width: 26 * scale }}
      initial={{ x: reverse ? '110vw' : '-12vw', opacity: 0 }}
      animate={{ x: reverse ? ['110vw', '-12vw'] : ['-12vw', '110vw'], y: [0, -18, 6, -10, 0], opacity: [0, 1, 1, 1, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, repeatDelay: 6 + delay, ease: 'linear' }}
    >
      <svg viewBox="0 0 30 20" style={{ transform: reverse ? 'scaleX(-1)' : undefined }} aria-hidden>
        <path className="bird-wing" d="M15 10 C10 0 4 2 0 6 C6 6 10 8 15 10 C20 8 24 6 30 6 C26 2 20 0 15 10Z" fill={color} />
        <ellipse cx="15" cy="10.5" rx="3.2" ry="1.6" fill={color} />
      </svg>
    </motion.div>
  );
}

export function SkyBirds() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-[45%] overflow-hidden" aria-hidden>
      <Bird color="#5b6f8a" delay={1.5} top="22%" dur={11} scale={0.8} />
      <Bird color="#6d7f99" delay={2.3} top="27%" dur={12} scale={0.65} />
      <Bird color="#f19ac0" delay={6} top="16%" dur={9} scale={0.9} reverse />
      <Bird color="#4e6680" delay={10} top="33%" dur={14} scale={0.55} />
    </div>
  );
}

export function GoldSparkles({ count = 22 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      {Array.from({ length: count }, (_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${(i * 37 + 7) % 100}%`,
            top: `${30 + ((i * 53) % 70)}%`,
            width: 2 + (i % 4),
            height: 2 + (i % 4),
            background: 'radial-gradient(circle, #fff8dc, #f3d98e 55%, transparent 70%)',
            boxShadow: '0 0 8px 2px rgba(255, 224, 150, 0.6)',
          }}
          animate={{ y: [0, -60 - (i % 5) * 20], x: [0, (i % 2 ? 1 : -1) * (10 + (i % 3) * 8)], opacity: [0, 1, 0], scale: [0.6, 1.2, 0.6] }}
          transition={{ duration: 5 + (i % 5), delay: (i * 0.7) % 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
