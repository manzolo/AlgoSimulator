// EDU-ALGO · graph · level 09 — fewest hops in bigger mazes.

import { hopCases, line, shortcut, gridGraph } from './generators.js';

export const solution = 'algo bfs';

export default {
  id: 'big-maze',
  title: { en: 'The bigger maze', it: 'Il labirinto più grande' },
  text: {
    en: `<p>Scale the unweighted world up: longer shortcuts, larger walled grids.
The ring-by-ring search still nails the fewest-hops route every time, while a
depth-first dive commits early and pays for it.</p>`,
    it: `<p>Ingrandisci il mondo non pesato: scorciatoie più lunghe, griglie murate
più grandi. La ricerca anello dopo anello inchioda ogni volta la via coi minori
salti, mentre un tuffo in profondità si impegna presto e la paga.</p>`,
  },
  goal: {
    en: 'Fewest hops on every graph, at any size. Use `algo bfs`.',
    it: 'Meno salti su ogni grafo, a qualunque taglia. Usa `algo bfs`.',
  },
  hints: [
    { en: '`algo bfs` scales without changing its guarantee.', it: '`algo bfs` scala senza cambiare la sua garanzia.' },
    { en: 'A longer detour just makes the depth-first mistake bigger.', it: 'Una deviazione più lunga rende solo più grande l\'errore della profondità.' },
  ],
  allowed: ['algo'],
  start: 'algo dfs',
  makeCases: () => hopCases(solution, [
    { setup: line(6), visible: true },
    { setup: line(8), visible: true },
    { setup: shortcut(8) },
    { setup: gridGraph(5, 5, { drop: [[1, 1], [2, 1], [3, 1], [1, 3], [2, 3]] }) },
    { setup: shortcut(9) },
  ]),
};
