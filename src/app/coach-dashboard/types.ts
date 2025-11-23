
export enum ClientType {
  CAREER = 'CAREER',
  STARTUP = 'STARTUP',
  MENTORING = 'MENTORING',
  // HWI Specific Types
  ESTATE = 'ESTATE',
  PERSONAL_ASSISTANT = 'PERSONAL_ASSISTANT',
  FAMILY_OFFICE = 'FAMILY_OFFICE',
  // Partner Specific
  PARTNERSHIP = 'PARTNERSHIP',
}

export type AlertType = 'critical' | 'review' | 'success' | 'warning' | 'info';

export interface BoardAlert {
  id: string;
  type: AlertType;
  title: string;
  metric: string; // e.g., "3 Cards", "$50k"
  message?: string;
}

export interface Task {
  id: string;
  title: string;
  dueTime: string;
  category: 'Personal' | 'Client Work';
  completed: boolean;
  // Context for client tasks
  clientId?: string;
  clientName?: string;
  boardName?: string;
  clientAvatar?: string;
}

export interface Win {
  id: string;
  clientName: string;
  clientAvatar: string;
  description: string;
  date: string;
  type: ClientType;
}

export interface Activity {
  id: string;
  clientName: string;
  action: string;
  status: 'positive' | 'neutral' | 'critical';
  timeAgo: string;
  clientAvatar: string;
}

export interface Board {
  id: string;
  clientName: string;
  headline: string;
  subhead: string;
  type: ClientType;
  tags: string[]; // e.g., "Biz Dev", "Career Planning"
  thumbnailUrl: string;
  logoUrl: string;
  isOrganization: boolean; // True for Startups, False for Individuals
  lastActive: string;
  alerts?: BoardAlert[]; // Queue of alerts
}

export interface BoardTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  lanes: string[];
  thumbnailUrl: string;
  recommendedFor: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
}

export interface NewBoardPayload {
  clientName: string;
  isOrganization: boolean;
  headline: string;
  subhead: string;
  templateId: string;
  inviteEmail?: string;
  invitePhone?: string;
}