import React from 'react';
import { Loader2 } from 'lucide-react';

export const ProcessingTelemetry: React.FC = () => {
  return (
    <div className="bg-[#FFFDF9] border border-[#E3D5C0] rounded-3xl p-8 sm:p-12 text-center space-y-5 my-8 shadow-sm max-w-xl mx-auto">
      <Loader2 size={36} className="text-[#2EA334] animate-spin mx-auto" />
      
      <div className="space-y-2">
        <h3 className="text-xl font-serif font-bold text-[#0D0B09]">
          Reading and analyzing content
        </h3>
        <p className="text-sm text-[#5A4434] leading-relaxed max-w-md mx-auto">
          Examining claim validity, checking verified news consensus, and evaluating emotional framing signals.
        </p>
      </div>

      <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#B9A78D] pt-2 border-t border-[#E3D5C0]">
        <span>1. Checking claims</span>
        <span>•</span>
        <span>2. Reading language</span>
        <span>•</span>
        <span>3. Assessing risk</span>
      </div>
    </div>
  );
};
