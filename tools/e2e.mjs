#!/usr/bin/env node
// End-to-end test: drives the real UI in headless Chrome over the DevTools
// Protocol, using only Node built-ins (node:http static server + the global
// WebSocket of Node ≥ 22). Zero npm dependencies. Self-hosting.
//
// Scenario: boot the hub, dismiss the beginner primer (and confirm it stays
// dismissed), see the two floor cards, then enter each floor and solve its first
// level by typing the reference config, asserting the pass banner + localStorage
// progress + the animated view, all with zero console errors.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { spawn, spawnSync } from 'node:child_process';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { mkdtempSync, rmSync } from 'node:fs';
import { SOLUTIONS as DS } from '../tests/dstruct-solutions.js';
import { SOLUTIONS as GR } from '../tests/graph-solutions.js';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DEADLINE_MS = 90000;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.json': 'application/json', '.md': 'text/plain',
};

let passed = 0;
function ok(name) { passed += 1; console.log(`ok — ${name}`); }
function fail(msg) { console.error(`FAIL — ${msg}`); process.exitCode = 1; throw new Error(msg); }

function startServer() {
  const server = createServer(async (req, res) => {
    try {
      let path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname));
      if (path.endsWith('/')) path += 'index.html';
      const file = join(ROOT, path === '/index.html' ? 'index.html' : path.slice(1));
      if (!file.startsWith(ROOT)) throw new Error('traversal');
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
    } catch { res.writeHead(404); res.end('not found'); }
  });
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)));
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN, 'google-chrome-stable', 'google-chrome', 'chromium',
    'chromium-browser', 'chrome', '/snap/bin/chromium', '/usr/bin/chromium',
  ].filter(Boolean);
  for (const bin of candidates) {
    try { if (spawnSync(bin, ['--version'], { stdio: 'pipe' }).status === 0) return bin; } catch { /* next */ }
  }
  console.error('No Chrome/Chromium found. Set CHROME_BIN=/path/to/chrome.');
  process.exit(1);
  return null;
}

function launchChrome(bin, profileDir) {
  const chrome = spawn(bin, [
    '--headless=new', '--remote-debugging-port=0', '--no-first-run',
    '--no-default-browser-check', '--disable-gpu', '--disable-extensions',
    `--user-data-dir=${profileDir}`, 'about:blank',
  ], { stdio: ['ignore', 'pipe', 'pipe'] });
  return new Promise((resolve, reject) => {
    let buf = '';
    const onData = (d) => {
      buf += d.toString();
      const m = buf.match(/DevTools listening on (ws:\/\/[^\s]+)/);
      if (m) { chrome.stderr.off('data', onData); resolve({ chrome, wsBase: m[1] }); }
    };
    chrome.stderr.on('data', onData);
    chrome.on('exit', (code) => reject(new Error(`chrome exited early (${code})\n${buf}`)));
    setTimeout(() => reject(new Error(`no DevTools banner:\n${buf}`)), 15000);
  });
}

class Cdp {
  constructor(ws) {
    this.ws = ws; this.id = 0; this.pending = new Map(); this.consoleErrors = [];
    ws.addEventListener('message', (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id !== undefined) {
        const p = this.pending.get(msg.id);
        if (p) { this.pending.delete(msg.id); msg.error ? p.reject(new Error(msg.error.message)) : p.resolve(msg.result); }
      } else if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
        this.consoleErrors.push(msg.params.args.map((a) => a.value ?? a.description ?? '').join(' '));
      } else if (msg.method === 'Runtime.exceptionThrown') {
        const d = msg.params.exceptionDetails;
        this.consoleErrors.push(`exception: ${d.text} ${d.exception?.description ?? ''}`);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    this.ws.send(JSON.stringify({ id, method, params }));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }

  async eval(expression) {
    const r = await this.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(`eval failed: ${r.exceptionDetails.text}\n${expression}`);
    return r.result.value;
  }

  async waitFor(expression, what, timeout = 15000) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      if (await this.eval(expression)) return;
      await new Promise((r) => setTimeout(r, 100));
    }
    fail(`timeout waiting for ${what}: ${expression}`);
  }
}

function openWs(url) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(url);
    ws.addEventListener('open', () => resolve(ws));
    ws.addEventListener('error', (e) => reject(new Error(`ws error: ${e.message ?? url}`)));
  });
}

async function connect(wsBase) {
  const browser = new Cdp(await openWs(wsBase));
  const { targetInfos } = await browser.send('Target.getTargets');
  const page = targetInfos.find((t) => t.type === 'page');
  if (!page) fail('no page target');
  const cdp = new Cdp(await openWs(wsBase.replace(/\/devtools\/browser\/.*/, `/devtools/page/${page.targetId}`)));
  await cdp.send('Runtime.enable');
  await cdp.send('Page.enable');
  return cdp;
}

