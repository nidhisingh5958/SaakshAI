import React, { useState } from 'react';
import {
  MessageSquare,
  AlertTriangle,
  ExternalLink,
  Users,
  AlertCircle,
  Radio,
  ArrowRight,
  SlidersHorizontal,
  Search
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
      setError('Please enter a subreddit or keyword');
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
    <div className="space-y-10 animate-fade-in text-[#F4F5F8]">
      
      {/* Editorial Header */}
      <RedditHeader />

      {/* Configuration Input Workspace */}
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
        <div className="bg-[#FF5F6D]/10 border border-[#FF5F6D]/30 text-[#FF5F6D] p-5 rounded-2xl flex items-center justify-between gap-4 text-sm font-mono animate-fade-in">
          <div className="flex items-center gap-3">
            <AlertCircle size={20} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
          <Button onClick={handleMonitor} variant="danger" size="sm">
            Try Again
          </Button>
        </div>
      )}

      {/* Monitoring Active Telemetry Status & Narrative Clusters */}
      {status === 'completed' && (
        <div className="space-y-8">
          
          {/* Status Indicator Bar */}
          <div className="flex items-center justify-between p-4 bg-[#0E1320] border border-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#35D49A] animate-pulse" />
              <span className="text-xs font-mono text-[#35D49A] uppercase tracking-wider font-bold">
                MONITORING ACTIVE — {results.length} POSTS ANALYZED
              </span>
            </div>
            <div className="text-xs font-mono text-[#5F687C]">
              TARGET: {subreddit ? `r/${subreddit}` : 'ALL'} {keyword ? `• "${keyword}"` : ''}
            </div>
          </div>

          {/* Emerging Narrative Clusters */}
          <RedditNarrativeClusters clusters={clusters} />

          {/* Post Risk Analysis Matrix */}
          <div className="bg-[#0E1320] border border-white/10 rounded-2xl overflow-hidden space-y-4">
            
            {/* Table Header Controls */}
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <SectionLabel icon={<MessageSquare size={14} className="text-[#9B6DFF]" />}>
                POST RISK ANALYSIS MATRIX ({results.length})
              </SectionLabel>

              <div className="flex items-center gap-3">
                <SlidersHorizontal size={14} className="text-[#5F687C]" />
                <span className="text-xs font-mono text-[#8992A7]">SORT:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#121827] border border-white/10 rounded px-3 py-1.5 text-xs font-mono text-[#F4F5F8] focus:outline-none focus:border-[#9B6DFF]"
                >
                  <option value="fakeRisk">Fake Risk (High to Low)</option>
                  <option value="credibility">Credibility (Low to High)</option>
                  <option value="virality">Virality Risk (High to Low)</option>
                </select>
              </div>
            </div>

            {/* Post Rows List */}
            <div className="divide-y divide-white/5">
              {sortedResults.map((post) => (
                <div
                  key={post.postId}
                  onClick={() => setSelectedPost(post)}
                  className="p-5 hover:bg-[#121827] transition-colors cursor-pointer space-y-3 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-3 text-xs font-mono text-[#8992A7]">
                        <span className="text-[#9B6DFF] font-semibold flex items-center gap-1">
                          <Users size={12} />
                          r/{post.subreddit}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} />
                          {post.topComments.length} comments
                        </span>
                      </div>
                      <h4 className="text-base font-semibold text-[#F4F5F8] group-hover:text-[#9B6DFF] transition-colors leading-snug">
                        {post.title}
                      </h4>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-[#5F687C] block uppercase">FAKE RISK</span>
                        <span className={`text-lg font-mono font-bold ${
                          post.fakeRiskScore >= 70 ? 'text-[#FF5F6D]' :
                          post.fakeRiskScore >= 40 ? 'text-[#FFB84D]' : 'text-[#35D49A]'
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

                  {/* Emotional triggers summary row */}
                  <div className="flex items-center justify-between pt-1 text-xs font-mono text-[#5F687C]">
                    <div className="flex gap-2">
                      {post.emotionalTone.anger > 50 && (
                        <span className="px-2 py-0.5 bg-[#FF5F6D]/10 text-[#FF5F6D] rounded text-[11px]">ANGER SIGNAL</span>
                      )}
                      {post.emotionalTone.fear > 50 && (
                        <span className="px-2 py-0.5 bg-[#FFB84D]/10 text-[#FFB84D] rounded text-[11px]">FEAR SIGNAL</span>
                      )}
                      {post.emotionalTone.urgency > 50 && (
                        <span className="px-2 py-0.5 bg-[#38D9FF]/10 text-[#38D9FF] rounded text-[11px]">URGENCY SIGNAL</span>
                      )}
                    </div>

                    <span className="text-[#5B8CFF] group-hover:underline flex items-center gap-1">
                      Inspect Post →
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

      {/* Analytical Empty State Guide */}
      {status === 'idle' && (
        <div className="bg-[#0E1320] border border-white/10 rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#9B6DFF]/10 border border-[#9B6DFF]/20 flex items-center justify-center text-[#9B6DFF] mx-auto">
            <Radio size={24} />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#F4F5F8]">
              Target Subreddit or Topic Standby
            </h3>
            <p className="text-xs text-[#8992A7] leading-relaxed">
              Enter a target subreddit or search topic above to begin telemetry monitoring. SaakshAI will analyze discussion posts, comment sentiment, linguistic manipulation, and emerging narrative clusters.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
