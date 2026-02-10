import React, { useState, useCallback } from 'react';
import {
  Youtube,
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
  Shield,
  PlayCircle,
  Video
} from 'lucide-react';
import {
  YouTubeVideo,
  YouTubeAnalysisResult,
  YouTubeNarrativeCluster,
  YouTubeMonitorStatus
} from '../types';
import {
  searchYouTubeVideos,
  analyzeBatchVideos,
  detectNarrativeClusters,
  getTrendingMisinformationTopics
} from '../services/youtubeService';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

export const YouTubeMonitor: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<YouTubeMonitorStatus>('idle');
  const [results, setResults] = useState<YouTubeAnalysisResult[]>([]);
  const [clusters, setClusters] = useState<YouTubeNarrativeCluster[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [sortBy, setSortBy] = useState<'fakeRisk' | 'credibility' | 'virality' | 'views'>('fakeRisk');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const handleMonitor = async () => {
    if (!keyword.trim()) {
      setError('Please enter a keyword or topic');
      return;
    }

    setStatus('fetching');
    setError(null);
    setResults([]);
    setClusters([]);
    setSelectedVideo(null);

    try {
      // Fetch videos
      setProgress({ completed: 0, total: 1 });
      const videos = await searchYouTubeVideos(keyword.trim(), 10, 'relevance');

      if (videos.length === 0) {
        setError('No videos found');
        setStatus('error');
        return;
      }

      // Analyze videos
      setStatus('analyzing');
      setProgress({ completed: 0, total: videos.length });

      const analysisResults = await analyzeBatchVideos(videos, (completed, total) => {
        setProgress({ completed, total });
      });

      // Detect narrative clusters
      const narrativeClusters = detectNarrativeClusters(analysisResults, 2);

      setResults(analysisResults);
      setClusters(narrativeClusters);
      setStatus('completed');
    } catch (err: any) {
      console.error('YouTube monitoring error:', err);
      setError(err.message || 'Failed to analyze YouTube videos');
      setStatus('error');
    }
  };

  const getSortedResults = useCallback(() => {
    const sorted = [...results].sort((a, b) => {
      let compareA: number, compareB: number;

      switch (sortBy) {
        case 'fakeRisk':
          compareA = a.fakeRiskScore;
          compareB = b.fakeRiskScore;
          break;
        case 'credibility':
          compareA = a.credibilityScore;
          compareB = b.credibilityScore;
          break;
        case 'virality':
          compareA = a.viralityRisk.score;
          compareB = b.viralityRisk.score;
          break;
        case 'views':
          compareA = a.viewCount;
          compareB = b.viewCount;
          break;
        default:
          compareA = a.fakeRiskScore;
          compareB = b.fakeRiskScore;
      }

      return sortOrder === 'desc' ? compareB - compareA : compareA - compareB;
    });

    return sorted;
  }, [results, sortBy, sortOrder]);

  const getThreatBadgeColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-emerald-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-rose-400';
  };

  const getRiskColor = (risk: number) => {
    if (risk >= 70) return 'text-rose-400';
    if (risk >= 40) return 'text-orange-400';
    return 'text-emerald-400';
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  const getEmotionalData = (result: YouTubeAnalysisResult) => [
    { axis: 'Anger', value: result.emotionalTone.anger },
    { axis: 'Fear', value: result.emotionalTone.fear },
    { axis: 'Urgency', value: result.emotionalTone.urgency },
    { axis: 'Joy', value: result.emotionalTone.joy },
    { axis: 'Neutral', value: result.emotionalTone.neutrality }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-xl blur-lg opacity-50" />
            <div className="relative bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
              <Youtube size={28} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white">
              YouTube Monitor
            </h1>
            <p className="text-slate-400 text-sm">
              Detect misinformation in video content and comments
            </p>
          </div>
        </div>

        {status === 'completed' && results.length > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg">
            <Video size={16} className="text-blue-400" />
            <span className="text-sm font-semibold text-slate-300">
              {results.length} videos analyzed
            </span>
          </div>
        )}
      </div>

      {/* Search Panel */}
      <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-6 space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">
            Search Topic or Keyword
          </label>
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleMonitor()}
              placeholder="e.g., election fraud, miracle cure, breaking news..."
              className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-4 py-3 pl-12 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 transition-all"
              disabled={status === 'fetching' || status === 'analyzing'}
            />
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            />
          </div>
        </div>

        <button
          onClick={handleMonitor}
          disabled={status === 'fetching' || status === 'analyzing' || !keyword.trim()}
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-700 disabled:to-slate-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          {status === 'fetching' || status === 'analyzing' ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {status === 'fetching' ? 'Fetching Videos...' : 'Analyzing Content...'}
              {status === 'analyzing' && ` (${progress.completed}/${progress.total})`}
            </>
          ) : (
            <>
              <Search size={20} />
              Analyze Videos
            </>
          )}
        </button>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-lg flex items-center gap-3">
            <AlertCircle size={20} />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Narrative Alert Banner */}
      {clusters.length > 0 && (
        <div className="bg-gradient-to-r from-rose-500/10 to-orange-500/10 border border-rose-500/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-rose-500/20 rounded-xl">
              <AlertTriangle size={24} className="text-rose-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-rose-400 mb-2">
                Potential Misinformation Trend Detected
              </h3>
              <p className="text-slate-300 text-sm mb-3">
                {clusters.length} narrative cluster{clusters.length > 1 ? 's' : ''} identified
                across multiple videos showing similar risky patterns.
              </p>
              <div className="space-y-2">
                {clusters.map((cluster) => (
                  <div
                    key={cluster.id}
                    className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">
                        {cluster.videoIds.length} videos
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded border ${getThreatBadgeColor(
                          cluster.averageThreatLevel
                        )}`}
                      >
                        {cluster.averageThreatLevel.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{cluster.theme}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Risk Table */}
      {results.length > 0 && (
        <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="border-b border-slate-700/50 p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity size={20} className="text-blue-400" />
                Video Risk Analysis
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'fakeRisk' | 'credibility' | 'virality' | 'views')
                  }
                  className="bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500/50"
                >
                  <option value="fakeRisk">Fake Risk</option>
                  <option value="credibility">Credibility</option>
                  <option value="virality">Virality</option>
                  <option value="views">Views</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="p-2 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-blue-500/50 transition-all"
                >
                  {sortOrder === 'desc' ? (
                    <ChevronDown size={16} className="text-slate-400" />
                  ) : (
                    <ChevronUp size={16} className="text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Table Content */}
          <div className="divide-y divide-slate-700/30">
            {getSortedResults().map((result) => (
              <div
                key={result.videoId}
                className="p-4 hover:bg-slate-800/30 transition-all cursor-pointer"
                onClick={() => setSelectedVideo(result)}
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={result.thumbnailUrl}
                      alt={result.title}
                      className="w-40 h-24 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-xs text-white font-semibold">
                      <Eye size={12} className="inline mr-1" />
                      {formatNumber(result.viewCount)}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-white font-semibold line-clamp-2 flex-1">
                        {result.title}
                      </h3>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded border flex-shrink-0 ${getThreatBadgeColor(
                          result.threatLevel
                        )}`}
                      >
                        {result.threatLevel.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Users size={12} />
                        {result.channelTitle}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatDate(result.publishedAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={12} />
                        {formatNumber(result.commentCount)}
                      </span>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-slate-800/50 rounded-lg p-2">
                        <div className="text-xs text-slate-400 mb-1">Credibility</div>
                        <div className={`text-lg font-bold ${getScoreColor(result.credibilityScore)}`}>
                          {result.credibilityScore}%
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2">
                        <div className="text-xs text-slate-400 mb-1">Fake Risk</div>
                        <div className={`text-lg font-bold ${getRiskColor(result.fakeRiskScore)}`}>
                          {result.fakeRiskScore}%
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-lg p-2">
                        <div className="text-xs text-slate-400 mb-1">Virality</div>
                        <div className={`text-lg font-bold ${getRiskColor(result.viralityRisk.score)}`}>
                          {result.viralityRisk.score}%
                        </div>
                      </div>
                    </div>

                    {/* Linguistic Risks */}
                    {result.linguisticRisks.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {result.linguisticRisks.slice(0, 3).map((risk, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded"
                          >
                            {risk.type}
                          </span>
                        ))}
                        {result.narrativeClusterId && (
                          <span className="text-xs px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded flex items-center gap-1">
                            <TrendingUp size={12} />
                            Part of cluster
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Detail Panel */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700/50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-slate-900 border-b border-slate-700/50 p-6 flex items-start justify-between">
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-bold text-white mb-2">{selectedVideo.title}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-1">
                    <Users size={14} />
                    {selectedVideo.channelTitle}
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye size={14} />
                    {formatNumber(selectedVideo.viewCount)} views
                  </span>
                  <a
                    href={selectedVideo.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink size={14} />
                    Watch on YouTube
                  </a>
                </div>
              </div>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white p-2 hover:bg-slate-800/50 rounded-lg transition-all"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Risk Overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield size={16} className="text-blue-400" />
                    <span className="text-sm font-semibold text-slate-300">Credibility</span>
                  </div>
                  <div className={`text-3xl font-bold ${getScoreColor(selectedVideo.credibilityScore)}`}>
                    {selectedVideo.credibilityScore}%
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-orange-400" />
                    <span className="text-sm font-semibold text-slate-300">Fake Risk</span>
                  </div>
                  <div className={`text-3xl font-bold ${getRiskColor(selectedVideo.fakeRiskScore)}`}>
                    {selectedVideo.fakeRiskScore}%
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp size={16} className="text-purple-400" />
                    <span className="text-sm font-semibold text-slate-300">Virality Risk</span>
                  </div>
                  <div className={`text-3xl font-bold ${getRiskColor(selectedVideo.viralityRisk.score)}`}>
                    {selectedVideo.viralityRisk.score}%
                  </div>
                </div>
              </div>

              {/* Emotional Tone Radar */}
              <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                <h3 className="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
                  <Activity size={16} className="text-blue-400" />
                  Emotional Tone Analysis
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={getEmotionalData(selectedVideo)}>
                    <PolarGrid stroke="#475569" />
                    <PolarAngleAxis dataKey="axis" stroke="#94a3b8" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#475569" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Radar name="Emotional Tone" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              {/* Linguistic Risks */}
              {selectedVideo.linguisticRisks.length > 0 && (
                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">
                    Linguistic Risk Indicators
                  </h3>
                  <div className="space-y-3">
                    {selectedVideo.linguisticRisks.map((risk, idx) => (
                      <div key={idx} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-orange-400 capitalize">
                            {risk.type.replace(/-/g, ' ')}
                          </span>
                          <span className="text-xs text-slate-400">
                            Severity: {risk.severity}%
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mb-2">{risk.description}</p>
                        {risk.foundPhrases.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {risk.foundPhrases.slice(0, 3).map((phrase, pidx) => (
                              <span
                                key={pidx}
                                className="text-xs px-2 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded"
                              >
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

              {/* Comment Risk Summary */}
              {selectedVideo.topComments.length > 0 && (
                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                    <MessageSquare size={16} className="text-blue-400" />
                    Top Comments ({selectedVideo.topComments.length})
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {selectedVideo.topComments.slice(0, 5).map((comment) => (
                      <div key={comment.id} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-blue-400">
                            {comment.authorDisplayName}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <ThumbsUp size={10} />
                            {comment.likeCount}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 line-clamp-3">{comment.textDisplay}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Highlighted Text */}
              {selectedVideo.highlightedText.length > 0 && (
                <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                  <h3 className="text-sm font-semibold text-slate-300 mb-3">
                    Suspicious Content Highlights
                  </h3>
                  <div className="space-y-2">
                    {selectedVideo.highlightedText
                      .filter((h) => h.type === 'suspicious')
                      .slice(0, 5)
                      .map((highlight, idx) => (
                        <div
                          key={idx}
                          className="bg-rose-500/10 border border-rose-500/20 rounded-lg p-3"
                        >
                          <p className="text-sm text-slate-300 mb-1">"{highlight.text}"</p>
                          {highlight.tooltip && (
                            <p className="text-xs text-slate-500">{highlight.tooltip}</p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {status === 'idle' && (
        <div className="bg-slate-900/30 border border-dashed border-slate-700/50 rounded-2xl p-12 text-center">
          <div className="inline-flex p-4 bg-red-500/10 rounded-2xl mb-4">
            <Youtube size={48} className="text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Start Monitoring YouTube Content
          </h3>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Enter a keyword or topic to search and analyze YouTube videos for potential
            misinformation, emotional manipulation, and viral deception patterns.
          </p>
        </div>
      )}
    </div>
  );
};
