// The couple painting as a living 3D photo. Shows the plain image first (and as the
// fallback), then fades the animated WebGL version in on top once it is ready.
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ART, COUPLE } from '../config';
import { webglAvailable } from './Opening3D';
import type { Living } from './living';

export function LivingPainting({ className }: { className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // the motion here is slow and gentle, so it runs even when the system asks for reduced motion
    if (!webglAvailable()) return;
    let living: Living | null = null;
    let cancelled = false;
    (async () => {
      try {
        const { createLiving } = await import('./living');
        if (cancelled || !canvas.current) return;
        living = await createLiving(canvas.current, ART.cover, '/art/cover-depth.png');
        if (cancelled) living.dispose();
        else setReady(true);
      } catch {
        /* keep the still painting */
      }
    })();
    return () => {
      cancelled = true;
      living?.dispose();
    };
  }, []);

  return (
    <div className={`relative ${className ?? ''}`}>
      <img src={ART.cover} alt={`${COUPLE.bride} and ${COUPLE.groom} on the palace terrace`} className="absolute inset-0 h-full w-full object-cover object-[50%_72%]" />
      <motion.canvas
        ref={canvas}
        className="absolute inset-0 h-full w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1.2 }}
        aria-hidden
      />
    </div>
  );
}
