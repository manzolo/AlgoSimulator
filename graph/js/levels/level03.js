// EDU-ALGO · graph · level 03 — the depth-first visit order.

import { orderCases, line } from './generators.js';

export const solution = 'algo dfs';

// A branching tree: BFS sweeps level by level, DFS dives one branch first.
const T = (edges, target) => ({
  nodes: [
    { id: 'n00', x: 2, y: 0 }, { id: 'n01', x: 1, y: 1 }, { id: 'n02', x: 3, y: 1 },
    { id: 'n03', x: 0, y: 2 }, { id: 'n04', x: 1, y: 2 }, { id: 'n05', x: 3, y: 2 },
  ],
  edges, source: 'n00', target,
});
const TREE = T([['n00', 'n01', 1], ['n00', 'n02', 1], ['n01', 'n03', 1], ['n01', 'n04', 1], ['n02', 'n05', 1]], 'n05');
const TREE2 = T([['n00', 'n01', 1], ['n00', 'n02', 1], ['n01', 'n03', 1], ['n02', 'n04', 1], ['n02', 'n05', 1]], 'n05');

export default {
  id: 'dfs-order',
  title: { en: 'Depth first', it: 'Prima in profondità' },
  text: {
    en: `<p>The two searches disagree about <i>order</i>. <b>DFS</b> follows a
branch to its end, backtracks, then tries the next — a stack discipline. <b>BFS</b>
sweeps outward level by level — a queue. On a tree the two produce visibly
different visit orders.</p>
<p>Match the depth-first visit order on every graph. Use <code>algo dfs</code>.</p>`,
    it: `<p>Le due ricerche non concordano sull'<i>ordine</i>. La <b>DFS</b> segue un
ramo fino in fondo, torna indietro, poi prova il successivo — una disciplina a
pila. La <b>BFS</b> spazza verso l'esterno livello per livello — una coda. Su un
albero le due producono ordini di visita ben diversi.</p>
<p>Riproduci l'ordine di visita in profondità su ogni grafo. Usa
<code>algo dfs</code>.</p>`,
  },
  goal: {
    en: 'Reproduce the depth-first visit order on every graph. Use `algo dfs`.',
    it: "Riproduci l'ordine di visita in profondità su ogni grafo. Usa `algo dfs`.",
  },
  hints: [
    { en: 'One line: `algo dfs`.', it: 'Una riga: `algo dfs`.' },
    { en: 'On a straight line both orders coincide — the branches are where they split.', it: 'Su una linea retta i due ordini coincidono — è nei rami che si separano.' },
  ],
  allowed: ['algo'],
  start: 'algo bfs',
  makeCases: () => orderCases(solution, [
    { setup: line(4), visible: true },
    { setup: line(5), visible: true },
    { setup: TREE },
    { setup: TREE2 },
  ]),
};
