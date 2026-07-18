// EDU-ALGO · dstruct · level 07 — open addressing and primary clustering.

import { maxProbeCases } from './generators.js';

export const solution = 'structure hash\nprobe quadratic\ncapacity 11';

export default {
  id: 'open-addressing',
  title: { en: 'No chains, probe in place', it: 'Niente catene, sonda sul posto' },
  text: {
    en: `<p>Instead of chaining, <b>open addressing</b> stores every key inside the
table: on a collision it <b>probes</b> for the next free slot. <b>Linear</b>
probing (try the next cell, then the next…) is simple but breeds <b>clusters</b> —
long runs of full cells that swallow later keys. <b>Quadratic</b> probing jumps
1, 4, 9… cells away, scattering the pile-up.</p>
<p>Same table size for both — pick the probe that keeps the worst search short.</p>`,
    it: `<p>Invece del concatenamento, l'<b>indirizzamento aperto</b> mette ogni
chiave dentro la tabella: a una collisione <b>sonda</b> lo slot libero successivo.
Il probing <b>lineare</b> (prova la cella dopo, poi quella dopo…) è semplice ma
genera <b>cluster</b> — lunghe file di celle piene che inghiottono le chiavi
seguenti. Il probing <b>quadratico</b> salta di 1, 4, 9… celle, disperdendo
l'ingorgo.</p>
<p>Stessa dimensione per entrambi — scegli il probe che tiene corta la ricerca
peggiore.</p>`,
  },
  goal: {
    en: 'Keep the worst probe length ≤ the reference on every workload.',
    it: 'Tieni la lunghezza del probe peggiore ≤ il riferimento su ogni carico.',
  },
  hints: [
    { en: 'Three lines: `structure hash`, `probe quadratic`, `capacity 11`.', it: 'Tre righe: `structure hash`, `probe quadratic`, `capacity 11`.' },
    { en: 'Linear probing turns a cluster of adjacent slots into one long run.', it: 'Il probing lineare trasforma un cluster di slot adiacenti in una fila lunga.' },
  ],
  allowed: ['structure', 'probe', 'capacity'],
  start: 'structure hash\nprobe linear\ncapacity 11',
  makeCases: () => maxProbeCases(solution, [
    { keys: [1, 2, 3, 4], visible: true },
    { keys: [0, 1, 2, 3, 4], visible: true },
    { keys: [3, 4, 5, 6, 7, 14, 15] },
    { keys: [2, 3, 4, 5, 13, 14, 15] },
    { keys: [4, 5, 6, 7, 8, 15, 16, 17] },
  ]),
};
