// EDU-ALGO · graph · level 01 — BFS finds the fewest-hops path.

import { hopCases, line, shortcut } from './generators.js';

export const solution = 'algo bfs';

export default {
  id: 'shortest-hops',
  title: { en: 'Fewest steps', it: 'Meno passi' },
  text: {
    en: `<p><b>Breadth-first search</b> explores a graph in rings: all the nodes
one step from the source, then all two steps away, and so on. Because it reaches
every node by the shortest number of <b>hops</b>, the first time it touches the
target it has found a minimum-hop path.</p>
<p><b>Depth-first search</b> instead plunges down one branch to the end before
backtracking — great for exploring, but it can reach the target the long way
round. Pick the traversal that minimises hops.</p>`,
    it: `<p>La <b>ricerca in ampiezza</b> (BFS) esplora il grafo ad anelli: prima
tutti i nodi a un passo dalla sorgente, poi quelli a due passi, e così via. Poiché
raggiunge ogni nodo col minimo numero di <b>salti</b>, la prima volta che tocca il
target ha trovato un cammino a salti minimi.</p>
<p>La <b>ricerca in profondità</b> (DFS) invece si tuffa in un ramo fino in fondo
prima di tornare indietro — ottima per esplorare, ma può raggiungere il target
per la via lunga. Scegli la traversata che minimizza i salti.</p>`,
  },
  goal: {
    en: 'Reach the target in the fewest hops on every graph. Use `algo bfs`.',
    it: 'Raggiungi il target col minor numero di salti su ogni grafo. Usa `algo bfs`.',
  },
  hints: [
    { en: 'One line: `algo bfs`.', it: 'Una riga: `algo bfs`.' },
    { en: 'On a single-track graph DFS ties BFS; give it a shortcut and DFS wanders.', it: 'Su un grafo a binario unico DFS pareggia con BFS; dagli una scorciatoia e DFS si perde.' },
  ],
  allowed: ['algo'],
  start: 'algo dfs',
  makeCases: () => hopCases(solution, [
    { setup: line(4), visible: true },
    { setup: line(5), visible: true },
    { setup: shortcut(4) },
    { setup: shortcut(5) },
    { setup: shortcut(6) },
  ]),
};
