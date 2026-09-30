import { Request, Response } from 'express';
import { ResultService } from './result.service';

export class ResultController {
  constructor(private resultService: ResultService = new ResultService()) {}

  public getResult = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const data = await this.resultService.getResultReport(id);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message });
    }
  };
}
