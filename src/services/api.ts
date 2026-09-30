/**
 * EduTest Pro - Fullstack API Client
 * Connects frontend components to Modular Monolith Express Backend via Next.js Proxy (/api/*)
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.error || `HTTP error ${res.status}`);
  }
  return json.data;
}

export const api = {
  // 1. User Module
  user: {
    getProfile: () => fetchJson<any>('/user/profile'),
    updateTarget: (targetExam: string) =>
      fetchJson<any>('/user/target', {
        method: 'PATCH',
        body: JSON.stringify({ targetExam }),
      }),
  },

  // 2. Catalog Module
  catalog: {
    getHubData: () => fetchJson<any>('/catalog/hub'),
    getCategories: () => fetchJson<any[]>('/catalog/categories'),
    getTargetOptions: () => fetchJson<any[]>('/catalog/targets'),
    getUniversities: () => fetchJson<any[]>('/catalog/universities'),
  },

  // 3. Exam Module
  exams: {
    getAll: (params?: { category?: string; difficulty?: string; q?: string; bookmarked?: boolean }) => {
      const sp = new URLSearchParams();
      if (params?.category) sp.append('category', params.category);
      if (params?.difficulty) sp.append('difficulty', params.difficulty);
      if (params?.q) sp.append('q', params.q);
      if (params?.bookmarked !== undefined) sp.append('bookmarked', String(params.bookmarked));
      const qs = sp.toString();
      return fetchJson<{ total: number; savedCount: number; items: any[] }>(`/exams${qs ? `?${qs}` : ''}`);
    },
    getById: (id: string) => fetchJson<any>(`/exams/${id}`),
    toggleBookmark: (id: string, isBookmarked?: boolean) =>
      fetchJson<any>(`/exams/${id}/bookmark`, {
        method: 'POST',
        body: JSON.stringify({ isBookmarked }),
      }),
  },

  // 4. Attempt Module
  attempts: {
    getRecent: () => fetchJson<any[]>('/attempts/recent'),
    startOrResume: (examId: string) =>
      fetchJson<any>('/attempts/start', {
        method: 'POST',
        body: JSON.stringify({ examId }),
      }),
    saveAnswer: (
      attemptId: string,
      data: {
        questionId: number;
        answer?: string;
        isFlagged?: boolean;
        timeSpentSeconds?: number;
      }
    ) =>
      fetchJson<any>(`/attempts/${attemptId}/answers`, {
        method: 'PUT',
        body: JSON.stringify(data),
      }),
    submit: (attemptId: string, durationSecondsSpent?: number) =>
      fetchJson<any>(`/attempts/${attemptId}/submit`, {
        method: 'POST',
        body: JSON.stringify({ durationSecondsSpent }),
      }),
  },

  // 5. Result Module
  results: {
    getReport: (attemptId: string) => fetchJson<any>(`/results/${attemptId}`),
  },

  // 6. Notebook Module
  notebook: {
    getMistakes: (trapCategory?: string) => {
      const sp = trapCategory ? `?trapCategory=${encodeURIComponent(trapCategory)}` : '';
      return fetchJson<{ total: number; activeTrapTab: string; items: any[] }>(`/notebook/mistakes${sp}`);
    },
    saveMistake: (data: any) =>
      fetchJson<any>('/notebook/mistakes', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    removeMistake: (id: string) =>
      fetchJson<any>(`/notebook/mistakes/${id}`, {
        method: 'DELETE',
      }),
    toggleResolved: (id: string, isResolved: boolean) =>
      fetchJson<any>(`/notebook/mistakes/${id}/resolve`, {
        method: 'PATCH',
        body: JSON.stringify({ isResolved }),
      }),
  },

  // 7. Vocabulary Module
  vocabulary: {
    getTerms: (domain?: string) => {
      const sp = domain ? `?domain=${encodeURIComponent(domain)}` : '';
      return fetchJson<{ total: number; items: any[] }>(`/vocabulary${sp}`);
    },
    getSaved: () =>
      fetchJson<{ total: number; learningCount: number; masteredCount: number; items: any[] }>('/vocabulary/saved'),
    lookup: (word: string) => fetchJson<{ found: boolean; term?: any; meaning_vi?: string }>(`/vocabulary/lookup/${encodeURIComponent(word)}`),
    saveWord: (data: any) =>
      fetchJson<any>('/vocabulary/saved', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    removeWord: (id: string) =>
      fetchJson<any>(`/vocabulary/saved/${id}`, {
        method: 'DELETE',
      }),
    updateMastery: (id: string, status: 'learning' | 'mastered') =>
      fetchJson<any>(`/vocabulary/saved/${id}/mastery`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
  },
};
