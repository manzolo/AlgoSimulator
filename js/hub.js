// Learning-path hub: one card per floor, with a progress badge read from each
// floor's own localStorage namespace, and a from-zero beginner primer that
// auto-opens on the first visit. Uses the same shared i18n/storage machinery as
// the floors, so the language choice follows the visitor across the site.

import { registerDicts, initLang, setLang, getLang, t, tr, refreshStatic, onLangChange } from './shared/i18n.js';
import { readProgress, createStore } from './shared/storage.js';
import { INTRO } from './strings/intro.js';

const dicts = {
  en: {
    tagline: 'the classic structures and algorithms, one step at a time',
    heroTitle: 'How does a computer <em>organise</em> and <em>search</em> data?',
    heroText: 'Two floors, two hand-written engines, zero libraries. Grow a tree, a heap or a hash table key by key, or send a search across a graph — and watch every comparison, rotation, probe and settled node unfold step by step. Guided levels with automatic checking, plus a free sandbox.',
    navIntro: 'Basics',
    introTitle: 'New to data structures and algorithms? Start here',
    introStart: 'Start on the first floor →',
    enter: 'Enter',
    demo: 'interactive',
    progressOf: '{0} of {1} levels',
    completeBadge: 'complete!',
    footnote: 'An open-source teaching project — part of the EDU-* series, built out of curiosity.',
    dstructTitle: 'Data structures',
    dstructDesc: 'Build a binary search tree and a self-balancing AVL, a binary heap (insert vs heapify), and a hash table (chaining, linear and quadratic probing) — and see why the shape decides the speed.',
    graphTitle: 'Graph algorithms',
    graphDesc: 'Send a search across a graph: breadth-first for fewest hops, depth-first, Dijkstra for cheapest by weight, and A* guided by a heuristic — and watch the frontier spread and the path light up.',
  },
  it: {
    tagline: 'le strutture e gli algoritmi classici, un passo alla volta',
    heroTitle: 'Come fa un computer a <em>organizzare</em> e <em>cercare</em> i dati?',
    heroText: 'Due piani, due motori scritti a mano, zero librerie. Fai crescere un albero, un heap o una tabella hash chiave dopo chiave, oppure lancia una ricerca su un grafo — e guarda ogni confronto, rotazione, probe e nodo sistemato svolgersi passo per passo. Livelli guidati con verifica automatica, più una sandbox libera.',
    navIntro: 'Basi',
    introTitle: 'Mai visto strutture dati e algoritmi? Parti da qui',
    introStart: 'Inizia dal primo piano →',
    enter: 'Entra',
    demo: 'interattivo',
    progressOf: '{0} livelli su {1}',
    completeBadge: 'completato!',
    footnote: 'Un progetto didattico open source — parte della collana EDU-*, nato per curiosità.',
    dstructTitle: 'Strutture dati',
    dstructDesc: 'Costruisci un albero binario di ricerca e un AVL auto-bilanciante, un heap binario (insert vs heapify) e una tabella hash (concatenamento, probing lineare e quadratico) — e vedi perché la forma decide la velocità.',
    graphTitle: 'Algoritmi su grafi',
    graphDesc: 'Lancia una ricerca su un grafo: in ampiezza per i minori salti, in profondità, Dijkstra per il più economico per peso, e A* guidato da un\'euristica — e guarda la frontiera espandersi e il cammino accendersi.',
  },
};

registerDicts(dicts);
initLang();

const FLOORS = [
  { href: 'dstruct/', icon: '◇', title: 'dstructTitle', desc: 'dstructDesc', progressPrefix: 'dstruct.', total: 12 },
  { href: 'graph/', icon: '◈', title: 'graphTitle', desc: 'graphDesc', progressPrefix: 'graph.', total: 12 },
];

function renderFloors() {
  const el = document.getElementById('floors');
  el.innerHTML = FLOORS.map((f, i) => {
    const done = readProgress(f.progressPrefix).size;
    const badge = done >= f.total
      ? `<span class="floor-progress complete">✓ ${t('completeBadge')}</span>`
      : `<span class="floor-progress">${t('progressOf', done, f.total)}</span>`;
    return `
    <a class="floor" href="${f.href}">
      <span class="floor-num">${String(i + 1).padStart(2, '0')}</span>
      <span class="floor-icon" aria-hidden="true">${f.icon}</span>
      <span class="floor-body">
        <span class="floor-title">${t(f.title)}</span>
        <span class="floor-desc">${t(f.desc)}</span>
      </span>
      <span class="floor-cta">${badge}<span class="btn btn-primary">${t('enter')} →</span></span>
    </a>`;
  }).join('');
}

const langButtons = document.querySelectorAll('.lang-switch button');
function markLang() { langButtons.forEach((b) => b.classList.toggle('active', b.dataset.lang === getLang())); }
langButtons.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

const store = createStore('edu.');
const introOverlay = document.getElementById('introOverlay');
function renderIntro() {
  document.getElementById('introTitle').textContent = t('introTitle');
  document.getElementById('introBody').innerHTML = tr(INTRO);
  document.getElementById('introStart').textContent = t('introStart');
}
function openIntro() {
  renderIntro();
  introOverlay.hidden = false;
  introOverlay.querySelector('.modal').scrollTop = 0;
}
function closeIntro() {
  introOverlay.hidden = true;
  store.set('introSeen', '1');
}
document.getElementById('btnIntro').addEventListener('click', openIntro);
document.getElementById('introClose').addEventListener('click', closeIntro);
document.getElementById('introStart').addEventListener('click', () => { closeIntro(); window.location.href = 'dstruct/'; });
introOverlay.addEventListener('click', (e) => { if (e.target === introOverlay) closeIntro(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !introOverlay.hidden) closeIntro(); });

onLangChange(() => {
  markLang();
  renderFloors();
  if (!introOverlay.hidden) renderIntro();
});

refreshStatic();
markLang();
renderFloors();

if (!store.get('introSeen')) openIntro();
