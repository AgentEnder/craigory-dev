export interface PrDigestOptions {
  owner: string;
  repo: string;
  prNumber: number;
  token?: string;
}

export interface PrDigestInput {
  owner: string;
  repo: string;
  prNumber: number;
  url?: string;
  token?: string;
}

export interface PrInfo {
  title: string;
  number: number;
  baseBranch: string;
  headBranch: string;
  description?: string;
  url: string;
}

export interface ReviewComment {
  id: string;
  body: string;
  author: string;
  createdAt: string;
  path?: string;
  line?: number | null;
  startLine?: number | null;
  endLine?: number | null;
  diff?: string | null;
}

export interface ReviewReply {
  id: string;
  body: string;
  author: string;
  createdAt: string;
}

export type TimelineEvent =
  | {
      type: 'push';
      sha: string;
      message: string;
      url: string;
      createdAt: string;
      author?: { login: string };
    }
  | {
      type: 'comment';
      id: string;
      body: string;
      author: string;
      createdAt: string;
    }
  | {
      type: 'review';
      id: string;
      author: string;
      createdAt: string;
      state: 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED';
      body?: string;
      comments: ReviewComment[];
      replies: ReviewReply[];
    };
