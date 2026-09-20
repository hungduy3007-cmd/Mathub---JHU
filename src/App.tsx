import React, { useState, useEffect } from 'react';
import { UserProfile, Formula, UserAccount } from './types';
import { loadUserProfile, saveUserProfile, getCurrentAccount } from './utils/storage';
import { FORMULAS } from './data/mathCurriculum';
import { Header } from './components/Header';
import { FormulaLibrary } from './components/FormulaLibrary';
import { FlashcardMode } from './components/FlashcardMode';
import { QuizMode } from './components/QuizMode';
import { ProgressAndReminder } from './components/ProgressAndReminder';
import { LeaderboardView } from './components/LeaderboardView';
import { ForumView } from './components/ForumView';
import { ProfileModal } from './components/ProfileModal';
import { AuthModal } from './components/AuthModal';
import { Sparkles, Heart, Bell } from 'lucide-react';

export default function App() {
  const [userProfile, setUserProfile] = useState<UserProfile>(() => loadUserProfile());
  const [activeTab, setActiveTab] = useState<string>('formulas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFormulaToPractice, setSelectedFormulaToPractice] = useState<Formula | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register' | 'switch'>('switch');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('mathhub_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  const [notificationToast, setNotificationToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  // Sync dark mode class with DOM and localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mathhub_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mathhub_theme', 'light');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Save profile on change
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    saveUserProfile(newProfile);
  };

  // Handle account switch / login / register
  const handleAccountChanged = (newProfile: UserProfile, account: UserAccount) => {
    setUserProfile(newProfile);
    setNotificationToast({
      show: true,
      message: `Xin chào ${newProfile.name}! Đã đăng nhập vào tài khoản Lớp ${newProfile.grade} (${newProfile.xp} XP).`,
    });
    setTimeout(() => {
      setNotificationToast({ show: false, message: '' });
    }, 4000);
  };

  const handleOpenAuth = (tab: 'login' | 'register' | 'switch' = 'switch') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  // Toggle favorite formula
  const handleToggleFavorite = (formulaId: string) => {
    const isFav = userProfile.favoriteFormulaIds.includes(formulaId);
    const updated = isFav
      ? userProfile.favoriteFormulaIds.filter(id => id !== formulaId)
      : [...userProfile.favoriteFormulaIds, formulaId];

    handleUpdateProfile({
      ...userProfile,
      favoriteFormulaIds: updated,
    });
  };

  // Toggle mastered formula
  const handleToggleMastered = (formulaId: string) => {
    const isMastered = userProfile.masteredFormulaIds.includes(formulaId);
    let updatedMastered = [...userProfile.masteredFormulaIds];
    let updatedReviewed = [...userProfile.reviewedFormulaIds];
    let xpGain = 0;

    if (isMastered) {
      updatedMastered = updatedMastered.filter(id => id !== formulaId);
    } else {
      updatedMastered.push(formulaId);
      updatedReviewed = updatedReviewed.filter(id => id !== formulaId);
      xpGain = 15;
    }

    const newXp = userProfile.xp + xpGain;
    const newLevel = Math.floor(newXp / 150) + 1;

    handleUpdateProfile({
      ...userProfile,
      xp: newXp,
      level: newLevel,
      masteredFormulaIds: updatedMastered,
      reviewedFormulaIds: updatedReviewed,
    });
  };

  // Direct practice start from Library
  const handleStartPractice = (formula: Formula) => {
    setSelectedFormulaToPractice(formula);
    setActiveTab('flashcard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToFlashcardForFormula = (formulaId: string) => {
    const found = FORMULAS.find(f => f.id === formulaId);
    if (found) {
      handleStartPractice(found);
    } else {
      setActiveTab('flashcard');
    }
  };

  const handleOpenReminderNotification = () => {
    setNotificationToast({
      show: true,
      message: `Nhắc nhở học tập: Đã cài đặt lịch nhắc vào lúc ${userProfile.reminderTime} mỗi ngày. Hãy duy trì chuỗi ${userProfile.streak} ngày liên tiếp nhé!`,
    });
    setTimeout(() => {
      setNotificationToast({ show: false, message: '' });
    }, 4500);
  };

  // Check daily streak update
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (userProfile.lastStudyDate !== today) {
      // In a new day, streak can increment or update
      handleUpdateProfile({
        ...userProfile,
        lastStudyDate: today,
      });
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* Interactive Notification Alert */}
      {notificationToast.show && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm bg-white dark:bg-slate-900 border-2 border-orange-400 dark:border-orange-500 rounded-2xl p-4 shadow-xl animate-fade-in flex items-start gap-3">
          <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-slate-800 dark:text-slate-100">Thông Báo Học Tập</span>
              <button
                onClick={() => setNotificationToast({ show: false, message: '' })}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{notificationToast.message}</p>
          </div>
        </div>
      )}

      {/* Main Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userProfile={userProfile}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onOpenReminderNotification={handleOpenReminderNotification}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'formulas' && (
          <FormulaLibrary
            userProfile={userProfile}
            onToggleFavorite={handleToggleFavorite}
            onToggleMastered={handleToggleMastered}
            onStartPractice={handleStartPractice}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        )}

        {activeTab === 'flashcard' && (
          <FlashcardMode
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            selectedFormulaToPractice={selectedFormulaToPractice}
            onClearSelectedPractice={() => setSelectedFormulaToPractice(null)}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizMode
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onGoToFlashcards={() => setActiveTab('flashcard')}
          />
        )}

        {activeTab === 'analytics' && (
          <ProgressAndReminder
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
            onGoToFlashcardForFormula={handleGoToFlashcardForFormula}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'forum' && (
          <ForumView
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />
        )}
      </main>

      {/* Profile & Achievement Modal */}
      {isProfileModalOpen && (
        <ProfileModal
          userProfile={userProfile}
          onUpdateProfile={handleUpdateProfile}
          onClose={() => setIsProfileModalOpen(false)}
          onOpenAuth={handleOpenAuth}
        />
      )}

      {/* Multi-user Auth & Switch Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialTab={authModalTab}
        onClose={() => setIsAuthModalOpen(false)}
        onAccountChanged={handleAccountChanged}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-amber-100 dark:border-slate-800 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="font-black text-slate-700 dark:text-slate-300">MathHub THPT</span>
            <span>•</span>
            <span>Toàn bộ công thức Hình học & Đại số 10 - 11 - 12</span>
          </div>
          <p className="text-slate-400 dark:text-slate-500">
            Học tập thông minh cùng Flashcard, Trắc nghiệm phản xạ, Bảng xếp hạng và Diễn đàn chia sẻ bài tập.
          </p>
        </div>
      </footer>
    </div>
  );
}
