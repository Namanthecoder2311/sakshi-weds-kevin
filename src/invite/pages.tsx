// The faces of the 3D card. Sizes use cqw so everything scales with the card.
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';
import { ART, BLESSING, COUPLE, EVENTS, PHOTOS, THANK_YOU, VENUE, type EventItem } from './config';
import { useImage } from './opening';
import { EventIcon, Flourish, GoldFrame, Mandala, WaxSeal } from './ornaments';
import { Scratch } from './Scratch';

export type PageDef = { key: string; label: string; render: (active: boolean) => React.ReactNode; tone?: 'ivory' | 'maroon' };

function Caps({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={`font-display text-[3cqw] tracking-[0.42em] text-[#8c6a3a] uppercase ${className ?? ''}`}>{children}</p>;
}

function Title({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h2 className={`font-script text-[12cqw] leading-[1.05] text-[#7a1d33] ${className ?? ''}`}>{children}</h2>;
}

/* ───────── Cover ───────── */
function Cover() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-[12cqw] text-center">
      <Mandala className="absolute top-1/2 left-1/2 w-[120cqw] -translate-x-1/2 -translate-y-1/2 opacity-[0.18]" />
      <p className="font-deva text-[4.4cqw] text-[#e7c977]">॥ शुभ विवाह ॥</p>
      <div className="relative mt-[7cqw] grid h-[46cqw] w-[46cqw] place-items-center">
        <div className="absolute inset-0 rounded-t-full border border-[#e7c977]/70" />
        <div className="absolute inset-[2cqw] rounded-t-full border-[0.5px] border-[#e7c977]/50" />
        <span className="foil-text font-script text-[24cqw] leading-none">
          {COUPLE.monogram[0]}
          <span className="text-[14cqw]">&</span>
          {COUPLE.monogram[1]}
        </span>
      </div>
      <p className="mt-[7cqw] font-display text-[3.1cqw] tracking-[0.5em] text-[#f3e3c3] uppercase">You are invited</p>
      <p className="foil-text mt-[2cqw] font-script text-[10cqw] leading-tight">
        {COUPLE.bride} &amp; {COUPLE.groom}
      </p>
      <Flourish className="mt-[4cqw] w-[48cqw]" />
    </div>
  );
}

/* ───────── The wedding of ───────── */
function Names() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-[12cqw] text-center">
      <p className="font-deva text-[4cqw] text-[#9c2b45]">॥ श्री गणेशाय नमः ॥</p>
      <Caps className="mt-[5cqw]">The wedding of</Caps>
      <h1 className="mt-[3cqw] font-script text-[17cqw] leading-none text-[#9c1f45]">{COUPLE.bride}</h1>
      <p className="mt-[1.5cqw] font-serif text-[2.9cqw] text-[#8a7470] italic">{COUPLE.brideParents}</p>
      <p className="mt-[2cqw] font-script text-[8cqw] text-[#b8893a]">with</p>
      <h1 className="font-script text-[17cqw] leading-none text-[#9c1f45]">{COUPLE.groom}</h1>
      <p className="mt-[1.5cqw] font-serif text-[2.9cqw] text-[#8a7470] italic">{COUPLE.groomParents}</p>
      <Flourish className="mt-[5cqw] w-[44cqw]" />
      <p className="mt-[4cqw] font-serif text-[3.3cqw] leading-relaxed text-[#5a4044]">{BLESSING}</p>
    </div>
  );
}

/* ───────── Scratch to make a match ───────── */
const GRID = [
  { v: COUPLE.monogram[0], s: true, script: true },
  { v: '✕' },
  { v: '♡' },
  { v: '♡' },
  { v: '♥', s: true },
  { v: '✕' },
  { v: '∞' },
  { v: '✕' },
  { v: COUPLE.monogram[1], s: true, script: true },
];

