'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Users, 
  BookOpen, 
  Play, 
  RotateCcw, 
  BarChart3, 
  Headphones, 
  FileCheck2, 
  Award, 
  ChevronRight,
  ShieldCheck,
  Compass,
  TrendingUp,
  FileText,
  Languages,
  Check,
  Sparkles,
  Calculator,
  GraduationCap
} from 'lucide-react';
import { UniversityLogos } from '../components/UniversityLogos';
import { api } from '../services/api';

interface HomePageProps {
  onStartExam?: (examId: string) => void;
  onViewResult?: (examId?: string) => void;
  onNavigateToLibrary?: (category?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartExam,
  onViewResult,
  onNavigateToLibrary,
}) => {
  const router = useRouter();
  let appCtx: any = null;
  try {
    appCtx = useApp();
  } catch (e) {}

  const [examList, setExamList] = useState<any[]>([]);
  const [recentAttempt, setRecentAttempt] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');

  useEffect(() => {
    // 1. Load exams from BE
    api.exams.getAll().then((res) => {
      if (res?.items && res.items.length > 0) {
        const mapped = res.items.map((exam: any) => ({
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
          isBookmarked: exam.isBookmarked || false,
        }));
        setExamList(mapped);
      }
    }).catch(() => {});

    // 2. Load recent attempts from BE
    api.attempts.getRecent().then((list) => {
      if (Array.isArray(list) && list.length > 0) {
        setRecentAttempt(list[0]);
      }
    }).catch(() => {});
  }, []);

  const handleStartExam = (examId: string = 'ielts-cam-18-test-3') => {
    if (appCtx?.setActiveExamId) appCtx.setActiveExamId(examId);
    if (onStartExam) onStartExam(examId);
    else router.push(`/exam/${examId}`);
  };

  const handleViewResult = (examId?: string) => {
    if (onViewResult) onViewResult(examId);
    else router.push('/result');
  };

  const handleNavigateToLibrary = (category?: string) => {
    if (onNavigateToLibrary) onNavigateToLibrary(category);
    else router.push(category && category !== 'all' ? `/library?category=${category}` : '/library');
  };

  const categoryTabs = [
    { id: 'all', label: 'Tất cả đề thi' },
    { id: 'foreign-language', label: 'Ngoại ngữ (IELTS, HSK, TOEIC)' },
    { id: 'economics', label: 'Kinh tế (CFA, GMAT, ACCA)' },
    { id: 'ielts', label: 'IELTS Academic' },
    { id: 'cfa', label: 'CFA Institute' },
    { id: 'hsk', label: 'HSK Hanban' },
    { id: 'toeic', label: 'TOEIC ETS' },
  ];

  // Filter exams for featured table/list
  const featuredExams = examList.filter((exam) => {
    if (selectedCategoryTab === 'foreign-language') {
      if (!['ielts', 'hsk', 'toeic', 'toefl'].includes(exam.category)) return false;
    } else if (selectedCategoryTab === 'economics') {
      if (!['cfa', 'gmat', 'acca', 'gre'].includes(exam.category)) return false;
    } else if (selectedCategoryTab !== 'all' && exam.category !== selectedCategoryTab) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        exam.title.toLowerCase().includes(q) ||
        exam.categoryLabel.toLowerCase().includes(q) ||
        exam.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. HERO SECTION - Clean, High-Trust Corporate Academic Style */}
      <section className="bg-white border-b border-slate-200 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-100 text-slate-800 text-xs font-semibold mb-4 border border-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-900" />
              <span>Ngân hàng đề thi chuẩn khảo thí 2024 - 2026</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Luyện thi chứng chỉ tiêu chuẩn ngành & quốc tế
            </h1>
            
            <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
              Mô phỏng chính xác định dạng đề thi thực tế <strong className="text-slate-900">IELTS, HSK, TOEIC</strong> (Ngoại ngữ) và <strong className="text-slate-900">CFA, GMAT, ACCA</strong> (Kinh tế & Tài chính). Rèn luyện áp lực thời gian, chấm điểm tự động và phân tích bẫy đề thi chi tiết.
            </p>

            {/* Instant Search Bar */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm: Cambridge 18, CFA Level 1, GMAT Focus, HSK 5, TOEIC..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>
              <button
                onClick={() => handleNavigateToLibrary(selectedCategoryTab === 'all' ? undefined : selectedCategoryTab)}
                className="px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white font-semibold text-sm rounded-lg shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Xem kho đề thi</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Filter Chips */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 font-medium">Tìm nhanh:</span>
              {[
                { label: 'IELTS Cambridge 18', cat: 'ielts' },
                { label: 'CFA Level 1 Ethics', cat: 'cfa' },
                { label: 'GMAT Focus 2024', cat: 'gmat' },
                { label: 'HSK 5 Chuẩn Hanban', cat: 'hsk' },
                { label: 'TOEIC ETS Full Test', cat: 'toeic' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => {
                    setSearchQuery(chip.label);
                    handleNavigateToLibrary(chip.cat);
                  }}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-md transition-colors cursor-pointer border border-slate-200"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. UNIVERSITY LOGOS SECTION - AS EXPLICITLY REQUESTED */}
      <UniversityLogos />

      {/* 3. RECENT ACTIVITY & CANDIDATE SUMMARY BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {recentAttempt ? (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Recent In-Progress Test */}
            <div className="md:col-span-7 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-blue-900 uppercase tracking-wider">
                    {recentAttempt.status === 'in_progress' ? 'Đang làm dở' : 'Bài thi gần nhất'}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">{recentAttempt.category_label || recentAttempt.category || 'Luyện thi'}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {recentAttempt.exam_title || recentAttempt.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {recentAttempt.status === 'in_progress'
                    ? `Tiến độ: Đã trả lời ${recentAttempt.answered_questions || 0}/${recentAttempt.total_questions || 40} câu hỏi`
                    : `Điểm số đạt được: ${recentAttempt.total_score || 'Hoàn thành'}`}
                </p>
              </div>
            </div>

            {/* Quick Action Button */}
            <div className="md:col-span-5 flex flex-wrap items-center justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                onClick={() => handleStartExam(recentAttempt.exam_id)}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Tiếp tục làm bài</span>
              </button>
              <button
                onClick={() => handleViewResult(recentAttempt.id)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-md border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Xem kết quả</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6 text-blue-900" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wider">
                    Sẵn sàng thi thử
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="text-xs text-slate-500">Khảo thí thông minh EduTest Pro</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  Bắt đầu bài kiểm tra năng lực đầu tiên của bạn
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Chọn đề thi chuẩn hóa từ Kho đề thi để đánh giá trình độ hiện tại, rèn luyện áp lực thời gian và xây dựng lộ trình cải thiện điểm số.
                </p>
              </div>
            </div>
            <div className="md:col-span-4 flex items-center justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
              <button
                onClick={() => handleNavigateToLibrary()}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <BookOpen className="w-4 h-4" />
                <span>Khám phá kho đề thi</span>
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 4. CERTIFICATION CATEGORY TRACKS - Screenshot 2 Practice Aptitude Tests Style */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold text-blue-900 tracking-wider bg-blue-50 px-2.5 py-1 rounded">
            Lộ trình khảo thí chuyên biệt
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
            Chọn hệ thống chứng chỉ bạn đang ôn luyện
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Được phân loại bài bản theo hai khối trọng tâm: Ngoại ngữ quốc tế và Kinh tế - Tài chính - Quản trị
          </p>
        </div>

        {/* Group A: NGOẠI NGỮ (Foreign Languages) */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <Languages className="w-5 h-5 text-blue-900" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide">
              1. Khối Chứng Chỉ Ngoại Ngữ
            </h3>
            <span className="text-xs text-slate-500 font-medium">(IELTS, HSK, TOEIC, TOEFL)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card IELTS */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-900 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-900 border border-blue-100">
                    Cambridge Standard
                  </span>
                  <span className="text-xs text-slate-500">16 Đề thi</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">IELTS Academic</h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  Luyện đề Reading & Listening bám sát Cambridge 16-19, chấm band điểm và phân tích bẫy từ vựng chi tiết.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span>Target: 6.5 - 8.5+</span>
                  <span className="font-semibold text-slate-900">★ 4.9 (1.2k)</span>
                </div>
              </div>
              <button
                onClick={() => handleNavigateToLibrary('ielts')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-800 text-xs font-semibold rounded-md transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Vào luyện thi IELTS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card HSK */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-amber-600 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-100">
                    Hanban Official
                  </span>
                  <span className="text-xs text-slate-500">14 Đề thi</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">HSK (Cấp độ 1 - 6)</h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  Đề thi tiếng Trung chuẩn Hanban kèm Audio giọng Bắc Kinh, dịch nghĩa song ngữ và giải thích ngữ pháp.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span>HSK 4, 5, 6 & HSKK</span>
                  <span className="font-semibold text-slate-900">★ 4.85 (845)</span>
                </div>
              </div>
              <button
                onClick={() => handleNavigateToLibrary('hsk')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-amber-600 hover:text-white text-slate-800 text-xs font-semibold rounded-md transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Vào luyện thi HSK</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card TOEIC */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-emerald-600 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-100">
                    ETS Chuẩn 2024
                  </span>
                  <span className="text-xs text-slate-500">20 Đề thi</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">TOEIC 4 Kỹ Năng</h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  Rèn tốc độ xử lý Part 5, 6, 7 văn bản hợp đồng thương mại và luyện nghe đa ngữ điệu Anh-Mỹ-Úc.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span>Target: 750 - 990</span>
                  <span className="font-semibold text-slate-900">★ 4.9 (1.9k)</span>
                </div>
              </div>
              <button
                onClick={() => handleNavigateToLibrary('toeic')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-emerald-700 hover:text-white text-slate-800 text-xs font-semibold rounded-md transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Vào luyện thi TOEIC</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card TOEFL */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-600 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-900 border border-indigo-100">
                    ETS iBT
                  </span>
                  <span className="text-xs text-slate-500">8 Đề thi</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">TOEFL iBT Academic</h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  Mô phỏng bài thi khảo thí du học học thuật Bắc Mỹ với bài đọc chuyên ngành và kỹ năng tổng hợp.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span>Target: 95 - 110+</span>
                  <span className="font-semibold text-slate-900">★ 4.8 (510)</span>
                </div>
              </div>
              <button
                onClick={() => handleNavigateToLibrary('toefl')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-indigo-700 hover:text-white text-slate-800 text-xs font-semibold rounded-md transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Vào luyện thi TOEFL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Group B: KINH TẾ (Economics, Finance & Management) */}
        <div>
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-200">
            <TrendingUp className="w-5 h-5 text-blue-900" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900 uppercase tracking-wide">
              2. Khối Chứng Chỉ Kinh Tế & Tài Chính
            </h3>
            <span className="text-xs text-slate-500 font-medium">(CFA, GMAT, ACCA, GRE)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card CFA */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-900 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-900 text-white">
                    CFA Institute
                  </span>
                  <span className="text-xs text-slate-500">12 Đề thi</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">CFA Level 1, 2, 3</h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  Bộ câu hỏi trắc nghiệm Ethics, Quantitative Methods, Financial Statement Analysis và Portfolio Management.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span>CFA Standard 2024</span>
                  <span className="font-semibold text-slate-900">★ 4.95 (940)</span>
                </div>
              </div>
              <button
                onClick={() => handleNavigateToLibrary('cfa')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-800 text-xs font-semibold rounded-md transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Vào luyện thi CFA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card GMAT */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-purple-600 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-100">
                    GMAC Focus 2024
                  </span>
                  <span className="text-xs text-slate-500">10 Đề thi</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">GMAT Focus Edition</h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  Trọng tâm Data Insights, Quantitative Reasoning & Verbal cho ứng viên nộp học bổng thạc sĩ MBA top trường.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span>Target 655+ (90th%)</span>
                  <span className="font-semibold text-slate-900">★ 4.9 (1.1k)</span>
                </div>
              </div>
              <button
                onClick={() => handleNavigateToLibrary('gmat')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-purple-900 hover:text-white text-slate-800 text-xs font-semibold rounded-md transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Vào luyện thi GMAT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card ACCA */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-rose-600 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-rose-50 text-rose-900 border border-rose-100">
                    ACCA Global UK
                  </span>
                  <span className="text-xs text-slate-500">9 Đề thi</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">ACCA (FA, MA, FR)</h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  Bộ đề kiểm toán quốc tế, bài tập định khoản nghiệp vụ theo chuẩn mực IFRS và phân tích báo cáo tài chính.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span>Kiểm toán & IFRS</span>
                  <span className="font-semibold text-slate-900">★ 4.9 (620)</span>
                </div>
              </div>
              <button
                onClick={() => handleNavigateToLibrary('acca')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-rose-900 hover:text-white text-slate-800 text-xs font-semibold rounded-md transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Vào luyện thi ACCA</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card GRE */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:border-cyan-600 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-cyan-50 text-cyan-900 border border-cyan-100">
                    ETS Official
                  </span>
                  <span className="text-xs text-slate-500">8 Đề thi</span>
                </div>
                <h4 className="text-base font-bold text-slate-900">GRE General Test</h4>
                <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                  Bài thi khảo thí năng lực định lượng (Quantitative) và phân tích ngôn ngữ học thuật cho cao học quốc tế.
                </p>
                <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
                  <span>Target 325+</span>
                  <span className="font-semibold text-slate-900">★ 4.85 (430)</span>
                </div>
              </div>
              <button
                onClick={() => handleNavigateToLibrary('gre')}
                className="mt-4 w-full py-2 bg-slate-100 hover:bg-cyan-800 hover:text-white text-slate-800 text-xs font-semibold rounded-md transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Vào luyện thi GRE</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TEST SUITE CATALOG / FEATURED PRACTICE TESTS TABLE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Ngân hàng đề thi luyện tập tiêu chuẩn
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Được thiết kế bám sát form đề thi thật, có đồng hồ đếm ngược và phân tích đáp án tức thì
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categoryTabs.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategoryTab(c.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategoryTab === c.id
                    ? 'bg-blue-900 text-white font-semibold'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Practice Aptitude Tests Style List / Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100 overflow-hidden">
          {featuredExams.slice(0, 6).map((exam) => (
            <div
              key={exam.id}
              className="p-5 sm:p-6 hover:bg-slate-50/80 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Test Info */}
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {exam.categoryLabel}
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-medium">{exam.difficultyLabel}</span>
                  {exam.hasAudio && (
                    <>
                      <span className="text-slate-400">·</span>
                      <span className="text-emerald-700 flex items-center gap-1 font-medium">
                        <Headphones className="w-3.5 h-3.5" /> Có Audio chuẩn
                      </span>
                    </>
                  )}
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600 font-medium">Bản quyền 2024</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {exam.title}
                </h3>

                {exam.subtitle && (
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {exam.subtitle}
                  </p>
                )}

                {/* Test Specs: Questions, Duration, Test Takers */}
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
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

              {/* CTAs */}
              <div className="flex items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                <button
                  onClick={() => handleStartExam(exam.id)}
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Bắt đầu thi tính giờ</span>
                </button>
                <button
                  onClick={() => handleStartExam(exam.id)}
                  className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-200 transition-colors cursor-pointer"
                >
                  <span>Luyện tập</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* View All Tests in Library */}
        <div className="mt-6 text-center">
          <button
            onClick={() => handleNavigateToLibrary(selectedCategoryTab === 'all' ? undefined : selectedCategoryTab)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-300 shadow-xs transition-colors cursor-pointer"
          >
            <span>Xem toàn bộ đề thi trong Kho đề ({examList.length} đề thi)</span>
            <ArrowRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </section>

      {/* 6. METHODOLOGY & EXAM STANDARDS - 3 Clear Steps */}
      <section className="bg-white border-t border-b border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Phương pháp luyện thi chuẩn hóa theo tiêu chuẩn ngành
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Dựa trên quy chuẩn khảo thí của Cambridge Assessment, British Council, Hanban và CFA Institute
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                01
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Mô phỏng áp lực phòng thi thực
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Đồng hồ đếm ngược chính xác từng giây, giao diện chia đôi cột văn bản - câu hỏi chuẩn theo định dạng kỳ thi máy tính quốc tế.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                02
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Chấm điểm & Phân tích tức thì
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Chuyển đổi số câu đúng sang Band Score (IELTS) hoặc Scaled Score (TOEIC/CFA). Trích xuất chính xác vị trí câu dẫn chứng trong bài.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-900 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                03
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Khắc phục bẫy tư duy sai sót
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hệ thống tự động lưu câu làm sai vào Sổ tay lỗi sai, phân tích bẫy paraphrase và gợi ý chiến lược giải quyết dạng bài yếu nhất.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. STUDENT VOICES & TARGET ATTAINMENT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs uppercase font-bold text-slate-500 tracking-wider">
            Kết quả học viên thực tế
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Sinh viên các trường đại học nói gì về CertPrep
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                Đạt IELTS Band 8.0
              </span>
              <span className="text-[11px] font-semibold text-slate-500">ĐH Ngoại Thương (FTU)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              “Giao diện làm đề giống hệt thi IELTS trên máy tính của BC/IDP. Đặc biệt mục phân tích bẫy Paraphrase Trap giúp mình tăng từ 7.0 lên 8.0 Reading chỉ sau 3 tuần.”
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-slate-800">
              Trần Hoàng Long · Khóa K60 FTU Hà Nội
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                Passed CFA Level 1 (Top 10%)
              </span>
              <span className="text-[11px] font-semibold text-slate-500">ĐH Kinh tế Quốc dân (NEU)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              “Đề thi CFA ở đây có câu hỏi Ethics và Quantitative bám sát curriculum 2024. Phân tích chi tiết giúp mình không bị nhầm lẫn giữa IFRS và US GAAP.”
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-slate-800">
              Lê Minh Quân · Viện Ngân hàng - Tài chính NEU
            </div>
          </div>

          <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded">
                Đạt HSK 6 (262/300 điểm)
              </span>
              <span className="text-[11px] font-semibold text-slate-500">ĐHQG Hà Nội (VNU-ULIS)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              “Hệ thống tra từ vựng trực tiếp khi click đúp vào chữ Hán cực kỳ tiện. Audio đề nghe chuẩn giọng Bắc Kinh, không bị rè hay giật lag như các trang khác.”
            </p>
            <div className="pt-2 border-t border-slate-100 text-xs font-semibold text-slate-800">
              Phạm Thu Uyên · Khoa Ngôn ngữ & Văn hóa Trung Quốc
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
