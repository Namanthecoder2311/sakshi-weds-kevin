import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { Hero } from './invite/Hero';
import { Celebrations, Divider, DressCode, Families, Hearts, Match, ThankYou, Venue, WeddingDay, Welcome } from './invite/Sections';
import { Gallery } from './invite/Gallery';
import { MUSIC, MUSIC_TITLE } from './invite/config';

export default function App() {
  // `?open` skips the curtains (handy for re-visits and previews)
  const skip = typeof location !== 'undefined' && new URLSearchParams(location.search).has('open');
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [hasMusic, setHasMusic] = useState(false);
  const [nowPlaying, setNowPlaying] = useState(false);

  // only show the music button when a song has actually been added
  useEffect(() => {
    if (!MUSIC) return;
    fetch(MUSIC, { method: 'HEAD' })
      .then((r) => setHasMusic(r.ok && (r.headers.get('content-type') ?? '').startsWith('audio')))
      .catch(() => {});
  }, []);

  // soft fade-in so the music swells as the doors open
  const fadeTo = (a: HTMLAudioElement, target: number, ms: number) => {
    const start = a.volume;
    const t0 = performance.now();
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms);
      a.volume = start + (target - start) * k;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const startMusic = () => {
    const a = audio.current;
    if (!hasMusic || !a) return;
    a.volume = 0;
    void a
      .play()
      .then(() => {
        setPlaying(true);
        fadeTo(a, 0.55, 3500);
        // a little “now playing” label slides in as the doors open
        window.setTimeout(() => setNowPlaying(true), 1800);
        window.setTimeout(() => setNowPlaying(false), 7000);
      })
      .catch(() => {});
  };
  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused)
      void a.play().then(() => {
        setPlaying(true);
        fadeTo(a, 0.55, 1200);
      });
    else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <main className="paper">
      <Hero skip={skip} onOpen={startMusic} />
      <Divider />
      <Match />
      <Divider />
      <Hearts />
      <Divider />
      <Celebrations />
      <Divider />
      <Families />
      <Divider />
      <WeddingDay />
      <Divider />
      <DressCode />
      <Divider />
      <Venue />
      <Divider />
      <Gallery />
      <Divider />
      <Welcome />
      <ThankYou />

      <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden>
        {Array.from({ length: 14 }, (_, i) => (
          <span
            key={i}
            className="petal"
            style={{
              left: `${(i * 7.3 + 3) % 100}%`,
              animationDuration: `${13 + (i % 6) * 2.5}s`,
              animationDelay: `${-i * 2}s`,
              ['--drift' as string]: `${(i % 2 ? 1 : -1) * (30 + (i % 5) * 18)}px`,
              ['--spin' as string]: `${(i % 2 ? 1 : -1) * (300 + i * 20)}deg`,
            }}
          >
            <svg viewBox="0 0 12 16" style={{ width: 8 + (i % 3) * 3 }}>
              <path d="M6 0 C12 5 11 12 6 16 C1 12 0 5 6 0Z" fill={['#e98aa5', '#f4b6c8', '#f08fb0', '#f8cdd8'][i % 4]} />
            </svg>
          </span>
        ))}
      </div>
      {hasMusic && (
        <>
          <audio ref={audio} src={MUSIC} loop preload="auto" />
          <AnimatePresence>
            {nowPlaying && (
              <motion.div
                className="fixed right-[4.25rem] bottom-[1.15rem] z-40 flex items-center gap-2 rounded-full border border-[#e7c977]/70 bg-white/90 py-1.5 pr-4 pl-3 font-sans text-[0.85rem] text-[#4a2230] shadow-lg backdrop-blur"
                initial={{ opacity: 0, x: 24, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              >
                <span className="text-[#b8893a]">♪</span>
                <span>
                  Now playing · <b className="font-semibold text-[#9c1f45]">{MUSIC_TITLE}</b>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={toggle}
            aria-label={playing ? 'Pause music' : 'Play music'}
            className="fixed right-4 bottom-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-[#e7c977]/70 bg-white/90 text-[#9c1f45] shadow-lg backdrop-blur"
          >
            {playing && <span className="music-halo pointer-events-none absolute inset-0 rounded-full" aria-hidden />}
            {playing ? (
              <span className="flex h-4 items-end gap-[3px]" aria-hidden>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="eq-bar h-full w-[3px] rounded-full bg-[#9c1f45]" />
                ))}
              </span>
            ) : (
              <span className="text-lg">♪</span>
            )}
          </button>
        </>
      )}
    </main>
  );
}
