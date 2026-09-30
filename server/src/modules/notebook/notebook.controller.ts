import { Request, Response } from 'express';
import { NotebookService } from './notebook.service';

export class NotebookController {
  constructor(private notebookService: NotebookService = new NotebookService()) {}

  public getMistakes = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || 'user_demo_01';
      const trapCategory = req.query.trapCategory as string | undefined;
      const data = await this.notebookService.getMistakeList(userId, trapCategory);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public saveMistake = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.userId || 'user_demo_01';
      const data = await this.notebookService.saveMistake(userId, req.body);
      res.status(201).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

  public removeMistake = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || (req.body.userId as string) || 'user_demo_01';
      const { id } = req.params;
      const result = await this.notebookService.removeMistake(userId, id);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public toggleResolved = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.body.userId as string) || 'user_demo_01';
      const { id } = req.params;
      const { isResolved } = req.body;
      const updated = await this.notebookService.toggleResolved(userId, id, isResolved);
      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };
}
