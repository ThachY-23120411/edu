'use client';

import React from 'react';
import { Volume2, Bookmark, BookmarkCheck, X, Sparkles } from 'lucide-react';

interface DictionaryPopupProps {
  word: string;
  phonetic?: string;
  meaning: string;
  example?: string;
  position: { x: number; y: number } | null;
  onClose: () => void;
  onSaveWord?: (word: string) => void;
  isSaved?: boolean;
}

export const DictionaryPopup: React.FC<DictionaryPopupProps> = ({
  word,
  phonetic = '/.../',
  meaning,
  example,
  position,
  onClose,
  onSaveWord,
  isSaved = false,
}) => {
  if (!position) return null;

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div
      style={{
        top: Math.max(10, position.y - 120),
        left: Math.min(window.innerWidth - 300, Math.max(16, position.x - 140)),
      }}
      className="fixed z-50 w-72 bg-slate-900 text-white rounded-2xl shadow-2xl p-3.5 border border-slate-700 animate-in fade-in zoom-in-95 duration-150"
    >
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-indigo-300">{word}</span>
          <span className="text-[11px] font-mono text-slate-400">{phonetic}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleSpeak}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
            title="Phát âm"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-2 text-xs text-slate-200 leading-relaxed font-medium">
        {meaning}
      </div>

      {example && (
        <div className="mt-1.5 text-[11px] text-slate-400 italic border-l-2 border-indigo-500 pl-2">
          "{example}"
        </div>
      )}

      <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Tra cứu nhanh
        </span>
        {onSaveWord && (
          <button
            onClick={() => onSaveWord(word)}
            className="flex items-center gap-1 text-indigo-300 hover:text-indigo-200 font-semibold"
          >
            {isSaved ? (
              <>
                <BookmarkCheck className="w-3 h-3 text-amber-400" /> Đã lưu
              </>
            ) : (
              <>
                <Bookmark className="w-3 h-3" /> Lưu từ này
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
