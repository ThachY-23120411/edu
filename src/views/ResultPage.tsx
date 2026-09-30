'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Flag, 
  Bookmark, 
  BookmarkCheck, 
  Lightbulb, 
  BookOpen, 
  Clock, 
  Download,
  Filter,
  Check,
  ArrowRight,
  TrendingUp,
  Award,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface ResultPageProps {
  attemptId?: string;
  onRetakeExam?: () => void;
  onOpenVocabDrawer?: () => void;
  onOpenMistakeModal?: () => void;
}

export const ResultPage: React.FC<ResultPageProps> = ({
  attemptId,
  onRetakeExam,
  onOpenVocabDrawer,
  onOpenMistakeModal,
}) => {
  const router = useRouter();
  let appCtx: any = null;
  try {
    appCtx = useApp();
  } catch (e) {}

  const [resultData, setResultData] = useState<any>(null);
  const [questionsData, setQuestionsData] = useState<any[]>([]);
  const [filterExplanation, setFilterExplanation] = useState<'all' | 'wrong' | 'flagged'>('all');
  const [bookmarkedMistakes, setBookmarkedMistakes] = useState<Record<number, boolean>>({});

  useEffect(() => {
    if (!attemptId) {
      setResultData(null);
      return;
    }
    api.results.getReport(attemptId).then((data) => {
      if (data?.summary) {
        setResultData({
          examTitle: data.examTitle || 'Cambridge IELTS 18 - Reading Test 03',
          category: data.summary.category || 'IELTS Academic Reading',
          timeSpentMinutes: data.summary.timeSpentMinutes ?? 42,
          timeSpentSeconds: data.summary.timeSpentSeconds ?? 15,
          bandScore: data.summary.bandScore ?? 7.5,
          totalScoreString: data.summary.totalScoreString || '7.5 / 9.0',
          correctCount: data.summary.correctCount ?? 32,
          totalQuestions: data.summary.totalQuestions ?? 40,
          accuracyPercentage: data.summary.accuracyPercentage ?? 80,
          percentileRank: data.summary.percentileRank ?? 88,
          beatenPercentage: data.summary.beatenPercentage ?? 88,
          totalParticipantsBenchmark: data.summary.totalParticipantsBenchmark ?? 18400,
          timeComparisonText: data.summary.timeComparisonText || 'Nhanh hơn trung bình 5 phút',
          targetComparison: data.summary.targetComparisonMessage || 'Đạt mục tiêu IELTS 7.5+',
          skillBreakdowns: data.skillBreakdowns || [],
        });
      }
      if (data?.questions && data.questions.length > 0) {
        setQuestionsData(data.questions);
      }
    }).catch(() => {
      setResultData(null);
    });
  }, [attemptId]);

  const handleRetakeExam = () => {
    if (onRetakeExam) onRetakeExam();
    else router.push(`/exam/${appCtx?.activeExamId || 'ielts-cam-18-test-3'}`);
  };

  const handleOpenMistake = () => {
    if (onOpenMistakeModal) onOpenMistakeModal();
    else if (appCtx?.setIsMistakeModalOpen) appCtx.setIsMistakeModalOpen(true);
  };

  const handleOpenVocab = () => {
    if (onOpenVocabDrawer) onOpenVocabDrawer();
    else if (appCtx?.setIsVocabDrawerOpen) appCtx.setIsVocabDrawerOpen(true);
  };

  const toggleBookmarkMistake = async (qId: number) => {
    const nextVal = !bookmarkedMistakes[qId];
    setBookmarkedMistakes((prev) => ({ ...prev, [qId]: nextVal }));
    if (nextVal) {
      const q = questionsData.find((item) => item.id === qId);
      if (q) {
        api.notebook.saveMistake({
          questionId: q.id,
          testName: resultData.examTitle,
          section: q.section,
          questionNumber: q.questionNumber || q.id,
          questionType: q.typeNameVi || q.type,
          questionText: q.prompt,
          yourAnswer: q.userAnswer || 'Chưa chọn',
          correctAnswer: q.correctAnswer,
          trapCategory: 'mindset',
          trapExplanation: q.explanation?.mindsetTrap || q.explanation?.vocabularyTrap,
          goldenRule: q.explanation?.goldenRule,
        }).catch(() => {});
      }
    }
  };

  const filteredQuestions = questionsData.filter((q) => {
    if (filterExplanation === 'wrong') {
      return q.userAnswer !== q.correctAnswer;
    }
    if (filterExplanation === 'flagged') {
      return q.isFlagged;
    }
    return true;
  });

  if (!resultData) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center mx-auto mb-4 border border-blue-100">
              <Award className="w-8 h-8 text-blue-900" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Chưa có kết quả bài thi nào</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
              Bạn chưa hoàn thành bài thi thử nào trên hệ thống hoặc bài thi chưa được nộp để tính điểm.
            </p>
            <div className="mt-5 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs text-left max-w-lg mx-auto flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Lưu ý về tiến độ phát triển:</span>
                <span>Phân hệ phòng thi làm đề và thuật toán tính điểm tự động đang được Dev khác phụ trách phát triển và hoàn thiện. Bạn có thể vào Kho đề thi để xem danh mục và cấu trúc bài thi.</span>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={() => router.push('/library')}
                className="px-6 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Khám phá kho đề thi</span>
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* 1. BREADCRUMB & HEADER */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span>Trang chủ</span>
            <span>/</span>
            <span>Kho đề thi</span>
            <span>/</span>
            <span className="text-slate-900 font-medium">Báo cáo kết quả và phân tích chi tiết</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Báo cáo kết quả bài thi
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {resultData.examTitle} · Thời gian làm bài: {resultData.timeSpentMinutes} phút {resultData.timeSpentSeconds} giây
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleRetakeExam}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Làm lại bài thi</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-3.5 py-2 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-md border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Tải bảng điểm</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. OVERALL SCORE CARD - Clean Practice Aptitude Tests Style */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Big Score & Target Status */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-200 pb-6 lg:pb-0 lg:pr-8 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                {resultData.category}
              </span>

              <div className="flex items-baseline gap-3 pt-2">
                <span className="text-5xl sm:text-6xl font-black text-slate-900 font-mono tracking-tight">
                  {resultData.bandScore}
                </span>
                <span className="text-lg font-bold text-slate-500">/ 9.0 Band</span>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>{resultData.targetComparison}</span>
              </div>
            </div>

            {/* Right: Key Performance Indicators */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Tỷ lệ chính xác</span>
                <p className="text-2xl font-bold text-slate-900 font-mono">
                  {resultData.accuracyPercentage}%
                </p>
                <span className="text-[11px] text-slate-400">
                  {resultData.correctCount}/{resultData.totalQuestions} câu đúng
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Điểm bách phân</span>
                <p className="text-2xl font-bold text-blue-900 font-mono">
                  Top {resultData.percentileRank}%
                </p>
                <span className="text-[11px] text-slate-400">
                  Cao hơn {resultData.beatenPercentage}% thí sinh
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Thời gian hoàn thành</span>
                <p className="text-2xl font-bold text-slate-900 font-mono">
                  {resultData.timeSpentMinutes}m
                </p>
                <span className="text-[11px] text-slate-400">
                  Giới hạn: 60 phút
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-500 font-medium">Tốc độ làm bài</span>
                <p className="text-2xl font-bold text-slate-900 font-mono">
                  1.2 m/câu
                </p>
                <span className="text-[11px] text-emerald-600 font-medium">
                  Chuẩn thời gian
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. PERFORMANCE BREAKDOWN BY QUESTION TYPE */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900">
            Phân tích năng lực theo dạng câu hỏi
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                type: 'Multiple Choice (Trắc nghiệm)',
                correct: '1/1',
                pct: 100,
                status: 'Xuất sắc',
                note: 'Khả năng đối chiếu từ khóa và loại suy tốt',
                isWeak: false,
              },
              {
                type: 'Matching Headings (Nối tiêu đề)',
                correct: '1/1',
                pct: 100,
                status: 'Xuất sắc',
                note: 'Nắm bắt ý chính tổng thể các đoạn văn chính xác',
                isWeak: false,
              },
              {
                type: 'Sentence Completion (Điền từ)',
                correct: '1/1',
                pct: 100,
                status: 'Xuất sắc',
                note: 'Đọc quét từ vựng chuyên ngành trong bài đọc tốt',
                isWeak: false,
              },
              {
                type: 'True / False / Not Given',
                correct: '0/1',
                pct: 0,
                status: 'Cần cải thiện',
                note: 'Nhầm lẫn thông tin suy diễn thực tế ngoài bài đọc',
                isWeak: true,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border text-xs space-y-2 ${
                  item.isWeak
                    ? 'bg-rose-50/50 border-rose-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span className="text-slate-900">{item.type}</span>
                  <span className={item.isWeak ? 'text-rose-700 font-bold' : 'text-slate-700'}>
                    {item.correct} ({item.pct}%)
                  </span>
                </div>

                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.isWeak ? 'bg-rose-500' : 'bg-blue-800'}`}
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-500">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4. QUESTION-BY-QUESTION REVIEW & EXPLANATIONS */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Chi tiết lời giải từng câu hỏi
              </h2>
              <p className="text-xs text-slate-500">
                Tra cứu dẫn chứng trực tiếp từ bài đọc và ghi chú phương pháp tư duy
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-slate-200 text-xs">
              <button
                onClick={() => setFilterExplanation('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  filterExplanation === 'all'
                    ? 'bg-blue-900 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả ({questionsData.length})
              </button>
              <button
                onClick={() => setFilterExplanation('wrong')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  filterExplanation === 'wrong'
                    ? 'bg-rose-700 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Câu sai ({questionsData.filter((q) => q.userAnswer !== q.correctAnswer).length})
              </button>
              <button
                onClick={() => setFilterExplanation('flagged')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                  filterExplanation === 'flagged'
                    ? 'bg-amber-600 text-white font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Đã gắn cờ ({questionsData.filter((q) => q.isFlagged).length})
              </button>
            </div>
          </div>

          {/* Question List */}
          <div className="space-y-4">
            {filteredQuestions.map((q) => {
              const isCorrect = q.userAnswer === q.correctAnswer;
              const isMistakeSaved = bookmarkedMistakes[q.id];

              return (
                <div
                  key={q.id}
                  className={`bg-white rounded-xl border p-5 sm:p-6 shadow-xs space-y-4 ${
                    isCorrect ? 'border-slate-200' : 'border-rose-300 ring-1 ring-rose-200'
                  }`}
                >
                  {/* Question header info */}
                  <div className="flex items-center justify-between gap-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded text-xs font-bold flex items-center gap-1 ${
                        isCorrect
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                        <span>Câu {q.id}: {isCorrect ? 'Đúng' : 'Sai'}</span>
                      </span>

                      <span className="text-xs text-slate-500 font-medium">
                        {q.typeNameVi}
                      </span>
                    </div>

                    {/* Bookmark mistake action */}
                    <button
                      onClick={() => toggleBookmarkMistake(q.id)}
                      className={`text-xs flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors cursor-pointer ${
                        isMistakeSaved
                          ? 'bg-blue-50 text-blue-900 border-blue-200 font-semibold'
                          : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isMistakeSaved ? (
                        <>
                          <BookmarkCheck className="w-3.5 h-3.5 text-blue-900" />
                          <span>Đã lưu vào sổ tay lỗi sai</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Lưu câu này vào sổ tay</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Question prompt */}
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      {q.prompt}
                    </p>
                    {q.promptVi && (
                      <p className="text-xs text-slate-500 italic">
                        Dịch nghĩa: {q.promptVi}
                      </p>
                    )}
                  </div>

                  {/* Candidate vs Correct Answer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className={`p-3 rounded-lg border ${
                      isCorrect 
                        ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                        : 'bg-rose-50/70 border-rose-200 text-rose-900'
                    }`}>
                      <span className="font-semibold block mb-0.5">Câu trả lời của bạn:</span>
                      <strong className="text-sm">{q.userAnswer || 'Chưa chọn'}</strong>
                    </div>

                    <div className="p-3 rounded-lg border bg-blue-50/70 border-blue-200 text-blue-900">
                      <span className="font-semibold block mb-0.5">Đáp án chính xác:</span>
                      <strong className="text-sm">{q.correctAnswer}</strong>
                    </div>
                  </div>

                  {/* Pedagogical Explanation Box */}
                  {q.explanation && (
                    <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 space-y-3 text-xs">
                      {/* Evidence citation in passage */}
                      {q.explanation.evidenceLocation && (
                        <div>
                          <span className="font-bold text-slate-700 block mb-1">
                            Vị trí dẫn chứng trong bài đọc ({q.explanation.evidenceLocation}):
                          </span>
                          <blockquote className="bg-white p-3 rounded border border-slate-200 text-slate-700 italic border-l-4 border-l-blue-900">
                            {q.explanation.evidenceQuote}
                          </blockquote>
                        </div>
                      )}

                      {/* Trap analysis / Explanation */}
                      {q.explanation.mindsetTrap && (
                        <div>
                          <span className="font-bold text-rose-800 block mb-0.5">
                            Bẫy đề thi & Lỗi tư duy thường gặp:
                          </span>
                          <p className="text-slate-600 leading-relaxed">
                            {q.explanation.mindsetTrap}
                          </p>
                        </div>
                      )}

                      {q.explanation.vocabularyTrap && (
                        <div>
                          <span className="font-bold text-slate-800 block mb-0.5">
                            Phân tích từ vựng & diễn đạt tương đương (Paraphrasing):
                          </span>
                          <p className="text-slate-600 leading-relaxed">
                            {q.explanation.vocabularyTrap}
                          </p>
                        </div>
                      )}

                      {q.explanation.goldenRule && (
                        <div className="bg-amber-50 p-2.5 rounded border border-amber-200 text-amber-900">
                          <strong className="block mb-0.5">Quy tắc vàng làm bài:</strong>
                          <span>{q.explanation.goldenRule}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. STUDY ACTION DRAWER TRIGGERS */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Muốn củng cố lại kiến thức của bài thi này?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Xem lại các từ vựng học thuật quan trọng hoặc ôn tập các câu làm sai trong sổ tay cá nhân.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenMistake}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md border border-slate-300 transition-colors cursor-pointer"
            >
              Mở sổ tay lỗi sai (1 câu)
            </button>
            <button
              onClick={handleOpenVocab}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors cursor-pointer"
            >
              Xem từ vựng bài đọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
