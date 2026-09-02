import React, { useState } from 'react';
import {
  MessageSquare,
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
import { SectionLabel } from '../src/components/ui/SectionLabel';
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
    <div className="space-y-8 animate-fade-in text-[#0D0B09]">
      
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
        <div className="bg-[#B94A48]/12 border border-[#B94A48]/25 text-[#B94A48] p-4 rounded-2xl flex items-center justify-between gap-4 text-xs font-mono">
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
          <div className="flex items-center justify-between p-4 bg-[#FFFDF9] border border-[#E3D5C0] rounded-xl text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2EA334]" />
              <span className="font-semibold text-[#0D0B09]">
                Monitoring results — {results.length} posts analyzed
              </span>
            </div>
            <div className="font-mono text-[#5A4434]">
              Query: {subreddit ? `r/${subreddit}` : 'All subreddits'} {keyword ? `• "${keyword}"` : ''}
            </div>
          </div>

          {/* Emerging Narrative Clusters */}
          <RedditNarrativeClusters clusters={clusters} />

          {/* Research Feed List */}
          <div className="bg-[#FFFDF9] border border-[#E3D5C0] rounded-2xl overflow-hidden shadow-sm">
            
            {/* Header Controls */}
            <div className="p-6 border-b border-[#E3D5C0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <SectionLabel icon={<MessageSquare size={14} className="text-[#2EA334]" />}>
                Post research feed ({results.length})
              </SectionLabel>

              <div className="flex items-center gap-2 text-xs">
                <SlidersHorizontal size={14} className="text-[#5A4434]" />
                <span className="font-mono text-[#5A4434]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#F4EBDD] border border-[#E3D5C0] rounded-lg px-3 py-1 text-xs text-[#0D0B09] focus:outline-none focus:border-[#2EA334]"
                >
                  <option value="fakeRisk">Fake risk (high to low)</option>
                  <option value="credibility">Credibility (low to high)</option>
                  <option value="virality">Virality risk (high to low)</option>
                </select>
              </div>
            </div>

            {/* Editorial Research Rows */}
            <div className="divide-y divide-[#E3D5C0]">
              {sortedResults.map((post) => (
                <div
                  key={post.postId}
                  onClick={() => setSelectedPost(post)}
                  className="p-6 hover:bg-[#F4EBDD]/60 transition-colors cursor-pointer space-y-2.5 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2 text-xs font-mono text-[#5A4434]">
                        <span className="text-[#2EA334] font-semibold flex items-center gap-1">
                          <Users size={12} />
                          r/{post.subreddit}
                        </span>
                        <span>•</span>
                        <span>{post.topComments.length} comments</span>
                      </div>
                      <h4 className="text-lg font-serif font-bold text-[#0D0B09] group-hover:text-[#2EA334] transition-colors leading-snug">
                        {post.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-5 flex-shrink-0">
                      <div className="text-right font-mono">
                        <span className="text-[10px] text-[#5A4434] block uppercase">MISINFORMATION RISK</span>
                        <span className={`text-base font-bold ${
                          post.fakeRiskScore >= 70 ? 'text-[#B94A48]' :
                          post.fakeRiskScore >= 40 ? 'text-[#B19C7A]' : 'text-[#2EA334]'
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

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex gap-2">
                      {post.emotionalTone.anger > 50 && (
                        <span className="px-2.5 py-0.5 bg-[#B94A48]/12 text-[#B94A48] rounded-full text-[11px] font-medium">Anger signal</span>
                      )}
                      {post.emotionalTone.fear > 50 && (
                        <span className="px-2.5 py-0.5 bg-[#B19C7A]/20 text-[#5A4434] rounded-full text-[11px] font-medium">Fear signal</span>
                      )}
                    </div>

                    <span className="text-xs text-[#2EA334] font-semibold group-hover:underline">
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
        <div className="bg-[#FFFDF9] border border-[#E3D5C0] rounded-3xl p-10 text-center space-y-3 shadow-sm">
          <h3 className="text-xl font-serif font-bold text-[#0D0B09]">
            Ready for Reddit query
          </h3>
          <p className="text-sm text-[#5A4434] max-w-md mx-auto leading-relaxed">
            Enter a target subreddit or search topic above to begin monitoring conversations, comment sentiment, and emerging narrative clusters.
          </p>
        </div>
      )}

    </div>
  );
};
