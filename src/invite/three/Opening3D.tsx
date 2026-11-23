// React wrapper for the 3D palace-door opening. Shows a gentle loading state while the
// scene is built, the "Open the invitation" call to action on top, then fades away.
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ART, COUPLE } from '../config';
import { WaxSeal } from '../ornaments';
import type { Palace } from './palace';
import { GUEST } from '../guest';

export function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

export function Opening3D({ onOpen, onDone, onFail }: { onOpen: () => void; onDone: () => void; onFail: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const palace = useRef<Palace | null>(null);
  const [ready, setReady] = useState(false);
  const [opened, setOpened] = useState(false);
  const [leaving, setLeaving] = useState(false);
  // keep the latest callback without rebuilding the scene on every parent render
  const failRef = useRef(onFail);
  failRef.current = onFail;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await document.fonts?.load?.('64px "Great Vibes"');
        const { createPalace } = await import('./palace');
        if (cancelled || !canvas.current) return;
        palace.current = await createPalace(canvas.current, {
          cover: ART.cover,
          monogram: `${COUPLE.monogram[0]}${COUPLE.monogram[1]}`,
          onDone: () => setLeaving(true),
        });
        if (!cancelled) setReady(true);
      } catch {
        if (!cancelled) failRef.current();
      }
    })();
    return () => {
      cancelled = true;
      palace.current?.dispose();
    };
  }, []);

  const open = () => {
    if (!ready || opened) return;
    setOpened(true);
    palace.current?.open();
    onOpen();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-[#140306]"
      initial={false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={{ duration: 0.9, ease: 'easeInOut' }}
      onAnimationComplete={() => leaving && onDone()}
      onClick={open}
    >
      <canvas ref={canvas} className="absolute inset-0 h-full w-full" />

      {/* loading */}
      <AnimatePresence>
        {!ready && (
          <motion.div className="absolute inset-0 grid place-items-center bg-[#140306]" exit={{ opacity: 0, scale: 1.15 }} transition={{ duration: 0.35 }}>
            <motion.div animate={{ scale: [1, 1.06, 1], opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 1.8 }}>
              <WaxSeal tone="gold" className="w-24" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* call to action */}
      <AnimatePresence>
        {ready && !opened && (
          <motion.div className="pointer-events-none absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
            <div className="absolute inset-x-0 top-[5svh] flex flex-col items-center px-6 text-center">
              <p className="rounded-full border border-[#d6ad5c]/60 bg-[#2a0610]/70 px-5 py-1.5 font-deva text-[clamp(0.95rem,4vw,1.3rem)] text-[#f3d98e] shadow-[0_6px_16px_rgba(0,0,0,0.5)] backdrop-blur-sm">
                ॥ श्री गणेशाय नमः ॥
              </p>
              {GUEST && (
                <motion.p
                  className="mt-3 font-script text-[clamp(1.5rem,6.4vw,2.1rem)] leading-none text-[#f6dc96] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.9 }}
                >
                  For {GUEST}
                </motion.p>
              )}
            </div>
            <div className="absolute inset-x-0 bottom-[7svh] flex flex-col items-center">
              <motion.button
                aria-label="Open the invitation"
                className="pointer-events-auto rounded-full bg-[#fffaf2]/95 px-7 py-2.5 font-script text-[clamp(1.5rem,6vw,2rem)] leading-none text-[#4a1a24] shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
                onClick={open}
              >
                Open the invitation
              </motion.button>
              <p className="mt-3 font-display text-[0.7rem] tracking-[0.4em] text-[#f3d98e]/85 uppercase">Tap the seal</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
