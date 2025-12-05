import { useState, useRef } from 'react';
import { Upload, FileText, X, Loader2, CheckCircle } from 'lucide-react';
import { papersApi } from '../api/client';

interface UploadFormProps {
  onSuccess?: () => void;
}

export default function UploadForm({ onSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.endsWith('.md')) {
        setError('MD 파일만 업로드 가능합니다');
        return;
      }
      setFile(selectedFile);
      setError(null);
      
      // 파일명에서 기본 제목 추출
      const baseName = selectedFile.name.replace('.md', '');
      if (!title) {
        setTitle(baseName.replace(/[-_]/g, ' '));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      if (!droppedFile.name.endsWith('.md')) {
        setError('MD 파일만 업로드 가능합니다');
        return;
      }
      setFile(droppedFile);
      setError(null);
      
      const baseName = droppedFile.name.replace('.md', '');
      if (!title) {
        setTitle(baseName.replace(/[-_]/g, ' '));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !company || !topic) {
      setError('모든 필수 항목을 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await papersApi.uploadPaper({
        file,
        title,
        company,
        year,
        topic,
        summary: summary || undefined,
      });

      setSuccess(true);
      
      // Reset form
      setTimeout(() => {
        setFile(null);
        setTitle('');
        setCompany('');
        setYear(new Date().getFullYear());
        setTopic('');
        setSummary('');
        setSuccess(false);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      setError('업로드 중 오류가 발생했습니다');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const commonTopics = ['AI', 'Digital', 'Strategy', 'Finance', 'Operations', 'Marketing', 'Technology'];
  const commonCompanies = ['McKinsey', 'BCG', 'Bain', 'Deloitte', 'Accenture', 'EY', 'KPMG', 'PwC'];

  if (success) {
    return (
      <div className="glass-card p-12 text-center animate-fade-in">
        <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-100 mb-2">업로드 완료!</h3>
        <p className="text-slate-400">성공적으로 등록되었습니다</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-8">
      {/* File Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200
          ${file 
            ? 'border-primary-500 bg-primary-500/10' 
            : 'border-slate-700 hover:border-slate-600 hover:bg-slate-800/30'
          }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".md"
          onChange={handleFileChange}
          className="hidden"
        />
        
        {file ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="w-8 h-8 text-primary-400" />
            <div className="text-left">
              <p className="text-slate-100 font-medium">{file.name}</p>
              <p className="text-slate-500 text-sm">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="ml-4 p-1 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        ) : (
          <>
            <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-300 mb-2">MD 파일을 드래그하거나 클릭하여 선택</p>
            <p className="text-slate-500 text-sm">Markdown (.md) 파일만 지원</p>
          </>
        )}
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-2 gap-6 mt-8">
        {/* Title */}
        <div className="col-span-2">
          <label className="block text-sm text-slate-400 mb-2">제목 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="리포트 제목"
            className="input-field"
            required
          />
        </div>

        {/* Company */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">회사 *</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="회사명"
            list="companies"
            className="input-field"
            required
          />
          <datalist id="companies">
            {commonCompanies.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        {/* Year */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">년도 *</label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            min={2000}
            max={2030}
            className="input-field"
            required
          />
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm text-slate-400 mb-2">주제 *</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="주제 (예: AI, Strategy)"
            list="topics"
            className="input-field"
            required
          />
          <datalist id="topics">
            {commonTopics.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>

        {/* Summary (Optional) */}
        <div className="col-span-2">
          <label className="block text-sm text-slate-400 mb-2">요약 (선택)</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="짧은 요약 (비워두면 자동 생성)"
            rows={3}
            className="input-field resize-none"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <div className="mt-8 flex justify-end">
        <button 
          type="submit" 
          disabled={isLoading || !file}
          className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              업로드 중...
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              업로드
            </>
          )}
        </button>
      </div>
    </form>
  );
}

