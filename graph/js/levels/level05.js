// EDU-ALGO · graph · level 05 — the detour that pays off.

import { costCases, line, detour } from './generators.js';

export const solution = 'algo dijkstra';

export default {
  id: 'cheapest-detour',
  title: { en: 'Take the detour', it: 'Prendi la deviazione' },
  text: {
    en: `<p>Sometimes the winning route is the one with more turns. A direct road
that is heavily tolled can cost far more than a longer chain of cheap streets.
Dijkstra doesn't care how many hops the path has — only its total weight — so it
happily takes the detour when it is cheaper.</p>`,
    it: `<p>A volte la strada vincente è quella con più svolte. Una via diretta ma
molto pedaggiata può costare molto più di una catena lunga di stradine
economiche. A Dijkstra non importa quanti salti abbia il cammino — solo il peso
totale — perciò prende volentieri la deviazione quando conviene.</p>`,
  },
  goal: {
    en: 'Find the minimum-weight path, however many hops it takes.',
    it: 'Trova il cammino di peso minimo, per quanti salti serva.',
  },
  hints: [
    { en: '`algo dijkstra` weighs the whole path, not the number of hops.', it: '`algo dijkstra` pesa tutto il cammino, non il numero di salti.' },
    { en: 'A one-hop toll road is exactly what a hop-counter falls for.', it: 'Una superstrada a pedaggio di un salto è esattamente ciò che frega un contatore di salti.' },
  ],
  allowed: ['algo'],
  start: 'algo bfs',
  makeCases: () => costCases(solution, [
    { setup: line(6), visible: true },
    { setup: line(4), visible: true },
    { setup: detour(6, { heavy: 20, light: 2 }) },
    { setup: detour(5, { heavy: 15, light: 1 }) },
    { setup: detour(7, { heavy: 30, light: 3 }) },
  ]),
};
