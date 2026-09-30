import { ExamRepository, ExamFilterParams } from './exam.repository';

export class ExamService {
  constructor(private examRepo: ExamRepository = new ExamRepository()) {}

  public async getExamsList(userId: string, filters: ExamFilterParams) {
    const [exams, userBookmarks] = await Promise.all([
      this.examRepo.findExams(filters),
      this.examRepo.getUserBookmarks(userId),
    ]);

    const bookmarkMap = new Set(userBookmarks);

    return {
      total: exams.length,
      savedCount: userBookmarks.length,
      items: exams.map((e) => ({
        ...e,
        isBookmarked: bookmarkMap.has(e.id),
      })),
    };
  }

  public async getExamDetails(examId: string) {
    const exam = await this.examRepo.findExamById(examId);
    if (!exam) {
      throw new Error(`Exam not found: ${examId}`);
    }

    const [passages, questions] = await Promise.all([
      this.examRepo.findPassagesByExamId(examId),
      this.examRepo.findQuestionsByExamId(examId),
    ]);

    return {
      ...exam,
      passages,
      questions,
    };
  }

  public async toggleBookmark(userId: string, examId: string) {
    const exam = await this.examRepo.findExamById(examId);
    if (!exam) {
      throw new Error(`Exam not found: ${examId}`);
    }
    const isBookmarked = await this.examRepo.toggleBookmark(userId, examId);
    const userBookmarks = await this.examRepo.getUserBookmarks(userId);

    return {
      examId,
      isBookmarked,
      totalSavedCount: userBookmarks.length,
    };
  }
}
