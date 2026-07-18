// The reference solutions for the graph floor, one per level, keyed by level id.
// Each level file exports its own `solution`; this module is the single map used
// by the levels test.

import { solution as shortestHops } from '../graph/js/levels/level01.js';
import { solution as mazeHops } from '../graph/js/levels/level02.js';
import { solution as dfsOrder } from '../graph/js/levels/level03.js';
import { solution as weightedRoads } from '../graph/js/levels/level04.js';
import { solution as cheapestDetour } from '../graph/js/levels/level05.js';
import { solution as hopsVsCost } from '../graph/js/levels/level06.js';
import { solution as guidedSearch } from '../graph/js/levels/level07.js';
import { solution as astarGrid } from '../graph/js/levels/level08.js';
import { solution as bigMaze } from '../graph/js/levels/level09.js';
import { solution as bigRoads } from '../graph/js/levels/level10.js';
import { solution as bigAstar } from '../graph/js/levels/level11.js';
import { solution as capstone } from '../graph/js/levels/level12.js';

export const SOLUTIONS = {
  'shortest-hops': shortestHops,
  'maze-hops': mazeHops,
  'dfs-order': dfsOrder,
  'weighted-roads': weightedRoads,
  'cheapest-detour': cheapestDetour,
  'hops-vs-cost': hopsVsCost,
  'guided-search': guidedSearch,
  'astar-grid': astarGrid,
  'big-maze': bigMaze,
  'big-roads': bigRoads,
  'big-astar': bigAstar,
  capstone,
};
