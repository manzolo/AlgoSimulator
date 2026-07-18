// Case builders shared by the levels. The LEVEL fixes the graph (nodes, weighted
// edges, a source and a target); the USER writes a one-line algorithm config;
// verification runs that algorithm on EVERY case and applies the case's
// check(result) predicate. Hidden cases use DIFFERENT graphs with the SAME check
// — so an algorithm that only wins on the gentle visible graph fails the hidden
// ones (anti-cheat).
//
// Checks are anchored to a REFERENCE algorithm (the intended, dominant choice)
// run on the same graph: "as good as the intended traversal". A weaker algorithm
// ties on a gentle graph and does strictly worse on an adversarial one — exactly
// the visible/hidden split the anti-cheat needs.

import { runHeadless } from '../core/engine.js';

function refRun(source, setup) {
  const r = runHeadless({ source, setup });
  if (r.errors || r.error || r.result.outcome !== 'done') {
    throw new Error(`reference "${source}" failed: ${JSON.stringify(r.errors ?? r.error ?? r.result.outcome)}`);
  }
  return r.result;
}

// BFS minimises hops → path edge-count ≤ the BFS reference.
export function hopCases(refSource, sets) {
  return sets.map(({ setup, visible }) => {
    const target = refRun(refSource, setup).hops;
    return { setup, visible: !!visible, check: (r) => r.result.hops <= target };
  });
}

// Dijkstra / A* minimise cost → summed path weight ≤ the reference.
export function costCases(refSource, sets) {
  return sets.map(({ setup, visible }) => {
    const target = refRun(refSource, setup).pathCost;
    return { setup, visible: !!visible, check: (r) => r.result.pathCost <= target + 1e-9 };
  });
}

// visit order must match the reference traversal exactly (BFS vs DFS ordering).
export function orderCases(refSource, sets) {
  return sets.map(({ setup, visible }) => {
    const target = refRun(refSource, setup).order;
    return {
      setup, visible: !!visible,
      check: (r) => r.result.order.length === target.length && r.result.order.every((x, i) => x === target[i]),
    };
  });
}

// A*: the path must be as cheap as Dijkstra's AND settle no more nodes than A*.
// A weaker choice either finds a costlier path or expands more of the graph.
export function astarCases(sets) {
  return sets.map(({ setup, visible }) => {
    const optCost = refRun('algo dijkstra', setup).pathCost;
    const bestExpanded = refRun('algo astar', setup).expanded;
    return {
      setup, visible: !!visible,
      check: (r) => r.result.pathCost <= optCost + 1e-9 && r.result.expanded <= bestExpanded,
    };
  });
}

// A rectangular grid of cells, 4-connected, uniform edge weight. Cells are named
// n{index} (index = y*cols + x, zero-padded) so lexicographic id order == the
// natural raster order — keeping every algorithm's tie-breaks deterministic.
// Source is the top-left cell, target the bottom-right, unless overridden.
export function gridGraph(cols, rows, { weight = 1, source, target, drop = [] } = {}) {
  const pad = (n) => String(n).padStart(2, '0');
  const id = (x, y) => `n${pad(y * cols + x)}`;
  const gone = new Set(drop.map(([x, y]) => id(x, y)));
  const nodes = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (gone.has(id(x, y))) continue;
      nodes.push({ id: id(x, y), x, y });
    }
  }
  const edges = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (gone.has(id(x, y))) continue;
      if (x + 1 < cols && !gone.has(id(x + 1, y))) edges.push([id(x, y), id(x + 1, y), weight]);
      if (y + 1 < rows && !gone.has(id(x, y + 1))) edges.push([id(x, y), id(x, y + 1), weight]);
    }
  }
  return { nodes, edges, source: source ?? id(0, 0), target: target ?? id(cols - 1, rows - 1) };
}

const pad = (n) => String(n).padStart(2, '0');

// A straight chain of n nodes — a "gentle" graph: it has a single route, so BFS,
// DFS, Dijkstra and A* all agree on it (used as the visible, tie-making case).
export function line(n, weight = 1) {
  const nodes = []; const edges = [];
  for (let i = 0; i < n; i++) nodes.push({ id: `n${pad(i)}`, x: i, y: 0 });
  for (let i = 0; i + 1 < n; i++) edges.push([`n${pad(i)}`, `n${pad(i + 1)}`, weight]);
  return { nodes, edges, source: 'n00', target: `n${pad(n - 1)}` };
}

// Source s and target t joined by a short DIRECT edge and a long DETOUR chain.
// The chain nodes (ids m..) sort below t, so DFS wanders down the detour first —
// BFS still reaches t in one hop. With heavy > chainLen·light the detour is also
// the cheapest route, so this graph splits hop-count from path-cost.
export function detour(chainLen, { heavy = 10, light = 1 } = {}) {
  const nodes = [{ id: 's', x: 0, y: 0 }, { id: 't', x: chainLen + 1, y: 0 }];
  const edges = [['s', 't', heavy]];
  let prev = 's';
  for (let i = 0; i < chainLen; i++) {
    const id = `m${pad(i)}`;
    nodes.push({ id, x: i + 1, y: 1 });
    edges.push([prev, id, light]);
    prev = id;
  }
  edges.push([prev, 't', light]);
  return { nodes, edges, source: 's', target: 't' };
}

// An unweighted version of the same shape: one direct hop vs a long way round.
export function shortcut(chainLen) { return detour(chainLen, { heavy: 1, light: 1 }); }

// A small branching tree: BFS visits it level by level, DFS dives one branch to
// the bottom first — so their visit orders differ (used to grade DFS ordering).
export function tree(setup) { return setup; }
