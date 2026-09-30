'use client';

import React, { useState, useEffect } from 'react';
import { X, BookmarkCheck, AlertTriangle, Lightbulb, Target, RefreshCw, CheckCircle2, Trash2 } from 'lucide-react';
import { api } from '../services/api';

interface MistakeNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToTest?: () => void;
}

export const MistakeNotebookModal: React.FC<MistakeNotebookModalProps> = ({
  isOpen,
  onClose,
  onGoToTest,
}) => {
  const [activeTrapTab, setActiveTrapTab] = useState<'all' | 'mindset' | 'vocab' | 'negation'>('all');
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMistakes = () => {
    setLoading(true);
    api.notebook.getMistakes(activeTrapTab !== 'all' ? activeTrapTab : undefined)
      .then((res) => {
        setMistakes(res.items || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isOpen) {
      loadMistakes();
    }
  }, [isOpen, activeTrapTab]);

  const handleToggleResolved = async (id: string, currentResolved: boolean) => {
    try {
      await api.notebook.toggleResolved(id, !currentResolved);
      loadMistakes();
    } catch (e) {}
  };

  const handleDeleteMistake = async (id: string) => {
    try {
      await api.notebook.removeMistake(id);
      loadMistakes();
    } catch (e) {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" 
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center text-white">
                <BookmarkCheck className="w-4 h-4 text-blue-100" />
              </div>
              <div>
                <h3 className="text-base font-bold">Sổ tay ghi chú lỗi sai & Bẫy tư duy</h3>
                <p className="text-xs text-slate-400">Ghi nhận câu sai để ôn luyện lại, không lặp lại bẫy tư duy ({mistakes.length} câu)</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar */}
          <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="font-semibold text-slate-500 mr-2 whitespace-nowrap">Dạng bẫy:</span>
            <button
              onClick={() => setActiveTrapTab('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTrapTab === 'all'
                  ? 'bg-blue-900 text-white font-semibold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Tất cả lỗi sai ({mistakes.length})
            </button>
            <button
              onClick={() => setActiveTrapTab('mindset')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTrapTab === 'mindset'
                  ? 'bg-blue-900 text-white font-semibold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Bẫy tư duy / Not Given
            </button>
            <button
              onClick={() => setActiveTrapTab('vocab')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTrapTab === 'vocab'
                  ? 'bg-blue-900 text-white font-semibold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Bẫy từ vựng & Paraphrase
            </button>
            <button
              onClick={() => setActiveTrapTab('negation')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                activeTrapTab === 'negation'
                  ? 'bg-blue-900 text-white font-semibold'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Bẫy ngữ pháp đảo ngữ
            </button>
          </div>

          {/* Mistakes Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-400 text-sm">Đang tải sổ tay lỗi sai từ máy chủ...</div>
            ) : mistakes.length === 0 ? (
              <div className="text-center py-16 px-4 flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-4">
                  <BookmarkCheck className="w-7 h-7 text-slate-400" />
                </div>
                <h4 className="text-base font-bold text-slate-800">Sổ tay lỗi sai hiện đang trống</h4>
                <p className="text-xs text-slate-500 max-w-md mt-1.5 leading-relaxed text-center">
                  Hệ thống sẽ tự động ghi nhận các câu làm sai và phân tích bẫy tư duy khi bạn làm bài thi. Bạn cũng có thể lưu bất kỳ câu hỏi nào từ trang kết quả để ôn tập sau.
                </p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-50 text-blue-900 text-xs font-medium border border-blue-100">
                  <Lightbulb className="w-4 h-4 text-blue-800" />
                  <span>Mẹo: Ôn tập lại câu sai định kỳ giúp bạn không lặp lại bẫy tư duy tương tự</span>
                </div>
              </div>
            ) : (
              mistakes.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-xl border p-5 shadow-xs transition-colors space-y-3 ${
                    item.isResolved ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        Câu {item.questionNumber}
                      </span>
                      <span className="font-medium text-slate-600">{item.testName}</span>
                      <span className="text-slate-400">·</span>
                      <span className="text-slate-500">{item.section}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {item.isResolved && (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Đã khắc phục
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 font-semibold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                        {item.trapCategoryLabel}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-slate-800 leading-snug">{item.questionText}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-50/80 border border-rose-200 text-rose-900">
                      <span className="font-semibold block mb-0.5">Lựa chọn của bạn:</span>
                      <span className="font-mono">{item.yourAnswer}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-emerald-900">
                      <span className="font-semibold block mb-0.5">Đáp án chuẩn xác:</span>
                      <span className="font-mono font-bold">{item.correctAnswer}</span>
                    </div>
                  </div>

                  {/* Trap Explanation */}
                  <div className="text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <Target className="w-4 h-4 text-blue-800" />
                      <span>Bản chất bẫy câu hỏi:</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed pl-5">{item.trapExplanation}</p>
                  </div>

                  {/* Golden Rule */}
                  {item.goldenRule && (
                    <div className="text-xs bg-amber-50/80 p-3 rounded-lg border border-amber-200 text-amber-900 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">{item.goldenRule}</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => handleToggleResolved(item.id, !!item.isResolved)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                        item.isResolved ? 'text-slate-600 hover:bg-slate-100' : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{item.isResolved ? 'Đánh dấu chưa giải quyết' : 'Đánh dấu đã hiểu bài'}</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteMistake(item.id)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa khỏi sổ tay"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {item.retakeAvailable && (
                        <button
                          onClick={() => {
                            onClose();
                            if (onGoToTest) onGoToTest();
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Làm lại câu này</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-slate-500">Mẹo: Ôn tập sổ lỗi sai định kỳ mỗi 3 ngày giúp tăng 0.5 - 1.0 Band.</span>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md bg-blue-900 text-white font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Đóng sổ tay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
