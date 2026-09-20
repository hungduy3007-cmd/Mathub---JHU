import React, { useState } from 'react';
import { ForumPost, ForumReply, UserProfile, Grade, SubjectType } from '../types';
import { loadForumPosts, saveForumPosts } from '../utils/storage';
import { MathView } from './MathView';
import { 
  MessageSquare, ThumbsUp, Send, PlusCircle, 
  Tag, Filter, CheckCircle, Sparkles, HelpCircle 
} from 'lucide-react';

interface ForumViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const ForumView: React.FC<ForumViewProps> = ({
  userProfile,
  onUpdateProfile,
}) => {
  const [posts, setPosts] = useState<ForumPost[]>(() => loadForumPosts());
  const [selectedGrade, setSelectedGrade] = useState<Grade | 'all'>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // New post form
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newLatex, setNewLatex] = useState('');
  const [newGrade, setNewGrade] = useState<Grade>(12);
  const [newSubject, setNewSubject] = useState<SubjectType>('algebra');
  const [newTag, setNewTag] = useState('Giải tích');

  // Reply state
  const [activeReplyPostId, setActiveReplyPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [replyLatex, setReplyLatex] = useState('');

  const tags = ['Tất cả', 'Tích phân', 'Hình Oxyz', 'Lượng giác', 'Đạo hàm', 'Thể tích chóp', 'Vectơ', 'Mẹo nhớ'];

  // Filter posts
  const filteredPosts = posts.filter(post => {
    if (selectedGrade !== 'all' && post.grade !== selectedGrade) return false;
    if (selectedTag !== 'all' && selectedTag !== 'Tất cả' && post.topicTag !== selectedTag) return false;
    return true;
  });

  const handleLikePost = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likes: isLiked ? p.likes + 1 : p.likes - 1,
        };
      }
      return p;
    });
    setPosts(updated);
    saveForumPosts(updated);
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: ForumPost = {
      id: `post-${Date.now()}`,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      grade: newGrade,
      subject: newSubject,
      topicTag: newTag,
      title: newTitle.trim(),
      content: newContent.trim(),
      latexSnippet: newLatex.trim() || undefined,
      createdAt: 'Vừa xong',
      likes: 1,
      isLiked: true,
      replies: [],
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    saveForumPosts(updated);

    // Reward XP for community contribution
    const newXp = userProfile.xp + 25;
    onUpdateProfile({
      ...userProfile,
      xp: newXp,
      level: Math.floor(newXp / 150) + 1,
    });

    // Reset form
    setNewTitle('');
    setNewContent('');
    setNewLatex('');
    setIsCreatingPost(false);
  };

  const handleAddReply = (postId: string) => {
    if (!replyContent.trim()) return;

    const newReply: ForumReply = {
      id: `reply-${Date.now()}`,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      content: replyContent.trim(),
      latexSnippet: replyLatex.trim() || undefined,
      createdAt: 'Vừa xong',
      likes: 0,
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          replies: [...p.replies, newReply],
        };
      }
      return p;
    });

    setPosts(updated);
    saveForumPosts(updated);

    // Reward XP
    const newXp = userProfile.xp + 15;
    onUpdateProfile({
      ...userProfile,
      xp: newXp,
      level: Math.floor(newXp / 150) + 1,
    });

    setReplyContent('');
    setReplyLatex('');
    setActiveReplyPostId(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Cộng Đồng Học Toán
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Diễn Đàn Trao Đổi Bài Tập & Mẹo Nhớ
            </h1>
            <p className="text-white/90 text-sm max-w-xl">
              Nơi giao lưu, giải đáp thắc mắc bài tập khó, chia sẻ bài thơ và bí quyết ghi nhớ công thức toán học cùng bạn bè.
            </p>
          </div>
          <button
            onClick={() => setIsCreatingPost(true)}
            className="px-5 py-3 rounded-2xl bg-white text-indigo-700 hover:bg-indigo-50 font-black text-xs shadow-md flex items-center gap-2 shrink-0 transition-all"
          >
            <PlusCircle className="w-4 h-4" /> Đặt câu hỏi mới (+25 XP)
          </button>
        </div>
      </div>

      {/* Filter and Tags */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-3 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Grade filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Lớp:
            </span>
            {[
              { label: 'Tất cả lớp', value: 'all' },
              { label: 'Lớp 12', value: 12 },
              { label: 'Lớp 11', value: 11 },
              { label: 'Lớp 10', value: 10 },
            ].map(item => (
              <button
                key={item.label}
                onClick={() => setSelectedGrade(item.value as Grade | 'all')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  selectedGrade === item.value ? 'bg-indigo-600 text-white shadow-2xs' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Tag filter pills */}
          <div className="flex items-center gap-1 overflow-x-auto">
            <Tag className="w-3.5 h-3.5 text-slate-400 mr-1" />
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag === 'Tất cả' ? 'all' : tag)}
                className={`px-2.5 py-0.5 text-xs rounded-full font-medium transition-all ${
                  (selectedTag === 'all' && tag === 'Tất cả') || selectedTag === tag
                    ? 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 font-bold'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Create New Post Modal */}
      {isCreatingPost && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" /> Đăng câu hỏi bài tập / chia sẻ mẹo
              </h3>
              <button
                onClick={() => setIsCreatingPost(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Khối Lớp</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value) as Grade)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-slate-100"
                  >
                    <option value={12}>Lớp 12</option>
                    <option value={11}>Lớp 11</option>
                    <option value={10}>Lớp 10</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Chủ đề tag</label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="VD: Tích phân, Oxyz, Lượng giác"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-medium text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Tiêu đề câu hỏi / chia sẻ</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="VD: Mẹo bấm máy tính tìm nhanh nghiệm phức..."
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-semibold text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Nội dung chi tiết</label>
                <textarea
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  rows={4}
                  placeholder="Mô tả đề bài hoặc kinh nghiệm của bạn..."
                  required
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 font-normal text-slate-800 dark:text-slate-100 leading-relaxed focus:ring-2 focus:ring-orange-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Công thức LaTeX (không bắt buộc):
                </label>
                <input
                  type="text"
                  value={newLatex}
                  onChange={(e) => setNewLatex(e.target.value)}
                  placeholder="VD: \int_0^1 x^2 dx hoặc \sin^2 x + \cos^2 x = 1"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 font-mono text-slate-800 dark:text-slate-100"
                />
                {newLatex && (
                  <div className="mt-2 p-2.5 bg-amber-50 dark:bg-slate-950 rounded-xl border border-amber-200 dark:border-slate-800 text-center">
                    <p className="text-[10px] text-amber-800 dark:text-amber-300 font-bold mb-1">Xem trước công thức:</p>
                    <MathView math={newLatex} block={true} className="text-slate-900 dark:text-slate-100" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreatingPost(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" /> Đăng câu hỏi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-500 dark:text-slate-400">
            Chưa có bài viết nào phù hợp bộ lọc này. Hãy là người đầu tiên đặt câu hỏi!
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-4 hover:shadow-md transition-all"
            >
              {/* Post Author & Tag Header */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-xl flex items-center justify-center shadow-2xs">
                    {post.authorAvatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{post.authorName}</h4>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500">{post.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
                    Lớp {post.grade}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                    #{post.topicTag}
                  </span>
                </div>
              </div>

              {/* Title & Content */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 leading-snug">
                  {post.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>

                {/* Optional LaTeX Box */}
                {post.latexSnippet && (
                  <div className="bg-amber-50/70 dark:bg-slate-950 border border-amber-200/90 dark:border-slate-800 rounded-2xl p-3 my-2 text-center overflow-x-auto">
                    <MathView math={post.latexSnippet} block={true} className="text-slate-900 dark:text-slate-100 font-bold" />
                  </div>
                )}
              </div>

              {/* Action Bar (Like, Reply count, Reply button) */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className={`flex items-center gap-1.5 font-bold transition-colors ${
                      post.isLiked ? 'text-rose-600' : 'text-slate-500 dark:text-slate-400 hover:text-rose-600'
                    }`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'fill-rose-500' : ''}`} />
                    <span>{post.likes} Hữu ích</span>
                  </button>

                  <span className="text-slate-400 dark:text-slate-500 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5" />
                    {post.replies.length} phản hồi
                  </span>
                </div>

                <button
                  onClick={() => setActiveReplyPostId(activeReplyPostId === post.id ? null : post.id)}
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-bold text-xs transition-colors"
                >
                  {activeReplyPostId === post.id ? 'Đóng phản hồi' : 'Viết lời giải / phản hồi'}
                </button>
              </div>

              {/* Reply Input Form */}
              {activeReplyPostId === post.id && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-2.5 text-xs">
                  <p className="font-bold text-slate-700 dark:text-slate-300">Trả lời cho bạn học:</p>
                  <textarea
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    rows={2}
                    placeholder="Nhập lời giải hoặc góp ý của bạn..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-1 focus:ring-indigo-400"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={replyLatex}
                      onChange={(e) => setReplyLatex(e.target.value)}
                      placeholder="Mã LaTeX (tùy chọn): VD x = \frac{-b}{2a}"
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-xl px-2.5 py-1.5 font-mono text-[11px]"
                    />
                    <button
                      onClick={() => handleAddReply(post.id)}
                      className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Send className="w-3 h-3" /> Gửi
                    </button>
                  </div>
                </div>
              )}

              {/* Replies List */}
              {post.replies.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-50 dark:border-slate-800">
                  {post.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/80 flex items-start gap-2.5 text-xs"
                    >
                      <div className="w-7 h-7 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-sm flex items-center justify-center shrink-0">
                        {reply.authorAvatar}
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-100">{reply.authorName}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500">{reply.createdAt}</span>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{reply.content}</p>
                        {reply.latexSnippet && (
                          <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-700 my-1 text-center">
                            <MathView math={reply.latexSnippet} block={true} className="text-slate-900 dark:text-slate-100" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
