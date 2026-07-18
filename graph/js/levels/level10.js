// EDU-ALGO · graph · level 10 — minimum weight at scale.

import { costCases, line, detour } from './generators.js';

export const solution = 'algo dijkstra';

export default {
  id: 'big-roads',
  title: { en: 'The road network', it: 'La rete stradale' },
  text: {
    en: `<p>A real map is all weights: long detours of cheap streets, short stretches
of expensive highway. The bigger and more varied the weights, the more a
hop-counter loses. Dijkstra keeps settling the closest node by cost, so it always
returns the genuinely cheapest route.</p>`,
    it: `<p>Una mappa vera è tutta pesi: lunghe deviazioni di stradine economiche,
brevi tratti di autostrada costosa. Più i pesi sono grandi e vari, più un
contatore di salti perde. Dijkstra continua a sistemare il nodo più vicino per
costo, perciò restituisce sempre la via davvero più economica.</p>`,
  },
  goal: {
    en: 'Minimum total weight on every road network. Use `algo dijkstra`.',
    it: 'Peso totale minimo su ogni rete stradale. Usa `algo dijkstra`.',
  },
  hints: [
    { en: '`algo dijkstra` — cost, never hop count.', it: '`algo dijkstra` — costo, mai numero di salti.' },
    { en: 'Bigger toll on the direct edge only widens the gap.', it: 'Un pedaggio più alto sull\'arco diretto allarga solo il divario.' },
  ],
  allowed: ['algo'],
  start: 'algo bfs',
  makeCases: () => costCases(solution, [
    { setup: line(7), visible: true },
    { setup: line(5), visible: true },
    { setup: detour(8, { heavy: 40, light: 3 }) },
    { setup: detour(6, { heavy: 25, light: 2 }) },
    { setup: detour(9, { heavy: 50, light: 4 }) },
  ]),
};
