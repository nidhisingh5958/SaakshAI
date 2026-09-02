import React from 'react';
import { Cpu, Shield, Globe, RefreshCw } from 'lucide-react';

export const AnalysisMetadata: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#D8D1C4]">
      <div className="p-4 bg-[#FFFDF8] border border-[#D8D1C4] space-y-1">
        <div className="flex items-center justify-between text-xs text-[#625E55]">
          <span>Primary engine</span>
          <Cpu size={14} className="text-[#2E7D50]" />
        </div>
        <div className="text-sm font-semibold text-[#11110F]">Gemini 3 Pro</div>
        <div className="text-[11px] font-mono text-[#8C877C]">With Groq Llama fallback</div>
      </div>

      <div className="p-4 bg-[#FFFDF8] border border-[#D8D1C4] space-y-1">
        <div className="flex items-center justify-between text-xs text-[#625E55]">
          <span>Cross-lingual model</span>
          <Globe size={14} className="text-[#2E7D50]" />
        </div>
        <div className="text-sm font-semibold text-[#11110F]">XLM-RoBERTa</div>
        <div className="text-[11px] font-mono text-[#8C877C]">Multilingual embeddings</div>
      </div>

      <div className="p-4 bg-[#FFFDF8] border border-[#D8D1C4] space-y-1">
        <div className="flex items-center justify-between text-xs text-[#625E55]">
          <span>Verification mode</span>
          <Shield size={14} className="text-[#2E7D50]" />
        </div>
        <div className="text-sm font-semibold text-[#11110F]">Live RAG news consensus</div>
        <div className="text-[11px] font-mono text-[#8C877C]">Trusted outlet cross-check</div>
      </div>

      <div className="p-4 bg-[#FFFDF8] border border-[#D8D1C4] space-y-1">
        <div className="flex items-center justify-between text-xs text-[#625E55]">
          <span>Batch queueing</span>
          <RefreshCw size={14} className="text-[#2E7D50]" />
        </div>
        <div className="text-sm font-semibold text-[#11110F]">200ms batcher</div>
        <div className="text-[11px] font-mono text-[#8C877C]">5-min TTL cache active</div>
      </div>
    </div>
  );
};
