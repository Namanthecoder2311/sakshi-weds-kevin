// Extra life for the palace scene: falling 3D petals, marigold garlands, swinging lanterns,
// brass knocker rings, light rays and a filmic grain + vignette pass.
import * as THREE from 'three';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

const canvas = (w: number, h: number) => {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  return [c, c.getContext('2d')!] as const;
};

/* ───────── petals ───────── */
function petalTexture() {
  const [c, x] = canvas(128, 160);
  const g = x.createRadialGradient(64, 110, 6, 64, 80, 80);
  g.addColorStop(0, '#ffffff');
  g.addColorStop(1, '#d9d9d9');
  x.fillStyle = g;
  x.beginPath();
  x.moveTo(64, 6);
  x.bezierCurveTo(126, 40, 118, 132, 64, 154);
  x.bezierCurveTo(10, 132, 2, 40, 64, 6);
  x.fill();
  x.strokeStyle = 'rgba(0,0,0,0.12)';
  x.lineWidth = 2;
  x.beginPath();
  x.moveTo(64, 20);
  x.quadraticCurveTo(70, 90, 64, 148);
  x.stroke();
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createPetals(count: number) {
  const geo = new THREE.PlaneGeometry(0.075, 0.095, 4, 4);
  const p = geo.attributes.position;
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i),
      y = p.getY(i);
    p.setZ(i, x * x * 9 - y * 0.25); // cupped, slightly curled petal
  }
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ map: petalTexture(), alphaTest: 0.4, side: THREE.DoubleSide, roughness: 0.55, emissive: '#5a1420', emissiveIntensity: 0.55 });
  const mesh = new THREE.InstancedMesh(geo, mat, count);
  mesh.castShadow = true;
  const palette = ['#c8174a', '#e0466f', '#f28aa5', '#b5102f', '#f5a623', '#e8841b', '#f6c1cf'].map((c) => new THREE.Color(c));
  const st = Array.from({ length: count }, (_, i) => ({
    pos: new THREE.Vector3((Math.random() - 0.5) * 6, Math.random() * 6 - 1.5, Math.random() * 6 - 1),
    vel: new THREE.Vector3(0, -(0.18 + Math.random() * 0.22), 0),
    rot: new THREE.Euler(Math.random() * 6, Math.random() * 6, Math.random() * 6),
    spin: new THREE.Vector3((Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 2.4, (Math.random() - 0.5) * 2.4),
    phase: Math.random() * Math.PI * 2,
    color: palette[i % palette.length],
  }));
  st.forEach((s, i) => mesh.setColorAt(i, s.color));
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const one = new THREE.Vector3(1, 1, 1);

  /** gust: 0..1 strength of the wind blowing out of the doorway */
  const update = (dt: number, t: number, gust: number, floorY: number) => {
    st.forEach((s, i) => {
      s.vel.x = Math.sin(t * 0.8 + s.phase) * 0.12;
      s.vel.z = Math.cos(t * 0.6 + s.phase) * 0.05;
      if (gust > 0) {
        // out of the doorway, fanning towards the camera
        s.vel.z += gust * (1.6 + Math.sin(s.phase) * 0.6);
        s.vel.x += gust * (s.pos.x * 0.35 + Math.cos(s.phase) * 0.4);
        s.vel.y += gust * 0.9 * dt;
      }
      s.pos.addScaledVector(s.vel, dt);
      s.vel.y = Math.max(s.vel.y - 0.25 * dt, -(0.18 + (i % 5) * 0.04));
      s.rot.x += s.spin.x * dt;
      s.rot.y += s.spin.y * dt;
      s.rot.z += s.spin.z * dt;
      if (s.pos.y < floorY + 0.02 || s.pos.z > 9) {
        // respawn above the frame; during the gust, from inside the doorway
        s.pos.set((Math.random() - 0.5) * (gust > 0.05 ? 1.6 : 6), gust > 0.05 ? Math.random() * 2.6 - 1.2 : 3.6 + Math.random() * 1.5, gust > 0.05 ? -1.2 - Math.random() : Math.random() * 6 - 1);
        s.vel.set(0, -(0.18 + Math.random() * 0.22), 0);
      }
      q.setFromEuler(s.rot);
      m.compose(s.pos, q, one);
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };
  return { mesh, update };
}

/* ───────── marigold garlands ───────── */
export function createGarlands(holeW: number, holeH: number) {
  const group = new THREE.Group();
  const ball = new THREE.IcosahedronGeometry(0.052, 1);
  const pos = ball.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3().fromBufferAttribute(pos, i);
    v.multiplyScalar(1 + (Math.random() - 0.5) * 0.35); // ruffled petals
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  ball.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.85, flatShading: true });
  const leafGeo = new THREE.SphereGeometry(0.04, 6, 4);
  leafGeo.scale(0.5, 1.6, 0.25);
  const leafMat = new THREE.MeshStandardMaterial({ color: '#3f6b2a', roughness: 0.7 });
  const colors = ['#f39a1e', '#f6b520', '#e8721a', '#ffcf3a'].map((c) => new THREE.Color(c));

  // arch garland: follows the arch just outside the gold trim
  const R = holeW + 0.26;
  const archN = 64;
  const arch = new THREE.InstancedMesh(ball, mat, archN);
  const m = new THREE.Matrix4();
  for (let i = 0; i < archN; i++) {
    const a = Math.PI * (i / (archN - 1));
    const sag = Math.sin(a * 9) * 0.015;
    m.makeTranslation(Math.cos(a) * (R + sag), holeH + Math.sin(a) * (R + sag), 0.2);
    arch.setMatrixAt(i, m);
    arch.setColorAt(i, colors[i % colors.length]);
  }
  arch.castShadow = true;
  group.add(arch);

  // hanging lari strands either side of the doorway, each a swinging pendulum
  const strands: THREE.Group[] = [];
  [-1, 1].forEach((side) => {
    [0, 1].forEach((k) => {
      const g = new THREE.Group();
      g.position.set(side * (holeW + 0.2 + k * 0.16), holeH + 0.35 - k * 0.25, 0.24 + k * 0.03);
      const n = 26 - k * 6;
      const inst = new THREE.InstancedMesh(ball, mat, n);
      for (let i = 0; i < n; i++) {
        m.makeTranslation(0, -i * 0.088, 0);
        inst.setMatrixAt(i, m);
        inst.setColorAt(i, colors[(i + k) % colors.length]);
      }
      inst.castShadow = true;
      g.add(inst);
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.y = -n * 0.088 - 0.02;
      g.add(leaf);
      group.add(g);
      strands.push(g);
    });
  });

  const update = (t: number, gust: number) => {
    strands.forEach((g, i) => {
      g.rotation.z = Math.sin(t * 1.1 + i * 1.7) * 0.035 + gust * 0.12 * Math.sin(t * 6 + i);
      g.rotation.x = Math.sin(t * 0.8 + i) * 0.025 - gust * 0.25;
    });
  };
  return { group, update };
}

