// Realistic fabric curtains: irregular folds, velvet/silk shading, gold zari border,
// embroidered buti, swagged valance with fringe, and a curved tie-back drape when opened.
import { motion } from 'framer-motion';
import { CURTAIN } from './config';

type Theme = {
  crease: string;
  mid: string;
  hi: string;
  valTop: string;
  valBottom: string;
  buti: string; // embroidery colour (with alpha)
  noise: number; // texture strength
  sheen: number;
};

export const CURTAIN_THEMES: Record<'wine' | 'ivory' | 'emerald', Theme> = {
  wine: { crease: '#24030b', mid: '#5a0c1d', hi: '#8f2740', valTop: '#3d0612', valBottom: '#6f1428', buti: 'rgba(222,184,98,0.32)', noise: 0.38, sheen: 0.16 },
  ivory: { crease: '#a8916c', mid: '#e4d6bb', hi: '#fbf5e8', valTop: '#cdb892', valBottom: '#efe4cd', buti: 'rgba(176,132,52,0.38)', noise: 0.18, sheen: 0.35 },
  emerald: { crease: '#01140e', mid: '#0a4434', hi: '#20745a', valTop: '#032a1f', valBottom: '#0d523e', buti: 'rgba(222,184,98,0.3)', noise: 0.36, sheen: 0.14 },
};

function theme(): Theme {
  const q = typeof location !== 'undefined' ? new URLSearchParams(location.search).get('curtain') : null;
  return CURTAIN_THEMES[(q as keyof typeof CURTAIN_THEMES) ?? CURTAIN] ?? CURTAIN_THEMES[CURTAIN];
}

const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const mix = (a: number[], b: number[], t: number) => a.map((v, i) => Math.round(v + (b[i] - v) * t));

/** Organic folds: layered sine waves of light and shadow sampled into one gradient. */
function folds(t: Theme, seed: number) {
  const [c, m, h] = [hex(t.crease), hex(t.mid), hex(t.hi)];
  const stops: string[] = [];
  for (let x = 0; x <= 100; x += 0.5) {
    const r = x / 100;
    const v =
      0.55 * Math.sin(2 * Math.PI * (r * 7.3 + seed * 0.13)) +
      0.3 * Math.sin(2 * Math.PI * (r * 13.1 + seed * 0.29) + 1.3) +
      0.15 * Math.sin(2 * Math.PI * (r * 23.7 + seed * 0.07) + 0.4);
    const s = Math.max(0, Math.min(1, 0.5 + v * 0.62)); // 0 = deep crease, 1 = lit ridge
    const rgb = s < 0.55 ? mix(c, m, s / 0.55) : mix(m, h, Math.pow((s - 0.55) / 0.45, 1.6));
    stops.push(`rgb(${rgb.join(',')}) ${x}%`);
  }
  return `linear-gradient(90deg, ${stops.join(', ')})`;
}

const noise = (a: number) =>
  `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${a} 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

const butiSvg = (c: string) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='70' height='96'><g fill='${c}'><g transform='translate(17 24) scale(0.75)'>${[0, 60, 120, 180, 240, 300]
      .map((a) => `<ellipse rx='1.6' ry='3.6' cy='-4' transform='rotate(${a})'/>`)
      .join('')}<circle r='1.4'/></g><g transform='translate(52 72) scale(0.75)'>${[0, 60, 120, 180, 240, 300]
      .map((a) => `<ellipse rx='1.6' ry='3.6' cy='-4' transform='rotate(${a})'/>`)
      .join('')}<circle r='1.4'/></g><circle cx='52' cy='24' r='0.7'/><circle cx='17' cy='72' r='0.7'/></g></svg>`,
  )}")`;

const zari =
  'linear-gradient(90deg, #7a5418 0%, #e9c977 14%, #fff0c2 22%, #c99c45 32%, #7a5418 40%, #d8b25e 52%, #fbe7a8 60%, #b48a3a 72%, #6e4b14 82%, #d6ad5c 92%, #7a5418 100%)';

