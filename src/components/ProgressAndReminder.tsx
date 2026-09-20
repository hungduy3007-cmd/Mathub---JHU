import React, { useState } from 'react';
import { UserProfile, Grade, SubjectType } from '../types';
import { FORMULAS, TOPICS } from '../data/mathCurriculum';
import { 
  BarChart3, Flame, Bell, CheckCircle2, Clock, 
  TrendingUp, AlertTriangle, Sparkles, BookOpen, Target 
} from 'lucide-react';

interface ProgressAndReminderProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onGoToFlashcardForFormula: (formulaId: string) => void;
}

export const ProgressAndReminder: React.FC<ProgressAndReminderProps> = ({
  userProfile,
  onUpdateProfile,
  onGoToFlashcardForFormula,
}) => {
  const [reminderTimeInput, setReminderTimeInput] = useState(userProfile.reminderTime);
  const [reminderToggle, setReminderToggle] = useState(userProfile.reminderEnabled);
  const [showNotificationToast, setShowNotificationToast] = useState(false);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState(false);

  // Metrics calculation
  const totalFormulas = FORMULAS.length;
  const masteredCount = userProfile.masteredFormulaIds.length;
  const overallPercentage = Math.round((masteredCount / totalFormulas) * 100);

  // Grade Breakdown
  const gradeStats = ([12, 11, 10] as Grade[]).map(grade => {
    const formulasInGrade = FORMULAS.filter(f => f.grade === grade);
    const masteredInGrade = formulasInGrade.filter(f => userProfile.masteredFormulaIds.includes(f.id)).length;
    const pct = formulasInGrade.length > 0 ? Math.round((masteredInGrade / formulasInGrade.length) * 100) : 0;
    return {
      grade,
      total: formulasInGrade.length,
      mastered: masteredInGrade,
      percentage: pct,
    };
  });

  // Subject Breakdown
  const algebraFormulas = FORMULAS.filter(f => f.subject === 'algebra');
  const algebraMastered = algebraFormulas.filter(f => userProfile.masteredFormulaIds.includes(f.id)).length;
  const algebraPct = Math.round((algebraMastered / algebraFormulas.length) * 100);

  const geometryFormulas = FORMULAS.filter(f => f.subject === 'geometry');
  const geometryMastered = geometryFormulas.filter(f => userProfile.masteredFormulaIds.includes(f.id)).length;
  const geometryPct = Math.round((geometryMastered / geometryFormulas.length) * 100);

  // Formulas that need review (in reviewedFormulaIds or not mastered)
  const weakFormulas = FORMULAS.filter(f => 
    userProfile.reviewedFormulaIds.includes(f.id) || !userProfile.masteredFormulaIds.includes(f.id)
  ).slice(0, 5);

  const handleSaveReminder = () => {
    onUpdateProfile({
      ...userProfile,
      reminderEnabled: reminderToggle,
      reminderTime: reminderTimeInput,
    });
    setSavedSuccessMessage(true);
    setTimeout(() => setSavedSuccessMessage(false), 2500);
  };

  const handleTriggerTestReminder = () => {
    setShowNotificationToast(true);
    // Also try standard Web Notification if supported and permitted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('MathHub THPT Nhắc Nhở 🔔', {
        body: `Đã đến giờ ôn tập ${reminderTimeInput}! Hãy dành 15 phút luyện flashcard để nắm trọn công thức nhé!`,
        icon: '/favicon.ico',
      });
    } else if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Test Notification Banner Pop-up */}
      {showNotificationToast && (
        <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-sm bg-white dark:bg-slate-900 border-2 border-orange-400 dark:border-orange-500 rounded-2xl p-4 shadow-xl animate-bounce">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">Nhắc nhở học tập MathHub</h4>
                <button
                  onClick={() => setShowNotificationToast(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                🔔 <strong>Đã đến {reminderTimeInput}!</strong> Dành 15 phút ôn 5 công thức để củng cố kiến thức và giữ vững chuỗi {userProfile.streak} ngày streak nhé!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Theo Dõi Học Tập
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Phân Tích Tiến Độ & Nhắc Nhở Hàng Ngày
            </h1>
            <p className="text-white/90 text-sm max-w-xl">
              Hệ thống hóa độ ghi nhớ từng khối lớp, phát hiện các chuyên đề cần cải thiện và duy trì thói quen học tập đều đặn.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-md text-center">
              <div className="flex items-center justify-center gap-1 text-orange-300">
                <Flame className="w-5 h-5 fill-current" />
                <span className="text-xl font-black text-white">{userProfile.streak}</span>
              </div>
              <p className="text-[11px] text-white/80 font-semibold mt-0.5">Ngày liên tiếp</p>
            </div>
            <div className="px-4 py-3 rounded-2xl bg-white/20 backdrop-blur-md text-center">
              <p className="text-xl font-black text-white">{overallPercentage}%</p>
              <p className="text-[11px] text-white/80 font-semibold mt-0.5">Thuộc toàn bộ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: 2 Columns (Analytics Left, Reminder Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Progress Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          {/* Grade Completion Bars */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-orange-500" /> Tiến độ theo từng khối lớp
              </h3>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {masteredCount}/{totalFormulas} công thức
              </span>
            </div>

            <div className="space-y-4">
              {gradeStats.map((stat) => (
                <div key={stat.grade} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Lớp {stat.grade}</span>
                    <span className="text-slate-500 dark:text-slate-400">
                      {stat.mastered}/{stat.total} ({stat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stat.grade === 12
                          ? 'bg-gradient-to-r from-purple-500 to-indigo-600'
                          : stat.grade === 11
                            ? 'bg-gradient-to-r from-blue-500 to-cyan-500'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500'
                      }`}
                      style={{ width: `${stat.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Subject Breakdown (Algebra vs Geometry) */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-4">
              <div className="bg-orange-50/50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-900/60 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-orange-950 dark:text-orange-200">🔢 Đại số & Giải tích</span>
                  <span className="font-extrabold text-orange-600 dark:text-orange-400">{algebraPct}%</span>
                </div>
                <div className="w-full h-2 bg-orange-100 dark:bg-orange-900/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500 rounded-full"
                    style={{ width: `${algebraPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-orange-800/80 dark:text-orange-300/80">{algebraMastered}/{algebraFormulas.length} công thức</p>
              </div>

              <div className="bg-sky-50/50 dark:bg-sky-950/40 border border-sky-100 dark:border-sky-900/60 rounded-2xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-sky-950 dark:text-sky-200">📐 Hình học</span>
                  <span className="font-extrabold text-sky-600 dark:text-sky-400">{geometryPct}%</span>
                </div>
                <div className="w-full h-2 bg-sky-100 dark:bg-sky-900/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-sky-500 rounded-full"
                    style={{ width: `${geometryPct}%` }}
                  />
                </div>
                <p className="text-[10px] text-sky-800/80 dark:text-sky-300/80">{geometryMastered}/{geometryFormulas.length} công thức</p>
              </div>
            </div>
          </div>

          {/* Weak Topics Alert / Focus Revision */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4 transition-colors">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                Công thức cần củng cố & ôn tập ngay
              </h3>
              <span className="text-xs text-slate-400 dark:text-slate-500">Được đề xuất tự động</span>
            </div>

            {weakFormulas.length === 0 ? (
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                Tuyệt vời! Bạn đã nắm vững các công thức cơ bản. Hãy tiếp tục luyện trắc nghiệm để duy trì phong độ.
              </div>
            ) : (
              <div className="space-y-2.5">
                {weakFormulas.map((f) => (
                  <div
                    key={f.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between gap-3 hover:bg-slate-100/70 dark:hover:bg-slate-750 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                          Lớp {f.grade}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{f.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{f.explanation}</p>
                    </div>

                    <button
                      onClick={() => onGoToFlashcardForFormula(f.id)}
                      className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shrink-0 shadow-2xs transition-colors"
                    >
                      Ôn thẻ này
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 col): Daily Reminder Settings */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5 transition-colors">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Nhắc Nhở Học Tập</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Giữ thói quen mỗi ngày</p>
              </div>
            </div>

            {/* Enable Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Bật nhắc nhở mỗi ngày</span>
              <button
                type="button"
                onClick={() => setReminderToggle(prev => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  reminderToggle ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    reminderToggle ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Time Picker */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400">
                Thời gian nhắc nhở:
              </label>
              <input
                type="time"
                value={reminderTimeInput}
                onChange={(e) => setReminderTimeInput(e.target.value)}
                disabled={!reminderToggle}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-100 font-bold focus:ring-2 focus:ring-orange-400 focus:outline-hidden disabled:opacity-50"
              />
            </div>

            {/* Daily Goal Target */}
            <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 dark:text-amber-200">
                <Target className="w-4 h-4 text-amber-600 dark:text-amber-400" /> Mục tiêu hôm nay:
              </div>
              <ul className="text-xs text-amber-950/80 dark:text-amber-300/80 space-y-1 pl-4 list-disc">
                <li>Thuộc thêm ít nhất 3 công thức mới</li>
                <li>Làm 1 bài trắc nghiệm nhanh 5 câu</li>
                <li>Duy trì chuỗi streak liên tục</li>
              </ul>
            </div>

            {/* Save & Test Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleSaveReminder}
                className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Lưu cài đặt nhắc nhở
              </button>

              <button
                onClick={handleTriggerTestReminder}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                Thử nghiệm thông báo
              </button>

              {savedSuccessMessage && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold text-center animate-fade-in">
                  ✓ Đã lưu cài đặt thành công!
                </p>
              )}
            </div>
          </div>

          {/* Motivational Quote Card */}
          <div className="bg-gradient-to-br from-indigo-50 dark:from-indigo-950/40 via-purple-50 dark:via-purple-950/40 to-pink-50 dark:to-pink-950/30 border border-indigo-100 dark:border-indigo-900/60 rounded-3xl p-5 space-y-2 transition-colors">
            <span className="text-lg">💡</span>
            <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200 leading-snug">
              "Toán học không phải là việc ghi nhớ một cách máy móc, mà là rèn luyện phản xạ nhìn nhận bài toán từ những công thức cốt lõi nhất."
            </p>
            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">— Chúc bạn học tốt!</p>
          </div>
        </div>
      </div>
    </div>
  );
};
