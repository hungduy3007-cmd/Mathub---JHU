import { UserProfile, LeaderboardUser, ForumPost } from '../types';

const USER_PROFILE_KEY = 'mathhub_user_profile';
const FORUM_POSTS_KEY = 'mathhub_forum_posts';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'Học Sinh Chăm Chỉ',
  avatar: '🦉',
  grade: 12,
  school: 'THPT Chuyên',
  xp: 450,
  level: 3,
  streak: 5,
  lastStudyDate: new Date().toISOString().split('T')[0],
  masteredFormulaIds: ['f-12-01', 'f-12-04', 'f-12-10', 'f-11-01', 'f-10-06'],
  reviewedFormulaIds: ['f-12-07', 'f-11-06'],
  favoriteFormulaIds: ['f-12-08', 'f-11-01', 'f-10-07'],
  reminderEnabled: true,
  reminderTime: '20:00',
  quizHistory: [
    {
      id: 'h-1',
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      topicId: '12-khoi-tron-xoay',
      score: 5,
      total: 5,
      xpEarned: 50,
      timeSpentSeconds: 120,
    },
    {
      id: 'h-2',
      date: new Date().toISOString().split('T')[0],
      topicId: '12-nguyen-ham-tich-phan',
      score: 4,
      total: 5,
      xpEarned: 40,
      timeSpentSeconds: 145,
    }
  ],
};

