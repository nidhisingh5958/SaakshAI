import React from 'react';
import { Search, Youtube, Loader2, ArrowRight } from 'lucide-react';
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
    <div className="bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <span className="text-xs font-mono font-medium text-[#8992A7] uppercase tracking-wider flex items-center gap-2">
          <Youtube size={14} className="text-[#FF5F6D]" />
          SEARCH QUERY SPECIFICATION
        </span>
        <span className="text-[11px] font-mono text-[#5F687C]">
          YOUTUBE DATA API v3
        </span>
      </div>

      <div className="space-y-3">
        <Input
          label="SEARCH TOPIC OR KEYWORD"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onMonitor()}
          placeholder="e.g., election fraud, miracle cure, breaking news..."
          icon={<Search size={16} />}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={onMonitor}
          disabled={isLoading || !keyword.trim()}
          variant="primary"
          size="lg"
          icon={isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          className="w-full sm:w-auto bg-[#FF5F6D] hover:bg-[#E04D5B] border-[#FF5F6D]/30"
        >
          {isFetching 
            ? 'FETCHING VIDEOS...' 
            : isAnalyzing 
            ? `ANALYZING CONTENT (${progress.completed}/${progress.total})...` 
            : 'ANALYZE VIDEOS →'}
        </Button>
      </div>
    </div>
  );
};
