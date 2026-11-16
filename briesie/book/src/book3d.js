// Het 3D boek. Eigen opbouw op three.js: harde kaft met twee scharnieren,
// bladzijden als SkinnedMesh met botten zodat ze buigen bij het omslaan.
import {
  Scene, PerspectiveCamera, WebGLRenderer, Group, Mesh, BoxGeometry, PlaneGeometry,
  MeshStandardMaterial, MeshBasicMaterial, ShadowMaterial, CanvasTexture, SRGBColorSpace,
  HemisphereLight, DirectionalLight, Bone, Skeleton, SkinnedMesh, Uint16BufferAttribute,
  Float32BufferAttribute, Vector3, Raycaster, Vector2, Plane, PCFSoftShadowMap, MathUtils,
} from 'three';
import gsap from 'gsap';
import { book, SHEETS } from './content.js';
import * as draw from './pages.js';

// Maten in boek-eenheden: één bladzijde is 1 breed.
const W = 1;
const H = book.pageRatio;
const OVER = 0.025; // kaft steekt uit voorbij de bladzijden
const TC = 0.018; // dikte van het karton
const GAP = 0.006; // afstand tussen twee vellen
const SHEET_T = 0.0032;
const TB = 0.045; // de rest van het boek: een blok bladzijden dat blijft liggen
const T = SHEETS * GAP + TB; // dikte van het boekblok
const SEG = 24; // botten per bladzijde
const HOVER = 0.16;

const zRight = (k) => T / 2 - GAP * (k + 0.5);
const zLeft = (k) => -T / 2 + GAP * (k + 0.5);

function tex(canvas, renderer) {
  const t = new CanvasTexture(canvas);
  t.colorSpace = SRGBColorSpace;
  t.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return t;
}

