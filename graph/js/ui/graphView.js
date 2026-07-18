// The signature canvas of the graph floor: an SVG diagram of the graph laid out
// from each node's (x, y), edges drawn once with their weights, then animated
// straight from engine events — a node lights phosphor-green as it is settled,
// the one under the cursor pulses amber, and the final path glows along its
// edges. A finalize(result) turbo path rebuilds the end state at once.
//
// Layout is deterministic (positions come from the workload), so the picture is
// a pure function of the graph, exactly like the engine's trace.

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected) return;
  stylesInjected = true;
  const css = `
.gv-host { padding: 0.6rem; overflow: auto; min-height: 240px; max-height: 52vh;
  background: var(--screen,#07130c); border: 2px solid var(--screen-edge,#030805); border-radius: 8px;
  box-shadow: inset 0 2px 14px rgb(0 0 0 / 0.7); }
.gv-svg { display: block; margin: 0 auto; }
.gv-edge { stroke: var(--phosphor-dim,#5d8f74); stroke-width: 1.4; opacity: 0.55; transition: stroke .2s, opacity .2s; }
.gv-edge.path { stroke: var(--amber,#e4b04a); stroke-width: 3; opacity: 1; }
.gv-w { fill: var(--phosphor-dim,#5d8f74); font-family: var(--mono,monospace); font-size: 9px; }
.gv-node circle { fill: var(--screen-2,#0a1a10); stroke: var(--phosphor-dim,#5d8f74); stroke-width: 1.6; transition: fill .2s, stroke .2s; }
.gv-node text { fill: var(--phosphor-soft,#b9f0d3); font-family: var(--mono,monospace); font-size: 9px; font-weight: 700; text-anchor: middle; dominant-baseline: central; }
.gv-node.seen circle { fill: rgb(147 232 187 / 0.28); stroke: var(--phosphor,#93e8bb); }
.gv-node.cur circle { fill: rgb(228 176 74 / 0.35); stroke: var(--amber,#e4b04a); stroke-width: 2.6; }
.gv-node.path circle { fill: rgb(228 176 74 / 0.5); stroke: var(--amber,#e4b04a); stroke-width: 2.4; }
.gv-node.src circle { stroke-dasharray: 3 2; }
.gv-node.tgt circle { stroke-width: 2.6; stroke: var(--phosphor-soft,#b9f0d3); }
@media (prefers-reduced-motion: reduce) { .gv-node circle, .gv-edge { transition: none; } }`;
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
}

export function createGraphView(container) {
  injectStyles();
  container.classList.add('gv-host');

  let nodes = []; let edges = []; let pos = new Map();
  let source = null; let target = null;
  let seen = new Set(); let cur = null; let path = new Set(); let pathEdges = new Set();
  let layoutBox = null;

  function clear() {
    nodes = []; edges = []; pos = new Map(); source = target = null;
    seen = new Set(); cur = null; path = new Set(); pathEdges = new Set();
    container.innerHTML = `<div class="sv-empty" style="color:var(--phosphor-dim);font-family:var(--mono);font-size:0.82rem;padding:0.4rem">Run an algorithm to explore the graph.</div>`;
  }

  function setup(evt) {
    nodes = evt.nodes; edges = evt.edges; source = evt.source; target = evt.target;
    pos = new Map(nodes.map((n) => [n.id, { x: n.x, y: n.y }]));
    seen = new Set(); cur = null; path = new Set(); pathEdges = new Set();
    const xs = nodes.map((n) => n.x); const ys = nodes.map((n) => n.y);
    layoutBox = { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
    render();
  }

  function ekey(a, b) { return a < b ? `${a}|${b}` : `${b}|${a}`; }

  function render() {
    if (!nodes.length) return;
    const cols = (layoutBox.maxX - layoutBox.minX) + 1;
    const rows = (layoutBox.maxY - layoutBox.minY) + 1;
    const step = Math.max(30, Math.min(64, Math.round(520 / Math.max(cols, rows))));
    const r = Math.max(8, Math.min(16, step * 0.28));
    const pad = r + 8;
    const px = (id) => pad + (pos.get(id).x - layoutBox.minX) * step;
    const py = (id) => pad + (pos.get(id).y - layoutBox.minY) * step;
    const w = (cols - 1) * step + pad * 2;
    const h = (rows - 1) * step + pad * 2;

    const showW = edges.length <= 40 && step >= 34;
    const edgeSvg = edges.map((e) => {
      const on = pathEdges.has(ekey(e.a, e.b)) ? ' path' : '';
      const x1 = px(e.a); const y1 = py(e.a); const x2 = px(e.b); const y2 = py(e.b);
      const line = `<line class="gv-edge${on}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
      const label = showW ? `<text class="gv-w" x="${(x1 + x2) / 2 + 3}" y="${(y1 + y2) / 2 - 2}">${e.w}</text>` : '';
      return line + label;
    }).join('');

    const nodeSvg = nodes.map((n) => {
      let cls = '';
      if (path.has(n.id)) cls = 'path'; else if (n.id === cur) cls = 'cur'; else if (seen.has(n.id)) cls = 'seen';
      const role = n.id === source ? ' src' : n.id === target ? ' tgt' : '';
      const label = cols * rows <= 64 ? esc(n.id).replace(/^n0?/, '') || esc(n.id) : '';
      return `<g class="gv-node ${cls}${role}"><circle cx="${px(n.id)}" cy="${py(n.id)}" r="${r}"/>${label ? `<text x="${px(n.id)}" y="${py(n.id)}">${label}</text>` : ''}</g>`;
    }).join('');

    container.innerHTML = `<svg class="gv-svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${edgeSvg}${nodeSvg}</svg>`;
  }

  clear();

  return {
    clear,
    onEvent(evt) {
      switch (evt.type) {
        case 'input': setup(evt); break;
        case 'visit': if (cur != null) seen.add(cur); cur = evt.node; render(); break;
        case 'path': {
          if (cur != null) seen.add(cur); cur = null;
          path = new Set(evt.nodes);
          pathEdges = new Set();
          for (let i = 0; i + 1 < evt.nodes.length; i++) pathEdges.add(ekey(evt.nodes[i], evt.nodes[i + 1]));
          render();
          break;
        }
        default: break;
      }
    },
    finalize(result) {
      if (!result) return;
      // Rebuild the layout from the result (the per-event 'input' setup is skipped
      // in turbo, so nodes/edges/pos may still be empty here).
      if (result.nodes) {
        nodes = result.nodes; edges = result.edges; source = result.source; target = result.target;
        pos = new Map(nodes.map((n) => [n.id, { x: n.x, y: n.y }]));
        const xs = nodes.map((n) => n.x); const ys = nodes.map((n) => n.y);
        layoutBox = { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
      }
      seen = new Set(result.order); cur = null;
      path = new Set(result.path);
      pathEdges = new Set();
      for (let i = 0; i + 1 < result.path.length; i++) pathEdges.add(ekey(result.path[i], result.path[i + 1]));
      render();
    },
  };
}
