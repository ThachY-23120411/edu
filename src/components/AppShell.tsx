'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { VocabDrawer } from './VocabDrawer';
import { MistakeNotebookModal } from './MistakeNotebookModal';
import { useApp } from '../context/AppContext';

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname() || '/';
  const { 
    isVocabDrawerOpen, 
    setIsVocabDrawerOpen, 
    isMistakeModalOpen, 
    setIsMistakeModalOpen 
  } = useApp();

  const isExamPage = pathname.startsWith('/exam');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-900 selection:text-white">
      <Navbar />
      <div className="flex-1">
        {children}
      </div>
      <VocabDrawer
        isOpen={isVocabDrawerOpen}
        onClose={() => setIsVocabDrawerOpen(false)}
      />
      <MistakeNotebookModal
        isOpen={isMistakeModalOpen}
        onClose={() => setIsMistakeModalOpen(false)}
      />
      {!isExamPage && <Footer />}
    </div>
  );
};
