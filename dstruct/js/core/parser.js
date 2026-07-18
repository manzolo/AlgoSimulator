// The structure-config DSL for the data-structures floor. The LEVEL fixes the
// workload (the set of keys to insert); the USER writes this small config that
// says WHICH structure to build and how. Line-oriented, `#` comments, language-
// neutral {code, args} errors — the same spirit as the sibling EDU-* parsers.
//
// Grammar (one directive per line):
//   structure bst | avl | heap | hash    which data structure to build
//   order min | max                       heap: min-heap or max-heap
//   build insert | heapify                heap: how it is constructed
//   probe chain | linear | quadratic      hash: collision-resolution strategy
//   capacity <int>                        hash: number of buckets/slots (>= 1)
//
// The parser is purely syntactic: it records which keys appeared (for the
// allowed[] whitelist, enforced in engine.buildRun) and the config values.
// Semantic checks that need cross-directive knowledge (a structure is required;
// hash needs probe + capacity; order/build only apply to heap) live in
// engine.buildRun, next to the allowed[] gate.

export const STRUCTURES = ['bst', 'avl', 'heap', 'hash'];
export const ORDERS = ['min', 'max'];
export const BUILDS = ['insert', 'heapify'];
export const PROBES = ['chain', 'linear', 'quadratic'];

const ENUMS = { structure: STRUCTURES, order: ORDERS, build: BUILDS, probe: PROBES };
const ENUM_ERR = { structure: 'errBadStructure', order: 'errBadOrder', build: 'errBadBuild', probe: 'errBadProbe' };

export function parse(src) {
  const lines = String(src ?? '').split('\n')
    .map((l) => l.replace(/#.*$/, '').trim())
    .filter((l) => l.length);
  if (!lines.length) return { errors: [{ code: 'errEmpty', args: [] }] };

  const config = {};
  const keys = [];

  for (const line of lines) {
    const toks = line.split(/\s+/);
    const key = toks[0];

    if (key in ENUMS) {
      const v = toks[1];
      if (v === undefined) return { errors: [{ code: 'errNeedValue', args: [key] }] };
      if (!ENUMS[key].includes(v)) return { errors: [{ code: ENUM_ERR[key], args: [v] }] };
      if (toks.length > 2) return { errors: [{ code: 'errUnexpected', args: [toks[2]] }] };
      config[key] = v;
      keys.push(key);
    } else if (key === 'capacity') {
      if (toks[1] === undefined) return { errors: [{ code: 'errCapacityValue', args: [] }] };
      const n = Number(toks[1]);
      if (!Number.isInteger(n)) return { errors: [{ code: 'errCapacityInt', args: [toks[1]] }] };
      if (n < 1) return { errors: [{ code: 'errCapacityRange', args: [] }] };
      if (toks.length > 2) return { errors: [{ code: 'errUnexpected', args: [toks[2]] }] };
      config.capacity = n;
      keys.push('capacity');
    } else {
      return { errors: [{ code: 'errUnknownKey', args: [key] }] };
    }
  }

  // A key given twice is a mistake — the second would silently win.
  const seen = new Set();
  for (const k of keys) {
    if (seen.has(k)) return { errors: [{ code: 'errDupKey', args: [k] }] };
    seen.add(k);
  }

  return { config, keys };
}
