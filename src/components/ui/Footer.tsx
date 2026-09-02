import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-[#E3D5C0] bg-[#FFFDF9] py-8 mt-16 text-xs text-[#5A4434]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#0D0B09]">Saaksh AI</span>
          <span>—</span>
          <span>Understand information before you trust it</span>
        </div>

        <div className="flex items-center gap-6 font-mono text-[11px] text-[#B9A78D]">
          <span>Intelligence Engine</span>
          <span>•</span>
          <span>Reddit Monitor</span>
          <span>•</span>
          <span>YouTube Monitor</span>
        </div>
      </div>
    </footer>
  );
};
