// The algorithm-choice DSL for the graph floor. The LEVEL fixes the graph (nodes,
// weighted edges, a source and a target); the USER writes this one-line config
// that says WHICH traversal to run. Line-oriented, `#` comments, language-neutral
// {code, args} errors — the same spirit as the sibling EDU-* parsers.
//
// Grammar (one directive per line):
//   algo bfs | dfs | dijkstra | astar     which graph algorithm to run
//
// The parser is purely syntactic; the "an algorithm is required" check lives in
// engine.buildRun next to the allowed[] gate.

export const ALGOS = ['bfs', 'dfs', 'dijkstra', 'astar'];

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

    if (key === 'algo') {
      const a = toks[1];
      if (!a) return { errors: [{ code: 'errNeedAlgo', args: [] }] };
      if (!ALGOS.includes(a)) return { errors: [{ code: 'errBadAlgo', args: [a] }] };
      if (toks.length > 2) return { errors: [{ code: 'errUnexpected', args: [toks[2]] }] };
      config.algo = a;
      keys.push('algo');
    } else {
      return { errors: [{ code: 'errUnknownKey', args: [key] }] };
    }
  }

  const seen = new Set();
  for (const k of keys) {
    if (seen.has(k)) return { errors: [{ code: 'errDupKey', args: [k] }] };
    seen.add(k);
  }

  return { config, keys };
}
