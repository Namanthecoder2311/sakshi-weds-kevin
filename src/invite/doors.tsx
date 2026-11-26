// The opening: closed royal palace doors in maroon velvet & gold zardozi.
// Tap → the wax seal cracks in two (each half stays on its own door) → the doors swing open in 3D,
// golden light pours through the gap and gold dust bursts out.
import { AnimatePresence, motion } from 'framer-motion';
import { COUPLE } from './config';
import { GuestPlaque } from './GuestPlaque';
import { Mandala, WaxSeal } from './ornaments';

const EASE = [0.4, 0.05, 0.3, 1] as const;

const damask = `url("data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='64'><g fill='rgba(0,0,0,0.22)'><path d='M24 6 C30 14 30 22 24 30 C18 22 18 14 24 6Z'/><path d='M24 30 C34 32 40 40 38 50 C32 44 28 40 24 30Z'/><path d='M24 30 C14 32 8 40 10 50 C16 44 20 40 24 30Z'/><circle cx='24' cy='56' r='2'/><circle cx='0' cy='30' r='1.6'/><circle cx='48' cy='30' r='1.6'/></g></svg>`,
)}")`;

const noise = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const zari = 'linear-gradient(90deg, #6e4b14, #e9c977 20%, #fff0c2 32%, #c99c45 50%, #7a5418 66%, #e3bd6c 82%, #6e4b14)';

function Knocker({ side }: { side: string }) {
  return (
    <svg viewBox="0 0 60 80" className="w-full drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]" aria-hidden>
      <defs>
        <linearGradient id={`brass-${side}`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#fff0c2" />
          <stop offset="0.35" stopColor="#d8b25e" />
          <stop offset="0.7" stopColor="#8a6420" />
          <stop offset="1" stopColor="#e3bd6c" />
        </linearGradient>
      </defs>
      {/* rosette mount */}
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx="30" cy="10" rx="4" ry="9" fill={`url(#brass-${side})`} transform={`rotate(${i * 45} 30 18)`} />
      ))}
      <circle cx="30" cy="18" r="7" fill={`url(#brass-${side})`} stroke="#6e4b14" strokeWidth="0.8" />
      {/* ring */}
      <circle cx="30" cy="48" r="20" fill="none" stroke={`url(#brass-${side})`} strokeWidth="6" />
      <circle cx="30" cy="48" r="20" fill="none" stroke="#5a3d0e" strokeWidth="0.8" opacity="0.6" />
      <path d="M30 24 v6" stroke={`url(#brass-${side})`} strokeWidth="5" />
    </svg>
  );
}

/** The ornamented outer face of one door. */
function DoorFace({ side }: { side: 'left' | 'right' }) {
  const inner = side === 'left' ? 'right' : 'left';
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: 'hidden' }}>
      {/* velvet + damask + texture + light falling from the gap */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#5a0c1d',
          backgroundImage: [
            `linear-gradient(${side === 'left' ? '90deg' : '270deg'}, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.12) 55%, rgba(255,210,150,0.10) 100%)`,
            'linear-gradient(180deg, rgba(0,0,0,0.35), transparent 22%, transparent 78%, rgba(0,0,0,0.4))',
            noise,
            damask,
            'radial-gradient(120% 80% at 50% 45%, #8e2238, #5a0c1d 70%, #3c0714)',
          ].join(', '),
          backgroundSize: 'auto, auto, 160px 160px, 48px 64px, auto',
          backgroundBlendMode: 'normal, normal, overlay, normal, normal',
        }}
      />
      {/* gold frame */}
      <div className="absolute inset-[4.5%] rounded-md border-2 border-[#d6ad5c]/90 shadow-[inset_0_0_0_3px_rgba(90,12,29,0.9),inset_0_0_0_4px_rgba(214,173,92,0.55)]" />
      {/* upper jharokha arch panel */}
      <div className="absolute inset-x-[16%] top-[10%] h-[30%] rounded-t-full border-[1.5px] border-[#d6ad5c]/85 shadow-[inset_0_0_30px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-[7%] rounded-t-full border border-[#d6ad5c]/50" />
        <Mandala className="absolute bottom-[8%] left-1/2 w-[70%] -translate-x-1/2 opacity-90" />
      </div>
      {/* lower panel with medallion */}
      <div className="absolute inset-x-[16%] top-[46%] bottom-[10%] rounded-md border-[1.5px] border-[#d6ad5c]/85 shadow-[inset_0_0_30px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-[5%] rounded border border-[#d6ad5c]/45" />
        <Mandala className="absolute top-1/2 left-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2" />
      </div>
      {/* zari strip on the meeting edge */}
      <div className="absolute inset-y-0 w-[2.2%]" style={{ [inner]: 0, background: zari }} />
      {/* brass knocker near the seam */}
      <div className="absolute top-[32%] z-[1] w-[21%]" style={{ [inner]: '6%' }}>
        <Knocker side={side} />
      </div>
    </div>
  );
}

/** Ivory silk lining, seen as the door swings. */
function DoorBack() {
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#d9c9a6,#f6eedc_50%,#d9c9a6)]" />
      <div className="absolute inset-[5%] rounded-md border border-[#b8893a]/70" />
    </div>
  );
}

