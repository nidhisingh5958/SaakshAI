import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { NarrativeCluster } from '../../types';
import { RiskIndicator } from '../ui/RiskIndicator';
import { SectionLabel } from '../ui/SectionLabel';

export interface RedditNarrativeClustersProps {
  clusters: NarrativeCluster[];
}

export const RedditNarrativeClusters: React.FC<RedditNarrativeClustersProps> = ({ clusters }) => {
  if (clusters.length === 0) return null;

  return (
    <div className="bg-[#FFFDF9] border border-[#E3D5C0] rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#E3D5C0] pb-4">
        <SectionLabel icon={<AlertTriangle size={14} className="text-[#B19C7A]" />}>
          Emerging narratives ({clusters.length})
        </SectionLabel>
        <span className="text-xs font-mono text-[#B19C7A]">
          Correlated community signals
        </span>
      </div>

      <div className="divide-y divide-[#E3D5C0]">
        {clusters.map((cluster, idx) => (
          <div key={cluster.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#2EA334]">
                  0{idx + 1}
                </span>
                <h4 className="text-base font-serif font-bold text-[#0D0B09]">
                  r/{cluster.subreddit} narrative cluster
                </h4>
              </div>
              <p className="text-xs text-[#5A4434] pl-7">
                {cluster.postIds.length} correlated posts detected across community threads.
              </p>
            </div>

            <div className="flex items-center gap-6 self-start sm:self-auto pl-7 sm:pl-0">
              <div className="text-right font-mono text-xs">
                <span className="text-[#B9A78D] block text-[10px] uppercase">AVG RISK</span>
                <span className="font-bold text-[#B94A48] text-sm">{Math.round(cluster.averageFakeRisk)}%</span>
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
