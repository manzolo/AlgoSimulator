// EDU-ALGO · dstruct · level 04 — a max-heap, built cheaply.

import { swapsCases } from './generators.js';

export const solution = 'structure heap\norder max\nbuild heapify';

export default {
  id: 'max-heap',
  title: { en: 'The other way up', it: 'Al contrario' },
  text: {
    en: `<p>Flip the rule and every parent is ≥ its children: a <b>max-heap</b>,
whose root is the largest key (a priority queue for "biggest first"). Set
<code>order max</code>.</p>
<p>As before, <b>heapify</b> builds it in linear time while repeated
<b>insert</b> sifts up over and over. Keep the swap count minimal.</p>`,
    it: `<p>Ribalta la regola e ogni genitore è ≥ dei figli: un <b>max-heap</b>, la
cui radice è la chiave più grande (una coda di priorità "prima il più grande").
Imposta <code>order max</code>.</p>
<p>Come prima, <b>heapify</b> lo costruisce in tempo lineare mentre l'<b>insert</b>
ripetuto risale in continuazione. Tieni gli scambi al minimo.</p>`,
  },
  goal: {
    en: 'Build a max-heap with the fewest swaps on every workload.',
    it: 'Costruisci un max-heap col minor numero di scambi su ogni carico.',
  },
  hints: [
    { en: 'Three lines: `structure heap`, `order max`, `build heapify`.', it: 'Tre righe: `structure heap`, `order max`, `build heapify`.' },
    { en: 'For a max-heap the costly insert stream is the ascending one.', it: 'Per un max-heap lo stream costoso da inserire è quello crescente.' },
  ],
  allowed: ['structure', 'order', 'build'],
  start: 'structure heap\norder max\nbuild insert',
  makeCases: () => swapsCases(solution, [
    { keys: [7, 6, 5, 4, 3, 2, 1], visible: true },
    { keys: [12, 10, 8, 6, 4, 2], visible: true },
    { keys: [1, 2, 3, 4, 5, 6, 7] },
    { keys: [2, 4, 6, 8, 10, 12, 14] },
    { keys: [1, 3, 2, 5, 4, 7, 6, 9, 8] },
  ]),
};
