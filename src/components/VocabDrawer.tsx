'use client';

import React, { useState, useEffect } from 'react';
import { X, Volume2, Bookmark, BookmarkCheck, Search, Sparkles, Check } from 'lucide-react';
import { VocabItem } from '../types/exam';
import { api } from '../services/api';

interface VocabDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VocabDrawer: React.FC<VocabDrawerProps> = ({ isOpen, onClose }) => {
  const [vocabList, setVocabList] = useState<VocabItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSavedOnly, setFilterSavedOnly] = useState(false);
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const loadVocabData = async () => {
    try {
      const [termsRes, savedRes] = await Promise.all([
        api.vocabulary.getTerms(),
        api.vocabulary.getSaved(),
      ]);

      const savedIds = new Set((savedRes.items || []).map((s: any) => s.id || s.vocab_id));

      if (termsRes.items && termsRes.items.length > 0) {
        const formatted: VocabItem[] = termsRes.items.map((t: any) => ({
          id: t.id,
          word: t.word,
          phonetic: t.phonetic || '',
          partOfSpeech: t.part_of_speech || 'n/a',
          meaningVi: t.meaning_vi || '',
          exampleEn: t.example_en || '',
          exampleVi: t.example_vi || '',
          collocation: t.collocation,
          isSaved: savedIds.has(t.id),
        }));
        setVocabList(formatted);
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (isOpen) {
      loadVocabData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSave = async (id: string) => {
    const item = vocabList.find((v) => v.id === id);
    if (!item) return;

    const willSave = !item.isSaved;
    setVocabList((prev) =>
      prev.map((v) => (v.id === id ? { ...v, isSaved: willSave } : v))
    );

    try {
      if (willSave) {
        await api.vocabulary.saveWord({ vocabId: id });
      } else {
        await api.vocabulary.removeWord(id);
      }
    } catch (e) {
      // Revert on error
      setVocabList((prev) =>
        prev.map((v) => (v.id === id ? { ...v, isSaved: !willSave } : v))
      );
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      setSpeakingWord(text);
      utterance.onend = () => setSpeakingWord(null);
      utterance.onerror = () => setSpeakingWord(null);
      window.speechSynthesis.speak(utterance);
    }
  };

  const filtered = vocabList.filter((item) => {
    const matchesSearch =
      item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaningVi.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSaved = !filterSavedOnly || item.isSaved;
    return matchesSearch && matchesSaved;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Drawer Header */}
          <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-800 flex items-center justify-center text-white">
                <Bookmark className="w-4 h-4 text-blue-100" />
              </div>
              <div>
                <h3 className="text-base font-bold">Từ Vựng Trọng Tâm Bài Đọc</h3>
                <p className="text-xs text-slate-400">{vocabList.length} từ khóa Academic band 7.0 - 8.5+</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Filter Controls */}
          <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Tìm từ vựng, nghĩa tiếng Việt..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500 font-medium">Hiển thị {filtered.length} từ</span>
              <button
                onClick={() => setFilterSavedOnly(!filterSavedOnly)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  filterSavedOnly
                    ? 'bg-amber-100 text-amber-800 font-semibold'
                    : 'text-slate-600 hover:bg-slate-200/60'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Chỉ từ đã lưu ({vocabList.filter((v) => v.isSaved).length})</span>
              </button>
            </div>
          </div>

          {/* Vocab Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
            {filtered.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 group">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-slate-900 tracking-tight">{item.word}</span>
                    <span className="text-xs font-mono text-slate-500">{item.phonetic}</span>
                    <span className="text-[11px] font-medium px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded">
                      {item.partOfSpeech}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleSpeak(item.word)}
                      className={`p-1.5 rounded-lg text-slate-500 hover:text-blue-900 hover:bg-blue-50 transition-colors cursor-pointer ${
                        speakingWord === item.word ? 'text-blue-900 bg-blue-50 animate-pulse' : ''
                      }`}
                      title="Nghe phát âm chuẩn"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleSave(item.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        item.isSaved
                          ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                          : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                      }`}
                      title={item.isSaved ? 'Đã lưu vào sổ tay' : 'Lưu vào sổ tay'}
                    >
                      {item.isSaved ? (
                        <BookmarkCheck className="w-4 h-4 fill-amber-500 text-amber-600" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="mt-1.5 text-xs text-blue-900 font-semibold bg-blue-50/70 px-2.5 py-1.5 rounded-md border border-blue-100/50">
                  {item.meaningVi}
                </div>

                {item.collocation && (
                  <div className="mt-1.5 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-600">Cụm từ: </span>
                    <span className="italic font-medium text-slate-700">{item.collocation}</span>
                  </div>
                )}

                <div className="mt-2 text-xs text-slate-600 border-l-2 border-slate-300 pl-2.5 space-y-0.5 bg-slate-50/50 py-1 rounded-r">
                  <p className="italic text-slate-800 font-normal">"{item.exampleEn}"</p>
                  <p className="text-[11px] text-slate-500">→ {item.exampleVi}</p>
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 px-4 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
                  <Bookmark className="w-6 h-6 text-slate-400" />
                </div>
                <h5 className="text-sm font-bold text-slate-800">
                  {filterSavedOnly ? 'Chưa có từ vựng nào được lưu' : 'Không tìm thấy từ vựng phù hợp'}
                </h5>
                <p className="text-xs text-slate-500 max-w-xs mt-1 text-center leading-relaxed">
                  {filterSavedOnly
                    ? 'Bạn có thể bấm biểu tượng Bookmark cạnh bất kỳ từ vựng nào hoặc click đúp vào từ trong bài đọc để lưu vào sổ tay cá nhân.'
                    : 'Hãy thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc tìm kiếm.'}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span>Tra từ nhanh: Click đúp vào từ bất kỳ trong bài đọc</span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-blue-900 text-white rounded-md font-semibold hover:bg-blue-800 transition-colors cursor-pointer"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
