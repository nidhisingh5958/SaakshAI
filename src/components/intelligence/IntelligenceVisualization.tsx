import React from 'react';

export const IntelligenceVisualization: React.FC = () => {
  return (
    <div className="relative w-full select-none">
      
      {/* Organic Rounded Editorial Image + Evidence Overlay Composition */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-[#E3D5C0] bg-[#FFFDF9] p-5 sm:p-6 space-y-4">
        
        {/* Editorial Article Header */}
        <div className="flex items-center justify-between border-b border-[#E3D5C0] pb-3 text-xs font-mono text-[#5A4434]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#2EA334]" />
            <span className="font-semibold text-[#0D0B09]">Live Evidence Composition</span>
          </div>
          <span className="text-[#B9A78D]">Investigation #894</span>
        </div>

        {/* Article Excerpt with Research Annotations */}
        <div className="space-y-3 font-serif text-base sm:text-lg text-[#0D0B09] leading-relaxed">
          <p>
            "A newly leaked report claims that{' '}
            <span className="bg-[#B94A48]/15 text-[#B94A48] font-sans text-sm font-semibold px-1.5 py-0.5 rounded border-b-2 border-[#B94A48] relative group cursor-pointer">
              emergency measures will eliminate regional inflation within 24 hours
              <span className="absolute -top-7 left-0 bg-[#B94A48] text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Unsubstantiated claim
              </span>
            </span>
            , forcing immediate market stabilization."
          </p>

          <p className="font-sans text-xs text-[#5A4434] leading-normal pt-1">
            <span className="bg-[#B19C7A]/20 text-[#0D0B09] font-medium px-1.5 py-0.5 rounded border-b-2 border-[#B19C7A]">
              Urgency phrasing detected ("immediate", "within 24 hours")
            </span>
            {' '}without cited financial authority.
          </p>
        </div>

        {/* Annotated Signal Markers Row */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#E3D5C0] text-xs font-sans">
          <div className="p-2.5 bg-[#F4EBDD] rounded-xl text-center space-y-0.5">
            <span className="text-[10px] font-mono text-[#5A4434] uppercase block">CREDIBILITY</span>
            <span className="font-mono font-bold text-[#B19C7A]">42%</span>
          </div>
          <div className="p-2.5 bg-[#F4EBDD] rounded-xl text-center space-y-0.5">
            <span className="text-[10px] font-mono text-[#5A4434] uppercase block">MANIPULATION</span>
            <span className="font-mono font-bold text-[#B94A48]">Elevated</span>
          </div>
          <div className="p-2.5 bg-[#F4EBDD] rounded-xl text-center space-y-0.5">
            <span className="text-[10px] font-mono text-[#5A4434] uppercase block">CONSENSUS</span>
            <span className="font-mono font-bold text-[#2EA334]">Refuted</span>
          </div>
        </div>

      </div>

      {/* Floating Accent Badge */}
      <div className="absolute -bottom-3 -right-3 bg-[#0D0B09] text-[#F4EBDD] px-4 py-2 rounded-full text-xs font-mono shadow-lg border border-[#B19C7A]/40 hidden sm:flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-[#2EA334] animate-pulse" />
        <span>Sample Investigation</span>
      </div>

    </div>
  );
};
