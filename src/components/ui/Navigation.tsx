import React, { useState } from 'react';
import { Shield, Radio, Youtube, Settings, Menu, X } from 'lucide-react';

export type TabType = 'intelligence' | 'reddit' | 'youtube';

export interface NavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onReset: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  onReset,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleBrandClick = () => {
    onReset();
    setMobileMenuOpen(false);
  };

  const handleNavClick = (tab: TabType) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0E1320] border-b border-white/5 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
        
        {/* Brand Section */}
        <div 
          onClick={handleBrandClick}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-8 h-8 rounded-lg bg-[#5B8CFF]/10 border border-[#5B8CFF]/20 flex items-center justify-center transition-colors group-hover:border-[#5B8CFF]/40">
            <Shield size={18} className="text-[#5B8CFF]" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-tight text-[#F4F5F8] flex items-center gap-0.5">
              Saaksh<span className="text-[#5B8CFF]">AI</span>
            </span>
            <span className="text-[10px] font-mono font-medium text-[#5F687C] uppercase tracking-widest -mt-1">
              Intelligence Platform
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          <button
            onClick={() => handleNavClick('intelligence')}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer ${
              activeTab === 'intelligence'
                ? 'text-[#F4F5F8]'
                : 'text-[#8992A7] hover:text-[#F4F5F8] hover:bg-white/[0.03]'
            } rounded-md`}
          >
            Intelligence
            {activeTab === 'intelligence' && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#5B8CFF] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('reddit')}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer flex items-center gap-2 ${
              activeTab === 'reddit'
                ? 'text-[#F4F5F8]'
                : 'text-[#8992A7] hover:text-[#F4F5F8] hover:bg-white/[0.03]'
            } rounded-md`}
          >
            <Radio size={14} className={activeTab === 'reddit' ? 'text-[#9B6DFF]' : 'text-[#8992A7]'} />
            Reddit Monitor
            {activeTab === 'reddit' && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#9B6DFF] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('youtube')}
            className={`relative px-4 py-2 text-sm font-medium transition-all duration-150 cursor-pointer flex items-center gap-2 ${
              activeTab === 'youtube'
                ? 'text-[#F4F5F8]'
                : 'text-[#8992A7] hover:text-[#F4F5F8] hover:bg-white/[0.03]'
            } rounded-md`}
          >
            <Youtube size={14} className={activeTab === 'youtube' ? 'text-[#FF5F6D]' : 'text-[#8992A7]'} />
            YouTube Monitor
            {activeTab === 'youtube' && (
              <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#FF5F6D] rounded-full" />
            )}
          </button>
        </nav>

        {/* Right Section: System Telemetry & Settings */}
        <div className="hidden md:flex items-center gap-6">
          {/* Telemetry Status */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#35D49A]/5 border border-[#35D49A]/15 font-mono text-xs text-[#35D49A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35D49A] animate-pulse" />
            <span className="tracking-wider uppercase font-semibold">Systems Online</span>
          </div>

          <button 
            className="p-1.5 text-[#8992A7] hover:text-[#F4F5F8] hover:bg-white/[0.04] rounded-md transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#35D49A]/5 border border-[#35D49A]/15 font-mono text-[10px] text-[#35D49A]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#35D49A]" />
            <span>ONLINE</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#8992A7] hover:text-[#F4F5F8] rounded-md transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E1320] border-b border-white/10 px-4 py-4 space-y-2 animate-fade-in">
          <button
            onClick={() => handleNavClick('intelligence')}
            className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'intelligence'
                ? 'bg-[#182033] text-[#F4F5F8] border-l-2 border-[#5B8CFF]'
                : 'text-[#8992A7] hover:text-[#F4F5F8]'
            }`}
          >
            Intelligence Platform
          </button>

          <button
            onClick={() => handleNavClick('reddit')}
            className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'reddit'
                ? 'bg-[#182033] text-[#F4F5F8] border-l-2 border-[#9B6DFF]'
                : 'text-[#8992A7] hover:text-[#F4F5F8]'
            }`}
          >
            <Radio size={16} className="text-[#9B6DFF]" />
            Reddit Monitor
          </button>

          <button
            onClick={() => handleNavClick('youtube')}
            className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'youtube'
                ? 'bg-[#182033] text-[#F4F5F8] border-l-2 border-[#FF5F6D]'
                : 'text-[#8992A7] hover:text-[#F4F5F8]'
            }`}
          >
            <Youtube size={16} className="text-[#FF5F6D]" />
            YouTube Monitor
          </button>

          <div className="pt-2 border-t border-white/5 flex items-center justify-between px-2">
            <span className="text-xs font-mono text-[#5F687C]">SYSTEM STATUS</span>
            <span className="text-xs font-mono text-[#35D49A]">● ONLINE</span>
          </div>
        </div>
      )}
    </header>
  );
};
