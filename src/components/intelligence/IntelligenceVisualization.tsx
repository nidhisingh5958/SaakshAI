import React from 'react';

export const IntelligenceVisualization: React.FC = () => {
  return (
    <div className="relative w-full my-8">
      
      {/* Signature Investigative Evidence Document with Margin Notes */}
      <div className="bg-[#FFFDF8] border border-[#D8D1C4] p-6 sm:p-10 space-y-6 shadow-xs relative">
        
        {/* Document Header */}
        <div className="flex items-center justify-between border-b border-[#D8D1C4] pb-4 font-mono text-xs text-[#625E55]">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#2E7D50]" />
            <span className="font-bold text-[#11110F] uppercase tracking-wider">
              EXAMPLE INVESTIGATION / SAMPLE EVIDENCE
            </span>
          </div>
          <span className="text-[#8C877C]">DOCUMENT #894-B</span>
        </div>

        {/* Marked-up Text & Margin Notes Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          
          {/* Main Document Body */}
          <div className="lg:col-span-8 space-y-4 font-serif text-lg sm:text-xl text-[#11110F] leading-relaxed">
            <p>
              "Leaked internal documents confirm that{' '}
              <span className="bg-[#A83F3F]/10 border-b-2 border-[#A83F3F] font-sans text-base font-semibold px-1 py-0.5 relative group">
                unprecedented emergency regulations will immediately halt inflation
                <span className="absolute -top-7 left-0 bg-[#A83F3F] text-white text-[10px] font-mono uppercase px-2 py-0.5 shadow-xs whitespace-nowrap">
                  Unsubstantiated Claim
                </span>
              </span>
              {' '}across regional markets within 24 hours."
            </p>

            <p className="font-sans text-sm text-[#625E55] leading-relaxed">
              Analysis indicates{' '}
              <span className="border-b border-[#B0783C] text-[#11110F] font-medium">
                high emotional urgency phrasing
              </span>
              {' '}without official regulatory verification.
            </p>
          </div>

          {/* Margin Annotations Column */}
          <div className="lg:col-span-4 space-y-3 pt-2 lg:pt-0 lg:border-l border-[#D8D1C4] lg:pl-6 text-xs font-mono">
            <div className="p-3 bg-[#F5F1E8] border-l-2 border-[#A83F3F] space-y-1">
              <span className="text-[#A83F3F] font-bold block uppercase">MARGIN NOTE 01</span>
              <p className="text-[#625E55] font-sans">No matching regulatory filing in official press database.</p>
            </div>

            <div className="p-3 bg-[#F5F1E8] border-l-2 border-[#B0783C] space-y-1">
              <span className="text-[#B0783C] font-bold block uppercase">MARGIN NOTE 02</span>
              <p className="text-[#625E55] font-sans">Urgency timeframe ("24 hours") designed to trigger viral sharing.</p>
            </div>

            <div className="p-3 bg-[#F5F1E8] border-l-2 border-[#2E7D50] space-y-1">
              <span className="text-[#2E7D50] font-bold block uppercase">SOURCE CHECK</span>
              <p className="text-[#625E55] font-sans">Cross-referenced against 14 verified outlet wire feeds.</p>
            </div>
          </div>

        </div>

        {/* Evidence Footer Summary */}
        <div className="pt-4 border-t border-[#D8D1C4] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-[#625E55]">
          <span>VERDICT: UNSUBSTANTIATED TIMEFRAME & MANIPULATIVE FRAMING</span>
          <span className="text-[#2E7D50]">CONSENSUS REFUTED</span>
        </div>

      </div>
    </div>
  );
};
