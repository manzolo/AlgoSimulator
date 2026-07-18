// EDU-ALGO · graph · level 08 — A* across wider open ground.

import { astarCases, line, gridGraph } from './generators.js';

export const solution = 'algo astar';

export default {
  id: 'astar-grid',
  title: { en: 'Open ground', it: 'Campo aperto' },
  text: {
    en: `<p>The more open the map, the more a blind Dijkstra wastes: it settles a
whole disc of nodes around the source before the target's turn comes up. A*'s
heuristic keeps the search a narrow beam toward the goal, so on wider grids it
settles a fraction of what Dijkstra does — same path, far less work.</p>`,
    it: `<p>Più la mappa è aperta, più un Dijkstra cieco spreca: sistema un intero
disco di nodi attorno alla sorgente prima che tocchi al target. L'euristica dell'A*
tiene la ricerca un fascio stretto verso la meta, così su griglie più larghe
sistema una frazione di ciò che fa Dijkstra — stesso cammino, molto meno lavoro.</p>`,
  },
  goal: {
    en: 'Optimal path, minimal nodes settled, on every graph. Use `algo astar`.',
    it: "Cammino ottimo, minimo di nodi sistemati, su ogni grafo. Usa `algo astar`.",
  },
  hints: [
    { en: 'Still `algo astar` — the heuristic does the aiming.', it: "Sempre `algo astar` — l'euristica fa la mira." },
    { en: 'Plain Dijkstra finds the same path but pays for the whole disc it settles.', it: "Il Dijkstra semplice trova lo stesso cammino ma paga tutto il disco che sistema." },
  ],
  allowed: ['algo'],
  start: 'algo dijkstra',
  makeCases: () => astarCases([
    { setup: line(6), visible: true },
    { setup: line(7), visible: true },
    { setup: gridGraph(6, 6, { target: 'n14' }) },
    { setup: gridGraph(8, 7, { target: 'n19' }) },
    { setup: gridGraph(9, 9, { target: 'n30' }) },
  ]),
};
