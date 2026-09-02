import React, { useEffect } from 'react';
import { YouTubeAnalysisResult } from '../../types';
import { ExternalLink, Users, Eye, MessageSquare, ThumbsUp, X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { RiskIndicator } from '../ui/RiskIndicator';
import { Button } from '../ui/Button';

export interface YouTubeVideoInspectorProps {
  video: YouTubeAnalysisResult;
  onClose: () => void;
}

export const YouTubeVideoInspector: React.FC<YouTubeVideoInspectorProps> = ({ video, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const emotionalData = [
    { subject: 'Anger', A: video.emotionalTone.anger, fullMark: 100 },
    { subject: 'Fear', A: video.emotionalTone.fear, fullMark: 100 },
    { subject: 'Urgency', A: video.emotionalTone.urgency, fullMark: 100 },
    { subject: 'Neutral', A: video.emotionalTone.neutrality, fullMark: 100 },
    { subject: 'Joy', A: video.emotionalTone.joy, fullMark: 100 },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="youtube-inspector-title"
    >
      <div 
        className="bg-[#0E1320] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-start justify-between bg-[#121827]">
          <div className="flex-1 pr-4 space-y-2">
            <div className="flex items-center gap-3 text-xs font-mono text-[#8992A7]">
              <span className="flex items-center gap-1 text-[#FF5F6D]">
                <Users size={14} />
                {video.channelTitle}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye size={12} />
                {formatNumber(video.viewCount)} views
              </span>
              <span>•</span>
              <a
                href={video.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#5B8CFF] hover:underline"
              >
                <ExternalLink size={12} />
                Watch on YouTube
              </a>
            </div>
            <h3 id="youtube-inspector-title" className="text-lg font-bold text-[#F4F5F8] leading-snug">
              {video.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8992A7] hover:text-[#F4F5F8] hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Close video inspector"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Key Scores Spectrum */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#5F687C] uppercase">CREDIBILITY</span>
              <div className="text-xl font-mono font-bold text-[#35D49A]">
                {Math.round(video.credibilityScore)}%
              </div>
            </div>
            <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#5F687C] uppercase">FAKE RISK</span>
              <div className="text-xl font-mono font-bold text-[#FF5F6D]">
                {Math.round(video.fakeRiskScore)}%
              </div>
            </div>
            <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#5F687C] uppercase">VIRALITY RISK</span>
              <div className="text-xl font-mono font-bold text-[#9B6DFF]">
                {Math.round(video.viralityRisk.score)}%
              </div>
            </div>
            <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#5F687C] uppercase">THREAT LEVEL</span>
              <div>
                <RiskIndicator level={video.threatLevel === 'critical' || video.threatLevel === 'high' ? 'highRisk' : 'suspicious'} label={video.threatLevel.toUpperCase()} size="sm" />
              </div>
            </div>
          </div>

          {/* Video Description snippet if present */}
          {video.description && (
            <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#5F687C] uppercase block">VIDEO DESCRIPTION</span>
              <p className="text-xs text-[#8992A7] leading-relaxed line-clamp-4">
                {video.description}
              </p>
            </div>
          )}

          {/* Emotional Radar */}
          <div className="p-5 bg-[#121827] border border-white/5 rounded-xl space-y-3">
            <span className="text-xs font-mono text-[#9B6DFF] uppercase tracking-wider block">
              EMOTIONAL TONE SPECTRUM
            </span>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={emotionalData}>
                  <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#8992A7', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#5F687C', fontSize: 9 }} />
                  <Radar name="Tone" dataKey="A" stroke="#9B6DFF" fill="#9B6DFF" fillOpacity={0.35} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Linguistic Risks */}
          {video.linguisticRisks.length > 0 && (
            <div className="p-5 bg-[#121827] border border-white/5 rounded-xl space-y-3">
              <span className="text-xs font-mono text-[#FFB84D] uppercase tracking-wider block">
                LINGUISTIC MANIPULATION RISKS ({video.linguisticRisks.length})
              </span>
              <div className="space-y-3">
                {video.linguisticRisks.map((risk, idx) => (
                  <div key={idx} className="p-3 bg-white/5 rounded border border-white/5 space-y-1 text-xs">
                    <div className="flex justify-between font-mono">
                      <span className="text-[#F4F5F8] capitalize font-semibold">{risk.type.replace(/-/g, ' ')}</span>
                      <span className="text-[#FF5F6D] font-bold">SEVERITY {Math.round(risk.severity)}%</span>
                    </div>
                    <p className="text-[#8992A7]">{risk.description}</p>
                    {risk.foundPhrases.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1 font-mono text-[10px]">
                        {risk.foundPhrases.map((phrase, pi) => (
                          <span key={pi} className="px-1.5 py-0.5 bg-[#FFB84D]/10 text-[#FFB84D] rounded">
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

          {/* Top Audience Comments */}
          {video.topComments.length > 0 && (
            <div className="p-5 bg-[#121827] border border-white/5 rounded-xl space-y-3">
              <span className="text-xs font-mono text-[#5F687C] uppercase tracking-wider block">
                TOP AUDIENCE COMMENTS ({video.topComments.length})
              </span>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {video.topComments.slice(0, 10).map((comment) => (
                  <div key={comment.id} className="p-3 bg-white/5 rounded border border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#5F687C]">
                      <span className="text-[#5B8CFF] font-semibold">{comment.authorDisplayName}</span>
                      <span className="flex items-center gap-1 text-[#8992A7]">
                        <ThumbsUp size={10} />
                        {comment.likeCount}
                      </span>
                    </div>
                    <p className="text-[#8992A7] leading-relaxed line-clamp-3">{comment.textDisplay}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Highlighted Text if present */}
          {video.highlightedText.length > 0 && (
            <div className="p-5 bg-[#121827] border border-white/5 rounded-xl space-y-3">
              <span className="text-xs font-mono text-[#FF5F6D] uppercase tracking-wider block">
                CONTENT SUSPICIOUS HIGHLIGHTS
              </span>
              <div className="space-y-2">
                {video.highlightedText
                  .filter((h) => h.type === 'suspicious')
                  .slice(0, 5)
                  .map((highlight, idx) => (
                    <div key={idx} className="p-3 bg-[#FF5F6D]/10 border border-[#FF5F6D]/20 rounded text-xs space-y-1">
                      <p className="text-[#F4F5F8]">"{highlight.text}"</p>
                      {highlight.tooltip && (
                        <p className="text-[11px] text-[#8992A7] font-mono">{highlight.tooltip}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Close */}
        <div className="p-4 border-t border-white/5 flex justify-end bg-[#121827]">
          <Button onClick={onClose} variant="secondary" size="sm">
            Close Inspector
          </Button>
        </div>

      </div>
    </div>
  );
};
