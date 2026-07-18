// The level contract for the graph floor, mirrored from the sibling EDU-* labs:
//  - every level is structurally sound and fully bilingual;
//  - the reference solution passes ALL cases, visible AND hidden;
//  - the starter config does NOT already pass;
//  - a wrong-but-plausible algorithm passes the gentle visible case it targets
//    but fails a hidden one (the anti-cheat);
//  - makeCases() is deterministic across calls.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { levels, levelById } from '../graph/js/levels/index.js';
import { verifyAll } from '../graph/js/levels/verify.js';
import { SOLUTIONS } from './graph-solutions.js';

const ID_RE = /^[a-z][a-z0-9-]*$/;

test('curriculum: 12 levels, unique kebab-case ids, resolvable by id', () => {
  assert.equal(levels.length, 12);
  const ids = levels.map((l) => l.id);
  assert.equal(new Set(ids).size, 12);
  for (const id of ids) {
    assert.match(id, ID_RE);
    assert.equal(levelById(id).id, id);
  }
  assert.equal(levelById('nope'), null);
});

test('levels: bilingual structure, hints, starter, allowed list, cases', () => {
  for (const l of levels) {
    for (const field of ['title', 'text', 'goal']) {
      assert.ok(l[field]?.en && l[field]?.it, `${l.id}: ${field} must be {en,it}`);
    }
    assert.ok(Array.isArray(l.hints) && l.hints.length >= 2, `${l.id}: at least 2 hints`);
    for (const h of l.hints) assert.ok(h.en && h.it, `${l.id}: bilingual hint`);
    assert.ok(typeof l.start === 'string' && l.start.trim(), `${l.id}: starter config`);
    assert.ok(Array.isArray(l.allowed) && l.allowed.length, `${l.id}: allowed[]`);
    const cases = l.makeCases();
    assert.ok(cases.length >= 3, `${l.id}: at least 3 cases`);
    assert.ok(cases.some((c) => c.visible), `${l.id}: at least one visible case`);
    assert.ok(cases.some((c) => !c.visible), `${l.id}: at least one HIDDEN case`);
    for (const c of cases) {
      assert.ok(Array.isArray(c.setup?.nodes) && c.setup.nodes.length, `${l.id}: each case has a graph`);
      assert.equal(typeof c.check, 'function', `${l.id}: each case has a check`);
    }
  }
});

test('makeCases() is deterministic across calls', () => {
  for (const l of levels) {
    const a = JSON.stringify(l.makeCases());
    const b = JSON.stringify(l.makeCases());
    assert.equal(a, b, `${l.id}: makeCases must be pure`);
  }
});

for (const level of levels) {
  test(`solution passes ALL cases (visible + hidden): ${level.id}`, () => {
    const sol = SOLUTIONS[level.id];
    assert.ok(sol, `missing solution for ${level.id}`);
    for (const [i, r] of verifyAll(level, sol).entries()) {
      assert.ok(r.pass, `${level.id} case ${i} (${r.visible ? 'visible' : 'hidden'}) failed: `
        + JSON.stringify({ errors: r.errors, error: r.error, outcome: r.outcome }));
    }
  });

  test(`starter does NOT already pass: ${level.id}`, () => {
    assert.ok(verifyAll(level, level.start).some((r) => !r.pass), `${level.id}: starter must fail at least one case`);
  });
}

// A wrong-but-plausible algorithm for each level: it passes the gentle visible
// graph it targets, then fails a hidden one — the anti-cheat.
const CHEATS = {
  'shortest-hops': 'algo dfs',
  'maze-hops': 'algo dfs',
  'dfs-order': 'algo bfs',
  'weighted-roads': 'algo bfs',
  'cheapest-detour': 'algo bfs',
  'hops-vs-cost': 'algo bfs',
  'guided-search': 'algo dijkstra',
  'astar-grid': 'algo dijkstra',
  'big-maze': 'algo dfs',
  'big-roads': 'algo bfs',
  'big-astar': 'algo dijkstra',
  capstone: 'algo dijkstra',
};

for (const [id, cheat] of Object.entries(CHEATS)) {
  test(`wrong algorithm fails a hidden case: ${id}`, () => {
    const level = levelById(id);
    const results = verifyAll(level, cheat);
    assert.ok(results.some((r) => r.visible && r.pass), `${id}: cheat should pass the visible case it targets`);
    assert.ok(results.some((r) => !r.pass), `${id}: cheat must fail at least one (hidden) case`);
  });
}
