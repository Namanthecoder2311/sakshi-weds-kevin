// Palace doors → painted couple → (on scroll) the painting shrinks into a palace-arch window
// and “The wedding of Sakshi with Kevin” writes itself in beneath it.
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ART, COUPLE } from './config';
import { Birds, CoverPainting, InvitedFrame, useImage } from './opening';
import { Doors } from './doors';
import { Opening3D, webglAvailable } from './three/Opening3D';
import { LivingPainting } from './three/LivingPainting';
import { GoldSparkles, SkyBirds } from './ambient';
import { Flourish } from './ornaments';

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

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function Hero({ skip, onOpen }: { skip: boolean; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { w, h } = useViewport();
  const hasArt = useImage(ART.cover);
  const [opened, setOpened] = useState(skip);
  const [settled, setSettled] = useState(skip);
  // real-time 3D opening when the device supports it; the CSS doors are the fallback
  const [mode, setMode] = useState<'3d' | 'css'>(() => (!skip && webglAvailable() ? '3d' : 'css'));
  const [revealed, setRevealed] = useState(skip);
  const shown = mode === '3d' ? revealed : opened;
  const [scrolled, setScrolled] = useState(false);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  // k: 0 = full-screen painting, 1 = painting framed in the arch
  const k = useTransform(scrollYProgress, [0, 0.55], [0, 1], { clamp: true });
  const textIn = useTransform(scrollYProgress, [0.45, 0.85], [0, 1], { clamp: true });
  useMotionValueEvent(scrollYProgress, 'change', (v) => setScrolled(v > 0.02));

  // the frame the painting lives in: full stage (capped to a portrait column on wide screens) → arch window
  const stageW = Math.min(w, h * 0.68);
  const archW = Math.min(w * 0.8, 400, h * 0.42);
  const archH = archW * 1.28;
  const archTop = Math.max(h * 0.06, 28);
  const box = (t: number) => ({
    left: lerp((w - stageW) / 2, (w - archW) / 2, t),
    top: lerp(0, archTop, t),
    width: lerp(stageW, archW, t),
    height: lerp(h, archH, t),
    radius: lerp(0, archW / 2, t),
  });
  const left = useTransform(k, (t) => box(t).left);
  const top = useTransform(k, (t) => box(t).top);
  const width = useTransform(k, (t) => box(t).width);
  const height = useTransform(k, (t) => box(t).height);
  const radius = useTransform(k, (t) => `${box(t).radius}px ${box(t).radius}px 14px 14px`);
  const frameO = useTransform(k, [0.75, 1], [0, 1]);
  const openingO = useTransform(k, [0, 0.3], [1, 0]);
  const bgBlurO = useTransform(k, [0, 0.6], [1, 0]);
  const textY = useTransform(textIn, [0, 1], [24, 0]);

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [opened]);

  const open = () => {
    if (opened) return;
    // a little physical "crack" of the seal on phones that support it
    navigator.vibrate?.([18, 40, 60]);
    setOpened(true);
    onOpen();
    if (mode === 'css') setTimeout(() => setSettled(true), 3200);
  };
  const onRevealed = () => {
    setRevealed(true);
    setTimeout(() => setSettled(true), 1400);
  };

  const line = (d: number) => ({ style: { opacity: textIn, y: textY }, transition: { delay: d } });

  return (
    <div ref={ref} className="relative" style={{ height: '260svh' }}>
      {mode === '3d' && !revealed && <Opening3D onOpen={open} onDone={onRevealed} onFail={() => setMode('css')} />}
      <div className="paper sticky top-0 h-[100svh] overflow-hidden">
        {/* wide screens: blurred painting fills the sides while it's full screen */}
        <motion.div className="absolute inset-0" style={{ opacity: bgBlurO }}>
          <CoverPainting className="absolute inset-0 scale-110 blur-2xl brightness-90" />
        </motion.div>

        {/* the painting itself */}
        <motion.div
          className="absolute overflow-hidden shadow-[0_24px_60px_-20px_rgba(90,40,30,0.55)]"
          style={{ left, top, width, height, borderTopLeftRadius: radius, borderTopRightRadius: radius, borderRadius: radius }}
        >
          {/* camera push-in: the painting glides forward as the doors open */}
          <motion.div
            className="h-full w-full"
            initial={false}
            animate={opened ? { scale: 1, filter: 'brightness(1) blur(0px)' } : { scale: 1.32, filter: 'brightness(0.55) blur(2px)' }}
            transition={{ duration: skip ? 0 : 3, ease: [0.25, 0.1, 0.2, 1], delay: opened && !skip ? 0.5 : 0 }}
          >
            {hasArt ? (
              <LivingPainting className="h-full w-full" />
            ) : (
              <CoverPainting className="h-full w-full" />
            )}
          </motion.div>
          {shown && (
            <>
              <SkyBirds />
              <GoldSparkles />
            </>
          )}
          {/* the 1.mp4 opening, which fades out as the painting is framed */}
          <motion.div className="absolute inset-0" style={{ opacity: openingO }}>
            <motion.div
              className="absolute inset-x-0 top-[13svh] z-[1]"
              initial={false}
              animate={shown ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -16, scale: 0.94 }}
              transition={{ duration: 1.2, delay: shown && !skip ? (mode === '3d' ? 0.2 : 2) : 0 }}
            >
              <motion.div animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}>
                <InvitedFrame />
              </motion.div>
            </motion.div>
            {mode === 'css' && <Doors open={opened} onOpen={open} skip={skip} />}
            {shown && !skip && <Birds />}
          </motion.div>
        </motion.div>

        {/* gold arch outline once framed */}
        <motion.div
          className="pointer-events-none absolute border-[1.5px] border-[#c9a24a]"
          style={{ left, top, width, height, borderRadius: radius, opacity: frameO, scale: 1.035 }}
        />


        {/* names appear beneath the arch */}
        <div className="absolute inset-x-0 px-6 text-center" style={{ top: archTop + archH + h * 0.025 }}>
          <motion.p className="caps-label text-[#8c6a3a]" {...line(0)}>
            The wedding of
          </motion.p>
          <motion.h1 className="mt-1 font-script text-[clamp(3.2rem,13vw,4.6rem)] leading-[1] text-[#9c1f45]" {...line(0.1)}>
            {COUPLE.bride}
            <span className="mx-3 align-middle font-script text-[0.42em] text-[#b8893a]">with</span>
            {COUPLE.groom}
          </motion.h1>
          <motion.div style={{ opacity: textIn }}>
            <Flourish className="mx-auto mt-2 w-40" />
          </motion.div>
        </div>

        {/* scroll hint after the curtains open */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-[3svh] z-[6] flex flex-col items-center text-white"
          initial={false}
          animate={{ opacity: settled && !scrolled ? 1 : 0, y: settled && !scrolled ? 0 : 14 }}
        >
          <p className="rounded-full bg-[#5b0d1f]/60 px-4 py-1.5 font-display text-[0.72rem] tracking-[0.4em] uppercase backdrop-blur-sm">Scroll down</p>
          <motion.span className="mt-1 text-2xl drop-shadow" animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            ⌄
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}
