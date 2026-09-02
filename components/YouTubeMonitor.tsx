import React, { useState, useCallback } from 'react';
import {
  MessageSquare,
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
    <div className="space-y-8 animate-fade-in text-[#0D0B09]">
      
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
                Monitoring results — {results.length} videos analyzed
              </span>
            </div>
            <div className="font-mono text-[#5A4434]">
              Query: "{keyword}"
            </div>
          </div>

          {/* Emerging Narrative Trend Clusters */}
          <YouTubeNarrativeClusters clusters={clusters} />

          {/* Video Research List */}
          <div className="bg-[#FFFDF9] border border-[#E3D5C0] rounded-2xl overflow-hidden shadow-sm">
            
            {/* Header Controls */}
            <div className="p-6 border-b border-[#E3D5C0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <SectionLabel icon={<Video size={14} className="text-[#2EA334]" />}>
                Video research feed ({results.length})
              </SectionLabel>

              <div className="flex items-center gap-2 text-xs">
                <SlidersHorizontal size={14} className="text-[#5A4434]" />
                <span className="font-mono text-[#5A4434]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#F4EBDD] border border-[#E3D5C0] rounded-lg px-3 py-1 text-xs text-[#0D0B09] focus:outline-none focus:border-[#2EA334]"
                >
                  <option value="fakeRisk">Fake risk</option>
                  <option value="credibility">Credibility</option>
                  <option value="virality">Virality</option>
                  <option value="views">Views</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                  className="p-1 bg-[#F4EBDD] border border-[#E3D5C0] rounded text-[#5A4434] hover:text-[#0D0B09] transition-colors"
                >
                  {sortOrder === 'desc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </button>
              </div>
            </div>

            {/* Video List Rows */}
            <div className="divide-y divide-[#E3D5C0]">
              {getSortedResults().map((video) => (
                <div
                  key={video.videoId}
                  onClick={() => setSelectedVideo(video)}
                  className="p-6 hover:bg-[#F4EBDD]/60 transition-colors cursor-pointer space-y-2 group"
                >
                  <div className="flex flex-col sm:flex-row gap-5">
                    
                    {/* Organic Rounded Thumbnail Anchor */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full sm:w-48 h-30 object-cover rounded-2xl border border-[#E3D5C0]"
                      />
                      <div className="absolute bottom-2 right-2 bg-[#0D0B09]/80 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-mono text-white">
                        <Eye size={10} className="inline mr-1" />
                        {formatNumber(video.viewCount)}
                      </div>
                    </div>

                    {/* Metadata & Scores */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-lg font-serif font-bold text-[#0D0B09] group-hover:text-[#2EA334] transition-colors leading-snug line-clamp-2">
                          {video.title}
                        </h4>
                        <RiskIndicator 
                          level={video.threatLevel === 'critical' || video.threatLevel === 'high' ? 'highRisk' : 'suspicious'} 
                          label={video.threatLevel.toUpperCase()}
                          size="sm"
                        />
                      </div>

                      <div className="flex items-center gap-3 text-xs font-mono text-[#5A4434]">
                        <span className="text-[#2EA334] font-semibold flex items-center gap-1">
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
                        <div className="p-2.5 bg-[#F4EBDD] rounded-xl border border-[#E3D5C0]">
                          <span className="text-[10px] font-mono text-[#5A4434] uppercase block">CREDIBILITY</span>
                          <span className="text-xs font-mono font-bold text-[#2EA334]">{video.credibilityScore}%</span>
                        </div>
                        <div className="p-2.5 bg-[#F4EBDD] rounded-xl border border-[#E3D5C0]">
                          <span className="text-[10px] font-mono text-[#5A4434] uppercase block">MISINFORMATION RISK</span>
                          <span className="text-xs font-mono font-bold text-[#B94A48]">{video.fakeRiskScore}%</span>
                        </div>
                        <div className="p-2.5 bg-[#F4EBDD] rounded-xl border border-[#E3D5C0]">
                          <span className="text-[10px] font-mono text-[#5A4434] uppercase block">VIRALITY</span>
                          <span className="text-xs font-mono font-bold text-[#B19C7A]">{video.viralityRisk.score}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end pt-1">
                        <span className="text-xs text-[#2EA334] font-semibold group-hover:underline">
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
        <div className="bg-[#FFFDF9] border border-[#E3D5C0] rounded-3xl p-10 text-center space-y-3 shadow-sm">
          <h3 className="text-xl font-serif font-bold text-[#0D0B09]">
            Ready for YouTube query
          </h3>
          <p className="text-sm text-[#5A4434] max-w-md mx-auto leading-relaxed">
            Enter a search topic or keyword above to analyze video content, audience comments, and emotional manipulation patterns.
          </p>
        </div>
      )}

    </div>
  );
};
