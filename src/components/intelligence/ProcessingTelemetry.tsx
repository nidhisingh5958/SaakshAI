import React from 'react';
import { Loader2 } from 'lucide-react';

export const ProcessingTelemetry: React.FC = () => {
  return (
    <div className="bg-[#FFFDF8] border border-[#D8D1C4] p-10 text-center space-y-5 my-12 max-w-xl mx-auto shadow-xs">
      <Loader2 size={36} className="text-[#2E7D50] animate-spin mx-auto" />
      
      <div className="space-y-2">
        <h3 className="text-2xl font-serif font-bold text-[#11110F]">
          Reading and investigating content
        </h3>
        <p className="text-sm text-[#625E55] leading-relaxed max-w-md mx-auto">
          Examining claim validity, checking verified news consensus, and evaluating emotional framing signals.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#8C877C] pt-3 border-t border-[#D8D1C4]">
        <span>1. Checking claims</span>
        <span>•</span>
        <span>2. Reading language</span>
        <span>•</span>
        <span>3. Assessing risk</span>
      </div>
    </div>
  );
};
