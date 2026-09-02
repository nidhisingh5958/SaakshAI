import React, { useState, useCallback } from 'react';
import {
  MessageSquare,
  Users,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  SlidersHorizontal
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
  detectNarrativeClusters
} from '../services/youtubeService';

// UI Design System & Component Imports
import { YouTubeHeader } from '../src/components/youtube/YouTubeHeader';
import { YouTubeMonitorConfig } from '../src/components/youtube/YouTubeMonitorConfig';
import { YouTubeNarrativeClusters } from '../src/components/youtube/YouTubeNarrativeClusters';
import { YouTubeVideoInspector } from '../src/components/youtube/YouTubeVideoInspector';
import { RiskIndicator } from '../src/components/ui/RiskIndicator';
import { Button } from '../src/components/ui/Button';

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
      setError('Please enter a search topic or keyword');
      return;
    }

    setStatus('fetching');
    setError(null);
    setResults([]);
    setClusters([]);
    setSelectedVideo(null);

    try {
      setProgress({ completed: 0, total: 1 });
      const videos = await searchYouTubeVideos(keyword.trim(), 10, 'relevance');

      if (videos.length === 0) {
        setError('No YouTube videos found matching search query');
        setStatus('error');
        return;
      }

      setStatus('analyzing');
      setProgress({ completed: 0, total: videos.length });

      const analysisResults = await analyzeBatchVideos(videos, (completed, total) => {
        setProgress({ completed, total });
      });

      const narrativeClusters = detectNarrativeClusters(analysisResults, 2);

      setResults(analysisResults);
      setClusters(narrativeClusters);
      setStatus('completed');
    } catch (err: any) {
      console.error('YouTube monitoring error:', err);
      setError(err.message || 'Failed to analyze YouTube content');
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

  return (
    <div className="space-y-8 animate-fade-in text-[#11110F]">
      
      {/* Header */}
      <YouTubeHeader />

      {/* Query Bar Workspace */}
      <YouTubeMonitorConfig
        keyword={keyword}
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
                Monitoring results — {results.length} videos analyzed
              </span>
            </div>
            <div className="font-mono text-[#625E55]">
              Query: "{keyword}"
            </div>
          </div>

          {/* Emerging Narrative Trend Clusters */}
          <YouTubeNarrativeClusters clusters={clusters} />

          {/* Video Research List */}
          <div className="bg-[#FFFDF8] border border-[#D8D1C4] shadow-xs">
            
            {/* Header Controls */}
            <div className="p-6 border-b border-[#D8D1C4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans">
              <h3 className="text-xl font-serif font-bold text-[#11110F]">
                Video research feed ({results.length})
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
                  <option value="views">Views</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="p-1 bg-[#F5F1E8] border border-[#D8D1C4] text-[#625E55] hover:text-[#11110F] transition-colors"
                >
                  {sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
              </div>
            </div>

            {/* Video List Rows */}
            <div className="divide-y divide-[#D8D1C4]">
              {getSortedResults().map((video) => (
                <div
                  key={video.videoId}
                  onClick={() => setSelectedVideo(video)}
                  className="p-6 hover:bg-[#F5F1E8]/60 transition-colors cursor-pointer space-y-2 group"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    
                    {/* Media Thumbnail Preview Anchor */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full sm:w-48 h-30 object-cover border border-[#D8D1C4]"
                      />
                      <div className="absolute bottom-2 right-2 bg-[#11110F]/80 backdrop-blur-xs px-2 py-0.5 text-[10px] font-mono text-white">
                        <Eye size={10} className="inline mr-1" />
                        {formatNumber(video.viewCount)}
                      </div>
                    </div>

                    {/* Metadata & Scores */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-lg font-serif font-bold text-[#11110F] group-hover:text-[#2E7D50] transition-colors leading-snug line-clamp-2">
                          {video.title}
                        </h4>
                        <RiskIndicator 
                          level={video.threatLevel === 'critical' || video.threatLevel === 'high' ? 'highRisk' : 'suspicious'} 
                          label={video.threatLevel.toUpperCase()}
                          size="sm"
                        />
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-[#625E55]">
                        <span className="text-[#2E7D50] font-semibold flex items-center gap-1">
                          <Users size={12} />
                          {video.channelTitle}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(video.publishedAt)}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare size={12} />
                          {formatNumber(video.commentCount)} comments
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-3 pt-1">
                        <div className="p-2.5 bg-[#F5F1E8] border border-[#D8D1C4]">
                          <span className="text-[10px] font-mono text-[#625E55] uppercase block">CREDIBILITY</span>
                          <span className="text-xs font-mono font-bold text-[#2E7D50]">{video.credibilityScore}%</span>
                        </div>
                        <div className="p-2.5 bg-[#F5F1E8] border border-[#D8D1C4]">
                          <span className="text-[10px] font-mono text-[#625E55] uppercase block">MISINFORMATION RISK</span>
                          <span className="text-xs font-mono font-bold text-[#A83F3F]">{video.fakeRiskScore}%</span>
                        </div>
                        <div className="p-2.5 bg-[#F5F1E8] border border-[#D8D1C4]">
                          <span className="text-[10px] font-mono text-[#625E55] uppercase block">VIRALITY</span>
                          <span className="text-xs font-mono font-bold text-[#B0783C]">{video.viralityRisk.score}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-1">
                        <span className="text-xs text-[#2E7D50] font-semibold group-hover:underline">
                          Inspect video evidence →
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* Detail Inspector Modal */}
      {selectedVideo && (
        <YouTubeVideoInspector video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      {/* Empty State */}
      {status === 'idle' && (
        <div className="bg-[#FFFDF8] border border-[#D8D1C4] p-10 text-center space-y-3 shadow-xs">
          <h3 className="text-2xl font-serif font-bold text-[#11110F]">
            Ready for YouTube query
          </h3>
          <p className="text-sm text-[#625E55] max-w-md mx-auto leading-relaxed font-sans">
            Enter a search topic or keyword above to analyze video content, audience comments, and emotional manipulation patterns.
          </p>
        </div>
      )}

    </div>
  );
};
