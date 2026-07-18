// EDU-ALGO · graph · level 11 — A* on large grids.

import { astarCases, line, gridGraph } from './generators.js';

export const solution = 'algo astar';

export default {
  id: 'big-astar',
  title: { en: 'A* at scale', it: 'A* su larga scala' },
  text: {
    en: `<p>The heuristic's payoff grows with the map. On a large grid Dijkstra
settles a huge disc of nodes before it reaches the target; A* walks almost
straight to it. Same optimal path, a small fraction of the nodes settled.</p>`,
    it: `<p>Il vantaggio dell'euristica cresce con la mappa. Su una griglia grande
Dijkstra sistema un enorme disco di nodi prima di raggiungere il target; l'A* ci
cammina quasi dritto. Stesso cammino ottimo, una piccola frazione dei nodi
sistemati.</p>`,
  },
  goal: {
    en: 'Optimal path, fewest nodes settled, on large grids. Use `algo astar`.',
    it: 'Cammino ottimo, minimo di nodi sistemati, su griglie grandi. Usa `algo astar`.',
  },
  hints: [
    { en: '`algo astar` — the bigger the grid, the bigger the saving.', it: '`algo astar` — più grande la griglia, più grande il risparmio.' },
    { en: 'Dijkstra ties on a corridor and loses badly in open space.', it: 'Dijkstra pareggia in un corridoio e perde di brutto in campo aperto.' },
  ],
  allowed: ['algo'],
  start: 'algo dijkstra',
  makeCases: () => astarCases([
    { setup: line(7), visible: true },
    { setup: line(8), visible: true },
    { setup: gridGraph(10, 10, { target: 'n33' }) },
    { setup: gridGraph(11, 10, { target: 'n36' }) },
    { setup: gridGraph(12, 12, { target: 'n40' }) },
  ]),
};
