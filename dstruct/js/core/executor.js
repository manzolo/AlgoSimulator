// The data-structure builder. Runs the level's workload (a list of integer
// keys) into the structure the user chose, ONE micro-op per tick, and emits
// language-neutral events the UI animates (a search path down a tree, a
// rotation, a sift swap, a hash probe) plus a canonical `result` the verifier
// checks. Generator-based: tick(emit) resumes _run() exactly once per event.
// No randomness, no DOM, no Date.now — same config + same keys ⇒ same trace.
//
// Metrics the levels grade on:
//   trees (bst/avl) : height, comparisons (nodes visited on insert paths), rotations
//   heap            : swaps (during the build), popOrder (extraction order)
//   hash            : maxProbe (worst lookup cost), collisions, comparisons
//
// Event vocabulary (each carries {time, seq} once emitted by the sim):
//   { type:'input', op, mode, keys, show }        set up the display
//   { type:'note',  code, args }                  a narration line (event log)
//   tree:  { type:'compare', at, dir, tree, key } | { type:'settle', key, tree, rotated }
//   heap:  { type:'push', key, arr } | { type:'sift', i, j, arr } | { type:'pop', key, arr }
//   hash:  { type:'hash-init', capacity } | { type:'probe', slot, key } | { type:'store', slot, key, table }
//   { type:'done', text }                          terminal; result is complete

const cmp = (order, a, b) => (order === 'max' ? a > b : a < b);

// ---- tree helpers ----------------------------------------------------------

function node(key) { return { key, left: null, right: null, height: 1 }; }
function h(n) { return n ? n.height : 0; }
function upd(n) { n.height = 1 + Math.max(h(n.left), h(n.right)); }
function bf(n) { return h(n.left) - h(n.right); }
function rotR(y) { const x = y.left; y.left = x.right; x.right = y; upd(y); upd(x); return x; }
function rotL(x) { const y = x.right; x.right = y.left; y.left = x; upd(x); upd(y); return y; }
function snap(n) { return n ? { k: n.key, l: snap(n.left), r: snap(n.right) } : null; }
function heightOf(n) { return n ? 1 + Math.max(heightOf(n.left), heightOf(n.right)) : 0; }
function countOf(n) { return n ? 1 + countOf(n.left) + countOf(n.right) : 0; }
function inorder(n, out) { if (!n) return; inorder(n.left, out); out.push(n.key); inorder(n.right, out); }

export class DsExecutor {
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
    const keys = setup?.keys;
    if (!Array.isArray(keys) || keys.length === 0) { this.buildError = { code: 'errNoKeys', args: [] }; return; }
    for (const k of keys) {
      if (!Number.isInteger(k)) { this.buildError = { code: 'errBadKey', args: [String(k)] }; return; }
    }
    this.keys = keys.slice();
    if (this.config.structure === 'hash' && this.config.probe !== 'chain'
        && this.keys.length > this.config.capacity) {
      this.buildError = { code: 'errCapacityTooSmall', args: [this.keys.length, this.config.capacity] };
    }
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

  * _run() {
    switch (this.config.structure) {
      case 'bst':
      case 'avl': yield* this._runTree(); break;
      case 'heap': yield* this._runHeap(); break;
      case 'hash': yield* this._runHash(); break;
      default: this.error = { code: 'errInternal', args: ['structure'] };
    }
  }

  // ---- trees --------------------------------------------------------------

  * _runTree() {
    const structure = this.config.structure;
    const isAvl = structure === 'avl';
    this._emit({ type: 'input', op: structure, mode: 'tree', keys: this.keys.slice(),
      show: [{ label: 'structure', text: structure }] });

    let root = null;
    let comparisons = 0;
    let rotations = 0;

    for (const key of this.keys) {
      // descend, animating each comparison on the tree as it stands.
      const before = snap(root);
      let cur = root;
      while (cur) {
        comparisons += 1;
        const dir = key < cur.key ? 'L' : 'R';
        this._emit({ type: 'compare', at: cur.key, dir, key, tree: before });
        this._emit({ type: 'note', code: 'noteCompare', args: [key, cur.key] });
        cur = dir === 'L' ? cur.left : cur.right;
        yield;
      }
      // insert (+ AVL rebalance on the way up).
      let rotated = false;
      const insert = (n) => {
        if (!n) return node(key);
        if (key < n.key) n.left = insert(n.left); else n.right = insert(n.right);
        if (!isAvl) return n;
        upd(n);
        const b = bf(n);
        if (b > 1 && key < n.left.key) { rotations += 1; rotated = true; return rotR(n); }
        if (b < -1 && key > n.right.key) { rotations += 1; rotated = true; return rotL(n); }
        if (b > 1 && key > n.left.key) { n.left = rotL(n.left); rotations += 1; rotated = true; return rotR(n); }
        if (b < -1 && key < n.right.key) { n.right = rotR(n.right); rotations += 1; rotated = true; return rotL(n); }
        return n;
      };
      root = insert(root);
      this._emit({ type: 'settle', key, tree: snap(root), rotated });
      this._emit({ type: 'note', code: rotated ? 'notePlaceRot' : 'notePlace', args: [key] });
      yield;
    }

    const io = []; inorder(root, io);
    this.result = {
      outcome: 'done', mode: 'tree', structure,
      height: heightOf(root), nodes: countOf(root),
      comparisons, rotations, inorder: io, tree: snap(root),
    };
    this._emit({ type: 'done', text: `h=${this.result.height} cmp=${comparisons}` });
  }

  // ---- heap ---------------------------------------------------------------

