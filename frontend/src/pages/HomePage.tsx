import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, TrendingUp, Building2, Calendar, ArrowRight, RefreshCw, Loader2 } from 'lucide-react';
import { papersApi } from '../api/client';
import type { PaperStats, PaperListItem } from '../types';

export default function HomePage() {
  const [stats, setStats] = useState<PaperStats | null>(null);
  const [recentPapers, setRecentPapers] = useState<PaperListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanMessage, setScanMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [statsData, papersData] = await Promise.all([
        papersApi.getStats(),
        papersApi.getPapers({})
      ]);
      setStats(statsData);
      setRecentPapers(papersData.slice(0, 6));
    } catch (error) {
      console.error('데이터 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    setScanMessage(null);
    try {
      const result = await papersApi.scanFolder();
      setScanMessage(`스캔 완료: ${result.added}개 추가, ${result.updated}개 업데이트`);
      loadData();
    } catch (error) {
      setScanMessage('스캔 중 오류가 발생했습니다');
    } finally {
      setIsScanning(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full text-primary-400 text-sm mb-6">
          <FileText className="w-4 h-4" />
          컨설팅 리포트 요약 플랫폼
        </div>
        <h1 className="text-5xl font-bold text-white mb-4 font-display">
          White Paper{' '}
          <span className="bg-gradient-to-r from-primary-400 to-accent-400 text-transparent bg-clip-text">
            Summary
          </span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          McKinsey, BCG, Bain 등 글로벌 컨설팅 회사의 리포트를
          <br />
          한눈에 파악하고 인사이트를 얻으세요
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link to="/papers" className="btn-primary flex items-center gap-2">
            리포트 보기
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/upload" className="btn-secondary">
            업로드하기
          </Link>
        </div>
      </section>

      {/* Stats Cards */}
      {stats && (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in stagger-1 opacity-0">
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center mx-auto mb-4">
              <FileText className="w-6 h-6 text-primary-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stats.total_papers}</div>
            <div className="text-slate-500 text-sm">총 리포트</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-accent-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{Object.keys(stats.by_topic).length}</div>
            <div className="text-slate-500 text-sm">주제 카테고리</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-6 h-6 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{Object.keys(stats.by_company).length}</div>
            <div className="text-slate-500 text-sm">컨설팅 회사</div>
          </div>
          
          <div className="glass-card p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{Object.keys(stats.by_year).length}</div>
            <div className="text-slate-500 text-sm">연도 범위</div>
          </div>
        </section>
      )}

      {/* Folder Scan */}
      <section className="glass-card p-6 animate-fade-in stagger-2 opacity-0">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-100 mb-1">폴더 스캔</h3>
            <p className="text-slate-500 text-sm">
              storage/papers 폴더에 MD 파일을 넣고 스캔하면 자동으로 등록됩니다
            </p>
            <p className="text-slate-600 text-xs mt-1">
              폴더 구조: storage/papers/년도/주제/회사명-제목.md
            </p>
          </div>
          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="btn-secondary flex items-center gap-2"
          >
            {isScanning ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            스캔
          </button>
        </div>
        {scanMessage && (
          <div className="mt-4 p-3 bg-primary-500/10 border border-primary-500/30 rounded-lg text-primary-400 text-sm">
            {scanMessage}
          </div>
        )}
      </section>

      {/* Recent Papers */}
      {recentPapers.length > 0 && (
        <section className="animate-fade-in stagger-3 opacity-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">최근 리포트</h2>
            <Link to="/papers" className="text-primary-400 text-sm hover:text-primary-300 flex items-center gap-1">
              전체 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPapers.map((paper, index) => (
              <Link
                key={paper.id}
                to={`/papers/${paper.id}`}
                className="glass-card p-6 hover:border-primary-500/50 transition-all group"
                style={{ animationDelay: `${(index + 4) * 0.1}s` }}
              >
                <div className="flex items-center gap-2 text-slate-500 text-sm mb-3">
                  <span className="px-2 py-1 bg-slate-800 rounded text-xs">{paper.topic}</span>
                  <span>{paper.year}</span>
                </div>
                <h3 className="text-lg font-medium text-slate-100 group-hover:text-primary-400 transition-colors line-clamp-2 mb-2">
                  {paper.title}
                </h3>
                <p className="text-slate-500 text-sm">{paper.company}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {stats?.total_papers === 0 && (
        <section className="text-center py-16 animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-slate-600" />
          </div>
          <h3 className="text-xl font-semibold text-slate-300 mb-2">아직 등록된 리포트가 없습니다</h3>
          <p className="text-slate-500 mb-6">MD 파일을 업로드하거나 폴더 스캔을 통해 시작하세요</p>
          <Link to="/upload" className="btn-primary">
            첫 리포트 업로드
          </Link>
        </section>
      )}
    </div>
  );
}

