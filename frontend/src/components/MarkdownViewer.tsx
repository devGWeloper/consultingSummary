import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownViewerProps {
  content: string;
  variant?: 'full' | 'summary';
}

export default function MarkdownViewer({ content, variant = 'full' }: MarkdownViewerProps) {
  const className = variant === 'summary' ? 'markdown-summary' : 'markdown-content';
  
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}

