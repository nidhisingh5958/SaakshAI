import React from 'react';
import { Layers, Database, Terminal, Activity } from 'lucide-react';

export const AnalysisMetadata: React.FC = () => {
  const metadataItems = [
    {
      label: 'MODEL PIPELINE',
      value: 'XLM-R / Gemini Pro',
      icon: Layers,
      accent: 'text-[#5B8CFF]',
    },
    {
      label: 'RAG SOURCE',
      value: 'Live News Consensus API',
      icon: Database,
      accent: 'text-[#35D49A]',
    },
    {
      label: 'ANALYSIS TYPE',
      value: 'Linguistic & Claim Verification',
      icon: Terminal,
      accent: 'text-[#FFB84D]',
    },
    {
      label: 'SYSTEM STATUS',
      value: 'Telemetry Ready for Input',
      icon: Activity,
      accent: 'text-[#38D9FF]',
    },
  ];

  return (
    <div className="bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-white/5">
        {metadataItems.map((item, idx) => (
          <div key={idx} className={`${idx !== 0 ? 'pt-4 sm:pt-0 sm:pl-6' : ''} space-y-1.5`}>
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#5F687C] uppercase tracking-wider">
                {item.label}
              </span>
              <item.icon size={14} className={item.accent} />
            </div>
            <p className="text-sm font-semibold text-[#F4F5F8] font-sans">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
