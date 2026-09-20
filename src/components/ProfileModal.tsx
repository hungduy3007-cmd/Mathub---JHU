import React, { useState } from 'react';
import { UserProfile, Grade } from '../types';
import { FORMULAS } from '../data/mathCurriculum';
import { 
  Trophy, Flame, Award, CheckCircle2, 
  X, Check, Sparkles, BookOpen 
} from 'lucide-react';

interface ProfileModalProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  userProfile,
  onUpdateProfile,
  onClose,
}) => {
  const [name, setName] = useState(userProfile.name);
  const [avatar, setAvatar] = useState(userProfile.avatar);
  const [grade, setGrade] = useState<Grade>(userProfile.grade);
  const [school, setSchool] = useState(userProfile.school || '');

  const avatarOptions = ['🦉', '🦊', '🦄', '🦁', '🐼', '🐯', '🐱', '🚀', '🎯', '⚡'];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...userProfile,
      name: name.trim() || userProfile.name,
      avatar,
      grade,
      school: school.trim() || 'THPT',
    });
    onClose();
  };

  const currentLevelMinXp = (userProfile.level - 1) * 150;
  const nextLevelXp = userProfile.level * 150;
  const xpInCurrentLevel = userProfile.xp - currentLevelMinXp;
  const levelProgressPct = Math.min(100, Math.round((xpInCurrentLevel / 150) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              <Trophy className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Hồ Sơ & Thành Tích Học Tập</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="bg-gradient-to-r from-amber-50 dark:from-slate-800/90 to-orange-50 dark:to-slate-800/70 border border-amber-200 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-4 transition-colors">
          <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 text-3xl flex items-center justify-center shadow-xs">
            {userProfile.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-black text-slate-800 dark:text-slate-100 truncate">{userProfile.name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Lớp {userProfile.grade} • {userProfile.school || 'THPT'}</p>
            {/* Level progress bar */}
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-orange-600 dark:text-orange-400">Cấp độ {userProfile.level}</span>
                <span className="text-slate-500 dark:text-slate-400">{userProfile.xp} / {nextLevelXp} XP</span>
              </div>
              <div className="w-full h-1.5 bg-amber-200/60 dark:bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                  style={{ width: `${levelProgressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/80">
            <div className="flex items-center justify-center gap-1 text-orange-500 font-black text-lg">
              <Flame className="w-4 h-4 fill-current" /> {userProfile.streak}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Ngày Streak</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/80">
            <div className="flex items-center justify-center gap-1 text-emerald-600 dark:text-emerald-400 font-black text-lg">
              <CheckCircle2 className="w-4 h-4" /> {userProfile.masteredFormulaIds.length}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Công thức thuộc</p>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-100 dark:border-slate-700/80">
            <div className="flex items-center justify-center gap-1 text-indigo-600 dark:text-indigo-400 font-black text-lg">
              <Award className="w-4 h-4" /> {userProfile.quizHistory.length}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Bài đã làm</p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Chọn Biểu Tượng Avatar:</label>
            <div className="flex flex-wrap gap-2">
              {avatarOptions.map(emoji => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setAvatar(emoji)}
                  className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${
                    avatar === emoji 
                      ? 'bg-orange-500 text-white ring-2 ring-orange-300 scale-105' 
                      : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Tên của bạn:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Khối Lớp:</label>
              <select
                value={grade}
                onChange={(e) => setGrade(Number(e.target.value) as Grade)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100"
              >
                <option value={12}>Lớp 12</option>
                <option value={11}>Lớp 11</option>
                <option value={10}>Lớp 10</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Trường học:</label>
              <input
                type="text"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="VD: THPT Lê Quý Đôn"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-100"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" /> Lưu thông tin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
