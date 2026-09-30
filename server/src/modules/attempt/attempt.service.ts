import { AttemptRepository } from './attempt.repository';
import { ExamRepository } from '../exam/exam.repository';
import { UserRepository } from '../user/user.repository';
import { ExamAttemptEntity, ExamAttemptSkillBreakdownEntity } from '../../shared/types';

export class AttemptService {
  constructor(
    private attemptRepo: AttemptRepository = new AttemptRepository(),
    private examRepo: ExamRepository = new ExamRepository(),
    private userRepo: UserRepository = new UserRepository()
  ) {}

  public async getRecentInProgress(userId: string) {
    const attempt = await this.attemptRepo.findRecentInProgress(userId);
    if (!attempt) return null;

    const exam = await this.examRepo.findExamById(attempt.exam_id);
    return {
      attemptId: attempt.id,
      examId: attempt.exam_id,
      examTitle: exam?.title || 'Bài thi luyện tập',
      categoryLabel: exam?.category_label || 'Khảo thí',
      remainingSeconds: attempt.remaining_seconds_saved,
      currentQuestionIndex: attempt.current_question_index_saved,
      answeredCount: attempt.correct_count + attempt.incorrect_count,
      totalQuestions: attempt.total_questions,
      updatedAt: attempt.updated_at,
    };
  }

  public async startOrResumeAttempt(userId: string, examId: string) {
    const exam = await this.examRepo.findExamById(examId);
    if (!exam) {
      throw new Error(`Exam not found: ${examId}`);
    }

    // Check if an in_progress attempt exists
    const recent = await this.attemptRepo.findRecentInProgress(userId);
    if (recent && recent.exam_id === examId) {
      const answers = await this.attemptRepo.getAnswers(recent.id);
      return {
        isNew: false,
        attempt: recent,
        answers,
        exam,
      };
    }

    // Create new attempt
    const newAttempt: ExamAttemptEntity = {
      id: `att_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      user_id: userId,
      exam_id: examId,
      status: 'in_progress',
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      duration_seconds_spent: 0,
      remaining_seconds_saved: exam.duration_minutes * 60,
      current_question_index_saved: 0,
      total_questions: exam.total_questions,
      correct_count: 0,
      incorrect_count: 0,
      skipped_count: exam.total_questions,
      accuracy_percentage: 0,
      raw_score: 0,
      band_score: 0,
      total_score_string: '',
      time_comparison_text: '',
      percentile_rank: 50,
      beaten_percentage: 50,
      total_participants_benchmark: exam.test_takers_count || 1000,
      target_comparison_message: '',
    };

    await this.attemptRepo.createAttempt(newAttempt);
    return {
      isNew: true,
      attempt: newAttempt,
      answers: [],
      exam,
    };
  }

  public async saveAnswer(
    attemptId: string,
    questionId: number,
    data: {
      userAnswer?: string;
      isFlagged?: boolean;
      timeSpentSeconds?: number;
      candidateNotes?: string;
      remainingSeconds?: number;
      currentQuestionIndex?: number;
    }
  ) {
    const attempt = await this.attemptRepo.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt not found: ${attemptId}`);
    }

    if (data.remainingSeconds !== undefined || data.currentQuestionIndex !== undefined) {
      await this.attemptRepo.updateAttempt(attemptId, {
        remaining_seconds_saved: data.remainingSeconds !== undefined ? data.remainingSeconds : attempt.remaining_seconds_saved,
        current_question_index_saved: data.currentQuestionIndex !== undefined ? data.currentQuestionIndex : attempt.current_question_index_saved,
      });
    }

    const savedAnswer = await this.attemptRepo.upsertAnswer(
      attemptId,
      questionId,
      data.userAnswer,
      data.isFlagged,
      data.timeSpentSeconds,
      data.candidateNotes
    );

