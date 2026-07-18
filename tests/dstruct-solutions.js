// The reference solutions for the data-structures floor, one per level, keyed by
// level id. Each level file exports its own `solution`; this module is the single
// map used by the levels test.

import { solution as balancedTree } from '../dstruct/js/levels/level01.js';
import { solution as searchCost } from '../dstruct/js/levels/level02.js';
import { solution as heapify } from '../dstruct/js/levels/level03.js';
import { solution as maxHeap } from '../dstruct/js/levels/level04.js';
import { solution as hashingChains } from '../dstruct/js/levels/level05.js';
import { solution as collisions } from '../dstruct/js/levels/level06.js';
import { solution as openAddressing } from '../dstruct/js/levels/level07.js';
import { solution as loadFactor } from '../dstruct/js/levels/level08.js';
import { solution as deepTree } from '../dstruct/js/levels/level09.js';
import { solution as bigHeap } from '../dstruct/js/levels/level10.js';
import { solution as bigHash } from '../dstruct/js/levels/level11.js';
import { solution as capstone } from '../dstruct/js/levels/level12.js';

export const SOLUTIONS = {
  'balanced-tree': balancedTree,
  'search-cost': searchCost,
  heapify,
  'max-heap': maxHeap,
  'hashing-chains': hashingChains,
  collisions,
  'open-addressing': openAddressing,
  'load-factor': loadFactor,
  'deep-tree': deepTree,
  'big-heap': bigHeap,
  'big-hash': bigHash,
  capstone,
};