export function createBook(container, { reduced = false, imgs = {} } = {}) {
  draw.setImages(imgs);
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.domElement.className = 'book-canvas';
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  const camera = new PerspectiveCamera(32, 1, 0.1, 50);

  scene.add(new HemisphereLight(0xffffff, 0xc4d4b0, 1.6));
  const sun = new DirectionalLight(0xffffff, 1.9);
  sun.position.set(-2.2, 5, 2.4);
  sun.castShadow = true;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -3, right: 3, top: 3, bottom: -3, near: 0.5, far: 12 });
  sun.shadow.bias = -0.0006;
  sun.shadow.radius = 6;
  scene.add(sun);

  const ground = new Mesh(new PlaneGeometry(14, 14), new ShadowMaterial({ opacity: 0.2 }));
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  // rig: draait om de wereld-as (schuin leggen). lay: legt het boek plat.
  const rig = new Group();
  const lay = new Group();
  lay.rotation.x = -Math.PI / 2;
  rig.add(lay);
  scene.add(rig);

  // ---- Kaft -------------------------------------------------------------
  const linen = (c) => new MeshStandardMaterial({ map: tex(c, renderer), roughness: 0.86 });
  const edgeMat = new MeshStandardMaterial({ color: draw.colors.coverPaper, roughness: 0.86 });
  const spineMat = new MeshStandardMaterial({ color: draw.colors.spine, roughness: 0.8 });
  const boardGeo = new BoxGeometry(W + OVER, H + 2 * OVER, TC);
  boardGeo.translate((W + OVER) / 2, 0, TC / 2);

  // BoxGeometry-vlakken: +x, -x, +y, -y, +z, -z
  // Het zijvlak aan de scharnierkant zit altijd verstopt. Het wordt niet
  // getekend: precies van opzij gezien schemert het anders door de bladzijden.
  const hidden = new MeshBasicMaterial({ visible: false });
  const back = new Mesh(boardGeo, [edgeMat, hidden, edgeMat, edgeMat, linen(draw.drawInsideBack()), linen(draw.drawCoverBack())]);
  back.position.z = -T / 2 - TC;
  back.castShadow = true;
  lay.add(back);

  const spineG = new Group(); // scharnier bij de achterkaft
  spineG.position.set(0, 0, -T / 2);
  lay.add(spineG);
  // Iets dunner dan de kaft, zodat rug en kaft nergens in hetzelfde vlak liggen.
  const spineGeo = new BoxGeometry(TC * 0.7, H + 2 * OVER, T + TC);
  spineGeo.translate(-TC * 0.65, 0, (T + TC) / 2);
  const hingeMat = new MeshStandardMaterial({ color: draw.colors.endpaper, roughness: 0.9 });
  const spine = new Mesh(spineGeo, [hingeMat, spineMat, spineMat, spineMat, spineMat, spineMat]);
  spine.castShadow = true;
  spineG.add(spine);

  const coverG = new Group(); // scharnier bij de voorkaft
  coverG.position.set(0, 0, T);
  spineG.add(coverG);
  const front = new Mesh(boardGeo, [edgeMat, hidden, edgeMat, edgeMat, linen(draw.drawCoverFront()), linen(draw.drawInsideFront())]);
  front.castShadow = true;
  coverG.add(front);

  // ---- Bladzijden -------------------------------------------------------
  const sheetGeo = new BoxGeometry(W, H, SHEET_T, SEG, 1, 1);
  sheetGeo.translate(W / 2, 0, 0);
  {
    const pos = sheetGeo.attributes.position;
    const idx = [];
    const wts = [];
    for (let i = 0; i < pos.count; i++) {
      const f = MathUtils.clamp(pos.getX(i) / W, 0, 1) * SEG;
      const b = Math.min(Math.floor(f), SEG - 1);
      const w = f - b;
      idx.push(b, b + 1, 0, 0);
      wts.push(1 - w, w, 0, 0);
    }
    sheetGeo.setAttribute('skinIndex', new Uint16BufferAttribute(idx, 4));
    sheetGeo.setAttribute('skinWeight', new Float32BufferAttribute(wts, 4));
  }
  const paperEdge = new MeshStandardMaterial({ color: 0xf3f1e6, roughness: 0.95 });

  // Het boekblok: de rest van het boek. De bovenkant is de laatste bladzijde.
  const blockGeo = new BoxGeometry(W, H, TB);
  blockGeo.translate(W / 2, 0, -T / 2 + TB / 2);
  const block = new Mesh(blockGeo, [paperEdge, hidden, paperEdge, paperEdge, new MeshStandardMaterial({ map: tex(draw.drawBlockTop(), renderer), roughness: 0.94 }), hidden]);
  block.castShadow = true;
  block.receiveShadow = true;
  lay.add(block);
  const blankR = tex(draw.drawBlank('right'), renderer);
  const blankL = tex(draw.drawBlank('left'), renderer);

  const sheets = [];
  for (let k = 0; k < SHEETS; k++) {
    const recto = new MeshStandardMaterial({ map: blankR, roughness: 0.94 });
    const verso = new MeshStandardMaterial({ map: blankL, roughness: 0.94 });
    const mesh = new SkinnedMesh(sheetGeo, [paperEdge, paperEdge, paperEdge, paperEdge, recto, verso]);
    const bones = [];
    for (let i = 0; i <= SEG; i++) {
      const b = new Bone();
      b.position.x = i === 0 ? 0 : W / SEG;
      if (i > 0) bones[i - 1].add(b);
      bones.push(b);
    }
    mesh.add(bones[0]);
    mesh.bind(new Skeleton(bones));
    mesh.frustumCulled = false;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    lay.add(mesh);
    sheets.push({ mesh, bones, recto, verso, p: 0, loaded: false, own: [] });
  }

  // Alleen de bladzijden rond de huidige spread krijgen een eigen textuur.
  function loadSheet(k) {
    const s = sheets[k];
    if (!s || s.loaded) return;
    const a = tex(draw.drawSheetSide(k, 'recto'), renderer);
    const b = tex(draw.drawSheetSide(k, 'verso'), renderer);
    s.recto.map = a;
    s.verso.map = b;
    s.own = [a, b];
    s.loaded = true;
  }
  function unloadSheet(k) {
    const s = sheets[k];
    if (!s.loaded) return;
    s.recto.map = blankR;
    s.verso.map = blankL;
    s.own.forEach((t) => t.dispose());
    s.own = [];
    s.loaded = false;
  }
  function setWindow(spread, keep = []) {
    for (let k = 0; k < SHEETS; k++) {
      const near = Math.abs(k - spread) <= 1 || k === spread - 2 || keep.includes(k);
      near ? loadSheet(k) : unloadSheet(k);
    }
    invalidate();
  }

  // ---- Figuurtjes naast het boek ----------------------------------------
  // De echte tekeningen als die er zijn, anders een placeholder.
  const plush = [];
  const blobTex = tex(draw.drawBlob(), renderer);
  [
    { img: imgs.green, label: 'Figuurtje', tint: '#9cc46a', w: 0.66, wide: [-1.04, -0.02], tall: [-0.36, 1.04] },
    { img: imgs.siem, label: 'Siem', tint: '#e2b07a', w: 0.46, wide: [1.0, 0.3], tall: [0.46, 1.08] },
  ].forEach((d, i) => {
    const src = d.img || draw.drawFigure(d.label, d.tint);
    const h = d.w * ((src.naturalHeight || src.height) / (src.naturalWidth || src.width));
    const m = new Mesh(new PlaneGeometry(d.w, h), new MeshBasicMaterial({ map: tex(src, renderer), transparent: true, depthWrite: false }));
    m.rotation.x = -0.32;
    m.renderOrder = 2;
    const blob = new Mesh(new PlaneGeometry(d.w * 0.9, d.w * 0.34), new MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2;
    blob.renderOrder = 1;
    m.userData = { home: d.wide[0], wide: d.wide, tall: d.tall, index: i, baseY: h / 2 + 0.01, jump: 0, tilt: 0, blob };
    m.position.set(d.wide[0], m.userData.baseY, d.wide[1]);
    scene.add(blob, m);
    plush.push(m);
  });

  // ---- Het betoverende stofje -------------------------------------------
  const dustTex = imgs.dust ? tex(imgs.dust, renderer) : null;
  const dustMat = () => new MeshBasicMaterial({ map: dustTex, transparent: true, depthWrite: false, depthTest: false, opacity: 0 });
  const dustGeo = new PlaneGeometry(1, 0.84);
  // Een handvol glinsteringen die opstuiven en uitwaaieren. Vaste waarden,
  // zodat de beweging elke keer hetzelfde is.
  const motes = !dustTex ? [] : [
    [-0.42, 0.52, -0.3, 0.34, 0.0], [0.3, 0.72, -0.12, 0.44, 0.04], [-0.1, 0.9, 0.18, 0.3, 0.1],
    [0.52, 0.42, 0.26, 0.24, 0.14], [-0.6, 0.34, 0.12, 0.2, 0.18], [0.1, 0.6, -0.42, 0.26, 0.08],
    [0.36, 0.3, 0.44, 0.18, 0.22], [-0.28, 0.76, 0.36, 0.22, 0.25],
  ].map(([dx, dy, dz, size, delay]) => {
    const m = new Mesh(dustGeo, dustMat());
    m.userData = { dx, dy, dz, size, delay };
    m.renderOrder = 5;
    m.visible = false;
    scene.add(m);
    return m;
  });
  const twinkle = dustTex ? new Mesh(dustGeo, dustMat()) : null;
  if (twinkle) { twinkle.renderOrder = 5; scene.add(twinkle); }

  // ---- Toestand ---------------------------------------------------------
  const S = {
    yaw: -0.36, hover: HOVER, shift: -W / 2, cover: 0, spine: 0, dip: 0,
    tx: 0, tz: 0, elev: 0.92, dist: 5, plush: 0, plushA: 1, dust: 0,
  };
  let mode = 'closed'; // closed | busy | open
  let single = false; // telefoon rechtop: één bladzijde tegelijk
  let spread = 0;
  let side = 1; // alleen bij single: 0 links, 1 rechts
  let dirty = true;
  let visible = true;
  const pointer = { x: 0, y: 0 };
  const listeners = {};
  const emit = (n, d) => (listeners[n] || []).forEach((f) => f(d));
  const invalidate = () => (dirty = true);
  const dur = (d) => (reduced ? 0.001 : d);

  function size() {
    const r = container.getBoundingClientRect();
    return { w: Math.max(1, r.width), h: Math.max(1, r.height) };
  }

  // Zoekt de camera-afstand waarbij alle punten binnen de marge vallen.
  const up = new Vector3(0, 1, 0);
  const probe = new PerspectiveCamera();
  function fit(points, tx, tz, elev, mx, my) {
    const { w, h } = size();
    probe.fov = camera.fov;
    probe.aspect = w / h;
    probe.updateProjectionMatrix();
    let lo = 1, hi = 30;
    const v = new Vector3();
    for (let i = 0; i < 26; i++) {
      const d = (lo + hi) / 2;
      probe.position.set(tx, Math.sin(elev) * d, tz + Math.cos(elev) * d);
      probe.lookAt(tx, 0, tz);
      probe.updateMatrixWorld();
      let ok = true;
      for (const p of points) {
        v.copy(p).project(probe);
        if (Math.abs(v.x) > mx || v.y > my.top || v.y < -my.bottom) { ok = false; break; }
      }
      ok ? (hi = d) : (lo = d);
    }
    return hi;
  }
  const box = (x0, x1, y = 0.1) => [
    new Vector3(x0, y, -H / 2), new Vector3(x1, y, -H / 2), new Vector3(x0, y, H / 2), new Vector3(x1, y, H / 2),
  ];

  function closedPose() {
    const elev = 0.92;
    const pts = box(-0.72, 0.72, HOVER + 0.1);
    if (single) pts.push(new Vector3(0, 0, 1.2));
    const tz = single ? 0.14 : 0.04;
    // Op de telefoon blijft boven het boek ruimte voor de titel.
    const d = fit(pts, 0, tz, elev, single ? 0.84 : 0.46, { top: single ? 0.46 : 0.6, bottom: single ? 0.7 : 0.62 });
    return { tx: 0, tz, elev, dist: d };
  }
  function readPose(sd = side) {
    const elev = single ? 1.36 : 1.3;
    const x0 = single ? (sd ? 0 : -W - T) : -W - T - OVER;
    const x1 = single ? (sd ? W : -T) : W + OVER;
    const tx = (x0 + x1) / 2;
    const tz = single ? 0.02 : 0.03;
    const d = fit(box(x0, x1), tx, tz, elev, single ? 0.93 : 0.86, single ? { top: 0.8, bottom: 0.7 } : { top: 0.74, bottom: 0.76 });
    return { tx, tz, elev, dist: d };
  }

  function apply(time) {
    const idle = mode === 'closed' && !reduced;
    const bob = idle ? Math.sin(time * 1.3) * 0.012 : 0;
    rig.rotation.y = S.yaw + (idle ? pointer.x * 0.1 : 0);
    rig.rotation.x = idle ? pointer.y * 0.04 : 0;
    rig.position.y = T / 2 + TC + S.hover + bob - S.dip;
    lay.position.x = S.shift;
    spineG.rotation.y = S.spine;
    coverG.rotation.y = S.cover;

    for (let k = 0; k < SHEETS; k++) {
      const s = sheets[k];
      const p = s.p;
      const e = p * p * (3 - 2 * p);
      s.mesh.position.z = MathUtils.lerp(zRight(k), zLeft(k), e);
      const a0 = Math.PI * p;
      const c = 0.58 * Math.sin(Math.PI * p);
      let prev = 0;
      for (let i = 0; i < SEG; i++) {
        const t = i / (SEG - 1);
        const a = MathUtils.clamp(a0 + c * (2 * t - 1), 0, Math.PI);
        s.bones[i].rotation.y = -(a - prev);
        prev = a;
      }
    }

    plush.forEach((m) => {
      const u = m.userData;
      const dir = Math.sign(u.home);
      m.position.x = u.home + dir * S.plush;
      m.position.y = u.baseY + u.jump;
      m.rotation.z = u.tilt;
      m.material.opacity = S.plushA;
      m.visible = S.plushA > 0.01;
      u.blob.position.set(m.position.x, 0.004, m.position.z + 0.06);
      u.blob.material.opacity = S.plushA * (1 - Math.min(0.7, u.jump * 3));
      u.blob.visible = m.visible;
    });

    camera.position.set(S.tx, Math.sin(S.elev) * S.dist, S.tz + Math.cos(S.elev) * S.dist);
    camera.lookAt(S.tx, 0, S.tz);
    // Het stofje kijkt altijd naar de camera.
    for (const m of motes) {
      const u = m.userData;
      const q = MathUtils.clamp((S.dust * 1.25 - u.delay) / 1, 0, 1);
      m.visible = q > 0.001 && q < 0.999;
      if (!m.visible) continue;
      m.material.opacity = Math.sin(Math.PI * q) * 0.95;
      m.scale.setScalar(u.size * (0.6 + 0.7 * q));
      m.position.set(S.shift + 0.45 + u.dx * q, 0.18 + u.dy * q, u.dz * q);
      m.quaternion.copy(camera.quaternion);
    }
    if (twinkle) {
      const show = mode === 'closed';
      twinkle.visible = show;
      twinkle.material.opacity = show ? (reduced ? 0.85 : 0.65 + 0.3 * Math.sin(time * 2.1)) : 0;
      twinkle.scale.setScalar(0.2 * (reduced ? 1 : 0.9 + 0.16 * Math.sin(time * 2.1 + 1)));
      twinkle.position.set(0.5, 0, -H * 0.5).applyAxisAngle(up, rig.rotation.y).setY(rig.position.y + 0.1);
      twinkle.quaternion.copy(camera.quaternion);
    }
    // Krap dieptebereik rond het boek. Sommige telefoons meten diepte in maar
    // 16 bits, en dan schemert de kaft anders door de bladzijden heen.
    const near = Math.max(0.5, S.dist - 2.6);
    if (Math.abs(camera.near - near) > 0.05) {
      camera.near = near;
      camera.far = S.dist + 4;
      camera.updateProjectionMatrix();
    }
  }

  function resize() {
    const { w, h } = size();
    single = w / h < 0.85;
    plush.forEach((m) => {
      const [x, z] = single ? m.userData.tall : m.userData.wide;
      m.userData.home = x;
      m.position.z = z;
    });
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (mode === 'closed') Object.assign(S, closedPose());
    if (mode === 'open') Object.assign(S, readPose());
    invalidate();
  }

  let raf = 0;
  const t0 = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!visible) return;
    if (!dirty && !(mode === 'closed' && !reduced)) return;
    dirty = false;
    apply((now - t0) / 1000);
    renderer.render(scene, camera);
  }

  // ---- Bewegingen -------------------------------------------------------
  // Openen in 1,2 s. Zie STORYBOARD.md voor de vijf standen.
  function openTimeline() {
    const to = readPose(1);
    const tl = gsap.timeline({ paused: true, onUpdate: invalidate });
    tl.to(S, { dip: 0.035, duration: 0.12, ease: 'power2.out' }, 0);
    tl.to(S, { dip: 0, duration: 0.3, ease: 'power2.inOut' }, 0.12);
    tl.to(S, { yaw: 0, duration: 0.6, ease: 'power2.out' }, 0);
    tl.to(S, { shift: 0, duration: 0.85, ease: 'power2.inOut' }, 0.15);
    tl.to(S, { hover: 0, duration: 0.75, ease: 'power2.inOut' }, 0.3);
    tl.to(S, { cover: -Math.PI / 2, duration: 0.56, ease: 'power2.in' }, 0.06);
    tl.to(S, { spine: -Math.PI / 2, duration: 0.46, ease: 'power2.out' }, 0.6);
    // Eén keer licht naveren.
    tl.to(S, { spine: -Math.PI / 2 + 0.05, duration: 0.07, ease: 'sine.out' }, 1.06);
    tl.to(S, { spine: -Math.PI / 2, duration: 0.07, ease: 'sine.in' }, 1.13);
    tl.to(S, { tx: to.tx, tz: to.tz, elev: to.elev, dist: to.dist, duration: 0.9, ease: 'power2.inOut' }, 0.3);
    // Het betoverende stofje stuift op zodra de kaft loskomt.
    tl.fromTo(S, { dust: 0 }, { dust: 1, duration: 1.0, ease: 'power1.out' }, 0.28);
    tl.to(S, { plush: 0.9, duration: 0.8, ease: 'power2.in' }, 0.15);
    tl.to(S, { plushA: 0, duration: 0.35, ease: 'none' }, 0.55);
    return tl;
  }

  function setOpenInstant(s, sd = 1) {
    Object.assign(S, { yaw: 0, hover: 0, shift: 0, dip: 0, cover: -Math.PI / 2, spine: -Math.PI / 2, plush: 0.9, plushA: 0, dust: 0 });
    spread = s;
    side = sd;
    sheets.forEach((sh, k) => (sh.p = k < s ? 1 : 0));
    Object.assign(S, readPose());
    mode = 'open';
    setWindow(s);
    emit('change', state());
  }

  function open() {
    if (mode !== 'closed') return Promise.resolve();
    gsap.killTweensOf(S);
    Object.assign(S, closedPose(), { yaw: -0.36 });
    mode = 'busy';
    emit('change', state());
    setWindow(0);
    return new Promise((res) => {
      const tl = openTimeline();
      tl.eventCallback('onComplete', () => {
        mode = 'open';
        spread = 0;
        side = 1;
        emit('change', state());
        res();
      });
      reduced ? tl.progress(1) : tl.play();
    });
  }

  function close() {
    if (mode !== 'open') return Promise.resolve();
    mode = 'busy';
    emit('change', state());
    const to = closedPose();
    return new Promise((res) => {
      const tl = gsap.timeline({ onUpdate: invalidate, onComplete: () => {
        mode = 'closed'; spread = 0; side = 1; emit('change', state()); res();
      } });
      const turned = sheets.filter((s) => s.p > 0);
      turned.reverse().forEach((s, i) => tl.to(s, { p: 0, duration: dur(0.45), ease: 'power2.inOut' }, i * dur(0.05)));
      const t = turned.length ? dur(0.35) : 0;
      tl.to(S, { spine: 0, duration: dur(0.45), ease: 'power2.in' }, t);
      tl.to(S, { cover: 0, duration: dur(0.5), ease: 'power2.out' }, t + dur(0.4));
      tl.to(S, { yaw: -0.36, hover: HOVER, shift: -W / 2, plush: 0, plushA: 1, duration: dur(0.9), ease: 'power2.inOut' }, t);
      tl.to(S, { ...to, duration: dur(0.9), ease: 'power2.inOut' }, t);
    });
  }

  // Slaat vellen om tot spread `target`. Meerdere vellen bladeren kort na
  // elkaar, samen nooit langer dan 1,5 s.
  function turnTo(target, sd = 1) {
    target = MathUtils.clamp(target, 0, SHEETS);
    if (mode !== 'open') return Promise.resolve();
    const fwd = target > spread;
    const list = [];
    if (fwd) for (let k = spread; k < target; k++) list.push(k);
    else for (let k = spread - 1; k >= target; k--) list.push(k);
    const pose = single ? readPose(sd) : null;
    if (!list.length) {
      side = sd;
      if (pose) gsap.to(S, { ...pose, duration: dur(0.45), ease: 'power2.inOut', onUpdate: invalidate });
      emit('change', state());
      return Promise.resolve();
    }
    mode = 'busy';
    setWindow(target, list);
    const one = list.length === 1 ? 0.6 : 0.5;
    const gap = list.length > 1 ? Math.min(0.11, (1.5 - one) / (list.length - 1)) : 0;
    return new Promise((res) => {
      const tl = gsap.timeline({ onUpdate: invalidate, onComplete: () => {
        spread = target; side = sd; mode = 'open'; setWindow(target); emit('change', state()); res();
      } });
      list.forEach((k, i) => tl.to(sheets[k], { p: fwd ? 1 : 0, duration: dur(one), ease: 'power1.inOut' }, dur(i * gap)));
      if (pose) tl.to(S, { ...pose, duration: dur(0.55), ease: 'power2.inOut' }, 0);
    });
  }

  function next() {
    if (mode !== 'open') return;
    if (single && side === 0) return turnTo(spread, 1);
    if (spread >= SHEETS) return;
    return turnTo(spread + 1, single ? 0 : 1);
  }
  function prev() {
    if (mode !== 'open') return;
    if (single && side === 1) return turnTo(spread, 0);
    if (spread <= 0) return;
    return turnTo(spread - 1, 1);
  }

  // Een figuurtje springt op als je erop tikt.
  function hop(i) {
    const u = plush[i]?.userData;
    if (!u || reduced || gsap.isTweening(u)) return;
    gsap.timeline({ onUpdate: invalidate })
      .to(u, { jump: 0.22, duration: 0.22, ease: 'power2.out' })
      .to(u, { jump: 0, duration: 0.42, ease: 'bounce.out' })
      .to(u, { tilt: i ? -0.16 : 0.12, duration: 0.16, ease: 'sine.out' }, 0)
      .to(u, { tilt: 0, duration: 0.4, ease: 'sine.inOut' }, 0.16);
  }

  const state = () => ({ mode, spread, side, single, sheets: SHEETS });

  // ---- Aanwijzen --------------------------------------------------------
  const ray = new Raycaster();
  const ndc = new Vector2();
  function setRay(cx, cy) {
    const r = renderer.domElement.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
  }
  // Raakpunt op het vlak van de bovenste bladzijde, als uv van die bladzijde.
  function pageHit(cx, cy) {
    setRay(cx, cy);
    const rightTop = spread < SHEETS ? zRight(spread) : -T / 2 + TB;
    const leftTop = spread > 0 ? zLeft(spread - 1) : -T / 2;
    const out = new Vector3();
    for (const [sd, z] of [[1, rightTop], [0, leftTop]]) {
      const y = T / 2 + TC + z; // wereldhoogte van dat vlak
      if (!ray.ray.intersectPlane(new Plane(new Vector3(0, 1, 0), -y), out)) continue;
      const u = sd ? out.x / W : (out.x + W) / W;
      const v = (out.z + H / 2) / H;
      if (u >= 0 && u <= 1 && v >= 0 && v <= 1) return { side: sd, u, v };
    }
    return null;
  }
  function plushHit(cx, cy) {
    setRay(cx, cy);
    const hit = ray.intersectObjects(plush.filter((m) => m.visible))[0];
    return hit ? hit.object.userData.index : -1;
  }
  // Schermpositie van een punt op de rechterbladzijde (voor tests en focus).
  function pagePoint(u, v) {
    const p = new Vector3(u * W, T / 2 + TC + (spread < SHEETS ? zRight(spread) : -T / 2 + TB), v * H - H / 2).project(camera);
    const r = renderer.domElement.getBoundingClientRect();
    return { x: r.left + ((p.x + 1) / 2) * r.width, y: r.top + ((1 - p.y) / 2) * r.height };
  }

  // Slepen aan een bladzijde.
  let drag = null;
  function dragStart(dir) {
    if (mode !== 'open') return false;
    const needsSheet = dir > 0 ? !(single && side === 0) && spread < SHEETS : !(single && side === 1) && spread > 0;
    if (!needsSheet) return false;
    const k = dir > 0 ? spread : spread - 1;
    setWindow(dir > 0 ? spread + 1 : spread - 1, [k, spread, spread - 1]);
    drag = { dir, k, from: sheets[k].p };
    mode = 'busy';
    return true;
  }
  function dragMove(frac) {
    if (!drag) return;
    const s = sheets[drag.k];
    s.p = MathUtils.clamp(drag.dir > 0 ? frac : 1 - frac, 0, 1);
    invalidate();
  }
  function dragEnd(commit) {
    if (!drag) return;
    const d = drag;
    drag = null;
    const s = sheets[d.k];
    const target = commit ? (d.dir > 0 ? 1 : 0) : d.from;
    const newSpread = commit ? spread + d.dir : spread;
    const newSide = commit ? (single ? (d.dir > 0 ? 0 : 1) : 1) : side;
    const pose = single && commit ? readPose(newSide) : null;
    const tl = gsap.timeline({ onUpdate: invalidate, onComplete: () => {
      spread = newSpread; side = newSide; mode = 'open'; setWindow(spread); emit('change', state());
    } });
    tl.to(s, { p: target, duration: dur(0.15 + 0.4 * Math.abs(target - s.p)), ease: 'power2.out' }, 0);
    if (pose) tl.to(S, { ...pose, duration: dur(0.5), ease: 'power2.inOut' }, 0);
  }

  // ---- Start ------------------------------------------------------------
  const ro = new ResizeObserver(resize);
  ro.observe(container);
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting && !document.hidden; invalidate(); });
  io.observe(container);
  document.addEventListener('visibilitychange', () => { visible = !document.hidden; invalidate(); });
  resize();
  setWindow(0);
  raf = requestAnimationFrame(frame);

  // Camera komt eenmalig tot rust voor het boek.
  function intro() {
    if (reduced || mode !== 'closed') return;
    const to = closedPose();
    gsap.fromTo(S, { dist: to.dist * 1.22, elev: to.elev - 0.16, yaw: -0.62 }, { dist: to.dist, elev: to.elev, yaw: -0.36, duration: 1.5, ease: 'power3.out', onUpdate: invalidate });
  }

  return {
    el: renderer.domElement,
    on: (n, f) => ((listeners[n] ||= []).push(f)),
    state, open, close, next, prev, turnTo, setOpenInstant, intro, hop,
    pageHit, plushHit, pagePoint, dragStart, dragMove, dragEnd,
    setPointer: (x, y) => { pointer.x = x; pointer.y = y; },
    // Voor de controle: zet de openingsbeweging stil op tijdstip t.
    seekOpen(t) {
      gsap.globalTimeline.clear();
      mode = 'closed';
      Object.assign(S, { yaw: -0.36, hover: HOVER, shift: -W / 2, cover: 0, spine: 0, dip: 0, plush: 0, plushA: 1, dust: 0 }, closedPose());
      sheets.forEach((s) => (s.p = 0));
      mode = 'busy';
      openTimeline().time(t);
      apply(0);
      renderer.render(scene, camera);
    },
    renderNow() { apply(0); renderer.render(scene, camera); },
    dispose() { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); renderer.dispose(); },
  };
}