// curved drape: x(y) of the inner edge, as % of the panel width
const SAMPLES = Array.from({ length: 14 }, (_, k) => k / 13);
function innerEdge(y: number) {
  const tie = 0.6;
  if (y <= tie) {
    const s = y / tie;
    return 100 - (100 - 34) * (s * s * (3 - 2 * s)); // ease into the tie-back
  }
  const s = (y - tie) / (1 - tie);
  return 34 + (78 - 34) * Math.pow(s, 1.4); // flare to the floor
}
const polygon = (side: 'left' | 'right', open: boolean) => {
  const pts = SAMPLES.map((y) => {
    const x = open ? innerEdge(y) : 100;
    return side === 'left' ? `${x.toFixed(2)}% ${(y * 100).toFixed(2)}%` : `${(100 - x).toFixed(2)}% ${(y * 100).toFixed(2)}%`;
  });
  return side === 'left' ? `polygon(0% 0%, ${pts.join(', ')}, 0% 100%)` : `polygon(100% 0%, ${pts.join(', ')}, 100% 100%)`;
};

function Panel({ side, open, t }: { side: 'left' | 'right'; open: boolean; t: Theme }) {
  const left = side === 'left';
  return (
    <motion.div
      className={`absolute top-0 h-full w-1/2 ${left ? 'left-0' : 'right-0'}`}
      style={{ transformOrigin: left ? '0% 0%' : '100% 0%', filter: 'drop-shadow(0 0 18px rgba(0,0,0,0.45))' }}
      initial={false}
      animate={open ? { clipPath: polygon(side, true), scaleX: 0.36 } : { clipPath: polygon(side, false), scaleX: 1 }}
      transition={{ duration: 2.3, ease: [0.6, 0, 0.2, 1] }}
    >
      <div className={`absolute inset-0 ${open ? '' : 'curtain-sway'}`} style={{ transformOrigin: left ? '0% 0%' : '100% 0%' }}>
        {/* fabric: folds + embroidery + texture + top/bottom light */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: [
              'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 16%, rgba(255,255,255,0.03) 55%, rgba(0,0,0,0.35) 100%)',
              butiSvg(t.buti),
              noise(t.noise),
              folds(t, left ? 3 : 7),
            ].join(', '),
            backgroundSize: 'auto, 70px 96px, 180px 180px, auto',
            backgroundBlendMode: 'normal, normal, overlay, normal',
          }}
        />
        {/* soft moving sheen */}
        <div className="curtain-sheen absolute inset-0" style={{ opacity: t.sheen }} />
        {/* gold zari border on the inner edge + embroidered hem */}
        <div
          className="absolute inset-y-0 w-[7%]"
          style={{ [left ? 'right' : 'left']: 0, backgroundImage: `${butiSvg('rgba(110,70,15,0.6)')}, ${zari}`, backgroundSize: '70px 96px, 100% 100%', boxShadow: 'inset 0 0 6px rgba(0,0,0,0.35)' }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[3.2%]" style={{ backgroundImage: zari.replace('90deg', '180deg'), boxShadow: '0 -2px 6px rgba(0,0,0,0.3)' }} />
      </div>
    </motion.div>
  );
}

