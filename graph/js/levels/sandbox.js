// Free mode: any algorithm over a fixed sample graph, no verification. A starter
// that shows the guided search on an open grid.

import { gridGraph } from './generators.js';

export const SANDBOX = {
  script: `# Free sandbox — run any algorithm over the sample graph below.
#   algo bfs | dfs | dijkstra | astar
algo astar`,
  setup: gridGraph(6, 5, { target: 'n15' }),
};
