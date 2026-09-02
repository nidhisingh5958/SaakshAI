import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#D8D1C4] bg-[#FFFDF8] py-8 mt-20 text-xs text-[#625E55]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="font-serif font-extrabold text-[#11110F] tracking-tight text-sm">SAAKSHAI</span>
          <span>—</span>
          <span>Investigate information before you decide what to believe</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px] text-[#8C877C]">
          <span>Intelligence</span>
          <span>•</span>
          <span>Reddit</span>
          <span>•</span>
          <span>YouTube</span>
        </div>
      </div>
    </footer>
  );
};
