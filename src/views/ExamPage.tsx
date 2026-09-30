'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Clock, 
  Flag, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Highlighter, 
  Check, 
  BookOpen, 
  AlertCircle,
  Eye,
  EyeOff,
  Pause,
  Play,
  RotateCcw,
  Edit3
} from 'lucide-react';
import { Question } from '../types/exam';
import { DictionaryPopup } from '../components/DictionaryPopup';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface ExamPageProps {
  examId?: string;
  onBackToLibrary?: () => void;
  onSubmitExam?: () => void;
}

export const ExamPage: React.FC<ExamPageProps> = ({
  examId = 'ielts-cam-18-test-3',
  onBackToLibrary,
  onSubmitExam,
}) => {
  const router = useRouter();
  let appCtx: any = null;
  try {
    appCtx = useApp();
  } catch (e) {}

  const [exam, setExam] = useState<any>(null);
  const [passages, setPassages] = useState<any[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [attemptId, setAttemptId] = useState<string>('');
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);

  // Timer: default 60 mins
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(60 * 60);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);
  const [isTimerHidden, setIsTimerHidden] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    // 1. Fetch exam metadata and any questions/passages from backend
    api.exams.getById(examId)
      .then((data) => {
        if (data) {
          setExam(data);
          setPassages(data.passages || []);
          if (Array.isArray(data.questions) && data.questions.length > 0) {
            const mappedQuestions: Question[] = data.questions.map((q: any) => ({
              id: q.id || q.question_number,
              type: q.question_type_code || q.type || 'multiple-choice',
              typeLabelVi: q.question_type_name_vi || q.typeLabelVi || 'Trắc nghiệm',
              questionNumber: q.question_number || q.id,
              section: q.section_name || 'Phần thi',
              text: q.prompt || q.text,
              translationVi: q.prompt_vi || q.translationVi,
              options: (q.options || []).map((opt: any) => ({
                id: opt.option_identifier || opt.id,
                text: opt.text_en || opt.text,
                translationVi: opt.text_vi || opt.translationVi,
              })),
              correctAnswer: q.correct_answer || q.correctAnswer,
              scoreWeight: q.score_weight || 1,
              userAnswer: undefined,
              isFlagged: false,
            }));
            setQuestions(mappedQuestions);
          } else {
            setQuestions([]);
          }
        }
      })
      .catch(() => {
        setExam(null);
        setPassages([]);
        setQuestions([]);
      })
      .finally(() => {
        setLoading(false);
      });

    // 2. Start or resume attempt if backend supports it
    api.attempts.startOrResume(examId).then((data) => {
      if (data?.attempt) {
        setAttemptId(data.attempt.id);
        if (data.attempt.remaining_seconds_saved) {
          setTimeLeftSeconds(data.attempt.remaining_seconds_saved);
        }
      }
    }).catch(() => {});
  }, [examId]);

  const handleBackToLibrary = () => {
    if (onBackToLibrary) onBackToLibrary();
    else router.push('/library');
  };

  const handleSubmitExam = async () => {
    try {
      if (attemptId) {
        const spent = 48 * 60 + 13 - timeLeftSeconds;
        await api.attempts.submit(attemptId, spent > 0 ? spent : 707);
      }
    } catch (e) {}

    if (onSubmitExam) onSubmitExam();
    else router.push(`/result/${attemptId || examId}`);
  };

  // Font size for reading passage (14px, 15px, 16px, 18px)
  const [fontSize, setFontSize] = useState<number>(15);

  // Text highlighter tool active
  const [isHighlightMode, setIsHighlightMode] = useState<boolean>(false);

  // Exit & Submit Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [isExitModalOpen, setIsExitModalOpen] = useState<boolean>(false);

  // Instant dictionary lookup popup state
  const [dictPopup, setDictPopup] = useState<{
    word: string;
    phonetic: string;
    meaning: string;
    example: string;
    position: { x: number; y: number } | null;
  }>({
    word: '',
    phonetic: '',
    meaning: '',
    example: '',
    position: null,
  });

  // Countdown timer effect
  useEffect(() => {
    if (isTimerPaused || timeLeftSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerPaused, timeLeftSeconds]);

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const activeQuestion = questions[currentQIndex];

  // Answer selection handler
  const handleSelectOption = (optionId: string) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === currentQIndex ? { ...q, userAnswer: optionId } : q))
    );
    if (attemptId && activeQuestion) {
      api.attempts.saveAnswer(attemptId, {
        questionId: activeQuestion.id,
        answer: optionId,
      }).catch(() => {});
    }
  };

  // Flag for review toggle
  const handleToggleFlag = () => {
    const nextFlag = !activeQuestion?.isFlagged;
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === currentQIndex ? { ...q, isFlagged: !q.isFlagged } : q))
    );
    if (attemptId && activeQuestion) {
      api.attempts.saveAnswer(attemptId, {
        questionId: activeQuestion.id,
        isFlagged: nextFlag,
      }).catch(() => {});
    }
  };

  // Passage word selection for dictionary lookup
  const handlePassageMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;

    const selectedText = selection.toString().trim().toLowerCase();
    if (selectedText.length > 2 && selectedText.length < 30) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      let meaning = 'Từ vựng học thuật trong bài đọc';
      let phonetic = '/.../';
      let example = '';

      if (selectedText.includes('hydroponic')) {
        meaning = 'thủy canh (phương pháp trồng cây không cần đất)';
        phonetic = '/ˌhaɪ.drəˈpɒn.ɪk/';
        example = 'Closed-loop hydroponic systems recycle 95% of water.';
      } else if (selectedText.includes('aeroponic')) {
        meaning = 'khí canh (rễ cây lơ lửng được phun sương dinh dưỡng)';
        phonetic = '/ˌeə.rəʊˈpɒn.ɪk/';
        example = 'Aeroponic misting provides plant roots with optimal oxygen.';
      } else if (selectedText.includes('depletion')) {
        meaning = 'sự cạn kiệt, suy thoái tài nguyên';
        phonetic = '/dɪˈpliː.ʃən/';
        example = 'Rural soil depletion threatens long-term sustainability.';
      } else if (selectedText.includes('drastically')) {
        meaning = 'mạnh mẽ, triệt để, đáng kể';
        phonetic = '/ˈdræs.tɪ.kəl.i/';
      } else {
        meaning = `Tra cứu ngữ cảnh học thuật cho "${selectedText}"`;
      }

      setDictPopup({
        word: selectedText,
        phonetic,
        meaning,
        example,
        position: {
          x: Math.min(rect.left + rect.width / 2, window.innerWidth - 200),
          y: rect.top - 10,
        },
      });
    }
  };

  const activePassage = passages[0] || null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center text-sm text-slate-500">
        Đang tải dữ liệu bài thi...
      </div>
    );
  }

  if (!loading && questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={handleBackToLibrary}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer border border-slate-200"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Quay lại Kho đề thi</span>
          </button>
          <span className="text-xs font-bold text-slate-800">
            {exam?.title || 'Phòng thi trực tuyến'}
          </span>
          <div className="w-24" />
        </header>

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-xl w-full bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 text-center shadow-xs">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <BookOpen className="w-8 h-8 text-amber-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Chưa có dữ liệu bài thi trực tuyến
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {exam?.title ? `Đề thi "${exam.title}"` : 'Đề thi này'} hiện chưa có dữ liệu câu hỏi trong cơ sở dữ liệu.
            </p>
            <div className="mt-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-blue-900 shrink-0" />
                <span>Thông tin tiến độ dự án:</span>
              </div>
              <p>
                Phần trích xuất sách (extract tài liệu) để hiển thị đề cho người dùng làm online đang được một developer khác phụ trách phát triển và chưa merge vào hệ thống.
              </p>
              <p className="text-slate-500">
                Toàn bộ dữ liệu mẫu giả định đã được gỡ bỏ khỏi hệ thống. Khi module trích xuất hoàn thiện và merge vào, nội dung đề thi sẽ tự động hiển thị đầy đủ tại đây.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={handleBackToLibrary}
                className="px-5 py-2.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Quay lại Kho đề thi</span>
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 transition-colors cursor-pointer"
              >
                <span>Về trang chủ</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = questions.filter((q) => q.userAnswer).length;
  const flaggedCount = questions.filter((q) => q.isFlagged).length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-text">
      {/* 1. TOP EXAM HEADER BAR - Standard Computer-Delivered Layout */}
      <header className="bg-white border-b border-slate-300 sticky top-0 z-30 px-4 sm:px-6 py-2.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left: Back / Exit & Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsExitModalOpen(true)}
              className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded border border-slate-300 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Thoát</span>
            </button>

            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                {exam?.title || 'Phòng thi trực tuyến'}
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                {activePassage?.title || exam?.subtitle || 'Bài thi khảo thí trực tuyến'}
              </p>
            </div>
          </div>

          {/* Center: Live Countdown Timer */}
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded border font-mono font-bold text-sm ${
              timeLeftSeconds < 300 
                ? 'bg-rose-50 text-rose-700 border-rose-300' 
                : 'bg-slate-50 text-slate-800 border-slate-300'
            }`}>
              <Clock className="w-4 h-4 text-slate-500" />
              <span>{isTimerHidden ? '--:--' : formatTimer(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={() => setIsTimerHidden(!isTimerHidden)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
              title={isTimerHidden ? 'Hiện đồng hồ' : 'Ẩn đồng hồ'}
            >
              {isTimerHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsTimerPaused(!isTimerPaused)}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
              title={isTimerPaused ? 'Tiếp tục làm bài' : 'Tạm dừng đồng hồ'}
            >
              {isTimerPaused ? <Play className="w-4 h-4 fill-slate-700" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>

          {/* Right: Submit Button */}
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right text-xs text-slate-500">
              <span>Đã trả lời: </span>
              <strong className="text-slate-900">{answeredCount}/{questions.length}</strong>
            </div>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded shadow-xs transition-colors cursor-pointer"
            >
              Nộp bài thi
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN SPLIT TESTING WORKSPACE (Passage on Left, Question on Right) */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* LEFT PANE: READING PASSAGE & STIMULUS */}
        <section className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          {/* Passage Toolbar */}
          <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between text-xs text-slate-600">
            <span className="font-semibold text-slate-800">
              Đoạn văn đọc hiểu (Reading Passage 2)
            </span>

            {/* Font size adjuster and highlight mode */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 border border-slate-300 rounded bg-white px-1.5 py-0.5">
                <button
                  onClick={() => setFontSize(Math.max(13, fontSize - 1))}
                  className="px-1 text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                  title="Thu nhỏ chữ"
                >
                  A-
                </button>
                <span className="text-[11px] text-slate-400 px-1">|</span>
                <button
                  onClick={() => setFontSize(Math.min(20, fontSize + 1))}
                  className="px-1 text-slate-600 hover:text-slate-900 font-bold cursor-pointer"
                  title="Phóng to chữ"
                >
                  A+
                </button>
              </div>

              <button
                onClick={() => setIsHighlightMode(!isHighlightMode)}
                className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer border ${
                  isHighlightMode
                    ? 'bg-amber-100 text-amber-900 border-amber-300 font-medium'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Highlighter className="w-3.5 h-3.5" />
                <span>Bút dạ</span>
              </button>
            </div>
          </div>

          {/* Passage Body */}
          <div
            onMouseUp={handlePassageMouseUp}
            className="flex-1 p-6 overflow-y-auto max-h-[calc(100vh-250px)] text-slate-800 leading-relaxed space-y-4"
            style={{ fontSize: `${fontSize}px` }}
          >
            <div className="border-b border-slate-200 pb-3 mb-4">
              <h2 className="text-xl font-bold text-slate-900">
                {activePassage?.title || exam?.title || 'Nội dung bài thi'}
              </h2>
              {activePassage?.subtitle && (
                <p className="text-xs text-slate-500 italic mt-1">
                  {activePassage.subtitle}
                </p>
              )}
            </div>

            {(activePassage?.paragraphs || []).map((p: any) => (
              <div key={p.index} className="relative group">
                <span className="inline-block font-bold text-slate-500 mr-2 text-xs select-none">
                  {p.label}
                </span>
                <span className={isHighlightMode ? 'selection:bg-amber-200' : ''}>
                  {p.content}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-slate-50 border-t border-slate-200 px-4 py-2 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Bôi đen bất kỳ từ nào để tra cứu nghĩa nhanh</span>
            <span>Cambridge Academic Assessment</span>
          </div>
        </section>

        {/* RIGHT PANE: ACTIVE QUESTION & ANSWER SELECTION */}
        <section className="lg:col-span-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between overflow-hidden">
          {/* Question Header & Flagging */}
          <div>
            <div className="bg-slate-50 border-b border-slate-200 px-5 py-3 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block">
                  Câu hỏi {activeQuestion.id} / 40
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {activeQuestion.typeNameVi}
                </span>
              </div>

              {/* Flag for Review */}
              <button
                onClick={handleToggleFlag}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  activeQuestion.isFlagged
                    ? 'bg-amber-50 text-amber-900 border-amber-300 font-semibold'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Flag className={`w-3.5 h-3.5 ${activeQuestion.isFlagged ? 'fill-amber-500 text-amber-600' : 'text-slate-400'}`} />
                <span>{activeQuestion.isFlagged ? 'Đã đánh dấu xem lại' : 'Đánh dấu câu này'}</span>
              </button>
            </div>

            {/* Question Prompt */}
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-base font-semibold text-slate-900 leading-snug">
                  {activeQuestion.prompt}
                </p>
                {activeQuestion.promptVi && (
                  <p className="text-xs text-slate-500 italic">
                    Dịch nghĩa: {activeQuestion.promptVi}
                  </p>
                )}
              </div>

              {/* Options List */}
              <div className="space-y-3">
                {activeQuestion.options?.map((opt) => {
                  const isSelected = activeQuestion.userAnswer === opt.id;

                  return (
                    <label
                      key={opt.id}
                      onClick={() => handleSelectOption(opt.id)}
                      className={`flex items-start gap-3.5 p-4 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-800 ring-1 ring-blue-800 text-slate-900'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${activeQuestion.id}`}
                        checked={isSelected}
                        onChange={() => handleSelectOption(opt.id)}
                        className="mt-0.5 text-blue-900 focus:ring-blue-800"
                      />

                      <div className="space-y-1 flex-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-700">{opt.id}.</span>
                          <span className="leading-snug">{opt.text}</span>
                        </div>
                        {opt.translation && (
                          <p className="text-xs text-slate-500 italic pl-5">
                            {opt.translation}
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Save Feedback Status */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                  <Check className="w-3.5 h-3.5" /> Đã lưu câu trả lời tự động
                </span>
                <span>ID: #{activeQuestion.id} · IELTS Section 2</span>
              </div>
            </div>
          </div>

          {/* Bottom Pagination Inside Card */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
            <button
              onClick={() => setCurrentQIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQIndex === 0}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Câu trước</span>
            </button>

            <span className="text-xs font-semibold text-slate-600">
              {currentQIndex + 1} / {questions.length} trong phần này
            </span>

            <button
              onClick={() => setCurrentQIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQIndex === questions.length - 1}
              className="flex items-center gap-1 px-3.5 py-1.5 rounded border border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <span>Câu sau</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>

      {/* 3. BOTTOM QUESTION NAVIGATOR PALETTE */}
      <footer className="bg-white border-t border-slate-300 sticky bottom-0 z-20 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Question Palette Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-semibold text-slate-500 mr-2 shrink-0">Bảng câu hỏi:</span>
            {questions.map((q, idx) => {
              const isActive = idx === currentQIndex;
              const isAnswered = !!q.userAnswer;
              const isFlagged = q.isFlagged;

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQIndex(idx)}
                  className={`w-9 h-9 rounded text-xs font-bold transition-all relative shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-blue-900 text-white ring-2 ring-blue-900 ring-offset-2'
                      : isAnswered
                      ? 'bg-slate-700 text-white hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {q.id}
                  {isFlagged && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div className="flex items-center gap-4 text-xs text-slate-500 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-blue-900 rounded"></span>
              <span>Đang chọn</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-700 rounded"></span>
              <span>Đã làm ({answeredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-100 border border-slate-300 rounded"></span>
              <span>Chưa làm ({questions.length - answeredCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-500 rounded-full"></span>
              <span>Xem lại ({flaggedCount})</span>
            </div>
          </div>
        </div>
      </footer>

      {/* SUBMIT CONFIRMATION MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Xác nhận nộp bài thi?</h3>
                <p className="text-xs text-slate-500">Hệ thống sẽ chấm điểm và phân tích chi tiết kết quả.</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 text-xs space-y-1.5 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-600">Tổng số câu hỏi:</span>
                <strong className="text-slate-900">{questions.length}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Đã hoàn thành:</span>
                <strong className="text-emerald-700">{answeredCount} câu</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Chưa trả lời:</span>
                <strong className="text-slate-700">{questions.length - answeredCount} câu</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Đã đánh dấu xem lại:</span>
                <strong className="text-amber-700">{flaggedCount} câu</strong>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="px-4 py-2 rounded-md border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Tiếp tục làm bài
              </button>
              <button
                onClick={() => {
                  setIsSubmitModalOpen(false);
                  handleSubmitExam();
                }}
                className="px-4 py-2 rounded-md bg-blue-900 text-white text-xs font-semibold hover:bg-blue-800 shadow-xs cursor-pointer"
              >
                Xác nhận nộp bài
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EXIT MODAL */}
      {isExitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Rời khỏi phòng thi?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tiến độ làm bài và câu trả lời của bạn đã được tự động lưu. Bạn có thể quay lại tiếp tục làm bất kỳ lúc nào từ Trang chủ.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsExitModalOpen(false)}
                className="px-4 py-2 rounded-md border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Ở lại làm tiếp
              </button>
              <button
                onClick={() => {
                  setIsExitModalOpen(false);
                  handleBackToLibrary();
                }}
                className="px-4 py-2 rounded-md bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 cursor-pointer"
              >
                Lưu & Về kho đề
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DICTIONARY POPUP */}
      <DictionaryPopup
        word={dictPopup.word}
        phonetic={dictPopup.phonetic}
        meaning={dictPopup.meaning}
        example={dictPopup.example}
        position={dictPopup.position}
        onClose={() => setDictPopup((prev) => ({ ...prev, position: null }))}
      />
    </div>
  );
};
