// Besturing van de pagina. Het 3D boek wordt pas geladen nadat het
// stilstaande beeld er staat, zodat het eerste beeld er meteen is.
import { book as meta, stories, locked, SHEETS, storyStartSpread, storyOfSpread } from './content.js';
import { tocItems } from './pages.js';

const $ = (id) => document.getElementById(id);
const hero = $('boek');
const stage = $('stage');
const ui = $('ui');
const params = new URLSearchParams(location.search);
const still = params.has('still');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || params.has('reduced');
if (still) document.body.classList.add('still');

// ---- De verhalen als gewone tekst (altijd in de pagina) -----------------
$('lezen').innerHTML =
  stories
    .map(
      (s) => `<article id="tekst-${s.slug}"><h2>${s.title}</h2>${s.pages
        .map((p) => p.text.map((t) => `<p>${t}</p>`).join(''))
        .join('')}</article>`,
    )
    .join('') +
  `<p class="more">In het boek staan nog ${locked.length} verhalen: ${locked.map((l) => l.title).join(', ')}. <a href="${meta.buyUrl}">Bestel het boek</a></p>`;

$('keys').innerHTML =
  `<a href="#inhoud">Inhoud</a>` + stories.map((s) => `<a href="#${s.slug}">${s.title}</a>`).join('');

// ---- Leesmodus ----------------------------------------------------------
const modeBtn = $('mode');
function setTextMode(on) {
  document.body.classList.toggle('textmode', on);
  modeBtn.setAttribute('aria-pressed', String(on));
  modeBtn.textContent = on ? 'Terug naar het boek' : 'Leesmodus';
}
modeBtn.addEventListener('click', () => setTextMode(!document.body.classList.contains('textmode')));

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

// ---- Adres --------------------------------------------------------------
function parseRoute() {
  const h = location.hash;
  if (h === '#inhoud') return { kind: 'toc' };
  const i = stories.findIndex((s) => h === '#' + s.slug);
  if (i >= 0) return { kind: 'story', i };
  if (h === '' || h === '#' || h === '#boek') return { kind: 'closed' };
  return null; // een gewoon anker, zoals #winkel
}
function routeOf(st) {
  if (st.mode === 'closed') return '';
  const i = storyOfSpread(st.spread);
  return i >= 0 ? `#${stories[i].slug}` : '#inhoud';
}

let book = null;
let lastRoute = null;

let routing = false;
function syncAddress(st) {
  if (st.mode === 'busy' || routing) return;
  const r = routeOf(st);
  if (r === lastRoute) return;
  const url = location.pathname + location.search + r;
  // Een nieuw verhaal of de inhoud komt in de geschiedenis, zodat terug werkt.
  lastRoute === null ? history.replaceState(null, '', url) : history.pushState(null, '', url);
  lastRoute = r;
}

async function applyRoute() {
  const r = parseRoute();
  if (!r || !book) return;
  const st = book.state();
  if (st.mode === 'busy') return;
  routing = true;
  try {
    if (r.kind === 'closed') await book.close();
    else {
      setTextMode(false);
      if (st.mode === 'closed') await book.open();
      const target = r.kind === 'toc' ? 0 : storyStartSpread(r.i);
      // Sta je al in dit verhaal, dan blijf je op je bladzijde.
      const here = r.kind === 'story' && storyOfSpread(book.state().spread) === r.i;
      if (!here && book.state().spread !== target) await go(target);
    }
  } finally {
    routing = false;
    lastRoute = routeOf(book.state());
    if (lastRoute !== location.hash) history.replaceState(null, '', location.pathname + location.search + lastRoute);
  }
}

// Bij "beweging verminderen": geen draaiende bladen, maar een korte overvloeier.
async function go(target, side) {
  const st = book.state();
  const sd = side ?? (st.single ? (target === 0 ? 1 : 0) : 1);
  if (!reduced) return book.turnTo(target, sd);
  hero.classList.add('fade');
  await new Promise((r) => setTimeout(r, 160));
  await book.turnTo(target, sd);
  hero.classList.remove('fade');
}
const step = (dir) => {
  if (!reduced) return dir > 0 ? book.next() : book.prev();
  hero.classList.add('fade');
  setTimeout(async () => {
    await (dir > 0 ? book.next() : book.prev());
    hero.classList.remove('fade');
  }, 160);
};

// ---- Knoppen bijwerken --------------------------------------------------
function render(st) {
  hero.classList.toggle('is-open', st.mode === 'open');
  hero.classList.toggle('is-busy', st.mode === 'busy');
  ui.hidden = st.mode === 'closed';
  if (st.mode === 'busy') return;
  const atStart = st.spread === 0 && (!st.single || st.side === 0);
  const atEnd = st.spread === SHEETS;
  $('prev').disabled = atStart;
  $('next').disabled = atEnd;

  const i = storyOfSpread(st.spread);
  const start = i >= 0 ? storyStartSpread(i) : -1;
  const lastOfStory = i >= 0 && st.spread === start + 1 && (!st.single || st.side === 1);
  const end = $('end');
  end.hidden = !(lastOfStory || atEnd) || st.mode !== 'open';
  hero.classList.toggle('at-end', !end.hidden);
  const nextStory = $('nextStory');
  if (lastOfStory && i + 1 < stories.length) {
    nextStory.hidden = false;
    nextStory.innerHTML = `<span class="long">Volgende: ${stories[i + 1].title}</span><span class="short">Volgende</span>`;
    nextStory.setAttribute('aria-label', `Volgende verhaal: ${stories[i + 1].title}`);
    nextStory.href = `#${stories[i + 1].slug}`;
  } else nextStory.hidden = true;

  const bar = $('progress');
  bar.hidden = i < 0;
  if (i >= 0) {
    const total = stories[i].pages.length;
    const read = st.single ? (st.spread - start) * 2 + st.side + 1 : (st.spread - start + 1) * 2;
    const pct = Math.round((Math.min(read, total) / total) * 100);
    bar.firstElementChild.style.width = pct + '%';
    bar.setAttribute('aria-valuenow', String(pct));
  }
  $('live').textContent =
    st.mode === 'closed' ? 'Het boek is dicht.' : i >= 0 ? `${stories[i].title}, ${st.spread - start + 1} van 2` : atEnd ? 'Einde van het boek.' : 'Inhoud';
  syncAddress(st);
}

