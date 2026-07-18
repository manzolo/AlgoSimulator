// English chrome strings for the graph floor. Flat dictionary; {0}/{1} are
// positional arguments.

export default {
  tagline: 'watch the frontier spread and the path light up',

  backHub: '← Hub',
  navLevels: 'Levels',
  navSandbox: 'Sandbox',
  help: 'Help',
  run: '▶ Run',
  pause: '❚❚ Pause',
  step: 'Step',
  reset: 'Reset',
  speed: 'speed',

  panelView: 'GRAPH',
  panelResult: 'RESULT',
  panelScript: 'ALGORITHM',
  panelCases: 'GRAPHS',
  panelEvents: 'STEPS',

  statusReady: 'Ready.',
  statusRunning: 'Searching…',
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
  passMsg: 'Passed! Every graph is green — including the hidden ones.',
  failVisible: 'A visible graph fails — run it and watch where the search goes wrong.',
  failHidden: 'The visible graph passes, but a HIDDEN one fails: is your algorithm really right, or just right for what you can see?',

  sandboxTitle: 'SANDBOX',
  sandboxText: 'Free mode: run any algorithm over the sample graph and watch it search. No grading here.',
  sandboxCardTitle: 'Sandbox',
  sandboxCardDesc: 'free experimentation',
  selectTitle: 'Choose a level',

  caseLabel: 'Graph',
  casesNote: '+{0} hidden graphs: same check, different maps. An algorithm tuned to the visible ones won\'t survive them.',

  statCost: 'path cost',
  statHops: 'hops',
  statExpanded: 'nodes settled',
  detailPath: 'path',
  detailNoPath: 'no path to the target',

  resultEmpty: 'Run the algorithm to see the result.',
  evtEmpty: 'The engine\'s steps will appear here.',
  evtInput: 'algorithm: {0}',
  evtField: 'phase: {0}',
  evtBudget: 'step budget ({0}) exhausted',

  noteVisit: 'visit {0}',
  noteSettle: 'settle {0} (dist {1})',
  notePath: 'path found, cost {0}, {1} hops',
  noteNoPath: 'no path to the target',

  helpTitle: 'Config reference',
  helpHtml: `
<p>The graph (nodes, weighted edges, a source and a target) is fixed by the
level. You write one line choosing the algorithm, and the engine runs it.
<b>Ctrl+Enter</b> runs, <b>F8</b> settles one node.</p>
<pre>algo bfs | dfs | dijkstra | astar</pre>
<p><b>Algorithms.</b> <code>bfs</code> breadth-first — fewest hops (ignores
weights) · <code>dfs</code> depth-first — dives one branch first · <code>dijkstra</code>
cheapest by total weight · <code>astar</code> A* — cheapest, guided toward the
target by a distance heuristic so it settles fewer nodes.</p>
<p><b>Metrics.</b> Levels grade on the <i>path cost</i>, the <i>hop count</i>, and
the number of <i>nodes settled</i>. Ties break by node id, so every run is
deterministic. Hidden graphs are different maps, so an algorithm tuned to the
visible ones fails.</p>`,

  errEmpty: 'Write a config.',
  errNeedAlgo: 'The `algo` line needs a name.',
  errBadAlgo: 'Unknown algorithm: "{0}" (bfs, dfs, dijkstra, astar).',
  errUnexpected: 'Unexpected: {0}.',
  errUnknownKey: 'Unknown directive: "{0}".',
  errDupKey: '`{0}` is set twice.',
  errNotAllowed: 'The directive `{0}` is not allowed in this level.',
  errNoAlgo: 'No algorithm chosen — add an `algo` line.',
  errNoNodes: 'The graph has no nodes.',
  errNoEdges: 'The graph has no edge list.',
  errNoSource: 'The source node "{0}" is not in the graph.',
  errNoTarget: 'The target node "{0}" is not in the graph.',
  errBadEdge: 'Edge references an unknown node: {0}–{1}.',
  errBadWeight: 'Edge {0}–{1} has a non-positive weight.',
  errInternal: 'Internal error: {0}.',
};
