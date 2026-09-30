'use client';

import React from 'react';

export interface University {
  id: string;
  name: string;
  shortName: string;
  subTitle: string;
  country: string;
  studentCount: string;
  popularCerts: string[];
}

export const UNIVERSITIES: University[] = [
  {
    id: 'ftu',
    name: 'Đại học Ngoại Thương',
    shortName: 'FTU',
    subTitle: 'Foreign Trade University',
    country: 'Hà Nội & TP.HCM',
    studentCount: '6,400+ sinh viên',
    popularCerts: ['IELTS 7.5+', 'CFA Level 1', 'TOEIC 900'],
  },
  {
    id: 'neu',
    name: 'Đại học Kinh tế Quốc dân',
    shortName: 'NEU',
    subTitle: 'National Economics University',
    country: 'Hà Nội',
    studentCount: '7,800+ sinh viên',
    popularCerts: ['CFA', 'GMAT', 'IELTS', 'ACCA'],
  },
  {
    id: 'rmit',
    name: 'RMIT University',
    shortName: 'RMIT',
    subTitle: 'RMIT University Vietnam',
    country: 'Vietnam / Australia',
    studentCount: '4,200+ sinh viên',
    popularCerts: ['IELTS 7.5+', 'CFA', 'GMAT'],
  },
  {
    id: 'vnu',
    name: 'Đại học Quốc gia Hà Nội',
    shortName: 'VNU',
    subTitle: 'Vietnam National University',
    country: 'Hà Nội',
    studentCount: '9,100+ sinh viên',
    popularCerts: ['IELTS', 'HSK 5-6', 'SAT', 'ĐGNL'],
  },
  {
    id: 'ueh',
    name: 'Đại học Kinh tế TP.HCM',
    shortName: 'UEH',
    subTitle: 'University of Economics HCMC',
    country: 'TP. Hồ Chí Minh',
    studentCount: '6,800+ sinh viên',
    popularCerts: ['CFA', 'TOEIC', 'ACCA', 'GMAT'],
  },
  {
    id: 'hust',
    name: 'Đại học Bách Khoa Hà Nội',
    shortName: 'HUST',
    subTitle: 'Hanoi University of Science and Tech',
    country: 'Hà Nội',
    studentCount: '5,500+ sinh viên',
    popularCerts: ['TOEIC 850+', 'IELTS', 'GRE Quant'],
  },
  {
    id: 'oxford',
    name: 'University of Oxford',
    shortName: 'OXFORD',
    subTitle: 'University of Oxford, UK',
    country: 'United Kingdom',
    studentCount: 'Du học & Sau ĐH',
    popularCerts: ['IELTS Academic 8.0', 'GMAT 720+'],
  },
  {
    id: 'cambridge',
    name: 'University of Cambridge',
    shortName: 'CAMBRIDGE',
    subTitle: 'University of Cambridge, UK',
    country: 'United Kingdom',
    studentCount: 'Du học & Sau ĐH',
    popularCerts: ['Cambridge Assessment', 'CFA'],
  },
  {
    id: 'harvard',
    name: 'Harvard University',
    shortName: 'HARVARD',
    subTitle: 'Harvard Business School / College',
    country: 'United States',
    studentCount: 'MBA & Sau ĐH',
    popularCerts: ['GMAT Focus 685+', 'GRE'],
  },
  {
    id: 'lse',
    name: 'London School of Economics',
    shortName: 'LSE',
    subTitle: 'LSE Political Science & Econ',
    country: 'United Kingdom',
    studentCount: 'Tài chính & Kinh tế',
    popularCerts: ['CFA', 'GMAT', 'IELTS 7.5+'],
  },
];

import { api } from '../services/api';

