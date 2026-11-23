// A small real-time 3D film shot: a marble palace wall with an arched doorway,
// maroon & gold doors sealed with a wax seal. open() cracks the seal, swings the doors
// and dollies the camera through the doorway into the couple painting.
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { blurredTexture, doorTextures, jaliTextures, marbleTexture, radialSprite, sealTextures } from './textures';

export type Palace = { open: () => void; dispose: () => void };

const DOOR_W = 1;
const DOOR_H = 3.4;
const DOOR_T = 0.1;
const HOLE_W = 1.06;
const HOLE_H = 1.75;
const PAINT_Z = -4;
const PAINT_H = 3.6;
const PAINT_W = 2.4;
const FOV = 36;

const ease = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = src;
  });
}

function sealHalf(side: 'left' | 'right', r: number) {
  // wavy wax rim on the outside, a jagged crack along the middle
  const s = new THREE.Shape();
  const crack = [r, 0.55 * r, 0.25 * r, -0.05 * r, -0.4 * r, -0.7 * r, -r];
  const jag = [0, 0.05, -0.04, 0.06, -0.05, 0.04, 0].map((v) => v * r);
  s.moveTo(jag[0], crack[0]);
  const n = 40;
  for (let k = 0; k <= n; k++) {
    const a = Math.PI / 2 + (side === 'left' ? 1 : -1) * (k / n) * Math.PI;
    const rr = r * (1 + 0.045 * Math.sin(a * 11) + 0.02 * Math.sin(a * 23));
    s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  for (let k = crack.length - 1; k >= 0; k--) s.lineTo(jag[k], crack[k]);
  return new THREE.ExtrudeGeometry(s, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.025, bevelSize: 0.022, bevelSegments: 4, curveSegments: 4 });
}

