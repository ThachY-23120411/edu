'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  BookOpen, 
  ChevronDown, 
  Check, 
  Search, 
  User, 
  Bookmark, 
  BarChart3, 
  Layers, 
  Clock,
  Menu,
  X,
  Languages,
  TrendingUp,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText,
  Headphones,
  Calculator
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';

interface NavbarProps {
  currentTab?: 'home' | 'library' | 'exam' | 'result';
  setCurrentTab?: (tab: 'home' | 'library' | 'exam' | 'result') => void;
  selectedTarget?: string;
  setSelectedTarget?: (target: string) => void;
  onOpenVocabDrawer?: () => void;
  onOpenMistakeModal?: () => void;
  onSelectCategory?: (category: string) => void;
  onStartExam?: (examId?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedTarget,
  setSelectedTarget,
  onOpenVocabDrawer,
  onOpenMistakeModal,
  onSelectCategory,
  onStartExam,
}) => {
  const pathname = usePathname() || '/';
  const router = useRouter();
  let appCtx: any = null;
  try {
    appCtx = useApp();
  } catch (e) {}

  const [userProfile, setUserProfile] = useState<any>({
    name: 'Học viên',
    targetExam: 'IELTS 7.5+',
    currentStreak: 0,
  });
  const [targetList, setTargetList] = useState<string[]>(['IELTS 7.5+', 'CFA Level 1', 'HSK 5 - 6', 'TOEIC 850+', 'GMAT Focus']);
  const [mistakeCount, setMistakeCount] = useState<number>(0);
  const [vocabCount, setVocabCount] = useState<number>(0);

  useEffect(() => {
    // 1. Fetch user profile from BE
    api.user.getProfile().then((data) => {
      if (data) {
        setUserProfile(data);
        if (data.targetExam && !selectedTarget) {
          if (setSelectedTarget) setSelectedTarget(data.targetExam);
          if (appCtx?.setSelectedTarget) appCtx.setSelectedTarget(data.targetExam);
        }
      }
    }).catch(() => {});

    // 2. Fetch targets from BE
    api.catalog.getTargetOptions().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setTargetList(data.map((t: any) => t.label || t.name_vi || t.target_code || t.code));
      }
    }).catch(() => {});

    // 3. Fetch mistake count from BE
    api.notebook.getMistakes().then((res) => {
      if (res?.total !== undefined) setMistakeCount(res.total);
    }).catch(() => {});

    // 4. Fetch vocab count from BE
    api.vocabulary.getSaved().then((res) => {
      if (res?.total !== undefined) setVocabCount(res.total);
    }).catch(() => {});
  }, []);

  const activeTab = currentTab || (
    pathname.startsWith('/exam') ? 'exam' :
    pathname.startsWith('/result') ? 'result' :
    pathname.startsWith('/library') ? 'library' : 'home'
  );

  const activeTarget = selectedTarget || appCtx?.selectedTarget || userProfile?.targetExam || 'IELTS 7.5+';

  const handleSelectTarget = (t: string) => {
    if (setSelectedTarget) setSelectedTarget(t);
    if (appCtx?.setSelectedTarget) appCtx.setSelectedTarget(t);
    api.user.updateTarget(t).catch(() => {});
  };

  const handleOpenMistake = () => {
    if (onOpenMistakeModal) onOpenMistakeModal();
    else if (appCtx?.setIsMistakeModalOpen) appCtx.setIsMistakeModalOpen(true);
  };

  const handleOpenVocab = () => {
    if (onOpenVocabDrawer) onOpenVocabDrawer();
    else if (appCtx?.setIsVocabDrawerOpen) appCtx.setIsVocabDrawerOpen(true);
  };

  const handleGoTab = (tab: 'home' | 'library' | 'exam' | 'result') => {
    if (setCurrentTab) {
      setCurrentTab(tab);
    } else {
      if (tab === 'home') router.push('/');
      else if (tab === 'library') router.push('/library');
      else if (tab === 'exam') router.push(`/exam/${appCtx?.activeExamId || 'ielts-cam-18-test-3'}`);
      else if (tab === 'result') router.push('/result');
    }
  };

  const handleCategoryClick = (categoryKey: string) => {
    setLangDropdownOpen(false);
    setEconDropdownOpen(false);
    setAdmitDropdownOpen(false);
    setMobileMenuOpen(false);
    if (onSelectCategory) {
      onSelectCategory(categoryKey);
    } else if (setCurrentTab) {
      setCurrentTab('library');
    } else {
      router.push(categoryKey === 'all' ? '/library' : `/library?category=${categoryKey}`);
    }
  };

  const handleStartExamAction = (examId: string = 'ielts-cam-18-test-3') => {
    if (appCtx?.setActiveExamId) appCtx.setActiveExamId(examId);
    if (onStartExam) onStartExam(examId);
    else if (setCurrentTab) setCurrentTab('exam');
    else router.push(`/exam/${examId}`);
  };

  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [econDropdownOpen, setEconDropdownOpen] = useState(false);
  const [admitDropdownOpen, setAdmitDropdownOpen] = useState(false);
  const [targetDropdownOpen, setTargetDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileLangOpen, setMobileLangOpen] = useState(false);
  const [mobileEconOpen, setMobileEconOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const econRef = useRef<HTMLDivElement>(null);
  const admitRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (econRef.current && !econRef.current.contains(event.target as Node)) {
        setEconDropdownOpen(false);
      }
      if (admitRef.current && !admitRef.current.contains(event.target as Node)) {
        setAdmitDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const targets = ['IELTS 7.5+', 'CFA Level 1', 'HSK 5 - 6', 'TOEIC 850+', 'GMAT Focus'];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* 1. Top Utility Notification Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Khảo thí tiêu chuẩn quốc tế: Cambridge Assessment · Hanban HSK · CFA Institute · GMAC · ETS
            </span>
          </div>
          <div className="flex items-center gap-5 text-slate-300 text-[11px]">
            <button 
              onClick={handleOpenMistake} 
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-400" />
              <span>Sổ tay lỗi sai ({mistakeCount})</span>
            </button>
            <button 
              onClick={handleOpenVocab} 
              className="hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Từ vựng trọng tâm ({activeTarget}) ({vocabCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-7">
            <button
              onClick={() => handleGoTab('home')}
              className="flex items-center gap-3 text-left focus:outline-none cursor-pointer group shrink-0"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center text-white font-bold shadow-xs transition-transform duration-200 group-hover:scale-105">
                <GraduationCap className="w-5 h-5 text-blue-100" />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5 leading-none">
                  CertPrep <span className="text-blue-700 font-semibold text-xs tracking-normal">Practice Tests</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium block mt-1">Luyện thi chứng chỉ tiêu chuẩn ngành</span>
              </div>
            </button>

            {/* Desktop Navigation Links with Category Dropdowns */}
            <nav className="hidden xl:flex items-center gap-1 text-sm font-medium text-slate-700">
              {/* Trang chủ */}
              <button
                onClick={() => handleGoTab('home')}
                className={`px-3 py-2 rounded-md transition-colors cursor-pointer text-xs font-semibold uppercase tracking-wider ${
                  activeTab === 'home'
                    ? 'text-blue-900 bg-blue-50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Trang chủ
              </button>

              {/* DROPDOWN 1: NGOẠI NGỮ (IELTS, HSK, TOEIC,...) */}
              <div className="relative" ref={langRef}>
                <button
                  type="button"
                  onClick={() => {
                    setLangDropdownOpen(!langDropdownOpen);
                    setEconDropdownOpen(false);
                    setAdmitDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    langDropdownOpen
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  aria-expanded={langDropdownOpen}
                >
                  <Languages className="w-3.5 h-3.5 text-blue-700 mr-0.5" />
                  <span>NGOẠI NGỮ</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180 text-blue-900' : ''}`} />
                </button>

                {/* Dropdown Menu - NGOẠI NGỮ */}
                {langDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Chứng chỉ Ngoại ngữ</span>
                      <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.5 rounded">Khảo thí 2024</span>
                    </div>

                    <div className="p-1 space-y-0.5">
                      {/* IELTS */}
                      <button
                        onClick={() => handleCategoryClick('ielts')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-md bg-blue-50 border border-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-blue-900 group-hover:text-white transition-colors">
                          IELTS
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900">IELTS Academic & General</span>
                            <span className="text-[10px] bg-red-50 text-red-700 font-semibold px-1 rounded">HOT</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Bộ đề Cambridge 16-19, Reading & Listening giải thích chi tiết</p>
                        </div>
                      </button>

                      {/* HSK */}
                      <button
                        onClick={() => handleCategoryClick('hsk')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-md bg-amber-50 border border-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                          HSK
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-amber-800">HSK (Cấp độ 1 - 6)</span>
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-1 rounded">Audio chuẩn</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Khảo thí Hanban Trung Quốc, Pinyin & cấu trúc ngữ pháp</p>
                        </div>
                      </button>

                      {/* TOEIC */}
                      <button
                        onClick={() => handleCategoryClick('toeic')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-md bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-emerald-700 group-hover:text-white transition-colors">
                          ETS
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-emerald-800">TOEIC 4 Kỹ năng (ETS)</span>
                            <span className="text-[10px] text-slate-500">Target 800+</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Format đề mới nhất, bẫy Part 5 & 7 văn bản thương mại</p>
                        </div>
                      </button>

                      {/* TOEFL */}
                      <button
                        onClick={() => handleCategoryClick('toefl')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-indigo-700 group-hover:text-white transition-colors">
                          iBT
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-800">TOEFL iBT Academic</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">Chuẩn khảo thí du học Bắc Mỹ & Châu Âu</p>
                        </div>
                      </button>
                    </div>

                    <div className="p-2 border-t border-slate-100 bg-slate-50/70 rounded-b-xl">
                      <button
                        onClick={() => handleCategoryClick('all')}
                        className="w-full text-center text-xs font-semibold text-blue-900 hover:text-blue-700 py-1 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>Xem toàn bộ đề thi Ngoại ngữ</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* DROPDOWN 2: KINH TẾ (CFA, GMAT, ACCA,...) */}
              <div className="relative" ref={econRef}>
                <button
                  type="button"
                  onClick={() => {
                    setEconDropdownOpen(!econDropdownOpen);
                    setLangDropdownOpen(false);
                    setAdmitDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    econDropdownOpen
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  aria-expanded={econDropdownOpen}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-blue-700 mr-0.5" />
                  <span>KINH TẾ</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${econDropdownOpen ? 'rotate-180 text-blue-900' : ''}`} />
                </button>

                {/* Dropdown Menu - KINH TẾ */}
                {econDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-84 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kinh Tế, Tài Chính & Quản Trị</span>
                      <span className="text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded">Chuyên nghiệp</span>
                    </div>

                    <div className="p-1 space-y-0.5">
                      {/* CFA */}
                      <button
                        onClick={() => handleCategoryClick('cfa')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-md bg-blue-900 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                          CFA
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-blue-900">CFA Level 1, 2, 3</span>
                            <span className="text-[10px] bg-blue-50 text-blue-800 font-semibold px-1 rounded">CFA Institute</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Ethics, Quantitative Methods, Financial Reporting & FSA</p>
                        </div>
                      </button>

                      {/* GMAT */}
                      <button
                        onClick={() => handleCategoryClick('gmat')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-md bg-purple-50 border border-purple-100 text-purple-900 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-purple-900 group-hover:text-white transition-colors">
                          GMAT
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-purple-900">GMAT Focus Edition</span>
                            <span className="text-[10px] bg-purple-50 text-purple-700 font-semibold px-1 rounded">MBA</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Data Insights, Quantitative & Verbal Reasoning cho MBA</p>
                        </div>
                      </button>

                      {/* GRE */}
                      <button
                        onClick={() => handleCategoryClick('gre')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-md bg-cyan-50 border border-cyan-100 text-cyan-900 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-cyan-800 group-hover:text-white transition-colors">
                          GRE
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold text-slate-900 group-hover:text-cyan-900">GRE General Test</span>
                          <p className="text-[11px] text-slate-500 mt-0.5">Lý luận định lượng và suy luận ngôn ngữ sau đại học</p>
                        </div>
                      </button>

                      {/* ACCA */}
                      <button
                        onClick={() => handleCategoryClick('acca')}
                        className="w-full text-left p-2.5 rounded-lg hover:bg-slate-50 transition-colors flex items-start gap-3 cursor-pointer group"
                      >
                        <div className="w-8 h-8 rounded-md bg-rose-50 border border-rose-100 text-rose-900 font-bold text-xs flex items-center justify-center shrink-0 group-hover:bg-rose-900 group-hover:text-white transition-colors">
                          ACCA
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 group-hover:text-rose-900">ACCA (FA, MA, FR)</span>
                            <span className="text-[10px] text-slate-500">UK Standard</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">Kế toán & Kiểm toán quốc tế theo chuẩn IFRS</p>
                        </div>
                      </button>
                    </div>

                    <div className="p-2 border-t border-slate-100 bg-slate-50/70 rounded-b-xl">
                      <button
                        onClick={() => handleCategoryClick('cfa')}
                        className="w-full text-center text-xs font-semibold text-blue-900 hover:text-blue-700 py-1 cursor-pointer flex items-center justify-center gap-1"
                      >
                        <span>Xem toàn bộ đề thi Kinh tế & Tài chính</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* DROPDOWN 3: TUYỂN SINH (SAT, THPTQG, ĐGNL) */}
              <div className="relative" ref={admitRef}>
                <button
                  type="button"
                  onClick={() => {
                    setAdmitDropdownOpen(!admitDropdownOpen);
                    setLangDropdownOpen(false);
                    setEconDropdownOpen(false);
                  }}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    admitDropdownOpen
                      ? 'bg-blue-50 text-blue-900'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  aria-expanded={admitDropdownOpen}
                >
                  <span>TUYỂN SINH</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${admitDropdownOpen ? 'rotate-180 text-blue-900' : ''}`} />
                </button>

                {admitDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Đại Học & Du Học</span>
                    </div>
                    <div className="p-1 space-y-0.5">
                      <button
                        onClick={() => handleCategoryClick('sat')}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">Digital SAT (College Board)</div>
                          <div className="text-[11px] text-slate-500">Mục tiêu 1400 - 1550+ du học Mỹ</div>
                        </div>
                        <span className="text-[10px] bg-blue-50 text-blue-800 font-semibold px-1 rounded">SAT</span>
                      </button>
                      <button
                        onClick={() => handleCategoryClick('thptqg')}
                        className="w-full text-left p-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">THPT Quốc Gia (Bộ GD&ĐT)</div>
                          <div className="text-[11px] text-slate-500">Đề thi thử các trường Chuyên Sư Phạm, KHTN</div>
                        </div>
                        <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-1 rounded">9.0+</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Link: Kho đề thi */}
              <button
                onClick={() => handleGoTab('library')}
                className={`px-3 py-2 rounded-md transition-colors cursor-pointer text-xs font-semibold uppercase tracking-wider ${
                  activeTab === 'library'
                    ? 'text-blue-900 bg-blue-50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Kho đề thi
              </button>

              {/* Direct Link: Phòng thi */}
              <button
                onClick={() => handleGoTab('exam')}
                className={`px-3 py-2 rounded-md transition-colors cursor-pointer text-xs font-semibold uppercase tracking-wider ${
                  activeTab === 'exam'
                    ? 'text-blue-900 bg-blue-50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Phòng thi
              </button>

              {/* Direct Link: Báo cáo kết quả */}
              <button
                onClick={() => handleGoTab('result')}
                className={`px-3 py-2 rounded-md transition-colors cursor-pointer text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                  activeTab === 'result'
                    ? 'text-blue-900 bg-blue-50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                <span>Kết quả</span>
              </button>
            </nav>
          </div>

          {/* Right Actions: Target Selector & Profile & Practice CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Quick Target Selector */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setTargetDropdownOpen(!targetDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-medium border border-slate-300 transition-colors cursor-pointer"
              >
                <span className="text-slate-500 font-normal">Mục tiêu:</span>
                <span className="font-semibold text-slate-900">{activeTarget}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${targetDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {targetDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-50">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Chọn chứng chỉ mục tiêu
                  </div>
                  {targetList.map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        handleSelectTarget(t);
                        setTargetDropdownOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 text-left transition-colors cursor-pointer"
                    >
                      <span className={activeTarget === t ? 'text-blue-900 font-semibold' : ''}>{t}</span>
                      {activeTarget === t && <Check className="w-3.5 h-3.5 text-blue-900" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Sổ tay lỗi sai */}
            <button
              onClick={handleOpenMistake}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              title="Sổ tay ghi chú lỗi sai & bẫy tư duy"
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-900" />
              <span>Sổ lỗi sai</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                {mistakeCount}
              </span>
            </button>

            {/* Quick Sổ từ vựng */}
            <button
              onClick={handleOpenVocab}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200 transition-colors cursor-pointer"
              title="Kho từ vựng học thuật"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
              <span>Từ vựng</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                {vocabCount}
              </span>
            </button>

            {/* Main Action Button - Practice Aptitude Tests Style */}
            <button
              onClick={() => handleStartExamAction('ielts-cam-18-test-3')}
              className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold rounded-md shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Vào thi thử</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Profile Avatar / User button */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-700 transition-colors cursor-pointer"
                title={userProfile.name}
              >
                <span className="text-xs font-bold text-blue-900">NT</span>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">{userProfile.name}</p>
                    <p className="text-[11px] text-slate-500">{userProfile.targetExam}</p>
                    <div className="mt-2 text-[10px] text-blue-900 font-semibold bg-blue-50 px-2 py-0.5 rounded inline-block">
                      Chuỗi học: {userProfile.currentStreak} ngày liên tiếp
                    </div>
                  </div>
                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        handleGoTab('result');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>Báo cáo tiến độ học tập</span>
                      <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        handleOpenMistake();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>Sổ tay ghi chú lỗi sai</span>
                      <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                    </button>
                    <button
                      onClick={() => {
                        handleOpenVocab();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-slate-700 hover:bg-slate-50 flex items-center justify-between"
                    >
                      <span>Kho từ vựng đã lưu</span>
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-md text-slate-700 hover:bg-slate-100 focus:outline-none cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-5 space-y-3">
          <div className="space-y-1">
            <button
              onClick={() => {
                handleGoTab('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-900 rounded-md hover:bg-slate-50"
            >
              Trang chủ
            </button>

            {/* Mobile NGOẠI NGỮ Accordion */}
            <div>
              <button
                onClick={() => setMobileLangOpen(!mobileLangOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-900 rounded-md hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-blue-700" />
                  <span>NGOẠI NGỮ (IELTS, HSK, TOEIC,...)</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileLangOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileLangOpen && (
                <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-blue-900/20 ml-4 mt-1">
                  <button
                    onClick={() => handleCategoryClick('ielts')}
                    className="w-full text-left py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900"
                  >
                    IELTS Academic & General
                  </button>
                  <button
                    onClick={() => handleCategoryClick('hsk')}
                    className="w-full text-left py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900"
                  >
                    HSK (Cấp độ 1 - 6) Hanban
                  </button>
                  <button
                    onClick={() => handleCategoryClick('toeic')}
                    className="w-full text-left py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900"
                  >
                    TOEIC ETS 4 Kỹ năng
                  </button>
                  <button
                    onClick={() => handleCategoryClick('toefl')}
                    className="w-full text-left py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900"
                  >
                    TOEFL iBT Academic
                  </button>
                </div>
              )}
            </div>

            {/* Mobile KINH TẾ Accordion */}
            <div>
              <button
                onClick={() => setMobileEconOpen(!mobileEconOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-sm font-bold text-slate-900 rounded-md hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-700" />
                  <span>KINH TẾ (CFA, GMAT, ACCA,...)</span>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${mobileEconOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileEconOpen && (
                <div className="pl-6 pr-2 py-1 space-y-1 border-l-2 border-blue-900/20 ml-4 mt-1">
                  <button
                    onClick={() => handleCategoryClick('cfa')}
                    className="w-full text-left py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900"
                  >
                    CFA Level 1, 2, 3
                  </button>
                  <button
                    onClick={() => handleCategoryClick('gmat')}
                    className="w-full text-left py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900"
                  >
                    GMAT Focus Edition (MBA)
                  </button>
                  <button
                    onClick={() => handleCategoryClick('gre')}
                    className="w-full text-left py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900"
                  >
                    GRE General Test
                  </button>
                  <button
                    onClick={() => handleCategoryClick('acca')}
                    className="w-full text-left py-1.5 text-xs font-semibold text-slate-700 hover:text-blue-900"
                  >
                    ACCA Financial Accounting (FA)
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => {
                handleGoTab('library');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-900 rounded-md hover:bg-slate-50"
            >
              Kho đề thi & Bộ lọc
            </button>
            <button
              onClick={() => {
                handleGoTab('exam');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-900 rounded-md hover:bg-slate-50"
            >
              Phòng thi mô phỏng
            </button>
            <button
              onClick={() => {
                handleGoTab('result');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-semibold text-slate-900 rounded-md hover:bg-slate-50"
            >
              Báo cáo phân tích kết quả
            </button>
          </div>

          <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => {
                handleOpenMistake();
                setMobileMenuOpen(false);
              }}
              className="p-2 text-center rounded-md bg-slate-100 font-medium text-slate-700 flex items-center justify-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-blue-600" />
              <span>Sổ tay lỗi sai</span>
            </button>
            <button
              onClick={() => {
                handleOpenVocab();
                setMobileMenuOpen(false);
              }}
              className="p-2 text-center rounded-md bg-slate-100 font-medium text-slate-700 flex items-center justify-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
              <span>Từ vựng học thuật</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
