// The metrics panel for the graph floor: the numbers a level grades on — path
// cost, hop count, nodes settled — read straight from the executor's canonical
// `result`, plus the reconstructed path. Styled inline; needs nothing beyond the
// shared stylesheet.

import { t } from '../i18n.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function createResultPanel(container) {
  let result = null;

  function chip(label, value) {
    return `<div style="flex:1;min-width:5rem;background:var(--panel-2,#2a313b);border:1px solid var(--panel-edge);border-radius:8px;padding:0.4rem 0.55rem">
      <div style="font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-soft)">${label}</div>
      <div style="font-family:var(--mono);font-size:1.15rem;font-weight:700;color:var(--phosphor)">${esc(value)}</div>
    </div>`;
  }

  function render() {
    if (!result) { container.innerHTML = `<div class="tbl-empty">${t('resultEmpty')}</div>`; return; }
    const reached = result.path.length > 0;
    const chips = [
      chip(t('statCost'), reached ? result.pathCost : '—'),
      chip(t('statHops'), reached ? result.hops : '—'),
      chip(t('statExpanded'), result.expanded),
    ].join('');
    const pathLine = reached
      ? `<div style="font-family:var(--mono);font-size:0.78rem;color:var(--phosphor-soft);word-break:break-all">${t('detailPath')}: ${esc(result.path.map((p) => p.replace(/^n0?/, '') || p).join(' → '))}</div>`
      : `<div style="font-family:var(--mono);font-size:0.78rem;color:var(--fail)">${t('detailNoPath')}</div>`;
    container.innerHTML = `
      <div style="padding:0.6rem 0.6rem 0.2rem;display:flex;gap:0.4rem;flex-wrap:wrap">${chips}</div>
      <div style="padding:0.2rem 0.6rem 0.6rem">${pathLine}</div>`;
  }

  render();
  return {
    show(r) { result = r; render(); },
    clear() { result = null; render(); },
    refresh: render,
  };
}
