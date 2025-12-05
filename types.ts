
export type ThemeMode = 'light' | 'dark';

export type AssetCategory = 'icons' | 'flyers' | 'infographics' | 'web-screenshots' | 'other' | string;

export interface Asset {
  id: string;
  name: string;
  category: string;
  url: string;
  uploadedBy: string;
  date: string;
  size?: string;
  tags?: string[];
}

export interface BrandItem {
  id: string;
  type: 'text' | 'hashtag' | 'keyword';
  content: string;
  tags?: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  password?: string; // For mock auth
  isAdmin?: boolean; // Admin-root flag
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  time: string;
}

export interface ProjectStage {
  id: string;
  title: string;
  isCompleted: boolean;
  completedBy?: string; // Name of user who completed it
  completedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  stages: ProjectStage[];
  notes?: string[];
  isArchived?: boolean;
}

export interface ChatContext {
  id: string;
  type: 'asset' | 'project' | 'brand';
  title: string;
  thumbnail?: string; // For images
  detail?: string; // For subtitle or secondary info
}

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: string;
  context?: ChatContext;
}

export interface UserState {
  isAuthenticated: boolean;
  currentUser: TeamMember | null;
}

export interface CheckItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface NoteCheck {
  id: string;
  type: 'note' | 'checklist';
  title: string;
  content?: string; // Para notas
  items?: CheckItem[]; // Para checklists
  userId: string;
  userName: string;
  userAvatar: string;
  createdAt: string;
  isPublished: boolean;
}

export type AgendaType = 'llamar' | 'hacer' | 'equipo' | 'proponer' | 'reunion' | 'otro';

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  type: AgendaType;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  userId: string;
  userName: string;
  userAvatar: string;
  createdAt: string;
}
