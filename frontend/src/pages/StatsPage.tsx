import { useEffect, useState } from 'react';
import { Loader2, FileText, TrendingUp, Building2, Tag } from 'lucide-react';
import { papersApi } from '../api/client';
import StatsChart from '../components/StatsChart';
import type { PaperStats } from '../types';

export default function StatsPage() {
  const [stats, setStats] = useState<PaperStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await papersApi.getStats();
      setStats(data);
    } catch (error) {
      console.error('통계 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  if (!stats || stats.total_papers === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-slate-600" />
        </div>
        <h3 className="text-lg font-medium text-slate-300 mb-2">통계 데이터가 없습니다</h3>
        <p className="text-slate-500">리포트를 업로드하면 통계를 확인할 수 있습니다</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">통계 대시보드</h1>
        <p className="text-slate-400">리포트 분포 현황을 한눈에 파악하세요</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <FileText className="w-6 h-6 text-primary-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{stats.total_papers}</div>
              <div className="text-slate-500 text-sm">총 리포트</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center">
              <Tag className="w-6 h-6 text-accent-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{Object.keys(stats.by_topic).length}</div>
              <div className="text-slate-500 text-sm">주제</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{Object.keys(stats.by_company).length}</div>
              <div className="text-slate-500 text-sm">회사</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">
                {Math.max(...Object.values(stats.by_year).map(Number))}
              </div>
              <div className="text-slate-500 text-sm">최다 년도</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <StatsChart stats={stats} />

      {/* Top Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Topics */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">주제별 순위</h3>
          <div className="space-y-3">
            {Object.entries(stats.by_topic)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([topic, count], index) => (
                <div key={topic} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-slate-300">{topic}</span>
                  <span className="text-slate-500">{count}개</span>
                </div>
              ))}
          </div>
        </div>

        {/* Top Companies */}
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">회사별 순위</h3>
          <div className="space-y-3">
            {Object.entries(stats.by_company)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 5)
              .map(([company, count], index) => (
                <div key={company} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-slate-400">
                    {index + 1}
                  </span>
                  <span className="flex-1 text-slate-300">{company}</span>
                  <span className="text-slate-500">{count}개</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

