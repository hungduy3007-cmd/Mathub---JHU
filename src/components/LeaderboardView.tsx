import React, { useState, useMemo } from 'react';
import { UserProfile, LeaderboardUser } from '../types';
import { INITIAL_LEADERBOARD, loadAccounts, getCurrentAccountId } from '../utils/storage';
import { 
  Trophy, Medal, Flame, Star, Sparkles, 
  Crown, UserCheck, Edit3, Check 
} from 'lucide-react';

interface LeaderboardViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('week');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userProfile.name);
  const [tempAvatar, setTempAvatar] = useState(userProfile.avatar);
  const [tempSchool, setTempSchool] = useState(userProfile.school || 'THPT');

  const avatarOptions = ['🦉', '🦊', '🦄', '🦁', '🐼', '🐯', '🐱', '🚀', '🎯', '⚡'];

  // Construct combined leaderboard list including all local accounts and benchmark students
  const combinedUsers = useMemo(() => {
    const allAccounts = loadAccounts();
    const currentId = getCurrentAccountId();

    const accountEntries: LeaderboardUser[] = allAccounts.map(acc => {
      const isCurr = acc.id === currentId;
      const prof = isCurr ? userProfile : acc.profile;
      return {
        id: acc.id,
        name: prof.name,
        avatar: prof.avatar,
        grade: prof.grade,
        school: prof.school || 'Học sinh MathHub',
        xp: prof.xp,
        streak: prof.streak,
        formulasMastered: prof.masteredFormulaIds.length,
        badge: prof.xp > 2000 ? 'Đại Bậc Thầy Toán 🌟' : prof.xp > 1000 ? 'Học Bá Siêu Đẳng 🚀' : 'Chiến Binh Chăm Chỉ ✏️',
        isCurrentUser: isCurr,
      };
    });

    // Merge with benchmarks avoiding duplicate names
    const accountNames = new Set(accountEntries.map(a => a.name.toLowerCase()));
    const benchmarks = INITIAL_LEADERBOARD.filter(b => !accountNames.has(b.name.toLowerCase()));

    const list = [...benchmarks, ...accountEntries];
    // Sort descending by XP
    list.sort((a, b) => b.xp - a.xp);
    return list;
  }, [userProfile]);

  const currentUserRank = combinedUsers.findIndex(u => u.isCurrentUser) + 1;

  const handleSaveProfile = () => {
    onUpdateProfile({
      ...userProfile,
      name: tempName.trim() || userProfile.name,
      avatar: tempAvatar,
      school: tempSchool.trim() || userProfile.school,
    });
    setIsEditingProfile(false);
  };

  const top3 = combinedUsers.slice(0, 3);
  const rest = combinedUsers.slice(3);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Thi Đua Học Tập
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Bảng Vàng Vinh Danh MathHub
            </h1>
            <p className="text-white/90 text-sm max-w-xl">
              Cùng hàng ngàn học sinh toàn quốc thi đua học thuộc công thức, giải đề trắc nghiệm và bứt phá điểm số môn Toán.
            </p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0">
            👑
          </div>
        </div>
      </div>

      {/* Current User Rank Ribbon */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 text-2xl flex items-center justify-center shadow-inner">
            {userProfile.avatar}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-extrabold">{userProfile.name}</h3>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/25 font-bold">
                Cấp {userProfile.level}
              </span>
            </div>
            <p className="text-xs text-white/80 font-medium mt-0.5">
              {userProfile.school || 'THPT'} • Thuộc {userProfile.masteredFormulaIds.length} công thức
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-6 self-end sm:self-auto">
          <div className="text-right">
            <p className="text-xs text-white/80 font-medium">Hạng của bạn</p>
            <p className="text-2xl font-black text-amber-300">#{currentUserRank}</p>
          </div>

          <div className="text-right">
            <p className="text-xs text-white/80 font-medium">Tổng điểm</p>
            <p className="text-2xl font-black text-white">{userProfile.xp} XP</p>
          </div>

          <button
            onClick={() => setIsEditingProfile(true)}
            className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors text-white"
            title="Đổi tên hoặc avatar"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 border border-slate-100 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-orange-500" /> Tùy chỉnh hồ sơ học sinh
            </h3>

            {/* Avatar picker */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Chọn Avatar:</label>
              <div className="flex flex-wrap gap-2">
                {avatarOptions.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => setTempAvatar(emoji)}
                    className={`w-10 h-10 rounded-2xl text-xl flex items-center justify-center transition-all ${
                      tempAvatar === emoji 
                        ? 'bg-orange-500 text-white ring-2 ring-orange-300 scale-105' 
                        : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Tên hiển thị:</label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                maxLength={30}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
              />
            </div>

            {/* School Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Trường THPT:</label>
              <input
                type="text"
                value={tempSchool}
                onChange={(e) => setTempSchool(e.target.value)}
                maxLength={50}
                placeholder="VD: THPT Chu Văn An"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-5 py-2 rounded-xl bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timeframe Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl shadow-2xs transition-colors">
          <button
            onClick={() => setTimeframe('week')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeframe === 'week' ? 'bg-orange-500 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Tuần này
          </button>
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeframe === 'month' ? 'bg-orange-500 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Tháng này
          </button>
          <button
            onClick={() => setTimeframe('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              timeframe === 'all' ? 'bg-orange-500 text-white shadow-2xs' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            Toàn thời gian
          </button>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
          Cập nhật mỗi 15 phút
        </span>
      </div>

      {/* Top 3 Podium Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {/* Top 2 (Silver) */}
        {top3[1] && (
          <div className="order-2 sm:order-1 bg-white dark:bg-slate-900 border-2 border-slate-200/80 dark:border-slate-800 rounded-3xl p-5 text-center shadow-xs flex flex-col justify-between relative mt-4 sm:mt-8 transition-colors">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black shadow-2xs">
              #2 Bạc 🥈
            </span>
            <div className="space-y-2 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-3xl flex items-center justify-center mx-auto shadow-2xs">
                {top3[1].avatar}
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">{top3[1].name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{top3[1].school}</p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-lg font-black text-slate-800 dark:text-slate-100">{top3[1].xp} XP</p>
              <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold">{top3[1].streak} ngày liên tiếp</p>
            </div>
          </div>
        )}

        {/* Top 1 (Gold) */}
        {top3[0] && (
          <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-50 dark:from-slate-900 to-white dark:to-slate-900 border-2 border-amber-300 dark:border-amber-500/70 rounded-3xl p-6 text-center shadow-md flex flex-col justify-between relative transition-colors">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white text-xs font-black shadow-sm flex items-center gap-1">
              <Crown className="w-3.5 h-3.5 fill-current" /> #1 Vàng 🥇
            </span>
            <div className="space-y-2 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-4xl flex items-center justify-center mx-auto ring-4 ring-amber-200 dark:ring-amber-500/40 shadow-md">
                {top3[0].avatar}
              </div>
              <h4 className="text-base font-black text-slate-900 dark:text-slate-100 truncate">{top3[0].name}</h4>
              <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold truncate">{top3[0].school}</p>
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-bold">
                {top3[0].badge}
              </span>
            </div>
            <div className="pt-3 mt-3 border-t border-amber-100 dark:border-slate-800">
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{top3[0].xp} XP</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 font-extrabold">🔥 {top3[0].streak} ngày streak</p>
            </div>
          </div>
        )}

        {/* Top 3 (Bronze) */}
        {top3[2] && (
          <div className="order-3 sm:order-3 bg-white dark:bg-slate-900 border-2 border-amber-200/60 dark:border-slate-800 rounded-3xl p-5 text-center shadow-xs flex flex-col justify-between relative mt-4 sm:mt-12 transition-colors">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-200 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-xs font-black shadow-2xs">
              #3 Đồng 🥉
            </span>
            <div className="space-y-2 pt-2">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-slate-800 text-3xl flex items-center justify-center mx-auto shadow-2xs">
                {top3[2].avatar}
              </div>
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 truncate">{top3[2].name}</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{top3[2].school}</p>
            </div>
            <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-lg font-black text-slate-800 dark:text-slate-100">{top3[2].xp} XP</p>
              <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold">{top3[2].streak} ngày liên tiếp</p>
            </div>
          </div>
        )}
      </div>

      {/* Rest of the Leaderboard Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xs space-y-3 transition-colors">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Các vị trí tiếp theo</h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {rest.map((user, index) => {
            const rank = index + 4;
            const isMe = user.isCurrentUser;

            return (
              <div
                key={user.id}
                className={`py-3 px-3 rounded-2xl flex items-center justify-between gap-3 transition-colors ${
                  isMe ? 'bg-orange-50/70 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800/80' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-6 text-center text-xs font-extrabold text-slate-400 dark:text-slate-500">
                    #{rank}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-lg flex items-center justify-center shrink-0">
                    {user.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                        {user.name} {isMe && '(Bạn)'}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                        Lớp {user.grade}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">{user.school}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-right shrink-0">
                  <div className="hidden sm:block">
                    <span className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 fill-current" /> {user.streak}d
                    </span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">{user.formulasMastered} công thức</p>
                  </div>

                  <div>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-100">{user.xp} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
