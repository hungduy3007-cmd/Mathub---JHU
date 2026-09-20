import React from 'react';
import { BookOpen, Sparkles, Trophy, BarChart3, MessageSquare, Flame, Search, Bell, Sun, Moon } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userProfile: UserProfile;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onOpenProfile: () => void;
  onOpenReminderNotification?: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  userProfile,
  searchQuery,
  setSearchQuery,
  onOpenProfile,
  onOpenReminderNotification,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const navItems = [
    { id: 'formulas', label: 'Sổ Tay Công Thức', icon: BookOpen },
    { id: 'flashcard', label: 'Flashcard Ghi Nhớ', icon: Sparkles },
    { id: 'quiz', label: 'Luyện Trắc Nghiệm', icon: Trophy },
    { id: 'analytics', label: 'Tiến Độ & Nhắc Nhở', icon: BarChart3 },
    { id: 'leaderboard', label: 'Bảng Xếp Hạng', icon: Trophy },
    { id: 'forum', label: 'Diễn Đàn Hỏi Đáp', icon: MessageSquare },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-amber-100 dark:border-slate-800 shadow-xs transition-colors">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('formulas')}
            className="flex items-center gap-3 cursor-pointer select-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md shadow-orange-500/20">
              ∑
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg text-slate-800 dark:text-slate-100 tracking-tight">MathHub</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-700 dark:text-orange-300">10-12</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">Sổ tay & Ôn luyện Toán THPT</p>
            </div>
          </div>

          {/* Quick Search */}
          <div className="flex-1 max-w-md mx-2">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'formulas' && e.target.value.trim().length > 0) {
                    setActiveTab('formulas');
                  }
                }}
                placeholder="Tìm nhanh công thức (đạo hàm, tích phân, nón, Oxyz, elip...)"
                className="w-full pl-9 pr-8 py-1.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full focus:outline-hidden focus:ring-2 focus:ring-orange-400 focus:bg-white dark:focus:bg-slate-800 text-slate-700 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* User Status Badges & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Dark Mode Toggle Button */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-amber-400 hover:bg-orange-50 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Chuyển sang chế độ sáng (Light Mode)' : 'Chuyển sang chế độ tối ban đêm (Dark Mode)'}
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400 animate-spin-slow" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Daily Reminder Bell */}
            <button
              onClick={onOpenReminderNotification}
              title={userProfile.reminderEnabled ? `Nhắc nhở lúc ${userProfile.reminderTime}` : 'Cài đặt nhắc nhở'}
              className="relative p-2 text-slate-600 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              <Bell className="w-5 h-5" />
              {userProfile.reminderEnabled && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>

            {/* Streak Counter */}
            <div 
              onClick={() => setActiveTab('analytics')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40 border border-orange-200/70 dark:border-orange-800 text-orange-700 dark:text-orange-300 cursor-pointer hover:bg-orange-100 dark:hover:bg-orange-900/50 transition-colors"
              title="Chuỗi ngày học liên tiếp"
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
              <span className="text-xs font-bold">{userProfile.streak} ngày</span>
            </div>

            {/* XP and User Profile */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 transition-colors"
            >
              <span className="text-lg leading-none">{userProfile.avatar}</span>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold leading-none">{userProfile.name}</p>
                <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">{userProfile.xp} XP • Cấp {userProfile.level}</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
