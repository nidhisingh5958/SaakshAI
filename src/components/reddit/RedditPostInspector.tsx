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
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reddit-inspector-title"
    >
      <div 
        className="bg-[#0E1320] border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-start justify-between bg-[#121827]">
          <div className="flex-1 pr-4 space-y-2">
            <div className="flex items-center gap-3 text-xs font-mono text-[#8992A7]">
              <span className="flex items-center gap-1 text-[#9B6DFF]">
                <Users size={14} />
                r/{post.subreddit}
              </span>
              <span>•</span>
              <a
                href={post.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#5B8CFF] hover:underline"
              >
                <ExternalLink size={12} />
                View on Reddit
              </a>
            </div>
            <h3 id="reddit-inspector-title" className="text-lg font-bold text-[#F4F5F8] leading-snug">
              {post.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#8992A7] hover:text-[#F4F5F8] hover:bg-white/5 rounded-lg transition-colors"
            aria-label="Close post inspector"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Key Metrics Spectrum */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#5F687C] uppercase">CREDIBILITY</span>
              <div className="text-xl font-mono font-bold text-[#35D49A]">
                {Math.round(post.credibilityScore)}%
              </div>
            </div>
            <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#5F687C] uppercase">FAKE RISK</span>
              <div className="text-xl font-mono font-bold text-[#FF5F6D]">
                {Math.round(post.fakeRiskScore)}%
              </div>
            </div>
            <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#5F687C] uppercase">VIRALITY RISK</span>
              <div className="text-xl font-mono font-bold text-[#9B6DFF]">
                {Math.round(post.viralityRisk.score)}%
              </div>
            </div>
            <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-1">
              <span className="text-[10px] font-mono text-[#5F687C] uppercase">THREAT LEVEL</span>
              <div>
                <RiskIndicator level={post.threatLevel === 'critical' || post.threatLevel === 'high' ? 'highRisk' : 'suspicious'} label={post.threatLevel.toUpperCase()} size="sm" />
              </div>
            </div>
          </div>

          {/* Post Text if present */}
          {post.postText && (
            <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-2">
              <span className="text-[10px] font-mono text-[#5F687C] uppercase block">POST CONTENT</span>
              <p className="text-xs text-[#8992A7] leading-relaxed whitespace-pre-wrap">
                {post.postText}
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
          {post.linguisticRisks.length > 0 && (
            <div className="p-5 bg-[#121827] border border-white/5 rounded-xl space-y-3">
              <span className="text-xs font-mono text-[#FFB84D] uppercase tracking-wider block">
                LINGUISTIC MANIPULATION RISKS DETECTED ({post.linguisticRisks.length})
              </span>
              <div className="space-y-3">
                {post.linguisticRisks.map((risk, idx) => (
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

          {/* Top Comments */}
          {post.topComments.length > 0 && (
            <div className="p-5 bg-[#121827] border border-white/5 rounded-xl space-y-3">
              <span className="text-xs font-mono text-[#5F687C] uppercase tracking-wider block">
                TOP COMMENTS ({post.topComments.length})
              </span>
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {post.topComments.slice(0, 10).map((comment) => (
                  <div key={comment.id} className="p-3 bg-white/5 rounded border border-white/5 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#5F687C]">
                      <span>u/{comment.author}</span>
                      <span className="flex items-center gap-1 text-[#8992A7]">
                        <ThumbsUp size={10} />
                        {comment.score}
                      </span>
                    </div>
                    <p className="text-[#8992A7] leading-relaxed line-clamp-3">{comment.body}</p>
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
