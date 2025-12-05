import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Building2, Tag, Trash2, Loader2 } from 'lucide-react';
import { papersApi } from '../api/client';
import MarkdownViewer from '../components/MarkdownViewer';
import type { Paper } from '../types';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPaper(parseInt(id));
    }
  }, [id]);

  const loadPaper = async (paperId: number) => {
    try {
      const data = await papersApi.getPaper(paperId);
      setPaper(data);
    } catch (err) {
      setError('리포트를 찾을 수 없습니다');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!paper || !confirm('정말 삭제하시겠습니까?')) return;
    
    setIsDeleting(true);
    try {
      await papersApi.deletePaper(paper.id);
      navigate('/papers');
    } catch (err) {
      setError('삭제 중 오류가 발생했습니다');
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    );
  }

  if (error || !paper) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-slate-300 mb-4">{error || '리포트를 찾을 수 없습니다'}</h2>
        <Link to="/papers" className="btn-primary">
          목록으로 돌아가기
        </Link>
      </div>
    );
  }

  // 토픽별 색상
  const topicColors: Record<string, string> = {
    'AI': 'from-violet-500 to-purple-500',
    'Digital': 'from-blue-500 to-cyan-500',
    'Strategy': 'from-emerald-500 to-teal-500',
    'Finance': 'from-amber-500 to-orange-500',
    'Operations': 'from-rose-500 to-pink-500',
    'Marketing': 'from-fuchsia-500 to-pink-500',
    'Technology': 'from-indigo-500 to-blue-500',
  };
  const gradientColor = topicColors[paper.topic] || 'from-slate-500 to-slate-600';

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Back Button */}
      <Link 
        to="/papers" 
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        목록으로
      </Link>

      {/* Header */}
      <header className="glass-card p-8 mb-8">
        <div className="flex items-start justify-between mb-6">
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r ${gradientColor} text-white`}>
            {paper.topic}
          </span>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
            title="삭제"
          >
            {isDeleting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">{paper.title}</h1>

        <div className="flex flex-wrap items-center gap-6 text-slate-400">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>{paper.company}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{paper.year}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>{paper.topic}</span>
          </div>
        </div>

        {paper.summary && (
          <div className="mt-6 pt-6 border-t border-slate-800">
            <MarkdownViewer content={paper.summary} variant="summary" />
          </div>
        )}
      </header>

      {/* Content */}
      <article className="glass-card p-8">
        <MarkdownViewer content={paper.content} />
      </article>

      {/* Footer */}
      <footer className="mt-8 text-center text-slate-600 text-sm">
        등록일: {new Date(paper.created_at).toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </footer>
    </div>
  );
}

