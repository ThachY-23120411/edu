'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  selectedTarget: string;
  setSelectedTarget: (target: string) => void;
  isVocabDrawerOpen: boolean;
  setIsVocabDrawerOpen: (open: boolean) => void;
  isMistakeModalOpen: boolean;
  setIsMistakeModalOpen: (open: boolean) => void;
  activeExamId: string;
  setActiveExamId: (examId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedTarget, setSelectedTarget] = useState<string>('IELTS 7.5+');
  const [isVocabDrawerOpen, setIsVocabDrawerOpen] = useState(false);
  const [isMistakeModalOpen, setIsMistakeModalOpen] = useState(false);
  const [activeExamId, setActiveExamId] = useState<string>('ielts-cam-18-test-3');

  return (
    <AppContext.Provider
      value={{
        selectedTarget,
        setSelectedTarget,
        isVocabDrawerOpen,
        setIsVocabDrawerOpen,
        isMistakeModalOpen,
        setIsMistakeModalOpen,
        activeExamId,
        setActiveExamId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
