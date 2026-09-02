import React from 'react';
import { Terminal, Globe2, Cpu, ArrowRight, AlertTriangle } from 'lucide-react';
import { Textarea } from '../ui/Input';
import { Button } from '../ui/Button';
import { SectionLabel } from '../ui/SectionLabel';

export interface AnalysisWorkspaceProps {
  inputText: string;
  onInputChange: (text: string) => void;
  onAnalyze: () => void;
  isProcessing: boolean;
  error?: string | null;
}

export const AnalysisWorkspace: React.FC<AnalysisWorkspaceProps> = ({
  inputText,
  onInputChange,
  onAnalyze,
  isProcessing,
  error,
}) => {
  return (
    <div id="workspace-input" className="space-y-6 pt-4">
      
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/5 pb-4">
        <div>
          <SectionLabel icon={<Terminal size={14} />}>
            ANALYZE CONTENT
          </SectionLabel>
          <h2 className="text-xl sm:text-2xl font-bold text-[#F4F5F8] mt-1">
            What would you like to investigate?
          </h2>
        </div>
        <span className="text-xs font-mono text-[#5F687C]">
          Supports news text, social media claims, and URLs
        </span>
      </div>

      {/* Input Surface Box */}
      <div className="bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm">
        
        <div className="space-y-3">
          <Textarea
            value={inputText}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder="Paste article excerpt, social media post, headline, or claims here for deep intelligence analysis..."
            rows={7}
            className="text-base font-sans leading-relaxed bg-[#121827]"
            aria-label="Content input for intelligence analysis"
          />

          {/* Integrated Bar inside Workspace */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#121827] border border-white/5 text-[11px] font-mono text-[#8992A7]">
                <Globe2 size={12} className="text-[#5B8CFF]" />
                Auto-Detect Language
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#121827] border border-white/5 text-[11px] font-mono text-[#8992A7]">
                <Cpu size={12} className="text-[#9B6DFF]" />
                XLM-RoBERTa / Gemini Pro
              </span>
            </div>

            <span className="text-xs font-mono text-[#5F687C]">
              {inputText.length} CHARS
            </span>
          </div>
        </div>

        {/* Integrated Error Banner if present */}
        {error && (
          <div className="bg-[#FF5F6D]/10 border border-[#FF5F6D]/30 text-[#FF5F6D] p-4 rounded-xl flex items-center justify-between gap-4 text-sm font-mono animate-fade-in">
            <div className="flex items-center gap-3">
              <AlertTriangle size={18} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
            <button 
              onClick={onAnalyze}
              className="px-3 py-1 bg-[#FF5F6D]/20 hover:bg-[#FF5F6D]/30 rounded text-xs text-[#FF5F6D] transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Primary Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            onClick={onAnalyze}
            disabled={!inputText.trim() || isProcessing}
            variant="primary"
            size="lg"
            icon={<ArrowRight size={18} />}
            className="w-full sm:w-auto px-8 py-3.5 font-semibold"
          >
            ANALYZE CONTENT →
          </Button>
        </div>

      </div>

    </div>
  );
};