    return savedAnswer;
  }

  public async submitAttempt(attemptId: string) {
    const attempt = await this.attemptRepo.findAttemptById(attemptId);
    if (!attempt) {
      throw new Error(`Attempt not found: ${attemptId}`);
    }

    const exam = await this.examRepo.findExamById(attempt.exam_id);
    const questions = await this.examRepo.findQuestionsByExamId(attempt.exam_id);
    const existingAnswers = await this.attemptRepo.getAnswers(attemptId);
    const answerMap = new Map(existingAnswers.map((a) => [a.question_id, a]));

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    // Grouping by question type for skill breakdown
    const typeStats = new Map<string, { correct: number; total: number; nameVi: string }>();

    for (const q of questions) {
      const typeKey = q.question_type_code;
      if (!typeStats.has(typeKey)) {
        typeStats.set(typeKey, { correct: 0, total: 0, nameVi: q.question_type_name_vi });
      }
      const stat = typeStats.get(typeKey)!;
      stat.total++;

      const ans = answerMap.get(q.id);
      if (!ans || !ans.user_answer) {
        skippedCount++;
      } else if (ans.user_answer.trim().toUpperCase() === q.correct_answer.trim().toUpperCase()) {
        correctCount++;
        stat.correct++;
        ans.is_correct = true;
      } else {
        incorrectCount++;
        ans.is_correct = false;
      }
    }

    const totalQuestions = questions.length || attempt.total_questions || 40;
    const accuracyPercentage = totalQuestions > 0 ? Number(((correctCount / totalQuestions) * 100).toFixed(1)) : 0;

    // Band score estimation (IELTS / standardized)
    let bandScore = 6.0;
    if (accuracyPercentage >= 90) bandScore = 8.5;
    else if (accuracyPercentage >= 80) bandScore = 7.5;
    else if (accuracyPercentage >= 70) bandScore = 7.0;
    else if (accuracyPercentage >= 60) bandScore = 6.5;

    const timeSpent = Math.max(0, (exam?.duration_minutes || 60) * 60 - attempt.remaining_seconds_saved);
    const minsSpent = Math.floor(timeSpent / 60);
    const secsSpent = timeSpent % 60;

    // Skill breakdowns
    const breakdowns: ExamAttemptSkillBreakdownEntity[] = [];
    let idx = 1;
    for (const [code, stat] of typeStats.entries()) {
      const pct = stat.total > 0 ? Number(((stat.correct / stat.total) * 100).toFixed(1)) : 0;
      let statusLabel: 'Tối đa' | 'Mạnh' | 'Cần cải thiện' | 'Khá' = 'Khá';
      let statusColor = 'text-amber-700 bg-amber-50 border-amber-200';
      let isWeak = false;

      if (pct === 100) {
        statusLabel = 'Tối đa';
        statusColor = 'text-emerald-700 bg-emerald-50 border-emerald-200';
      } else if (pct >= 80) {
        statusLabel = 'Mạnh';
        statusColor = 'text-blue-800 bg-blue-50 border-blue-200';
      } else if (pct < 70) {
        statusLabel = 'Cần cải thiện';
        statusColor = 'text-rose-700 bg-rose-50 border-rose-200';
        isWeak = true;
      }

      breakdowns.push({
        id: `sb_${attemptId}_${idx++}`,
        attempt_id: attemptId,
        skill_name: stat.nameVi.split('(')[0].trim(),
        question_type_code: code,
        correct_count: stat.correct,
        total_questions: stat.total,
        percentage: pct,
        status_label: statusLabel,
        status_color_class: statusColor,
        feedback_note: isWeak ? 'Nhầm lẫn thông tin suy diễn thực tế ngoài bài đọc' : 'Khả năng đối chiếu từ khóa và loại suy tốt',
        is_weak: isWeak,
      });
    }

    await this.attemptRepo.saveSkillBreakdowns(breakdowns);

    const completed = await this.attemptRepo.updateAttempt(attemptId, {
      status: 'completed',
      completed_at: new Date().toISOString(),
      duration_seconds_spent: timeSpent,
      total_questions: totalQuestions,
      correct_count: correctCount,
      incorrect_count: incorrectCount,
      skipped_count: skippedCount,
      accuracy_percentage: accuracyPercentage,
      raw_score: correctCount,
      band_score: bandScore,
      total_score_string: `${bandScore} Band`,
      time_comparison_text: `Nhanh hơn ${Math.max(1, (exam?.duration_minutes || 60) - minsSpent)} phút so với tiêu chuẩn`,
      percentile_rank: 14,
      beaten_percentage: 86,
      total_participants_benchmark: exam?.test_takers_count || 4820,
      target_comparison_message: `Xuất sắc! Vượt mục tiêu Band 7.0 của bạn`,
    });

    return {
      attemptId,
      examId: attempt.exam_id,
      bandScore,
      accuracyPercentage,
      correctCount,
      totalQuestions,
      timeSpentMinutes: minsSpent,
      timeSpentSeconds: secsSpent,
      completed,
    };
  }
}
