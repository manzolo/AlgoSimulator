// EDU-ALGO · dstruct · level 12 — capstone: pick the whole configuration.

import { maxProbeCases } from './generators.js';

export const solution = 'structure hash\nprobe quadratic\ncapacity 13';

export default {
  id: 'capstone',
  title: { en: 'Capstone: tune the table', it: 'Capstone: taratura della tabella' },
  text: {
    en: `<p>Everything is on the table now — structure, and for a hash the probe
strategy and the capacity. The workload is a mean one: keys that hash to a tight
band and keep colliding. Only a table that is both <b>roomy enough</b> and
<b>probes cleverly</b> keeps the worst lookup short.</p>
<p>Beat the reference worst-probe on every workload, visible and hidden.</p>`,
    it: `<p>Ora è tutto in gioco — la struttura e, per un hash, la strategia di
probe e la capacità. Il carico è cattivo: chiavi che finiscono in una banda
stretta e continuano a collidere. Solo una tabella <b>abbastanza ampia</b> e che
<b>sonda con astuzia</b> tiene corto il lookup peggiore.</p>
<p>Batti il probe-peggiore di riferimento su ogni carico, visibile e nascosto.</p>`,
  },
  goal: {
    en: 'Keep the worst probe length ≤ the reference on every workload — your whole config is free.',
    it: 'Tieni il probe peggiore ≤ il riferimento su ogni carico — tutta la config è libera.',
  },
  hints: [
    { en: 'A prime capacity around 13 plus `probe quadratic` handles the clustering.', it: 'Una capacità prima intorno a 13 più `probe quadratic` gestisce il clustering.' },
    { en: 'Linear probing on a snug table is exactly what this workload punishes.', it: 'Il probing lineare su una tabella stretta è esattamente ciò che questo carico punisce.' },
  ],
  allowed: ['structure', 'order', 'build', 'probe', 'capacity'],
  start: 'structure hash\nprobe linear\ncapacity 13',
  makeCases: () => maxProbeCases(solution, [
    { keys: [1, 2, 3, 4], visible: true },
    { keys: [0, 1, 2, 3, 4, 5], visible: true },
    { keys: [3, 4, 5, 6, 16, 17, 18, 29] },
    { keys: [2, 3, 4, 5, 15, 16, 17, 28] },
    { keys: [4, 5, 6, 7, 17, 18, 30, 31] },
  ]),
};
