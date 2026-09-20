import React, { useState, useEffect, useMemo } from 'react';
import { Formula, Grade, SubjectType, UserProfile } from '../types';
import { FORMULAS, TOPICS } from '../data/mathCurriculum';
import { MathView } from './MathView';
import { 
  Sparkles, RotateCw, CheckCircle2, XCircle, Star, 
  Shuffle, ArrowLeft, ArrowRight, BookOpen, Lightbulb, Trophy 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface FlashcardModeProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  selectedFormulaToPractice?: Formula | null;
  onClearSelectedPractice?: () => void;
}

export const FlashcardMode: React.FC<FlashcardModeProps> = ({
  userProfile,
  onUpdateProfile,
  selectedFormulaToPractice,
  onClearSelectedPractice,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'all'>('all');
  const [deckFilter, setDeckFilter] = useState<'all' | 'unmastered' | 'favorites'>('all');

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionMasteredCount, setSessionMasteredCount] = useState(0);

  // Filter cards
  const deck = useMemo(() => {
    // If specific formula requested
    if (selectedFormulaToPractice) {
      return [selectedFormulaToPractice];
    }

    return FORMULAS.filter(formula => {
      if (selectedGrade !== 'all' && formula.grade !== selectedGrade) return false;
      if (selectedSubject !== 'all' && formula.subject !== selectedSubject) return false;

      if (deckFilter === 'unmastered' && userProfile.masteredFormulaIds.includes(formula.id)) return false;
      if (deckFilter === 'favorites' && !userProfile.favoriteFormulaIds.includes(formula.id)) return false;

      return true;
    });
  }, [selectedGrade, selectedSubject, deckFilter, selectedFormulaToPractice, userProfile]);

  // Reset index if deck changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [selectedGrade, selectedSubject, deckFilter, selectedFormulaToPractice]);

  const currentFormula: Formula | undefined = deck[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < deck.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      setCurrentIndex(deck.length - 1);
    }
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCurrentIndex(Math.floor(Math.random() * deck.length));
  };

  const handleMarkMastered = () => {
    if (!currentFormula) return;
    const formulaId = currentFormula.id;
    const isAlreadyMastered = userProfile.masteredFormulaIds.includes(formulaId);

    let updatedMastered = [...userProfile.masteredFormulaIds];
    let updatedReviewed = userProfile.reviewedFormulaIds.filter(id => id !== formulaId);
    let xpGain = 0;

    if (!isAlreadyMastered) {
      updatedMastered.push(formulaId);
      xpGain = 15;
      setSessionMasteredCount(prev => prev + 1);
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    }

    const newXp = userProfile.xp + xpGain;
    const newLevel = Math.floor(newXp / 150) + 1;

    onUpdateProfile({
      ...userProfile,
      xp: newXp,
      level: newLevel,
      masteredFormulaIds: updatedMastered,
      reviewedFormulaIds: updatedReviewed,
    });

    handleNext();
  };

  const handleMarkReview = () => {
    if (!currentFormula) return;
    const formulaId = currentFormula.id;

    let updatedMastered = userProfile.masteredFormulaIds.filter(id => id !== formulaId);
    let updatedReviewed = [...userProfile.reviewedFormulaIds];
    if (!updatedReviewed.includes(formulaId)) {
      updatedReviewed.push(formulaId);
    }

    onUpdateProfile({
      ...userProfile,
      masteredFormulaIds: updatedMastered,
      reviewedFormulaIds: updatedReviewed,
    });

    handleNext();
  };

  const handleToggleFavorite = () => {
    if (!currentFormula) return;
    const formulaId = currentFormula.id;
    const isFav = userProfile.favoriteFormulaIds.includes(formulaId);

    const updatedFav = isFav
      ? userProfile.favoriteFormulaIds.filter(id => id !== formulaId)
      : [...userProfile.favoriteFormulaIds, formulaId];

    onUpdateProfile({
      ...userProfile,
      favoriteFormulaIds: updatedFav,
    });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, deck.length]);

  if (deck.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center max-w-xl mx-auto space-y-4 shadow-sm transition-colors">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto text-2xl">
          🎉
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Không có thẻ nào trong bộ lọc này</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Bạn đã thuộc hết các công thức trong mục này hoặc chưa có thẻ yêu thích nào được chọn.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => {
              setDeckFilter('all');
              setSelectedGrade('all');
              setSelectedSubject('all');
              if (onClearSelectedPractice) onClearSelectedPractice();
            }}
            className="px-5 py-2 rounded-xl bg-orange-500 text-white font-bold text-sm shadow-xs hover:bg-orange-600 transition-colors"
          >
            Học lại toàn bộ thẻ
          </button>
        </div>
      </div>
    );
  }

  const isCurrentMastered = currentFormula ? userProfile.masteredFormulaIds.includes(currentFormula.id) : false;
  const isCurrentFavorite = currentFormula ? userProfile.favoriteFormulaIds.includes(currentFormula.id) : false;
  const progressPercent = Math.round(((currentIndex + 1) / deck.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header & Mode Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 transition-colors">
        {selectedFormulaToPractice && (
          <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 px-3 py-1.5 rounded-xl text-xs font-semibold">
            <span>Đang luyện riêng công thức được chọn</span>
            <button
              onClick={onClearSelectedPractice}
              className="text-orange-600 dark:text-orange-400 underline hover:text-orange-900 dark:hover:text-orange-200"
            >
              Quay lại toàn bộ bộ thẻ
            </button>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Deck Filters */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setDeckFilter('all')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                deckFilter === 'all' 
                  ? 'bg-orange-500 text-white shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Tất cả ({FORMULAS.length})
            </button>
            <button
              onClick={() => setDeckFilter('unmastered')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                deckFilter === 'unmastered' 
                  ? 'bg-orange-500 text-white shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Chưa thuộc
            </button>
            <button
              onClick={() => setDeckFilter('favorites')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                deckFilter === 'favorites' 
                  ? 'bg-orange-500 text-white shadow-xs' 
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Star className="w-3 h-3" /> Yêu thích ({userProfile.favoriteFormulaIds.length})
            </button>
          </div>

          {/* Grade Selector */}
          <div className="flex items-center gap-1">
            {[
              { label: 'Tất cả', value: 'all' },
              { label: 'Lớp 12', value: 12 },
              { label: 'Lớp 11', value: 11 },
              { label: 'Lớp 10', value: 10 },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setSelectedGrade(item.value as Grade | 'all')}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg ${
                  selectedGrade === item.value 
                    ? 'bg-slate-800 dark:bg-orange-500 text-white' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-200">Thẻ {currentIndex + 1} / {deck.length}</span>
            <span>({progressPercent}%)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Thuộc phiên này: +{sessionMasteredCount}
            </span>
            <button
              onClick={handleShuffle}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Trộn ngẫu nhiên thẻ"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-orange-400 to-amber-500 transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* The 3D Interactive Flashcard */}
      <div 
        onClick={() => setIsFlipped(prev => !prev)}
        className="w-full min-h-[380px] sm:min-h-[420px] cursor-pointer perspective-1000 select-none"
      >
        <div 
          className={`relative w-full h-full min-h-[380px] sm:min-h-[420px] transition-transform duration-500 transform-style-preserve-3d ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* FRONT OF CARD */}
          <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-br from-white via-amber-50/30 to-orange-50/40 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 border-2 border-amber-200/90 dark:border-slate-700 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between transition-colors">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-extrabold shadow-2xs">
                  Lớp {currentFormula?.grade}
                </span>
                <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">
                  {currentFormula?.subject === 'algebra' ? '🔢 Đại số & Giải tích' : '📐 Hình học'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleFavorite();
                  }}
                  className="p-2 rounded-full hover:bg-amber-100/80 dark:hover:bg-slate-800 transition-colors"
                >
                  <Star className={`w-5 h-5 ${isCurrentFavorite ? 'fill-amber-400 text-amber-500' : 'text-slate-300 dark:text-slate-600'}`} />
                </button>
              </div>
            </div>

            {/* Center: Question / Formula Prompt */}
            <div className="text-center py-6 px-2 space-y-4">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 mb-2">
                <Sparkles className="w-8 h-8" />
              </div>
              <p className="text-xs uppercase tracking-widest font-extrabold text-orange-600 dark:text-orange-400">
                Hãy nhớ lại công thức:
              </p>
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight leading-snug">
                {currentFormula?.title}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                {currentFormula?.explanation}
              </p>
            </div>

            {/* Bottom hint */}
            <div className="text-center pt-4 border-t border-amber-100/80 dark:border-slate-800 flex items-center justify-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400">
              <RotateCw className="w-4 h-4 animate-spin-slow" />
              <span>Nhấn vào thẻ hoặc bấm Phím Cách để xem công thức & mẹo nhớ</span>
            </div>
          </div>

          {/* BACK OF CARD */}
          <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-white dark:bg-slate-900 border-2 border-orange-300 dark:border-orange-500/60 rounded-3xl p-6 sm:p-8 shadow-md flex flex-col justify-between overflow-y-auto transition-colors">
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Công Thức Chuẩn
              </span>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Lớp {currentFormula?.grade} • {currentFormula?.subject === 'algebra' ? 'Đại số' : 'Hình học'}
              </span>
            </div>

            {/* Center: Big Math Render */}
            <div className="my-auto py-4 space-y-4">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 text-center">
                {currentFormula?.title}
              </h3>

              {/* KaTeX Math Box */}
              <div className="bg-amber-50/70 dark:bg-slate-950 border border-amber-200/80 dark:border-slate-800 rounded-2xl p-4 text-center overflow-x-auto shadow-inner">
                {currentFormula && (
                  <MathView math={currentFormula.latex} block={true} className="text-slate-900 dark:text-slate-100 text-xl font-bold" />
                )}
              </div>

              {/* Conditions */}
              {currentFormula?.conditions && (
                <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                  <span className="font-bold text-slate-700 dark:text-slate-200">Điều kiện áp dụng: </span>
                  {currentFormula.conditions}
                </div>
              )}

              {/* Mnemonic Hint */}
              {currentFormula?.mnemonic && (
                <div className="bg-gradient-to-r from-amber-50 dark:from-amber-950/40 to-orange-50 dark:to-orange-950/30 border border-amber-200/90 dark:border-amber-800/60 rounded-2xl p-3 flex items-start gap-2.5">
                  <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-950 dark:text-amber-200 leading-relaxed">
                    <span className="font-extrabold text-amber-900 dark:text-amber-300">Mẹo nhớ thần tốc: </span>
                    {currentFormula.mnemonic}
                  </div>
                </div>
              )}

              {currentFormula?.example && (
                <div className="text-xs text-slate-600 dark:text-slate-300 italic bg-blue-50/50 dark:bg-blue-950/40 p-2 rounded-lg border border-blue-100 dark:border-blue-900/60">
                  <span className="font-bold not-italic text-blue-900 dark:text-blue-300">Ví dụ: </span>
                  {currentFormula.example}
                </div>
              )}
            </div>

            {/* Bottom hint */}
            <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
              Nhấn lại vào thẻ để lật về mặt trước
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <button
          onClick={handlePrev}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Thẻ trước
        </button>

        {/* Mastered / Review Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-center">
          <button
            onClick={handleMarkReview}
            className="flex-1 sm:flex-initial px-5 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <XCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            Cần ôn lại
          </button>

          <button
            onClick={handleMarkMastered}
            className="flex-1 sm:flex-initial px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            Đã thuộc (+15 XP)
          </button>
        </div>

        <button
          onClick={handleNext}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs transition-colors"
        >
          Thẻ tiếp <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Keyboard Shortcuts Guide */}
      <div className="text-center text-[11px] text-slate-400 dark:text-slate-500">
        Phím tắt: <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border dark:border-slate-700 dark:text-slate-300 rounded shadow-2xs">Phím Cách</kbd> để lật • <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border dark:border-slate-700 dark:text-slate-300 rounded shadow-2xs">←</kbd> Thẻ trước • <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border dark:border-slate-700 dark:text-slate-300 rounded shadow-2xs">→</kbd> Thẻ tiếp
      </div>
    </div>
  );
};
