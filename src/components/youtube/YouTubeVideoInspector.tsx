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
        className="bg-[#FFFDF9] border border-[#E3D5C0] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Media Source */}
        <div className="p-6 border-b border-[#E3D5C0] flex items-start justify-between bg-[#F4EBDD]">
          <div className="flex-1 pr-4 space-y-1.5">
            <div className="flex items-center gap-3 text-xs font-mono text-[#5A4434]">
              <span className="flex items-center gap-1 text-[#2EA334] font-semibold">
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
                className="flex items-center gap-1 text-[#2EA334] hover:underline"
              >
                <ExternalLink size={12} />
                Watch on YouTube
              </a>
            </div>
            <h3 id="youtube-inspector-title" className="text-xl sm:text-2xl font-serif font-bold text-[#0D0B09] leading-snug">
              {video.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#5A4434] hover:text-[#0D0B09] hover:bg-[#EED4AC]/50 rounded-full transition-colors"
            aria-label="Close inspector"
          >
            <X size={20} />
          </button>
        </div>

        {/* Evidence Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Assessment Summary */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#B9A78D] uppercase tracking-wide">Assessment summary</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-[#F4EBDD] border border-[#E3D5C0] rounded-2xl space-y-1">
                <span className="text-[11px] font-mono text-[#5A4434] uppercase block">CREDIBILITY</span>
                <div className="text-xl font-mono font-bold text-[#2EA334]">
                  {Math.round(video.credibilityScore)}%
                </div>
              </div>
              <div className="p-4 bg-[#F4EBDD] border border-[#E3D5C0] rounded-2xl space-y-1">
                <span className="text-[11px] font-mono text-[#5A4434] uppercase block">MISINFORMATION RISK</span>
                <div className="text-xl font-mono font-bold text-[#B94A48]">
                  {Math.round(video.fakeRiskScore)}%
                </div>
              </div>
              <div className="p-4 bg-[#F4EBDD] border border-[#E3D5C0] rounded-2xl space-y-1">
                <span className="text-[11px] font-mono text-[#5A4434] uppercase block">VIRALITY RISK</span>
                <div className="text-xl font-mono font-bold text-[#B19C7A]">
                  {Math.round(video.viralityRisk.score)}%
                </div>
              </div>
              <div className="p-4 bg-[#F4EBDD] border border-[#E3D5C0] rounded-2xl space-y-1">
                <span className="text-[11px] font-mono text-[#5A4434] uppercase block">THREAT LEVEL</span>
                <div className="pt-0.5">
                  <RiskIndicator level={video.threatLevel === 'critical' || video.threatLevel === 'high' ? 'highRisk' : 'suspicious'} label={video.threatLevel.toUpperCase()} size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {video.description && (
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-[#B9A78D] uppercase tracking-wide">Video description</span>
              <p className="text-xs text-[#5A4434] leading-relaxed p-4 bg-[#F4EBDD] rounded-2xl border border-[#E3D5C0] line-clamp-4 font-sans">
                {video.description}
              </p>
            </div>
          )}

          {/* Emotional Radar */}
          <div className="space-y-2">
            <span className="text-xs font-mono text-[#B9A78D] uppercase tracking-wide">Emotional signals</span>
            <div className="p-4 bg-[#F4EBDD] border border-[#E3D5C0] rounded-2xl h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={emotionalData}>
                  <PolarGrid stroke="#E3D5C0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#5A4434', fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#B9A78D', fontSize: 9 }} />
                  <Radar name="Tone" dataKey="A" stroke="#2EA334" fill="#2EA334" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Linguistic Risks */}
          {video.linguisticRisks.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#B9A78D] uppercase tracking-wide">Linguistic manipulation signals</span>
              <div className="space-y-3">
                {video.linguisticRisks.map((risk, idx) => (
                  <div key={idx} className="p-4 bg-[#F4EBDD] border border-[#E3D5C0] rounded-2xl text-xs space-y-1">
                    <div className="flex justify-between font-mono font-semibold text-[#0D0B09]">
                      <span className="capitalize">{risk.type.replace(/-/g, ' ')}</span>
                      <span className="text-[#B94A48]">Severity {Math.round(risk.severity)}%</span>
                    </div>
                    <p className="text-[#5A4434] leading-relaxed">{risk.description}</p>
                    {risk.foundPhrases.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1 font-mono text-[11px]">
                        {risk.foundPhrases.map((phrase, pi) => (
                          <span key={pi} className="px-2 py-0.5 bg-[#B19C7A]/20 text-[#5A4434] rounded">
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
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#B9A78D] uppercase tracking-wide">Audience comments ({video.topComments.length})</span>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {video.topComments.slice(0, 10).map((comment) => (
                  <div key={comment.id} className="p-3.5 bg-[#F4EBDD] border border-[#E3D5C0] rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono text-[#5A4434]">
                      <span className="font-semibold text-[#2EA334]">{comment.authorDisplayName}</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={10} />
                        {comment.likeCount}
                      </span>
                    </div>
                    <p className="text-[#0D0B09] leading-relaxed line-clamp-3 font-sans">{comment.textDisplay}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suspicious Content Highlights */}
          {video.highlightedText.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#B9A78D] uppercase tracking-wide">Suspicious content highlights</span>
              <div className="space-y-2">
                {video.highlightedText
                  .filter((h) => h.type === 'suspicious')
                  .slice(0, 5)
                  .map((highlight, idx) => (
                    <div key={idx} className="p-3.5 bg-[#B94A48]/12 border border-[#B94A48]/25 rounded-2xl text-xs space-y-1">
                      <p className="text-[#0D0B09] font-sans">"{highlight.text}"</p>
                      {highlight.tooltip && (
                        <p className="text-[11px] text-[#5A4434] font-mono">{highlight.tooltip}</p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E3D5C0] flex justify-end bg-[#F4EBDD]">
          <Button onClick={onClose} variant="secondary" size="sm">
            Close evidence
          </Button>
        </div>

      </div>
    </div>
  );
};