export async function createPalace(canvas: HTMLCanvasElement, opts: { cover: string; monogram: string; onDone: () => void }): Promise<Palace> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#140306');
  scene.fog = new THREE.Fog('#140306', 9, 22);
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.22;

  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.05, 60);
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

  /* ── painting behind the doors ── */
  const coverImg = await loadImage(opts.cover);
  const coverTex = new THREE.Texture(coverImg);
  coverTex.colorSpace = THREE.SRGBColorSpace;
  coverTex.needsUpdate = true;
  const painting = new THREE.Mesh(new THREE.PlaneGeometry(PAINT_W, PAINT_H), new THREE.MeshBasicMaterial({ map: coverTex, toneMapped: false }));
  painting.position.set(0, 0, PAINT_Z);
  scene.add(painting);
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(16, 10), new THREE.MeshBasicMaterial({ map: blurredTexture(coverImg), toneMapped: false }));
  backdrop.position.set(0, 0, PAINT_Z - 0.05);
  scene.add(backdrop);

  /* ── light pouring through the doorway ── */
  const glowMat = new THREE.MeshBasicMaterial({ map: radialSprite('rgba(255,236,190,1)', 'rgba(255,200,120,0)'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0 });
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(5, 6), glowMat);
  glow.position.set(0, 0.2, -0.7);
  scene.add(glow);
  const seamMat = new THREE.MeshBasicMaterial({ color: '#ffe2a8', transparent: true, opacity: 0.0, blending: THREE.AdditiveBlending, depthWrite: false });
  const seam = new THREE.Mesh(new THREE.PlaneGeometry(0.04, DOOR_H), seamMat);
  seam.position.set(0, 0, -0.08);
  scene.add(seam);

  /* ── marble wall with arched doorway ── */
  const marble = marbleTexture();
  marble.repeat.set(0.25, 0.25);
  const wallShape = new THREE.Shape();
  wallShape.moveTo(-9, -HOLE_H - 0.05);
  wallShape.lineTo(9, -HOLE_H - 0.05);
  wallShape.lineTo(9, 9);
  wallShape.lineTo(-9, 9);
  wallShape.closePath();
  const hole = new THREE.Path();
  hole.moveTo(-HOLE_W, -HOLE_H);
  hole.lineTo(-HOLE_W, HOLE_H);
  hole.absarc(0, HOLE_H, HOLE_W, Math.PI, 0, true);
  hole.lineTo(HOLE_W, -HOLE_H);
  hole.closePath();
  wallShape.holes.push(hole);
  const wallMat = new THREE.MeshStandardMaterial({ map: marble, roughness: 0.8, metalness: 0, color: '#cbb89c' });
  const wall = new THREE.Mesh(new THREE.ExtrudeGeometry(wallShape, { depth: 0.4, bevelEnabled: false, curveSegments: 48 }), wallMat);
  wall.position.z = -0.32;
  scene.add(wall);

  // gold arch trim
  const goldMat = new THREE.MeshStandardMaterial({ color: '#d9b25e', metalness: 1, roughness: 0.32 });
  const trimShape = new THREE.Shape();
  const T = 0.14;
  trimShape.moveTo(-HOLE_W - T, -HOLE_H - 0.05);
  trimShape.lineTo(-HOLE_W - T, HOLE_H);
  trimShape.absarc(0, HOLE_H, HOLE_W + T, Math.PI, 0, true);
  trimShape.lineTo(HOLE_W + T, -HOLE_H - 0.05);
  trimShape.lineTo(HOLE_W, -HOLE_H - 0.05);
  trimShape.lineTo(HOLE_W, HOLE_H);
  trimShape.absarc(0, HOLE_H, HOLE_W, 0, Math.PI, false);
  trimShape.lineTo(-HOLE_W, -HOLE_H - 0.05);
  trimShape.closePath();
  const trim = new THREE.Mesh(new THREE.ExtrudeGeometry(trimShape, { depth: 0.08, bevelEnabled: true, bevelThickness: 0.02, bevelSize: 0.02, bevelSegments: 3, curveSegments: 48 }), goldMat);
  trim.position.z = 0.06;
  scene.add(trim);

  // carved jali in the arch above the doors
  const jt = jaliTextures();
  jt.map.repeat.set(5, 2.5);
  jt.alphaMap.repeat.set(5, 2.5);
  const jaliShape = new THREE.Shape();
  jaliShape.moveTo(-HOLE_W, HOLE_H - 0.05);
  jaliShape.absarc(0, HOLE_H - 0.05, HOLE_W, Math.PI, 0, true);
  jaliShape.closePath();
  const jali = new THREE.Mesh(
    new THREE.ShapeGeometry(jaliShape, 48),
    new THREE.MeshStandardMaterial({ map: jt.map, alphaMap: jt.alphaMap, transparent: true, alphaTest: 0.5, roughness: 0.8, side: THREE.DoubleSide }),
  );
  const jg = jali.geometry as THREE.BufferGeometry;
  const uv = jg.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, (uv.getX(i) + HOLE_W) / (2 * HOLE_W), (uv.getY(i) - HOLE_H) / HOLE_W);
  jali.position.z = 0.0;
  scene.add(jali);

  // pillars either side
  const pillarMat = new THREE.MeshStandardMaterial({ map: marble, color: '#d8c7ac', roughness: 0.6 });
  [-1.62, 1.62].forEach((x) => {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 4.2, 32), pillarMat);
    p.position.set(x, 0.3, 0.25);
    scene.add(p);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.19, 0.22, 32), goldMat);
    cap.position.set(x, 2.5, 0.25);
    scene.add(cap);
    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.27, 0.2, 32), goldMat);
    base.position.set(x, -1.68, 0.25);
    scene.add(base);
  });

  // reflective marble floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ map: marble, color: '#9e8478', roughness: 0.3, metalness: 0.05 }));
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -HOLE_H - 0.05;
  scene.add(floor);

  /* ── the doors ── */
  const dt = doorTextures();
  const mirror = (t: THREE.Texture) => {
    const c = t.clone();
    c.wrapS = THREE.RepeatWrapping;
    c.repeat.x = -1;
    c.offset.x = 1;
    c.needsUpdate = true;
    return c;
  };
  type Maps = { map: THREE.Texture; bumpMap: THREE.Texture; metalnessMap: THREE.Texture; roughnessMap: THREE.Texture };
  const faceMat = (m: Maps) =>
    new THREE.MeshStandardMaterial({ map: m.map, bumpMap: m.bumpMap, bumpScale: 3, metalnessMap: m.metalnessMap, roughnessMap: m.roughnessMap, metalness: 1, roughness: 1 });
  const edgeMat = new THREE.MeshStandardMaterial({ color: '#3a0a12', roughness: 0.6 });
  const liningMat = new THREE.MeshStandardMaterial({ color: '#efe3cb', roughness: 0.85 });
  const frontL = faceMat(dt);
  const frontR = faceMat({ map: mirror(dt.map), bumpMap: mirror(dt.bumpMap), metalnessMap: mirror(dt.metalnessMap), roughnessMap: mirror(dt.roughnessMap) });
  const doorGeo = new THREE.BoxGeometry(DOOR_W, DOOR_H, DOOR_T);

  const sealTex = sealTextures(opts.monogram);
  const R = 0.34;
  sealTex.map.repeat.set(1 / (2 * R), 1 / (2 * R));
  sealTex.map.offset.set(0.5, 0.5);
  sealTex.bumpMap.repeat.copy(sealTex.map.repeat);
  sealTex.bumpMap.offset.copy(sealTex.map.offset);
  const sealFace = new THREE.MeshStandardMaterial({ map: sealTex.map, bumpMap: sealTex.bumpMap, bumpScale: 4, metalness: 0.9, roughness: 0.3 });
  const sealSide = new THREE.MeshStandardMaterial({ color: '#b8861c', metalness: 0.9, roughness: 0.4 });

  const makeDoor = (side: 'left' | 'right') => {
    const hinge = new THREE.Group();
    hinge.position.set(side === 'left' ? -DOOR_W : DOOR_W, 0, 0);
    const mesh = new THREE.Mesh(doorGeo, [edgeMat, edgeMat, edgeMat, edgeMat, side === 'left' ? frontL : frontR, liningMat]);
    mesh.position.x = side === 'left' ? DOOR_W / 2 : -DOOR_W / 2;
    hinge.add(mesh);
    const half = new THREE.Mesh(sealHalf(side, R), [sealFace, sealSide]);
    half.position.set(side === 'left' ? DOOR_W : -DOOR_W, -0.05, DOOR_T / 2 + 0.005);
    hinge.add(half);
    scene.add(hinge);
    return { hinge, half };
  };
  const L = makeDoor('left');
  const Rt = makeDoor('right');

  /* ── candles on the floor ── */
  const flames: THREE.Sprite[] = [];
  const flameTex = radialSprite('rgba(255,230,160,1)', 'rgba(255,120,30,0)');
  [-1.95, 1.95].forEach((x) => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.34, 24), new THREE.MeshStandardMaterial({ color: '#f6ead2', roughness: 0.5 }));
    c.position.set(x, -HOLE_H + 0.12, 0.9);
    scene.add(c);
    const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true }));
    f.position.set(x, -HOLE_H + 0.38, 0.9);
    f.scale.set(0.16, 0.3, 1);
    scene.add(f);
    flames.push(f);
  });

  /* ── lights ── */
  scene.add(new THREE.HemisphereLight('#ffd7a8', '#1a0508', 0.18));
  const key = new THREE.SpotLight('#ffd9a0', 30, 20, 0.42, 0.9, 2);
  key.position.set(0.4, 3.6, 6);
  key.target.position.set(0, 0, 0);
  scene.add(key, key.target);
  const candles = [-1.95, 1.95].map((x) => {
    const l = new THREE.PointLight('#ff9a3c', 2.2, 6, 2);
    l.position.set(x, -HOLE_H + 0.5, 1.05);
    scene.add(l);
    return l;
  });
  const rim = new THREE.PointLight('#ffe9c4', 0, 6, 2);
  rim.position.set(0, 0.3, -0.5);
  scene.add(rim);

  /* ── gold dust ── */
  const N = 360;
  const pos = new Float32Array(N * 3);
  const vel = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 5;
    pos[i * 3 + 1] = Math.random() * 5 - 2;
    pos[i * 3 + 2] = Math.random() * 5 - 1.5;
    vel[i * 3] = (Math.random() - 0.5) * 0.002;
    vel[i * 3 + 1] = Math.random() * 0.002 + 0.0008;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const dustMat = new THREE.PointsMaterial({ size: 0.045, map: radialSprite('rgba(255,240,200,1)', 'rgba(255,200,120,0)'), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: '#ffd98a', opacity: 0.35 });
  const dust = new THREE.Points(dustGeo, dustMat);
  scene.add(dust);

  /* ── post ── */
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.3, 0.55, 0.9);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  /* ── framing ── */
  let zStart = 7;
  let zEnd = 1.5;
  const fit = () => {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.resolution.set(w / 2, h / 2);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const a = w / h;
    // start: show the whole arched doorway with a little wall around it
    zStart = Math.max(5.6 / (2 * tanHalf), 2.9 / (2 * tanHalf * a));
    // end: the painting fills the frame exactly like the page behind it (object-cover)
    const stageA = Math.min(a, 0.68);
    const visH = stageA < PAINT_W / PAINT_H ? PAINT_H : PAINT_W / stageA;
    zEnd = PAINT_Z + visH / (2 * tanHalf);
  };
  fit();
  window.addEventListener('resize', fit);

  /* ── animation ── */
  let openedAt = -1;
  let done = false;
  let raf = 0;
  const clock = new THREE.Clock();
  const tmp = new THREE.Vector3();

  const frame = () => {
    raf = requestAnimationFrame(frame);
    const t = clock.getElapsedTime();
    const o = openedAt < 0 ? -1 : t - openedAt;

    // candle flicker
    candles.forEach((l, i) => (l.intensity = 2.2 + Math.sin(t * 9 + i * 2) * 0.3 + Math.sin(t * 23 + i) * 0.2));
    flames.forEach((f, i) => f.scale.set(0.15 + Math.sin(t * 11 + i) * 0.01, 0.3 + Math.sin(t * 7 + i * 3) * 0.03, 1));

    // seal cracks, doors swing, camera dollies
    const crack = o < 0 ? 0 : ease(clamp01(o / 0.35));
    L.half.rotation.z = crack * 0.14;
    Rt.half.rotation.z = -crack * 0.14;
    L.half.position.x = DOOR_W - crack * 0.02;
    Rt.half.position.x = -DOOR_W + crack * 0.02;
    const swing = o < 0 ? 0 : ease(clamp01((o - 0.35) / 2.7));
    L.hinge.rotation.y = swing * 1.95;
    Rt.hinge.rotation.y = -swing * 1.95;
    const dolly = o < 0 ? 0 : ease(clamp01((o - 0.8) / 3.1));
    const idle = 1 - dolly;
    camera.position.set(
      Math.sin(t * 0.45) * 0.06 * idle,
      0.32 * (1 - dolly) + Math.sin(t * 0.7) * 0.03 * idle,
      THREE.MathUtils.lerp(zStart, zEnd, dolly),
    );
    tmp.set(0, 0.3 * (1 - dolly), PAINT_Z);
    camera.lookAt(tmp);

    // light & bloom
    // a short warm burst as the doors part, fading before the camera reaches the painting
    const pour = o < 0 ? 0 : clamp01((o - 0.3) / 0.6) * (1 - clamp01((o - 1.3) / 1.1));
    glowMat.opacity = pour * 0.7;
    seamMat.opacity = o < 0 ? 0.0 : clamp01(o / 0.3) * (1 - swing);
    rim.intensity = pour * 3;
    bloom.strength = 0.3 + pour * 0.55;
    bloom.threshold = 0.9 + 0.08 * dolly;
    dustMat.opacity = 0.35 + pour * 0.6;

    // dust drifts; after opening it streams out of the doorway toward the camera
    const p = dustGeo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < N; i++) {
      let x = p.getX(i) + vel[i * 3],
        y = p.getY(i) + vel[i * 3 + 1],
        z = p.getZ(i) + vel[i * 3 + 2] + (o > 0.4 ? 0.012 * pour : 0);
      if (y > 3.2 || z > 6) {
        y = -2 + Math.random() * 0.5;
        z = o > 0.4 ? -1.5 + Math.random() : Math.random() * 5 - 1.5;
        x = (Math.random() - 0.5) * (o > 0.4 ? 2 : 5);
      }
      p.setXYZ(i, x, y, z);
    }
    p.needsUpdate = true;

    composer.render();

    if (o > 4.1 && !done) {
      done = true;
      opts.onDone();
    }
  };
  frame();

  return {
    open: () => {
      if (openedAt < 0) openedAt = clock.getElapsedTime();
    },
    dispose: () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', fit);
      composer.dispose();
      renderer.dispose();
      pmrem.dispose();
      scene.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        mats.forEach((mm) => {
          Object.values(mm).forEach((v) => v instanceof THREE.Texture && v.dispose());
          mm.dispose();
        });
      });
    },
  };
}
