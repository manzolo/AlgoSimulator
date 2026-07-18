// The graph-traversal engine. Runs the level's fixed graph under the algorithm
// the user chose, settling ONE node per micro-op, and emits language-neutral
// events the UI animates (the frontier growing, edges relaxing, the final path
// lighting up) plus a canonical `result` the verifier checks. Generator-based:
// tick(emit) resumes _run() exactly once per settled node. No randomness, no
// DOM, no Date.now — same algorithm + same graph ⇒ the same trace.
//
// All four algorithms break ties DETERMINISTICALLY by node id, so the settle
// order, the distances and the reconstructed path are a pure function of input.
//
// Metrics the levels grade on:
//   hops      — edges on the path to the target (BFS minimises this)
//   pathCost  — summed edge weight on the path (Dijkstra / A* minimise this)
//   expanded  — nodes settled before the target is reached (A* prunes this)
//   order     — the node visit order (BFS vs DFS differ)
//
// Event vocabulary (each carries {time, seq} once emitted by the sim):
//   { type:'input', op, mode, nodes, edges, source, target, show }  set up display
//   { type:'note', code, args }                                     narration line
//   { type:'visit', node, dist }                 a node was settled / dequeued
//   { type:'relax', from, to, w }                an edge improved a neighbour
//   { type:'path', nodes, cost }                 the final path (highlighted)
//   { type:'done', text }                        terminal; result is complete

export class GraphExecutor {
  constructor(config, setup = {}) {
    this.config = config;
    this.done = false;
    this.error = null;
    this.buildError = null;
    this.result = { outcome: 'done' };
    this._resolve(setup);
    if (!this.buildError) this._gen = this._run();
  }

  _resolve(setup) {
    const nodes = setup?.nodes;
    const edges = setup?.edges;
    if (!Array.isArray(nodes) || nodes.length === 0) { this.buildError = { code: 'errNoNodes', args: [] }; return; }
    if (!Array.isArray(edges)) { this.buildError = { code: 'errNoEdges', args: [] }; return; }
    this.nodeIds = nodes.map((n) => String(n.id));
    this.pos = new Map(nodes.map((n) => [String(n.id), { x: n.x ?? 0, y: n.y ?? 0 }]));
    this.source = String(setup.source);
    this.target = String(setup.target);
    if (!this.pos.has(this.source)) { this.buildError = { code: 'errNoSource', args: [this.source] }; return; }
    if (!this.pos.has(this.target)) { this.buildError = { code: 'errNoTarget', args: [this.target] }; return; }

    this.adj = new Map(this.nodeIds.map((id) => [id, []]));
    let wmin = Infinity;
    for (const e of edges) {
      const a = String(e[0]); const b = String(e[1]); const w = e[2] ?? 1;
      if (!this.adj.has(a) || !this.adj.has(b)) { this.buildError = { code: 'errBadEdge', args: [a, b] }; return; }
      if (!Number.isFinite(w) || w <= 0) { this.buildError = { code: 'errBadWeight', args: [a, b] }; return; }
      this.adj.get(a).push({ to: b, w });
      this.adj.get(b).push({ to: a, w });
      wmin = Math.min(wmin, w);
    }
    for (const list of this.adj.values()) list.sort((p, q) => (p.to < q.to ? -1 : p.to > q.to ? 1 : 0));
    this.wmin = Number.isFinite(wmin) ? wmin : 1;
    this.setup = setup;
  }

  tick(emit) {
    if (this.done) return;
    this._emit = emit;
    try {
      if (this._gen.next().done) this.done = true;
    } catch (e) {
      this.error = e && e.code ? e : { code: 'errInternal', args: [String(e?.message ?? e)] };
      this.done = true;
    }
  }

  forceStop(reason) { this.result.outcome = reason; this.done = true; }

  _manhattan(id) {
    const a = this.pos.get(id); const b = this.pos.get(this.target);
    return (Math.abs(a.x - b.x) + Math.abs(a.y - b.y)) * this.wmin;
  }

  * _run() {
    const algo = this.config.algo;
    this._emit({
      type: 'input', op: algo, mode: 'graph',
      nodes: this.nodeIds.map((id) => ({ id, x: this.pos.get(id).x, y: this.pos.get(id).y })),
      edges: this._edgeList(), source: this.source, target: this.target,
      show: [{ label: 'algo', text: algo }, { label: 'from→to', text: `${this.source}→${this.target}` }],
    });

    if (algo === 'bfs' || algo === 'dfs') yield* this._runUnweighted(algo);
    else yield* this._runBest(algo);
  }

