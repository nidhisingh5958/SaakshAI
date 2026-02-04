import React, { useState, useCallback } from 'react';
import {
  Radio,
  Activity,
  TrendingUp,
  MessageSquare,
  AlertTriangle,
  Search,
  Loader2,
  ExternalLink,
  Users,
  Clock,
  ThumbsUp,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Shield
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
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

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
      // Fetch posts
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
        setError('No posts found');
        setStatus('error');
        return;
      }

      // Analyze posts
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

      // Detect narrative clusters
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

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-red-400';
    if (score >= 50) return 'text-orange-400';
    if (score >= 25) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-slate-700/50">
        <div className="p-3 bg-gradient-to-br from-purple-500/20 to-indigo-500/20 rounded-xl border border-purple-500/30">
          <Radio size={28} className="text-purple-400" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">Reddit Narrative Intelligence</h2>
          <p className="text-sm text-slate-400">Monitor and analyze Reddit discussions for misinformation patterns</p>
        </div>
      </div>

      {/* Input Panel */}
      <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Subreddit <span className="text-slate-500">(optional)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">r/</span>
              <input
                type="text"
                value={subreddit}
                onChange={(e) => setSubreddit(e.target.value)}
                placeholder="technology, worldnews, etc."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 pl-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={status === 'fetching' || status === 'analyzing'}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Keyword/Topic <span className="text-slate-500">(optional)</span>
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="vaccine, crypto, AI, etc."
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 pl-11 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                disabled={status === 'fetching' || status === 'analyzing'}
              />
            </div>
          </div>
        </div>
        <button
          onClick={handleMonitor}
          disabled={status === 'fetching' || status === 'analyzing'}
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 disabled:from-slate-700 disabled:to-slate-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {status === 'fetching' || status === 'analyzing' ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {status === 'fetching' ? 'Fetching Posts...' : `Analyzing (${progress.completed}/${progress.total})...`}
            </>
          ) : (
            <>
              <Activity size={20} />
              Start Monitoring
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-400 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-red-400 mb-1">Error</h3>
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Narrative Alert Banner */}
      {clusters.length > 0 && (
        <div className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border-2 border-red-500/40 rounded-2xl p-6 animate-pulse">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-500/20 rounded-xl">
              <AlertTriangle size={28} className="text-red-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-black text-red-400 mb-2">High-Risk Narrative Detected</h3>
              <p className="text-slate-300 mb-3">
                Multiple posts with high misinformation risk detected in this subreddit. This may indicate an emerging narrative campaign.
              </p>
              <div className="flex flex-wrap gap-3">
                {clusters.map((cluster) => (
                  <div key={cluster.id} className="bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2">
                    <div className="text-xs text-slate-400">r/{cluster.subreddit}</div>
                    <div className="text-sm font-bold text-white">{cluster.postIds.length} risky posts</div>
                    <div className="text-xs text-red-400">Avg Risk: {Math.round(cluster.averageFakeRisk)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Table */}
      {results.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <MessageSquare size={20} className="text-purple-400" />
              Analyzed Posts ({results.length})
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500"
              >
                <option value="fakeRisk">Fake Risk</option>
                <option value="credibility">Credibility</option>
                <option value="virality">Virality</option>
              </select>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-900/50 border-b border-slate-700/50">
                  <th className="text-left p-4 text-xs font-bold text-slate-400 uppercase">Post</th>
                  <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Credibility</th>
                  <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Fake Risk</th>
                  <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Threat</th>
                  <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Emotional Tone</th>
                  <th className="text-center p-4 text-xs font-bold text-slate-400 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.map((result) => (
                  <tr
                    key={result.postId}
                    className="border-b border-slate-700/30 hover:bg-slate-800/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedPost(result)}
                  >
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-white mb-1 line-clamp-2">
                            {result.title}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              r/{result.subreddit}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare size={12} />
                              {result.topComments.length} comments
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(100 - result.credibilityScore)}`}>
                        {Math.round(result.credibilityScore)}%
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(result.fakeRiskScore)}`}>
                        {Math.round(result.fakeRiskScore)}%
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getThreatColor(result.threatLevel)}`}>
                        {result.threatLevel}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-2">
                        {result.emotionalTone.anger > 50 && (
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">Anger</span>
                        )}
                        {result.emotionalTone.fear > 50 && (
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">Fear</span>
                        )}
                        {result.emotionalTone.urgency > 50 && (
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">Urgency</span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <a
                        href={result.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300 text-sm transition-colors"
                      >
                        <ExternalLink size={16} />
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Post Detail View */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-slate-700/50 flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">{selectedPost.title}</h3>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    r/{selectedPost.subreddit}
                  </span>
                  <a
                    href={selectedPost.postUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    <ExternalLink size={14} />
                    View on Reddit
                  </a>
                </div>
              </div>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-white transition-colors p-2"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Scores */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-1">Credibility</div>
                  <div className={`text-2xl font-bold ${getScoreColor(100 - selectedPost.credibilityScore)}`}>
                    {Math.round(selectedPost.credibilityScore)}%
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-1">Fake Risk</div>
                  <div className={`text-2xl font-bold ${getScoreColor(selectedPost.fakeRiskScore)}`}>
                    {Math.round(selectedPost.fakeRiskScore)}%
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-1">Virality Risk</div>
                  <div className={`text-2xl font-bold ${getScoreColor(selectedPost.viralityRisk.score)}`}>
                    {Math.round(selectedPost.viralityRisk.score)}%
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
                  <div className="text-xs text-slate-400 mb-1">Threat Level</div>
                  <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase border ${getThreatColor(selectedPost.threatLevel)}`}>
                    {selectedPost.threatLevel}
                  </span>
                </div>
              </div>

              {/* Emotional Radar */}
              <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-300 mb-4">Emotional Tone Analysis</h4>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={[
                    { subject: 'Anger', A: selectedPost.emotionalTone.anger, fullMark: 100 },
                    { subject: 'Fear', A: selectedPost.emotionalTone.fear, fullMark: 100 },
                    { subject: 'Urgency', A: selectedPost.emotionalTone.urgency, fullMark: 100 },
                    { subject: 'Neutral', A: selectedPost.emotionalTone.neutrality, fullMark: 100 },
                    { subject: 'Joy', A: selectedPost.emotionalTone.joy, fullMark: 100 },
                  ]}>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Radar name="Emotional Tone" dataKey="A" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.4} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Linguistic Risks */}
              {selectedPost.linguisticRisks.length > 0 && (
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                  <h4 className="text-sm font-bold text-slate-300 mb-4">Linguistic Risks Detected</h4>
                  <div className="space-y-3">
                    {selectedPost.linguisticRisks.map((risk, idx) => (
                      <div key={idx} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-semibold text-white capitalize">
                            {risk.type.replace('-', ' ')}
                          </span>
                          <span className={`text-sm font-bold ${getScoreColor(risk.severity)}`}>
                            {Math.round(risk.severity)}%
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 mb-2">{risk.description}</p>
                        {risk.foundPhrases.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {risk.foundPhrases.slice(0, 3).map((phrase, i) => (
                              <span key={i} className="px-2 py-1 bg-red-500/10 text-red-400 text-xs rounded border border-red-500/30">
                                "{phrase}"
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Comments */}
              {selectedPost.topComments.length > 0 && (
                <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-700/50">
                  <h4 className="text-sm font-bold text-slate-300 mb-4">
                    Top Comments ({selectedPost.topComments.length})
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedPost.topComments.slice(0, 10).map((comment) => (
                      <div key={comment.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30">
                        <div className="flex items-center gap-2 mb-2 text-xs text-slate-500">
                          <span>u/{comment.author}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={12} />
                            {comment.score}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300 line-clamp-3">{comment.body}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
