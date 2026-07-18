// Facade: the single entry point shared by the UI (buildRun) and the headless
// verifier / tests (runHeadless). parse → allowed[] whitelist → semantic check
// → executor over the graph → wrap in the standard Sim stepper. Mirrors the
// sibling EDU-* engine.js files.

import { parse } from './parser.js';
import { GraphExecutor } from './executor.js';
import { Sim, runToCompletion } from './sim.js';

export function buildRun({ source, setup = {}, allowed = null, budget = 40000 } = {}) {
  const parsed = parse(source);
  if (parsed.errors) return { errors: parsed.errors };

  if (allowed) {
    for (const key of parsed.keys) {
      if (!allowed.includes(key)) return { errors: [{ code: 'errNotAllowed', args: [key] }] };
    }
  }

  const cfg = parsed.config;
  if (!cfg.algo) return { errors: [{ code: 'errNoAlgo', args: [] }] };

  const executor = new GraphExecutor(cfg, setup);
  if (executor.buildError) return { errors: [executor.buildError] };

  const sim = new Sim(executor, { budget });
  return { sim, executor, config: cfg };
}

// One-shot execution with no animation — used by verify and the tests.
export function runHeadless(opts) {
  const built = buildRun(opts);
  if (built.errors) return { errors: built.errors };
  const { state, error } = runToCompletion(built.sim);
  return { state, error, result: built.executor.result, config: built.config, setup: opts.setup };
}
