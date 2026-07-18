// EDU-ALGO · dstruct · level 09 — balancing pays off most at scale.

import { heightCases } from './generators.js';

export const solution = 'structure avl';

export default {
  id: 'deep-tree',
  title: { en: 'Balance at scale', it: 'Bilanciamento su larga scala' },
  text: {
    en: `<p>The gap between a balanced and an unbalanced tree widens with size: for
15 keys a balanced tree is 4 deep, a sorted-input BST is 15 deep — nearly four
times the work per lookup. For a million keys it is the difference between 20
steps and a million.</p>
<p>Same idea as level 1, bigger workloads. Keep the height logarithmic.</p>`,
    it: `<p>Il divario tra un albero bilanciato e uno sbilanciato cresce con la
dimensione: per 15 chiavi un albero bilanciato è profondo 4, un BST da input
ordinato è profondo 15 — quasi quattro volte il lavoro per lookup. Per un milione
di chiavi è la differenza tra 20 passi e un milione.</p>
<p>Stessa idea del livello 1, carichi più grandi. Tieni l'altezza logaritmica.</p>`,
  },
  goal: {
    en: 'Keep the height logarithmic on large workloads, sorted or not.',
    it: "Tieni l'altezza logaritmica su carichi grandi, ordinati o no.",
  },
  hints: [
    { en: 'The winning line is still `structure avl`.', it: 'La riga vincente è ancora `structure avl`.' },
    { en: 'A 15-key sorted stream is the worst case for a plain BST.', it: 'Uno stream ordinato di 15 chiavi è il caso peggiore per un BST semplice.' },
  ],
  allowed: ['structure'],
  start: 'structure bst',
  makeCases: () => heightCases(solution, [
    { keys: [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15], visible: true },
    { keys: [16, 8, 24, 4, 12, 20, 28, 2, 6, 10, 14], visible: true },
    { keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] },
    { keys: [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
    { keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] },
  ]),
};
