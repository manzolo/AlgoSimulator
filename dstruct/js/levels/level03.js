// EDU-ALGO · dstruct · level 03 — build a heap cheaply with heapify.

import { swapsCases } from './generators.js';

export const solution = 'structure heap\nbuild heapify';

export default {
  id: 'heapify',
  title: { en: 'Build a heap cheaply', it: 'Costruisci un heap a poco prezzo' },
  text: {
    en: `<p>A <b>binary heap</b> is an array where every parent is ≤ its children
(a <b>min-heap</b>). You can build one two ways: <b>insert</b> keys one by one
(each may <i>sift up</i>), or drop them all in and <b>heapify</b> — sift down from
the last parent, which is O(n) instead of O(n·log n).</p>
<p>We count the swaps the build costs. Pick the cheaper construction.</p>`,
    it: `<p>Un <b>heap binario</b> è un array dove ogni genitore è ≤ dei figli (un
<b>min-heap</b>). Lo costruisci in due modi: <b>insert</b> chiave per chiave
(ognuna può <i>risalire</i>), oppure buttarle tutte dentro e <b>heapify</b> —
risistemare dal basso, che è O(n) invece di O(n·log n).</p>
<p>Contiamo gli scambi del build. Scegli la costruzione più economica.</p>`,
  },
  goal: {
    en: 'Keep the build swaps ≤ the reference on every workload. Use `build heapify`.',
    it: "Tieni gli scambi del build ≤ il riferimento su ogni carico. Usa `build heapify`.",
  },
  hints: [
    { en: 'Two lines: `structure heap` and `build heapify`.', it: 'Due righe: `structure heap` e `build heapify`.' },
    { en: 'On an already-ascending stream both cost nothing — the gap shows on a descending one.', it: 'Su uno stream già crescente costano zero entrambi — il divario si vede su uno decrescente.' },
  ],
  allowed: ['structure', 'build'],
  start: 'structure heap\nbuild insert',
  makeCases: () => swapsCases(solution, [
    { keys: [1, 2, 3, 4, 5, 6, 7], visible: true },
    { keys: [2, 4, 6, 8, 10, 12], visible: true },
    { keys: [7, 6, 5, 4, 3, 2, 1] },
    { keys: [12, 10, 8, 6, 4, 2] },
    { keys: [9, 8, 6, 7, 3, 5, 1, 4, 2] },
  ]),
};
