import React, { useState, useCallback } from 'react';
import {
  Youtube,
  MessageSquare,
  AlertTriangle,
  ExternalLink,
  Users,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Video,
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
import { SectionLabel } from '../src/components/ui/SectionLabel';
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
    <div className="space-y-10 animate-fade-in text-[#F4F5F8]">
      
      {/* Editorial Header */}
      <YouTubeHeader />

      {/* Query Input Configuration Workspace */}
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

      {/* Active Telemetry & Results List */}
      {status === 'completed' && (
        <div className="space-y-8">
          
          {/* Telemetry Active Status Bar */}
          <div className="flex items-center justify-between p-4 bg-[#0E1320] border border-white/10 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[#35D49A] animate-pulse" />
              <span className="text-xs font-mono text-[#35D49A] uppercase tracking-wider font-bold">
                TELEMETRY ACTIVE — {results.length} VIDEOS ANALYZED
              </span>
            </div>
            <div className="text-xs font-mono text-[#5F687C]">
              QUERY: "{keyword}"
            </div>
          </div>

          {/* Emerging Narrative Trend Clusters */}
          <YouTubeNarrativeClusters clusters={clusters} />

          {/* Video Risk Analysis List */}
          <div className="bg-[#0E1320] border border-white/10 rounded-2xl overflow-hidden space-y-4">
            
            {/* Header Controls */}
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <SectionLabel icon={<Video size={14} className="text-[#FF5F6D]" />}>
                VIDEO RISK ANALYSIS MATRIX ({results.length})
              </SectionLabel>

              <div className="flex items-center gap-3">
                <SlidersHorizontal size={14} className="text-[#5F687C]" />
                <span className="text-xs font-mono text-[#8992A7]">SORT:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#121827] border border-white/10 rounded px-3 py-1.5 text-xs font-mono text-[#F4F5F8] focus:outline-none focus:border-[#FF5F6D]"
                >
                  <option value="fakeRisk">Fake Risk</option>
                  <option value="credibility">Credibility</option>
                  <option value="virality">Virality</option>
                  <option value="views">Views</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="p-1.5 bg-[#121827] border border-white/10 rounded text-[#8992A7] hover:text-[#F4F5F8] transition-colors"
                >
                  {sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
              </div>
            </div>

            {/* Video List Rows */}
            <div className="divide-y divide-white/5">
              {getSortedResults().map((video) => (
                <div
                  key={video.videoId}
                  onClick={() => setSelectedVideo(video)}
                  className="p-5 hover:bg-[#121827] transition-colors cursor-pointer space-y-3 group"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    
                    {/* Thumbnail */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full sm:w-44 h-28 object-cover rounded-lg border border-white/5"
                      />
                      <div className="absolute bottom-1.5 right-1.5 bg-black/80 backdrop-blur-sm px-2 py-0.5 rounded text-[11px] font-mono text-[#F4F5F8]">
                        <Eye size={10} className="inline mr-1 text-[#8992A7]" />
                        {formatNumber(video.viewCount)}
                      </div>
                    </div>

                    {/* Metadata & Risk Spectrum */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-base font-semibold text-[#F4F5F8] group-hover:text-[#FF5F6D] transition-colors leading-snug line-clamp-2">
                          {video.title}
                        </h4>
                        <RiskIndicator 
                          level={video.threatLevel === 'critical' || video.threatLevel === 'high' ? 'highRisk' : 'suspicious'} 
                          label={video.threatLevel.toUpperCase()}
                          size="sm"
                        />
                      </div>

                      <div className="flex items-center gap-4 text-xs font-mono text-[#8992A7]">
                        <span className="flex items-center gap-1 text-[#FF5F6D]">
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
                        <div className="p-2 bg-white/5 rounded border border-white/5">
                          <span className="text-[10px] font-mono text-[#5F687C] uppercase block">CREDIBILITY</span>
                          <span className="text-sm font-mono font-bold text-[#35D49A]">{video.credibilityScore}%</span>
                        </div>
                        <div className="p-2 bg-white/5 rounded border border-white/5">
                          <span className="text-[10px] font-mono text-[#5F687C] uppercase block">FAKE RISK</span>
                          <span className="text-sm font-mono font-bold text-[#FF5F6D]">{video.fakeRiskScore}%</span>
                        </div>
                        <div className="p-2 bg-white/5 rounded border border-white/5">
                          <span className="text-[10px] font-mono text-[#5F687C] uppercase block">VIRALITY</span>
                          <span className="text-sm font-mono font-bold text-[#9B6DFF]">{video.viralityRisk.score}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-1">
                        <span className="text-xs font-mono text-[#5B8CFF] group-hover:underline flex items-center gap-1">
                          Inspect Video Evidence →
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

      {/* Video Inspector Modal */}
      {selectedVideo && (
        <YouTubeVideoInspector video={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}

      {/* Analytical Empty State */}
      {status === 'idle' && (
        <div className="bg-[#0E1320] border border-white/10 rounded-2xl p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#FF5F6D]/10 border border-[#FF5F6D]/20 flex items-center justify-center text-[#FF5F6D] mx-auto">
            <Youtube size={24} />
          </div>
          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-[#F4F5F8]">
              YouTube Video Telemetry Standby
            </h3>
            <p className="text-xs text-[#8992A7] leading-relaxed">
              Define a search topic or keyword above to initiate video intelligence analysis. SaakshAI will process video metadata, audience comments, linguistic manipulation, and emotional triggering signals.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
