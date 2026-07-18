// EDU-ALGO · dstruct · level 05 — a hash table with separate chaining.

import { maxProbeCases } from './generators.js';

export const solution = 'structure hash\nprobe chain\ncapacity 13';

export default {
  id: 'hashing-chains',
  title: { en: 'Buckets and chains', it: 'Secchi e catene' },
  text: {
    en: `<p>A <b>hash table</b> maps a key to a bucket with <code>key mod
capacity</code> — O(1) lookups, in theory. When two keys share a bucket they
<b>collide</b>; with <b>separate chaining</b> the bucket holds a little list, and
a lookup walks it. The longer the chain, the slower the lookup.</p>
<p>Too few buckets and everything piles into a handful of long chains. Give the
table enough room to keep the worst chain short.</p>`,
    it: `<p>Una <b>tabella hash</b> mappa una chiave a un secchio con <code>key mod
capacity</code> — lookup O(1), in teoria. Quando due chiavi finiscono nello stesso
secchio <b>collidono</b>; col <b>concatenamento</b> il secchio tiene una listina e
la ricerca la percorre. Più lunga la catena, più lenta la ricerca.</p>
<p>Pochi secchi e tutto si ammucchia in poche catene lunghe. Dai alla tabella
spazio a sufficienza per tenere corta la catena peggiore.</p>`,
  },
  goal: {
    en: 'Keep the worst probe (longest chain) minimal on every workload.',
    it: 'Tieni il probe peggiore (catena più lunga) minimo su ogni carico.',
  },
  hints: [
    { en: 'Three lines: `structure hash`, `probe chain`, `capacity <n>`.', it: 'Tre righe: `structure hash`, `probe chain`, `capacity <n>`.' },
    { en: 'A tiny capacity ties on a few keys, then buries a big workload in one chain.', it: 'Una capacità minuscola pareggia su poche chiavi, poi seppellisce un grande carico in una catena sola.' },
  ],
  allowed: ['structure', 'probe', 'capacity'],
  start: 'structure hash\nprobe chain\ncapacity 4',
  makeCases: () => maxProbeCases(solution, [
    { keys: [1, 2, 3], visible: true },
    { keys: [0, 1, 2, 3], visible: true },
    { keys: [0, 4, 8, 12, 16, 1, 5] },
    { keys: [4, 8, 12, 16, 20, 24] },
    { keys: [0, 4, 8, 12, 16, 20, 24, 1] },
  ]),
};
