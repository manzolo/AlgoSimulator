// The metrics panel for the data-structures floor: the headline numbers a level
// grades on, read straight from the executor's canonical `result` so it always
// agrees with the animated view. Which numbers show depends on the structure.
// Styled inline; needs nothing beyond the shared stylesheet.

import { t } from '../i18n.js';

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const n2 = (x) => (Math.round(x * 100) / 100).toString();

export function createResultPanel(container) {
  let result = null;

  function chip(label, value) {
    return `<div style="flex:1;min-width:5rem;background:var(--panel-2,#2a313b);border:1px solid var(--panel-edge);border-radius:8px;padding:0.4rem 0.55rem">
      <div style="font-size:0.58rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--ink-soft)">${label}</div>
      <div style="font-family:var(--mono);font-size:1.15rem;font-weight:700;color:var(--phosphor)">${esc(value)}</div>
    </div>`;
  }

  function chipsFor(r) {
    if (r.mode === 'tree') {
      return [chip(t('statHeight'), r.height), chip(t('statNodes'), r.nodes),
        chip(t('statComparisons'), r.comparisons), chip(t('statRotations'), r.rotations)];
    }
    if (r.mode === 'heap') {
      return [chip(t('statSwaps'), r.swaps), chip(t('statOrder'), r.order), chip(t('statBuild'), r.build)];
    }
    return [chip(t('statMaxProbe'), r.maxProbe), chip(t('statCollisions'), r.collisions),
      chip(t('statLoad'), n2(r.loadFactor)), chip(t('statCapacity'), r.capacity)];
  }

  function detailFor(r) {
    if (r.mode === 'tree') {
      return `<div style="font-family:var(--mono);font-size:0.78rem;color:var(--phosphor-soft);word-break:break-all">${t('detailInorder')}: ${esc(r.inorder.join(' '))}</div>`;
    }
    if (r.mode === 'heap') {
      return `<div style="font-family:var(--mono);font-size:0.78rem;color:var(--phosphor-soft);word-break:break-all">${t('detailPop')}: ${esc(r.popOrder.join(' '))}</div>`;
    }
    return '';
  }

  function render() {
    if (!result) { container.innerHTML = `<div class="tbl-empty">${t('resultEmpty')}</div>`; return; }
    container.innerHTML = `
      <div style="padding:0.6rem 0.6rem 0.2rem;display:flex;gap:0.4rem;flex-wrap:wrap">${chipsFor(result).join('')}</div>
      <div style="padding:0.2rem 0.6rem 0.6rem">${detailFor(result)}</div>`;
  }

  render();
  return {
    show(r) { result = r; render(); },
    clear() { result = null; render(); },
    refresh: render,
  };
}
