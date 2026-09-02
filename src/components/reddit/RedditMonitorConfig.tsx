import React from 'react';
import { Search, Loader2 } from 'lucide-react';
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
    <div className="bg-[#FFFDF9] border border-[#E3D5C0] rounded-2xl p-6 sm:p-8 space-y-4 shadow-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Subreddit (optional)"
          value={subreddit}
          onChange={(e) => onSubredditChange(e.target.value)}
          placeholder="technology, worldnews, crypto..."
          disabled={isLoading}
        />

        <Input
          label="Topic or keyword (optional)"
          value={keyword}
          onChange={(e) => onKeywordChange(e.target.value)}
          placeholder="vaccine, AI regulation, election..."
          icon={<Search size={15} />}
          disabled={isLoading}
        />
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={onMonitor}
          disabled={isLoading || (!subreddit.trim() && !keyword.trim())}
          variant="primary"
          size="md"
          icon={isLoading ? <Loader2 size={16} className="animate-spin" /> : undefined}
          className="w-full sm:w-auto"
        >
          {isFetching 
            ? 'Fetching posts...' 
            : isAnalyzing 
            ? `Analyzing signals (${progress.completed}/${progress.total})...` 
            : 'Start monitoring'}
        </Button>
      </div>
    </div>
  );
};
