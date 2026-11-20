import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Back, Face, PAGES } from './pages';
import { Birds, CoverPainting, Curtains, InvitedFrame, SealButton } from './opening';

const N = PAGES.length;
/** scroll units: 1 to bring the card in over the painted scene, then one per page flip, plus a short tail */
const UNITS = 1 + (N - 1) + 0.35;
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

function useViewport() {
  const [vp, setVp] = useState({ w: 390, h: 844 });
  useLayoutEffect(() => {
    const fit = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, []);
  return vp;
}

/* ───────── one flipping leaf ───────── */
function Leaf({ i, u, active, near }: { i: number; u: MotionValue<number>; active: boolean; near: boolean }) {
  const page = PAGES[i];
  const last = i === N - 1;
  const f = useTransform(u, (v) => (last ? 0 : clamp((v - 1 - i - 0.3) / 0.7)));
  const rotateX = useTransform(f, (x) => x * 178);
  const opacity = useTransform(f, [0, 0.62, 0.95], [1, 1, 0]);
  const shade = useTransform(f, (x) => Math.sin(x * Math.PI) * 0.35);
  return (
    <motion.div
      className="absolute inset-0 [transform-style:preserve-3d]"
      style={{ rotateX, opacity, z: -i * 0.8, transformOrigin: '50% 0%', display: near ? 'block' : 'none', pointerEvents: active ? 'auto' : 'none' }}
    >
      <div className="absolute inset-0 [backface-visibility:hidden]">
        <Face tone={page.tone}>{page.render(active)}</Face>
        <motion.div className="pointer-events-none absolute inset-0 rounded-[2.4cqw] bg-black" style={{ opacity: shade }} />
      </div>
      <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateX(180deg)]">
        <Back />
      </div>
    </motion.div>
  );
}

