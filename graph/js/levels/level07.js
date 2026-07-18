// EDU-ALGO · graph · level 07 — A*: aim the search with a heuristic.

import { astarCases, line, gridGraph } from './generators.js';

export const solution = 'algo astar';

export default {
  id: 'guided-search',
  title: { en: 'Aim the search', it: 'Punta la ricerca' },
  text: {
    en: `<p>Dijkstra is optimal but blind: it fans out in every direction equally,
settling nodes that lead away from the goal. <b>A*</b> adds a <b>heuristic</b> — a
cheap guess of the remaining distance (here, straight-line grid distance) — and
prefers nodes that seem to head <i>toward</i> the target. With an admissible
heuristic it finds the same optimal path, but settles far fewer nodes.</p>
<p>Find the cheapest path while expanding as few nodes as A* does.</p>`,
    it: `<p>Dijkstra è ottimo ma cieco: si espande in ogni direzione allo stesso
modo, sistemando nodi che portano lontano dalla meta. L'<b>A*</b> aggiunge
un'<b>euristica</b> — una stima economica della distanza rimanente (qui, la
distanza in griglia) — e preferisce i nodi che sembrano andare <i>verso</i> il
target. Con un'euristica ammissibile trova lo stesso cammino ottimo, ma sistema
molti meno nodi.</p>
<p>Trova il cammino più economico espandendo pochi nodi quanto l'A*.</p>`,
  },
  goal: {
    en: 'Find the optimal path while settling as few nodes as A*. Use `algo astar`.',
    it: "Trova il cammino ottimo sistemando pochi nodi quanto l'A*. Usa `algo astar`.",
  },
  hints: [
    { en: 'One line: `algo astar`.', it: 'Una riga: `algo astar`.' },
    { en: 'On a corridor there is nothing to prune; the win shows in open space.', it: 'In un corridoio non c\'è nulla da potare; il vantaggio si vede in campo aperto.' },
  ],
  allowed: ['algo'],
  start: 'algo bfs',
  makeCases: () => astarCases([
    { setup: line(5), visible: true },
    { setup: line(6), visible: true },
    { setup: gridGraph(7, 7, { target: 'n24' }) },
    { setup: gridGraph(7, 6, { target: 'n17' }) },
    { setup: gridGraph(8, 8, { target: 'n27' }) },
  ]),
};
