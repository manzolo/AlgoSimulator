# EDU-ALGO · Algorithms Playground

[🇮🇹 Italiano](README.md) · 🇬🇧 English

**▶ Try it online: <https://manzolo.github.io/AlgoSimulator/?lang=en>**

An interactive teaching hub in **two floors** for understanding **how a computer
organises and searches data** — data structures and graph algorithms — showing
every step as it happens. Hand-written engines, zero dependencies: the level
fixes the workload, you choose the **structure** or the **algorithm**, and you
watch the tree grow and rebalance, the heap sift itself, the hash table probe its
slots, the search frontier spread and the path light up.

It is a sibling in the EDU-* series, alongside
[EDU-16 ASM Playground](https://github.com/manzolo/AssemblerSimulator),
[EDU-NUM](https://github.com/manzolo/NumberSimulator),
[EDU-NET](https://github.com/manzolo/NetworkSimulator),
[EDU-REGEX](https://github.com/manzolo/RegexSimulator),
[EDU-SQL](https://github.com/manzolo/SqlSimulator),
[EDU-GIT](https://github.com/manzolo/GitSimulator),
[EDU-CRYPTO](https://github.com/manzolo/CryptoSimulator),
[EDU-NN](https://github.com/manzolo/NeuralSimulator) and
[EDU-OS](https://github.com/manzolo/OsSimulator).

## The two floors

- **Data structures** — build a binary search tree and a self-balancing **AVL**
  (height, comparisons, rotations), a binary **heap** (insert vs heapify, build
  swaps) and a **hash table** (chaining, linear and quadratic probing;
  collisions, worst probe, load factor) — and see why the shape decides the
  speed.
- **Graph algorithms** — send a search across a graph: **BFS** for fewest hops,
  **DFS** depth-first, **Dijkstra** for the least-weight path, and **A\*** guided
  by a heuristic that settles fewer nodes — with cost, hops and nodes expanded
  checked on every run.

## Why a hand-written engine

Owning the engine is the whole point: the tree, the heap, the hash table and the
traversals are discrete and deterministic, in `*/js/core/`, and verified in the
tests against hand-computed values. Each engine emits a stream of
language-neutral events (a comparison, a rotation, a probe, a settled node) the
UI subscribes to: one tick = one micro-operation, so you can watch in slow motion
or grind through in turbo.

## From zero: the "Basics" guide

No prerequisites: on the first visit a primer opens that explains from scratch —
with analogies and a worked number — what data structures and algorithms are,
and what trees, heaps, hashes, graphs, paths and heuristics mean. It stays behind
the header button.

Each floor has guided levels with automatic checking (on **hidden** workloads
too, so a choice tuned to the visible case fails the hidden ones) and a free
sandbox.

## Getting started

Pure static site, ES modules, **zero build, zero dependencies**:

```
npm run serve        # python3 -m http.server 8000
# open http://localhost:8000
```

Deploys to GitHub Pages from `main`/root as-is (`.nojekyll`, relative paths).

## Development / tests

```
npm test             # node --test — engines and levels of both floors
npm run e2e          # headless Chrome smoke test (hub + both floors)
```

## License

MIT © Andrea Manzi (manzolo)
