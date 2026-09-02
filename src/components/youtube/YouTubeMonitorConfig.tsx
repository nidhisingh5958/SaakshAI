import React from 'react';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface YouTubeMonitorConfigProps {
  keyword: string;
  onKeywordChange: (val: string) => void;
  onMonitor: () => void;
  isFetching: boolean;
  isAnalyzing: boolean;
  progress: { completed: number; total: number };
}

export const YouTubeMonitorConfig: React.FC<YouTubeMonitorConfigProps> = ({
  keyword,
  onKeywordChange,
  onMonitor,
  isFetching,
  isAnalyzing,
  progress,
}) => {
  const isLoading = isFetching || isAnalyzing;

  return (
    <div className="bg-[#FFFDF9] border border-[#E3D5C0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
      <Input
        label="Search topic or keyword"
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onMonitor()}
        placeholder="e.g., election fraud, miracle cure, breaking news..."
        icon={<Search size={15} />}
        disabled={isLoading}
      />

      <div className="flex justify-end pt-2">
        <Button
          onClick={onMonitor}
          disabled={isLoading || !keyword.trim()}
          variant="primary"
          size="md"
          icon={isLoading ? <Loader2 size={16} className="animate-spin" /> : undefined}
          className="w-full sm:w-auto"
        >
          {isFetching 
            ? 'Fetching videos...' 
            : isAnalyzing 
            ? `Analyzing content (${progress.completed}/${progress.total})...` 
            : 'Analyze videos'}
        </Button>
      </div>
    </div>
  );
};
