import React from 'react';
import { Shield, Activity, Radio, Network } from 'lucide-react';

export const IntelligenceVisualization: React.FC = () => {
  return (
    <div className="relative w-full bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8 overflow-hidden select-none">
      
      {/* Background Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Header Monospace Bar */}
      <div className="relative flex items-center justify-between pb-4 border-b border-white/5 mb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-[#8992A7]">
          <Network size={14} className="text-[#5B8CFF]" />
          <span className="uppercase tracking-wider">SYSTEM SIGNAL MATRIX</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-[#35D49A] bg-[#35D49A]/5 border border-[#35D49A]/20 px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-[#35D49A] animate-pulse" />
          <span>STANDBY SPECTRUM</span>
        </div>
      </div>

      {/* Illustrative Telemetry Matrix Container */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Node 1: Credibility Matrix */}
        <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-3 relative group hover:border-[#5B8CFF]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#5F687C] uppercase tracking-wider">
              CREDIBILITY MATRIX
            </span>
            <Shield size={14} className="text-[#35D49A]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-[#F4F5F8]">98<span className="text-sm text-[#8992A7]">%</span></span>
            <span className="text-[10px] font-mono text-[#35D49A] uppercase bg-[#35D49A]/10 px-1.5 py-0.5 rounded">HIGH TRUST</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-[#35D49A] w-[98%]" />
          </div>
        </div>

        {/* Node 2: Linguistic Patterns */}
        <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-3 relative group hover:border-[#9B6DFF]/40 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#5F687C] uppercase tracking-wider">
              LINGUISTIC PATTERNS
            </span>
            <Activity size={14} className="text-[#9B6DFF]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-[#F4F5F8]">0.12<span className="text-sm text-[#8992A7]"> σ</span></span>
            <span className="text-[10px] font-mono text-[#5B8CFF] uppercase bg-[#5B8CFF]/10 px-1.5 py-0.5 rounded">NORMAL TONE</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-[#9B6DFF] w-[24%]" />
          </div>
        </div>

        {/* Node 3: Virality Impact */}
        <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-3 relative group hover:border-[#38D9FF]/40 transition-colors sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-[#5F687C] uppercase tracking-wider">
              VIRALITY IMPACT
            </span>
            <Radio size={14} className="text-[#38D9FF]" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-mono font-bold text-[#F4F5F8]">LOW<span className="text-xs text-[#8992A7]"> RISK</span></span>
            <span className="text-[10px] font-mono text-[#38D9FF] uppercase bg-[#38D9FF]/10 px-1.5 py-0.5 rounded">STABLE</span>
          </div>
          <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-[#38D9FF] w-[15%]" />
          </div>
        </div>

      </div>

      {/* Telemetry Legend */}
      <div className="relative mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-[#5F687C]">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#5B8CFF]" />
            <span>XLM-R Vector Space</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#9B6DFF]" />
            <span>Gemini Pro Context</span>
          </span>
        </div>
        <span className="text-[11px] text-[#8992A7]">
          Standby Spectrum • Illustrative System Matrix
        </span>
      </div>
    </div>
  );
};
