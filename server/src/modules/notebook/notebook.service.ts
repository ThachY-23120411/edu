import { NotebookRepository } from './notebook.repository';
import { UserMistakeNotebookEntity } from '../../shared/types';

export class NotebookService {
  constructor(private notebookRepo: NotebookRepository = new NotebookRepository()) {}

  public async getMistakeList(userId: string, trapCategory?: string) {
    const mistakes = await this.notebookRepo.getMistakes(userId, trapCategory);
    return {
      total: mistakes.length,
      activeTrapTab: trapCategory || 'all',
      items: mistakes.map((m) => ({
        id: m.id,
        testName: m.test_name,
        section: m.section,
        questionNumber: m.question_number,
        questionType: m.question_type,
        questionText: m.question_text,
        yourAnswer: m.your_answer_recorded,
        correctAnswer: m.correct_answer_recorded,
        trapCategory: m.trap_type_code,
        trapCategoryLabel: m.custom_trap_label,
        trapExplanation: m.trap_explanation,
        goldenRule: m.golden_rule,
        retakeAvailable: m.retake_available,
        isResolved: m.is_resolved,
      })),
    };
  }

  public async saveMistake(
    userId: string,
    data: {
      questionId: number;
      testName?: string;
      section?: string;
      questionNumber?: number;
      questionType?: string;
      questionText?: string;
      trapCategory?: 'mindset' | 'vocab' | 'negation' | 'grammar';
      customTrapLabel?: string;
      yourAnswer?: string;
      correctAnswer?: string;
      trapExplanation?: string;
      goldenRule?: string;
    }
  ) {
    const id = `m_${Date.now()}_${data.questionId}`;
    const newMistake: UserMistakeNotebookEntity = {
      id,
      user_id: userId,
      question_id: data.questionId,
      test_name: data.testName || 'IELTS Practice Test',
      section: data.section || 'Reading Section',
      question_number: data.questionNumber || data.questionId,
      question_type: data.questionType || 'Multiple Choice',
      question_text: data.questionText || '',
      trap_type_code: data.trapCategory || 'mindset',
      custom_trap_label: data.customTrapLabel || 'Bẫy đề thi & Lỗi tư duy',
      your_answer_recorded: data.yourAnswer || 'Chưa chọn',
      correct_answer_recorded: data.correctAnswer || '',
      trap_explanation: data.trapExplanation || 'Cần chú ý đối chiếu từ khóa trong bài.',
      golden_rule: data.goldenRule || 'Đọc kỹ yêu cầu câu hỏi và không tự suy diễn.',
      retake_available: true,
      is_resolved: false,
      saved_at: new Date().toISOString(),
    };

    await this.notebookRepo.addMistake(newMistake);
    return newMistake;
  }

  public async removeMistake(userId: string, mistakeId: string) {
    const success = await this.notebookRepo.deleteMistake(userId, mistakeId);
    if (!success) {
      throw new Error(`Mistake record not found or not owned by user: ${mistakeId}`);
    }
    return { success: true, removedId: mistakeId };
  }

  public async toggleResolved(userId: string, mistakeId: string, isResolved: boolean) {
    const updated = await this.notebookRepo.setResolved(userId, mistakeId, isResolved);
    if (!updated) {
      throw new Error(`Mistake record not found: ${mistakeId}`);
    }
    return updated;
  }
}
