import React from 'react';
import { YouTubeNarrativeCluster } from '../../types';
import { RiskIndicator } from '../ui/RiskIndicator';

export interface YouTubeNarrativeClustersProps {
  clusters: YouTubeNarrativeCluster[];
}

export const YouTubeNarrativeClusters: React.FC<YouTubeNarrativeClustersProps> = ({ clusters }) => {
  if (clusters.length === 0) return null;

  return (
    <div className="bg-[#FFFDF8] border border-[#D8D1C4] p-6 sm:p-8 space-y-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-[#D8D1C4] pb-4">
        <h3 className="text-xl font-serif font-bold text-[#11110F]">
          Emerging video trends ({clusters.length})
        </h3>
        <span className="text-xs font-mono text-[#8C877C]">
          Correlated media signals
        </span>
      </div>

      <div className="divide-y divide-[#D8D1C4]">
        {clusters.map((cluster, idx) => (
          <div key={cluster.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#2E7D50]">
                  0{idx + 1}
                </span>
                <h4 className="text-base font-serif font-bold text-[#11110F]">
                  {cluster.videoIds.length} correlated videos
                </h4>
              </div>
              <p className="text-xs text-[#625E55] pl-7 leading-relaxed font-sans">
                {cluster.theme}
              </p>
            </div>

            <div className="flex items-center gap-6 self-start sm:self-auto pl-7 sm:pl-0">
              <div className="text-right font-mono text-xs">
                <span className="text-[#8C877C] block text-[10px] uppercase">AVG RISK</span>
                <span className="font-bold text-[#A83F3F] text-sm">{Math.round(cluster.averageFakeRisk)}%</span>
              </div>
              <RiskIndicator 
                level={cluster.averageThreatLevel === 'critical' || cluster.averageThreatLevel === 'high' ? 'highRisk' : 'suspicious'} 
                label={cluster.averageThreatLevel.toUpperCase()}
                size="sm"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
