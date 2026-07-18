// EDU-ALGO · dstruct · level 06 — fewer collisions with a roomier table.

import { collisionCases } from './generators.js';

export const solution = 'structure hash\nprobe chain\ncapacity 11';

export default {
  id: 'collisions',
  title: { en: 'Count the collisions', it: 'Conta le collisioni' },
  text: {
    en: `<p>A <b>collision</b> is a key landing in a bucket that is already taken.
Collisions are what turn a hash table's promised O(1) into something slower, so a
good table has few of them. The load factor — keys ÷ capacity — is the dial.</p>
<p>Same chaining as before, but now we grade the <i>number of collisions</i>.
Choose a capacity that spreads the keys out.</p>`,
    it: `<p>Una <b>collisione</b> è una chiave che finisce in un secchio già
occupato. Le collisioni sono ciò che trasforma l'O(1) promesso di una tabella hash
in qualcosa di più lento, perciò una buona tabella ne ha poche. Il fattore di
carico — chiavi ÷ capacità — è la manopola.</p>
<p>Stesso concatenamento di prima, ma ora valutiamo il <i>numero di collisioni</i>.
Scegli una capacità che sparpagli le chiavi.</p>`,
  },
  goal: {
    en: 'Keep the number of collisions ≤ the reference on every workload.',
    it: 'Tieni il numero di collisioni ≤ il riferimento su ogni carico.',
  },
  hints: [
    { en: 'A prime capacity comfortably larger than the key count helps.', it: 'Una capacità prima e comodamente più grande del numero di chiavi aiuta.' },
    { en: 'Capacity 3 forces collisions the moment a fourth key arrives.', it: 'Capacità 3 forza collisioni appena arriva una quarta chiave.' },
  ],
  allowed: ['structure', 'probe', 'capacity'],
  start: 'structure hash\nprobe chain\ncapacity 3',
  makeCases: () => collisionCases(solution, [
    { keys: [0, 1, 2], visible: true },
    { keys: [3, 7, 11], visible: true },
    { keys: [0, 3, 6, 9, 1, 4, 7] },
    { keys: [3, 6, 9, 12, 15, 18] },
    { keys: [0, 3, 6, 9, 12, 1, 4] },
  ]),
};
