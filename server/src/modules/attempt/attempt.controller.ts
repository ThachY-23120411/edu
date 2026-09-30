import { Request, Response } from 'express';
import { AttemptService } from './attempt.service';

export class AttemptController {
  constructor(private attemptService: AttemptService = new AttemptService()) {}

  public getRecent = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || 'user_demo_01';
      const data = await this.attemptService.getRecentInProgress(userId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public startOrResume = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.userId || 'user_demo_01';
      const { examId } = req.body;
      if (!examId) {
        res.status(400).json({ success: false, error: 'examId is required' });
        return;
      }
      const data = await this.attemptService.startOrResumeAttempt(userId, examId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

  public saveAnswer = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { questionId, userAnswer, isFlagged, timeSpentSeconds, candidateNotes, remainingSeconds, currentQuestionIndex } = req.body;
      if (questionId === undefined) {
        res.status(400).json({ success: false, error: 'questionId is required' });
        return;
      }
      const data = await this.attemptService.saveAnswer(id, Number(questionId), {
        userAnswer,
        isFlagged,
        timeSpentSeconds,
        candidateNotes,
        remainingSeconds,
        currentQuestionIndex,
      });
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

  public submit = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.attemptService.submitAttempt(id);
      res.status(200).json({ success: true, data, message: 'Exam submitted and graded successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };
}
