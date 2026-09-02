import React, { useEffect } from 'react';
import { YouTubeAnalysisResult } from '../../types';
import { ExternalLink, Users, Eye, ThumbsUp, X } from 'lucide-react';
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
      className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="youtube-inspector-title"
    >
      <div 
        className="bg-[#FFFDF8] border border-[#D8D1C4] max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Media Source */}
        <div className="p-6 border-b border-[#D8D1C4] flex items-start justify-between bg-[#F5F1E8]">
          <div className="flex-1 pr-4 space-y-1.5">
            <div className="flex items-center gap-3 text-xs font-mono text-[#625E55]">
              <span className="flex items-center gap-1 text-[#2E7D50] font-semibold">
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
                className="flex items-center gap-1 text-[#2E7D50] hover:underline"
              >
                <ExternalLink size={12} />
                Watch on YouTube
              </a>
            </div>
            <h3 id="youtube-inspector-title" className="text-xl sm:text-2xl font-serif font-bold text-[#11110F] leading-snug">
              {video.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#625E55] hover:text-[#11110F] hover:bg-[#EFE8DA] transition-colors cursor-pointer"
            aria-label="Close inspector"
          >
            <X size={20} />
          </button>
        </div>

        {/* Evidence Document Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Assessment Summary */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#8C877C] uppercase tracking-wide">ASSESSMENT SUMMARY</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-[#F5F1E8] border border-[#D8D1C4] space-y-1">
                <span className="text-[11px] font-mono text-[#625E55] uppercase block">CREDIBILITY</span>
                <div className="text-xl font-mono font-bold text-[#2E7D50]">
                  {Math.round(video.credibilityScore)}%
                </div>
              </div>
              <div className="p-4 bg-[#F5F1E8] border border-[#D8D1C4] space-y-1">
                <span className="text-[11px] font-mono text-[#625E55] uppercase block">MISINFORMATION RISK</span>
                <div className="text-xl font-mono font-bold text-[#A83F3F]">
                  {Math.round(video.fakeRiskScore)}%
                </div>
              </div>
              <div className="p-4 bg-[#F5F1E8] border border-[#D8D1C4] space-y-1">
                <span className="text-[11px] font-mono text-[#625E55] uppercase block">VIRALITY RISK</span>
                <div className="text-xl font-mono font-bold text-[#B0783C]">
                  {Math.round(video.viralityRisk.score)}%
                </div>
              </div>
              <div className="p-4 bg-[#F5F1E8] border border-[#D8D1C4] space-y-1">
                <span className="text-[11px] font-mono text-[#625E55] uppercase block">THREAT LEVEL</span>
                <div className="pt-0.5">
                  <RiskIndicator level={video.threatLevel === 'critical' || video.threatLevel === 'high' ? 'highRisk' : 'suspicious'} label={video.threatLevel.toUpperCase()} size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {video.description && (
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-[#8C877C] uppercase tracking-wide">VIDEO DESCRIPTION</span>
              <p className="text-xs text-[#625E55] leading-relaxed p-4 bg-[#F5F1E8] border border-[#D8D1C4] line-clamp-4 font-sans">
                {video.description}
              </p>
            </div>
          )}

          {/* Emotional Radar */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#8C877C] uppercase tracking-wide">EMOTIONAL SIGNALS</span>
            <div className="p-4 bg-[#F5F1E8] border border-[#D8D1C4] h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={emotionalData}>
                  <PolarGrid stroke="#D8D1C4" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#625E55', fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#8C877C', fontSize: 9 }} />
                  <Radar name="Tone" dataKey="A" stroke="#2E7D50" fill="#2E7D50" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Linguistic Risks */}
          {video.linguisticRisks.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#8C877C] uppercase tracking-wide">LINGUISTIC MANIPULATION SIGNALS</span>
              <div className="space-y-3">
                {video.linguisticRisks.map((risk, idx) => (
                  <div key={idx} className="p-4 bg-[#F5F1E8] border border-[#D8D1C4] text-xs space-y-1">
                    <div className="flex justify-between font-mono font-semibold text-[#11110F]">
                      <span className="capitalize">{risk.type.replace(/-/g, ' ')}</span>
                      <span className="text-[#A83F3F]">Severity {Math.round(risk.severity)}%</span>
                    </div>
                    <p className="text-[#625E55] leading-relaxed">{risk.description}</p>
                    {risk.foundPhrases.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[11px]">
                        {risk.foundPhrases.map((phrase, pi) => (
                          <span key={pi} className="px-2 py-0.5 bg-[#B0783C]/15 text-[#625E55]">
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

          {/* Audience Comments Feed */}
          {video.topComments.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#8C877C] uppercase tracking-wide">AUDIENCE COMMENTS ({video.topComments.length})</span>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1 divide-y divide-[#D8D1C4]">
                {video.topComments.slice(0, 10).map((comment) => (
                  <div key={comment.id} className="pt-2 first:pt-0 text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono text-[#625E55]">
                      <span className="font-semibold text-[#2E7D50]">{comment.authorDisplayName}</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={10} />
                        {comment.likeCount}
                      </span>
                    </div>
                    <p className="text-[#11110F] leading-relaxed line-clamp-3 font-sans">{comment.textDisplay}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#D8D1C4] flex justify-end bg-[#F5F1E8]">
          <Button onClick={onClose} variant="secondary" size="sm">
            Close video evidence
          </Button>
        </div>

      </div>
    </div>
  );
};