/* ───────── hanging brass lanterns ───────── */
export function createLanterns(xs: number[], top: number) {
  const group = new THREE.Group();
  const brass = new THREE.MeshStandardMaterial({ color: '#c79a45', metalness: 1, roughness: 0.35 });
  const glass = new THREE.MeshStandardMaterial({ color: '#ffd38a', emissive: '#ffb347', emissiveIntensity: 2.2, transparent: true, opacity: 0.9 });
  const items = xs.map((x, i) => {
    const pivot = new THREE.Group();
    pivot.position.set(x, top, 0.9);
    const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.9, 6), brass);
    chain.position.y = -0.45;
    pivot.add(chain);
    const body = new THREE.Group();
    body.position.y = -1.05;
    const cage = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.13, 0.26, 8, 1, true), new THREE.MeshStandardMaterial({ color: '#b8893a', metalness: 1, roughness: 0.4, wireframe: true }));
    const core = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.22, 16), glass);
    const capTop = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.14, 8), brass);
    capTop.position.y = 0.2;
    const capBot = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.09, 8), brass);
    capBot.position.y = -0.17;
    capBot.rotation.x = Math.PI;
    const light = new THREE.PointLight('#ffb35c', 1.6, 4, 2);
    body.add(cage, core, capTop, capBot, light);
    pivot.add(body);
    group.add(pivot);
    return { pivot, light, phase: i * 1.3 };
  });
  const update = (t: number, gust: number) => {
    items.forEach((l) => {
      l.pivot.rotation.z = Math.sin(t * 0.9 + l.phase) * 0.05 + gust * 0.08 * Math.sin(t * 3 + l.phase);
      l.pivot.rotation.x = Math.sin(t * 0.7 + l.phase) * 0.03 - gust * 0.12;
      l.light.intensity = 1.5 + Math.sin(t * 13 + l.phase) * 0.15 + Math.sin(t * 29 + l.phase) * 0.1;
    });
  };
  return { group, update };
}

