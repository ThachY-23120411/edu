import { Database } from '../../db/database';
import {
  ExamAttemptEntity,
  ExamAttemptSkillBreakdownEntity,
  ExamAttemptAnswerEntity,
} from '../../shared/types';

export class ResultRepository {
  private db = Database.getInstance();

  public async findAttempt(identifier: string): Promise<ExamAttemptEntity | null> {
    // 1. Direct attempt ID lookup
    const attempt = this.db.exam_attempts.get(identifier);
    if (attempt) return attempt;

    // 2. Lookup by examId (return latest completed attempt)
    const list: ExamAttemptEntity[] = [];
    for (const a of this.db.exam_attempts.values()) {
      if (a.exam_id === identifier && a.status === 'completed') {
        list.push(a);
      }
    }
    if (list.length > 0) {
      list.sort((a, b) => new Date(b.completed_at || 0).getTime() - new Date(a.completed_at || 0).getTime());
      return list[0];
    }

    return null;
  }

  public async getSkillBreakdowns(attemptId: string): Promise<ExamAttemptSkillBreakdownEntity[]> {
    const list: ExamAttemptSkillBreakdownEntity[] = [];
    for (const sb of this.db.exam_attempt_skill_breakdown.values()) {
      if (sb.attempt_id === attemptId) {
        list.push(sb);
      }
    }
    return list;
  }

  public async getAttemptAnswers(attemptId: string): Promise<ExamAttemptAnswerEntity[]> {
    const answers: ExamAttemptAnswerEntity[] = [];
    for (const a of this.db.exam_attempt_answers.values()) {
      if (a.attempt_id === attemptId) {
        answers.push(a);
      }
    }
    return answers;
  }
}
