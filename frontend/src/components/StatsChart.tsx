import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import type { PaperStats } from '../types';

interface StatsChartProps {
  stats: PaperStats;
}

const COLORS = ['#0ea5e9', '#d946ef', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function StatsChart({ stats }: StatsChartProps) {
  // 년도별 데이터 변환
  const yearData = Object.entries(stats.by_year)
    .map(([year, count]) => ({ name: year, value: count }))
    .sort((a, b) => Number(a.name) - Number(b.name));

  // 주제별 데이터 변환
  const topicData = Object.entries(stats.by_topic)
    .map(([topic, count]) => ({ name: topic, value: count }));

  // 회사별 데이터 변환
  const companyData = Object.entries(stats.by_company)
    .map(([company, count]) => ({ name: company, value: count }))
    .slice(0, 8);

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-slate-300 text-sm">{`${label}: ${payload[0].value}개`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 년도별 차트 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-6">년도별 분포</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 주제별 차트 */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-6">주제별 분포</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={topicData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={60}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {topicData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => [`${value}개`, '문서 수']} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 회사별 차트 */}
      <div className="glass-card p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-100 mb-6">회사별 분포</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={companyData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis type="number" stroke="#94a3b8" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="#94a3b8" fontSize={12} width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]}>
              {companyData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

