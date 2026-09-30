import { Request, Response } from 'express';
import { ExamService } from './exam.service';

export class ExamController {
  constructor(private examService: ExamService = new ExamService()) {}

  public getExams = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || 'user_demo_01';
      const filters = {
        category: req.query.category as string | undefined,
        skill: req.query.skill as string | undefined,
        difficulty: req.query.difficulty as string | undefined,
        search: req.query.search as string | undefined,
        sortBy: req.query.sortBy as any,
      };

      const data = await this.examService.getExamsList(userId, filters);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getExamById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.examService.getExamDetails(id);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public toggleBookmark = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.body.userId || 'user_demo_01';
      const data = await this.examService.toggleBookmark(userId, id);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };
}
