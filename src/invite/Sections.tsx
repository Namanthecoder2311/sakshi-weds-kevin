// The scrolling invitation (reel-1 style), using the painted artwork.
import { motion, useScroll, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useEffect, useRef, useState } from 'react';
import { ART, BIDAAI_QUOTE, COUPLE, EVENTS, GANESH_VERSE, GREETING, HOME_VENUE, INVOCATIONS, THANK_YOU, VENUE, WEDDING_DAY, WELCOME, type EventItem } from './config';
import { EventIcon, Flourish, WaxSeal } from './ornaments';
import { CoverPainting, useImage } from './opening';
import { Scratch } from './Scratch';
import { GUEST } from './guest';
import { LanternButton, WishLanterns, useLanterns } from './Lanterns';

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
      {sub && <p className="mt-1 font-serif font-medium text-[1.02rem] text-[#5f4045] italic">{sub}</p>}
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

/* ───────── printed-card styling (ivory paper, gold double border, corner ornaments) ───────── */
function Corner({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 44 44" className={`pointer-events-none absolute w-9 sm:w-11 ${className}`} aria-hidden>
      <path d="M3 41 V12 Q3 3 12 3 H41" fill="none" stroke="#c9a24a" strokeWidth="1.3" />
      <path d="M8.5 33 V15 Q8.5 8.5 15 8.5 H33" fill="none" stroke="#c9a24a" strokeWidth="0.8" opacity="0.7" />
      <path d="M14 14 q5 -1 6 4 q-5 1 -6 -4z" fill="#d9b25e" />
      <circle cx="14" cy="14" r="1.8" fill="#9c1f45" />
    </svg>
  );
}

function PaperCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <Reveal className={`mx-auto w-[min(94vw,740px)] ${className}`}>
      <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,#fffdf8,#fbf2e2)] p-1.5 shadow-[0_30px_70px_-35px_rgba(90,45,25,0.55)] ring-1 ring-[#e3cfa6] sm:p-2">
        <div className="relative rounded-[1.4rem] border border-[#d6b46a] px-4 py-8 text-center sm:px-10 sm:py-11">
          <Corner className="top-1.5 left-1.5" />
          <Corner className="top-1.5 right-1.5 -scale-x-100" />
          <Corner className="bottom-1.5 left-1.5 -scale-y-100" />
          <Corner className="right-1.5 bottom-1.5 -scale-100" />
          {children}
        </div>
      </div>
    </Reveal>
  );
}

function TitleBar({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`mx-auto w-fit rounded-md bg-[#f1e0c6] px-5 py-1.5 font-display text-[1rem] font-bold text-[#4a2a22] shadow-[0_6px_14px_-10px_rgba(90,50,30,0.6)] sm:px-8 sm:text-[1.15rem] ${className}`}>
      {children}
    </p>
  );
}

function SmallFlourish() {
  return (
    <div className="my-6 flex items-center justify-center gap-3 text-[#c9a24a]" aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#c9a24a]" />
      <span className="text-sm">✦</span>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#c9a24a]" />
    </div>
  );
}

/* ───────── the family card (English version of the printed Gujarati card) ───────── */
function FamilyLines({ lines }: { lines: string[] }) {
  return (
    <div className="space-y-0.5">
      {lines.map((l) => (
        <p key={l} className="font-serif text-[0.97rem] font-semibold text-[#4a2a30] sm:text-[1.03rem]">
          {l}
        </p>
      ))}
    </div>
  );
}

function ChiName({ name }: { name: string }) {
  return (
    <div className="flex flex-col items-center sm:flex-row sm:items-baseline sm:justify-center sm:gap-1.5">
      <span className="font-display text-base font-bold text-[#9a6c22] sm:text-lg">Chi.</span>
      <span className="font-script text-[2.5rem] leading-none text-[#9c1f45] sm:text-[3.2rem]">{name}</span>
    </div>
  );
}

