import { useNavigate } from 'react-router-dom';
import UploadForm from '../components/UploadForm';

export default function UploadPage() {
  const navigate = useNavigate();

  const handleSuccess = () => {
    setTimeout(() => {
      navigate('/papers');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">리포트 업로드</h1>
        <p className="text-slate-400">
          AI로 요약한 MD 파일을 업로드하세요
        </p>
      </div>

      <UploadForm onSuccess={handleSuccess} />

      {/* Tips */}
      <div className="mt-8 glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">💡 Tips</h3>
        <ul className="space-y-3 text-slate-400 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            <span>원본 White Paper를 ChatGPT, Claude 등에게 요약 요청 후 MD 파일로 저장하세요</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            <span>요약 프롬프트 예시: "다음 리포트의 핵심 내용을 마크다운 형식으로 요약해줘. 주요 발견, 시사점, 액션 아이템을 포함해서."</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-primary-400">•</span>
            <span>폴더 스캔 방식: <code className="bg-slate-800 px-2 py-0.5 rounded text-xs">backend/storage/papers/년도/주제/회사명-제목.md</code> 구조로 파일을 넣고 홈에서 스캔</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

