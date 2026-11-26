// "Our Moments": a cinematic 3D coverflow of the couple's photos — swipe / drag or let it glide,
// slow Ken Burns zoom on the photo in front, glossy reflection, tap for a full-screen view.
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { PHOTOS } from './config';

const wrap = (i: number, n: number) => ((i % n) + n) % n;

export function Gallery() {
  const n = PHOTOS.length;
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const resume = useRef<number | undefined>(undefined);

  // glide to the next photo on its own; pause briefly after the viewer interacts
  useEffect(() => {
    if (paused || open !== null || n < 2) return;
    const t = window.setInterval(() => setIdx((i) => wrap(i + 1, n)), 4200);
    return () => window.clearInterval(t);
  }, [paused, open, n]);

  const nudge = (d: number) => {
    setIdx((i) => wrap(i + d, n));
    setPaused(true);
    window.clearTimeout(resume.current);
    resume.current = window.setTimeout(() => setPaused(false), 7000);
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -40 || info.velocity.x < -400) nudge(1);
    else if (info.offset.x > 40 || info.velocity.x > 400) nudge(-1);
  };

  if (!n) return null;

  return (
    <section className="overflow-hidden pt-4 pb-10">
      <motion.div
        className="px-6 text-center"
        initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: true, margin: '-70px' }}
        transition={{ duration: 0.9 }}
      >
        <p className="caps-label text-[#8c6a3a]">Captured moments</p>
        <h2 className="mt-1 font-script text-[clamp(2.5rem,10.5vw,3.8rem)] leading-[1.12] text-[#4a2230]">Our Moments</h2>
        <p className="mt-1 font-serif font-medium text-[1.02rem] text-[#5f4045] italic">Swipe through our story · tap a photo to see it bigger</p>
      </motion.div>

      {/* 3D stage */}
      <motion.div
        className="relative mx-auto mt-10 h-[min(118vw,560px)] w-full max-w-3xl cursor-grab touch-pan-y active:cursor-grabbing"
        style={{ perspective: 1100 }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.18}
        onDragEnd={onDragEnd}
        onHoverStart={() => setPaused(true)}
        onHoverEnd={() => setPaused(false)}
      >
        {PHOTOS.map((p, i) => {
          let off = i - idx;
          if (off > n / 2) off -= n;
          if (off < -n / 2) off += n;
          const a = Math.abs(off);
          const active = off === 0;
          return (
            <motion.button
              key={p.src}
              className="absolute top-0 left-1/2 w-[min(64vw,330px)] -translate-x-1/2"
              style={{ transformStyle: 'preserve-3d', zIndex: 10 - a }}
              animate={{
                x: `${off * 58}%`,
                rotateY: off * -38,
                scale: 1 - a * 0.16,
                z: -a * 120,
                opacity: a > 2 ? 0 : 1,
                filter: `brightness(${1 - a * 0.25}) saturate(${1 - a * 0.15})`,
              }}
              transition={{ type: 'spring', stiffness: 110, damping: 20, mass: 0.9 }}
              onClick={() => (active ? setOpen(i) : nudge(off))}
              aria-label={active ? `View photo: ${p.caption}` : `Show photo: ${p.caption}`}
            >
              <div className="photo-reflect rounded-[1.4rem] bg-gradient-to-b from-[#f3dfae] via-[#d6ad5c] to-[#b8893a] p-[5px] shadow-[0_40px_60px_-30px_rgba(60,20,10,0.7)]">
                <div className="relative aspect-[3/4] overflow-hidden rounded-[1.1rem] bg-[#e9dcc6]">
                  <motion.img
                    src={p.src}
                    alt={p.caption}
                    draggable={false}
                    className="h-full w-full object-cover"
                    style={{ objectPosition: p.pos }}
                    initial={false}
                    animate={active ? { scale: [1.02, 1.14] } : { scale: 1.02 }}
                    transition={active ? { duration: 7, ease: 'linear' } : { duration: 0.6 }}
                  />
                  {active && <div className="photo-sweep pointer-events-none absolute inset-0" />}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent" />
                  <AnimatePresence>
                    {active && (
                      <motion.p
                        className="absolute inset-x-0 bottom-3 text-center font-script text-[clamp(1.6rem,7vw,2.2rem)] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                      >
                        {p.caption}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.button>
          );
        })}
      </motion.div>

      {/* progress dots */}
      <div className="mt-6 flex justify-center gap-2">
        {PHOTOS.map((p, i) => (
          <button
            key={p.src}
            onClick={() => nudge(i - idx)}
            aria-label={`Go to photo ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${i === idx ? 'w-7 bg-[#9c1f45]' : 'w-2 bg-[#d9c4b8]'}`}
          />
        ))}
      </div>

      {/* full-screen viewer */}
      <AnimatePresence>
        {open !== null && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#140306]/92 p-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(null)}
          >
            <motion.img
              key={open}
              src={PHOTOS[open].src}
              alt={PHOTOS[open].caption}
              className="max-h-[82svh] max-w-full rounded-2xl border-[3px] border-[#d6ad5c] object-contain shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
            />
            <p className="absolute bottom-[5svh] font-script text-3xl text-[#f3d98e]">{PHOTOS[open].caption}</p>
            {n > 1 && (
              <>
                <button
                  className="absolute top-1/2 left-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-2xl text-white backdrop-blur"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((o) => wrap((o ?? 0) - 1, n));
                  }}
                  aria-label="Previous photo"
                >
                  ‹
                </button>
                <button
                  className="absolute top-1/2 right-3 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/15 text-2xl text-white backdrop-blur"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((o) => wrap((o ?? 0) + 1, n));
                  }}
                  aria-label="Next photo"
                >
                  ›
                </button>
              </>
            )}
            <button className="absolute top-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-xl text-white" aria-label="Close" onClick={() => setOpen(null)}>
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
