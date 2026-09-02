import React, { useState } from 'react';
import {
  Users,
  AlertCircle,
  SlidersHorizontal
} from 'lucide-react';
import {
  RedditPost,
  RedditAnalysisResult,
  NarrativeCluster,
  RedditMonitorStatus
} from '../types';
import {
  fetchSubredditPosts,
  searchRedditPosts,
  analyzeBatchPosts,
  detectNarrativeClusters
} from '../services/redditService';

// UI Design System & Component Imports
import { RedditHeader } from '../src/components/reddit/RedditHeader';
import { RedditMonitorConfig } from '../src/components/reddit/RedditMonitorConfig';
import { RedditNarrativeClusters } from '../src/components/reddit/RedditNarrativeClusters';
import { RedditPostInspector } from '../src/components/reddit/RedditPostInspector';
import { RiskIndicator } from '../src/components/ui/RiskIndicator';
import { Button } from '../src/components/ui/Button';

export const RedditMonitor: React.FC = () => {
  const [subreddit, setSubreddit] = useState('');
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<RedditMonitorStatus>('idle');
  const [results, setResults] = useState<RedditAnalysisResult[]>([]);
  const [clusters, setClusters] = useState<NarrativeCluster[]>([]);
  const [selectedPost, setSelectedPost] = useState<RedditAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [sortBy, setSortBy] = useState<'fakeRisk' | 'credibility' | 'virality'>('fakeRisk');

  const handleMonitor = async () => {
    if (!subreddit.trim() && !keyword.trim()) {
      setError('Please enter a subreddit or topic keyword');
      return;
    }

    setStatus('fetching');
    setError(null);
    setResults([]);
    setClusters([]);
    setSelectedPost(null);

    try {
      let posts: RedditPost[] = [];
      
      if (keyword.trim()) {
        posts = await searchRedditPosts(
          keyword,
          subreddit.trim() || undefined,
          20
        );
      } else if (subreddit.trim()) {
        posts = await fetchSubredditPosts(subreddit.trim(), 'hot', 20);
      }

      if (posts.length === 0) {
        setError('No relevant Reddit posts found matching query');
        setStatus('error');
        return;
      }

      setStatus('analyzing');
      const analysisResults = await analyzeBatchPosts(
        posts,
        5,
        true,
        20,
        (completed, total) => {
          setProgress({ completed, total });
        }
      );

      const narrativeClusters = detectNarrativeClusters(analysisResults, 60, 2);

      setResults(analysisResults);
      setClusters(narrativeClusters);
      setStatus('completed');
    } catch (err: any) {
      console.error('Reddit monitoring error:', err);
      setError(err.message || 'Failed to monitor Reddit content');
      setStatus('error');
    }
  };

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case 'fakeRisk':
        return b.fakeRiskScore - a.fakeRiskScore;
      case 'credibility':
        return a.credibilityScore - b.credibilityScore;
      case 'virality':
        return b.viralityRisk.score - a.viralityRisk.score;
      default:
        return 0;
    }
  });

  return (
    <div className="space-y-8 animate-fade-in text-[#11110F]">
      
      {/* Header */}
      <RedditHeader />

      {/* Query Bar Workspace */}
      <RedditMonitorConfig
        subreddit={subreddit}
        keyword={keyword}
        onSubredditChange={setSubreddit}
        onKeywordChange={setKeyword}
        onMonitor={handleMonitor}
        isFetching={status === 'fetching'}
        isAnalyzing={status === 'analyzing'}
        progress={progress}
      />

      {/* Error Alert Display */}
      {error && (
        <div className="bg-[#A83F3F]/10 border border-[#A83F3F]/25 text-[#A83F3F] p-4 rounded flex items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
          <Button onClick={handleMonitor} variant="danger" size="sm">
            Try query again
          </Button>
        </div>
      )}

      {/* Active Results List */}
      {status === 'completed' && (
        <div className="space-y-6">
          
          {/* Status Bar */}
          <div className="flex items-center justify-between p-4 bg-[#FFFDF8] border border-[#D8D1C4] text-xs font-sans">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E7D50]" />
              <span className="font-semibold text-[#11110F]">
                Monitoring results — {results.length} posts analyzed
              </span>
            </div>
            <div className="font-mono text-[#625E55]">
              Query: {subreddit ? `r/${subreddit}` : 'All subreddits'} {keyword ? `• "${keyword}"` : ''}
            </div>
          </div>

          {/* Emerging Narrative Clusters */}
          <RedditNarrativeClusters clusters={clusters} />

          {/* Research Feed List (Divider-driven instead of cards) */}
          <div className="bg-[#FFFDF8] border border-[#D8D1C4] shadow-xs">
            
            {/* Header Controls */}
            <div className="p-6 border-b border-[#D8D1C4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
              <h3 className="text-xl font-serif font-bold text-[#11110F]">
                Post research feed ({results.length})
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <SlidersHorizontal size={14} className="text-[#625E55]" />
                <span className="font-mono text-[#625E55]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#F5F1E8] border border-[#D8D1C4] px-3 py-1 text-xs text-[#11110F] focus:outline-none focus:border-[#2E7D50]"
                >
                  <option value="fakeRisk">Misinformation risk</option>
                  <option value="credibility">Credibility</option>
                  <option value="virality">Virality risk</option>
                </select>
              </div>
            </div>

            {/* Editorial Research Rows */}
            <div className="divide-y divide-[#D8D1C4]">
              {sortedResults.map((post) => (
                <div
                  key={post.postId}
                  onClick={() => setSelectedPost(post)}
                  className="p-6 hover:bg-[#F5F1E8]/60 transition-colors cursor-pointer space-y-2.5 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#625E55]">
                        <span className="text-[#2E7D50] font-semibold flex items-center gap-1">
                          <Users size={12} />
                          r/{post.subreddit}
                        </span>
                        <span>•</span>
                        <span>{post.topComments.length} comments</span>
                      </div>
                      <h4 className="text-lg font-serif font-bold text-[#11110F] group-hover:text-[#2E7D50] transition-colors leading-snug">
                        {post.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-5 flex-shrink-0">
                      <div className="text-right font-mono">
                        <span className="text-[10px] text-[#625E55] block uppercase">MISINFORMATION RISK</span>
                        <span className={`text-base font-bold ${
                          post.fakeRiskScore >= 70 ? 'text-[#A83F3F]' :
                          post.fakeRiskScore >= 40 ? 'text-[#B0783C]' : 'text-[#2E7D50]'
                        }`}>
                          {Math.round(post.fakeRiskScore)}%
                        </span>
                      </div>

                      <RiskIndicator 
                        level={post.threatLevel === 'critical' || post.threatLevel === 'high' ? 'highRisk' : 'suspicious'} 
                        label={post.threatLevel.toUpperCase()}
                        size="sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs font-sans">
                    <div className="flex gap-2">
                      {post.emotionalTone.anger > 50 && (
                        <span className="px-2 py-0.5 bg-[#A83F3F]/10 text-[#A83F3F] rounded text-[11px] font-mono">Anger signal</span>
                      )}
                      {post.emotionalTone.fear > 50 && (
                        <span className="px-2 py-0.5 bg-[#B0783C]/15 text-[#625E55] rounded text-[11px] font-mono">Fear signal</span>
                      )}
                    </div>

                    <span className="text-xs text-[#2E7D50] font-semibold group-hover:underline">
                      Inspect evidence →
                    </span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Detail Inspector Modal */}
      {selectedPost && (
        <RedditPostInspector post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}

      {/* Empty State Guide */}
      {status === 'idle' && (
        <div className="bg-[#FFFDF8] border border-[#D8D1C4] p-10 text-center space-y-3 shadow-xs">
          <h3 className="text-2xl font-serif font-bold text-[#11110F]">
            Ready for Reddit query
          </h3>
          <p className="text-sm text-[#625E55] max-w-md mx-auto leading-relaxed font-sans">
            Enter a target subreddit or search topic above to begin monitoring discussions, comment sentiment, and emerging narrative clusters.
          </p>
        </div>
      )}

    </div>
  );
};
