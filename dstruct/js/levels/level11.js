// EDU-ALGO · dstruct · level 11 — quadratic probing on a bigger table.

import { maxProbeCases } from './generators.js';

export const solution = 'structure hash\nprobe quadratic\ncapacity 17';

export default {
  id: 'big-hash',
  title: { en: 'Scatter the pile-up', it: "Disperdi l'ingorgo" },
  text: {
    en: `<p>Put the two open-addressing ideas together: a table big enough to keep
the load factor sane, and a <b>quadratic</b> probe so the collisions that remain
don't cluster. On a large, deliberately clustering workload, linear probing
still forms long runs while quadratic keeps the worst probe short.</p>`,
    it: `<p>Metti insieme le due idee dell'indirizzamento aperto: una tabella
abbastanza grande da tenere sano il fattore di carico, e un probe <b>quadratico</b>
perché le collisioni rimaste non si raggruppino. Su un grande carico che collide
di proposito, il probing lineare forma ancora file lunghe mentre il quadratico
tiene corto il probe peggiore.</p>`,
  },
  goal: {
    en: 'Keep the worst probe length ≤ the reference on every workload.',
    it: 'Tieni la lunghezza del probe peggiore ≤ il riferimento su ogni carico.',
  },
  hints: [
    { en: '`probe quadratic` with a roomy prime capacity like 17.', it: '`probe quadratic` con una capacità prima e ampia come 17.' },
    { en: 'Adjacent home slots plus late arrivals are what wreck a linear probe.', it: 'Slot casa adiacenti più arrivi tardivi sono ciò che rovina un probe lineare.' },
  ],
  allowed: ['structure', 'probe', 'capacity'],
  start: 'structure hash\nprobe linear\ncapacity 17',
  makeCases: () => maxProbeCases(solution, [
    { keys: [1, 2, 3, 4, 5], visible: true },
    { keys: [0, 1, 2, 3, 4, 5, 6], visible: true },
    { keys: [3, 4, 5, 6, 7, 8, 20, 21, 22] },
    { keys: [5, 6, 7, 8, 9, 22, 23, 24, 25] },
    { keys: [2, 3, 4, 5, 6, 7, 19, 20, 21] },
  ]),
};
