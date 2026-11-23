// Procedural canvas textures for the 3D palace doors, seal, marble and jali.
import * as THREE from 'three';

const canvas = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
};

const tex = (c: HTMLCanvasElement, srgb = true) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
};

function noise(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);
}

function petals(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, n: number, len: number, wid: number, rot = 0) {
  for (let i = 0; i < n; i++) {
    const a = rot + (i / n) * Math.PI * 2;
    ctx.save();
    ctx.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    ctx.rotate(a + Math.PI / 2);
    ctx.beginPath();
    ctx.moveTo(0, -len / 2);
    ctx.quadraticCurveTo(wid, 0, 0, len / 2);
    ctx.quadraticCurveTo(-wid, 0, 0, -len / 2);
    ctx.stroke();
    ctx.restore();
  }
}

function medallion(ctx: CanvasRenderingContext2D, cx: number, cy: number, R: number) {
  ctx.lineWidth = 3;
  [1, 0.78, 0.42, 0.16].forEach((k) => {
    ctx.beginPath();
    ctx.arc(cx, cy, R * k, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.lineWidth = 2.5;
  petals(ctx, cx, cy, R * 0.6, 16, R * 0.34, R * 0.09);
  petals(ctx, cx, cy, R * 0.29, 10, R * 0.2, R * 0.07, 0.3);
  ctx.lineWidth = 2;
  for (let i = 0; i < 32; i++) {
    const a = (i / 32) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * R * 0.89, cy + Math.sin(a) * R * 0.89, R * 0.035, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(cx, cy, R * 0.07, 0, Math.PI * 2);
  ctx.fill();
}

/** White-on-transparent mask of all raised gold work on one (left) door. Inner edge is x = W. */
function goldMask(W: number, H: number) {
  const [c, ctx] = canvas(W, H);
  ctx.strokeStyle = '#fff';
  ctx.fillStyle = '#fff';
  ctx.lineJoin = 'round';
  // frames
  ctx.lineWidth = 9;
  ctx.strokeRect(22, 22, W - 44, H - 44);
  ctx.lineWidth = 3;
  ctx.strokeRect(40, 40, W - 80, H - 80);
  // upper arched panel
  const ax0 = 78,
    ax1 = W - 78,
    ay0 = 120,
    ay1 = 600;
  const ar = (ax1 - ax0) / 2;
  const arch = (inset: number) => {
    ctx.beginPath();
    ctx.moveTo(ax0 + inset, ay1 - inset);
    ctx.lineTo(ax0 + inset, ay0 + ar);
    ctx.arc((ax0 + ax1) / 2, ay0 + ar, ar - inset, Math.PI, 0);
    ctx.lineTo(ax1 - inset, ay1 - inset);
    ctx.closePath();
    ctx.stroke();
  };
  ctx.lineWidth = 6;
  arch(0);
  ctx.lineWidth = 2;
  arch(16);
  medallion(ctx, W / 2, ay0 + ar + 70, ar * 0.62);
  // lower panel
  const ly0 = 680,
    ly1 = H - 110;
  ctx.lineWidth = 6;
  ctx.strokeRect(ax0, ly0, ax1 - ax0, ly1 - ly0);
  ctx.lineWidth = 2;
  ctx.strokeRect(ax0 + 16, ly0 + 16, ax1 - ax0 - 32, ly1 - ly0 - 32);
  medallion(ctx, W / 2, (ly0 + ly1) / 2 + 40, (ax1 - ax0) * 0.4);
  // corner rosettes of the lower panel
  ctx.lineWidth = 2;
  [
    [ax0 + 40, ly0 + 40],
    [ax1 - 40, ly0 + 40],
    [ax0 + 40, ly1 - 40],
    [ax1 - 40, ly1 - 40],
  ].forEach(([x, y]) => petals(ctx, x, y, 10, 8, 16, 5));
  // studs along the rail between panels
  for (let i = 0; i < 6; i++) {
    ctx.beginPath();
    ctx.arc(ax0 + 20 + i * ((ax1 - ax0 - 40) / 5), (ay1 + ly0) / 2, 7, 0, Math.PI * 2);
    ctx.fill();
  }
  // zari strip on the meeting edge
  ctx.fillRect(W - 16, 0, 16, H);
  // brass knocker: rosette mount + ring
  const kx = W - 72,
    ky = 640;
  ctx.beginPath();
  ctx.arc(kx, ky - 46, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(kx, ky, 34, 0, Math.PI * 2);
  ctx.stroke();
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(kx, ky - 46);
  ctx.lineTo(kx, ky - 34);
  ctx.stroke();
  return c;
}

export function doorTextures() {
  const W = 512,
    H = 1741;
  const mask = goldMask(W, H);

  // colour: maroon velvet + gold
  const [col, cx] = canvas(W, H);
  const g = cx.createLinearGradient(0, 0, W, 0);
  g.addColorStop(0, '#2e0510');
  g.addColorStop(0.5, '#5c0c1e');
  g.addColorStop(1, '#7a1529');
  cx.fillStyle = g;
  cx.fillRect(0, 0, W, H);
  // damask
  cx.fillStyle = 'rgba(0,0,0,0.22)';
  for (let y = 0; y < H; y += 64)
    for (let x = (y / 64) % 2 ? 24 : 0; x < W; x += 48) {
      cx.beginPath();
      cx.moveTo(x, y + 6);
      cx.quadraticCurveTo(x + 7, y + 18, x, y + 30);
      cx.quadraticCurveTo(x - 7, y + 18, x, y + 6);
      cx.fill();
      cx.beginPath();
      cx.arc(x, y + 44, 2.4, 0, Math.PI * 2);
      cx.fill();
    }
  noise(cx, W, H, 26);
  const vg = cx.createLinearGradient(0, 0, 0, H);
  vg.addColorStop(0, 'rgba(0,0,0,0.35)');
  vg.addColorStop(0.2, 'rgba(0,0,0,0)');
  vg.addColorStop(0.85, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.4)');
  cx.fillStyle = vg;
  cx.fillRect(0, 0, W, H);
  // gold through the mask
  const [gold, gx] = canvas(W, H);
  const gg = gx.createLinearGradient(0, 0, W, H);
  ['#8a6420', '#e9c977', '#fff0c2', '#c99c45', '#8a6420', '#e3bd6c', '#9a7429'].forEach((c, i, a) => gg.addColorStop(i / (a.length - 1), c));
  gx.fillStyle = gg;
  gx.fillRect(0, 0, W, H);
  gx.globalCompositeOperation = 'destination-in';
  gx.drawImage(mask, 0, 0);
  cx.drawImage(gold, 0, 0);

  // bump: soft raised gold, faint velvet pile
  const [bump, bx] = canvas(W, H);
  bx.fillStyle = '#202020';
  bx.fillRect(0, 0, W, H);
  noise(bx, W, H, 18);
  bx.filter = 'blur(2px)';
  bx.drawImage(mask, 0, 0);
  bx.filter = 'none';

  // metalness: gold only
  const [met, mx] = canvas(W, H);
  mx.fillStyle = '#000';
  mx.fillRect(0, 0, W, H);
  mx.drawImage(mask, 0, 0);

  // roughness: velvet rough, gold polished
  const [rou, rx] = canvas(W, H);
  rx.fillStyle = '#e6e6e6';
  rx.fillRect(0, 0, W, H);
  const [gm, gmx] = canvas(W, H);
  gmx.fillStyle = '#505050';
  gmx.fillRect(0, 0, W, H);
  gmx.globalCompositeOperation = 'destination-in';
  gmx.drawImage(mask, 0, 0);
  rx.drawImage(gm, 0, 0);

  return { map: tex(col), bumpMap: tex(bump, false), metalnessMap: tex(met, false), roughnessMap: tex(rou, false) };
}

export function sealTextures(monogram: string) {
  const S = 512;
  const [c, x] = canvas(S, S);
  const g = x.createRadialGradient(S * 0.38, S * 0.32, 10, S / 2, S / 2, S * 0.55);
  g.addColorStop(0, '#fff3c4');
  g.addColorStop(0.35, '#ecc24c');
  g.addColorStop(0.8, '#b8861c');
  g.addColorStop(1, '#7f5a0c');
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  x.strokeStyle = 'rgba(110,70,10,0.8)';
  x.lineWidth = 8;
  x.beginPath();
  x.arc(S / 2, S / 2, S * 0.34, 0, Math.PI * 2);
  x.stroke();
  x.font = `${S * 0.36}px "Great Vibes", cursive`;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.fillStyle = '#6e4a08';
  x.fillText(monogram, S / 2, S / 2 + 6);
  const [b, bx] = canvas(S, S);
  bx.fillStyle = '#000';
  bx.fillRect(0, 0, S, S);
  bx.strokeStyle = '#fff';
  bx.lineWidth = 10;
  bx.beginPath();
  bx.arc(S / 2, S / 2, S * 0.34, 0, Math.PI * 2);
  bx.stroke();
  bx.font = x.font;
  bx.textAlign = 'center';
  bx.textBaseline = 'middle';
  bx.fillStyle = '#fff';
  bx.filter = 'blur(1.5px)';
  bx.fillText(monogram, S / 2, S / 2 + 6);
  return { map: tex(c), bumpMap: tex(b, false) };
}

export function marbleTexture() {
  const W = 1024,
    H = 1024;
  const [c, x] = canvas(W, H);
  x.fillStyle = '#efe4d2';
  x.fillRect(0, 0, W, H);
  for (let i = 0; i < 26; i++) {
    x.strokeStyle = `rgba(${150 + Math.random() * 40},${130 + Math.random() * 30},${120 + Math.random() * 30},${0.08 + Math.random() * 0.12})`;
    x.lineWidth = 0.6 + Math.random() * 2.2;
    x.beginPath();
    let px = Math.random() * W,
      py = Math.random() * H;
    x.moveTo(px, py);
    for (let k = 0; k < 6; k++) {
      const nx = px + (Math.random() - 0.3) * 260,
        ny = py + (Math.random() - 0.5) * 220;
      x.quadraticCurveTo(px + (Math.random() - 0.5) * 160, py + (Math.random() - 0.5) * 160, nx, ny);
      px = nx;
      py = ny;
    }
    x.stroke();
  }
  noise(x, W, H, 10);
  const t = tex(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Carved jali lattice: colour + alpha (holes let the light through). */
export function jaliTextures() {
  const S = 512;
  const [c, x] = canvas(S, S);
  x.fillStyle = '#eadcc4';
  x.fillRect(0, 0, S, S);
  const [a, ax] = canvas(S, S);
  ax.fillStyle = '#fff';
  ax.fillRect(0, 0, S, S);
  ax.fillStyle = '#000';
  const step = 42;
  for (let y = step / 2; y < S; y += step)
    for (let xx = step / 2; xx < S; xx += step) {
      ax.beginPath();
      ax.moveTo(xx, y - 14);
      ax.lineTo(xx + 14, y);
      ax.lineTo(xx, y + 14);
      ax.lineTo(xx - 14, y);
      ax.closePath();
      ax.fill();
    }
  const t = tex(c);
  const al = tex(a, false);
  t.wrapS = t.wrapT = al.wrapS = al.wrapT = THREE.RepeatWrapping;
  return { map: t, alphaMap: al };
}

export function radialSprite(inner: string, outer: string) {
  const S = 256;
  const [c, x] = canvas(S, S);
  const g = x.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  x.fillStyle = g;
  x.fillRect(0, 0, S, S);
  return tex(c);
}

/** The cover painting, blurred and darkened for the wide backdrop. */
export function blurredTexture(img: HTMLImageElement) {
  // wide (16:10) soft wash of the painting: cover-fit, blurred, a touch richer
  const W = 1024,
    H = 640;
  const [c, x] = canvas(W, H);
  const h = (W * img.height) / img.width;
  x.filter = 'blur(22px) saturate(1.2) brightness(0.95)';
  x.drawImage(img, -60, -(h - H) * 0.42 - 60, W + 120, h + 120);
  return tex(c);
}
