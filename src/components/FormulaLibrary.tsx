import React, { useState, useMemo } from 'react';
import { Formula, Grade, SubjectType, UserProfile } from '../types';
import { TOPICS, FORMULAS } from '../data/mathCurriculum';
import { MathView } from './MathView';
import { 
  BookOpen, Star, CheckCircle2, BookmarkPlus, 
  Lightbulb, Copy, Check, Play, Filter, Sparkles 
} from 'lucide-react';

interface FormulaLibraryProps {
  userProfile: UserProfile;
  onToggleFavorite: (id: string) => void;
  onToggleMastered: (id: string) => void;
  onStartPractice: (formula: Formula) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const FormulaLibrary: React.FC<FormulaLibraryProps> = ({
  userProfile,
  onToggleFavorite,
  onToggleMastered,
  onStartPractice,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'all'>('all');
  const [selectedSubject, setSelectedSubject] = useState<SubjectType | 'all'>('all');
  const [selectedTopicId, setSelectedTopicId] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'favorites' | 'mastered' | 'review'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedExamples, setExpandedExamples] = useState<Record<string, boolean>>({});

  // Filter topics based on grade & subject
  const availableTopics = useMemo(() => {
    return TOPICS.filter(topic => {
      if (selectedGrade !== 'all' && topic.grade !== selectedGrade) return false;
      if (selectedSubject !== 'all' && topic.subject !== selectedSubject) return false;
      return true;
    });
  }, [selectedGrade, selectedSubject]);

  // Filter formulas
  const filteredFormulas = useMemo(() => {
    return FORMULAS.filter(formula => {
      // Grade filter
      if (selectedGrade !== 'all' && formula.grade !== selectedGrade) return false;
      // Subject filter
      if (selectedSubject !== 'all' && formula.subject !== selectedSubject) return false;
      // Topic filter
      if (selectedTopicId !== 'all' && formula.topicId !== selectedTopicId) return false;

      // Status filter
      if (filterStatus === 'favorites' && !userProfile.favoriteFormulaIds.includes(formula.id)) return false;
      if (filterStatus === 'mastered' && !userProfile.masteredFormulaIds.includes(formula.id)) return false;
      if (filterStatus === 'review' && !userProfile.reviewedFormulaIds.includes(formula.id)) return false;

      // Search query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase().trim();
        const matchTitle = formula.title.toLowerCase().includes(query);
        const matchExplanation = formula.explanation.toLowerCase().includes(query);
        const matchLatex = formula.latex.toLowerCase().includes(query);
        const matchMnemonic = formula.mnemonic?.toLowerCase().includes(query);
        const matchTags = formula.tags.some(tag => tag.toLowerCase().includes(query));
        return matchTitle || matchExplanation || matchLatex || matchMnemonic || matchTags;
      }

      return true;
    });
  }, [selectedGrade, selectedSubject, selectedTopicId, filterStatus, searchQuery, userProfile]);

