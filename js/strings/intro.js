// The beginner's primer for the hub — "what data structures and algorithms are",
// from zero. Shown on the first visit, then behind the Basics button. One
// {it, en} object, resolved with the shared tr().

export const INTRO = {
  it: `
<p>Benvenuto! Questo palazzo si visita <b>da zero</b>: non serve sapere nulla di
programmazione. Cinque minuti di lettura e capirai di cosa parlano i due piani.
Puoi riaprire questa guida dal bottone <b>Basi</b> in alto.</p>

<h3>Di che si tratta?</h3>
<p>Un computer passa la vita a fare due cose con i dati: <b>tenerli in ordine</b> e
<b>ritrovarli in fretta</b>. Il modo in cui li organizzi — la <b>struttura dati</b>
— decide quanto sono veloci le operazioni. E il modo in cui li percorri — l'<b>
algoritmo</b> — decide quanto lavoro serve per rispondere a una domanda. Questo
laboratorio ti fa vedere entrambi mentre lavorano, un passo alla volta.</p>

<h3>I due piani</h3>
<p><b>Piano 1 · Strutture dati.</b> Inserisci una manciata di numeri e guarda dove
finiscono. In un <b>albero di ricerca</b> ogni chiave va a sinistra o a destra,
così cercarla costa pochi confronti — ma se le chiavi arrivano già ordinate
l'albero diventa una lunga catena, a meno che non si <b>ribilanci</b> (AVL). In un
<b>heap</b> il più piccolo (o il più grande) sta sempre in cima. In una <b>tabella
hash</b> una formula manda ogni chiave in un secchio: se due finiscono nello stesso
secchio <b>collidono</b>, e la struttura deve gestirlo. Lo stesso carico, strutture
diverse: cambia tutto.</p>
<p><b>Piano 2 · Algoritmi su grafi.</b> Un <b>grafo</b> è fatto di <b>nodi</b>
collegati da <b>archi</b> (magari con un <b>peso</b>: distanza, tempo, pedaggio).
La domanda tipica è: qual è la strada dalla sorgente al target? La <b>ricerca in
ampiezza</b> (BFS) trova quella coi minori passi; <b>Dijkstra</b> quella col peso
minore; <b>A*</b> fa come Dijkstra ma punta dritto alla meta, sistemando meno nodi.
Guarda la frontiera espandersi e il cammino accendersi.</p>

<h3>Un esempio concreto</h3>
<p>Inserisci le chiavi <code>1, 2, 3, 4, 5</code> in quest'ordine. In un albero
<code>bst</code> ognuna è più grande della precedente, quindi va sempre a destra:
ottieni una catena alta 5, e cercare il 5 costa 5 confronti. In un albero
<code>avl</code> le rotazioni tengono l'altezza a 3: cercare qualsiasi cosa costa
al più 3 confronti. Stesse chiavi, metà del lavoro — è tutto il punto.</p>

<h3>Piccolo glossario</h3>
<table>
<tr><th>parola</th><th>in una frase</th></tr>
<tr><td><b>struttura dati</b></td><td>il modo in cui organizzi i dati per ritrovarli in fretta</td></tr>
<tr><td><b>albero di ricerca</b></td><td>chiavi piccole a sinistra, grandi a destra — piano 1</td></tr>
<tr><td><b>bilanciamento</b></td><td>rotazioni che tengono l'albero basso (AVL) invece di una catena</td></tr>
<tr><td><b>heap</b></td><td>un array dove il minimo (o il massimo) è sempre in cima</td></tr>
<tr><td><b>tabella hash</b></td><td>una formula manda ogni chiave in un secchio, per lookup O(1)</td></tr>
<tr><td><b>collisione</b></td><td>due chiavi nello stesso secchio: vanno gestite</td></tr>
<tr><td><b>grafo</b></td><td>nodi collegati da archi, magari pesati — piano 2</td></tr>
<tr><td><b>cammino</b></td><td>una sequenza di archi dalla sorgente al target</td></tr>
<tr><td><b>euristica</b></td><td>una stima economica di quanto manca alla meta (A*)</td></tr>
</table>

<h3>Come si usa</h3>
<p>Scegli un piano e entra: ognuno è un laboratorio a sé, con lezioni, livelli
guidati con verifica automatica (e casi nascosti, così non puoi cablare la
risposta) e una sandbox libera. <b>Nessun prerequisito.</b> Buona visita!</p>`,

  en: `
<p>Welcome! This building is meant to be toured <b>from zero</b>: you need to know
nothing about programming. Five minutes of reading and you will understand what the
two floors are about. You can reopen this guide from the <b>Basics</b> button in the
header.</p>

<h3>What is this about?</h3>
<p>A computer spends its life doing two things with data: <b>keeping it in order</b>
and <b>finding it fast</b>. How you organise it — the <b>data structure</b> — decides
how fast the operations are. How you walk over it — the <b>algorithm</b> — decides how
much work answering a question takes. This lab shows you both at work, one step at a
time.</p>

<h3>The two floors</h3>
<p><b>Floor 1 · Data structures.</b> Insert a handful of numbers and watch where they
land. In a <b>search tree</b> every key goes left or right, so finding it costs only a
few comparisons — but if the keys arrive already sorted the tree becomes a long chain,
unless it <b>rebalances</b> (AVL). In a <b>heap</b> the smallest (or largest) is always
on top. In a <b>hash table</b> a formula sends each key to a bucket: when two land in the
same bucket they <b>collide</b>, and the structure has to cope. Same workload, different
structures: it changes everything.</p>
<p><b>Floor 2 · Graph algorithms.</b> A <b>graph</b> is <b>nodes</b> joined by <b>edges</b>
(maybe with a <b>weight</b>: distance, time, toll). The classic question is: what is the
route from source to target? <b>Breadth-first search</b> (BFS) finds the one with fewest
steps; <b>Dijkstra</b> the one with least weight; <b>A*</b> does like Dijkstra but aims
straight at the goal, settling fewer nodes. Watch the frontier spread and the path light
up.</p>

<h3>A concrete example</h3>
<p>Insert the keys <code>1, 2, 3, 4, 5</code> in that order. In a <code>bst</code> each is
bigger than the last, so it always goes right: you get a chain 5 tall, and finding 5 costs
5 comparisons. In an <code>avl</code> tree the rotations keep the height at 3: finding
anything costs at most 3 comparisons. Same keys, half the work — that's the whole point.</p>

<h3>A small glossary</h3>
<table>
<tr><th>word</th><th>in one sentence</th></tr>
<tr><td><b>data structure</b></td><td>how you organise data so you can find it fast</td></tr>
<tr><td><b>search tree</b></td><td>small keys left, large keys right — floor 1</td></tr>
<tr><td><b>balancing</b></td><td>rotations that keep the tree short (AVL) instead of a chain</td></tr>
<tr><td><b>heap</b></td><td>an array where the min (or max) is always on top</td></tr>
<tr><td><b>hash table</b></td><td>a formula sends each key to a bucket, for O(1) lookups</td></tr>
<tr><td><b>collision</b></td><td>two keys in the same bucket: they must be handled</td></tr>
<tr><td><b>graph</b></td><td>nodes joined by edges, maybe weighted — floor 2</td></tr>
<tr><td><b>path</b></td><td>a sequence of edges from source to target</td></tr>
<tr><td><b>heuristic</b></td><td>a cheap guess of how far the goal still is (A*)</td></tr>
</table>

<h3>How to use it</h3>
<p>Pick a floor and enter: each is its own lab, with lessons, guided levels with automatic
checking (and hidden cases, so you can't hardcode your way through) and a free sandbox.
<b>No prerequisites.</b> Enjoy the tour!</p>`,
};
