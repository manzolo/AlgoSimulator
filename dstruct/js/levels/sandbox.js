// Free mode: any structure over a fixed sample workload, no verification. A
// starter that shows a self-balancing tree at work.

export const SANDBOX = {
  script: `# Free sandbox — build any structure over the sample keys below.
#   structure bst | avl | heap | hash
#   order min | max            # heap
#   build insert | heapify     # heap
#   probe chain | linear | quadratic   # hash
#   capacity <n>               # hash
structure avl`,
  setup: {
    keys: [50, 30, 70, 20, 40, 60, 80, 10, 25, 35],
  },
};
