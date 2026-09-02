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
    <div className="bg-[#FFFDF9] border border-[#E3D5C0] rounded-3xl p-6 sm:p-10 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E3D5C0] pb-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#0D0B09]">
            What are you looking at?
          </h2>
          <p className="text-sm text-[#5A4434] mt-0.5">
            Paste a claim, news article, social media post, or statement to evaluate its credibility.
          </p>
        </div>

        <span className="text-xs font-mono text-[#B9A78D] self-end sm:self-auto">
          {charCount} characters
        </span>
      </div>

      <div className="space-y-4">
        <Textarea
          value={inputText}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Paste content here (e.g. 'Leaked memo claims breakthrough medical treatment will eliminate memory loss in 24 hours...')"
          rows={5}
          disabled={isProcessing}
          className="font-sans text-base leading-relaxed p-4"
        />

        {error && (
          <div className="p-4 bg-[#B94A48]/12 border border-[#B94A48]/25 rounded-2xl text-[#B94A48] text-xs flex items-center justify-between gap-3 font-sans">
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
          <span className="text-xs text-[#B9A78D]">
            English and multilingual analysis supported
          </span>

          <Button
            onClick={onAnalyze}
            disabled={isProcessing || !inputText.trim()}
            variant="primary"
            size="lg"
            icon={isProcessing ? <Loader2 size={16} className="animate-spin" /> : undefined}
          >
            {isProcessing ? 'Analyzing content...' : 'Start analysis'}
          </Button>
        </div>
      </div>
    </div>
  );
};
