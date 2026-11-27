// Gold-foil ornaments, line icons and the wax seal. All original vector art.
import { useId } from 'react';
import { COUPLE } from './config';

/** Gold foil gradient, shared via <defs>. */
export function FoilDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#8a6420" />
        <stop offset="0.3" stopColor="#e7c977" />
        <stop offset="0.5" stopColor="#fff1c4" />
        <stop offset="0.7" stopColor="#c99c45" />
        <stop offset="1" stopColor="#8a6420" />
      </linearGradient>
    </defs>
  );
}

function Corner({ foil }: { foil: string }) {
  return (
    <g stroke={`url(#${foil})`} fill="none" strokeWidth="1.2" strokeLinecap="round">
      <path d="M2 40 C2 16 16 2 40 2" />
      <path d="M8 46 C8 22 22 8 46 8" strokeWidth="0.7" />
      <path d="M14 14 C22 20 26 28 24 36 C30 30 34 26 40 24 C32 22 24 20 14 14Z" fill={`url(#${foil})`} stroke="none" opacity="0.9" />
      <circle cx="44" cy="2" r="1.6" fill={`url(#${foil})`} stroke="none" />
      <circle cx="2" cy="44" r="1.6" fill={`url(#${foil})`} stroke="none" />
      <path d="M40 2 q8 4 14 0 M2 40 q4 8 0 14" strokeWidth="0.8" />
    </g>
  );
}

/** Double gold border with flourished corners — sits over every card face. */
export function GoldFrame({ inset = 4.2 }: { inset?: number }) {
  const foil = useId();
  return (
    <div className="pointer-events-none absolute" style={{ inset: `${inset}cqw` }} aria-hidden>
      <div className="absolute inset-0 rounded-[1.6cqw] border border-[#c9a24a]/80" />
      <div className="absolute inset-[1.3cqw] rounded-[1cqw] border-[0.5px] border-[#c9a24a]/60" />
      {[0, 90, 180, 270].map((r) => (
        <svg
          key={r}
          viewBox="0 0 56 56"
          className="absolute h-[13cqw] w-[13cqw]"
          style={{
            top: r === 0 || r === 90 ? '-1.2cqw' : undefined,
            bottom: r === 180 || r === 270 ? '-1.2cqw' : undefined,
            left: r === 0 || r === 270 ? '-1.2cqw' : undefined,
            right: r === 90 || r === 180 ? '-1.2cqw' : undefined,
            transform: `rotate(${r}deg)`,
          }}
        >
          <FoilDefs id={foil} />
          <Corner foil={foil} />
        </svg>
      ))}
    </div>
  );
}

/** ✦ divider */
export function Flourish({ className }: { className?: string }) {
  const foil = useId();
  return (
    <svg viewBox="0 0 200 20" className={className} aria-hidden>
      <FoilDefs id={foil} />
      <g stroke={`url(#${foil})`} fill="none" strokeWidth="1">
        <path d="M10 10 H78 M122 10 H190" />
        <path d="M78 10 C86 2 92 2 100 10 C108 2 114 2 122 10 C114 18 108 18 100 10 C92 18 86 18 78 10Z" fill={`url(#${foil})`} fillOpacity="0.25" />
      </g>
      <circle cx="100" cy="10" r="2.6" fill={`url(#${foil})`} />
      <circle cx="10" cy="10" r="1.6" fill={`url(#${foil})`} />
      <circle cx="190" cy="10" r="1.6" fill={`url(#${foil})`} />
    </svg>
  );
}

