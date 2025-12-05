import { Search, X, Filter } from 'lucide-react';
import type { FilterOptions, Filters } from '../types';

interface FilterSidebarProps {
  options: FilterOptions;
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function FilterSidebar({ options, filters, onFilterChange }: FilterSidebarProps) {
  const handleYearChange = (year: number | undefined) => {
    onFilterChange({ ...filters, year });
  };

  const handleTopicChange = (topic: string | undefined) => {
    onFilterChange({ ...filters, topic });
  };

  const handleCompanyChange = (company: string | undefined) => {
    onFilterChange({ ...filters, company });
  };

  const handleSearchChange = (search: string) => {
    onFilterChange({ ...filters, search: search || undefined });
  };

  const clearFilters = () => {
    onFilterChange({});
  };

  const hasActiveFilters = filters.year || filters.topic || filters.company || filters.search;

  return (
    <aside className="w-72 flex-shrink-0">
      <div className="glass-card p-6 sticky top-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-slate-200">
            <Filter className="w-5 h-5" />
            <span className="font-semibold">필터</span>
          </div>
          {hasActiveFilters && (
            <button 
              onClick={clearFilters}
              className="text-xs text-slate-500 hover:text-primary-400 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" />
              초기화
            </button>
          )}
        </div>

        {/* Search */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">검색</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="제목, 내용 검색..."
              value={filters.search || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="input-field pl-10"
            />
          </div>
        </div>

        {/* Year Filter */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-3">년도</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleYearChange(undefined)}
              className={`filter-chip ${!filters.year ? 'filter-chip-active' : 'filter-chip-inactive'}`}
            >
              전체
            </button>
            {options.years.map((year) => (
              <button
                key={year}
                onClick={() => handleYearChange(year)}
                className={`filter-chip ${filters.year === year ? 'filter-chip-active' : 'filter-chip-inactive'}`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Filter */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-3">주제</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleTopicChange(undefined)}
              className={`filter-chip ${!filters.topic ? 'filter-chip-active' : 'filter-chip-inactive'}`}
            >
              전체
            </button>
            {options.topics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicChange(topic)}
                className={`filter-chip ${filters.topic === topic ? 'filter-chip-active' : 'filter-chip-inactive'}`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>

        {/* Company Filter */}
        <div>
          <label className="block text-sm text-slate-400 mb-3">회사</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleCompanyChange(undefined)}
              className={`filter-chip ${!filters.company ? 'filter-chip-active' : 'filter-chip-inactive'}`}
            >
              전체
            </button>
            {options.companies.map((company) => (
              <button
                key={company}
                onClick={() => handleCompanyChange(company)}
                className={`filter-chip ${filters.company === company ? 'filter-chip-active' : 'filter-chip-inactive'}`}
              >
                {company}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

