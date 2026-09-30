import { Database } from '../../db/database';
import { UserEntity, UserProfileEntity, UserDailyActivityEntity } from '../../shared/types';

export class UserRepository {
  private db = Database.getInstance();

  public async findUserById(id: string): Promise<UserEntity | null> {
    return this.db.users.get(id) || null;
  }

  public async findProfileByUserId(userId: string): Promise<UserProfileEntity | null> {
    return this.db.user_profiles.get(userId) || null;
  }

  public async updateTargetExam(userId: string, targetExam: string): Promise<UserProfileEntity | null> {
    const profile = this.db.user_profiles.get(userId);
    if (!profile) return null;
    profile.target_exam = targetExam;
    profile.updated_at = new Date().toISOString();
    this.db.user_profiles.set(userId, profile);
    return profile;
  }

  public async getDailyActivities(userId: string): Promise<UserDailyActivityEntity[]> {
    const activities: UserDailyActivityEntity[] = [];
    for (const act of this.db.user_daily_activities.values()) {
      if (act.user_id === userId) {
        activities.push(act);
      }
    }
    return activities;
  }
}
