import React from 'react';
import { Search, Radio, Loader2, ArrowRight } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export interface RedditMonitorConfigProps {
  subreddit: string;
  keyword: string;
  onSubredditChange: (val: string) => void;
  onKeywordChange: (val: string) => void;
  onMonitor: () => void;
  isFetching: boolean;
  isAnalyzing: boolean;
  progress: { completed: number; total: number };
}

export const RedditMonitorConfig: React.FC<RedditMonitorConfigProps> = ({
  subreddit,
  keyword,
  onSubredditChange,
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
          <Radio size={14} className="text-[#9B6DFF]" />
          MONITOR TARGET SPECIFICATION
        </span>
        <span className="text-[11px] font-mono text-[#5F687C]">
          REDDIT JSON DATA API
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="SUBREDDIT (OPTIONAL)"
          value={subreddit}
          onChange={(e) => onSubredditChange(e.target.value)}
          placeholder="technology, worldnews, crypto..."
          disabled={isLoading}
        />

        <Input
          label="KEYWORD / TOPIC (OPTIONAL)"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="vaccine, AI regulation, election..."
          icon={<Search size={16} />}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={onMonitor}
          disabled={isLoading || (!subreddit.trim() && !keyword.trim())}
          variant="primary"
          size="lg"
          icon={isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
          className="w-full sm:w-auto bg-[#9B6DFF] hover:bg-[#8A5BEF] border-[#9B6DFF]/30"
        >
          {isFetching 
            ? 'FETCHING POSTS...' 
            : isAnalyzing 
            ? `ANALYZING SIGNALS (${progress.completed}/${progress.total})...` 
            : 'START MONITORING →'}
        </Button>
      </div>
    </div>
  );
};
