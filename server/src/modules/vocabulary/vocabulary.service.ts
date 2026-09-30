import { VocabularyRepository } from './vocabulary.repository';
import { VocabularyTermEntity } from '../../shared/types';

export class VocabularyService {
  constructor(private vocabRepo: VocabularyRepository = new VocabularyRepository()) {}

  public async getVocabList(domainOrCert?: string) {
    const list = await this.vocabRepo.getAllTerms(domainOrCert);
    return {
      total: list.length,
      items: list,
    };
  }

  public async getUserSavedVocab(userId: string) {
    const items = await this.vocabRepo.getUserSavedVocab(userId);
    return {
      total: items.length,
      learningCount: items.filter((i) => i.mastery_status === 'learning').length,
      masteredCount: items.filter((i) => i.mastery_status === 'mastered').length,
      items,
    };
  }

  public async lookupWord(word: string) {
    const term = await this.vocabRepo.getTermByWord(word);
    if (!term) {
      return {
        found: false,
        word,
        meaning_vi: 'Chưa có dữ liệu tra nhanh cho từ này trong kho.',
      };
    }
    return {
      found: true,
      term,
    };
  }

  public async saveWord(
    userId: string,
    data: {
      vocabId?: string;
      word?: string;
      phonetic?: string;
      partOfSpeech?: string;
      meaningVi?: string;
      exampleEn?: string;
      exampleVi?: string;
      collocation?: string;
      domainOrCert?: string;
      notes?: string;
    }
  ) {
    let vocabId = data.vocabId;

    if (!vocabId && data.word) {
      const existing = await this.vocabRepo.getTermByWord(data.word);
      if (existing) {
        vocabId = existing.id;
      } else {
        vocabId = `v_${Date.now()}`;
        const newTerm: VocabularyTermEntity = {
          id: vocabId,
          word: data.word,
          phonetic: data.phonetic || '',
          part_of_speech: data.partOfSpeech || 'n/a',
          meaning_vi: data.meaningVi || '',
          example_en: data.exampleEn || '',
          example_vi: data.exampleVi || '',
          collocation: data.collocation,
          domain_or_cert: data.domainOrCert || 'ielts',
        };
        await this.vocabRepo.saveTerm(newTerm);
      }
    }

    if (!vocabId) {
      throw new Error('Either vocabId or word details must be provided.');
    }

    const saved = await this.vocabRepo.saveUserVocab(userId, vocabId, data.notes);
    return saved;
  }

  public async removeSavedWord(userId: string, vocabId: string) {
    const success = await this.vocabRepo.removeUserVocab(userId, vocabId);
    if (!success) {
      throw new Error(`Word not found in user vocabulary list: ${vocabId}`);
    }
    return { success: true, removedId: vocabId };
  }

  public async updateMastery(userId: string, vocabId: string, status: 'learning' | 'mastered') {
    const updated = await this.vocabRepo.updateMastery(userId, vocabId, status);
    if (!updated) {
      throw new Error(`Word record not found in user vocabulary: ${vocabId}`);
    }
    return updated;
  }
}
