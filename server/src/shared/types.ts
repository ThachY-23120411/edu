export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface UserEntity {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  avatar_url?: string;
  role: 'student' | 'instructor' | 'admin';
  status: 'active' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface UserProfileEntity {
  id: string;
  user_id: string;
  target_exam: string;
  current_streak: number;
  completed_today: number;
  goal_today: number;
  coins: number;
  notifications_count: number;
  updated_at: string;
}

export interface TargetOptionEntity {
  code: string;
  label: string;
  category_code?: string;
  display_order: number;
  is_active: boolean;
}

export interface UserDailyActivityEntity {
  id: string;
  user_id: string;
  activity_date: string;
  day_label: string;
  completed: boolean;
  score: number;
  minutes_studied: number;
}

export interface CertificateDomainEntity {
  code: string;
  name_vi: string;
  description?: string;
  icon_name?: string;
  display_order: number;
}

export interface ExamCategoryEntity {
  code: string;
  domain_code: string;
  name: string;
  short_name: string;
  standard_org: string;
  target_score_range?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

export interface HeroQuickSearchChipEntity {
  id: string;
  label: string;
  category_code: string;
  search_keyword: string;
  display_order: number;
  is_active: boolean;
}

export interface ExamSkillEntity {
  code: string;
  category_code?: string;
  name?: string;
  name_vi: string;
  icon_name?: string;
  display_order: number;
}

export interface ExamEntity {
  id: string;
  category_code: string;
  title: string;
  subtitle?: string;
  category_label: string;
  sub_badge?: string;
  badge_type?: 'hot' | 'new' | 'free' | 'audio' | 'video';
  difficulty: 'easy' | 'medium' | 'hard';
  difficulty_label: string;
  passages_summary?: string;
  total_questions: number;
  duration_minutes: number;
  test_takers_count: number;
  rating: number;
  review_count: number;
  has_audio: boolean;
  audio_duration?: string;
  audio_url?: string;
  has_video_solution: boolean;
  video_solution_url?: string;
  is_published: boolean;
  tags: string[];
  created_at: string;
}

export interface ExamPassageEntity {
  id: string;
  exam_id: string;
  section_number: number;
  section_label: string;
  title: string;
  subtitle?: string;
  figure_caption?: string;
  figure_image_url?: string;
  audio_track_url?: string;
  display_order: number;
  paragraphs: {
    index: number;
    label: string;
    content: string;
  }[];
}

export interface QuestionOptionEntity {
  id: string;
  question_id: number;
  option_identifier: string;
  text_en: string;
  text_vi?: string;
  display_order: number;
}

export interface QuestionExplanationEntity {
  id: string;
  question_id: number;
  correct_text: string;
  evidence_location: string;
  evidence_quote: string;
  vocabulary_trap?: string;
  mindset_trap?: string;
  golden_rule?: string;
  video_explanation_url?: string;
}

export interface QuestionEntity {
  id: number;
  exam_id: string;
  passage_id?: string;
  question_type_code: string;
  question_type_name_vi: string;
  question_number: number;
  section_name: string;
  prompt: string;
  prompt_vi?: string;
  correct_answer: string;
  score_weight: number;
  display_order: number;
  options: QuestionOptionEntity[];
  explanation?: QuestionExplanationEntity;
}

export interface ExamAttemptEntity {
  id: string;
  user_id: string;
  exam_id: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  started_at: string;
  completed_at?: string;
  updated_at: string;
  duration_seconds_spent: number;
  remaining_seconds_saved: number;
  current_question_index_saved: number;
  total_questions: number;
  correct_count: number;
  incorrect_count: number;
  skipped_count: number;
  accuracy_percentage: number;
  raw_score: number;
  band_score: number;
  total_score_string: string;
  time_comparison_text: string;
  percentile_rank: number;
  beaten_percentage: number;
  total_participants_benchmark: number;
  target_comparison_message: string;
}

export interface ExamAttemptAnswerEntity {
  id: string;
  attempt_id: string;
  question_id: number;
  user_answer?: string;
  is_correct: boolean;
  is_flagged: boolean;
  time_spent_seconds: number;
  candidate_notes?: string;
  updated_at: string;
}

export interface ExamAttemptSkillBreakdownEntity {
  id: string;
  attempt_id: string;
  skill_name: string;
  question_type_code?: string;
  correct_count: number;
  total_questions: number;
  percentage: number;
  status_label: 'Tối đa' | 'Mạnh' | 'Cần cải thiện' | 'Khá';
  status_color_class: string;
  feedback_note: string;
  is_weak: boolean;
}

export interface UserMistakeNotebookEntity {
  id: string;
  user_id: string;
  question_id: number;
  attempt_id?: string;
  test_name: string;
  section: string;
  question_number: number;
  question_type: string;
  question_text: string;
  trap_type_code: 'mindset' | 'vocab' | 'negation' | 'grammar';
  custom_trap_label: string;
  your_answer_recorded: string;
  correct_answer_recorded: string;
  trap_explanation: string;
  golden_rule: string;
  user_notes?: string;
  is_resolved: boolean;
  retake_available: boolean;
  saved_at: string;
  resolved_at?: string;
}

export interface VocabularyTermEntity {
  id: string;
  passage_id?: string;
  word: string;
  phonetic: string;
  part_of_speech: string;
  domain_or_cert?: string;
  meaning_vi: string;
  example_en: string;
  example_vi: string;
  collocation?: string;
  audio_url?: string;
}

export interface UserSavedVocabularyEntity {
  id: string;
  user_id: string;
  vocab_id: string;
  mastery_status: 'learning' | 'mastered';
  user_notes?: string;
  saved_at: string;
}

export interface PartnerUniversityEntity {
  id: string;
  name: string;
  short_name: string;
  subtitle: string;
  country_region: string;
  student_count_display: string;
  popular_certs: string[];
  logo_url?: string;
  display_order: number;
  is_active: boolean;
}

export interface StudentTestimonialEntity {
  id: string;
  university_id?: string;
  student_name: string;
  cohort_info: string;
  achieved_badge: string;
  badge_color: string;
  quote_content: string;
  avatar_url?: string;
  is_featured: boolean;
  display_order: number;
}
