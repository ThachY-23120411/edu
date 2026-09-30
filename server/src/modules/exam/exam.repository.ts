import { Database } from '../../db/database';
import { ExamEntity, ExamPassageEntity, QuestionEntity } from '../../shared/types';

export interface ExamFilterParams {
  category?: string;
  skill?: string;
  difficulty?: string;
  search?: string;
  sortBy?: 'popular' | 'newest' | 'rating';
}

export class ExamRepository {
  private db = Database.getInstance();

  public async findExams(filters: ExamFilterParams): Promise<ExamEntity[]> {
    let list = Array.from(this.db.exams.values()).filter((e) => e.is_published);

    // 1. Search Query
    if (filters.search && filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          (e.subtitle && e.subtitle.toLowerCase().includes(q)) ||
          e.category_label.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // 2. Category
    if (filters.category && filters.category !== 'all') {
      if (filters.category === 'foreign-language') {
        list = list.filter((e) => ['ielts', 'hsk', 'toeic', 'toefl'].includes(e.category_code));
      } else if (filters.category === 'economics') {
        list = list.filter((e) => ['cfa', 'gmat', 'acca', 'gre'].includes(e.category_code));
      } else {
        list = list.filter((e) => e.category_code === filters.category);
      }
    }

    // 3. Skill
    if (filters.skill && filters.skill !== 'all') {
      if (filters.skill === 'reading') {
        list = list.filter((e) => e.category_label.toLowerCase().includes('reading') || e.title.toLowerCase().includes('reading'));
      } else if (filters.skill === 'listening') {
        list = list.filter((e) => e.category_label.toLowerCase().includes('listening') || e.has_audio);
      }
    }

    // 4. Difficulty
    if (filters.difficulty && filters.difficulty !== 'all') {
      list = list.filter((e) => e.difficulty === filters.difficulty);
    }

    // 5. Sort By
    if (filters.sortBy === 'rating') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (filters.sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else {
      // Default: popular (by test_takers_count or total_questions)
      list.sort((a, b) => b.test_takers_count - a.test_takers_count);
    }

    return list;
  }

  public async findExamById(id: string): Promise<ExamEntity | null> {
    return this.db.exams.get(id) || null;
  }

  public async findPassagesByExamId(examId: string): Promise<ExamPassageEntity[]> {
    const passages: ExamPassageEntity[] = [];
    for (const p of this.db.exam_passages.values()) {
      if (p.exam_id === examId) {
        passages.push(p);
      }
    }
    return passages.sort((a, b) => a.display_order - b.display_order);
  }

  public async findQuestionsByExamId(examId: string): Promise<QuestionEntity[]> {
    const questions: QuestionEntity[] = [];
    for (const q of this.db.questions.values()) {
      if (q.exam_id === examId) {
        questions.push(q);
      }
    }
    return questions.sort((a, b) => a.display_order - b.display_order);
  }

  public async getUserBookmarks(userId: string): Promise<string[]> {
    const result: string[] = [];
    for (const key of this.db.user_bookmarked_exams) {
      const [uId, examId] = key.split(':');
      if (uId === userId) {
        result.push(examId);
      }
    }
    return result;
  }

  public async isExamBookmarked(userId: string, examId: string): Promise<boolean> {
    return this.db.user_bookmarked_exams.has(`${userId}:${examId}`);
  }

  public async toggleBookmark(userId: string, examId: string): Promise<boolean> {
    const key = `${userId}:${examId}`;
    if (this.db.user_bookmarked_exams.has(key)) {
      this.db.user_bookmarked_exams.delete(key);
      return false; // un-bookmarked
    } else {
      this.db.user_bookmarked_exams.add(key);
      return true; // bookmarked
    }
  }
}
