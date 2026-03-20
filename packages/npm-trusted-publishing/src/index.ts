export {
  discoverPackages,
  discoverWithNx,
  discoverWithWorkspaces,
  analyzePublishability,
} from './discovery.js';
export type {
  DiscoveredPackage,
  PublishabilitySignal,
  SetupOptions,
  TrustConfig,
  GitHubTrustClaims,
} from './types.js';
export {
  checkNpmVersion,
  checkNpmLogin,
  promptOtp,
  packageExists,
  publishShellPackage,
  npmTrustSetup,
  npmTrustList,
  npmTrustRevoke,
} from './registry.js';
export { default as cli } from './cli.js';

import npmTrustedPublishingCLI from './cli.js';
export const sdk = npmTrustedPublishingCLI.sdk();
