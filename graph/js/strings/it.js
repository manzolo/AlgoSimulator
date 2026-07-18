// Stringhe italiane della chrome per il piano dei grafi. Dizionario piatto;
// {0}/{1} sono argomenti posizionali.

export default {
  tagline: 'guarda la frontiera espandersi e il cammino accendersi',

  backHub: '← Hub',
  navLevels: 'Livelli',
  navSandbox: 'Sandbox',
  help: 'Aiuto',
  run: '▶ Esegui',
  pause: '❚❚ Pausa',
  step: 'Passo',
  reset: 'Reset',
  speed: 'velocità',

  panelView: 'GRAFO',
  panelResult: 'RISULTATO',
  panelScript: 'ALGORITMO',
  panelCases: 'GRAFI',
  panelEvents: 'PASSI',

  statusReady: 'Pronto.',
  statusRunning: 'Ricerca…',
  statusPaused: 'In pausa.',
  statusParseFailed: 'La configurazione non è valida.',
  statusDone: 'Finito in {0} passi.',
  statusBudget: 'Budget di passi esaurito — la run è stata troncata.',
  failStatus: 'Non ancora superato.',

  levelBadge: 'LIVELLO {0}',
  completedBadge: 'completato',
  goalLabel: 'OBIETTIVO —',
  allowedLabel: 'config',
  hintBtn: 'Suggerimento {0}/{1}',
  hintsDone: 'Niente più suggerimenti',
  nextLevel: 'Livello successivo →',
  passMsg: 'Superato! Ogni grafo è verde — inclusi quelli nascosti.',
  failVisible: 'Un grafo visibile fallisce — eseguilo e guarda dove va storta la ricerca.',
  failHidden: 'Il grafo visibile passa, ma uno NASCOSTO fallisce: il tuo algoritmo è davvero quello giusto, o solo giusto per ciò che vedi?',

  sandboxTitle: 'SANDBOX',
  sandboxText: 'Modalità libera: esegui qualunque algoritmo sul grafo di esempio e guardalo cercare. Qui niente voti.',
  sandboxCardTitle: 'Sandbox',
  sandboxCardDesc: 'sperimentazione libera',
  selectTitle: 'Scegli un livello',

  caseLabel: 'Grafo',
  casesNote: '+{0} grafi nascosti: stesso controllo, mappe diverse. Un algoritmo tarato sui visibili non gli sopravvive.',

  statCost: 'costo cammino',
  statHops: 'salti',
  statExpanded: 'nodi sistemati',
  detailPath: 'cammino',
  detailNoPath: 'nessun cammino verso il target',

  resultEmpty: 'Esegui l\'algoritmo per vedere il risultato.',
  evtEmpty: 'I passi del motore appariranno qui.',
  evtInput: 'algoritmo: {0}',
  evtField: 'fase: {0}',
  evtBudget: 'budget di passi ({0}) esaurito',

  noteVisit: 'visita {0}',
  noteSettle: 'sistema {0} (dist {1})',
  notePath: 'cammino trovato, costo {0}, {1} salti',
  noteNoPath: 'nessun cammino verso il target',

  helpTitle: 'Riferimento della configurazione',
  helpHtml: `
<p>Il grafo (nodi, archi pesati, una sorgente e un target) è fissato dal livello.
Tu scrivi una riga che sceglie l'algoritmo, e il motore lo esegue.
<b>Ctrl+Invio</b> esegue, <b>F8</b> sistema un nodo.</p>
<pre>algo bfs | dfs | dijkstra | astar</pre>
<p><b>Algoritmi.</b> <code>bfs</code> in ampiezza — meno salti (ignora i pesi) ·
<code>dfs</code> in profondità — si tuffa prima in un ramo · <code>dijkstra</code>
il più economico per peso totale · <code>astar</code> A* — il più economico,
guidato verso il target da un'euristica di distanza così sistema meno nodi.</p>
<p><b>Metriche.</b> I livelli valutano il <i>costo del cammino</i>, il <i>numero
di salti</i> e i <i>nodi sistemati</i>. I pareggi si rompono per id di nodo, così
ogni run è deterministica. I grafi nascosti sono mappe diverse, quindi un
algoritmo tarato sui visibili fallisce.</p>`,

  errEmpty: 'Scrivi una configurazione.',
  errNeedAlgo: 'La riga `algo` richiede un nome.',
  errBadAlgo: 'Algoritmo sconosciuto: "{0}" (bfs, dfs, dijkstra, astar).',
  errUnexpected: 'Inatteso: {0}.',
  errUnknownKey: 'Direttiva sconosciuta: "{0}".',
  errDupKey: '`{0}` è impostato due volte.',
  errNotAllowed: 'La direttiva `{0}` non è ammessa in questo livello.',
  errNoAlgo: 'Nessun algoritmo scelto — aggiungi una riga `algo`.',
  errNoNodes: 'Il grafo non ha nodi.',
  errNoEdges: 'Il grafo non ha lista di archi.',
  errNoSource: 'Il nodo sorgente "{0}" non è nel grafo.',
  errNoTarget: 'Il nodo target "{0}" non è nel grafo.',
  errBadEdge: 'Un arco riferisce un nodo sconosciuto: {0}–{1}.',
  errBadWeight: 'L\'arco {0}–{1} ha un peso non positivo.',
  errInternal: 'Errore interno: {0}.',
};
