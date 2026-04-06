export interface RepoResult {
  name: string;
  remoteUrl: string;
  status: 'success' | 'failure' | 'skipped';
  nxMigrated?: { oldVersion: string; newVersion: string } | null;
  auditFixed: boolean;
  prUrl?: string;
  manualPrUrl?: string;
  error?: string;
}

export interface ReportData {
  date: string;
  results: RepoResult[];
  generatedAt: string;
}