  _edgeList() {
    const seen = new Set(); const out = [];
    for (const [a, list] of this.adj) {
      for (const { to, w } of list) {
        const key = a < to ? `${a}|${to}` : `${to}|${a}`;
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ a, b: to, w });
      }
    }
    return out;
  }

  // ---- BFS / DFS (unweighted frontier) ------------------------------------

  * _runUnweighted(algo) {
    const prev = new Map();
    const dist = new Map();
    const visited = new Set();
    const order = [];
    // Frontier entries carry the parent so the tree edge is recorded when a node
    // is actually visited: BFS (queue) keeps the shortest discovery, DFS (stack)
    // keeps the deep traversal path.
    const frontier = [{ node: this.source, parent: null }];

    while (frontier.length) {
      const { node: u, parent } = algo === 'bfs' ? frontier.shift() : frontier.pop();
      if (visited.has(u)) continue;
      visited.add(u);
      if (parent === null) { dist.set(u, 0); } else {
        prev.set(u, parent);
        dist.set(u, (dist.get(parent) ?? 0) + 1);
        this._emit({ type: 'relax', from: parent, to: u, w: 1 });
      }
      order.push(u);
      this._emit({ type: 'visit', node: u, dist: dist.get(u) });
      this._emit({ type: 'note', code: 'noteVisit', args: [u] });
      yield;
      if (u === this.target) break;

      // DFS: push neighbours in REVERSE id order so they pop in ascending order.
      const nbrs = this.adj.get(u).map((e) => e.to);
      const seq = algo === 'dfs' ? [...nbrs].reverse() : nbrs;
      for (const v of seq) if (!visited.has(v)) frontier.push({ node: v, parent: u });
    }

    this._finish(algo, dist, prev, order, order.length);
  }

  // ---- Dijkstra / A* (weighted, priority frontier) ------------------------

  * _runBest(algo) {
    const dist = new Map([[this.source, 0]]);
    const prev = new Map();
    const visited = new Set();
    const order = [];
    let expanded = 0;

    while (true) {
      // pick the unsettled node with the smallest key (dist, or dist+h), ties by id.
      let u = null; let bestKey = Infinity;
      for (const id of this.nodeIds) {
        if (visited.has(id) || !dist.has(id)) continue;
        const key = dist.get(id) + (algo === 'astar' ? this._manhattan(id) : 0);
        if (u === null || key < bestKey - 1e-9) { u = id; bestKey = key; }
      }
      if (u === null) break;
      visited.add(u);
      order.push(u);
      expanded += 1;
      this._emit({ type: 'visit', node: u, dist: dist.get(u) });
      this._emit({ type: 'note', code: 'noteSettle', args: [u, dist.get(u)] });
      yield;
      if (u === this.target) break;

      for (const { to: v, w } of this.adj.get(u)) {
        if (visited.has(v)) continue;
        const nd = dist.get(u) + w;
        if (!dist.has(v) || nd < dist.get(v)) {
          dist.set(v, nd); prev.set(v, u);
          this._emit({ type: 'relax', from: u, to: v, w });
        }
      }
    }

    this._finish(algo, dist, prev, order, expanded);
  }

  // ---- shared finish ------------------------------------------------------

  _finish(algo, dist, prev, order, expanded) {
    let path = []; let pathCost = Infinity; let hops = Infinity;
    if (dist.has(this.target)) {
      path = [this.target]; let cur = this.target;
      while (cur !== this.source && prev.has(cur)) { cur = prev.get(cur); path.push(cur); }
      path.reverse();
      if (path[0] === this.source) {
        hops = path.length - 1;
        pathCost = 0;
        for (let i = 0; i + 1 < path.length; i++) {
          const e = this.adj.get(path[i]).find((x) => x.to === path[i + 1]);
          pathCost += e ? e.w : 0;
        }
      } else { path = []; }
    }

    const distObj = {}; for (const [k, v] of dist) distObj[k] = v;
    this.result = {
      outcome: 'done', mode: 'graph', algo,
      dist: distObj, order: order.slice(), expanded,
      path, pathCost, hops,
      source: this.source, target: this.target,
      // carried so the view can rebuild the layout on the turbo path, where the
      // per-event 'input' setup was skipped.
      nodes: this.nodeIds.map((id) => ({ id, x: this.pos.get(id).x, y: this.pos.get(id).y })),
      edges: this._edgeList(),
    };
    if (path.length) this._emit({ type: 'path', nodes: path.slice(), cost: pathCost });
    this._emit({ type: 'note', code: path.length ? 'notePath' : 'noteNoPath', args: [pathCost, hops] });
    this._emit({ type: 'done', text: path.length ? `cost=${pathCost} hops=${hops} exp=${expanded}` : 'no path' });
  }
}
