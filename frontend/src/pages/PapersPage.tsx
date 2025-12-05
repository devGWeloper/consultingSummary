import { useEffect, useState } from 'react';
import { Loader2, FileText } from 'lucide-react';
import { papersApi } from '../api/client';
import PaperCard from '../components/PaperCard';
import FilterSidebar from '../components/FilterSidebar';
import type { PaperListItem, FilterOptions, Filters } from '../types';

export default function PapersPage() {
  const [papers, setPapers] = useState<PaperListItem[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ years: [], topics: [], companies: [] });
  const [filters, setFilters] = useState<Filters>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  useEffect(() => {
    loadPapers();
  }, [filters]);

  const loadFilterOptions = async () => {
    try {
      const options = await papersApi.getFilterOptions();
      setFilterOptions(options);
    } catch (error) {
      console.error('필터 옵션 로드 실패:', error);
    }
  };

  const loadPapers = async () => {
    setIsLoading(true);
    try {
      const data = await papersApi.getPapers(filters);
      setPapers(data);
    } catch (error) {
      console.error('리포트 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <FilterSidebar
        options={filterOptions}
        filters={filters}
        onFilterChange={setFilters}
      />

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">리포트 목록</h1>
            <p className="text-slate-500">
              {isLoading ? '로딩 중...' : `총 ${papers.length}개의 리포트`}
            </p>
          </div>
        </div>

        {/* Papers Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
          </div>
        ) : papers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {papers.map((paper, index) => (
              <PaperCard key={paper.id} paper={paper} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-300 mb-2">검색 결과가 없습니다</h3>
            <p className="text-slate-500">필터를 조정하거나 다른 검색어를 시도해보세요</p>
          </div>
        )}
      </main>
    </div>
  );
}

