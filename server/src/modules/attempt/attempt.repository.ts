import { Database } from '../../db/database';
import {
  ExamAttemptEntity,
  ExamAttemptAnswerEntity,
  ExamAttemptSkillBreakdownEntity,
} from '../../shared/types';

export class AttemptRepository {
  private db = Database.getInstance();

  public async findRecentInProgress(userId: string): Promise<ExamAttemptEntity | null> {
    const list: ExamAttemptEntity[] = [];
    for (const a of this.db.exam_attempts.values()) {
      if (a.user_id === userId && a.status === 'in_progress') {
        list.push(a);
      }
    }
    if (list.length === 0) return null;
    list.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    return list[0];
  }

  public async findAttemptById(attemptId: string): Promise<ExamAttemptEntity | null> {
    return this.db.exam_attempts.get(attemptId) || null;
  }

  public async createAttempt(attempt: ExamAttemptEntity): Promise<ExamAttemptEntity> {
    this.db.exam_attempts.set(attempt.id, attempt);
    return attempt;
  }

  public async updateAttempt(attemptId: string, partial: Partial<ExamAttemptEntity>): Promise<ExamAttemptEntity | null> {
    const existing = this.db.exam_attempts.get(attemptId);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...partial,
      updated_at: new Date().toISOString(),
    };
    this.db.exam_attempts.set(attemptId, updated);
    return updated;
  }

  public async getAnswers(attemptId: string): Promise<ExamAttemptAnswerEntity[]> {
    const answers: ExamAttemptAnswerEntity[] = [];
    for (const ans of this.db.exam_attempt_answers.values()) {
      if (ans.attempt_id === attemptId) {
        answers.push(ans);
      }
    }
    return answers;
  }

  public async upsertAnswer(
    attemptId: string,
    questionId: number,
    userAnswer?: string,
    isFlagged?: boolean,
    timeSpentSeconds?: number,
    candidateNotes?: string
  ): Promise<ExamAttemptAnswerEntity> {
    const key = `${attemptId}:${questionId}`;
    const existing = this.db.exam_attempt_answers.get(key);

    const updated: ExamAttemptAnswerEntity = {
      id: existing ? existing.id : `ans_${Date.now()}_${questionId}`,
      attempt_id: attemptId,
      question_id: questionId,
      user_answer: userAnswer !== undefined ? userAnswer : existing?.user_answer,
      is_correct: existing ? existing.is_correct : false,
      is_flagged: isFlagged !== undefined ? isFlagged : existing?.is_flagged || false,
      time_spent_seconds: timeSpentSeconds !== undefined ? timeSpentSeconds : existing?.time_spent_seconds || 0,
      candidate_notes: candidateNotes !== undefined ? candidateNotes : existing?.candidate_notes,
      updated_at: new Date().toISOString(),
    };

    this.db.exam_attempt_answers.set(key, updated);
    return updated;
  }

  public async saveSkillBreakdowns(breakdowns: ExamAttemptSkillBreakdownEntity[]): Promise<void> {
    breakdowns.forEach((b) => this.db.exam_attempt_skill_breakdown.set(b.id, b));
  }
}