async function solveFloor(cdp, base, floor, levelId, solution, viewId) {
  await cdp.send('Page.navigate', { url: `${base}/${floor}/#${levelId}` });
  await cdp.waitFor('!!document.querySelector(".lesson-title")', `${floor} floor booted`);
  await cdp.eval(`(() => { const s = document.getElementById('speed'); s.value = s.max; s.dispatchEvent(new Event('input', { bubbles: true })); })()`);
  await cdp.eval(`(() => {
    const ta = document.querySelector('#editor textarea.code');
    ta.value = ${JSON.stringify(solution)};
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  })()`);
  await cdp.eval(`document.getElementById('btnRun').click()`);
  await cdp.waitFor('!!document.querySelector("#lessonPanel .banner-pass")', `${floor} pass banner`, 20000);
  const progress = await cdp.eval(`JSON.parse(localStorage.getItem("${floor}.progress") ?? "[]")`);
  if (!progress.includes(levelId)) fail(`${floor} progress does not contain ${levelId}`);
  await cdp.waitFor(`!!document.querySelector("#${viewId} svg")`, `${floor} view rendered a diagram`);
  ok(`${floor} floor: solved ${levelId} via UI (banner + progress + animated view)`);
}

async function main() {
  const hardDeadline = setTimeout(() => { console.error('GLOBAL DEADLINE EXCEEDED'); process.exit(1); }, DEADLINE_MS);
  const server = await startServer();
  const base = `http://127.0.0.1:${server.address().port}`;
  const profileDir = mkdtempSync(join(tmpdir(), 'edualgo-e2e-'));
  const bin = findChrome();
  console.log(`# chrome: ${bin}`);
  const { chrome, wsBase } = await launchChrome(bin, profileDir);

  try {
    const cdp = await connect(wsBase);

    // ---- hub ----
    await cdp.send('Page.navigate', { url: `${base}/` });
    await cdp.waitFor('document.querySelectorAll("#floors .floor").length === 2', 'hub shows 2 floor cards');
    ok('hub boots with two floor cards');

    await cdp.eval('localStorage.clear()');
    await cdp.send('Page.navigate', { url: `${base}/` });
    await cdp.waitFor('document.querySelectorAll("#floors .floor").length === 2', 'hub reboot');
    await cdp.waitFor('!document.getElementById("introOverlay").hidden', 'primer auto-opens');
    await cdp.waitFor('document.querySelectorAll("#introBody h3").length >= 4', 'primer content rendered');
    await cdp.eval('document.getElementById("introClose").click()');
    await cdp.waitFor('document.getElementById("introOverlay").hidden', 'primer closed');
    await cdp.send('Page.navigate', { url: `${base}/` });
    await cdp.waitFor('document.querySelectorAll("#floors .floor").length === 2', 'hub reload');
    if (await cdp.eval('!document.getElementById("introOverlay").hidden')) fail('primer reopened despite flag');
    ok('beginner primer: auto-opens once, then stays behind the Basics button');

    // hub language toggle
    await cdp.eval('document.querySelector(".lang-switch [data-lang=\'en\']").click()');
    if (await cdp.eval('document.getElementById("btnIntro").textContent.trim()') !== 'Basics') fail('EN hub label');
    await cdp.eval('document.querySelector(".lang-switch [data-lang=\'it\']").click()');
    if (await cdp.eval('document.getElementById("btnIntro").textContent.trim()') !== 'Basi') fail('IT hub label');
    ok('hub language switch IT ⇄ EN');

    // ---- floors ----
    await solveFloor(cdp, base, 'dstruct', 'balanced-tree', DS['balanced-tree'], 'structView');
    await solveFloor(cdp, base, 'graph', 'shortest-hops', GR['shortest-hops'], 'graphView');

    // ?lang= forces language on a floor
    await cdp.send('Page.navigate', { url: `${base}/dstruct/?lang=en#balanced-tree` });
    await cdp.waitFor('document.getElementById("btnLevels")?.textContent.trim() === "Levels"', '?lang=en on floor');
    ok('?lang=xx forces the language on a floor');

    if (cdp.consoleErrors.length) fail(`console errors:\n${cdp.consoleErrors.join('\n')}`);
    ok('zero console errors / exceptions');

    console.log(`\n# e2e passed (${passed} checks)`);
  } finally {
    clearTimeout(hardDeadline);
    chrome.kill('SIGKILL');
    server.close();
    try { rmSync(profileDir, { recursive: true, force: true }); } catch { /* best effort */ }
  }
}

main().catch((e) => { console.error(e.message); process.exit(1); });
