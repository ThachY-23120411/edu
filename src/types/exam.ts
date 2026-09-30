export type ExamCategory = 
  | 'all' 
  | 'ielts' 
  | 'hsk' 
  | 'toeic' 
  | 'toefl'
  | 'cfa' 
  | 'gmat' 
  | 'gre' 
  | 'acca' 
  | 'thptqg' 
  | 'sat';

export type CertificateDomain = 'foreign-language' | 'economics' | 'admissions';

export type SkillType = 'all' | 'reading' | 'listening' | 'writing' | 'speaking' | 'grammar';

export type DifficultyLevel = 'all' | 'easy' | 'medium' | 'hard' | 'expert';

export interface QuestionOption {
  id: string; // 'A' | 'B' | 'C' | 'D'
  text: string;
  translation?: string;
}

export interface Question {
  id: number;
  section: string; // 'Passage 1', 'Passage 2', etc.
  type: 'multiple-choice' | 'true-false-not-given' | 'matching-headings' | 'sentence-completion';
  typeNameVi: string;
  prompt: string;
  promptVi?: string;
  options: QuestionOption[];
  correctAnswer: string;
  userAnswer?: string;
  isFlagged?: boolean;
  notes?: string;
  explanation: {
    correctText: string;
    evidenceLocation: string;
    evidenceQuote: string;
    vocabularyTrap?: string;
    mindsetTrap?: string;
    goldenRule?: string;
  };
}

export interface ExamPassage {
  id: string;
  title: string;
  subtitle?: string;
  figureCaption?: string;
  image?: string;
  paragraphs: {
    index: number;
    label: string; // '[Paragraph 1]'
    content: string;
  }[];
}

export interface Exam {
  id: string;
  title: string;
  subtitle?: string;
  category: ExamCategory;
  domain?: CertificateDomain;
  categoryLabel: string;
  subBadge?: string;
  badgeType?: 'hot' | 'new' | 'free' | 'audio' | 'video';
  tags: string[];
  passagesSummary?: string;
  audioDuration?: string;
  hasAudio?: boolean;
  hasVideoSolution?: boolean;
  totalQuestions: number;
  durationMinutes: number;
  testTakersCount: string;
  rating: number;
  reviewCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  difficultyLabel: string;
  passages?: ExamPassage[];
  questions?: Question[];
}

export interface VocabItem {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  meaningVi: string;
  exampleEn: string;
  exampleVi: string;
  collocation?: string;
  isSaved?: boolean;
}

export interface ExamResultSummary {
  examId: string;
  examTitle: string;
  category: string;
  bandScore: number; // e.g. 7.5
  totalScoreString: string; // '7.5 Band' or '8.8 / 10'
  correctCount: number;
  totalQuestions: number;
  accuracyPercentage: number;
  timeSpentMinutes: number;
  timeSpentSeconds: number;
  timeComparisonText: string; // 'Nhanh hơn 8 phút'
  percentileRank: number; // Top 14%
  beatenPercentage: number; // 86%
  totalParticipants: number; // 4820
  targetComparison: string; // 'Xuất sắc! Vượt mục tiêu Band 7.0 của bạn'
  skillBreakdown: {
    skillName: string;
    correct: number;
    total: number;
    percentage: number;
    status: 'Tối đa' | 'Mạnh' | 'Cần cải thiện' | 'Khá';
    statusColor: string;
  }[];
}
