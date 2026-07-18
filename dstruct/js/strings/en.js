// English chrome strings for the data-structures floor. Flat dictionary;
// {0}/{1} are positional arguments.

export default {
  tagline: 'watch a structure take shape, key by key',

  backHub: '← Hub',
  navLevels: 'Levels',
  navSandbox: 'Sandbox',
  help: 'Help',
  run: '▶ Build',
  pause: '❚❚ Pause',
  step: 'Step',
  reset: 'Reset',
  speed: 'speed',

  panelView: 'STRUCTURE',
  panelResult: 'METRICS',
  panelScript: 'CONFIG',
  panelCases: 'WORKLOADS',
  panelEvents: 'STEPS',

  statusReady: 'Ready.',
  statusRunning: 'Building…',
  statusPaused: 'Paused.',
  statusParseFailed: 'The config is not valid.',
  statusDone: 'Done in {0} steps.',
  statusBudget: 'Step budget exhausted — the run was cut off.',
  failStatus: 'Not passed yet.',

  levelBadge: 'LEVEL {0}',
  completedBadge: 'completed',
  goalLabel: 'GOAL —',
  allowedLabel: 'config',
  hintBtn: 'Hint {0}/{1}',
  hintsDone: 'No more hints',
  nextLevel: 'Next level →',
  passMsg: 'Passed! Every workload is green — including the hidden ones.',
  failVisible: 'A visible workload fails — build it and watch where the structure goes wrong.',
  failHidden: 'The visible workload passes, but a HIDDEN one fails: is your choice really right, or just tuned to what you can see?',

  sandboxTitle: 'SANDBOX',
  sandboxText: 'Free mode: build any structure over the sample keys and watch it grow. No grading here.',
  sandboxCardTitle: 'Sandbox',
  sandboxCardDesc: 'free experimentation',
  selectTitle: 'Choose a level',

  caseLabel: 'Workload',
  casesNote: '+{0} hidden workloads: same check, different keys. A choice tuned to the visible ones won\'t survive them.',

  statHeight: 'height',
  statNodes: 'nodes',
  statComparisons: 'comparisons',
  statRotations: 'rotations',
  statSwaps: 'build swaps',
  statOrder: 'order',
  statBuild: 'build',
  statMaxProbe: 'worst probe',
  statCollisions: 'collisions',
  statLoad: 'load factor',
  statCapacity: 'capacity',
  detailInorder: 'in-order',
  detailPop: 'pop order',

  resultEmpty: 'Build the structure to see its metrics.',
  evtEmpty: 'The engine\'s steps will appear here.',
  evtInput: 'build: {0}',
  evtField: 'phase: {0}',
  evtBudget: 'step budget ({0}) exhausted',

  noteCompare: 'compare {0} with {1}',
  notePlace: 'place {0}',
  notePlaceRot: 'place {0}, then rotate',
  notePush: 'push {0}',
  noteHeapify: 'heapify {0} keys',
  notePop: 'pop {0}',
  noteHash: 'hash {0} → slot {1}',

  helpTitle: 'Config reference',
  helpHtml: `
<p>The workload (the keys) is fixed by the level. You write a small
<b>structure config</b>, one directive per line, and the engine builds it.
<b>Ctrl+Enter</b> builds, <b>F8</b> advances one step.</p>
<pre>structure bst | avl | heap | hash
order  min | max          # heap only
build  insert | heapify   # heap only
probe  chain | linear | quadratic   # hash only
capacity &lt;n&gt;             # hash only (buckets/slots, ≥ 1)</pre>
<p><b>Structures.</b> <code>bst</code> a binary search tree · <code>avl</code> a
self-balancing search tree (rotations keep it short) · <code>heap</code> a binary
heap (min or max) · <code>hash</code> a hash table.</p>
<p><b>Metrics.</b> Trees are graded on <i>height</i> and <i>comparisons</i>; heaps
on <i>build swaps</i>; hash tables on the <i>worst probe</i> and <i>collisions</i>.
Hidden workloads use different keys, so an answer tuned to the visible ones
fails.</p>`,

  errEmpty: 'Write a config.',
  errNeedValue: '`{0}` needs a value.',
  errBadStructure: 'Unknown structure: "{0}" (bst, avl, heap, hash).',
  errBadOrder: 'Unknown order: "{0}" (min, max).',
  errBadBuild: 'Unknown build: "{0}" (insert, heapify).',
  errBadProbe: 'Unknown probe: "{0}" (chain, linear, quadratic).',
  errUnexpected: 'Unexpected: {0}.',
  errCapacityValue: '`capacity` needs a value.',
  errCapacityInt: 'capacity must be an integer, not "{0}".',
  errCapacityRange: 'capacity must be at least 1.',
  errUnknownKey: 'Unknown directive: "{0}".',
  errDupKey: '`{0}` is set twice.',
  errNotAllowed: 'The directive `{0}` is not allowed in this level.',
  errNoStructure: 'No structure chosen — add a `structure` line.',
  errHeapOnly: '`order` and `build` apply only to a heap.',
  errHashOnly: '`probe` and `capacity` apply only to a hash table.',
  errNeedProbe: 'A hash table needs a `probe` strategy.',
  errNeedCapacity: 'A hash table needs a `capacity`.',
  errNoKeys: 'The workload has no keys.',
  errBadKey: 'Bad key in the workload: {0}.',
  errCapacityTooSmall: 'Capacity {1} is too small for {0} keys with open addressing.',
  errProbeFail: 'Probing could not place key {0} — the table is too full.',
  errInternal: 'Internal error: {0}.',
};
