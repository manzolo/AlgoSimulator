// EDU-ALGO · graph floor — orchestrator. Wires the DOM-free graph traversal engine to
// the UI through the Player's event stream. Mirrors the sibling EDU-* main.js
// files: build → run → verify against every level workload (visible AND hidden).
// Verification is synchronous — traversing a small graph is cheap.

import { buildRun } from './core/engine.js';
import { Player } from '../../js/shared/player.js';
import { initLang, setLang, getLang, t, onLangChange, refreshStatic } from './i18n.js';
import * as storage from './storage.js';
import { levels, levelById } from './levels/index.js';
import { SANDBOX } from './levels/sandbox.js';
import { verifyAll } from './levels/verify.js';
import { createEditor } from './ui/editor.js';
import { createGraphView } from './ui/graphView.js';
import { createResultPanel } from './ui/resultPanel.js';
import { createEventLog } from './ui/eventlog.js';
import { createCasesPanel } from './ui/casesPanel.js';
import { createLevelPanel } from './ui/levelPanel.js';
import { createLevelSelect } from './ui/levelSelect.js';

initLang();

const editor = createEditor(document.getElementById('editor'), { onChange: onScriptEdit, onRun: () => btnRun.click() });
const graphView = createGraphView(document.getElementById('graphView'));
const resultPanel = createResultPanel(document.getElementById('resultPanel'));
const eventlog = createEventLog(document.getElementById('eventLog'));
const casesPanel = createCasesPanel(document.getElementById('casesPanel'), { onPick: pickCase });
const levelPanel = createLevelPanel(document.getElementById('lessonPanel'), { onNext: gotoNextLevel });
const levelSelect = createLevelSelect(document.getElementById('levelSelectOverlay'), { onSelect: select });

const statusEl = document.getElementById('statusLine');
const btnRun = document.getElementById('btnRun');
const btnPause = document.getElementById('btnPause');
const btnStep = document.getElementById('btnStep');
const btnReset = document.getElementById('btnReset');
const casesCard = document.getElementById('casesCard');

let currentId = null;
let level = null;
let sim = null;
let built = null;
let machineStale = true;
let visibleCases = [];
let hiddenCount = 0;
let selectedCase = 0;

const player = new Player({
  onEvents: handleEvents,
  onFrame: () => {},
  onHalt: handleHalt,
  onError: handleError,
  onRunState: (running) => {
    btnRun.hidden = running;
    btnPause.hidden = !running;
    btnStep.disabled = running;
    if (running) setStatus(t('statusRunning'), 'run');
  },
});

function setStatus(msg, kind = '') { statusEl.textContent = msg; statusEl.dataset.kind = kind; }
function isSandbox() { return currentId === 'sandbox'; }
function caseSetup() {
  return isSandbox() ? (SANDBOX.setup ?? {}) : (visibleCases[selectedCase]?.setup ?? {});
}

function buildMachine() {
  const source = editor.getValue();
  const b = buildRun({ source, setup: caseSetup(), allowed: level?.allowed ?? null, budget: level?.budget ?? 40000 });

  eventlog.clear();
  resultPanel.clear();
  graphView.clear();

  if (b.errors) {
    const e = b.errors[0];
    editor.setError({ line: 1, msg: t(e.code, ...(e.args ?? [])) });
    setStatus(t('statusParseFailed'), 'err');
    sim = null; built = null;
    return false;
  }
  editor.setError(null);
  built = b;
  sim = b.sim;
  player.load(sim);
  machineStale = false;
  setStatus(t('statusReady'));
  return true;
}

function ensureMachine() {
  if (machineStale || !sim || sim.halted || sim.error) return buildMachine();
  return true;
}

function handleEvents(events) {
  const turbo = player.turbo;
  for (const evt of events) {
    eventlog.append(evt);
    if (turbo) continue;
    graphView.onEvent(evt);
  }
}

function handleHalt() {
  const fs = sim.finalState();
  const result = fs.result;
  if (player.turbo) {
    eventlog.setAll(sim.trace);
    graphView.finalize(result);
  }
  if (result) resultPanel.show(result);
  const kind = result?.outcome === 'budget' ? 'err' : 'ok';
  setStatus(result?.outcome === 'budget' ? t('statusBudget') : t('statusDone', fs.steps), kind);
  if (level) verifySolution();
}

function handleError(err) {
  editor.setError({ line: err.line ?? 1, msg: t(err.code, ...(err.args ?? [])) });
  setStatus(t(err.code, ...(err.args ?? [])), 'err');
}