/* ───────── the scene ───────── */
export function Scene3D({ skip, onOpen }: { skip: boolean; onOpen?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const { w, h } = useViewport();
  const cw = Math.round(Math.min(w * 0.84, 440, (h * 0.8) / 1.42));
  const ch = Math.round(cw * 1.42);

  const [opened, setOpened] = useState(skip);
  const [settled, setSettled] = useState(skip);

  const { scrollYProgress } = useScroll({ target: root, offset: ['start start', 'end end'] });
  const u = useTransform(scrollYProgress, (p) => p * UNITS);
  const e = useTransform(u, (v) => clamp(v));

  const [page, setPage] = useState(0);
  const [intro, setIntro] = useState(true);
  useMotionValueEvent(u, 'change', (v) => {
    setIntro(v < 0.05);
    setPage(Math.min(N - 1, Math.max(0, Math.floor(v - 1 + 0.5))));
  });

  // mouse tilt on desktop
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const sx = useSpring(tx, { stiffness: 60, damping: 14 });
  const sy = useSpring(ty, { stiffness: 60, damping: 14 });

  // painted scene recedes as the card arrives
  const sceneScale = useTransform(e, [0, 1], [1, 1.14]);
  const sceneFilter = useTransform(e, (v) => `blur(${v * 9}px) brightness(${1 - v * 0.5}) saturate(${1 - v * 0.2})`);
  const veil = useTransform(e, [0, 1], [0, 0.45]);
  const openingO = useTransform(e, [0, 0.35], [1, 0]);

  // the card rises from below and tilts upright
  const rigRX = useTransform([e, sy] as MotionValue<number>[], ([v, t]: number[]) => (1 - v) * 55 + t);
  const rigRY = useTransform(sx, (t) => t);
  const cardY = useTransform(e, [0, 1], [h * 0.95, 0]);
  const cardZ = useTransform(e, [0, 1], [-120, 60]);
  const cardO = useTransform(e, [0, 0.2], [0, 1]);
  const shadowO = useTransform(e, [0.4, 1], [0, 1]);

  useEffect(() => {
    // scrolling stays locked until the curtains have been opened
    document.body.style.overflow = opened ? '' : 'hidden';
    if (opened) document.documentElement.classList.add('snap');
    return () => {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('snap');
    };
  }, [opened]);

  useEffect(() => {
    if (skip) setTimeout(() => window.scrollTo({ top: window.innerHeight, behavior: 'instant' as ScrollBehavior }), 80);
  }, [skip]);

  const open = () => {
    if (opened) return;
    setOpened(true);
    onOpen?.();
    setTimeout(() => setSettled(true), 2600);
  };

  const onMove = (ev: React.PointerEvent) => {
    if (ev.pointerType !== 'mouse') return;
    tx.set(((ev.clientX / window.innerWidth) * 2 - 1) * 7);
    ty.set(-((ev.clientY / window.innerHeight) * 2 - 1) * 5);
  };

  const goTo = (k: number) => window.scrollTo({ top: (root.current?.offsetTop ?? 0) + (k + 1) * window.innerHeight, behavior: 'smooth' });

  return (
    <div ref={root} className="relative" style={{ height: `${(UNITS + 1) * 100}svh` }}>
      {/* snap points, one per page */}
      {Array.from({ length: N + 1 }, (_, k) => (
        <div key={k} className="pointer-events-none absolute left-0 h-px w-px [scroll-snap-align:start]" style={{ top: `${k * 100}svh` }} />
      ))}

      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#2a0f18]" style={{ perspective: 1500 }} onPointerMove={onMove}>
        {/* painted scene: blurred fill for wide screens + the sharp portrait */}
        <motion.div className="absolute inset-0" style={{ scale: sceneScale, filter: sceneFilter }}>
          <CoverPainting className="absolute inset-0 scale-110 opacity-70 blur-2xl" />
          <CoverPainting className="absolute inset-y-0 left-1/2 w-full max-w-[calc(100svh*0.68)] -translate-x-1/2 shadow-[0_0_60px_rgba(0,0,0,0.35)]" />
        </motion.div>
        <motion.div className="absolute inset-0 bg-[#1e0710]" style={{ opacity: veil }} />
        {Array.from({ length: 18 }, (_, i) => (
          <span
            key={i}
            className="bokeh absolute rounded-full"
            style={{
              left: `${(i * 41) % 100}%`,
              top: `${(i * 67) % 100}%`,
              width: 4 + (i % 5) * 4,
              height: 4 + (i % 5) * 4,
              animationDelay: `${-i * 1.3}s`,
              animationDuration: `${9 + (i % 6) * 2}s`,
            }}
          />
        ))}

        {/* the 1.mp4-style opening, which fades away as you scroll */}
        <motion.div className="absolute inset-0" style={{ opacity: openingO }}>
          <div className="absolute inset-y-0 left-1/2 w-full max-w-[calc(100svh*0.68)] -translate-x-1/2 overflow-hidden">
            <motion.div
              className="absolute inset-x-0 top-[13svh] z-[1]"
              initial={false}
              animate={opened ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -16, scale: 0.94 }}
              transition={{ duration: 1.2, delay: opened && !skip ? 1.2 : 0 }}
            >
              <InvitedFrame />
            </motion.div>
            <Curtains open={opened} />
            {opened && !skip && <Birds />}
          </div>
        </motion.div>
        <SealButton show={!opened} onOpen={open} />

        {/* the 3D card */}
        <motion.div className="pointer-events-none absolute top-1/2 left-1/2 [transform-style:preserve-3d]" style={{ rotateX: rigRX, rotateY: rigRY }}>
          <motion.div
            className="absolute rounded-[50%] bg-black/50 blur-2xl"
            style={{ width: cw * 1.05, height: ch * 0.2, left: -cw * 0.525, top: ch * 0.44, opacity: shadowO, z: -40 }}
          />
          <motion.div
            className="pointer-events-none absolute [transform-style:preserve-3d]"
            style={{ width: cw, height: ch, left: -cw / 2, top: -ch / 2, y: cardY, z: cardZ, opacity: cardO }}
          >
            {[1, 2, 3, 4].map((k) => (
              <div
                key={k}
                className="pointer-events-none absolute inset-0 rounded-[2.4%] bg-[#e9dcc6] shadow-[0_1px_0_#cdb995]"
                style={{ transform: `translateZ(${-N * 0.8 - k * 1.4}px) translateY(${k * 1.1}px)` }}
              />
            ))}
            {/* reverse DOM order so the top page also wins when the card is briefly flattened by opacity */}
            {PAGES.map((p, i) => ({ p, i }))
              .reverse()
              .map(({ p, i }) => (
                <Leaf key={p.key} i={i} u={u} active={i === page && !intro} near={i >= page - 1 && i <= page + 2} />
              ))}
          </motion.div>
        </motion.div>

        {/* scroll hint once the curtains have opened */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[3svh] z-[6] flex flex-col items-center text-white drop-shadow-[0_2px_6px_rgba(60,0,20,0.6)]"
          initial={false}
          animate={{ opacity: settled && intro ? 1 : 0, y: settled && intro ? 0 : 16 }}
        >
          <p className="rounded-full bg-[#5b0d1f]/55 px-4 py-1.5 font-display text-[0.72rem] tracking-[0.4em] uppercase backdrop-blur-sm">Scroll to open the card</p>
          <motion.span className="mt-1 text-2xl" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            ⌄
          </motion.span>
        </motion.div>

        {/* page rail + counter */}
        <motion.nav className="absolute top-1/2 right-3 z-[6] flex -translate-y-1/2 flex-col gap-2.5 sm:right-6" animate={{ opacity: intro ? 0 : 1 }} aria-label="Pages">
          {PAGES.map((p, i) => (
            <button
              key={p.key}
              onClick={() => goTo(i)}
              aria-label={p.label}
              className={`h-2 w-2 rounded-full border border-[#e7c977]/80 transition-all ${i === page ? 'h-5 bg-[#e7c977]' : 'bg-transparent'}`}
            />
          ))}
        </motion.nav>
        <motion.p
          className="absolute inset-x-0 bottom-[2.5svh] z-[6] text-center font-display text-[0.7rem] tracking-[0.35em] text-[#f3e3c3]/75 uppercase"
          animate={{ opacity: intro ? 0 : 1 }}
        >
          {String(page + 1).padStart(2, '0')} / {String(N).padStart(2, '0')} · {PAGES[page].label}
        </motion.p>
      </div>
    </div>
  );
}
