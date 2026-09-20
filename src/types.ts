export type Grade = 10 | 11 | 12;

export type SubjectType = 'algebra' | 'geometry'; // algebra: Đại số & Giải tích; geometry: Hình học

export interface Topic {
  id: string;
  grade: Grade;
  subject: SubjectType;
  name: string;
  shortDescription: string;
  iconName: string;
  color: string;
}

export interface Formula {
  id: string;
  topicId: string;
  grade: Grade;
  subject: SubjectType;
  title: string;
  latex: string;
  explanation: string;
  conditions?: string;
  mnemonic?: string; // Mẹo nhớ / thơ lục bát nhớ công thức / mẹo thi
  example?: string;
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  grade: Grade;
  subject: SubjectType;
  question: string;
  latexQuestion?: string;
  options: {
    text: string;
    latex?: string;
  }[];
  correctIndex: number;
  explanation: string;
  formulaId?: string;
}

export interface QuizAttempt {
  id: string;
  date: string;
  topicId: string;
  score: number;
  total: number;
  xpEarned: number;
  timeSpentSeconds: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  grade: Grade;
  school?: string;
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  masteredFormulaIds: string[];
  reviewedFormulaIds: string[];
  favoriteFormulaIds: string[];
  reminderEnabled: boolean;
  reminderTime: string;
  quizHistory: QuizAttempt[];
}

export interface UserAccount {
  id: string;
  username: string;
  password?: string;
  createdAt: string;
  profile: UserProfile;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  grade: Grade;
  school: string;
  xp: number;
  streak: number;
  formulasMastered: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface ForumReply {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  latexSnippet?: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
}

export interface ForumPost {
  id: string;
  authorName: string;
  authorAvatar: string;
  grade: Grade;
  subject: SubjectType;
  topicTag: string;
  title: string;
  content: string;
  latexSnippet?: string;
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies: ForumReply[];
}
