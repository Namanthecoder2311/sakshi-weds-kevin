// The scrolling invitation (reel-1 style), using the painted artwork.
import { motion, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect, useRef, useState } from 'react';
import { ART, COUPLE, EVENTS, THANK_YOU, VENUE, type EventItem } from './config';
import { EventIcon, Flourish, WaxSeal } from './ornaments';
import { CoverPainting, useImage } from './opening';
import { Scratch } from './Scratch';

/* ───────── shared bits ───────── */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.2, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

function Heading({ eyebrow, title, sub, rose = false }: { eyebrow: string; title: string; sub?: string; rose?: boolean }) {
  return (
    <Reveal className="px-6 text-center">
      <p className="caps-label text-[#8c6a3a]">{eyebrow}</p>
      <h2 className={`mt-1 font-script text-[clamp(2.5rem,10.5vw,3.8rem)] leading-[1.12] ${rose ? 'title-rose text-[#9c1f45]' : 'text-[#4a2230]'}`}>{title}</h2>
      {sub && <p className="mt-1 font-serif text-[0.92rem] text-[#8a7470] italic">{sub}</p>}
    </Reveal>
  );
}

function Divider() {
  return (
    <Reveal className="my-16 flex justify-center">
      <Flourish className="w-56" />
    </Reveal>
  );
}

