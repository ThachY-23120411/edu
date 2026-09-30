'use client';

import React from 'react';
import { BookOpen, ShieldCheck, Bookmark, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand & Overview */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center text-white font-bold">
                <BookOpen className="w-4 h-4 text-blue-100" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">CertPrep Pro</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Nền tảng thi thử và luyện thi chứng chỉ tiêu chuẩn quốc tế: IELTS, HSK & TOEIC. Mô phỏng phòng thi thật, chấm điểm tự động và phân tích lời giải chi tiết.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Dữ liệu đề cập nhật chuẩn khảo thí 2024 - 2026</span>
            </div>
          </div>

          {/* Test tracks */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Luyện thi IELTS</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">IELTS Academic Reading & Listening</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Trọn bộ Cambridge IELTS 15 - 19</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Dạng bài True / False / Not Given</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Matching Headings & Information</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Luyện thi HSK & TOEIC</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">HSK 3, 4, 5, 6 - Đề chuẩn Hanban</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Kho từ vựng HSK cốt lõi có audio</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">TOEIC ETS Full Mock Tests</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Đề thi thử THPT Quốc Gia môn Tiếng Anh</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Tính năng & Quy chuẩn</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><span className="hover:text-white transition-colors cursor-pointer">Phòng thi máy tính chuẩn Cambridge</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Sổ tay chẩn đoán bẫy đề & lỗi sai</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Tra cứu từ vựng học thuật tức thì</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Báo cáo phân tích điểm bách phân (Percentile)</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 CertPrep Practice Tests. Chuẩn khảo thí quốc tế.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Điều khoản dịch vụ</span>
            <span className="hover:text-slate-400 cursor-pointer">Chính sách bảo mật</span>
            <span className="hover:text-slate-400 cursor-pointer">Hướng dẫn làm bài thi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