function Match() {
  const [found, setFound] = useState(0);
  const won = found >= 3;
  useEffect(() => {
    if (!won) return;
    confetti({ particleCount: 80, spread: 80, origin: { y: 0.55 }, colors: ['#9c1f45', '#e9a3b5', '#e7c977'], zIndex: 60 });
  }, [won]);
  return (
    <div className="flex h-full flex-col items-center justify-center px-[11cqw] text-center">
      <Caps>A perfect match</Caps>
      <Title className="mt-[1cqw] text-[10.4cqw]!">Scratch to make a match</Title>
      <div className="relative mt-[5cqw] w-[62cqw]">
        <div className="grid grid-cols-3">
          {GRID.map((c, i) => {
            const content = <span className={`grid h-full w-full place-items-center text-[#9c1f45] ${c.script ? 'font-script text-[11cqw]' : 'text-[7cqw]'}`}>{c.v}</span>;
            return (
              <div key={i} className={`aspect-square p-[1.8cqw] ${i % 3 !== 2 ? 'border-r' : ''} ${i < 6 ? 'border-b' : ''} border-[#c9a24a]/70`}>
                {c.s ? (
                  <Scratch className="h-full w-full" onDone={() => setFound((f) => f + 1)}>
                    {content}
                  </Scratch>
                ) : (
                  content
                )}
              </div>
            );
          })}
        </div>
        <svg viewBox="0 0 100 100" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
          <motion.line x1="9" y1="9" x2="91" y2="91" stroke="#c9a24a" strokeWidth="1.3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: won ? 1 : 0 }} transition={{ duration: 0.9 }} />
        </svg>
      </div>
      <motion.p className="mt-[4cqw] h-[9cqw] font-script text-[8cqw] text-[#9c1f45]" animate={{ opacity: won ? 1 : 0, scale: won ? 1 : 0.8 }}>
        It’s a match!
      </motion.p>
      <p className="font-script text-[5.4cqw] leading-snug text-[#5a4044]">“Two souls, one heart, scratched in fate, sealed with love.”</p>
    </div>
  );
}

/* ───────── Four promises ───────── */
const PROMISES = ['Love', 'Laughter', 'Family', 'Forever'];
function Promises() {
  const [open, setOpen] = useState<boolean[]>(() => PROMISES.map(() => false));
  return (
    <div className="flex h-full flex-col items-center justify-center px-[10cqw] text-center">
      <Caps>Four little promises</Caps>
      <Title className="mt-[1cqw]">Until forever begins</Title>
      <p className="mt-[3cqw] font-serif text-[3.2cqw] text-[#8a7470] italic">Scratch each golden heart</p>
      <div className="mt-[6cqw] grid w-full grid-cols-2 gap-[5cqw]">
        {PROMISES.map((w, i) => (
          <Scratch key={w} shape="heart" className="aspect-square w-full" onDone={() => setOpen((o) => o.map((v, k) => (k === i ? true : v)))}>
            <div className={`grid h-full w-full place-items-center rounded-[4cqw] transition-all duration-700 ${open[i] ? 'bg-white shadow-[0_2cqw_5cqw_-2cqw_rgba(120,40,60,0.35)] ring-1 ring-[#ead8c8]' : ''}`}>
              <span className="font-script text-[9cqw] text-[#9c1f45]">{w}</span>
            </div>
          </Scratch>
        ))}
      </div>
    </div>
  );
}

/* ───────── An event ───────── */
function Event({ e }: { e: EventItem }) {
  const art = ART[e.id];
  const hasArt = useImage(art);
  return (
    <div className={`flex h-full flex-col items-center justify-center text-center ${hasArt ? 'px-[9cqw]' : 'px-[12cqw]'}`}>
      {hasArt ? (
        <div className="w-full overflow-hidden rounded-[3cqw] border border-[#c9a24a]/80 p-[1cqw] shadow-[0_3cqw_6cqw_-3cqw_rgba(90,40,30,0.55)]">
          <img src={art} alt={e.name} className="aspect-[16/10] w-full rounded-[2.2cqw] object-cover" />
        </div>
      ) : (
        <>
          <Caps>Celebration</Caps>
          <EventIcon id={e.id} className="mt-[4cqw] w-[26cqw]" />
        </>
      )}
      <p className={`${hasArt ? 'mt-[4cqw]' : 'mt-[3cqw]'} font-deva text-[4.6cqw]`} style={{ color: e.accent }}>
        {e.hindi}
      </p>
      <h2 className={`font-script leading-none text-[#7a1d33] ${hasArt ? 'text-[13cqw]' : 'text-[16cqw]'}`}>{e.name}</h2>
      <Flourish className="mt-[2.4cqw] w-[40cqw]" />
      <div className="mt-[3cqw] space-y-[1.4cqw] font-sans text-[3.3cqw] text-[#4a3a3e]">
        <p>
          <span className="text-[#b8893a]">✦</span> {e.day} &nbsp;·&nbsp; {e.time}
        </p>
        <p>
          <span className="text-[#b8893a]">⌖</span> {e.place}
        </p>
      </div>
      <p className="mt-[3cqw] font-serif text-[3.3cqw] text-[#7a6266] italic">{e.line}</p>
      <div className={`${hasArt ? 'mt-[4cqw]' : 'mt-[6cqw]'} flex items-center gap-[2.4cqw]`}>
        {e.swatches.map((c) => (
          <span key={c} className="h-[5.6cqw] w-[5.6cqw] rounded-full shadow-[inset_0_-0.6cqw_1cqw_rgba(0,0,0,0.25)] ring-1 ring-[#c9a24a]/70" style={{ background: c }} />
        ))}
      </div>
      <Caps className="mt-[2cqw] text-[2.4cqw]! tracking-[0.3em]!">Dress code</Caps>
      <p className="mt-[1cqw] font-serif text-[3cqw] text-[#5a4044]">{e.dress}</p>
    </div>
  );
}

