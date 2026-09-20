import { UserProfile, LeaderboardUser, ForumPost, UserAccount, Grade } from '../types';

const ACCOUNTS_KEY = 'mathhub_accounts_v2';
const CURRENT_ACCOUNT_ID_KEY = 'mathhub_current_account_id';
const USER_PROFILE_KEY = 'mathhub_user_profile';
const FORUM_POSTS_KEY = 'mathhub_forum_posts';

export const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'acc-1',
    username: 'quan12',
    password: '123',
    createdAt: '2026-01-10T08:00:00.000Z',
    profile: {
      name: 'Nguyễn Minh Quân',
      avatar: '🦊',
      grade: 12,
      school: 'Chuyên Hà Nội - Amsterdam',
      xp: 2850,
      level: 19,
      streak: 28,
      lastStudyDate: new Date().toISOString().split('T')[0],
      masteredFormulaIds: [
        'f-12-01', 'f-12-02', 'f-12-03', 'f-12-04', 'f-12-05', 
        'f-12-06', 'f-12-07', 'f-12-08', 'f-12-09', 'f-12-10',
        'f-12-11', 'f-12-12', 'f-12-13', 'f-12-14', 'f-12-15',
        'f-12-16', 'f-12-17', 'f-12-18', 'f-12-19', 'f-12-20'
      ],
      reviewedFormulaIds: ['f-11-01', 'f-11-06'],
      favoriteFormulaIds: ['f-12-01', 'f-12-08', 'f-12-15'],
      reminderEnabled: true,
      reminderTime: '21:00',
      quizHistory: [
        {
          id: 'q-q1',
          date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
          topicId: '12-nguyen-ham-tich-phan',
          score: 5,
          total: 5,
          xpEarned: 50,
          timeSpentSeconds: 110,
        },
        {
          id: 'q-q2',
          date: new Date().toISOString().split('T')[0],
          topicId: '12-phuong-phap-toa-do-khong-gian',
          score: 5,
          total: 5,
          xpEarned: 50,
          timeSpentSeconds: 95,
        }
      ],
    },
  },
  {
    id: 'acc-2',
    username: 'linh12',
    password: '123',
    createdAt: '2026-01-15T09:30:00.000Z',
    profile: {
      name: 'Trần Thảo Linh',
      avatar: '🦄',
      grade: 12,
      school: 'Chuyên Lê Hồng Phong TP.HCM',
      xp: 2420,
      level: 16,
      streak: 21,
      lastStudyDate: new Date().toISOString().split('T')[0],
      masteredFormulaIds: [
        'f-12-01', 'f-12-04', 'f-12-05', 'f-12-07', 'f-12-08',
        'f-12-09', 'f-12-10', 'f-12-11', 'f-12-12', 'f-12-13',
        'f-12-14', 'f-12-15', 'f-12-16'
      ],
      reviewedFormulaIds: ['f-12-02', 'f-12-03'],
      favoriteFormulaIds: ['f-12-07', 'f-12-11'],
      reminderEnabled: true,
      reminderTime: '20:30',
      quizHistory: [
        {
          id: 'q-l1',
          date: new Date().toISOString().split('T')[0],
          topicId: '12-ung-dung-dao-ham',
          score: 5,
          total: 5,
          xpEarned: 50,
          timeSpentSeconds: 105,
        }
      ],
    },
  },
  {
    id: 'acc-3',
    username: 'nam11',
    password: '123',
    createdAt: '2026-02-01T14:15:00.000Z',
    profile: {
      name: 'Lê Hoàng Nam',
      avatar: '🦁',
      grade: 11,
      school: 'Chuyên Lam Sơn Thanh Hóa',
      xp: 1980,
      level: 13,
      streak: 15,
      lastStudyDate: new Date().toISOString().split('T')[0],
      masteredFormulaIds: ['f-11-01', 'f-11-02', 'f-11-03', 'f-11-04', 'f-11-05', 'f-11-06'],
      reviewedFormulaIds: ['f-11-07', 'f-11-08'],
      favoriteFormulaIds: ['f-11-01', 'f-11-03'],
      reminderEnabled: true,
      reminderTime: '19:30',
      quizHistory: [
        {
          id: 'q-n1',
          date: new Date().toISOString().split('T')[0],
          topicId: '11-luong-giac',
          score: 5,
          total: 5,
          xpEarned: 50,
          timeSpentSeconds: 115,
        }
      ],
    },
  },
  {
    id: 'acc-4',
    username: 'bao10',
    password: '123',
    createdAt: '2026-02-18T10:00:00.000Z',
    profile: {
      name: 'Phạm Gia Bảo',
      avatar: '🐯',
      grade: 10,
      school: 'Chuyên Khoa Học Tự Nhiên',
      xp: 450,
      level: 3,
      streak: 5,
      lastStudyDate: new Date().toISOString().split('T')[0],
      masteredFormulaIds: ['f-10-01', 'f-10-02', 'f-10-06'],
      reviewedFormulaIds: ['f-10-03', 'f-10-04'],
      favoriteFormulaIds: ['f-10-01'],
      reminderEnabled: false,
      reminderTime: '20:00',
      quizHistory: [
        {
          id: 'q-b1',
          date: new Date().toISOString().split('T')[0],
          topicId: '10-vecto',
          score: 4,
          total: 5,
          xpEarned: 40,
          timeSpentSeconds: 130,
        }
      ],
    },
  },
];

export const DEFAULT_USER_PROFILE: UserProfile = DEFAULT_ACCOUNTS[0].profile;

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

