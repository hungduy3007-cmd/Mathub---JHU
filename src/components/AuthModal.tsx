import React, { useState } from 'react';
import { UserAccount, Grade, UserProfile } from '../types';
import { 
  loadAccounts, 
  getCurrentAccountId, 
  loginAccount, 
  registerAccount, 
  switchAccount, 
  deleteAccount 
} from '../utils/storage';
import { 
  User, Lock, UserPlus, LogIn, Users, Check, 
  Trash2, Sparkles, School, GraduationCap, Eye, EyeOff, ShieldCheck
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountChanged: (newProfile: UserProfile, account: UserAccount) => void;
  initialTab?: 'login' | 'register' | 'switch';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAccountChanged,
  initialTab = 'switch',
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'switch'>(initialTab);
  const [accounts, setAccounts] = useState<UserAccount[]>(() => loadAccounts());
  const [currentId, setCurrentId] = useState<string>(() => getCurrentAccountId());
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regGrade, setRegGrade] = useState<Grade>(12);
  const [regSchool, setRegSchool] = useState('THPT Chuyên');
  const [regAvatar, setRegAvatar] = useState('🦊');
  const [regError, setRegError] = useState('');

  const avatarChoices = ['🦊', '🦉', '🦄', '🦁', '🐯', '🐼', '🐱', '🐬', '🚀', '🎯', '⚡', '👑'];

  if (!isOpen) return null;

  const refreshAccountsList = () => {
    const list = loadAccounts();
    setAccounts(list);
    setCurrentId(getCurrentAccountId());
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const res = loginAccount(loginUsername, loginPassword);
    if (res.success && res.account) {
      refreshAccountsList();
      onAccountChanged(res.account.profile, res.account);
      onClose();
    } else {
      setLoginError(res.error || 'Đăng nhập không thành công.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    const res = registerAccount({
      username: regUsername,
      password: regPassword || '123',
      name: regName,
      grade: regGrade,
      school: regSchool,
      avatar: regAvatar,
    });

    if (res.success && res.account) {
      refreshAccountsList();
      onAccountChanged(res.account.profile, res.account);
      onClose();
    } else {
      setRegError(res.error || 'Đăng ký không thành công.');
    }
  };

  const handleQuickSwitch = (account: UserAccount) => {
    const switched = switchAccount(account.id);
    if (switched) {
      setCurrentId(switched.id);
      refreshAccountsList();
      onAccountChanged(switched.profile, switched);
      onClose();
    }
  };

  const handleDeleteAccount = (accId: string, accName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa tài khoản "${accName}" khỏi thiết bị này?`)) {
      const res = deleteAccount(accId);
      if (res.success) {
        refreshAccountsList();
        if (res.nextAccount) {
          onAccountChanged(res.nextAccount.profile, res.nextAccount);
        }
      } else if (res.error) {
        alert(res.error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-6">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-sm font-bold transition-colors"
          >
            ✕
          </button>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner mb-3">
            🎓
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Quản Lý & Đăng Nhập Tài Khoản</h2>
          <p className="text-xs text-amber-100 mt-1">
            Đăng nhập tài khoản cá nhân để lưu giữ tiến độ học tập, bài thi trắc nghiệm và điểm số
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-1">
          <button
            onClick={() => { setActiveTab('switch'); setLoginError(''); setRegError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'switch'
                ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Tài khoản ({accounts.length})</span>
          </button>

          <button
            onClick={() => { setActiveTab('login'); setLoginError(''); setRegError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'login'
                ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Đăng Nhập</span>
          </button>

          <button
            onClick={() => { setActiveTab('register'); setLoginError(''); setRegError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'register'
                ? 'bg-white dark:bg-slate-800 text-orange-600 dark:text-orange-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Đăng Ký Mới</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* TAB 1: ACCOUNTS SWITCHER */}
          {activeTab === 'switch' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Chọn tài khoản để chuyển đổi tức thì:</span>
                <button
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Thêm tài khoản mới</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {accounts.map((acc) => {
                  const isCurrent = acc.id === currentId;
                  return (
                    <div
                      key={acc.id}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                        isCurrent
                          ? 'border-orange-500 bg-orange-50/70 dark:bg-orange-950/40 ring-2 ring-orange-400/30'
                          : 'border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-slate-700 bg-white dark:bg-slate-800/60'
                      }`}
                    >
                      <div 
                        onClick={() => handleQuickSwitch(acc)}
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        <div className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-2xl shadow-xs shrink-0">
                          {acc.profile.avatar}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900 dark:text-slate-100 truncate">
                              {acc.profile.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                              Lớp {acc.profile.grade}
                            </span>
                            {isCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                                <Check className="w-3 h-3" /> Đang dùng
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>@{acc.username}</span>
                            <span>•</span>
                            <span className="truncate">{acc.profile.school || 'THPT'}</span>
                            <span>•</span>
                            <span className="font-semibold text-orange-600 dark:text-orange-400">{acc.profile.xp} XP</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0 ml-2">
                        {!isCurrent ? (
                          <button
                            onClick={() => handleQuickSwitch(acc)}
                            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-orange-500 hover:bg-orange-600 text-white shadow-xs transition-colors"
                          >
                            Chọn
                          </button>
                        ) : (
                          <span className="p-1.5 text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck className="w-5 h-5" />
                          </span>
                        )}

                        {accounts.length > 1 && (
                          <button
                            onClick={() => handleDeleteAccount(acc.id, acc.profile.name)}
                            title="Xóa tài khoản khỏi máy này"
                            className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-700/50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] text-slate-400 dark:text-slate-500">
                  Mỗi tài khoản lưu trữ độc lập công thức yêu thích, flashcard và kết quả luyện thi.
                </p>
                <button
                  onClick={() => setActiveTab('login')}
                  className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0"
                >
                  Đăng nhập tài khoản khác →
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: LOGIN FORM */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {loginError && (
                  <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl">
                    {loginError}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Tên đăng nhập hoặc Họ tên học sinh
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      placeholder="Ví dụ: quan12, linh12, nam11..."
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-hidden text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu (tài khoản mẫu là: 123)"
                      className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-hidden text-slate-900 dark:text-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Đăng Nhập Vào MathHub</span>
                </button>
              </form>

              {/* Demo 1-Click Login Section */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-2">
                  ⚡ Hoặc đăng nhập nhanh bằng tài khoản mẫu:
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {accounts.slice(0, 4).map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickSwitch(acc)}
                      className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 hover:border-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-950/20 text-left transition-all"
                    >
                      <span className="text-xl">{acc.profile.avatar}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{acc.profile.name}</p>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">Lớp {acc.profile.grade} • {acc.profile.xp} XP</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center text-xs text-slate-500 dark:text-slate-400">
                Chưa có tài khoản riêng?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-orange-600 dark:text-orange-400 hover:underline"
                >
                  Đăng ký tài khoản mới ngay
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: REGISTER FORM */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 rounded-xl">
                  {regError}
                </div>
              )}

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Chọn biểu tượng đại diện (Avatar):
                </label>
                <div className="flex flex-wrap gap-2">
                  {avatarChoices.map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setRegAvatar(emoji)}
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl transition-transform ${
                        regAvatar === emoji
                          ? 'bg-orange-500 text-white scale-110 shadow-md shadow-orange-500/30 ring-2 ring-orange-300'
                          : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Họ và tên học sinh *
                </label>
                <input
                  type="text"
                  required
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Ví dụ: Đỗ Quang Minh, Lê Mỹ Duyên..."
                  className="w-full px-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-hidden text-slate-900 dark:text-slate-100"
                />
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tên đăng nhập (viết liền, không dấu) *
                </label>
                <div className="relative">
                  <span className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 text-sm">@</span>
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    placeholder="ví dụ: quangminh12, duyenle..."
                    className="w-full pl-8 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-hidden text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mật khẩu bảo vệ
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Tối thiểu 3 ký tự (mặc định: 123)"
                    className="w-full pl-9 pr-10 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-hidden text-slate-900 dark:text-slate-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Grade Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Khối Lớp Hiện Tại:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([10, 11, 12] as Grade[]).map((grade) => (
                    <button
                      type="button"
                      key={grade}
                      onClick={() => setRegGrade(grade)}
                      className={`py-2 text-xs font-extrabold rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                        regGrade === grade
                          ? 'bg-amber-500 border-amber-500 text-white shadow-xs'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                      }`}
                    >
                      <GraduationCap className="w-4 h-4" />
                      <span>Lớp {grade}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* School */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Trường THPT
                </label>
                <div className="relative">
                  <School className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regSchool}
                    onChange={(e) => setRegSchool(e.target.value)}
                    placeholder="Ví dụ: THPT Chuyên Lê Quý Đôn"
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-orange-400 focus:outline-hidden text-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Bonus Tag */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-xl flex items-center gap-2 text-xs text-amber-800 dark:text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Tặng ngay <strong>+100 XP</strong> khởi đầu cho tài khoản mới mở!</span>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Tạo Tài Khoản & Đăng Nhập Ngay</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
