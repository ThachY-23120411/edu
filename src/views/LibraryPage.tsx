'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  RotateCcw, 
  Clock, 
  Users, 
  Bookmark, 
  BookmarkCheck, 
  Headphones, 
  Play, 
  Check, 
  ChevronDown, 
  BookOpen, 
  FileText, 
  Award,
  Filter,
  CheckCircle2,
  X,
  Languages,
  TrendingUp,
  GraduationCap
} from 'lucide-react';
import { Exam } from '../types/exam';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface LibraryPageProps {
  onStartExam?: (examId: string) => void;
  initialCategory?: string;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  onStartExam,
  initialCategory,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryParam = searchParams?.get('category') || initialCategory || 'all';

  let appCtx: any = null;
  try {
    appCtx = useApp();
  } catch (e) {}

  const handleStartExam = (examId: string) => {
    if (appCtx?.setActiveExamId) appCtx.setActiveExamId(examId);
    if (onStartExam) onStartExam(examId);
    else router.push(`/exam/${examId}`);
  };

  const [examList, setExamList] = useState<Exam[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam);
  const [selectedSkill, setSelectedSkill] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'rating'>('popular');
  const [bookmarkedIds, setBookmarkedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api.exams.getAll().then((res) => {
      if (res?.items && res.items.length > 0) {
        const bms: Record<string, boolean> = {};
        const mapped: Exam[] = res.items.map((exam: any) => {
          if (exam.isBookmarked) bms[exam.id] = true;
          return {
            id: exam.id,
            category: exam.category_code || exam.category,
            categoryLabel: exam.category_label || exam.categoryLabel,
            title: exam.title,
            subtitle: exam.subtitle,
            subBadge: exam.sub_badge || exam.subBadge,
            badgeType: exam.badge_type || exam.badgeType,
            difficulty: exam.difficulty,
            difficultyLabel: exam.difficulty_label || exam.difficultyLabel,
            totalQuestions: exam.total_questions || exam.totalQuestions,
            durationMinutes: exam.duration_minutes || exam.durationMinutes,
            testTakersCount: exam.test_takers_count || exam.testTakersCount,
            rating: exam.rating,
            reviewCount: exam.review_count || exam.reviewCount,
            hasAudio: exam.has_audio !== undefined ? exam.has_audio : exam.hasAudio,
            audioDuration: exam.audio_duration || exam.audioDuration,
            hasVideoSolution: exam.has_video_solution !== undefined ? exam.has_video_solution : exam.hasVideoSolution,
            tags: exam.tags || [],
          };
        });
        setExamList(mapped);
        setBookmarkedIds((prev) => ({ ...prev, ...bms }));
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const toggleBookmark = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = !bookmarkedIds[id];
    setBookmarkedIds((prev) => ({ ...prev, [id]: nextState }));
    try {
      await api.exams.toggleBookmark(id, nextState);
    } catch (err) {}
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedSkill('all');
    setSelectedDifficulty('all');
    setSortBy('popular');
  };

  // Filter exams
  const filteredExams = examList.filter((exam) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        exam.title.toLowerCase().includes(q) ||
        (exam.subtitle && exam.subtitle.toLowerCase().includes(q)) ||
        exam.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }

    // Category
    if (selectedCategory !== 'all' && exam.category !== selectedCategory) {
      return false;
    }

    // Skill
    if (selectedSkill !== 'all') {
      if (selectedSkill === 'reading' && !exam.categoryLabel.toLowerCase().includes('reading')) {
        return false;
      }
      if (selectedSkill === 'listening' && !exam.categoryLabel.toLowerCase().includes('listening') && !exam.hasAudio) {
        return false;
      }
    }

    // Difficulty
    if (selectedDifficulty !== 'all') {
      if (selectedDifficulty === 'easy' && !exam.difficulty.includes('5.')) return false;
      if (selectedDifficulty === 'medium' && !exam.difficulty.includes('6.')) return false;
      if (selectedDifficulty === 'hard' && !exam.difficulty.includes('7.') && !exam.difficulty.includes('8.')) return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.totalQuestions - a.totalQuestions;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">Kho đề thi và bộ lọc</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Kho đề thi chuẩn khảo thí
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Lựa chọn từ ngân hàng đề thi chứng chỉ chuẩn quốc tế với giải thích phương pháp làm bài
              </p>
            </div>
            
            {/* Quick Stats Pill */}
            <div className="text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-xs flex items-center gap-3">
              <span>Đề thi có sẵn: <strong className="text-slate-900">{examList.length}</strong></span>
              <span className="text-slate-300">|</span>
              <span>Đã lưu: <strong className="text-slate-900">{Object.values(bookmarkedIds).filter(Boolean).length}</strong></span>
            </div>
          </div>
        </div>

        {/* 2-Column Standard Testing Catalog Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT SIDEBAR: FILTERS */}
          <aside className="lg:col-span-3 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Filter className="w-4 h-4 text-blue-900" />
                <span>Bộ lọc đề thi</span>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs text-slate-500 hover:text-blue-900 font-medium cursor-pointer"
              >
                Đặt lại
              </button>
            </div>

            {/* Keyword Search Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Từ khóa tìm kiếm
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cambridge 18, HSK 5..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-800 focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Certificate Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Hệ thống chứng chỉ
              </label>

              {/* All */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md text-left transition-colors cursor-pointer mb-2 ${
                  selectedCategory === 'all'
                    ? 'bg-blue-900 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <span>Tất cả chứng chỉ ({examList.length})</span>
                {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-white" />}
              </button>

              {/* Ngoại Ngữ Group */}
              <div className="mt-3">
                <div className="flex items-center gap-1.5 px-1 py-1 text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                  <Languages className="w-3 h-3 text-blue-700" />
                  <span>Khối Ngoại Ngữ</span>
                </div>
                <div className="space-y-1 mt-1 pl-1">
                  {[
                    { id: 'ielts', label: 'IELTS Academic & General' },
                    { id: 'hsk', label: 'HSK (Cấp độ 1 - 6)' },
                    { id: 'toeic', label: 'TOEIC ETS 4 Kỹ năng' },
                    { id: 'toefl', label: 'TOEFL iBT Academic' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCategory(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left transition-colors cursor-pointer ${
                        selectedCategory === item.id
                          ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {selectedCategory === item.id && <Check className="w-3.5 h-3.5 text-blue-900" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kinh Tế & Tài Chính Group */}
              <div className="mt-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 px-1 py-1 text-[11px] font-bold text-blue-900 uppercase tracking-wider">
                  <TrendingUp className="w-3 h-3 text-blue-700" />
                  <span>Khối Kinh Tế & Quản Trị</span>
                </div>
                <div className="space-y-1 mt-1 pl-1">
                  {[
                    { id: 'cfa', label: 'CFA (Chartered Financial Analyst)' },
                    { id: 'gmat', label: 'GMAT Focus Edition (MBA)' },
                    { id: 'acca', label: 'ACCA Financial Accounting' },
                    { id: 'gre', label: 'GRE General Test' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCategory(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left transition-colors cursor-pointer ${
                        selectedCategory === item.id
                          ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {selectedCategory === item.id && <Check className="w-3.5 h-3.5 text-blue-900" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tuyển Sinh Group */}
              <div className="mt-3 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 px-1 py-1 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <GraduationCap className="w-3 h-3 text-slate-500" />
                  <span>Khối Tuyển Sinh</span>
                </div>
                <div className="space-y-1 mt-1 pl-1">
                  {[
                    { id: 'sat', label: 'Digital SAT (College Board)' },
                    { id: 'thptqg', label: 'THPT Quốc Gia 9.0+' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedCategory(item.id)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs rounded-md text-left transition-colors cursor-pointer ${
                        selectedCategory === item.id
                          ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{item.label}</span>
                      {selectedCategory === item.id && <Check className="w-3.5 h-3.5 text-blue-900" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Skill Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Kỹ năng thi
              </label>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'Tất cả kỹ năng' },
                  { id: 'reading', label: 'Đọc hiểu (Reading)' },
                  { id: 'listening', label: 'Nghe hiểu (Listening)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedSkill(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md text-left transition-colors cursor-pointer ${
                      selectedSkill === item.id
                        ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedSkill === item.id && <Check className="w-3.5 h-3.5 text-blue-800" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level Filter */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-2">
                Độ khó / Target
              </label>
              <div className="space-y-1">
                {[
                  { id: 'all', label: 'Mọi cấp độ' },
                  { id: 'easy', label: 'Cơ bản (Band 5.0 - 6.0)' },
                  { id: 'medium', label: 'Trung cấp (Band 6.5 - 7.0)' },
                  { id: 'hard', label: 'Nâng cao (Band 7.5 - 8.5+)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedDifficulty(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-md text-left transition-colors cursor-pointer ${
                      selectedDifficulty === item.id
                        ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedDifficulty === item.id && <Check className="w-3.5 h-3.5 text-blue-800" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* RIGHT MAIN LISTING */}
          <main className="lg:col-span-9 space-y-4">
            {/* Controls Bar: Results count & Sort */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-slate-600 font-medium">
                Tìm thấy <strong className="text-slate-900">{filteredExams.length}</strong> bài thi phù hợp
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Sắp xếp:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-50 border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-800 cursor-pointer"
                >
                  <option value="popular">Lượt thi nhiều nhất</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="newest">Đề thi mới nhất</option>
                </select>
              </div>
            </div>

            {/* Empty state */}
            {filteredExams.length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">Không tìm thấy đề thi phù hợp</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Hãy thử điều chỉnh lại từ khóa tìm kiếm hoặc bấm đặt lại bộ lọc để xem toàn bộ đề thi.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-blue-900 text-white text-xs font-semibold rounded-md hover:bg-blue-800 transition-colors cursor-pointer"
                >
                  Đặt lại toàn bộ bộ lọc
                </button>
              </div>
            )}

            {/* Test Cards List */}
            <div className="space-y-3">
              {filteredExams.map((exam) => {
                const isBookmarked = bookmarkedIds[exam.id];

                return (
                  <div
                    key={exam.id}
                    className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs p-5 sm:p-6 transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: Test details */}
                      <div className="space-y-2 flex-1">
                        {/* Meta header */}
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                            {exam.categoryLabel}
                          </span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-600 font-medium">{exam.difficulty}</span>
                          {exam.hasAudio && (
                            <>
                              <span className="text-slate-400">·</span>
                              <span className="text-emerald-700 flex items-center gap-1 font-medium">
                                <Headphones className="w-3.5 h-3.5" /> Có Audio chuẩn
                              </span>
                            </>
                          )}
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 font-medium">{exam.difficultyLabel}</span>
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-bold text-slate-900">
                          {exam.title}
                        </h2>

                        {/* Subtitle */}
                        {exam.subtitle && (
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {exam.subtitle}
                          </p>
                        )}

                        {/* Passages Summary or Tags */}
                        {exam.tags && exam.tags.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            {exam.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Specifications */}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100 mt-2">
                          <div className="flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-slate-400" />
                            <span>{exam.totalQuestions} câu hỏi</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{exam.durationMinutes} phút</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{exam.testTakersCount} lượt làm</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-slate-400" />
                            <span>Đánh giá: {exam.rating}/5.0</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-col sm:items-end justify-between self-stretch gap-4 shrink-0">
                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => toggleBookmark(exam.id, e)}
                          className={`p-2 rounded-md transition-colors cursor-pointer self-end ${
                            isBookmarked
                              ? 'text-blue-800 bg-blue-50'
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                          title={isBookmarked ? 'Bỏ lưu đề thi' : 'Lưu đề thi'}
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-4 h-4 fill-blue-800" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>

                        {/* Start buttons */}
                        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleStartExam(exam.id)}
                            className="w-full sm:w-auto px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Làm bài thi tính giờ</span>
                          </button>
                          <button
                            onClick={() => handleStartExam(exam.id)}
                            className="w-full sm:w-auto px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-300 transition-colors flex items-center justify-center cursor-pointer"
                          >
                            <span>Luyện tập</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
