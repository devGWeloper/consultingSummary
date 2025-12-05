import axios from 'axios';

const API_BASE_URL = '/api';

export interface Paper {
  id: number;
  title: string;
  company: string;
  year: number;
  topic: string;
  summary: string | null;
  content: string;
  file_path: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface PaperListItem {
  id: number;
  title: string;
  company: string;
  year: number;
  topic: string;
  summary: string | null;
  created_at: string;
}

export interface FilterOptions {
  years: number[];
  topics: string[];
  companies: string[];
}

export interface PaperStats {
  total_papers: number;
  by_year: Record<string, number>;
  by_topic: Record<string, number>;
  by_company: Record<string, number>;
}

export interface ScanResult {
  added: number;
  updated: number;
  errors: string[];
}

export interface PaperFilters {
  year?: number;
  topic?: string;
  company?: string;
  search?: string;
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const papersApi = {
  // 목록 조회
  getPapers: async (filters: PaperFilters = {}): Promise<PaperListItem[]> => {
    const params = new URLSearchParams();
    if (filters.year) params.append('year', filters.year.toString());
    if (filters.topic) params.append('topic', filters.topic);
    if (filters.company) params.append('company', filters.company);
    if (filters.search) params.append('search', filters.search);
    
    const response = await api.get(`/papers?${params.toString()}`);
    return response.data;
  },

  // 상세 조회
  getPaper: async (id: number): Promise<Paper> => {
    const response = await api.get(`/papers/${id}`);
    return response.data;
  },

  // 필터 옵션 조회
  getFilterOptions: async (): Promise<FilterOptions> => {
    const response = await api.get('/papers/filters');
    return response.data;
  },

  // 통계 조회
  getStats: async (): Promise<PaperStats> => {
    const response = await api.get('/papers/stats');
    return response.data;
  },

  // 파일 업로드
  uploadPaper: async (data: {
    file: File;
    title: string;
    company: string;
    year: number;
    topic: string;
    summary?: string;
  }): Promise<Paper> => {
    const formData = new FormData();
    formData.append('file', data.file);
    formData.append('title', data.title);
    formData.append('company', data.company);
    formData.append('year', data.year.toString());
    formData.append('topic', data.topic);
    if (data.summary) formData.append('summary', data.summary);

    const response = await api.post('/papers/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 폴더 스캔
  scanFolder: async (): Promise<ScanResult> => {
    const response = await api.post('/papers/scan');
    return response.data;
  },

  // 삭제
  deletePaper: async (id: number): Promise<void> => {
    await api.delete(`/papers/${id}`);
  },
};

export default api;

