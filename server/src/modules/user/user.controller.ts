import { Request, Response } from 'express';
import { UserService } from './user.service';

export class UserController {
  constructor(private userService: UserService = new UserService()) {}

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = (req.query.userId as string) || 'user_demo_01';
      const data = await this.userService.getUserDashboardProfile(userId);
      res.status(200).json({ success: true, data });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };

  public updateTarget = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = req.body.userId || 'user_demo_01';
      const { targetExam } = req.body;
      const data = await this.userService.updateTargetExam(userId, targetExam);
      res.status(200).json({ success: true, data, message: 'Target exam updated successfully' });
    } catch (err: any) {
      res.status(400).json({ success: false, error: err.message });
    }
  };
}