export const INITIAL_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'user-1',
    name: 'Nguyễn Minh Quân',
    avatar: '🦊',
    grade: 12,
    school: 'Chuyên Hà Nội - Amsterdam',
    xp: 2850,
    streak: 28,
    formulasMastered: 26,
    badge: 'Thủ Khoa Đạo Hàm 👑',
  },
  {
    id: 'user-2',
    name: 'Trần Thảo Linh',
    avatar: '🦄',
    grade: 12,
    school: 'Chuyên Lê Hồng Phong TP.HCM',
    xp: 2420,
    streak: 21,
    formulasMastered: 24,
    badge: 'Chiến Thần Tích Phân ⚡',
  },
  {
    id: 'user-3',
    name: 'Lê Hoàng Nam',
    avatar: '🦁',
    grade: 11,
    school: 'Chuyên Lam Sơn Thanh Hóa',
    xp: 1980,
    streak: 15,
    formulasMastered: 20,
    badge: 'Cao Thủ Lượng Giác 🎯',
  },
  {
    id: 'user-4',
    name: 'Đặng Ngọc Ánh',
    avatar: '🐼',
    grade: 12,
    school: 'THPT Kim Liên',
    xp: 1650,
    streak: 14,
    formulasMastered: 18,
    badge: 'Bậc Thầy Oxyz 📐',
  },
  {
    id: 'user-5',
    name: 'Phạm Gia Bảo',
    avatar: '🐯',
    grade: 10,
    school: 'Chuyên Khoa Học Tự Nhiên',
    xp: 1200,
    streak: 11,
    formulasMastered: 15,
    badge: 'Chiến Tướng Vectơ 🚀',
  },
  {
    id: 'user-6',
    name: 'Vũ Hải Yến',
    avatar: '🐱',
    grade: 11,
    school: 'THPT Chu Văn An',
    xp: 950,
    streak: 8,
    formulasMastered: 12,
    badge: 'Ong Chăm Chỉ 🐝',
  },
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'post-1',
    authorName: 'Trần Quang Hưng',
    authorAvatar: '🦊',
    grade: 12,
    subject: 'algebra',
    topicTag: 'Tích phân',
    title: 'Mẹo nhớ nhanh thứ tự đặt u trong tích phân từng phần?',
    content: 'Em hay bị lúng túng khi gặp tích phân chứa cả hàm đa thức và hàm mũ thì đặt cái nào là u trước ạ? Có câu thần chú nào dễ nhớ không các bạn?',
    latexSnippet: '\\int x \\cdot e^{2x} \\, dx',
    createdAt: '2 giờ trước',
    likes: 24,
    isLiked: false,
    replies: [
      {
        id: 'rep-1',
        authorName: 'Thầy Hùng Toán',
        authorAvatar: '👨‍🏫',
        content: 'Chào em! Câu thần chú kinh điển là: "Nhất lô, nhì đa, tam lượng, tứ mũ". Nghĩa là ưu tiên: 1. Logarit -> 2. Đa thức -> 3. Lượng giác -> 4. Mũ. Trong bài này x là Đa thức (nhì) còn e^(2x) là Mũ (tứ), nên đặt u = x và dv = e^(2x)dx nhé!',
        latexSnippet: 'u = x \\implies du = dx; \\quad dv = e^{2x}dx \\implies v = \\frac{1}{2}e^{2x}',
        createdAt: '1 giờ trước',
        likes: 18,
      },
      {
        id: 'rep-2',
        authorName: 'Lê Hoàng Nam',
        authorAvatar: '🦁',
        content: 'Chuẩn luôn, hoặc em học phương pháp "múa cột" (đạo hàm - nguyên hàm theo cột) tính bài này chỉ mất 10 giây thôi!',
        createdAt: '45 phút trước',
        likes: 9,
      }
    ],
  },
  {
    id: 'post-2',
    authorName: 'Đặng Mai Phương',
    authorAvatar: '🦄',
    grade: 12,
    subject: 'geometry',
    topicTag: 'Hình Oxyz',
    title: 'Cách tìm nhanh tâm và bán kính mặt cầu từ phương trình tổng quát',
    content: 'Khi cho phương trình mặt cầu dạng khai triển, có bạn nào có mẹo nhẩm nhanh tâm I và bán kính R mà không bị nhầm dấu không ạ?',
    latexSnippet: 'x^2 + y^2 + z^2 - 2ax - 2by - 2cz + d = 0',
    createdAt: '5 giờ trước',
    likes: 19,
    isLiked: false,
    replies: [
      {
        id: 'rep-3',
        authorName: 'Nguyễn Minh Quân',
        authorAvatar: '🦊',
        content: 'Mẹo cực đơn giản: Lấy hệ số trước x, y, z CHIA CHO (-2) là ra ngay tọa độ tâm I(a, b, c). Sau đó tính R = \\sqrt{a^2 + b^2 + c^2 - d} (nhớ là TRỪ d chứ không phải cộng d nhé)!',
        latexSnippet: 'I(a; b; c) = \\left( \\frac{\\text{hệ số } x}{-2}; \\frac{\\text{hệ số } y}{-2}; \\frac{\\text{hệ số } z}{-2} \\right)',
        createdAt: '3 giờ trước',
        likes: 15,
      }
    ],
  },
  {
    id: 'post-3',
    authorName: 'Nguyễn Văn Tuấn',
    authorAvatar: '🐯',
    grade: 11,
    subject: 'algebra',
    topicTag: 'Lượng giác',
    title: 'Bài thơ nhớ công thức cộng lượng giác cho bạn nào cần',
    content: 'Chia sẻ với mọi người bài thơ thầy mình dạy nhớ cực dai:\n"Cos thì cos cos sin sin, coi chừng dấu trừ (cos tổng thành hiệu)\nSin thì sin cos cos sin cùng chiều (sin tổng vẫn là cộng)"\nHọc thuộc bài này không bao giờ sợ nhầm dấu nữa!',
    latexSnippet: '\\cos(a+b) = \\cos a \\cos b - \\sin a \\sin b',
    createdAt: '1 ngày trước',
    likes: 42,
    isLiked: false,
    replies: [],
  },
];

export function loadUserProfile(): UserProfile {
  try {
    const saved = localStorage.getItem(USER_PROFILE_KEY);
    if (saved) {
      return { ...DEFAULT_USER_PROFILE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error loading user profile', e);
  }
  return DEFAULT_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile', e);
  }
}

export function loadForumPosts(): ForumPost[] {
  try {
    const saved = localStorage.getItem(FORUM_POSTS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Error loading forum posts', e);
  }
  return INITIAL_FORUM_POSTS;
}

export function saveForumPosts(posts: ForumPost[]): void {
  try {
    localStorage.setItem(FORUM_POSTS_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error('Error saving forum posts', e);
  }
}
