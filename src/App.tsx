import { useRef, useState } from 'react';
import { Scene3D } from './invite/Scene3D';
import { MUSIC } from './invite/config';

export default function App() {
  // `?open` jumps straight to the card (handy for re-visits and previews)
  const skip = typeof location !== 'undefined' && new URLSearchParams(location.search).has('open');
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) void a.play().then(() => setPlaying(true));
    else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <main>
      <Scene3D
        skip={skip}
        onOpen={() => {
          const a = audio.current;
          if (MUSIC && a) {
            a.volume = 0.5;
            void a.play().then(() => setPlaying(true)).catch(() => {});
          }
        }}
      />
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
              <path d="M6 0 C12 5 11 12 6 16 C1 12 0 5 6 0Z" fill={['#e98aa5', '#f4b6c8', '#c9425f', '#f8cdd8'][i % 4]} />
            </svg>
          </span>
        ))}
      </div>
      {MUSIC && (
        <>
          <audio ref={audio} src={MUSIC} loop preload="auto" />
          <button
            onClick={toggle}
            aria-label={playing ? 'Pause music' : 'Play music'}
            className="fixed top-4 right-4 z-40 grid h-11 w-11 place-items-center rounded-full border border-[#e7c977]/60 bg-black/30 text-[#f3e3c3] backdrop-blur"
          >
            {playing ? '❚❚' : '♪'}
          </button>
        </>
      )}
    </main>
  );
}
