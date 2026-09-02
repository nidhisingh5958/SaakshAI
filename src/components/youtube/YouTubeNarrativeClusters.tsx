import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { YouTubeNarrativeCluster } from '../../types';
import { RiskIndicator } from '../ui/RiskIndicator';
import { SectionLabel } from '../ui/SectionLabel';

export interface YouTubeNarrativeClustersProps {
  clusters: YouTubeNarrativeCluster[];
}

export const YouTubeNarrativeClusters: React.FC<YouTubeNarrativeClustersProps> = ({ clusters }) => {
  if (clusters.length === 0) return null;

  return (
    <div className="bg-[#0E1320] border border-[#FF5F6D]/30 rounded-2xl p-6 sm:p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <SectionLabel icon={<AlertTriangle size={14} className="text-[#FF5F6D]" />}>
          POTENTIAL MISINFORMATION TREND DETECTED ({clusters.length})
        </SectionLabel>
        <span className="text-[11px] font-mono text-[#FF5F6D] bg-[#FF5F6D]/10 px-2 py-0.5 rounded uppercase">
          HIGH RISK ALERT
        </span>
      </div>

      <p className="text-xs text-[#8992A7] leading-relaxed">
        Identified narrative clusters across multiple video uploads showing similar high-risk linguistic and emotional manipulation patterns.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {clusters.map((cluster) => (
          <div key={cluster.id} className="p-5 bg-[#121827] border border-white/5 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-[#F4F5F8]">
                {cluster.videoIds.length} Correlated Videos
              </span>
              <RiskIndicator 
                level={cluster.averageThreatLevel === 'critical' || cluster.averageThreatLevel === 'high' ? 'highRisk' : 'suspicious'} 
                label={cluster.averageThreatLevel.toUpperCase()}
                size="sm"
              />
            </div>

            <p className="text-xs text-[#8992A7] leading-relaxed">
              {cluster.theme}
            </p>

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono">
              <span className="text-[#5F687C]">AVG FAKE RISK</span>
              <span className="text-[#FF5F6D] font-bold">{Math.round(cluster.averageFakeRisk)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
