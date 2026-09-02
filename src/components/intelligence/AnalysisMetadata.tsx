import React from 'react';
import { Cpu, Shield, Globe, RefreshCw } from 'lucide-react';

export const AnalysisMetadata: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 bg-[#FFFDF9] border border-[#E3D5C0] rounded-2xl space-y-1">
        <div className="flex items-center justify-between text-xs text-[#5A4434]">
          <span>Primary engine</span>
          <Cpu size={14} className="text-[#2EA334]" />
        </div>
        <div className="text-sm font-semibold text-[#0D0B09]">Gemini 3 Pro</div>
        <div className="text-[11px] font-mono text-[#B9A78D]">With Groq Llama fallback</div>
      </div>

      <div className="p-4 bg-[#FFFDF9] border border-[#E3D5C0] rounded-2xl space-y-1">
        <div className="flex items-center justify-between text-xs text-[#5A4434]">
          <span>Cross-lingual model</span>
          <Globe size={14} className="text-[#2EA334]" />
        </div>
        <div className="text-sm font-semibold text-[#0D0B09]">XLM-RoBERTa</div>
        <div className="text-[11px] font-mono text-[#B9A78D]">Multilingual embeddings</div>
      </div>

      <div className="p-4 bg-[#FFFDF9] border border-[#E3D5C0] rounded-2xl space-y-1">
        <div className="flex items-center justify-between text-xs text-[#5A4434]">
          <span>Verification mode</span>
          <Shield size={14} className="text-[#2EA334]" />
        </div>
        <div className="text-sm font-semibold text-[#0D0B09]">Live RAG news consensus</div>
        <div className="text-[11px] font-mono text-[#B9A78D]">Trusted outlet cross-check</div>
      </div>

      <div className="p-4 bg-[#FFFDF9] border border-[#E3D5C0] rounded-2xl space-y-1">
        <div className="flex items-center justify-between text-xs text-[#5A4434]">
          <span>Batch queueing</span>
          <RefreshCw size={14} className="text-[#2EA334]" />
        </div>
        <div className="text-sm font-semibold text-[#0D0B09]">200ms batcher</div>
        <div className="text-[11px] font-mono text-[#B9A78D]">5-min TTL cache active</div>
      </div>
    </div>
  );
};