export function Families() {
  const [gauri, riddhi] = GANESH_VERSE;
  return (
    <section>
      <PaperCard>
        {/* Shree Ganesh, from the printed card */}
        <div className="relative mx-auto mb-4 w-fit">
          <div className="absolute inset-[-18%] rounded-full bg-[radial-gradient(closest-side,rgba(243,210,130,0.55),rgba(243,210,130,0))]" aria-hidden />
          <motion.img
            src={ART.ganesh}
            alt="Shree Ganesh"
            className="relative w-[clamp(96px,28vw,128px)] drop-shadow-[0_8px_12px_rgba(120,70,20,0.25)]"
            initial={{ opacity: 0, scale: 0.85, y: 10 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.2, 0.7, 0.2, 1] }}
          />
        </div>
        {/* three invocations */}
        <div className="flex flex-col items-center gap-1 sm:grid sm:grid-cols-3 sm:items-start sm:gap-2">
          {INVOCATIONS.map((t) => (
            <p key={t} className="font-display text-[0.92rem] leading-tight font-bold text-[#8e2440] sm:text-[1.1rem]">
              ॥ {t} ॥
            </p>
          ))}
        </div>

        {/* verse in two halves, like the printed card */}
        <div className="mt-6 grid grid-cols-2 items-center gap-x-3 gap-y-4 font-display text-[1.08rem] leading-snug font-semibold text-[#4e2b24] italic sm:gap-x-10 sm:text-[1.12rem]">
          <div className="order-1 sm:order-3 sm:text-left">
            {gauri.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
          <div className="order-2 sm:order-1 sm:text-right">
            {riddhi.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>

        <p className="mx-auto mt-7 max-w-md font-display text-[1.35rem] leading-snug font-semibold text-[#9c1f45] italic sm:text-[1.6rem]">
          “Two hearts found their way to each other, and now begins a journey of …… Forever”
        </p>

        <SmallFlourish />

        {/* “Snehi Swajan Shree ……” */}
        <p className="font-display text-[1.25rem] font-semibold text-[#4a2a30] sm:text-[1.4rem]">
          Dear{' '}
          <span className="border-b border-dotted border-[#b8893a] px-2 font-script text-[1.9rem] leading-none text-[#9c1f45] sm:text-[2.2rem]">
            {GUEST || 'beloved family & friends'}
          </span>
          ,
        </p>
        <p className="mt-4 font-serif font-medium text-[1.03rem] text-[#3f2a2e] sm:text-[1.08rem]">{GREETING}</p>
        <p className="mx-auto mt-3 max-w-lg font-serif font-medium text-[1rem] leading-relaxed text-[#5a3940] italic sm:text-[1.05rem]">“{BIDAAI_QUOTE}”</p>

        <SmallFlourish />

        {/* bride’s family above, names side by side, groom’s family below */}
        <FamilyLines lines={COUPLE.brideFamily} />
        <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <ChiName name={COUPLE.bride} />
          <p className="font-display text-[1.05rem] leading-tight font-bold tracking-wide text-[#a0701f] uppercase sm:text-[1.25rem]">Shubh<br />Lagna</p>
          <ChiName name={COUPLE.groom} />
        </div>
        <FamilyLines lines={COUPLE.groomFamily} />
      </PaperCard>
    </section>
  );
}

/* ───────── wedding-day programme + venue ───────── */
export function WeddingDay() {
  return (
    <section>
      <Heading eyebrow="Shubh Lagna" title="The Wedding Day" rose />
      <PaperCard className="mt-8">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
          {WEDDING_DAY.map((e, i) => (
            <motion.div
              key={e.name}
              className="flex flex-col items-center justify-between rounded-2xl bg-[#fbf0dc]/80 px-2 py-4 ring-1 ring-[#ead6ae]"
              initial={{ opacity: 0, y: 16, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.12 }}
            >
              <span className="text-2xl" aria-hidden>{e.icon}</span>
              <p className="mt-1 font-script text-[1.8rem] leading-[1.05] text-[#4a2230]">{e.name}</p>
              <p className="mt-1 font-serif font-medium text-[0.84rem] leading-snug text-[#5f4045] italic">{e.meaning}</p>
              <p className="mt-2.5 rounded-full bg-[#9c1f45] px-3 py-1 font-sans text-[0.85rem] font-semibold text-white shadow-[0_6px_14px_-8px_rgba(156,31,69,0.9)]">{e.time}</p>
            </motion.div>
          ))}
        </div>

        <TitleBar className="mt-8">Shubh Lagna Sthal · Wedding Venue</TitleBar>
        <p className="mt-3 font-script text-[2.2rem] leading-none text-[#9c1f45]">{VENUE.name}</p>
        <p className="mx-auto mt-2 max-w-md font-serif font-medium text-[1.02rem] leading-relaxed text-[#33242a]">{VENUE.address}</p>
        <p className="mt-3 font-serif text-[1.02rem] font-bold text-[#4a2a30]">🚗 {VENUE.note}</p>
        <a
          href={VENUE.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-[linear-gradient(110deg,#b8893a,#f3d98e_45%,#c99c45)] px-7 py-3 font-sans text-[0.95rem] font-semibold tracking-wide text-[#4a1a24] shadow-[0_10px_24px_-10px_rgba(140,90,20,0.8)] transition-transform active:scale-95"
        >
          <span aria-hidden>📍</span> Open live location
        </a>
      </PaperCard>
    </section>
  );
}

/* ───────── family who welcome you ───────── */
export function Welcome() {
  return (
    <section>
      <Heading eyebrow="With love & respect" title="Aavkaar" sub="The families who await you" />
      <PaperCard className="mt-8">
        <TitleBar>{WELCOME.hostsTitle}</TitleBar>
        <div className="mt-4 space-y-1 font-serif font-medium text-[1.02rem] text-[#33242a] sm:text-[1.06rem]">
          {WELCOME.hosts.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
        <p className="mt-3 font-serif text-[1.02rem] font-bold text-[#4a2a30] sm:text-[1.06rem]">{WELCOME.hostsClosing}</p>

        <TitleBar className="mt-9">{WELCOME.eagerTitle}</TitleBar>
        <div className="mt-4 grid gap-x-8 gap-y-1 font-serif font-medium text-[1rem] text-[#33242a] sm:grid-cols-2 sm:text-left sm:text-[1.03rem]">
          {WELCOME.eager.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>

        <SmallFlourish />

        <p className="caps-label text-[0.72rem]! text-[#9a6c22]">A little request from the bride’s siblings</p>
        <p className="mt-2 font-display text-[1.4rem] leading-snug font-bold text-[#9c1f45] italic sm:text-[1.65rem]">“{WELCOME.kidsLine}” 😄</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {WELCOME.kids.map((k, i) => (
            <motion.span
              key={`${k}-${i}`}
              className="rounded-full border border-[#ecc9d3] bg-[#fdf1f4] px-3 py-1 font-sans text-[0.9rem] text-[#7c2a40]"
              initial={{ opacity: 0, scale: 0.6, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 260, damping: 15, delay: 0.15 + i * 0.05 }}
            >
              {k}
            </motion.span>
          ))}
        </div>

        <SmallFlourish />

        <p className="title-rose font-script text-[clamp(2.4rem,10vw,3.2rem)] leading-tight text-[#9c1f45]">“{WELCOME.presence}”</p>
      </PaperCard>
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
      <Reveal className="mx-auto max-w-xs px-6 text-center font-display text-[1.3rem] leading-snug font-semibold text-[#3f2a2e] italic">
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
        <div className="mt-3 space-y-1 font-sans text-[0.97rem] text-[#33242a]">
          <p>
            <span className="text-[#9a6c22]">✦</span> {e.day} &nbsp;·&nbsp; {e.time}
          </p>
          <p>
            <span className="text-[#9a6c22]">⌖</span> {e.place}
          </p>
          {e.mapsUrl && (
            <a
              href={e.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#c9a24a] bg-white/70 px-4 py-1.5 font-sans text-[0.85rem] font-semibold text-[#6b3a1c]"
            >
              <span aria-hidden>📍</span> Location
            </a>
          )}
        </div>
        <p className="mt-3 font-serif font-medium text-[1.03rem] text-[#5a3940] italic">{e.line}</p>
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
                  <p className="caps-label mt-1 text-[0.7rem]! text-[#9a6c22]">{palette}</p>
                  <p className="font-serif font-medium text-sm text-[#5a3940] italic">{note}</p>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ───────── how to reach: live map, wedding venue or home ───────── */
const PLACES = [
  { id: 'wedding', tab: 'Wedding', title: VENUE.name, lines: [VENUE.address], embed: VENUE.embedUrl, maps: VENUE.mapsUrl },
  { id: 'home', tab: 'Haldi · Samota · Mehendi', title: HOME_VENUE.name, lines: [HOME_VENUE.label, HOME_VENUE.address, HOME_VENUE.landmark], embed: HOME_VENUE.embedUrl, maps: HOME_VENUE.mapsUrl },
] as const;

export function Venue() {
  const [which, setWhich] = useState(0);
  const p = PLACES[which];
  return (
    <section>
      <Heading eyebrow="Find your way" title="How to Reach" sub="Tap a celebration to see its map" />
      <Reveal className="mt-6 flex justify-center">
        <div className="flex rounded-full bg-[#f1e0c6] p-1 shadow-inner">
          {PLACES.map((x, k) => (
            <button
              key={x.id}
              onClick={() => setWhich(k)}
              className={`rounded-full px-5 py-2 font-sans text-[0.92rem] font-semibold transition-all ${k === which ? 'bg-[#9c1f45] text-white shadow-[0_6px_14px_-6px_rgba(156,31,69,0.9)]' : 'text-[#6b3a1c]'}`}
            >
              {x.tab}
            </button>
          ))}
        </div>
      </Reveal>
      <Reveal className="mx-auto mt-6 w-[min(90vw,560px)]">
        <div className="rounded-[1.6rem] bg-[linear-gradient(160deg,#f3dfae,#c99c45_50%,#e9c977)] p-[5px] shadow-[0_30px_60px_-30px_rgba(80,40,20,0.7)]">
          <div className="relative overflow-hidden rounded-[1.3rem] bg-[#efe6d6]">
            <iframe key={p.id} title={`Map to ${p.title}`} src={p.embed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="block aspect-[4/3.4] w-full border-0" />
          </div>
        </div>
      </Reveal>
      <div className="mx-auto mt-5 max-w-md px-6 text-center">
        <p className="font-script text-[2.2rem] leading-none text-[#9c1f45]">{p.title}</p>
        {p.lines.map((l, k) => (
          <p key={l} className={`mt-1.5 font-serif text-[1rem] leading-relaxed text-[#33242a] ${k === p.lines.length - 1 && p.id === 'home' ? 'font-bold' : 'font-medium'}`}>
            {l}
          </p>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <a
          href={p.maps}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(110deg,#b8893a,#f3d98e_45%,#c99c45)] px-7 py-3 font-sans text-[0.95rem] font-semibold tracking-wide text-[#4a1a24] shadow-[0_10px_24px_-10px_rgba(140,90,20,0.8)] transition-transform active:scale-95"
        >
          <span aria-hidden>🧭</span> Get directions
        </a>
      </div>
    </section>
  );
}

/* ───────── thank you (bookend over the painting) ───────── */
export function ThankYou() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const zoom = useTransform(scrollYProgress, [0, 1], [1.2, 1]);
  const { launches, launch, launched } = useLanterns();
  return (
    <section ref={ref} className="relative mt-24 min-h-[100svh] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale: zoom }}>
        <CoverPainting className="h-full w-full" />
      </motion.div>
      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-[#fbf7f1] via-[#fbf7f1]/70 to-transparent" />
      <WishLanterns launches={launches} />
      <div className="relative flex min-h-[100svh] flex-col items-center px-6 pt-[4svh] text-center">
        <Reveal className="w-full max-w-[300px] rounded-[1.6rem] bg-[#fffaf4]/88 px-6 py-5 shadow-[0_20px_50px_-25px_rgba(90,40,30,0.6)] ring-1 ring-[#e6d3b4] backdrop-blur-sm">
          <h2 className="font-script text-5xl text-[#9c1f45]">Thank You</h2>
          {GUEST && <p className="mt-1 font-serif font-medium text-[1.03rem] text-[#5a3940] italic">Dear {GUEST},</p>}
          <p className="mt-2 font-serif font-medium text-[0.98rem] leading-relaxed text-[#33242a]">{THANK_YOU}</p>
          <div className="mt-3 flex items-center justify-center gap-3">
            <p className="font-script text-2xl text-[#9c1f45]">
              {COUPLE.bride} &amp; {COUPLE.groom}
            </p>
            <WaxSeal className="w-10" />
          </div>
        </Reveal>
        <LanternButton onLaunch={launch} launched={launched} />
      </div>
    </section>
  );
}

export { Divider };