/* ───────── brass knocker rings ───────── */
export function createKnocker() {
  const brass = new THREE.MeshStandardMaterial({ color: '#d8b25e', metalness: 1, roughness: 0.28 });
  const pivot = new THREE.Group();
  const mount = new THREE.Mesh(new THREE.SphereGeometry(0.035, 16, 12), brass);
  mount.scale.z = 0.6;
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.012, 12, 40), brass);
  ring.position.y = -0.08;
  pivot.add(mount, ring);
  return { pivot, ring };
}

/* ───────── light rays out of the doorway ───────── */
export function createRays() {
  const [c, x] = canvas(64, 256);
  const g = x.createLinearGradient(0, 0, 0, 256);
  g.addColorStop(0, 'rgba(255,230,170,0.9)');
  g.addColorStop(1, 'rgba(255,200,120,0)');
  x.fillStyle = g;
  x.fillRect(0, 0, 64, 256);
  const h = x.createLinearGradient(0, 0, 64, 0);
  h.addColorStop(0, 'rgba(0,0,0,1)');
  h.addColorStop(0.5, 'rgba(0,0,0,0)');
  h.addColorStop(1, 'rgba(0,0,0,1)');
  x.globalCompositeOperation = 'destination-out';
  x.fillStyle = h;
  x.fillRect(0, 0, 64, 256);
  const tex = new THREE.CanvasTexture(c);
  const group = new THREE.Group();
  const mats: THREE.MeshBasicMaterial[] = [];
  for (let i = 0; i < 7; i++) {
    const mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0, side: THREE.DoubleSide });
    const ray = new THREE.Mesh(new THREE.PlaneGeometry(0.35 + (i % 3) * 0.2, 6), mat);
    ray.geometry.translate(0, -3, 0);
    ray.rotation.x = -(Math.PI / 2 - 0.25); // reach out of the doorway towards the camera, dipping to the floor
    ray.rotation.z = (i - 3) * 0.16;
    ray.position.set((i - 3) * 0.12, 0.6 - (i % 2) * 0.4, -0.3);
    group.add(ray);
    mats.push(mat);
  }
  const update = (t: number, strength: number) => {
    mats.forEach((m, i) => (m.opacity = strength * (0.11 + 0.07 * Math.sin(t * 1.7 + i * 1.9))));
  };
  return { group, update };
}

/* ───────── film look ───────── */
export function createFilmPass() {
  return new ShaderPass({
    uniforms: { tDiffuse: { value: null }, time: { value: 0 }, vignette: { value: 0.55 }, grain: { value: 0.045 } },
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `
      uniform sampler2D tDiffuse; uniform float time; uniform float vignette; uniform float grain; varying vec2 vUv;
      float rand(vec2 co){ return fract(sin(dot(co, vec2(12.9898,78.233)) + time) * 43758.5453); }
      void main(){
        vec4 c = texture2D(tDiffuse, vUv);
        vec2 d = vUv - 0.5;
        float v = smoothstep(0.85, 0.2, length(d) * (1.0 + vignette));
        c.rgb *= mix(1.0 - vignette * 0.6, 1.0, v);
        c.rgb += (rand(vUv * 731.0) - 0.5) * grain;
        gl_FragColor = c;
      }`,
  });
}
