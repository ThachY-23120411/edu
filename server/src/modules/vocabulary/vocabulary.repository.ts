import { Database } from '../../db/database';
import { VocabularyTermEntity, UserSavedVocabularyEntity } from '../../shared/types';

export class VocabularyRepository {
  private db = Database.getInstance();

  public async getAllTerms(domainOrCert?: string): Promise<VocabularyTermEntity[]> {
    const all = Array.from(this.db.vocabulary_terms.values());
    if (!domainOrCert || domainOrCert === 'all') {
      return all;
    }
    return all.filter((v) => v.domain_or_cert?.toLowerCase() === domainOrCert.toLowerCase());
  }

  public async getTermById(id: string): Promise<VocabularyTermEntity | undefined> {
    return this.db.vocabulary_terms.get(id);
  }

  public async getTermByWord(word: string): Promise<VocabularyTermEntity | undefined> {
    const cleaned = word.trim().toLowerCase();
    return Array.from(this.db.vocabulary_terms.values()).find(
      (v) => v.word.toLowerCase() === cleaned
    );
  }

  public async getUserSavedVocab(userId: string): Promise<
    (VocabularyTermEntity & {
      saved_entry_id: string;
      mastery_status: 'learning' | 'mastered';
      saved_at: string;
      user_notes?: string;
    })[]
  > {
    const saved = Array.from(this.db.user_saved_vocabulary.values()).filter(
      (s) => s.user_id === userId
    );

    const result: (VocabularyTermEntity & {
      saved_entry_id: string;
      mastery_status: 'learning' | 'mastered';
      saved_at: string;
      user_notes?: string;
    })[] = [];
    for (const item of saved) {
      const term = this.db.vocabulary_terms.get(item.vocab_id);
      if (term) {
        result.push({
          ...term,
          saved_entry_id: item.id,
          mastery_status: item.mastery_status,
          saved_at: item.saved_at,
          user_notes: item.user_notes,
        });
      }
    }
    return result;
  }

  public async saveTerm(term: VocabularyTermEntity): Promise<VocabularyTermEntity> {
    this.db.vocabulary_terms.set(term.id, term);
    return term;
  }

  public async saveUserVocab(
    userId: string,
    vocabId: string,
    notes?: string
  ): Promise<UserSavedVocabularyEntity> {
    const key = `${userId}:${vocabId}`;
    let existing = this.db.user_saved_vocabulary.get(key);
    if (existing) {
      existing.user_notes = notes || existing.user_notes;
      this.db.user_saved_vocabulary.set(key, existing);
      return existing;
    }

    const newSaved: UserSavedVocabularyEntity = {
      id: `saved_${Date.now()}_${vocabId}`,
      user_id: userId,
      vocab_id: vocabId,
      mastery_status: 'learning',
      user_notes: notes,
      saved_at: new Date().toISOString(),
    };
    this.db.user_saved_vocabulary.set(key, newSaved);
    return newSaved;
  }

  public async removeUserVocab(userId: string, vocabId: string): Promise<boolean> {
    const key = `${userId}:${vocabId}`;
    if (this.db.user_saved_vocabulary.has(key)) {
      return this.db.user_saved_vocabulary.delete(key);
    }
    // Also support finding by saved_entry_id
    const entry = Array.from(this.db.user_saved_vocabulary.entries()).find(
      ([k, v]) => v.user_id === userId && (v.vocab_id === vocabId || v.id === vocabId)
    );
    if (entry) {
      return this.db.user_saved_vocabulary.delete(entry[0]);
    }
    return false;
  }

  public async updateMastery(
    userId: string,
    vocabId: string,
    status: 'learning' | 'mastered'
  ): Promise<UserSavedVocabularyEntity | undefined> {
    const key = `${userId}:${vocabId}`;
    let existing = this.db.user_saved_vocabulary.get(key);
    if (!existing) {
      const entry = Array.from(this.db.user_saved_vocabulary.entries()).find(
        ([k, v]) => v.user_id === userId && (v.vocab_id === vocabId || v.id === vocabId)
      );
      if (entry) {
        existing = entry[1];
      }
    }
    if (existing) {
      existing.mastery_status = status;
      this.db.user_saved_vocabulary.set(`${userId}:${existing.vocab_id}`, existing);
      return existing;
    }
    return undefined;
  }
}
