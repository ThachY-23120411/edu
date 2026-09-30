import { UserRepository } from './user.repository';

export class UserService {
  constructor(private userRepo: UserRepository = new UserRepository()) {}

  public async getUserDashboardProfile(userId: string) {
    const user = await this.userRepo.findUserById(userId);
    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }
    const profile = await this.userRepo.findProfileByUserId(userId);
    const activities = await this.userRepo.getDailyActivities(userId);

    return {
      name: user.full_name,
      email: user.email,
      targetExam: profile?.target_exam || 'IELTS 7.5+',
      currentStreak: profile?.current_streak || 0,
      completedToday: profile?.completed_today || 0,
      goalToday: profile?.goal_today || 3,
      coins: profile?.coins || 0,
      notificationsCount: profile?.notifications_count || 0,
      weeklyActivity: activities.map((a) => ({
        day: a.day_label,
        completed: a.completed,
        score: a.score,
      })),
    };
  }

  public async updateTargetExam(userId: string, targetExam: string) {
    if (!targetExam || !targetExam.trim()) {
      throw new Error('Target exam cannot be empty');
    }
    const updated = await this.userRepo.updateTargetExam(userId, targetExam.trim());
    if (!updated) {
      throw new Error(`Profile not found for user: ${userId}`);
    }
    return {
      targetExam: updated.target_exam,
      updatedAt: updated.updated_at,
    };
  }
}
