export interface GitHubTrustClaims {
  repository: string;
  workflow_ref: { file: string };
  environment?: string;
}

export interface TrustConfig {
  type: 'github';
  claims: GitHubTrustClaims;
}

export interface DiscoveredPackage {
  name: string;
  path: string;
  isPublishable: boolean;
  signals: PublishabilitySignal[];
}

export type PublishabilitySignal =
  | 'has-publish-config'
  | 'has-compiled-output'
  | 'has-bin'
  | 'points-to-source'
  | 'is-private';

export interface SetupOptions {
  packages?: string[];
  workflow?: string;
  environment?: string;
  registry?: string;
}
