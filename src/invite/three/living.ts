// "Living painting": the couple painting rendered as a 3D photo. A hand-made depth map
// gives it parallax (sky far, couple & pillars near); the lake ripples and sparkles,
// clouds drift, the dupatta flutters and a warm sunbeam sweeps across.
import * as THREE from 'three';

export type Living = { dispose: () => void };

const frag = /* glsl */ `
precision highp float;
uniform sampler2D uImg;
uniform sampler2D uDepth;
uniform vec2 uBox;      // container size (px)
uniform vec2 uImgSize;  // image size (px)
uniform vec2 uLook;     // parallax direction
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1,0)), u.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
}

void main(){
  // object-fit: cover, object-position: 50% 72% (same framing as the page)
  float boxA = uBox.x / uBox.y, imgA = uImgSize.x / uImgSize.y;
  vec2 scale = boxA > imgA ? vec2(1.0, imgA / boxA) : vec2(boxA / imgA, 1.0);
  vec2 off = (1.0 - scale) * vec2(0.5, 0.72);
  vec2 uv = vec2(vUv.x, 1.0 - vUv.y) * scale + off; // image space, v down

  vec3 m = texture2D(uDepth, uv).rgb;   // r: depth, g: lake, b: veil
  float depth = m.r;

  // parallax: near things move against far things
  vec2 p = uv - uLook * (depth - 0.35) * vec2(0.034, 0.016);

  // drifting clouds in the sky
  float sky = smoothstep(0.37, 0.30, uv.y) * (1.0 - smoothstep(0.5, 0.9, depth));
  p.x += sky * (sin(uTime * 0.07 + uv.y * 6.0) * 0.006);

  // lake ripples
  float lake = m.g;
  p.x += lake * sin(uv.y * 420.0 - uTime * 1.6) * 0.0016;
  p.y += lake * sin(uv.x * 160.0 + uTime * 1.1) * 0.0008;

  // the dupatta flutters in the breeze
  float veil = m.b;
  float wave = sin(uv.y * 22.0 - uTime * 2.1 + uv.x * 6.0) * 0.5 + sin(uv.y * 41.0 - uTime * 3.3) * 0.25;
  p += veil * vec2(wave * 0.0042, wave * 0.0016) * smoothstep(0.5, 0.75, uv.y + 0.1);

  vec3 c = texture2D(uImg, p).rgb;

  // sun sparkles on the water
  float sp = noise(uv * vec2(260.0, 900.0) + vec2(uTime * 0.6, 0.0));
  c += lake * pow(sp, 18.0) * 1.6 * vec3(1.0, 0.95, 0.85);

  // a warm sunbeam slowly sweeping across
  float beamPos = fract(uTime * 0.07) * 2.6 - 0.8;
  float beam = exp(-pow((uv.x * 0.9 + uv.y * 0.5) - beamPos, 2.0) * 22.0);
  c += beam * 0.09 * vec3(1.0, 0.86, 0.62) * (1.0 - depth * 0.4);

  // gentle warm vignette
  vec2 q = vUv - 0.5;
  c *= mix(0.86, 1.0, smoothstep(0.75, 0.25, length(q)));
  gl_FragColor = vec4(c, 1.0);
}`;

const vert = /* glsl */ `varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`;

function load(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

export async function createLiving(canvas: HTMLCanvasElement, src: string, depthSrc: string): Promise<Living> {
  const [img, dep] = await Promise.all([load(src), load(depthSrc)]);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const imgTex = new THREE.Texture(img);
  imgTex.colorSpace = THREE.SRGBColorSpace;
  imgTex.minFilter = THREE.LinearFilter;
  imgTex.flipY = false; // shader works in image space with v pointing down
  imgTex.needsUpdate = true;
  const depTex = new THREE.Texture(dep);
  depTex.flipY = false;
  depTex.needsUpdate = true;

  const uniforms = {
    uImg: { value: imgTex },
    uDepth: { value: depTex },
    uBox: { value: new THREE.Vector2(1, 1) },
    uImgSize: { value: new THREE.Vector2(img.width, img.height) },
    uLook: { value: new THREE.Vector2() },
    uTime: { value: 0 },
  };
  // raw sRGB in, raw out: keep the painting's colours exactly as painted
  const mat = new THREE.ShaderMaterial({ uniforms, vertexShader: vert, fragmentShader: frag, toneMapped: false });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  imgTex.colorSpace = THREE.NoColorSpace;

  const fit = () => {
    const w = canvas.clientWidth,
      h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    uniforms.uBox.value.set(w, h);
  };
  const ro = new ResizeObserver(fit);
  ro.observe(canvas);
  fit();

  const look = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e: PointerEvent) => {
    look.tx = (e.clientX / window.innerWidth) * 2 - 1;
    look.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };
  const onTilt = (e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;
    look.tx = Math.max(-1, Math.min(1, e.gamma / 20));
    look.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 20));
  };
  window.addEventListener('pointermove', onPointer);
  window.addEventListener('deviceorientation', onTilt);

  const clock = new THREE.Clock();
  let raf = 0;
  const frame = () => {
    raf = requestAnimationFrame(frame);
    const t = clock.getElapsedTime();
    look.x += (look.tx - look.x) * 0.05;
    look.y += (look.ty - look.y) * 0.05;
    // slow "camera breathing" orbit plus the viewer's own movement
    uniforms.uLook.value.set(Math.sin(t * 0.32) * 0.75 + look.x * 0.9, Math.cos(t * 0.23) * 0.45 + look.y * 0.6);
    uniforms.uTime.value = t;
    renderer.render(scene, camera);
  };
  frame();

  return {
    dispose: () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('deviceorientation', onTilt);
      mat.dispose();
      imgTex.dispose();
      depTex.dispose();
      renderer.dispose();
    },
  };
}
