import { Database } from '../../db/database';
import { UserMistakeNotebookEntity } from '../../shared/types';

export class NotebookRepository {
  private db = Database.getInstance();

  public async getMistakes(userId: string, trapCategory?: string): Promise<UserMistakeNotebookEntity[]> {
    let list: UserMistakeNotebookEntity[] = [];
    for (const m of this.db.user_mistake_notebook.values()) {
      if (m.user_id === userId) {
        list.push(m);
      }
    }

    if (trapCategory && trapCategory !== 'all') {
      list = list.filter((m) => m.trap_type_code === trapCategory);
    }

    return list.sort((a, b) => new Date(b.saved_at).getTime() - new Date(a.saved_at).getTime());
  }

  public async getMistakeById(mistakeId: string): Promise<UserMistakeNotebookEntity | null> {
    return this.db.user_mistake_notebook.get(mistakeId) || null;
  }

  public async addMistake(mistake: UserMistakeNotebookEntity): Promise<UserMistakeNotebookEntity> {
    this.db.user_mistake_notebook.set(mistake.id, mistake);
    return mistake;
  }

  public async deleteMistake(userId: string, mistakeId: string): Promise<boolean> {
    const existing = this.db.user_mistake_notebook.get(mistakeId);
    if (!existing || existing.user_id !== userId) return false;
    this.db.user_mistake_notebook.delete(mistakeId);
    return true;
  }

  public async setResolved(userId: string, mistakeId: string, isResolved: boolean): Promise<UserMistakeNotebookEntity | null> {
    const existing = this.db.user_mistake_notebook.get(mistakeId);
    if (!existing || existing.user_id !== userId) return null;
    existing.is_resolved = isResolved;
    existing.resolved_at = isResolved ? new Date().toISOString() : undefined;
    this.db.user_mistake_notebook.set(mistakeId, existing);
    return existing;
  }
}
