// EDU-ALGO · graph · level 02 — hops in a grid with a wall.

import { hopCases, line, shortcut, gridGraph } from './generators.js';

export const solution = 'algo bfs';

export default {
  id: 'maze-hops',
  title: { en: 'Through the maze', it: 'Attraverso il labirinto' },
  text: {
    en: `<p>The same idea in a bigger world. A grid with a wall in it has many
routes of different lengths; BFS still finds one with the fewest hops, while a
depth-first dive can snake all the way around the obstacle.</p>`,
    it: `<p>La stessa idea in un mondo più grande. Una griglia con un muro ha molte
strade di lunghezza diversa; BFS trova comunque quella coi minori salti, mentre
un tuffo in profondità può serpeggiare tutt'attorno all'ostacolo.</p>`,
  },
  goal: {
    en: 'Keep the hop count minimal on every graph, maze or shortcut.',
    it: 'Tieni minimo il numero di salti su ogni grafo, labirinto o scorciatoia.',
  },
  hints: [
    { en: 'Still `algo bfs` — the ring-by-ring search.', it: 'Sempre `algo bfs` — la ricerca anello dopo anello.' },
    { en: 'Depth-first commits to a branch; in a maze that branch may be the long one.', it: 'La profondità si impegna su un ramo; in un labirinto quel ramo può essere il più lungo.' },
  ],
  allowed: ['algo'],
  start: 'algo dfs',
  makeCases: () => hopCases(solution, [
    { setup: line(5), visible: true },
    { setup: gridGraph(2, 4), visible: true },
    { setup: shortcut(6) },
    { setup: shortcut(7) },
    { setup: gridGraph(4, 4, { drop: [[1, 1], [1, 2], [2, 1]] }) },
  ]),
};
