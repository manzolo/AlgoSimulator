// EDU-ALGO · dstruct · level 10 — heapify's linear-time win at scale.

import { swapsCases } from './generators.js';

export const solution = 'structure heap\nbuild heapify';

export default {
  id: 'big-heap',
  title: { en: 'Heapify at scale', it: 'Heapify su larga scala' },
  text: {
    en: `<p>Building a heap by <b>heapify</b> is O(n); building it by repeated
<b>insert</b> is O(n·log n). On a handful of keys nobody notices — on a big
adversarial stream the swap counts pull apart sharply.</p>
<p>Same choice as level 3, larger workloads. Keep the build cheap.</p>`,
    it: `<p>Costruire un heap con <b>heapify</b> è O(n); costruirlo con <b>insert</b>
ripetuto è O(n·log n). Su poche chiavi non se ne accorge nessuno — su un grande
stream ostile i conteggi di scambi si separano nettamente.</p>
<p>Stessa scelta del livello 3, carichi più grandi. Tieni il build economico.</p>`,
  },
  goal: {
    en: 'Keep the build swaps ≤ the reference on every large workload.',
    it: 'Tieni gli scambi del build ≤ il riferimento su ogni carico grande.',
  },
  hints: [
    { en: '`build heapify` again — the linear-time construction.', it: '`build heapify` di nuovo — la costruzione lineare.' },
    { en: 'A long descending stream is where insertion sift-ups pile up.', it: 'Un lungo stream decrescente è dove le risalite di insert si accumulano.' },
  ],
  allowed: ['structure', 'build'],
  start: 'structure heap\nbuild insert',
  makeCases: () => swapsCases(solution, [
    { keys: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], visible: true },
    { keys: [2, 4, 6, 8, 10, 12, 14, 16, 18], visible: true },
    { keys: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
    { keys: [20, 18, 16, 14, 12, 10, 8, 6, 4, 2] },
    { keys: [15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
  ]),
};
