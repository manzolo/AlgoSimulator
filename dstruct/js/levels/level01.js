// EDU-ALGO · dstruct · level 01 — balance keeps a search tree short.

import { heightCases } from './generators.js';

export const solution = 'structure avl';

export default {
  id: 'balanced-tree',
  title: { en: 'Keep the tree short', it: "Tieni l'albero basso" },
  text: {
    en: `<p>A <b>binary search tree</b> keeps keys ordered: smaller on the left,
larger on the right. But its shape depends on the <i>order</i> the keys arrive —
feed it a sorted stream and a plain BST grows into a tall, one-sided chain.</p>
<p>An <b>AVL tree</b> is self-balancing: after each insert it <b>rotates</b> to
stay short. Pick the structure that keeps the height small no matter the order.</p>`,
    it: `<p>Un <b>albero binario di ricerca</b> tiene le chiavi ordinate: le più
piccole a sinistra, le più grandi a destra. Ma la sua forma dipende
dall'<i>ordine</i> in cui arrivano le chiavi — dagli uno stream ordinato e un BST
semplice diventa una catena alta e sbilenca.</p>
<p>Un <b>albero AVL</b> si ribilancia da solo: dopo ogni inserimento <b>ruota</b>
per restare basso. Scegli la struttura che tiene l'altezza piccola comunque.</p>`,
  },
  goal: {
    en: 'Keep the tree height minimal on every workload — including a sorted one. Use `structure avl`.',
    it: "Tieni l'altezza minima su ogni carico — anche uno ordinato. Usa `structure avl`.",
  },
  hints: [
    { en: 'One line: `structure avl`.', it: 'Una riga: `structure avl`.' },
    { en: 'A plain BST ties an AVL on random keys, but degenerates on sorted ones.', it: 'Un BST semplice pareggia con un AVL su chiavi casuali, ma degenera su quelle ordinate.' },
  ],
  allowed: ['structure'],
  start: 'structure bst',
  makeCases: () => heightCases(solution, [
    { keys: [5, 3, 8, 2, 4, 7, 9], visible: true },
    { keys: [4, 2, 6, 1, 3, 5, 7], visible: true },
    { keys: [1, 2, 3, 4, 5, 6, 7] },
    { keys: [7, 6, 5, 4, 3, 2, 1] },
    { keys: [10, 20, 30, 40, 50, 60] },
  ]),
};
