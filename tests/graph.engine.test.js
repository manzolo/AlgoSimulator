// Engine contract for the graph floor: DSL parsing + errors, the sim stepper
// protocol, determinism (same algorithm + graph ⇒ byte-identical trace), the
// allowed[] whitelist, the budget guard, and the traversal semantics of every
// algorithm on a hand-computed graph.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parse } from '../graph/js/core/parser.js';
import { buildRun, runHeadless } from '../graph/js/core/engine.js';
import { gridGraph } from '../graph/js/levels/generators.js';

// A B C D with a heavy direct A–D shortcut: min hops (1) and min cost (2) diverge.
//   A–B 1, B–D 1, A–C 1, C–D 1, A–D 5
const G = {
  nodes: [{ id: 'A', x: 0, y: 0 }, { id: 'B', x: 1, y: 0 }, { id: 'C', x: 0, y: 1 }, { id: 'D', x: 1, y: 1 }],
  edges: [['A', 'B', 1], ['B', 'D', 1], ['A', 'C', 1], ['C', 'D', 1], ['A', 'D', 5]],
  source: 'A', target: 'D',
};

const run = (source, setup = G) => {
  const r = runHeadless({ source, setup });
  assert.equal(r.errors, undefined, `unexpected parse/build error: ${JSON.stringify(r.errors)}`);
  assert.equal(r.error, null, `unexpected runtime error: ${JSON.stringify(r.error)}`);
  return r.result;
};

test('parser: algo values and errors', () => {
  assert.equal(parse('algo bfs').config.algo, 'bfs');
  assert.equal(parse('').errors[0].code, 'errEmpty');
  assert.equal(parse('algo nope').errors[0].code, 'errBadAlgo');
  assert.equal(parse('nonsense 1').errors[0].code, 'errUnknownKey');
  assert.equal(parse('algo bfs\nalgo dfs').errors[0].code, 'errDupKey');
  assert.equal(buildRun({ source: '# nothing', setup: G }).errors[0].code, 'errEmpty');
});

test('BFS: fewest hops even over a heavy edge', () => {
  const r = run('algo bfs');
  assert.equal(r.hops, 1);
  assert.equal(r.pathCost, 5);
  assert.deepEqual(r.path, ['A', 'D']);
});

test('Dijkstra: cheapest path by weight, not by hops', () => {
  const r = run('algo dijkstra');
  assert.equal(r.pathCost, 2);
  assert.equal(r.hops, 2);
  assert.deepEqual(r.path, ['A', 'B', 'D']);
  assert.equal(r.dist.D, 2);
});

test('A* finds the same optimal cost as Dijkstra', () => {
  const d = run('algo dijkstra');
  const a = run('algo astar');
  assert.equal(a.pathCost, d.pathCost);
  assert.ok(a.expanded <= d.expanded);
});

test('BFS and DFS visit order differ on a branching graph', () => {
  const bfs = run('algo bfs');
  const dfs = run('algo dfs');
  assert.equal(bfs.order[0], 'A');
  assert.equal(dfs.order[0], 'A');
  assert.notDeepEqual(bfs.order, dfs.order);
});

test('A* settles fewer nodes than Dijkstra when the target is interior', () => {
  // target at (3,3) in a 7×7 grid: Dijkstra floods past it in every direction,
  // A* stays aimed at the goal.
  const grid = gridGraph(7, 7, { target: 'n24' });
  const d = run('algo dijkstra', grid);
  const a = run('algo astar', grid);
  assert.equal(a.pathCost, d.pathCost);
  assert.ok(a.expanded < d.expanded, `astar ${a.expanded} should settle fewer than dijkstra ${d.expanded}`);
});

test('sim protocol: nextTime/stepOnce/advanceTo/finalState, increasing seq', () => {
  const { sim } = buildRun({ source: 'algo dijkstra', setup: G });
  assert.equal(sim.nextTime(), 1);
  const d = sim.stepOnce();
  assert.equal(d.time, 1);
  assert.ok(d.events.length > 0);
  while (!sim.halted && !sim.error) sim.stepOnce();
  assert.equal(sim.nextTime(), null);
  const st = sim.finalState();
  assert.equal(st.halted, true);
  assert.equal(st.trace[st.trace.length - 1].type, 'done');
  for (let i = 1; i < st.trace.length; i++) assert.ok(st.trace[i].seq > st.trace[i - 1].seq);
});

test('determinism: same algorithm + graph ⇒ identical trace', () => {
  const once = () => JSON.stringify(runHeadless({ source: 'algo astar', setup: gridGraph(5, 5) }).state.trace);
  assert.equal(once(), once());
});

test('allowed[] whitelist and bad-graph build errors', () => {
  assert.equal(buildRun({ source: 'algo bfs', setup: G, allowed: [] }).errors[0].code, 'errNotAllowed');
  assert.equal(runHeadless({ source: 'algo bfs', setup: { nodes: [], edges: [] } }).errors[0].code, 'errNoNodes');
  assert.equal(runHeadless({ source: 'algo bfs', setup: { nodes: [{ id: 'A', x: 0, y: 0 }], edges: [], source: 'A', target: 'Z' } }).errors[0].code, 'errNoTarget');
});

test('budget: a runaway graph stops with outcome=budget, not an error', () => {
  const big = gridGraph(40, 40);
  const r = runHeadless({ source: 'algo dijkstra', setup: big, budget: 20 });
  assert.equal(r.error, null);
  assert.equal(r.result.outcome, 'budget');
});