function verifySolution() {
  const source = editor.getValue();
  const results = verifyAll(level, source);
  const verdicts = new Map();
  let vi = 0;
  let anyVisibleFail = false;
  let anyHiddenFail = false;
  let firstProblem = null;
  for (const r of results) {
    if (r.visible) { verdicts.set(vi, r.pass); vi += 1; }
    if (!r.pass) {
      if (r.visible) anyVisibleFail = true; else anyHiddenFail = true;
      firstProblem = firstProblem ?? (r.errors?.[0] ?? r.error ?? null);
    }
  }
  casesPanel.setVerdicts(verdicts);
  if (!anyVisibleFail && !anyHiddenFail) {
    storage.markCompleted(level.id);
    levelPanel.setResult({ pass: true, msg: t('passMsg') });
    setStatus(t('passMsg'), 'ok');
    return;
  }
  const msg = firstProblem?.code
    ? t(firstProblem.code, ...(firstProblem.args ?? []))
    : (anyVisibleFail ? t('failVisible') : t('failHidden'));
  levelPanel.setResult({ pass: false, msg });
  setStatus(t('failStatus'), 'err');
}

function onScriptEdit(value) {
  player.pause();
  machineStale = true;
  storage.saveScript(currentId, value);
}

function pickCase(i) {
  selectedCase = i;
  player.pause();
  machineStale = true;
  buildMachine();
}

function resetToStarter() {
  player.pause();
  levelPanel.setResult(null);
  const script = level?.start ?? SANDBOX.script;
  editor.setValue(script);
  storage.saveScript(currentId, script);
  selectedCase = 0;
  machineStale = true;
  buildMachine();
}

function select(id) {
  player.pause();
  const lv = id === 'sandbox' ? null : levelById(id);
  if (id !== 'sandbox' && !lv) { select(levels[0].id); return; }
  currentId = id;
  level = lv;
  selectedCase = 0;
  storage.setLastMode(id);
  if (window.location.hash !== `#${id}`) window.location.hash = id;

  casesCard.hidden = !level;

  if (level) {
    const all = level.makeCases();
    visibleCases = all.filter((c) => c.visible);
    hiddenCount = all.length - visibleCases.length;
    const idx = levels.indexOf(level);
    levelPanel.showLevel(level, idx, levels.length, storage.getProgress().has(id));
    editor.setValue(storage.getScript(id) ?? level.start ?? '');
    casesPanel.showCases(visibleCases, hiddenCount);
  } else {
    visibleCases = [];
    hiddenCount = 0;
    levelPanel.showSandbox();
    editor.setValue(storage.getScript('sandbox') ?? SANDBOX.script);
    casesPanel.clear();
  }
  machineStale = true;
  buildMachine();
}

function gotoNextLevel() {
  const idx = levels.indexOf(level);
  if (idx >= 0 && idx < levels.length - 1) select(levels[idx + 1].id);
}

btnRun.addEventListener('click', () => { if (ensureMachine()) player.play(); });
btnPause.addEventListener('click', () => { player.pause(); setStatus(t('statusPaused'), ''); });
btnStep.addEventListener('click', () => { if (ensureMachine()) player.stepOnce(); });
btnReset.addEventListener('click', resetToStarter);
document.getElementById('speed').addEventListener('input', (e) => player.setSpeed(+e.target.value));
player.setSpeed(+document.getElementById('speed').value);

document.addEventListener('keydown', (e) => {
  if (e.target.matches('textarea, input, select')) return;
  if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); if (player.running) btnPause.click(); else btnRun.click(); }
  else if (e.key === 'F8') { e.preventDefault(); btnStep.click(); }
});

document.getElementById('btnLevels').addEventListener('click', () => levelSelect.open(levels, storage.getProgress(), currentId));
document.getElementById('btnSandbox').addEventListener('click', () => select('sandbox'));

const helpOverlay = document.getElementById('helpOverlay');
function renderHelp() {
  document.getElementById('helpTitle').textContent = t('helpTitle');
  document.getElementById('helpBody').innerHTML = t('helpHtml');
}
document.getElementById('btnHelp').addEventListener('click', () => { renderHelp(); helpOverlay.hidden = false; });
document.getElementById('helpClose').addEventListener('click', () => { helpOverlay.hidden = true; });
helpOverlay.addEventListener('click', (e) => { if (e.target === helpOverlay) helpOverlay.hidden = true; });
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') { helpOverlay.hidden = true; document.getElementById('levelSelectOverlay').hidden = true; }
});

const langButtons = document.querySelectorAll('.lang-switch button');
function markLang() { langButtons.forEach((b) => b.classList.toggle('active', b.dataset.lang === getLang())); }
langButtons.forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));

onLangChange(() => {
  markLang();
  levelPanel.refresh();
  casesPanel.refresh();
  resultPanel.refresh();
  graphView.clear();
  if (!helpOverlay.hidden) renderHelp();
  setStatus(t('statusReady'));
});

refreshStatic();
markLang();

const fromHash = window.location.hash.slice(1);
const startId = (fromHash === 'sandbox' || levelById(fromHash)) ? fromHash : storage.getLastMode() || levels[0].id;
select(startId);

window.addEventListener('hashchange', () => {
  const id = window.location.hash.slice(1);
  if (id !== currentId && (id === 'sandbox' || levelById(id))) select(id);
});
