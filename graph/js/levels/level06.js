// EDU-ALGO · graph · level 06 — hops vs cost, made explicit.

import { costCases, gridGraph, detour } from './generators.js';

export const solution = 'algo dijkstra';

export default {
  id: 'hops-vs-cost',
  title: { en: 'Count weight, not hops', it: 'Conta il peso, non i salti' },
  text: {
    en: `<p>When every edge weighs the same, fewest-hops and cheapest are the same
answer — so BFS looks correct. Change even one weight and they diverge. The safe
choice is the one that is right in <i>both</i> worlds: weigh the path.</p>`,
    it: `<p>Quando ogni arco pesa uguale, meno-salti e più-economico sono la stessa
risposta — così la BFS sembra corretta. Cambia anche un solo peso e divergono. La
scelta sicura è quella giusta in <i>entrambi</i> i mondi: pesa il cammino.</p>`,
  },
  goal: {
    en: 'Minimum total weight on every graph — uniform grids and weighted detours alike.',
    it: 'Peso totale minimo su ogni grafo — griglie uniformi e deviazioni pesate.',
  },
  hints: [
    { en: 'On the uniform grid any correct search ties; the detours are the test.', it: 'Sulla griglia uniforme ogni ricerca corretta pareggia; le deviazioni sono la prova.' },
    { en: '`algo dijkstra` is right whether or not the weights vary.', it: '`algo dijkstra` è giusto che i pesi varino o meno.' },
  ],
  allowed: ['algo'],
  start: 'algo bfs',
  makeCases: () => costCases(solution, [
    { setup: gridGraph(3, 3), visible: true },
    { setup: gridGraph(2, 5), visible: true },
    { setup: detour(4, { heavy: 9, light: 2 }) },
    { setup: detour(6, { heavy: 18, light: 2 }) },
    { setup: detour(3, { heavy: 7, light: 2 }) },
  ]),
};