function Tieback({ side }: { side: 'left' | 'right' }) {
  // gathered point: 34% of the panel × 0.36 scale × half the stage ≈ 6.1% from the edge
  const pos = 'calc(6.1% - clamp(16px,4vw,24px))';
  return (
    <motion.div
      className="absolute top-[57%]"
      style={side === 'left' ? { left: pos } : { right: pos }}
      initial={{ opacity: 0, y: -14, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 1.9, duration: 0.7 }}
    >
      <svg viewBox="0 0 48 120" className="w-[clamp(32px,8vw,48px)] drop-shadow-[0_6px_6px_rgba(0,0,0,0.35)]" aria-hidden>
        <defs>
          <linearGradient id={`rope-${side}`} x1="0" x2="1">
            <stop offset="0" stopColor="#7a5418" />
            <stop offset="0.5" stopColor="#f6dc8a" />
            <stop offset="1" stopColor="#7a5418" />
          </linearGradient>
        </defs>
        {/* twisted rope */}
        <path d="M2 10 C14 2 34 2 46 10 C34 18 14 18 2 10Z" fill={`url(#rope-${side})`} />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${6 + i * 6} 5 l4 10`} stroke="#8a6420" strokeWidth="0.8" />
        ))}
        <circle cx="24" cy="24" r="9" fill={`url(#rope-${side})`} />
        <path d="M17 32 h14 l3 8 h-20z" fill={`url(#rope-${side})`} />
        <path d="M14 40 h20 l6 70 h-32z" fill={`url(#rope-${side})`} />
        {Array.from({ length: 11 }, (_, i) => (
          <line key={i} x1={11 + i * 2.6} y1="58" x2={9 + i * 3} y2="112" stroke="#6e4b14" strokeWidth="0.7" />
        ))}
        <path d="M14 48 h20" stroke="#fff0c2" strokeWidth="1.2" />
      </svg>
    </motion.div>
  );
}

function Valance({ t }: { t: Theme }) {
  const swags = 4;
  const w = 600 / swags;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[3]" aria-hidden>
      <svg viewBox="0 0 600 110" preserveAspectRatio="none" className="h-[clamp(96px,15svh,150px)] w-full drop-shadow-[0_8px_10px_rgba(0,0,0,0.35)]">
        <defs>
          <linearGradient id="val-fab" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={t.valTop} />
            <stop offset="0.55" stopColor={t.hi} />
            <stop offset="1" stopColor={t.valBottom} />
          </linearGradient>
          <linearGradient id="val-gold" x1="0" x2="1">
            <stop offset="0" stopColor="#7a5418" />
            <stop offset="0.5" stopColor="#f6dc8a" />
            <stop offset="1" stopColor="#7a5418" />
          </linearGradient>
        </defs>
        {/* pelmet band */}
        <rect width="600" height="26" fill="url(#val-fab)" />
        <rect y="22" width="600" height="5" fill="url(#val-gold)" />
        {/* festoon swags */}
        {Array.from({ length: swags }, (_, i) => {
          const x0 = i * w;
          return (
            <g key={i}>
              <path d={`M${x0} 24 Q${x0 + w / 2} 112 ${x0 + w} 24 Q${x0 + w / 2} 70 ${x0} 24Z`} fill="url(#val-fab)" />
              <path d={`M${x0 + 8} 30 Q${x0 + w / 2} 86 ${x0 + w - 8} 30`} stroke="rgba(0,0,0,0.25)" strokeWidth="2" fill="none" />
              <path d={`M${x0 + 14} 34 Q${x0 + w / 2} 98 ${x0 + w - 14} 34`} stroke="rgba(255,255,255,0.12)" strokeWidth="2" fill="none" />
              <path d={`M${x0} 24 Q${x0 + w / 2} 112 ${x0 + w} 24`} stroke="url(#val-gold)" strokeWidth="3" fill="none" />
              {/* fringe */}
              {Array.from({ length: 26 }, (_, k) => {
                const s = (k + 0.5) / 26;
                const x = x0 + s * w;
                const y = 24 + (1 - Math.pow(2 * s - 1, 2)) * 44;
                return <line key={k} x1={x} y1={y} x2={x} y2={y + 7} stroke="url(#val-gold)" strokeWidth="1.2" />;
              })}
            </g>
          );
        })}
        {/* tassels where swags meet */}
        {Array.from({ length: swags + 1 }, (_, i) => (
          <g key={`t${i}`} transform={`translate(${i * w} 26)`}>
            <circle r="5" fill="url(#val-gold)" />
            <path d="M-4 4 h8 l3 24 h-14z" fill="url(#val-gold)" />
          </g>
        ))}
      </svg>
    </div>
  );
}

export function Curtains({ open }: { open: boolean }) {
  const t = theme();
  return (
    <div className="pointer-events-none absolute inset-0 z-[2]">
      <Panel side="left" open={open} t={t} />
      <Panel side="right" open={open} t={t} />
      {open && <Tieback side="left" />}
      {open && <Tieback side="right" />}
      <Valance t={t} />
    </div>
  );
}
