import React, { useState, useEffect, useMemo } from 'react';
import { QuizQuestion, UserProfile, QuizAttempt, Grade, SubjectType } from '../types';
import { QUIZ_QUESTIONS } from '../data/quizQuestions';
import { TOPICS } from '../data/mathCurriculum';
import { MathView } from './MathView';
import { 
  Trophy, CheckCircle2, XCircle, Clock, Flame, 
  RotateCcw, Sparkles, BookOpen, AlertCircle, Award 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizModeProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onGoToFlashcards: () => void;
}

export const QuizMode: React.FC<QuizModeProps> = ({
  userProfile,
  onUpdateProfile,
  onGoToFlashcards,
}) => {
  // Quiz setup states
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'all'>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Active quiz states
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [selectedAnswerForCurrent, setSelectedAnswerForCurrent] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(300); // 5 mins
  const [streakCount, setStreakCount] = useState(0);

  // Filter available questions based on settings
  const availableQuestions = useMemo(() => {
    return QUIZ_QUESTIONS.filter(q => {
      if (selectedGrade !== 'all' && q.grade !== selectedGrade) return false;
      if (selectedSubject !== 'all' && q.subject !== selectedSubject) return false;
      if (selectedTopicId !== 'all' && q.topicId !== selectedTopicId) return false;
      return true;
    });
  }, [selectedGrade, selectedSubject, selectedTopicId]);

  // Start Quiz
  const handleStartQuiz = () => {
    let pool = [...availableQuestions];
    if (pool.length === 0) pool = [...QUIZ_QUESTIONS];

    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random());
    const count = Math.min(questionCount, shuffled.length);
    const selected = shuffled.slice(0, count);

    setActiveQuestions(selected);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setSelectedAnswerForCurrent(null);
    setIsSubmitted(false);
    setTimeRemaining(count * 60); // 1 min per question
    setStreakCount(0);
    setIsQuizActive(true);
  };

  // Timer countdown
  useEffect(() => {
    if (!isQuizActive || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isQuizActive, isSubmitted, userAnswers, currentQuestionIndex]);

  const handleSelectOption = (index: number) => {
    if (isSubmitted) return;
    setSelectedAnswerForCurrent(index);
    setUserAnswers(prev => ({ ...prev, [currentQuestionIndex]: index }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswerForCurrent(userAnswers[currentQuestionIndex + 1] ?? null);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedAnswerForCurrent(userAnswers[currentQuestionIndex - 1] ?? null);
    }
  };

  // Submit and Calculate Score
  const handleSubmitQuiz = () => {
    setIsSubmitted(true);

    let correctCount = 0;
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const xpEarned = correctCount * 20 + (correctCount === activeQuestions.length ? 50 : 0);
    const totalTimeSpent = (activeQuestions.length * 60) - timeRemaining;

    // Trigger celebration if high score
    if (correctCount >= Math.ceil(activeQuestions.length * 0.8)) {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
      });
    }

    // Save attempt to user profile
    const newAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      topicId: selectedTopicId !== 'all' ? selectedTopicId : 'general',
      score: correctCount,
      total: activeQuestions.length,
      xpEarned,
      timeSpentSeconds: Math.max(1, totalTimeSpent),
    };

    const newXp = userProfile.xp + xpEarned;
    const newLevel = Math.floor(newXp / 150) + 1;

    onUpdateProfile({
      ...userProfile,
      xp: newXp,
      level: newLevel,
      quizHistory: [newAttempt, ...userProfile.quizHistory],
    });
  };

  // Format time
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 1. SETUP / HOME VIEW OF QUIZ
  if (!isQuizActive) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Banner */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                Luyện Tập Đỉnh Cao
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                Trắc Nghiệm Công Thức & Phản Xạ Nhanh
              </h1>
              <p className="text-white/90 text-sm max-w-xl">
                Kiểm tra khả năng nhớ công thức chính xác, tránh các bẫy dấu âm dương, điều kiện xác định và ứng dụng thực tế trong đề thi THPT Quốc Gia.
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0">
              🎯
            </div>
          </div>
        </div>

        {/* Configuration Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5 transition-colors">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" /> Tùy chỉnh bài luyện tập
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Grade Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Khối Lớp</label>
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value === 'all' ? 'all' : Number(e.target.value) as Grade);
                  setSelectedTopicId('all');
                }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
              >
                <option value="all">Tất cả lớp (10, 11, 12)</option>
                <option value={12}>Lớp 12 (Trọng tâm THPT)</option>
                <option value={11}>Lớp 11 (Lượng giác, CS, Tổ hợp)</option>
                <option value={10}>Lớp 10 (Vectơ, Tam thức, Oxy)</option>
              </select>
            </div>

            {/* Subject Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Phân Môn</label>
              <select
                value={selectedSubject}
                onChange={(e) => {
                  setSelectedSubject(e.target.value as SubjectType | 'all');
                  setSelectedTopicId('all');
                }}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
              >
                <option value="all">Cả Hình học & Số học</option>
                <option value="algebra">🔢 Đại số & Giải tích</option>
                <option value="geometry">📐 Hình học</option>
              </select>
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1.5">Số lượng câu</label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
              >
                <option value={5}>5 câu (Khởi động nhanh 5 phút)</option>
                <option value={10}>10 câu (Luyện phản xạ chuẩn)</option>
                <option value={15}>15 câu (Thử thách điểm 9+)</option>
              </select>
            </div>
          </div>

          {/* Quick presets */}
          <div className="pt-2">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
              Hoặc chọn chế độ đề thi nhanh:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setSelectedGrade(12);
                  setSelectedSubject('all');
                  setQuestionCount(10);
                  handleStartQuiz();
                }}
                className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 border border-purple-200 dark:border-purple-800/80 text-left transition-all"
              >
                <p className="text-xs font-bold text-purple-700 dark:text-purple-300">⚡ Tổng ôn Lớp 12</p>
                <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-0.5">Khảo sát hàm, mũ logarit, tích phân & Oxyz</p>
              </button>

              <button
                onClick={() => {
                  setSelectedGrade('all');
                  setSelectedSubject('geometry');
                  setQuestionCount(10);
                  handleStartQuiz();
                }}
                className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-cyan-200 dark:border-cyan-800/80 text-left transition-all"
              >
                <p className="text-xs font-bold text-cyan-800 dark:text-cyan-300">📐 Đại chiến Hình học 10-12</p>
                <p className="text-[11px] text-cyan-600 dark:text-cyan-400 mt-0.5">Thể tích, nón-trụ-cầu, hệ thức lượng & tọa độ</p>
              </button>

              <button
                onClick={() => {
                  setSelectedGrade(11);
                  setSelectedSubject('algebra');
                  setQuestionCount(5);
                  handleStartQuiz();
                }}
                className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/80 text-left transition-all"
              >
                <p className="text-xs font-bold text-emerald-800 dark:text-emerald-300">🎯 Lượng giác & Xác suất</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">Công thức cộng, nhân đôi & quy tắc tổ hợp</p>
              </button>
            </div>
          </div>

          {/* Start Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Có sẵn <strong className="text-slate-800 dark:text-slate-200">{availableQuestions.length}</strong> câu hỏi phù hợp bộ lọc
            </div>
            <button
              onClick={handleStartQuiz}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-md shadow-orange-500/20 flex items-center gap-2 transition-all transform active:scale-98"
            >
              <Sparkles className="w-4 h-4" /> Bắt đầu làm bài
            </button>
          </div>
        </div>

        {/* Past Quiz Attempts */}
        {userProfile.quizHistory.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3 transition-colors">
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" /> Lịch sử luyện tập gần đây
            </h3>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {userProfile.quizHistory.slice(0, 3).map((attempt) => (
                <div key={attempt.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-100">
                      Điểm: {attempt.score}/{attempt.total}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 ml-2">({attempt.date})</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-amber-600 dark:text-amber-400 font-semibold">+{attempt.xpEarned} XP</span>
                    <span className="text-slate-500 dark:text-slate-400">{attempt.timeSpentSeconds} giây</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // 2. ACTIVE QUIZ OR RESULT VIEW
  const currentQ = activeQuestions[currentQuestionIndex];
  const totalQuestions = activeQuestions.length;
  const answeredCount = Object.keys(userAnswers).length;

  let correctCount = 0;
  if (isSubmitted) {
    activeQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) correctCount++;
    });
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Bar: Progress, Timer, Streak */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs flex items-center justify-between gap-4 transition-colors">
        {/* Progress & Question Index */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-2.5 py-1 rounded-lg bg-orange-500 text-white">
            Câu {currentQuestionIndex + 1}/{totalQuestions}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
            (Đã làm {answeredCount}/{totalQuestions})
          </span>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
          timeRemaining < 60 
            ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 animate-pulse' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(timeRemaining)}</span>
        </div>

        {/* Action Button */}
        {!isSubmitted ? (
          <button
            onClick={handleSubmitQuiz}
            className="px-4 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-colors"
          >
            Nộp bài
          </button>
        ) : (
          <button
            onClick={() => setIsQuizActive(false)}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors"
          >
            Làm bài mới
          </button>
        )}
      </div>

      {/* QUIZ RESULT SUMMARY BANNER IF SUBMITTED */}
      {isSubmitted && (
        <div className="bg-gradient-to-r from-amber-50 dark:from-slate-900 to-orange-50 dark:to-slate-900 border-2 border-orange-300 dark:border-orange-500/60 rounded-3xl p-6 text-center space-y-3 shadow-xs transition-colors">
          <div className="inline-flex p-3 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
            <Award className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            {correctCount >= Math.ceil(totalQuestions * 0.8) ? 'Xuất Sắc! Bạn Đã Thuộc Công Thức 🌟' : 'Hoàn Thành Bài Thi! 👏'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Bạn đạt được <strong className="text-orange-600 dark:text-orange-400 text-lg">{correctCount}/{totalQuestions}</strong> câu đúng • Nhận <strong className="text-amber-600 dark:text-amber-400 text-lg">+{correctCount * 20} XP</strong>
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={handleStartQuiz}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Làm lại đề này
            </button>
            <button
              onClick={onGoToFlashcards}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <BookOpen className="w-4 h-4" /> Ôn lại bằng Flashcard
            </button>
          </div>
        </div>
      )}

      {/* Question Card */}
      {currentQ && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6 transition-colors">
          {/* Question Tag */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 font-bold">
                Lớp {currentQ.grade}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {currentQ.subject === 'algebra' ? 'Đại số' : 'Hình học'}
              </span>
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
              {currentQ.question}
            </h3>
            {currentQ.latexQuestion && (
              <div className="bg-amber-50/50 dark:bg-slate-950 border border-amber-100 dark:border-slate-800 p-3 rounded-xl text-center">
                <MathView math={currentQ.latexQuestion} block={true} className="text-slate-900 dark:text-slate-100 font-bold" />
              </div>
            )}
          </div>

          {/* Options List */}
          <div className="space-y-2.5">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = userAnswers[currentQuestionIndex] === optIdx;
              const isCorrect = currentQ.correctIndex === optIdx;

              let optionStyle = 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-orange-50/60 dark:hover:bg-orange-950/30 hover:border-orange-200 dark:hover:border-orange-800';

              if (isSubmitted) {
                if (isCorrect) {
                  optionStyle = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 dark:border-emerald-600 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-200 dark:ring-emerald-900/40';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 dark:border-rose-600 text-rose-900 dark:text-rose-200';
                } else {
                  optionStyle = 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                optionStyle = 'bg-orange-50 dark:bg-orange-950/50 border-orange-500 dark:border-orange-500 text-orange-950 dark:text-orange-200 ring-2 ring-orange-200 dark:ring-orange-900/40';
              }

              const letters = ['A', 'B', 'C', 'D'];

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(optIdx)}
                  disabled={isSubmitted}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-extrabold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      {letters[optIdx]}
                    </span>
                    <div className="text-sm font-medium">
                      {option.latex ? (
                        <MathView math={option.latex} />
                      ) : (
                        <span>{option.text}</span>
                      )}
                    </div>
                  </div>

                  {isSubmitted && (
                    <div>
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isSubmitted && (
            <div className="bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 space-y-2 text-xs text-blue-950 dark:text-blue-200">
              <div className="flex items-center gap-2 font-bold text-blue-900 dark:text-blue-300 text-sm">
                <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Giải thích chi tiết & Mẹo làm bài:
              </div>
              <p className="leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
            >
              Câu trước
            </button>

            {/* Questions Jump Bubbles */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-[200px] sm:max-w-none px-2">
              {activeQuestions.map((_, idx) => {
                const isAns = userAnswers[idx] !== undefined;
                const isCur = idx === currentQuestionIndex;
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentQuestionIndex(idx);
                      setSelectedAnswerForCurrent(userAnswers[idx] ?? null);
                    }}
                    className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all ${
                      isCur
                        ? 'bg-orange-500 text-white shadow-2xs'
                        : isAns
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white text-xs font-bold transition-colors"
            >
              Câu tiếp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
