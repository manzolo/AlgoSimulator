// The signature canvas of the data-structures floor, modelled on EDU-OS's
// memView (inject-once styles + onEvent + a finalize(result) turbo path). Three
// looks, one component, switched by the input event's `mode`:
//
//   tree — an SVG binary tree; the node being compared pulses amber, a freshly
//          placed node flashes green, a rotation redraws the reshaped subtree.
//   heap — a pyramid of array cells; a sift swap flashes the two cells, the pop
//          phase drains the heap from the root.
//   hash — buckets (chaining: a column list; open addressing: a row of slots);
//          a probe pulses the slot, a store drops the key in.
//
// Driven entirely by engine events (see executor.js); every mutating event
// carries a fresh snapshot (a tree, an array, a table), so a redraw is exact.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const css = `
.sv-host { padding: 0.7rem; overflow: auto; min-height: 240px; max-height: 46vh;
  background: var(--screen,#07130c); border: 2px solid var(--screen-edge,#030805); border-radius: 8px;
  box-shadow: inset 0 2px 14px rgb(0 0 0 / 0.7); }
.sv-empty { color: var(--phosphor-dim,#5d8f74); font-family: var(--mono,monospace); font-size: 0.82rem; padding: 0.4rem; }
.sv-svg { display: block; margin: 0 auto; }
.sv-edge { stroke: var(--phosphor-dim,#5d8f74); stroke-width: 1.4; }
.sv-node circle { fill: var(--screen-2,#0a1a10); stroke: var(--phosphor-dim,#5d8f74); stroke-width: 1.6; transition: fill .18s, stroke .18s; }
.sv-node text { fill: var(--phosphor-soft,#b9f0d3); font-family: var(--mono,monospace); font-size: 12px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.sv-node.cmp circle { stroke: var(--amber,#e4b04a); stroke-width: 2.4; fill: rgb(228 176 74 / 0.18); }
.sv-node.flash circle { fill: rgb(147 232 187 / 0.55); stroke: var(--phosphor,#93e8bb); animation: svflash .5s ease; }
@keyframes svflash { 0% { fill: rgb(147 232 187 / 0.8); } 100% { } }
.sv-rows { display: flex; flex-direction: column; gap: 0.5rem; align-items: center; }
.sv-row { display: flex; gap: 0.4rem; justify-content: center; }
.sv-cell { min-width: 2.1rem; height: 2.1rem; padding: 0 0.35rem; display: inline-flex; align-items: center; justify-content: center;
  background: var(--screen-2,#0a1a10); border: 1px solid rgb(147 232 187 / 0.25); border-radius: 6px;
  color: var(--phosphor-soft,#b9f0d3); font-family: var(--mono,monospace); font-size: 0.92rem; font-weight: 700; }
.sv-cell.flash { animation: svcell .5s ease; border-color: var(--phosphor,#93e8bb); }
@keyframes svcell { 0% { background: rgb(147 232 187 / 0.6); } 100% { } }
.sv-buckets { display: flex; gap: 0.35rem; align-items: flex-start; flex-wrap: wrap; }
.sv-bucket { display: flex; flex-direction: column; gap: 0.25rem; align-items: stretch; min-width: 2.2rem; }
.sv-bno { font-family: var(--mono,monospace); font-size: 0.56rem; color: var(--phosphor-dim,#5d8f74); text-align: center; }
.sv-slot { min-height: 1.9rem; display: flex; align-items: center; justify-content: center; border-radius: 6px;
  background: rgb(147 232 187 / 0.05); border: 1px solid rgb(147 232 187 / 0.18); color: var(--phosphor-dim,#5d8f74);
  font-family: var(--mono,monospace); font-size: 0.85rem; font-weight: 700; padding: 0.15rem 0.3rem; }
.sv-slot.full { background: rgb(147 232 187 / 0.16); border-color: rgb(147 232 187 / 0.4); color: var(--phosphor-soft,#b9f0d3); }
.sv-slot.probe { border-color: var(--amber,#e4b04a); box-shadow: 0 0 8px rgb(228 176 74 / 0.5); }
.sv-slot.flash { animation: svcell .5s ease; }
.sv-chain { display: flex; flex-direction: column; gap: 0.2rem; }
@media (prefers-reduced-motion: reduce) { .sv-node, .sv-cell, .sv-slot { animation: none !important; transition: none !important; } }`;
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
}

export function createStructView(container) {
  injectStyles();
  container.classList.add('sv-host');

  let mode = null;
  let tree = null; let cmpKey = null; let flashKey = null;
  let heap = []; let heapFlash = [];
  let capacity = 0; let probe = null; let table = []; let probeSlot = -1; let storeSlot = -1;

  function clear() {
    mode = null; tree = null; cmpKey = null; flashKey = null;
    heap = []; heapFlash = []; capacity = 0; table = []; probeSlot = -1; storeSlot = -1;
    container.innerHTML = `<div class="sv-empty">Run a build to watch the structure grow.</div>`;
  }

  // ---- tree ---------------------------------------------------------------

  function layout(node, depth, xref, out) {
    if (!node) return;
    layout(node.l, depth + 1, xref, out);
    const x = xref.i++;
    out.push({ k: node.k, x, depth, node });
    layout(node.r, depth + 1, xref, out);
  }

  function renderTree() {
    if (!tree) { container.innerHTML = `<div class="sv-empty">Insert the first key…</div>`; return; }
    const out = []; layout(tree, 0, { i: 0 }, out);
    const gapX = 38; const gapY = 52; const pad = 24;
    const maxDepth = Math.max(...out.map((n) => n.depth));
    const w = out.length * gapX + pad * 2;
    const h = (maxDepth + 1) * gapY + pad * 2;
    const px = (n) => pad + n.x * gapX + gapX / 2;
    const py = (n) => pad + n.depth * gapY + gapY / 2;
    const byKey = new Map(out.map((n) => [n.k, n]));
    const edges = [];
    for (const n of out) {
      for (const child of [n.node.l, n.node.r]) {
        if (child) { const c = byKey.get(child.k); if (c) edges.push([px(n), py(n), px(c), py(c)]); }
      }
    }
    const edgeSvg = edges.map(([x1, y1, x2, y2]) => `<line class="sv-edge" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`).join('');
    const nodeSvg = out.map((n) => {
      const cls = n.k === cmpKey ? 'cmp' : n.k === flashKey ? 'flash' : '';
      return `<g class="sv-node ${cls}"><circle cx="${px(n)}" cy="${py(n)}" r="15"/><text x="${px(n)}" y="${py(n)}">${esc(n.k)}</text></g>`;
    }).join('');
    container.innerHTML = `<svg class="sv-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${edgeSvg}${nodeSvg}</svg>`;
  }

  // ---- heap ---------------------------------------------------------------

  function renderHeap() {
    if (!heap.length) { container.innerHTML = `<div class="sv-empty">Building the heap…</div>`; return; }
    const rows = [];
    let i = 0; let lvl = 1;
    while (i < heap.length) {
      const row = heap.slice(i, i + lvl);
      rows.push(row.map((v, j) => {
        const idx = i + j;
        const fl = heapFlash.includes(idx) ? ' flash' : '';
        return `<div class="sv-cell${fl}">${esc(v)}</div>`;
      }).join(''));
      i += lvl; lvl *= 2;
    }
    container.innerHTML = `<div class="sv-rows">${rows.map((r) => `<div class="sv-row">${r}</div>`).join('')}</div>`;
  }

  // ---- hash ---------------------------------------------------------------

  function renderHash() {
    const cols = [];
    for (let s = 0; s < capacity; s++) {
      const entry = table[s];
      const cls = s === probeSlot ? ' probe' : s === storeSlot ? ' flash' : '';
      let inner;
      if (probe === 'chain') {
        const chain = Array.isArray(entry) ? entry : [];
        if (!chain.length) {
          inner = `<div class="sv-slot${cls}">·</div>`;
        } else {
          inner = `<div class="sv-chain">${chain.map((k, ci) => {
            const last = ci === chain.length - 1;
            const ecls = s === probeSlot ? ' probe' : (last && s === storeSlot) ? ' flash' : '';
            return `<div class="sv-slot full${ecls}">${esc(k)}</div>`;
          }).join('')}</div>`;
        }
      } else {
        inner = `<div class="sv-slot ${entry != null ? 'full' : ''}${cls}">${entry != null ? esc(entry) : '·'}</div>`;
      }
      cols.push(`<div class="sv-bucket"><div class="sv-bno">${s}</div>${inner}</div>`);
    }
    container.innerHTML = `<div class="sv-buckets">${cols.join('')}</div>`;
  }

  clear();

  return {
    clear,
    onEvent(evt) {
      switch (evt.type) {
        case 'input':
          mode = evt.mode;
          if (mode === 'tree') { tree = null; cmpKey = flashKey = null; renderTree(); }
          else if (mode === 'heap') { heap = []; renderHeap(); }
          else if (mode === 'hash') { renderHash(); }
          break;
        case 'compare': cmpKey = evt.at; flashKey = null; tree = evt.tree; renderTree(); break;
        case 'settle': cmpKey = null; flashKey = evt.key; tree = evt.tree; renderTree(); break;
        case 'push': heap = evt.arr; heapFlash = [heap.length - 1]; renderHeap(); break;
        case 'sift': heap = evt.arr; heapFlash = [evt.i, evt.j]; renderHeap(); break;
        case 'pop': heap = evt.arr; heapFlash = []; renderHeap(); break;
        case 'hash-init': capacity = evt.capacity; probe = evt.probe; table = new Array(capacity).fill(probe === 'chain' ? undefined : null); probeSlot = storeSlot = -1; renderHash(); break;
        case 'probe': probeSlot = evt.slot; storeSlot = -1; renderHash(); break;
        case 'store': probeSlot = -1; storeSlot = evt.slot; table = evt.table; renderHash(); break;
        default: break;
      }
    },
    finalize(result) {
      if (!result) return;
      if (result.mode === 'tree') { mode = 'tree'; tree = result.tree; cmpKey = flashKey = null; renderTree(); }
      else if (result.mode === 'heap') { mode = 'heap'; heap = result.arr.slice(); heapFlash = []; renderHeap(); }
      else if (result.mode === 'hash') { mode = 'hash'; capacity = result.capacity; probe = result.probe; table = result.table.slice(); probeSlot = storeSlot = -1; renderHash(); }
    },
  };
}
