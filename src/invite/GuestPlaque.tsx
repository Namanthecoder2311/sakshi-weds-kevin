// The guest's name on the closed doors: a maroon & gold plaque that matches the palace doors.
import { motion } from 'framer-motion';
import { GUEST } from './guest';

export function GuestPlaque() {
  if (!GUEST) return null;
  return (
    <motion.div
      className="relative mt-3 max-w-[86vw] overflow-hidden rounded-2xl border border-[#e7c977] bg-[linear-gradient(180deg,rgba(110,18,40,0.96),rgba(58,7,20,0.96))] px-7 pt-2 pb-3 text-center shadow-[0_12px_30px_rgba(0,0,0,0.6),inset_0_0_0_4px_rgba(58,7,20,0.9),inset_0_0_0_5px_rgba(231,201,119,0.55)]"
      initial={{ opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.9, ease: [0.2, 0.7, 0.2, 1] }}
    >
      {/* soft gold glint sweeping across */}
      <div className="frame-shimmer pointer-events-none absolute inset-0" />
      <p className="flex items-center justify-center gap-2 font-display text-[0.72rem] font-bold tracking-[0.32em] text-[#e9c977] uppercase">
        <span aria-hidden>✦</span>Specially for<span aria-hidden>✦</span>
      </p>
      <p className="mt-0.5 font-display text-[clamp(1.45rem,6.4vw,2rem)] leading-tight font-bold text-[#fff1d0] [text-shadow:0_2px_6px_rgba(0,0,0,0.5)]">{GUEST}</p>
    </motion.div>
  );
}
