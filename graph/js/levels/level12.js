// EDU-ALGO · graph · level 12 — capstone: the optimal, efficient pathfinder.

import { astarCases, line, gridGraph } from './generators.js';

export const solution = 'algo astar';

export default {
  id: 'capstone',
  title: { en: 'Capstone: the pathfinder', it: 'Capstone: il cercatore di cammini' },
  text: {
    en: `<p>Put it all together. You want the <b>cheapest</b> path (so a plain
hop-counter is out) and you want it <b>without</b> flooding the whole map (so a
blind Dijkstra is wasteful). On these large grids with a central goal, only the
guided search is both optimal <i>and</i> economical.</p>
<p>Match A*'s optimal cost and its node budget on every graph.</p>`,
    it: `<p>Metti tutto insieme. Vuoi il cammino <b>più economico</b> (quindi un
semplice contatore di salti è fuori) e lo vuoi <b>senza</b> allagare tutta la mappa
(quindi un Dijkstra cieco è uno spreco). Su queste griglie grandi con meta
centrale, solo la ricerca guidata è insieme ottima <i>ed</i> economica.</p>
<p>Eguaglia il costo ottimo dell'A* e il suo budget di nodi su ogni grafo.</p>`,
  },
  goal: {
    en: 'Optimal cost AND fewest nodes settled, on every graph. Your call.',
    it: 'Costo ottimo E minimo di nodi sistemati, su ogni grafo. Decidi tu.',
  },
  hints: [
    { en: 'Optimal path + few expansions = `algo astar`.', it: 'Cammino ottimo + poche espansioni = `algo astar`.' },
    { en: 'Dijkstra gets the cost right but settles far too much of the grid.', it: 'Dijkstra azzecca il costo ma sistema troppa parte della griglia.' },
  ],
  allowed: ['algo'],
  start: 'algo dijkstra',
  makeCases: () => astarCases([
    { setup: line(8), visible: true },
    { setup: line(6), visible: true },
    { setup: gridGraph(11, 11, { target: 'n60' }) },
    { setup: gridGraph(10, 10, { target: 'n55' }) },
    { setup: gridGraph(9, 9, { target: 'n40' }) },
  ]),
};
