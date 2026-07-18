# EDU-ALGO · Algorithms Playground

🇮🇹 Italiano · [🇬🇧 English](README.en.md)

**▶ Provalo online: <https://manzolo.github.io/AlgoSimulator/?lang=it>**

Un hub didattico interattivo in **due piani** per capire **come un computer
organizza e cerca i dati** — le strutture dati e gli algoritmi su grafi —
mostrando ogni passo mentre accade. Motori scritti a mano, nessuna dipendenza:
il livello fissa il carico di lavoro, tu scegli la **struttura** o l'**algoritmo**,
e guardi l'albero crescere e ribilanciarsi, l'heap risistemarsi, la tabella hash
sondare gli slot, la frontiera di ricerca espandersi e il cammino accendersi.

È un fratello della collana EDU-*, insieme a
[EDU-16 ASM Playground](https://github.com/manzolo/AssemblerSimulator),
[EDU-NUM](https://github.com/manzolo/NumberSimulator),
[EDU-NET](https://github.com/manzolo/NetworkSimulator),
[EDU-REGEX](https://github.com/manzolo/RegexSimulator),
[EDU-SQL](https://github.com/manzolo/SqlSimulator),
[EDU-GIT](https://github.com/manzolo/GitSimulator),
[EDU-CRYPTO](https://github.com/manzolo/CryptoSimulator),
[EDU-NN](https://github.com/manzolo/NeuralSimulator) e
[EDU-OS](https://github.com/manzolo/OsSimulator).

## I due piani

- **Strutture dati** — costruisci un albero binario di ricerca e un **AVL**
  auto-bilanciante (altezza, confronti, rotazioni), un **heap** binario (insert
  vs heapify, scambi del build) e una **tabella hash** (concatenamento, probing
  lineare e quadratico; collisioni, probe peggiore, fattore di carico) — e vedi
  perché la forma decide la velocità.
- **Algoritmi su grafi** — lancia una ricerca su un grafo: **BFS** per i minori
  salti, **DFS** in profondità, **Dijkstra** per il cammino di peso minimo e
  **A\*** guidato da un'euristica che sistema meno nodi — con costo, salti e nodi
  espansi verificati a ogni run.

## Perché un motore scritto a mano

Possedere il motore è tutto il punto: l'albero, l'heap, la tabella hash e i
traversal sono discreti e deterministici, in `*/js/core/`, e verificati nei test
contro valori calcolati a mano. Ogni motore emette un flusso di eventi neutri
rispetto alla lingua (un confronto, una rotazione, un probe, un nodo sistemato) a
cui la UI si iscrive: un tick = una micro-operazione, così puoi guardare al
rallentatore o macinare in turbo.

## Da zero: la guida "Basi"

Non serve alcun prerequisito: alla prima visita si apre una guida introduttiva
che spiega da zero — con analogie e un esempio numerico — cosa sono strutture
dati e algoritmi, cosa sono alberi, heap, hash, grafi, cammini ed euristiche.
Resta sempre raggiungibile dal bottone in alto.

Ogni piano ha livelli guidati con verifica automatica (su carichi di lavoro anche
**nascosti**, così una scelta tarata sul caso visibile fallisce quelli nascosti)
e una sandbox libera.

## Avvio

Sito statico puro, moduli ES, **zero build, zero dipendenze**:

```
npm run serve        # python3 -m http.server 8000
# apri http://localhost:8000
```

Deploy su GitHub Pages da `main`/root così com'è (`.nojekyll`, percorsi relativi).

## Sviluppo / test

```
npm test             # node --test — motori e livelli dei due piani
npm run e2e          # smoke test headless su Chrome (hub + i due piani)
```

## Licenza

MIT © Andrea Manzi (manzolo)
