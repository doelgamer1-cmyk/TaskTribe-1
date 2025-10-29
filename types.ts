// Fix: Populating the empty types.ts file with all necessary type definitions for the application.
export type QuestType = 'Skill' | 'Creative' | 'Community' | 'Professional';
export type QuestStatus = 'OPEN' | 'IN_PROGRESS' | 'PENDING_VERIFICATION' | 'COMPLETED' | 'CANCELLED';

export interface Bid {
  userId: string;
  username: string;
  amount: number;
  proposal: string;
  timestamp: Date;
  avatarUrl: string;
}

export interface Quest {
  id: string;
  title: string;
  description:string;
  company: string;
  logo: string;
  type: QuestType;
  deadline: Date;
  level: number;
  reward?: number;
  budget?: number;
  creatorId: string;
  status: QuestStatus;
  bids: Bid[];
  winner?: {
    userId: string;
    bidAmount: number;
  };
  submission?: {
    userId: string;
    content: string;
  };
}

export interface User {
  username: string;
  isAdult: boolean;
  level: number;
  xp: number;
  isTribeMember: boolean;
  tasksCompleted: number;
  rating?: number;
  fullName?: string;
  headline?: string;
  bio?: string;
  skills?: string[];
}

export type TribeStatus = 'Recruiting' | 'Invite Only' | 'Full';

export interface Tribe {
  id: string;
  name: string;
  tagline: string;
  level: number;
  levelName: string;
  members: number;
  maxMembers: number;
  rank: number;
  winRate: number;
  tags: string[];
  status: TribeStatus;
  bannerUrl: string;
  iconUrl: string;
}

export type UserRole = 'Leader' | 'Co-Leader' | 'Member';

export interface TribeMember {
  id: number;
  name: string;
  level: number;
  role: UserRole;
  avatarUrl: string;
  xp: number;
  questsCompleted: number;
  bio: string;
  skills: string[];
}


export interface ChatMessage {
  role: 'user' | 'model' | 'system';
  content: string;
  grounding?: GroundingChunk[];
}

// FIX: Made uri and title optional to match the type from @google/genai library.
export interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
  };
  web?: {
    uri?: string;
    title?: string;
  };
}

export interface QuestValidationResult {
    isJobPosting: boolean;
    jobPostingReason: string;
    isBudgetRealistic: boolean;
    suggestedMaxBudget: number;
    suggestion: string;
    improvedDescription: string;
}

export interface ModerationResult {
    isFlagged: boolean;
    reason?: string;
}

export interface ChatMessageContext {
    text: string;
}

export interface QuestVideoVerificationResult {
  isVerified: boolean;
  reason: string;
}

export interface PhotoVerificationTask {
    code: string;
    instruction: string;
}

export interface PhotoVerificationResult {
    isVerified: boolean;
    reason: string;
}