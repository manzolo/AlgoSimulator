// Engine contract for the data-structures floor: DSL parsing + errors, the sim
// stepper protocol, determinism (same config + keys ⇒ byte-identical trace),
// the allowed[] whitelist, the budget guard, and the structural semantics of
// every structure on a hand-computed workload.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { parse } from '../dstruct/js/core/parser.js';
import { buildRun, runHeadless } from '../dstruct/js/core/engine.js';

const W = { keys: [5, 3, 8, 2, 4, 7, 9] };

const run = (source, setup = W) => {
  const r = runHeadless({ source, setup });
  assert.equal(r.errors, undefined, `unexpected parse/build error: ${JSON.stringify(r.errors)}`);
  assert.equal(r.error, null, `unexpected runtime error: ${JSON.stringify(r.error)}`);
  return r.result;
};

test('parser: keys, values, and errors', () => {
  assert.equal(parse('structure bst').config.structure, 'bst');
  assert.deepEqual(parse('structure hash\nprobe linear\ncapacity 7').config,
    { structure: 'hash', probe: 'linear', capacity: 7 });
  assert.equal(parse('').errors[0].code, 'errEmpty');
  assert.equal(parse('# only a comment').errors[0].code, 'errEmpty');
  assert.equal(parse('structure nope').errors[0].code, 'errBadStructure');
  assert.equal(parse('probe nope').errors[0].code, 'errBadProbe');
  assert.equal(parse('nonsense 1').errors[0].code, 'errUnknownKey');
  assert.equal(parse('capacity 0').errors[0].code, 'errCapacityRange');
  assert.equal(parse('capacity two').errors[0].code, 'errCapacityInt');
  assert.equal(parse('structure bst\nstructure avl').errors[0].code, 'errDupKey');
});

test('semantic checks in buildRun', () => {
  assert.equal(buildRun({ source: 'order min', setup: W }).errors[0].code, 'errNoStructure');
  assert.equal(buildRun({ source: 'structure bst\norder min', setup: W }).errors[0].code, 'errHeapOnly');
  assert.equal(buildRun({ source: 'structure bst\ncapacity 7', setup: W }).errors[0].code, 'errHashOnly');
  assert.equal(buildRun({ source: 'structure hash\ncapacity 7', setup: W }).errors[0].code, 'errNeedProbe');
  assert.equal(buildRun({ source: 'structure hash\nprobe chain', setup: W }).errors[0].code, 'errNeedCapacity');
  assert.ok(buildRun({ source: 'structure bst', setup: W }).sim);
});

// BST on 5,3,8,2,4,7,9 is perfectly balanced: height 3, comparisons = sum of
// path lengths = 0+1+1+2+2+2+2 = 10, in-order sorted.
test('BST: builds an ordered tree, height and comparisons', () => {
  const r = run('structure bst');
  assert.equal(r.mode, 'tree');
  assert.equal(r.height, 3);
  assert.equal(r.comparisons, 10);
  assert.equal(r.rotations, 0);
  assert.deepEqual(r.inorder, [2, 3, 4, 5, 7, 8, 9]);
});

// A sorted insert makes a BST degenerate (a linked list) but an AVL stays short.
test('AVL stays balanced where BST degenerates', () => {
  const sorted = { keys: [1, 2, 3, 4, 5, 6, 7] };
  assert.equal(run('structure bst', sorted).height, 7);
  const avl = run('structure avl', sorted);
  assert.equal(avl.height, 3);
  assert.ok(avl.rotations > 0);
  assert.deepEqual(avl.inorder, [1, 2, 3, 4, 5, 6, 7]);
});

// Min-heap pops ascending; max-heap pops descending.
test('heap: pop order reflects the ordering', () => {
  const asc = run('structure heap\norder min', W);
  assert.deepEqual(asc.popOrder, [2, 3, 4, 5, 7, 8, 9]);
  const desc = run('structure heap\norder max', W);
  assert.deepEqual(desc.popOrder, [9, 8, 7, 5, 4, 3, 2]);
});

// heapify never does more build-swaps than repeated insertion, and strictly
// fewer on a descending workload.
test('heap: heapify does no more swaps than insert', () => {
  const desc = { keys: [7, 6, 5, 4, 3, 2, 1] }; // descending keys, worst for min-heap by insertion
  const ins = run('structure heap\norder min\nbuild insert', desc).swaps;
  const flo = run('structure heap\norder min\nbuild heapify', desc).swaps;
  assert.ok(flo <= ins);
  assert.ok(ins > flo, `insert ${ins} should exceed heapify ${flo} on this workload`);
});

// Hashing: chaining never fails; a bigger table shortens the worst chain.
test('hash: chaining spreads keys; capacity controls the worst probe', () => {
  const keys = { keys: [0, 4, 8, 12, 16, 1, 5] };
  const small = run('structure hash\nprobe chain\ncapacity 4', keys);
  const big = run('structure hash\nprobe chain\ncapacity 13', keys);
  assert.ok(small.maxProbe > big.maxProbe);
});

// Linear probing clusters; quadratic spreads the same colliding keys wider.
test('hash: linear probing clusters more than quadratic', () => {
  const keys = { keys: [0, 7, 14, 21, 3] }; // all but one hash to slot 0 mod 7
  const lin = run('structure hash\nprobe linear\ncapacity 7', keys);
  const qua = run('structure hash\nprobe quadratic\ncapacity 7', keys);
  assert.ok(lin.maxProbe >= qua.maxProbe);
});

test('sim protocol: nextTime/stepOnce/advanceTo/finalState, increasing seq', () => {
  const { sim } = buildRun({ source: 'structure avl', setup: W });
  assert.equal(sim.now, 0);
  assert.equal(sim.nextTime(), 1);
  const d = sim.stepOnce();
  assert.equal(d.time, 1);
  assert.ok(d.events.length > 0);
  sim.advanceTo(4);
  assert.equal(sim.now, 4);
  while (!sim.halted && !sim.error) sim.stepOnce();
  assert.equal(sim.nextTime(), null);
  const st = sim.finalState();
  assert.equal(st.halted, true);
  assert.equal(st.trace[st.trace.length - 1].type, 'done');
  for (let i = 1; i < st.trace.length; i++) assert.ok(st.trace[i].seq > st.trace[i - 1].seq);
});

test('determinism: same config + keys ⇒ identical trace', () => {
  const once = () => JSON.stringify(runHeadless({ source: 'structure avl', setup: W }).state.trace);
  assert.equal(once(), once());
});

test('allowed[] whitelist rejects forbidden config keys', () => {
  const r = buildRun({ source: 'structure hash\nprobe chain\ncapacity 7', setup: W, allowed: ['structure'] });
  assert.equal(r.errors[0].code, 'errNotAllowed');
  assert.ok(buildRun({ source: 'structure hash\nprobe chain\ncapacity 7', setup: W,
    allowed: ['structure', 'probe', 'capacity'] }).sim);
});

test('bad workload is a build error', () => {
  assert.equal(runHeadless({ source: 'structure bst', setup: { keys: [] } }).errors[0].code, 'errNoKeys');
  assert.equal(runHeadless({ source: 'structure hash\nprobe linear\ncapacity 3', setup: { keys: [1, 2, 3, 4] } }).errors[0].code, 'errCapacityTooSmall');
});

test('budget: a runaway workload stops with outcome=budget, not an error', () => {
  const big = { keys: Array.from({ length: 5000 }, (_, i) => i) };
  const r = runHeadless({ source: 'structure avl', setup: big, budget: 50 });
  assert.equal(r.error, null);
  assert.equal(r.result.outcome, 'budget');
});
