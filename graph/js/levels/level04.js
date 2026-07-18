// EDU-ALGO · graph · level 04 — weighted edges: cheapest, not shortest.

import { costCases, line, detour } from './generators.js';

export const solution = 'algo dijkstra';

export default {
  id: 'weighted-roads',
  title: { en: 'Cheapest, not shortest', it: 'Il più economico, non il più corto' },
  text: {
    en: `<p>Give the edges <b>weights</b> — distance, time, toll — and "shortest"
stops meaning "fewest hops". A single long edge can cost more than a chain of
short ones. BFS still counts hops, so it can pick an expensive one-hop road.</p>
<p><b>Dijkstra's algorithm</b> always expands the closest-by-<i>weight</i> node
next, so it settles the true minimum-cost path. Choose it.</p>`,
    it: `<p>Dai <b>pesi</b> agli archi — distanza, tempo, pedaggio — e "più corto"
smette di voler dire "meno salti". Un singolo arco lungo può costare più di una
catena di archi brevi. La BFS conta i salti, quindi può scegliere una strada
costosa a un solo salto.</p>
<p>L'<b>algoritmo di Dijkstra</b> espande sempre il nodo più vicino per <i>peso</i>,
perciò trova il vero cammino di costo minimo. Scegli quello.</p>`,
  },
  goal: {
    en: 'Reach the target at minimum total weight on every graph. Use `algo dijkstra`.',
    it: 'Raggiungi il target al minimo peso totale su ogni grafo. Usa `algo dijkstra`.',
  },
  hints: [
    { en: 'One line: `algo dijkstra`.', it: 'Una riga: `algo dijkstra`.' },
    { en: 'When all weights are equal, hops and cost agree — the gap is on weighted graphs.', it: "Quando i pesi sono tutti uguali, salti e costo coincidono — il divario è sui grafi pesati." },
  ],
  allowed: ['algo'],
  start: 'algo bfs',
  makeCases: () => costCases(solution, [
    { setup: line(4), visible: true },
    { setup: line(5), visible: true },
    { setup: detour(4, { heavy: 10, light: 1 }) },
    { setup: detour(3, { heavy: 8, light: 2 }) },
    { setup: detour(5, { heavy: 12, light: 2 }) },
  ]),
};
