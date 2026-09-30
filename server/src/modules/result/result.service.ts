import { ResultRepository } from './result.repository';
import { ExamRepository } from '../exam/exam.repository';

export class ResultService {
  constructor(
    private resultRepo: ResultRepository = new ResultRepository(),
    private examRepo: ExamRepository = new ExamRepository()
  ) {}

  public async getResultReport(identifier: string) {
    const attempt = await this.resultRepo.findAttempt(identifier);
    if (!attempt) {
      throw new Error(`Exam result not found for: ${identifier}`);
    }

    const exam = await this.examRepo.findExamById(attempt.exam_id);
    const breakdowns = await this.resultRepo.getSkillBreakdowns(attempt.id);
    const answers = await this.resultRepo.getAttemptAnswers(attempt.id);
    const questions = await this.examRepo.findQuestionsByExamId(attempt.exam_id);

    const answerMap = new Map(answers.map((a) => [a.question_id, a]));

    const timeSpentMins = Math.floor(attempt.duration_seconds_spent / 60);
    const timeSpentSecs = attempt.duration_seconds_spent % 60;

    // Detailed question review list with explanations
    const questionReview = questions.map((q) => {
      const userAns = answerMap.get(q.id);
      return {
        id: q.id,
        section: q.section_name,
        type: q.question_type_code,
        typeNameVi: q.question_type_name_vi,
        prompt: q.prompt,
        promptVi: q.prompt_vi,
        options: q.options.map((opt) => ({
          id: opt.option_identifier,
          text: opt.text_en,
          translation: opt.text_vi,
        })),
        correctAnswer: q.correct_answer,
        userAnswer: userAns?.user_answer || '',
        isCorrect: userAns ? userAns.user_answer?.trim().toUpperCase() === q.correct_answer.trim().toUpperCase() : false,
        isFlagged: userAns?.is_flagged || false,
        notes: userAns?.candidate_notes || '',
        explanation: q.explanation
          ? {
              correctText: q.explanation.correct_text,
              evidenceLocation: q.explanation.evidence_location,
              evidenceQuote: q.explanation.evidence_quote,
              vocabularyTrap: q.explanation.vocabulary_trap,
              mindsetTrap: q.explanation.mindset_trap,
              goldenRule: q.explanation.golden_rule,
            }
          : undefined,
      };
    });

    return {
      attemptId: attempt.id,
      examId: attempt.exam_id,
      examTitle: exam?.title || 'IELTS ACADEMIC · Reading Practice Test',
      category: exam?.category_label || 'Khảo thí',
      bandScore: attempt.band_score,
      totalScoreString: attempt.total_score_string || `${attempt.band_score} Band`,
      correctCount: attempt.correct_count,
      totalQuestions: attempt.total_questions,
      accuracyPercentage: attempt.accuracy_percentage,
      timeSpentMinutes: timeSpentMins,
      timeSpentSeconds: timeSpentSecs,
      timeComparisonText: attempt.time_comparison_text || 'Nhanh hơn 8 phút so với tiêu chuẩn',
      percentileRank: attempt.percentile_rank || 14,
      beatenPercentage: attempt.beaten_percentage || 86,
      totalParticipants: attempt.total_participants_benchmark || 4820,
      targetComparison: attempt.target_comparison_message || 'Xuất sắc! Vượt mục tiêu Band 7.0 của bạn',
      skillBreakdown: breakdowns.map((b) => ({
        skillName: b.skill_name,
        correct: b.correct_count,
        total: b.total_questions,
        percentage: b.percentage,
        status: b.status_label,
        statusColor: b.status_color_class,
        feedbackNote: b.feedback_note,
        isWeak: b.is_weak,
      })),
      questions: questionReview,
    };
  }
}