/* ───────── Shree Ganeshay Namah + families ───────── */
export function Families() {
  return (
    <section className="px-6 text-center">
      <Reveal>
        <p className="font-deva text-lg text-[#9c2b45]">॥ श्री गणेशाय नमः ॥</p>
        <p className="caps-label mt-1 text-[0.62rem]! text-[#b8893a]">Shree Ganeshay Namah</p>
        <p className="mx-auto mt-6 max-w-xs font-script text-[1.6rem] leading-snug text-[#9c1f45]">
          “Two hearts found their way to each other, and now begins a journey of …… Forever”
        </p>
        <div className="mx-auto mt-8 max-w-md text-[#5a4044]">
          {/* bride: family lines above her name; groom: name first, then family lines */}
          {COUPLE.brideFamily.map((l) => (
            <p key={l} className="mt-1 font-serif text-[0.85rem] text-[#7a6266] italic">
              {l}
            </p>
          ))}
          <p className="mt-3 font-script text-[2.6rem] leading-none text-[#9c1f45]">{COUPLE.bride}</p>
          <p className="my-4 font-script text-2xl text-[#b8893a]">with</p>
          <p className="font-script text-[2.6rem] leading-none text-[#9c1f45]">{COUPLE.groom}</p>
          {COUPLE.groomFamily.map((l) => (
            <p key={l} className="mt-1 font-serif text-[0.85rem] text-[#7a6266] italic">
              {l}
            </p>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ───────── scratch to make a match ───────── */
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

export function Match() {
  const [found, setFound] = useState(0);
  const won = found >= 3;
  useEffect(() => {
    if (won) confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 }, colors: ['#9c1f45', '#f4b6c8', '#e7c977'] });
  }, [won]);
  return (
    <section>
      <Heading eyebrow="A perfect match" title="Scratch to make a match" rose />
      <Reveal className="relative mx-auto mt-8 w-[min(80vw,330px)]">
        <div className="grid grid-cols-3">
          {GRID.map((c, i) => {
            const content = <span className={`grid h-full w-full place-items-center text-[#9c1f45] ${c.script ? 'font-script text-5xl' : 'text-[1.9rem]'}`}>{c.v}</span>;
            return (
              <div key={i} className={`aspect-square p-2.5 ${i % 3 !== 2 ? 'border-r' : ''} ${i < 6 ? 'border-b' : ''} border-[#c9a24a]/70`}>
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
      </Reveal>
      <motion.p className="mt-5 h-12 text-center font-script text-4xl text-[#9c1f45]" animate={{ opacity: won ? 1 : 0, scale: won ? 1 : 0.8 }}>
        It’s a match!
      </motion.p>
      <Reveal className="mx-auto max-w-xs px-6 text-center font-script text-2xl leading-snug text-[#5a4044]">
        “Two souls, one heart, scratched in fate, sealed with love.”
      </Reveal>
    </section>
  );
}

/* ───────── golden hearts ───────── */
const PROMISES = ['Love', 'Laughter', 'Family', 'Forever'];
export function Hearts() {
  const [open, setOpen] = useState<boolean[]>(() => PROMISES.map(() => false));
  return (
    <section>
      <Heading eyebrow="Four little promises" title="Until forever begins" sub="Scratch each golden heart" rose />
      <Reveal className="mx-auto mt-8 grid w-[min(92vw,520px)] grid-cols-4 gap-2.5 sm:gap-4">
        {PROMISES.map((w, i) => (
          <Scratch key={w} shape="heart" className="aspect-square w-full" onDone={() => setOpen((o) => o.map((v, k) => (k === i ? true : v)))}>
            <div className={`grid h-full w-full place-items-center rounded-2xl transition-all duration-700 ${open[i] ? 'bg-white shadow-[0_10px_24px_-12px_rgba(120,40,60,0.45)] ring-1 ring-[#ead8c8]' : ''}`}>
              <span className="font-script text-[clamp(1.2rem,5.4vw,2rem)] text-[#9c1f45]">{w}</span>
            </div>
          </Scratch>
        ))}
      </Reveal>
    </section>
  );
}

/* ───────── our days of joy ───────── */
function EventCard({ e, i }: { e: EventItem; i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rotateX = useTransform(scrollYProgress, [0, 0.4], [32, 0]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.4], [i % 2 ? 4 : -4, i % 2 ? 1.2 : -1.2]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1.18, 1]);
  const pan = useTransform(scrollYProgress, [0, 1], ['-4%', '4%']);
  const art = ART[e.id];
  const hasArt = useImage(art);
  return (
    <div ref={ref} className="flex flex-col items-center text-center">
      <motion.div
        className="w-full overflow-hidden rounded-[1.4rem] bg-[#f3e8da] p-1.5 shadow-[0_30px_60px_-28px_rgba(80,40,30,0.6)] ring-1 ring-[#e8d7bf]"
        style={{ rotateX, rotateZ, transformPerspective: 900 }}
      >
        <div className="aspect-[16/10] overflow-hidden rounded-[1.05rem]">
          {hasArt ? (
            <motion.img src={art} alt={e.name} className="h-full w-full object-cover" style={{ scale: zoom, x: pan }} />
          ) : (
            <div className="grid h-full w-full place-items-center bg-[#fbf3e6]">
              <EventIcon id={e.id} className="w-24" />
            </div>
          )}
        </div>
      </motion.div>
      <Reveal className="mt-6 flex flex-col items-center">
        <p className="font-deva text-lg" style={{ color: e.accent }}>
          {e.hindi}
        </p>
        <h3 className="font-script text-[3.4rem] leading-none text-[#4a2230]">{e.name}</h3>
        <div className="mt-3 space-y-1 font-sans text-[0.85rem] text-[#4a3a3e]">
          <p>
            <span className="text-[#b8893a]">✦</span> {e.day} &nbsp;·&nbsp; {e.time}
          </p>
          <p>
            <span className="text-[#b8893a]">⌖</span> {e.place}
          </p>
        </div>
        <p className="mt-3 font-serif text-[0.95rem] text-[#7a6266] italic">{e.line}</p>
      </Reveal>
    </div>
  );
}

export function Celebrations() {
  return (
    <section>
      <Heading eyebrow="Wedding timeline" title="Our days of joy" sub="Scroll through every chapter of our celebration." />
      <div className="mx-auto mt-12 flex w-[min(90vw,560px)] flex-col gap-20">
        {EVENTS.map((e, i) => (
          <EventCard key={e.id} e={e} i={i} />
        ))}
      </div>
    </section>
  );
}

/* ───────── dress code ───────── */
export function DressCode() {
  return (
    <section>
      <Heading eyebrow="Dress code" title="Wardrobe Planner" sub="A little inspiration for every celebration." />
      <div className="mx-auto mt-10 grid w-[min(90vw,560px)] gap-4">
        {EVENTS.map((e, i) => {
          const [palette, note] = e.dress.split(' · ');
          return (
            <Reveal key={e.id} delay={i * 0.08}>
              <div className="flex items-center gap-5 rounded-2xl border border-[#e6d3b4] bg-white/70 px-5 py-4 shadow-[0_14px_30px_-22px_rgba(90,50,30,0.5)]">
                <div className="flex shrink-0 -space-x-3">
                  {e.swatches.map((c, k) => (
                    <motion.span
                      key={c}
                      className="h-12 w-12 rounded-full ring-2 ring-white"
                      style={{ background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,0.55), transparent 42%), ${c}` }}
                      whileHover={{ y: -4 }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.2 + k * 0.1 }}
                    />
                  ))}
                </div>
                <div className="text-left">
                  <p className="font-script text-3xl leading-none text-[#9c1f45]">{e.name}</p>
                  <p className="caps-label mt-1 text-[0.6rem]! text-[#b8893a]">{palette}</p>
                  <p className="font-serif text-xs text-[#7a6266] italic">{note}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ───────── venue ───────── */
export function Venue() {
  const maps = VENUE.mapsUrl;
  const hasArt = useImage(ART.cover);
  return (
    <section>
      <Heading eyebrow="The venue" title={VENUE.name} sub={VENUE.area} />
      <Reveal className="mx-auto mt-8 w-[min(86vw,480px)]">
        <div className="relative overflow-hidden rounded-t-full rounded-b-2xl border-[1.5px] border-[#c9a24a] p-1.5">
          <div className="aspect-[4/3] overflow-hidden rounded-t-full rounded-b-xl">
            {hasArt ? <img src={ART.cover} alt="Palace by the lake" className="h-full w-full origin-[90%_27%] scale-[2.5] object-cover object-[50%_30%]" /> : <CoverPainting className="h-full w-full" />}
          </div>
        </div>
      </Reveal>
      <Reveal className="mt-7 flex justify-center">
        <a
          href={maps}
          target="_blank"
          rel="noreferrer"
          className="rounded-full bg-[linear-gradient(110deg,#b8893a,#f3d98e_45%,#c99c45)] px-7 py-3 font-sans text-sm font-medium tracking-wide text-[#4a1a24] shadow-[0_10px_24px_-10px_rgba(140,90,20,0.8)]"
        >
          Open live location
        </a>
      </Reveal>
    </section>
  );
}

/* ───────── thank you (bookend over the painting) ───────── */
export function ThankYou() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const zoom = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  return (
    <section ref={ref} className="relative mt-24 min-h-[100svh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale: zoom }}>
        <CoverPainting className="h-full w-full" />
      </motion.div>
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-[#fbf7f1] via-[#fbf7f1]/70 to-transparent" />
      <div className="relative flex min-h-[100svh] flex-col items-center px-6 pt-[4svh] text-center">
        <Reveal className="w-full max-w-[300px] rounded-[1.6rem] bg-[#fffaf4]/88 px-6 py-5 shadow-[0_20px_50px_-25px_rgba(90,40,30,0.6)] ring-1 ring-[#e6d3b4] backdrop-blur-sm">
          <h2 className="font-script text-5xl text-[#9c1f45]">Thank You</h2>
          <p className="mt-2 font-serif text-[0.88rem] leading-relaxed text-[#4a3a3e]">{THANK_YOU}</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <p className="font-script text-2xl text-[#9c1f45]">
              {COUPLE.bride} &amp; {COUPLE.groom}
            </p>
            <WaxSeal className="w-10" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export { Divider };
