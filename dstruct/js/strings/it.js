// Stringhe italiane della chrome per il piano delle strutture dati. Dizionario
// piatto; {0}/{1} sono argomenti posizionali.

export default {
  tagline: 'guarda una struttura prendere forma, chiave dopo chiave',

  backHub: '← Hub',
  navLevels: 'Livelli',
  navSandbox: 'Sandbox',
  help: 'Aiuto',
  run: '▶ Costruisci',
  pause: '❚❚ Pausa',
  step: 'Passo',
  reset: 'Reset',
  speed: 'velocità',

  panelView: 'STRUTTURA',
  panelResult: 'METRICHE',
  panelScript: 'CONFIG',
  panelCases: 'CARICHI',
  panelEvents: 'PASSI',

  statusReady: 'Pronto.',
  statusRunning: 'Costruzione…',
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
  passMsg: 'Superato! Ogni carico è verde — inclusi quelli nascosti.',
  failVisible: 'Un carico visibile fallisce — costruiscilo e guarda dove va storta la struttura.',
  failHidden: 'Il carico visibile passa, ma uno NASCOSTO fallisce: la tua scelta è davvero quella giusta, o solo tarata su ciò che vedi?',

  sandboxTitle: 'SANDBOX',
  sandboxText: 'Modalità libera: costruisci qualunque struttura sulle chiavi di esempio e guardala crescere. Qui niente voti.',
  sandboxCardTitle: 'Sandbox',
  sandboxCardDesc: 'sperimentazione libera',
  selectTitle: 'Scegli un livello',

  caseLabel: 'Carico',
  casesNote: '+{0} carichi nascosti: stesso controllo, chiavi diverse. Una scelta tarata sui visibili non gli sopravvive.',

  statHeight: 'altezza',
  statNodes: 'nodi',
  statComparisons: 'confronti',
  statRotations: 'rotazioni',
  statSwaps: 'scambi build',
  statOrder: 'ordine',
  statBuild: 'build',
  statMaxProbe: 'probe peggiore',
  statCollisions: 'collisioni',
  statLoad: 'fattore di carico',
  statCapacity: 'capacità',
  detailInorder: 'in-order',
  detailPop: 'ordine di pop',

  resultEmpty: 'Costruisci la struttura per vederne le metriche.',
  evtEmpty: 'I passi del motore appariranno qui.',
  evtInput: 'build: {0}',
  evtField: 'fase: {0}',
  evtBudget: 'budget di passi ({0}) esaurito',

  noteCompare: 'confronta {0} con {1}',
  notePlace: 'inserisci {0}',
  notePlaceRot: 'inserisci {0}, poi ruota',
  notePush: 'push {0}',
  noteHeapify: 'heapify di {0} chiavi',
  notePop: 'pop {0}',
  noteHash: 'hash {0} → slot {1}',

  helpTitle: 'Riferimento della configurazione',
  helpHtml: `
<p>Il carico (le chiavi) è fissato dal livello. Tu scrivi una piccola
<b>configurazione della struttura</b>, una direttiva per riga, e il motore la
costruisce. <b>Ctrl+Invio</b> costruisce, <b>F8</b> avanza di un passo.</p>
<pre>structure bst | avl | heap | hash
order  min | max          # solo heap
build  insert | heapify   # solo heap
probe  chain | linear | quadratic   # solo hash
capacity &lt;n&gt;             # solo hash (secchi/slot, ≥ 1)</pre>
<p><b>Strutture.</b> <code>bst</code> un albero binario di ricerca ·
<code>avl</code> un albero di ricerca auto-bilanciante (le rotazioni lo tengono
basso) · <code>heap</code> un heap binario (min o max) · <code>hash</code> una
tabella hash.</p>
<p><b>Metriche.</b> Gli alberi si valutano su <i>altezza</i> e <i>confronti</i>;
gli heap sugli <i>scambi del build</i>; le tabelle hash sul <i>probe peggiore</i>
e sulle <i>collisioni</i>. I carichi nascosti usano chiavi diverse, così una
risposta tarata sui visibili fallisce.</p>`,

  errEmpty: 'Scrivi una configurazione.',
  errNeedValue: '`{0}` richiede un valore.',
  errBadStructure: 'Struttura sconosciuta: "{0}" (bst, avl, heap, hash).',
  errBadOrder: 'Ordine sconosciuto: "{0}" (min, max).',
  errBadBuild: 'Build sconosciuto: "{0}" (insert, heapify).',
  errBadProbe: 'Probe sconosciuto: "{0}" (chain, linear, quadratic).',
  errUnexpected: 'Inatteso: {0}.',
  errCapacityValue: '`capacity` richiede un valore.',
  errCapacityInt: 'capacity dev\'essere un intero, non "{0}".',
  errCapacityRange: 'capacity dev\'essere almeno 1.',
  errUnknownKey: 'Direttiva sconosciuta: "{0}".',
  errDupKey: '`{0}` è impostato due volte.',
  errNotAllowed: 'La direttiva `{0}` non è ammessa in questo livello.',
  errNoStructure: 'Nessuna struttura scelta — aggiungi una riga `structure`.',
  errHeapOnly: '`order` e `build` valgono solo per un heap.',
  errHashOnly: '`probe` e `capacity` valgono solo per una tabella hash.',
  errNeedProbe: 'Una tabella hash richiede una strategia `probe`.',
  errNeedCapacity: 'Una tabella hash richiede una `capacity`.',
  errNoKeys: 'Il carico non ha chiavi.',
  errBadKey: 'Chiave non valida nel carico: {0}.',
  errCapacityTooSmall: 'La capacità {1} è troppo piccola per {0} chiavi con indirizzamento aperto.',
  errProbeFail: 'Il probing non ha potuto inserire la chiave {0} — la tabella è troppo piena.',
  errInternal: 'Errore interno: {0}.',
};
