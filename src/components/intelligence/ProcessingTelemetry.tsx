import React from 'react';
import { Cpu, CheckCircle2, Loader2, Clock } from 'lucide-react';

export const ProcessingTelemetry: React.FC = () => {
  const stages = [
    { label: 'Language Vector Mapping', status: 'completed' },
    { label: 'Linguistic Sentiment Extraction', status: 'processing' },
    { label: 'RAG News Alignment & Verification', status: 'queued' },
    { label: 'Virality & Threat Level Calculation', status: 'queued' },
  ];

  return (
    <div className="max-w-2xl mx-auto py-16 sm:py-24 space-y-8 text-left animate-fade-in">
      
      {/* Header Telemetry Box */}
      <div className="bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
        
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-[#5B8CFF]">
            <Cpu size={16} />
            <span className="uppercase tracking-wider">ANALYSIS IN PROGRESS</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-[#35D49A]">
            <span className="w-2 h-2 rounded-full bg-[#35D49A] animate-pulse" />
            <span>PROCESSING</span>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-bold text-[#F4F5F8]">
            Evaluating Statement Intelligence...
          </h3>
          <p className="text-xs font-mono text-[#8992A7]">
            Running transformer inference models and cross-referencing news facts.
          </p>
        </div>

        {/* Minimal Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full bg-[#121827] h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-[#5B8CFF] w-3/5 transition-all duration-500 animate-pulse" />
          </div>
        </div>

        {/* Stage List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {stages.map((stage, idx) => (
            <div 
              key={idx} 
              className={`p-3 rounded-lg border text-xs font-mono flex items-center justify-between ${
                stage.status === 'completed' 
                  ? 'bg-[#35D49A]/5 border-[#35D49A]/20 text-[#35D49A]' 
                  : stage.status === 'processing'
                  ? 'bg-[#5B8CFF]/10 border-[#5B8CFF]/30 text-[#F4F5F8]'
                  : 'bg-[#121827] border-white/5 text-[#5F687C]'
              }`}
            >
              <span>{stage.label}</span>
              {stage.status === 'completed' && <CheckCircle2 size={14} className="text-[#35D49A]" />}
              {stage.status === 'processing' && <Loader2 size={14} className="text-[#5B8CFF] animate-spin" />}
              {stage.status === 'queued' && <Clock size={14} className="text-[#5F687C]" />}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
