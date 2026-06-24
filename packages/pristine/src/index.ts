export { run, type RunFlags } from './cli.js';
export {
  flagsForPlan,
  hasActionFlags,
  planFromFlags,
  selectTargets,
  type CliFlags,
  type Enumeration,
  type Plan,
} from './plan.js';
export { renderTree } from './tree.js';
export { categorizeIgnored, type CategorizedIgnored } from './categorize.js';
export {
  enumerateIgnored,
  enumerateUntracked,
  hasTrackedChanges,
  isInsideWorkTree,
  reset,
  type ResetMode,
} from './git.js';
export {
  countFiles,
  removeAll,
  DEFAULT_CONCURRENCY,
  type RemoveOptions,
  type RemoveResult,
  type RemoveFailure,
} from './remove.js';
export { promptForPlan, type PromptContext } from './prompts.js';
