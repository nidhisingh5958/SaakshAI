import React, { useEffect } from 'react';
import { RedditAnalysisResult } from '../../types';
import { ExternalLink, Users, ThumbsUp, X } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { RiskIndicator } from '../ui/RiskIndicator';
import { Button } from '../ui/Button';

export interface RedditPostInspectorProps {
  post: RedditAnalysisResult;
  onClose: () => void;
}

export const RedditPostInspector: React.FC<RedditPostInspectorProps> = ({ post, onClose }) => {
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
    { subject: 'Anger', A: post.emotionalTone.anger, fullMark: 100 },
    { subject: 'Fear', A: post.emotionalTone.fear, fullMark: 100 },
    { subject: 'Urgency', A: post.emotionalTone.urgency, fullMark: 100 },
    { subject: 'Neutral', A: post.emotionalTone.neutrality, fullMark: 100 },
    { subject: 'Joy', A: post.emotionalTone.joy, fullMark: 100 },
  ];

  return (
    <div 
      className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reddit-inspector-title"
    >
      <div 
        className="bg-[#FFFDF9] border border-[#E3D5C0] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header Document Source */}
        <div className="p-6 border-b border-[#E3D5C0] flex items-start justify-between bg-[#F4EBDD]">
          <div className="flex-1 pr-4 space-y-1.5">
            <div className="flex items-center gap-3 text-xs font-mono text-[#5A4434]">
              <span className="flex items-center gap-1 text-[#2EA334] font-semibold">
                <Users size={14} />
                r/{post.subreddit}
              </span>
              <span>•</span>
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#2EA334] hover:underline"
              >
                <ExternalLink size={12} />
                View on Reddit
              </a>
            </div>
            <h3 id="reddit-inspector-title" className="text-xl sm:text-2xl font-serif font-bold text-[#0D0B09] leading-snug">
              {post.title}
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
                  {Math.round(post.credibilityScore)}%
                </div>
              </div>
              <div className="p-4 bg-[#F4EBDD] border border-[#E3D5C0] rounded-2xl space-y-1">
                <span className="text-[11px] font-mono text-[#5A4434] uppercase block">MISINFORMATION RISK</span>
                <div className="text-xl font-mono font-bold text-[#B94A48]">
                  {Math.round(post.fakeRiskScore)}%
                </div>
              </div>
              <div className="p-4 bg-[#F4EBDD] border border-[#E3D5C0] rounded-2xl space-y-1">
                <span className="text-[11px] font-mono text-[#5A4434] uppercase block">VIRALITY RISK</span>
                <div className="text-xl font-mono font-bold text-[#B19C7A]">
                  {Math.round(post.viralityRisk.score)}%
                </div>
              </div>
              <div className="p-4 bg-[#F4EBDD] border border-[#E3D5C0] rounded-2xl space-y-1">
                <span className="text-[11px] font-mono text-[#5A4434] uppercase block">THREAT LEVEL</span>
                <div className="pt-0.5">
                  <RiskIndicator level={post.threatLevel === 'critical' || post.threatLevel === 'high' ? 'highRisk' : 'suspicious'} label={post.threatLevel.toUpperCase()} size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Post Text */}
          {post.postText && (
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-[#B9A78D] uppercase tracking-wide">Post content</span>
              <p className="text-sm text-[#0D0B09] leading-relaxed p-5 bg-[#F4EBDD] rounded-2xl border border-[#E3D5C0] whitespace-pre-wrap font-sans">
                {post.postText}
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
          {post.linguisticRisks.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#B9A78D] uppercase tracking-wide">Linguistic manipulation signals</span>
              <div className="space-y-3">
                {post.linguisticRisks.map((risk, idx) => (
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

          {/* Top Comments Feed */}
          {post.topComments.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs font-mono text-[#B9A78D] uppercase tracking-wide">Audience comments ({post.topComments.length})</span>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {post.topComments.slice(0, 10).map((comment) => (
                  <div key={comment.id} className="p-3.5 bg-[#F4EBDD] border border-[#E3D5C0] rounded-xl text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono text-[#5A4434]">
                      <span className="font-semibold text-[#2EA334]">u/{comment.author}</span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={10} />
                        {comment.score}
                      </span>
                    </div>
                    <p className="text-[#0D0B09] leading-relaxed line-clamp-3 font-sans">{comment.body}</p>
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
