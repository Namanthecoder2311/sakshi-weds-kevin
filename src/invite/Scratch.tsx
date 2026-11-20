import { useEffect, useRef, useState } from 'react';

type Props = {
  shape?: 'square' | 'heart';
  label?: string;
  onDone?: () => void;
  className?: string;
  children: React.ReactNode;
};

function heartPath(w: number, h: number) {
  const p = new Path2D();
  const s = Math.min(w, h);
  const ox = (w - s) / 2;
  const oy = (h - s) / 2;
  const X = (v: number) => ox + v * s;
  const Y = (v: number) => oy + v * s;
  p.moveTo(X(0.5), Y(0.95));
  p.bezierCurveTo(X(0.12), Y(0.7), X(0), Y(0.42), X(0.08), Y(0.24));
  p.bezierCurveTo(X(0.18), Y(0.04), X(0.44), Y(0.04), X(0.5), Y(0.26));
  p.bezierCurveTo(X(0.56), Y(0.04), X(0.82), Y(0.04), X(0.92), Y(0.24));
  p.bezierCurveTo(X(1), Y(0.42), X(0.88), Y(0.7), X(0.5), Y(0.95));
  p.closePath();
  return p;
}

function coverage(c: HTMLCanvasElement) {
  if (!c.width || !c.height) return 0;
  const data = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
  let n = 0;
  for (let i = 3; i < data.length; i += 16) if (data[i] > 0) n++;
  return n;
}

/** Gold-foil scratch layer over its children. Works inside 3D-transformed parents. */
export function Scratch({ shape = 'square', label = 'Scratch', onDone, className, children }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const cvs = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const total = useRef(0);
  const moves = useRef(0);
  const touched = useRef(false);
  const doneRef = useRef(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const el = wrap.current!;
    const paint = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (!w || !h || touched.current || doneRef.current) return;
      const c = cvs.current!;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      const ctx = c.getContext('2d')!;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, '#a87a26');
      g.addColorStop(0.3, '#f4d97a');
      g.addColorStop(0.55, '#c99a34');
      g.addColorStop(0.8, '#f1d06a');
      g.addColorStop(1, '#a87a26');
      ctx.save();
      if (shape === 'heart') ctx.clip(heartPath(w, h));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = 'rgba(255,255,255,0.18)';
      ctx.lineWidth = 1;
      for (let i = -h; i < w; i += 6) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h * 0.35, h);
        ctx.stroke();
      }
      ctx.fillStyle = 'rgba(110,74,16,0.8)';
      ctx.font = `500 ${Math.max(8, Math.min(w, h) * 0.14)}px Jost, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, w / 2, h * (shape === 'heart' ? 0.48 : 0.5));
      ctx.restore();
      total.current = coverage(c) || 1;
    };
    paint();
    const ro = new ResizeObserver(paint);
    ro.observe(el);
    return () => ro.disconnect();
  }, [shape, label]);

  const point = (e: React.PointerEvent) => {
    // the card lives in 3D, so map screen pixels back to the canvas' own size
    const c = cvs.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * c.clientWidth) / r.width, y: ((e.clientY - r.top) * c.clientHeight) / r.height };
  };

  const check = () => {
    if (doneRef.current || !total.current) return;
    if (coverage(cvs.current!) / total.current < 0.45) {
      doneRef.current = true;
      setDone(true);
      onDone?.();
    }
  };

  const erase = (p: { x: number; y: number }) => {
    const c = cvs.current!;
    if (!c.width) return;
    touched.current = true;
    const ctx = c.getContext('2d')!;
    const size = Math.max(16, Math.min(c.clientWidth, c.clientHeight) * 0.3);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = size;
    ctx.beginPath();
    const from = last.current ?? p;
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(p.x + 0.01, p.y);
    ctx.stroke();
    last.current = p;
    if (++moves.current % 5 === 0) check();
  };

  return (
    <div ref={wrap} className={`relative ${className ?? ''}`}>
      {children}
      <canvas
        ref={cvs}
        className="absolute inset-0 h-full w-full cursor-pointer touch-none transition-opacity duration-500"
        style={{ opacity: done ? 0 : 1, pointerEvents: done ? 'none' : 'auto', filter: 'drop-shadow(0 4px 6px rgba(120,80,10,0.3))' }}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          last.current = null;
          erase(point(e));
        }}
        onPointerMove={(e) => {
          if (e.buttons || e.pointerType === 'touch') erase(point(e));
        }}
        onPointerUp={() => {
          last.current = null;
          check();
        }}
      />
    </div>
  );
}
