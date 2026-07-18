// EDU-ALGO · dstruct · level 02 — a short tree means cheaper lookups.

import { comparisonsCases } from './generators.js';

export const solution = 'structure avl';

export default {
  id: 'search-cost',
  title: { en: 'Cheaper lookups', it: 'Ricerche più economiche' },
  text: {
    en: `<p>Every step down a search tree is one <b>comparison</b>. The taller the
tree, the more comparisons a lookup costs — a degenerate BST turns an O(log n)
search into an O(n) crawl.</p>
<p>Here we count the comparisons made while <i>building</i> the tree. Keep that
total as low as the balanced reference on every workload.</p>`,
    it: `<p>Ogni passo giù per un albero di ricerca è un <b>confronto</b>. Più
l'albero è alto, più confronti costa una ricerca — un BST degenere trasforma una
ricerca O(log n) in una scansione O(n).</p>
<p>Qui contiamo i confronti fatti <i>costruendo</i> l'albero. Tieni quel totale
basso quanto il riferimento bilanciato su ogni carico.</p>`,
  },
  goal: {
    en: 'Keep the total insert comparisons ≤ the balanced tree, on every workload.',
    it: "Tieni i confronti totali d'inserimento ≤ l'albero bilanciato, su ogni carico.",
  },
  hints: [
    { en: 'The same structure that stays short also compares less.', it: 'La stessa struttura che resta bassa fa anche meno confronti.' },
    { en: 'On a sorted workload a BST compares against every earlier key.', it: 'Su un carico ordinato un BST confronta con ogni chiave precedente.' },
  ],
  allowed: ['structure'],
  start: 'structure bst',
  makeCases: () => comparisonsCases(solution, [
    { keys: [4, 2, 6, 1, 3, 5, 7], visible: true },
    { keys: [8, 4, 12, 2, 6, 10, 14], visible: true },
    { keys: [1, 2, 3, 4, 5, 6, 7, 8] },
    { keys: [5, 10, 15, 20, 25] },
    { keys: [9, 8, 7, 6, 5, 4, 3, 2] },
  ]),
};
