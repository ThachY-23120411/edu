import { Request, Response } from 'express';
import { VocabularyService } from './vocabulary.service';

export class VocabularyController {
  constructor(private vocabService: VocabularyService = new VocabularyService()) {}

  public getTerms = async (req: Request, res: Response): Promise<void> => {
    try {
      const domain = req.query.domain as string | undefined;
      const data = await this.vocabService.getVocabList(domain);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getSavedVocab = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || 'user_demo_01';
      const data = await this.vocabService.getUserSavedVocab(userId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public lookupWord = async (req: Request, res: Response): Promise<void> => {
    try {
      const { word } = req.params;
      const data = await this.vocabService.lookupWord(word);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public saveWord = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.userId || 'user_demo_01';
      const saved = await this.vocabService.saveWord(userId, req.body);
      res.status(201).json({ success: true, data: saved });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

  public removeSavedWord = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || (req.body.userId as string) || 'user_demo_01';
      const { id } = req.params;
      const result = await this.vocabService.removeSavedWord(userId, id);
      res.status(200).json({ success: true, data: result });
    } catch (err: any) {
      res.status(404).json({ success: false, error: err.message });
    }
  };

  public updateMastery = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.userId || 'user_demo_01';
      const { id } = req.params;
      const { status } = req.body;
      const updated = await this.vocabService.updateMastery(userId, id, status);
      res.status(200).json({ success: true, data: updated });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };
}