// ---- Aanraken en slepen -------------------------------------------------
function bindPointer() {
  let down = null;
  stage.addEventListener('pointerdown', (e) => {
    if (e.button) return;
    down = { x: e.clientX, y: e.clientY, t: performance.now(), drag: false, moved: false, id: e.pointerId };
  });
  stage.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'mouse' && !down) {
      const r = stage.getBoundingClientRect();
      book.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    }
    if (!down || down.id !== e.pointerId) return;
    const dx = e.clientX - down.x;
    const dy = e.clientY - down.y;
    if (!down.moved && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
      down.moved = true;
      down.dir = dx < 0 ? 1 : -1;
      if (!reduced && book.dragStart(down.dir)) {
        down.drag = true;
        stage.setPointerCapture(e.pointerId);
      }
    }
    if (down.drag) {
      const st = book.state();
      const span = stage.clientWidth * (st.single ? 0.8 : 0.42);
      down.frac = Math.max(0, (-dx * down.dir) / span);
      book.dragMove(down.frac);
    }
  });
  const up = (e) => {
    if (!down || down.id !== e.pointerId) return;
    const d = down;
    down = null;
    const dx = e.clientX - d.x;
    const fast = performance.now() - d.t < 280 && Math.abs(dx) > 30;
    if (d.drag) return book.dragEnd((d.frac || 0) > 0.3 || fast);
    if (d.moved) {
      if (Math.abs(dx) > 40 && book.state().mode === 'open') step(d.dir);
      return;
    }
    if (e.type === 'pointerup') tap(e.clientX, e.clientY);
  };
  stage.addEventListener('pointerup', up);
  stage.addEventListener('pointercancel', up);
}

function tap(x, y) {
  const st = book.state();
  if (st.mode === 'busy') return;
  if (book.plushHit(x, y) >= 0) {
    location.hash = '#winkel';
    return;
  }
  if (st.mode === 'closed') return book.open();
  const hit = book.pageHit(x, y);
  if (!hit) return;
  if (st.spread === 0 && hit.side === 1) {
    const it = tocItems.find((t) => hit.u >= t.u0 && hit.u <= t.u1 && hit.v >= t.v0 && hit.v <= t.v1);
    if (!it) return;
    if (it.open) return go(storyStartSpread(it.index));
    return $('locked').showModal();
  }
  step(hit.side === 1 ? 1 : -1);
}

function bindKeys() {
  document.addEventListener('keydown', (e) => {
    if (!book || $('locked').open || document.body.classList.contains('textmode')) return;
    if (e.target.closest && e.target.closest('input, textarea, select')) return;
    const st = book.state();
    if (st.mode !== 'open') return;
    if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'Escape') book.close().then(() => $('open').focus());
    else return;
    e.preventDefault();
  });
  $('open').addEventListener('click', () => book && book.open().then(() => $('toc').focus({ preventScroll: true })));
  $('prev').addEventListener('click', () => step(-1));
  $('next').addEventListener('click', () => step(1));
  $('toc').addEventListener('click', () => go(0));
  $('close').addEventListener('click', () => book.close().then(() => $('open').focus({ preventScroll: true })));
  $('lockedClose').addEventListener('click', () => $('locked').close());
  $('lockedBuy').addEventListener('click', () => $('locked').close());
  window.addEventListener('hashchange', applyRoute);
}

// ---- Start --------------------------------------------------------------
async function start() {
  if (!hasWebGL()) {
    setTextMode(true);
    modeBtn.hidden = true;
    return;
  }
  // Het lettertype moet er zijn voordat de bladzijden getekend worden.
  await Promise.all([document.fonts.load('600 40px "Fraunces Variable"'), document.fonts.load('400 40px "Fraunces Variable"')]).catch(() => {});
  const { createBook } = await import('./book3d.js');
  book = createBook(stage, { reduced });
  book.on('change', render);
  bindPointer();
  bindKeys();

  const r = parseRoute();
  if (r && r.kind !== 'closed') {
    lastRoute = location.hash;
    book.setOpenInstant(r.kind === 'toc' ? 0 : storyStartSpread(r.i), r.kind === 'toc' ? 1 : book.state().single ? 0 : 1);
  } else {
    lastRoute = '';
    render(book.state());
  }
  book.renderNow();
  hero.classList.add('ready');

  let seen = false;
  try {
    seen = sessionStorage.getItem('briesje-intro') === '1';
    sessionStorage.setItem('briesje-intro', '1');
  } catch {}
  if (!seen && !still && book.state().mode === 'closed') book.intro();

  window.__briesje = {
    book,
    ready: true,
    tocPoint: (n) => {
      const t = tocItems[n];
      return book.pagePoint((t.u0 + t.u1) / 2, (t.v0 + t.v1) / 2);
    },
  };
}

const idle = window.requestIdleCallback || ((f) => setTimeout(f, 1));
idle(() => start());