/* ───────── Venue ───────── */
function Venue() {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE.mapQuery || VENUE.name)}`;
  return (
    <div className="flex h-full flex-col items-center justify-center px-[12cqw] text-center">
      <Caps>The venue</Caps>
      <EventIcon id="venue" className="mt-[5cqw] w-[36cqw]" />
      <Title className="mt-[4cqw]">{VENUE.name}</Title>
      <p className="mt-[1cqw] font-serif text-[3.4cqw] text-[#8a7470] italic">{VENUE.area}</p>
      <Flourish className="mt-[5cqw] w-[40cqw]" />
      <a
        href={maps}
        target="_blank"
        rel="noreferrer"
        className="mt-[7cqw] rounded-full bg-[linear-gradient(110deg,#b8893a,#f3d98e_45%,#c99c45)] px-[7cqw] py-[2.6cqw] font-sans text-[3.2cqw] font-medium tracking-wide text-[#4a1a24] shadow-[0_2cqw_5cqw_-2cqw_rgba(140,90,20,0.8)]"
      >
        Open live location
      </a>
    </div>
  );
}

/* ───────── Gallery (only when photos exist) ───────── */
function Gallery() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-[10cqw] text-center">
      <Caps>Captured moments</Caps>
      <Title className="mt-[1cqw]">Our Gallery</Title>
      <div className="mt-[6cqw] grid grid-cols-2 gap-[4cqw]">
        {PHOTOS.slice(0, 4).map((src, i) => (
          <div key={src} className="bg-white p-[1.6cqw] pb-[5cqw] shadow-[0_2cqw_4cqw_-2cqw_rgba(0,0,0,0.4)]" style={{ transform: `rotate(${[-4, 3, 2, -3][i]}deg)` }}>
            <img src={src} alt={`Photo ${i + 1}`} className="aspect-square w-[30cqw] object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Thank you ───────── */
function Thanks() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-[12cqw] text-center">
      <Mandala className="absolute top-1/2 left-1/2 w-[110cqw] -translate-x-1/2 -translate-y-1/2 opacity-[0.16]" />
      <EventIcon id="heart" className="w-[14cqw]" />
      <h2 className="foil-text mt-[3cqw] font-script text-[17cqw] leading-none">Thank You</h2>
      <p className="mt-[6cqw] font-serif text-[3.6cqw] leading-relaxed text-[#f3e3c3]">{THANK_YOU}</p>
      <p className="foil-text mt-[6cqw] font-script text-[9cqw]">
        {COUPLE.bride} &amp; {COUPLE.groom}
      </p>
      <Flourish className="mt-[3cqw] w-[44cqw]" />
      <WaxSeal className="mt-[6cqw] w-[16cqw]" />
    </div>
  );
}

export const PAGES: PageDef[] = [
  { key: 'cover', label: 'Invitation', render: () => <Cover />, tone: 'maroon' },
  { key: 'names', label: 'The wedding of', render: () => <Names /> },
  { key: 'match', label: 'A perfect match', render: () => <Match /> },
  { key: 'promises', label: 'Promises', render: () => <Promises /> },
  ...EVENTS.map((e) => ({ key: e.id, label: e.name, render: () => <Event e={e} /> })),
  { key: 'venue', label: 'Venue', render: () => <Venue /> },
  ...(PHOTOS.length ? [{ key: 'gallery', label: 'Gallery', render: () => <Gallery /> }] : []),
  { key: 'thanks', label: 'Thank you', render: () => <Thanks />, tone: 'maroon' as const },
];

/** One printed face of the card. */
export function Face({ tone = 'ivory', children }: { tone?: 'ivory' | 'maroon'; children: React.ReactNode }) {
  return (
    <div className={`absolute inset-0 overflow-hidden rounded-[2.4cqw] ${tone === 'maroon' ? 'face-maroon' : 'face-ivory'}`}>
      <GoldFrame />
      {children}
    </div>
  );
}

/** The reverse of a leaf — seen while it swings over the top. */
export function Back() {
  return (
    <div className="face-ivory absolute inset-0 grid place-items-center overflow-hidden rounded-[2.4cqw]">
      <Mandala className="w-[90cqw] opacity-40" />
    </div>
  );
}
