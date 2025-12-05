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

export interface Filters {
  year?: number;
  topic?: string;
  company?: string;
  search?: string;
}