export const UniversityLogos: React.FC = () => {
  const [items, setItems] = React.useState<University[]>(UNIVERSITIES);

  React.useEffect(() => {
    api.catalog.getUniversities().then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        setItems(
          data.map((u: any) => ({
            id: u.id,
            name: u.name,
            shortName: u.short_name || u.shortName || u.name,
            subTitle: u.subtitle || u.subTitle || '',
            country: u.country_region || u.country || 'Việt Nam',
            studentCount: u.student_count_display || u.studentCount || '5,000+ sinh viên',
            popularCerts: u.popular_certs || u.popularCerts || [],
          }))
        );
      }
    }).catch(() => {});
  }, []);

  return (
    <div className="bg-white border-b border-slate-200 py-8 lg:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Label & Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <p className="text-xs uppercase tracking-widest font-bold text-slate-500">
            Mạng lưới đối tác & người học tiêu biểu
          </p>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Được tin dùng bởi hơn 85,000+ sinh viên và học viên từ các trường đại học hàng đầu
          </h2>
        </div>

        {/* University Logos Grid - Clean Practice Aptitude Tests Style */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 lg:gap-4">
          {items.map((uni) => (
            <div
              key={uni.id}
              className="group relative flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-900/30 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              {/* Crest / Emblem SVG */}
              <div className="w-12 h-12 flex items-center justify-center mb-2.5 transition-transform duration-200 group-hover:scale-105">
                {renderUniversityCrest(uni.id)}
              </div>

              {/* Name & Subtitle */}
              <div className="text-center">
                <span className="block text-xs font-bold text-slate-900 group-hover:text-blue-900 transition-colors line-clamp-1">
                  {uni.name}
                </span>
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  {uni.shortName}
                </span>
              </div>

              {/* Tooltip on hover with details */}
              <div className="pointer-events-none absolute -bottom-2 translate-y-full left-1/2 -translate-x-1/2 z-30 hidden group-hover:flex flex-col items-center w-56 p-2.5 bg-slate-900 text-white rounded-lg shadow-xl text-left border border-slate-700 animate-in fade-in-0 duration-150">
                <div className="w-full flex items-center justify-between border-b border-slate-700 pb-1.5 mb-1.5">
                  <span className="font-bold text-xs text-blue-300">{uni.shortName}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                    {uni.studentCount}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 leading-tight mb-1 font-medium">
                  {uni.subTitle}
                </div>
                <div className="text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-200">Trọng tâm:</span> {uni.popularCerts.join(' · ')}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Under-bar endorsement stats */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-slate-600 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Tỷ lệ đạt mục tiêu đợt 1: <strong className="text-slate-900">89.4%</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600"></span>
            <span>Ngân hàng đề thi cập nhật: <strong className="text-slate-900">2024 - 2026</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Chấm điểm theo thang chuẩn: <strong className="text-slate-900">Cambridge · ETS · CFA</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

// High-fidelity vector crests for the universities
function renderUniversityCrest(id: string) {
  switch (id) {
    case 'ftu':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect width="48" height="48" rx="8" fill="#991B1B" />
          <path d="M24 8L36 16V28C36 34 24 40 24 40C24 40 12 34 12 28V16L24 8Z" fill="#7F1D1D" stroke="#FDE047" strokeWidth="1.5" />
          <path d="M24 14V34M16 22L24 18L32 22M18 30L24 26L30 30" stroke="#FEF08A" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="24" r="3" fill="#FACC15" />
        </svg>
      );
    case 'neu':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect width="48" height="48" rx="8" fill="#1E3A8A" />
          <circle cx="24" cy="24" r="16" stroke="#93C5FD" strokeWidth="1.5" fill="#172554" />
          <path d="M16 26C18 23 21 21 24 21C27 21 30 23 32 26" stroke="#60A5FA" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24 12V36M12 24H36" stroke="#93C5FD" strokeWidth="1.2" strokeDasharray="2 2" />
          <path d="M18 29L24 24L30 29" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="24" cy="20" r="2.5" fill="#FDE047" />
        </svg>
      );
    case 'rmit':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect width="48" height="48" rx="8" fill="#DC2626" />
          <rect x="8" y="10" width="32" height="28" rx="4" fill="#B91C1C" />
          <path d="M14 30V18H20C22.2 18 23.5 19.2 23.5 21C23.5 22.8 22 24 20 24H14M20 24L24 30" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M27 18L31 30L35 18" stroke="#FEF08A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M33 13L39 13L36 16Z" fill="#FBBF24" />
        </svg>
      );
    case 'vnu':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect width="48" height="48" rx="8" fill="#065F46" />
          <circle cx="24" cy="24" r="16" fill="#047857" stroke="#A7F3D0" strokeWidth="1.5" />
          <circle cx="24" cy="24" r="11" stroke="#D1FAE5" strokeWidth="1" strokeDasharray="3 2" />
          <path d="M24 15V33M19 19L24 16L29 19M18 25C20 23 22 23 24 23C26 23 28 23 30 25" stroke="#FDE047" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="24" cy="27" r="2" fill="#FEF08A" />
        </svg>
      );
    case 'ueh':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect width="48" height="48" rx="8" fill="#0F766E" />
          <path d="M12 14H36V26C36 33 24 38 24 38C24 38 12 33 12 26V14Z" fill="#115E59" stroke="#5EEAD4" strokeWidth="1.5" />
          <path d="M18 22V28M24 18V32M30 24V28" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="24" cy="16" r="2" fill="#FDE047" />
        </svg>
      );
    case 'hust':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect width="48" height="48" rx="8" fill="#7F1D1D" />
          <circle cx="24" cy="24" r="16" stroke="#FCA5A5" strokeWidth="1.5" />
          {/* Compass / Gear icon */}
          <path d="M24 12L28 24L24 36L20 24Z" fill="#EF4444" stroke="#FEE2E2" strokeWidth="1.2" />
          <circle cx="24" cy="24" r="4" fill="#B91C1C" stroke="#FEF08A" strokeWidth="1.5" />
          <path d="M12 24H36M24 12V36" stroke="#FECACA" strokeWidth="1" strokeDasharray="2 2" />
        </svg>
      );
    case 'oxford':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect width="48" height="48" rx="8" fill="#002147" />
          <path d="M13 12H35V26C35 33 24 38 24 38C24 38 13 33 13 26V12Z" fill="#0A2F5C" stroke="#93C5FD" strokeWidth="1.5" />
          {/* 3 Crowns and Book */}
          <path d="M17 18L19 16L21 18M27 18L29 16L31 18" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
          <rect x="18" y="22" width="12" height="8" rx="1.5" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
          <path d="M24 22V30M20 25H28M20 28H28" stroke="#92400E" strokeWidth="0.8" />
          <path d="M22 34L24 32L26 34" stroke="#FBBF24" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'cambridge':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect width="48" height="48" rx="8" fill="#A51C30" />
          <path d="M13 12H35V26C35 33 24 38 24 38C24 38 13 33 13 26V12Z" fill="#881337" stroke="#FECDD3" strokeWidth="1.5" />
          {/* St George cross with lion & book */}
          <path d="M24 13V37M14 24H34" stroke="#FFFFFF" strokeWidth="2.5" />
          <rect x="20" y="21" width="8" height="6" rx="1" fill="#FEF3C7" stroke="#B45309" strokeWidth="0.8" />
          <circle cx="18" cy="18" r="1.5" fill="#FBBF24" />
          <circle cx="30" cy="18" r="1.5" fill="#FBBF24" />
          <circle cx="18" cy="30" r="1.5" fill="#FBBF24" />
          <circle cx="30" cy="30" r="1.5" fill="#FBBF24" />
        </svg>
      );
    case 'harvard':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect width="48" height="48" rx="8" fill="#A51C30" />
          <path d="M14 12H34V27C34 33 24 38 24 38C24 38 14 33 14 27V12Z" fill="#7F1D1D" stroke="#FFFFFF" strokeWidth="1.5" />
          {/* 3 Books with VE - RI - TAS */}
          <rect x="17" y="16" width="6" height="5" rx="0.5" fill="#FFFFFF" />
          <text x="20" y="20" fill="#7F1D1D" fontSize="3.5" fontWeight="bold" textAnchor="middle">VE</text>
          
          <rect x="25" y="16" width="6" height="5" rx="0.5" fill="#FFFFFF" />
          <text x="28" y="20" fill="#7F1D1D" fontSize="3.5" fontWeight="bold" textAnchor="middle">RI</text>
          
          <rect x="21" y="24" width="6" height="5" rx="0.5" fill="#FFFFFF" />
          <text x="24" y="28" fill="#7F1D1D" fontSize="3" fontWeight="bold" textAnchor="middle">TAS</text>
        </svg>
      );
    case 'lse':
      return (
        <svg viewBox="0 0 48 48" className="w-10 h-10" fill="none">
          <rect width="48" height="48" rx="8" fill="#18181B" />
          <rect x="10" y="10" width="28" height="28" rx="4" fill="#27272A" stroke="#DC2626" strokeWidth="2" />
          <text x="24" y="23" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle" letterSpacing="0.5">LSE</text>
          <text x="24" y="32" fill="#EF4444" fontSize="5" fontWeight="bold" textAnchor="middle">ECON</text>
        </svg>
      );
    default:
      return null;
  }
}
