import React from 'react';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/5 py-8 bg-[#080B14] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand Meta */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[#5B8CFF]/10 border border-[#5B8CFF]/20 flex items-center justify-center">
            <Shield size={14} className="text-[#5B8CFF]" />
          </div>
          <div>
            <span className="text-xs font-semibold tracking-tight text-[#F4F5F8] block">
              Saaksh AI Intelligence Platform
            </span>
            <span className="text-[11px] font-mono text-[#5F687C]">
              © 2026 All rights reserved
            </span>
          </div>
        </div>

        {/* Links & Attribution */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-4 text-xs font-medium text-[#8992A7]">
            <a href="#" className="hover:text-[#F4F5F8] transition-colors">Privacy</a>
            <span className="text-white/10">•</span>
            <a href="#" className="hover:text-[#F4F5F8] transition-colors">Terms</a>
            <span className="text-white/10">•</span>
            <a href="#" className="hover:text-[#F4F5F8] transition-colors">Documentation</a>
          </div>

          <div className="hidden sm:block h-3 w-px bg-white/10" />

          <p className="text-xs font-mono text-[#5F687C]">
            Engine: <span className="text-[#5B8CFF]">XLM-RoBERTa</span> & <span className="text-[#9B6DFF]">Gemini Pro</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
