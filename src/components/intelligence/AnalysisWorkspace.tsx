import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Textarea } from '../ui/Input';
import { Button } from '../ui/Button';

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
  const charCount = inputText.length;

  return (
    <div id="investigation-workspace" className="bg-[#FFFDF8] border border-[#D8D1C4] p-8 sm:p-12 space-y-6 shadow-xs my-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D8D1C4] pb-4 font-sans">
        <div>
          <h2 className="text-3xl font-serif font-bold text-[#11110F]">
            What do you want to investigate?
          </h2>
          <p className="text-sm text-[#625E55] mt-1">
            Paste a claim, news article excerpt, social media post, or statement to analyze its validity.
          </p>
        </div>

        <span className="text-xs font-mono text-[#8C877C] self-end sm:self-auto">
          {charCount} characters
        </span>
      </div>

      <div className="space-y-4">
        <Textarea
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Paste content here (e.g. 'Leaked memo claims breakthrough medical treatment will eliminate memory loss in 24 hours...')"
          rows={6}
          disabled={isProcessing}
          className="font-sans text-base leading-relaxed p-4 bg-[#FFFDF8] border-[#D8D1C4]"
        />

        {error && (
          <div className="p-4 bg-[#A83F3F]/10 border border-[#A83F3F]/25 rounded text-[#A83F3F] text-xs flex items-center justify-between gap-3 font-sans">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
            <Button onClick={onAnalyze} variant="danger" size="sm">
              Try again
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs font-mono text-[#8C877C]">
            MULTILINGUAL TRANSFORMER ENGINE READY
          </span>

          <Button
            onClick={onAnalyze}
            disabled={isProcessing || !inputText.trim()}
            variant="primary"
            size="lg"
            icon={isProcessing ? <Loader2 size={16} className="animate-spin" /> : undefined}
          >
            {isProcessing ? 'Analyzing content...' : 'Start an investigation'}
          </Button>
        </div>
      </div>
    </div>
  );
};