  * _runHeap() {
    const order = this.config.order ?? 'min';
    const build = this.config.build ?? 'insert';
    this._emit({ type: 'input', op: `heap ${order}`, mode: 'heap', keys: this.keys.slice(),
      show: [{ label: 'order', text: order }, { label: 'build', text: build }] });

    const arr = [];
    let swaps = 0;
    const swap = (i, j) => { const t = arr[i]; arr[i] = arr[j]; arr[j] = t; swaps += 1; };

    const siftUp = function* (i) {
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (cmp(order, arr[i], arr[p])) { swap(i, p); this._emit({ type: 'sift', i: p, j: i, arr: arr.slice() }); i = p; yield; }
        else break;
      }
    }.bind(this);

    const siftDown = function* (i, n) {
      while (true) {
        let best = i; const l = 2 * i + 1; const r = 2 * i + 2;
        if (l < n && cmp(order, arr[l], arr[best])) best = l;
        if (r < n && cmp(order, arr[r], arr[best])) best = r;
        if (best === i) break;
        swap(i, best); this._emit({ type: 'sift', i, j: best, arr: arr.slice() }); i = best; yield;
      }
    }.bind(this);

    if (build === 'insert') {
      for (const key of this.keys) {
        arr.push(key);
        this._emit({ type: 'push', key, arr: arr.slice() });
        this._emit({ type: 'note', code: 'notePush', args: [key] });
        yield;
        yield* siftUp(arr.length - 1);
      }
    } else { // heapify (Floyd): load all, then sift down from the last parent.
      for (const key of this.keys) arr.push(key);
      this._emit({ type: 'push', key: null, arr: arr.slice() });
      this._emit({ type: 'note', code: 'noteHeapify', args: [arr.length] });
      yield;
      for (let i = (arr.length >> 1) - 1; i >= 0; i--) yield* siftDown(i, arr.length);
    }

    const buildSwaps = swaps;
    const heapArr = arr.slice();

    // extract everything to expose the sorted order (does not count as build swaps).
    const popOrder = [];
    const work = arr.slice();
    const wswap = (i, j) => { const t = work[i]; work[i] = work[j]; work[j] = t; };
    for (let n = work.length; n > 0; n--) {
      popOrder.push(work[0]);
      work[0] = work[n - 1]; work[n - 1] = undefined;
      this._emit({ type: 'pop', key: popOrder[popOrder.length - 1], arr: work.slice(0, n - 1) });
      this._emit({ type: 'note', code: 'notePop', args: [popOrder[popOrder.length - 1]] });
      let i = 0;
      while (true) {
        let best = i; const l = 2 * i + 1; const r = 2 * i + 2;
        if (l < n - 1 && cmp(order, work[l], work[best])) best = l;
        if (r < n - 1 && cmp(order, work[r], work[best])) best = r;
        if (best === i) break;
        wswap(i, best); i = best;
      }
      yield;
    }

    this.result = {
      outcome: 'done', mode: 'heap', order, build,
      swaps: buildSwaps, popOrder, arr: heapArr,
    };
    this._emit({ type: 'done', text: `swaps=${buildSwaps}` });
  }

  // ---- hash ---------------------------------------------------------------

  * _runHash() {
    const probe = this.config.probe;
    const C = this.config.capacity;
    this._emit({ type: 'input', op: `hash ${probe}`, mode: 'hash', keys: this.keys.slice(),
      show: [{ label: 'probe', text: probe }, { label: 'capacity', text: String(C) }] });
    this._emit({ type: 'hash-init', capacity: C, probe });
    const hash = (k) => ((k % C) + C) % C;

    let collisions = 0;
    let maxProbe = 1;
    let comparisons = 0;

    if (probe === 'chain') {
      const table = Array.from({ length: C }, () => []);
      for (const key of this.keys) {
        const s = hash(key);
        this._emit({ type: 'probe', slot: s, key });
        comparisons += table[s].length;               // walk the chain to the end
        if (table[s].length > 0) collisions += 1;
        table[s].push(key);
        maxProbe = Math.max(maxProbe, table[s].length);
        this._emit({ type: 'store', slot: s, key, table: table.map((b) => b.slice()) });
        this._emit({ type: 'note', code: 'noteHash', args: [key, s] });
        yield;
      }
      this.result = { outcome: 'done', mode: 'hash', probe, capacity: C, collisions, maxProbe, comparisons,
        loadFactor: this.keys.length / C, table: table.map((b) => b.slice()) };
    } else {
      const table = new Array(C).fill(null);
      const step = (i) => (probe === 'linear' ? i : i * i);
      for (const key of this.keys) {
        const h0 = hash(key);
        let placed = false;
        for (let i = 0; i < C; i++) {
          const s = (h0 + step(i)) % C;
          comparisons += 1;
          this._emit({ type: 'probe', slot: s, key });
          if (table[s] === null) {
            table[s] = key;
            maxProbe = Math.max(maxProbe, i + 1);
            if (i > 0) collisions += 1;
            this._emit({ type: 'store', slot: s, key, table: table.slice() });
            this._emit({ type: 'note', code: 'noteHash', args: [key, s] });
            yield;
            placed = true;
            break;
          }
          yield;
        }
        if (!placed) { this.error = { code: 'errProbeFail', args: [key] }; return; }
      }
      this.result = { outcome: 'done', mode: 'hash', probe, capacity: C, collisions, maxProbe, comparisons,
        loadFactor: this.keys.length / C, table: table.slice() };
    }
    this._emit({ type: 'done', text: `maxProbe=${maxProbe} coll=${collisions}` });
  }
}
