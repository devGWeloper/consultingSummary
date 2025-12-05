import { Link } from 'react-router-dom';
import { Calendar, Building2, Tag, ArrowRight } from 'lucide-react';
import type { PaperListItem } from '../types';

interface PaperCardProps {
  paper: PaperListItem;
  index?: number;
}

export default function PaperCard({ paper, index = 0 }: PaperCardProps) {
  // 토픽별 색상 매핑
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
    <Link 
      to={`/papers/${paper.id}`}
      className={`group glass-card p-6 hover:border-primary-500/50 
                  transition-all duration-300 hover:shadow-xl hover:shadow-primary-500/10
                  animate-fade-in opacity-0`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      {/* Topic Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${gradientColor} text-white`}>
          {paper.topic}
        </span>
        <span className="text-slate-500 text-sm flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {paper.year}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-100 mb-2 group-hover:text-primary-400 transition-colors line-clamp-2">
        {paper.title}
      </h3>

      {/* Company */}
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
        <Building2 className="w-4 h-4" />
        <span>{paper.company}</span>
      </div>

      {/* Summary */}
      {paper.summary && (
        <p className="text-slate-500 text-sm line-clamp-3 mb-4">
          {paper.summary}
        </p>
      )}

      {/* Read More */}
      <div className="flex items-center gap-2 text-primary-400 text-sm font-medium 
                      opacity-0 group-hover:opacity-100 transition-opacity">
        <span>자세히 보기</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

