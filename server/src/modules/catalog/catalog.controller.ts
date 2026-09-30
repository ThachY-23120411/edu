import { Request, Response } from 'express';
import { CatalogService } from './catalog.service';

export class CatalogController {
  constructor(private catalogService: CatalogService = new CatalogService()) {}

  public getHubData = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.catalogService.getHubMetadata();
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
      const domainCode = req.query.domain as string | undefined;
      const data = await this.catalogService.getCategories(domainCode);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getTargetOptions = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.catalogService.getTargetOptions();
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };

  public getUniversities = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.catalogService.getUniversities();
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  };
}