export function loadAccounts(): UserAccount[] {
  try {
    const saved = localStorage.getItem(ACCOUNTS_KEY);
    if (saved) {
      const parsed: UserAccount[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading accounts', e);
  }
  // Initialize with defaults
  saveAccounts(DEFAULT_ACCOUNTS);
  return DEFAULT_ACCOUNTS;
}

export function saveAccounts(accounts: UserAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Error saving accounts', e);
  }
}

export function getCurrentAccountId(): string {
  try {
    const currentId = localStorage.getItem(CURRENT_ACCOUNT_ID_KEY);
    if (currentId) return currentId;
  } catch (e) {
    console.error('Error reading current account id', e);
  }
  return DEFAULT_ACCOUNTS[0].id;
}

export function setCurrentAccountId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(CURRENT_ACCOUNT_ID_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_ACCOUNT_ID_KEY);
    }
  } catch (e) {
    console.error('Error setting current account id', e);
  }
}

export function getCurrentAccount(): UserAccount | null {
  const accounts = loadAccounts();
  const currentId = getCurrentAccountId();
  const found = accounts.find(a => a.id === currentId);
  if (found) return found;
  if (accounts.length > 0) {
    setCurrentAccountId(accounts[0].id);
    return accounts[0];
  }
  return null;
}

export function loadUserProfile(): UserProfile {
  const current = getCurrentAccount();
  if (current) {
    return current.profile;
  }
  return DEFAULT_USER_PROFILE;
}

export function saveUserProfile(profile: UserProfile): void {
  try {
    const accounts = loadAccounts();
    const currentId = getCurrentAccountId();
    const index = accounts.findIndex(a => a.id === currentId);
    if (index !== -1) {
      accounts[index].profile = profile;
      saveAccounts(accounts);
    }
    // Also save legacy key for compatibility
    localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving user profile', e);
  }
}

export function loginAccount(username: string, password?: string): { success: boolean; account?: UserAccount; error?: string } {
  const accounts = loadAccounts();
  const cleanUsername = username.trim().toLowerCase();
  
  if (!cleanUsername) {
    return { success: false, error: 'Vui lòng nhập tên đăng nhập hoặc email.' };
  }

  const account = accounts.find(a => 
    a.username.toLowerCase() === cleanUsername || 
    a.profile.name.toLowerCase() === cleanUsername
  );

  if (!account) {
    return { success: false, error: 'Tài khoản không tồn tại. Vui lòng kiểm tra lại hoặc Đăng ký tài khoản mới!' };
  }

  // Check password if account has password and password was provided
  if (account.password && password && account.password !== password) {
    return { success: false, error: 'Mật khẩu không chính xác. Mẹo: Tài khoản mẫu mật khẩu là "123".' };
  }

  setCurrentAccountId(account.id);
  saveUserProfile(account.profile);
  return { success: true, account };
}

export function registerAccount(data: {
  username: string;
  password?: string;
  name: string;
  grade: Grade;
  school?: string;
  avatar: string;
}): { success: boolean; account?: UserAccount; error?: string } {
  const accounts = loadAccounts();
  const cleanUsername = data.username.trim().toLowerCase().replace(/\s+/g, '');

  if (!cleanUsername || cleanUsername.length < 3) {
    return { success: false, error: 'Tên đăng nhập phải có ít nhất 3 ký tự (viết liền, không dấu).' };
  }

  const exists = accounts.some(a => a.username.toLowerCase() === cleanUsername);
  if (exists) {
    return { success: false, error: 'Tên đăng nhập đã được sử dụng. Vui lòng chọn tên khác!' };
  }

  if (!data.name.trim()) {
    return { success: false, error: 'Vui lòng nhập họ và tên học sinh.' };
  }

  const today = new Date().toISOString().split('T')[0];
  const newAccount: UserAccount = {
    id: `acc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    username: cleanUsername,
    password: data.password || '123',
    createdAt: new Date().toISOString(),
    profile: {
      name: data.name.trim(),
      avatar: data.avatar || '🦉',
      grade: data.grade || 12,
      school: data.school?.trim() || 'THPT',
      xp: 100, // Welcome gift XP!
      level: 1,
      streak: 1,
      lastStudyDate: today,
      masteredFormulaIds: [],
      reviewedFormulaIds: [],
      favoriteFormulaIds: [],
      reminderEnabled: true,
      reminderTime: '20:00',
      quizHistory: [],
    },
  };

  accounts.push(newAccount);
  saveAccounts(accounts);
  setCurrentAccountId(newAccount.id);
  saveUserProfile(newAccount.profile);

  return { success: true, account: newAccount };
}

export function switchAccount(accountId: string): UserAccount | null {
  const accounts = loadAccounts();
  const account = accounts.find(a => a.id === accountId);
  if (account) {
    setCurrentAccountId(account.id);
    saveUserProfile(account.profile);
    return account;
  }
  return null;
}

export function deleteAccount(accountId: string): { success: boolean; nextAccount?: UserAccount; error?: string } {
  const accounts = loadAccounts();
  if (accounts.length <= 1) {
    return { success: false, error: 'Cần duy trì ít nhất 1 tài khoản trên thiết bị.' };
  }

  const updated = accounts.filter(a => a.id !== accountId);
  saveAccounts(updated);

  const currentId = getCurrentAccountId();
  if (currentId === accountId) {
    const nextAcc = updated[0];
    setCurrentAccountId(nextAcc.id);
    saveUserProfile(nextAcc.profile);
    return { success: true, nextAccount: nextAcc };
  }

  return { success: true };
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