function Door({ side, open }: { side: 'left' | 'right'; open: boolean }) {
  const left = side === 'left';
  return (
    <motion.div
      className={`absolute top-0 h-full w-1/2 ${left ? 'left-0' : 'right-0'}`}
      style={{ transformStyle: 'preserve-3d', transformOrigin: left ? '0% 50%' : '100% 50%' }}
      initial={false}
      animate={{ rotateY: open ? (left ? -108 : 108) : 0 }}
      transition={{ duration: 2.6, ease: EASE, delay: open ? 0.4 : 0 }}
    >
      <DoorFace side={side} />
      <DoorBack />
      {/* door thickness along the meeting edge */}
      <div
        className="absolute inset-y-0 w-[10px] bg-[linear-gradient(90deg,#3c0714,#7a5418,#3c0714)]"
        style={{ [left ? 'right' : 'left']: -5, transform: 'rotateY(90deg)' }}
      />
      {/* this door's half of the wax seal */}
      <motion.div
        className="absolute top-1/2 z-10 w-[clamp(92px,26vw,132px)]"
        style={{ [left ? 'right' : 'left']: 'calc(clamp(92px,26vw,132px) / -2)', y: '-50%', clipPath: left ? 'inset(0 50% 0 0)' : 'inset(0 0 0 50%)' }}
        initial={false}
        animate={open ? { x: left ? -6 : 6, rotate: left ? -8 : 8 } : { x: 0, rotate: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        <WaxSeal tone="gold" className="w-full drop-shadow-[0_10px_14px_rgba(0,0,0,0.55)]" />
      </motion.div>
    </motion.div>
  );
}

function GoldDust() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[4]" aria-hidden>
      {Array.from({ length: 42 }, (_, i) => {
        const a = (i / 42) * Math.PI * 2 + (i % 3) * 0.2;
        const d = 120 + ((i * 53) % 220);
        return (
          <motion.span
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: 3 + (i % 4),
              height: 3 + (i % 4),
              background: i % 5 ? 'radial-gradient(circle,#fff6d6,#e7c977 60%,transparent 70%)' : 'radial-gradient(circle,#fff,#f4b6c8 60%,transparent 70%)',
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d * 1.3 - 40, opacity: [0, 1, 0], scale: [0.4, 1.2, 0.6] }}
            transition={{ duration: 2.4, delay: 0.55 + (i % 7) * 0.05, ease: 'easeOut' }}
          />
        );
      })}
    </div>
  );
}

export function Doors({ open, onOpen, skip }: { open: boolean; onOpen: () => void; skip: boolean }) {
  return (
    <div className="absolute inset-0 z-[2]" style={{ perspective: 1400 }}>
      {/* light pouring through the gap */}
      <motion.div
        className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2"
        style={{ background: 'radial-gradient(50% 60% at 50% 50%, rgba(255,236,190,0.95), rgba(255,214,140,0.45) 45%, transparent 75%)', mixBlendMode: 'screen' }}
        initial={false}
        animate={open ? { width: ['0%', '70%', '120%'], opacity: [0, 1, 0] } : { width: '0%', opacity: 0 }}
        transition={{ duration: 2.2, delay: 0.4, ease: 'easeOut' }}
      />
      <Door side="left" open={open} />
      <Door side="right" open={open} />
      {open && !skip && <GoldDust />}

      {/* ribbon + call to action on the closed doors */}
      <AnimatePresence>
        {!open && (
          <motion.div className="absolute inset-0 z-[5]" exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
            <div className="absolute inset-x-[8%] top-[4.5%] flex flex-col items-center text-center">
              <p className="rounded-full border border-[#d6ad5c]/70 bg-[#3c0714]/70 px-5 py-1.5 font-deva text-[clamp(0.95rem,4vw,1.3rem)] text-[#f3d98e] shadow-[0_6px_16px_rgba(0,0,0,0.4)] backdrop-blur-sm">
                ॥ श्री गणेशाय नमः ॥
              </p>
              <GuestPlaque />
            </div>
            {/* invisible hit area over the seal */}
            <button
              onClick={onOpen}
              aria-label="Open the invitation"
              className="absolute top-1/2 left-1/2 h-[clamp(92px,26vw,132px)] w-[clamp(92px,26vw,132px)] -translate-x-1/2 -translate-y-1/2 rounded-full"
            >
              <motion.span
                className="absolute inset-[-14%] rounded-full border-2 border-[#f3d98e]/70"
                animate={{ scale: [1, 1.25], opacity: [0.8, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
              />
            </button>
            <div className="absolute inset-x-0 top-[calc(50%+clamp(60px,16vw,84px))] flex flex-col items-center">
              <button
                onClick={onOpen}
                className="rounded-full bg-[#fffaf2]/95 px-7 py-2.5 font-script text-[clamp(1.5rem,6vw,2rem)] leading-none text-[#4a1a24] shadow-[0_10px_26px_rgba(0,0,0,0.45)]"
              >
                Open the invitation
              </button>
              <p className="mt-3 font-display text-[0.7rem] tracking-[0.4em] text-[#f3d98e]/85 uppercase">
                {COUPLE.bride} &amp; {COUPLE.groom}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
