import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';
import { NarrativeCluster } from '../../types';
import { RiskIndicator } from '../ui/RiskIndicator';
import { SectionLabel } from '../ui/SectionLabel';

export interface RedditNarrativeClustersProps {
  clusters: NarrativeCluster[];
}

export const RedditNarrativeClusters: React.FC<RedditNarrativeClustersProps> = ({ clusters }) => {
  if (clusters.length === 0) return null;

  return (
    <div className="bg-[#0E1320] border border-[#FF5F6D]/30 rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <SectionLabel icon={<AlertTriangle size={14} className="text-[#FF5F6D]" />}>
          EMERGING NARRATIVE CAMPAIGNS DETECTED ({clusters.length})
        </SectionLabel>
        <span className="text-[11px] font-mono text-[#FF5F6D] bg-[#FF5F6D]/10 px-2 py-0.5 rounded uppercase">
          HIGH RISK ALERT
        </span>
      </div>

      <p className="text-xs text-[#8992A7] leading-relaxed">
        Multiple correlated posts with elevated misinformation risk scores detected. This pattern indicates an active emerging narrative or potential manipulation campaign across target subreddits.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {clusters.map((cluster, idx) => (
          <div key={cluster.id} className="p-5 bg-[#121827] border border-white/5 rounded-xl space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-[#5F687C] uppercase tracking-wider">
                NARRATIVE 0{idx + 1}
              </span>
              <RiskIndicator 
                level={cluster.averageThreatLevel === 'critical' || cluster.averageThreatLevel === 'high' ? 'highRisk' : 'suspicious'} 
                label={cluster.averageThreatLevel.toUpperCase()}
                size="sm"
              />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono text-[#9B6DFF] font-semibold block">
                r/{cluster.subreddit}
              </span>
              <span className="text-sm font-bold text-[#F4F5F8] block">
                {cluster.postIds.length} Correlated Risky Posts
              </span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
              <span className="text-[#8992A7]">AVG FAKE RISK</span>
              <span className="text-[#FF5F6D] font-bold">{Math.round(cluster.averageFakeRisk)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