  const handleCopyLatex = (formula: Formula) => {
    navigator.clipboard.writeText(formula.latex);
    setCopiedId(formula.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExample = (id: string) => {
    setExpandedExamples(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Summary */}
      <div className="bg-gradient-to-r from-amber-100/80 via-orange-50 to-indigo-50/70 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 border border-amber-200/80 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-orange-500 text-white shadow-xs">
                <BookOpen className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                Kho Công Thức Toán THPT 10 - 11 - 12
              </h1>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Tổng hợp toàn bộ công thức Hình học & Đại số / Giải tích chuẩn chương trình GDPT, kèm mẹo nhớ nhanh và bài tập trắc nghiệm.
            </p>
          </div>

          {/* Quick Stat Chips */}
          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Đã thuộc</p>
              <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                {userProfile.masteredFormulaIds.length}/{FORMULAS.length}
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-2xs text-center">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Yêu thích</p>
              <p className="text-lg font-extrabold text-amber-500 dark:text-amber-400">
                {userProfile.favoriteFormulaIds.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3.5 transition-colors">
        {/* Row 1: Grade and Subject Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Grade Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Khối:
            </span>
            {[
              { label: 'Tất cả lớp', value: 'all' },
              { label: 'Lớp 12', value: 12 },
              { label: 'Lớp 11', value: 11 },
              { label: 'Lớp 10', value: 10 },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => {
                  setSelectedGrade(item.value as Grade | 'all');
                  setSelectedTopicId('all');
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedGrade === item.value
                    ? 'bg-slate-800 dark:bg-orange-500 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Subject Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">Phân môn:</span>
            {[
              { label: 'Tất cả môn', value: 'all' },
              { label: '🔢 Đại Số & Giải Tích', value: 'algebra' },
              { label: '📐 Hình Học', value: 'geometry' },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => {
                  setSelectedSubject(item.value as SubjectType | 'all');
                  setSelectedTopicId('all');
                }}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedSubject === item.value
                    ? 'bg-orange-500 text-white shadow-xs'
                    : 'bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 hover:bg-orange-100 dark:hover:bg-orange-900/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Topic Chips and Status Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          {/* Topic Dropdown / Selector */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">Chuyên đề:</span>
            <select
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
              className="text-xs font-semibold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-1 focus:ring-orange-400"
            >
              <option value="all">Tất cả chuyên đề ({availableTopics.length})</option>
              {availableTopics.map(t => (
                <option key={t.id} value={t.id}>
                  [Lớp {t.grade} - {t.subject === 'algebra' ? 'Số' : 'Hình'}] {t.name}
                </option>
              ))}
            </select>
          </div>

          {/* Quick status filters */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                filterStatus === 'all' 
                  ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Tất cả ({FORMULAS.length})
            </button>
            <button
              onClick={() => setFilterStatus('mastered')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 ${
                filterStatus === 'mastered' 
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Đã thuộc ({userProfile.masteredFormulaIds.length})
            </button>
            <button
              onClick={() => setFilterStatus('favorites')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md flex items-center gap-1 ${
                filterStatus === 'favorites' 
                  ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-bold' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-amber-700 dark:hover:text-amber-400'
              }`}
            >
              <Star className="w-3.5 h-3.5" /> Đã lưu ({userProfile.favoriteFormulaIds.length})
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Info & Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <span>Tìm thấy <strong className="text-slate-700 dark:text-slate-200">{filteredFormulas.length}</strong> công thức phù hợp</span>
        {(selectedGrade !== 'all' || selectedSubject !== 'all' || selectedTopicId !== 'all' || filterStatus !== 'all' || searchQuery) && (
          <button
            onClick={() => {
              setSelectedGrade('all');
              setSelectedSubject('all');
              setSelectedTopicId('all');
              setFilterStatus('all');
              setSearchQuery('');
            }}
            className="text-orange-600 dark:text-orange-400 hover:underline font-semibold"
          >
            Đặt lại bộ lọc
          </button>
        )}
      </div>

      {/* Formula Cards Grid */}
      {filteredFormulas.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 mx-auto flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">Không tìm thấy công thức nào</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Thử tìm kiếm với từ khóa khác như "đạo hàm", "mặt cầu", "lượng giác", hoặc chọn lại bộ lọc khối lớp.
          </p>
          <button
            onClick={() => {
              setSelectedGrade('all');
              setSelectedSubject('all');
              setSelectedTopicId('all');
              setFilterStatus('all');
              setSearchQuery('');
            }}
            className="px-4 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-orange-600 transition-colors"
          >
            Xem tất cả công thức
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredFormulas.map((formula) => {
            const isMastered = userProfile.masteredFormulaIds.includes(formula.id);
            const isFavorite = userProfile.favoriteFormulaIds.includes(formula.id);
            const isCopied = copiedId === formula.id;
            const isExampleOpen = expandedExamples[formula.id];

            return (
              <div
                key={formula.id}
                className={`bg-white dark:bg-slate-900 border rounded-2xl p-4 sm:p-5 shadow-xs transition-all hover:shadow-md dark:hover:border-slate-700 flex flex-col justify-between ${
                  isMastered 
                    ? 'border-emerald-200/90 dark:border-emerald-800/80 ring-1 ring-emerald-100 dark:ring-emerald-950/40' 
                    : 'border-slate-200/90 dark:border-slate-800'
                }`}
              >
                {/* Card Header */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        formula.grade === 12 
                          ? 'bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300' 
                          : formula.grade === 11 
                            ? 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300' 
                            : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                      }`}>
                        Lớp {formula.grade}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {formula.subject === 'algebra' ? 'Đại số & Giải tích' : 'Hình học'}
                      </span>
                      {isMastered && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500 text-white flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> Đã thuộc
                        </span>
                      )}
                    </div>

                    {/* Top Action Buttons */}
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onToggleFavorite(formula.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isFavorite 
                            ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40' 
                            : 'text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                        title={isFavorite ? 'Bỏ lưu' : 'Lưu công thức'}
                      >
                        <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-400' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleCopyLatex(formula)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        title="Copy mã LaTeX"
                      >
                        {isCopied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 tracking-tight mb-2.5">
                    {formula.title}
                  </h3>

                  {/* Math Display Box */}
                  <div className="bg-amber-50/40 dark:bg-slate-950 border border-amber-100/90 dark:border-slate-800 rounded-xl p-3 my-2 text-center overflow-x-auto shadow-2xs">
                    <MathView math={formula.latex} block={true} className="text-slate-900 dark:text-slate-100 font-semibold" />
                  </div>

                  {/* Explanation & Conditions */}
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
                    {formula.explanation}
                  </p>

                  {formula.conditions && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium italic mt-1">
                      <span className="font-semibold text-slate-600 dark:text-slate-300">Điều kiện: </span>
                      {formula.conditions}
                    </p>
                  )}

                  {/* Mnemonic Hint / Thần chú nhớ nhanh */}
                  {formula.mnemonic && (
                    <div className="mt-3 bg-gradient-to-r from-amber-50 dark:from-amber-950/40 to-orange-50 dark:to-orange-950/30 border border-amber-200/60 dark:border-amber-800/60 rounded-xl p-2.5 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <div className="text-xs text-amber-900 dark:text-amber-200 leading-snug">
                        <span className="font-bold text-amber-800 dark:text-amber-300">Mẹo nhớ thần tốc: </span>
                        {formula.mnemonic}
                      </div>
                    </div>
                  )}

                  {/* Example if exists */}
                  {formula.example && (
                    <div className="mt-2 text-xs">
                      <button
                        onClick={() => toggleExample(formula.id)}
                        className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1 text-[11px]"
                      >
                        {isExampleOpen ? '▲ Thu gọn ví dụ' : '▼ Xem ví dụ áp dụng'}
                      </button>
                      {isExampleOpen && (
                        <div className="mt-1.5 p-2 bg-indigo-50/50 dark:bg-indigo-950/40 rounded-lg border border-indigo-100 dark:border-indigo-900/60 text-slate-700 dark:text-slate-300 text-xs">
                          {formula.example}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onToggleMastered(formula.id)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                      isMastered
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isMastered ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`} />
                    {isMastered ? 'Đã thuộc (+15 XP)' : 'Đánh dấu đã thuộc'}
                  </button>

                  <button
                    onClick={() => onStartPractice(formula)}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-600 text-white flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    Luyện Flashcard
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