/** Red sealing-wax disc with an embossed monogram. */
export function WaxSeal({ className, tone = 'red' }: { className?: string; tone?: 'red' | 'gold' }) {
  const gold = tone === 'gold';
  const id = useId();
  const n = 24;
  const pts = Array.from({ length: n * 2 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2;
    const r = i % 2 ? 45.5 : 48.5 + ((i * 5) % 3) * 0.6;
    return `${50 + Math.cos(a) * r},${50 + Math.sin(a) * r}`;
  }).join(' ');
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}w`} cx="36%" cy="30%" r="80%">
          <stop offset="0" stopColor={gold ? '#fff2b8' : '#e05a6a'} />
          <stop offset="0.35" stopColor={gold ? '#f0c64a' : '#b11f39'} />
          <stop offset="0.8" stopColor={gold ? '#b8861c' : '#7a0f24'} />
          <stop offset="1" stopColor={gold ? '#7f5a0c' : '#560818'} />
        </radialGradient>
        <radialGradient id={`${id}i`} cx="62%" cy="68%" r="75%">
          <stop offset="0" stopColor={gold ? '#f7d36a' : '#c02a43'} />
          <stop offset="1" stopColor={gold ? '#b8861c' : '#82122a'} />
        </radialGradient>
        <FoilDefs id={`${id}f`} />
      </defs>
      <polygon points={pts} fill={`url(#${id}w)`} strokeLinejoin="round" />
      <circle cx="50" cy="50" r="33" fill={`url(#${id}i)`} />
      <circle cx="50" cy="50" r="33" fill="none" stroke={gold ? '#7f5a0c' : '#5a0717'} strokeWidth="1.6" opacity="0.6" />
      <circle cx="50" cy="50" r="29" fill="none" stroke={gold ? '#fff3c4' : '#f08a98'} strokeOpacity="0.35" strokeWidth="0.8" />
      <text x="50" y="61" textAnchor="middle" fontFamily="Parisienne, cursive" fontSize="30" fill={gold ? '#7a520c' : `url(#${id}f)`} stroke={gold ? '#fff0c0' : '#5a0717'} strokeWidth="0.35">
        {COUPLE.monogram[0]}
        <tspan dx="-3">{COUPLE.monogram[1]}</tspan>
      </text>
      <path d="M22 32 Q32 18 52 15" stroke={gold ? '#fffbe6' : '#ffd0d6'} strokeOpacity="0.5" strokeWidth="3" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/** Fine-line gold icons for each celebration. */
export function EventIcon({ id, className }: { id: string; className?: string }) {
  const foil = useId();
  const s = `url(#${foil})`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <FoilDefs id={foil} />
      <g stroke={s} fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {id === 'haldi' && (
          <>
            {Array.from({ length: 16 }, (_, i) => (
              <path key={i} d="M50 50 C44 40 46 28 50 22 C54 28 56 40 50 50Z" transform={`rotate(${i * 22.5} 50 50)`} />
            ))}
            {Array.from({ length: 10 }, (_, i) => (
              <path key={`b${i}`} d="M50 50 C47 44 48 38 50 35 C52 38 53 44 50 50Z" transform={`rotate(${i * 36 + 10} 50 50)`} fill={s} fillOpacity="0.35" />
            ))}
            <circle cx="50" cy="50" r="5" fill={s} />
          </>
        )}
        {id === 'samota' && (
          <>
            {/* diya with flame and soft rays */}
            <path d="M50 22 C56 31 57 38 50 44 C43 38 44 31 50 22Z" fill={s} fillOpacity="0.45" />
            <path d="M50 30 C53 35 53 38 50 41 C47 38 47 35 50 30Z" fill={s} />
            {[-60, -35, 35, 60].map((a) => (
              <path key={a} d="M50 16 V9" transform={`rotate(${a} 50 40)`} strokeWidth="1.2" />
            ))}
            <path d="M24 52 H76 C74 64 64 72 50 72 C36 72 26 64 24 52Z" />
            <path d="M50 46 V52" strokeWidth="2" />
            <path d="M30 58 Q50 64 70 58" strokeWidth="1" />
            {[36, 44, 50, 56, 64].map((x) => (
              <circle key={x} cx={x} cy={x === 50 ? 62 : x === 44 || x === 56 ? 61.4 : 60} r="1.1" fill={s} />
            ))}
            <path d="M40 72 Q50 80 60 72" />
            <path d="M34 82 H66" strokeWidth="1" />
          </>
        )}
        {id === 'mehendi' && (
          <>
            <path d="M34 88 V60 C30 54 24 46 22 40 C20 34 26 32 29 37 L36 48 V20 C36 15 43 15 43 20 V44 V14 C43 9 50 9 50 14 V44 V17 C50 12 57 12 57 17 V45 V24 C57 19 64 19 64 24 V62 C64 74 60 80 60 88" />
            <circle cx="50" cy="62" r="7" />
            {Array.from({ length: 8 }, (_, i) => (
              <path key={i} d="M50 53 q2 -3 0 -6 q-2 3 0 6z" transform={`rotate(${i * 45} 50 62)`} fill={s} />
            ))}
            <path d="M39.5 22 h3 M46.5 18 h3 M53.5 21 h3 M60.5 28 h3" strokeWidth="2.2" />
            <path d="M36 80 H60 M36 84 H60" strokeWidth="0.9" />
          </>
        )}
        {id === 'sangeet' && (
          <>
            <ellipse cx="22" cy="58" rx="7" ry="16" />
            <ellipse cx="78" cy="58" rx="7" ry="16" />
            <path d="M22 42 C40 38 60 38 78 42 M22 74 C40 78 60 78 78 74" />
            <path d="M26 44 L34 72 L42 45 L50 73 L58 45 L66 72 L74 44" strokeWidth="1" />
            <path d="M64 12 V30 M64 12 L78 9 V26" />
            <circle cx="60" cy="30" r="4" fill={s} />
            <circle cx="74" cy="26" r="4" fill={s} />
            <path d="M30 18 V30" />
            <circle cx="27" cy="30" r="3.4" fill={s} />
          </>
        )}
        {id === 'wedding' && (
          <>
            <path d="M30 60 C26 78 36 90 50 90 C64 90 74 78 70 60 C68 54 60 52 50 52 C40 52 32 54 30 60Z" />
            <path d="M36 52 C36 46 64 46 64 52" />
            <path d="M38 47 h24" />
            <circle cx="50" cy="34" r="10" />
            <path d="M50 24 C46 14 40 10 32 10 C38 16 42 20 50 24Z M50 24 C54 14 60 10 68 10 C62 16 58 20 50 24Z M44 40 C34 38 26 42 20 46 C30 46 38 44 44 40Z M56 40 C66 38 74 42 80 46 C70 46 62 44 56 40Z" fill={s} fillOpacity="0.3" />
            <path d="M40 70 h20 M44 76 h12" strokeWidth="1" />
            <path d="M47 64 l3 -4 l3 4 l-3 4z" fill={s} />
          </>
        )}
        {id === 'venue' && (
          <>
            <path d="M16 90 V52 H84 V90" />
            <path d="M30 90 V66 C30 56 44 56 44 66 V90 M56 90 V66 C56 56 70 56 70 66 V90" />
            <path d="M12 52 H88 M20 46 H80" />
            <path d="M34 46 C32 30 42 20 50 14 C58 20 68 30 66 46" />
            <path d="M50 14 V6" />
            <circle cx="50" cy="5" r="1.8" fill={s} />
            <path d="M18 46 C16 38 22 34 24 30 C26 34 32 38 30 46 M70 46 C68 38 74 34 76 30 C78 34 84 38 82 46" />
          </>
        )}
        {id === 'heart' && <path d="M50 84 C20 64 10 46 14 32 C18 18 38 14 50 30 C62 14 82 18 86 32 C90 46 80 64 50 84Z" />}
      </g>
    </svg>
  );
}

/** Large faint mandala used as a watermark behind the card. */
export function Mandala({ className }: { className?: string }) {
  return (
    <svg viewBox="-100 -100 200 200" className={className} aria-hidden>
      <g fill="none" stroke="#e9c77d" strokeWidth="0.6">
        {[90, 74, 58, 30].map((r) => (
          <circle key={r} r={r} />
        ))}
        {Array.from({ length: 24 }, (_, i) => (
          <path key={i} d="M0 -58 C8 -66 8 -80 0 -90 C-8 -80 -8 -66 0 -58Z" transform={`rotate(${i * 15})`} />
        ))}
        {Array.from({ length: 16 }, (_, i) => (
          <path key={`m${i}`} d="M0 -30 C10 -40 10 -50 0 -58 C-10 -50 -10 -40 0 -30Z" transform={`rotate(${i * 22.5})`} />
        ))}
        {Array.from({ length: 12 }, (_, i) => (
          <path key={`s${i}`} d="M0 0 C6 -10 6 -20 0 -30 C-6 -20 -6 -10 0 0Z" transform={`rotate(${i * 30})`} />
        ))}
      </g>
    </svg>
  );
}
