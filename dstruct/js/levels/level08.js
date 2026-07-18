// EDU-ALGO · dstruct · level 08 — load factor in an open-addressed table.

import { maxProbeCases } from './generators.js';

export const solution = 'structure hash\nprobe linear\ncapacity 17';

export default {
  id: 'load-factor',
  title: { en: 'Leave some air', it: 'Lascia respiro' },
  text: {
    en: `<p>Open addressing has a hard wall a chained table doesn't: once the
table is full there is nowhere left to probe. Long before that, a high <b>load
factor</b> (keys ÷ capacity) makes probe runs explode — near-full tables are
slow tables.</p>
<p>Keep the linear probe, but give the table enough room that even a nasty,
colliding workload never has to probe far.</p>`,
    it: `<p>L'indirizzamento aperto ha un muro che la tabella concatenata non ha:
quando la tabella è piena non c'è più dove sondare. Molto prima, un alto
<b>fattore di carico</b> (chiavi ÷ capacità) fa esplodere le file di probe — le
tabelle quasi piene sono tabelle lente.</p>
<p>Tieni il probe lineare, ma dai alla tabella spazio a sufficienza perché anche
un carico ostile e pieno di collisioni non debba mai sondare lontano.</p>`,
  },
  goal: {
    en: 'Keep the worst probe length ≤ the reference on every workload.',
    it: 'Tieni la lunghezza del probe peggiore ≤ il riferimento su ogni carico.',
  },
  hints: [
    { en: 'Same probe strategy, more room: raise the capacity.', it: 'Stessa strategia di probe, più spazio: alza la capacità.' },
    { en: 'A capacity barely above the key count leaves no slack for collisions.', it: 'Una capacità di poco sopra il numero di chiavi non lascia margine alle collisioni.' },
  ],
  allowed: ['structure', 'probe', 'capacity'],
  start: 'structure hash\nprobe linear\ncapacity 11',
  makeCases: () => maxProbeCases(solution, [
    { keys: [1, 2, 3], visible: true },
    { keys: [1, 2, 3, 4, 5], visible: true },
    { keys: [0, 11, 22, 33, 44] },
    { keys: [0, 11, 22, 33, 44, 55, 66] },
    { keys: [11, 22, 33, 44, 55, 66] },
  ]),
};
