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
    <header className="sticky top-0 z-50 bg-[#FFFDF9]/90 backdrop-blur-md border-b border-[#E3D5C0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
        
        {/* Understated Brand Mark */}
        <div 
          onClick={handleBrandClick}
          className="flex items-center gap-2.5 cursor-pointer group select-none"
        >
          <div className="w-7 h-7 rounded-full bg-[#2EA334]/15 flex items-center justify-center">
            <Shield size={15} className="text-[#2EA334]" />
          </div>
          <span className="text-base font-bold tracking-tight text-[#0D0B09]">
            Saaksh <span className="text-[#2EA334] font-semibold">AI</span>
          </span>
        </div>

        {/* Desktop Editorial Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('intelligence')}
            className={`relative py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'intelligence'
                ? 'text-[#0D0B09] font-semibold'
                : 'text-[#5A4434] hover:text-[#0D0B09]'
            }`}
          >
            Intelligence
            {activeTab === 'intelligence' && (
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#2EA334] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('reddit')}
            className={`relative py-1.5 text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reddit'
                ? 'text-[#0D0B09] font-semibold'
                : 'text-[#5A4434] hover:text-[#0D0B09]'
            }`}
          >
            <Radio size={14} className={activeTab === 'reddit' ? 'text-[#2EA334]' : 'text-[#B9A78D]'} />
            Reddit
            {activeTab === 'reddit' && (
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#2EA334] rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('youtube')}
            className={`relative py-1.5 text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'youtube'
                ? 'text-[#0D0B09] font-semibold'
                : 'text-[#5A4434] hover:text-[#0D0B09]'
            }`}
          >
            <Youtube size={14} className={activeTab === 'youtube' ? 'text-[#2EA334]' : 'text-[#B9A78D]'} />
            YouTube
            {activeTab === 'youtube' && (
              <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#2EA334] rounded-full" />
            )}
          </button>
        </nav>

        {/* Right Section: System Indicator */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-2 text-xs font-mono text-[#5A4434]">
            <span className="w-2 h-2 rounded-full bg-[#2EA334]" />
            <span>Systems online</span>
          </div>

          <button 
            className="p-1.5 text-[#5A4434] hover:text-[#0D0B09] hover:bg-[#EED4AC]/40 rounded-full transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings size={16} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#2EA334]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EA334]" />
            <span>Online</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#5A4434] hover:text-[#0D0B09] rounded-md transition-colors"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF9] border-b border-[#E3D5C0] px-4 py-3 space-y-1 animate-fade-in">
          <button
            onClick={() => handleNavClick('intelligence')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'intelligence'
                ? 'bg-[#EED4AC]/50 text-[#0D0B09] font-semibold'
                : 'text-[#5A4434] hover:text-[#0D0B09]'
            }`}
          >
            Intelligence
          </button>

          <button
            onClick={() => handleNavClick('reddit')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'reddit'
                ? 'bg-[#EED4AC]/50 text-[#0D0B09] font-semibold'
                : 'text-[#5A4434] hover:text-[#0D0B09]'
            }`}
          >
            <Radio size={15} className="text-[#2EA334]" />
            Reddit
          </button>

          <button
            onClick={() => handleNavClick('youtube')}
            className={`w-full text-left px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'youtube'
                ? 'bg-[#EED4AC]/50 text-[#0D0B09] font-semibold'
                : 'text-[#5A4434] hover:text-[#0D0B09]'
            }`}
          >
            <Youtube size={15} className="text-[#2EA334]" />
            YouTube
          </button>
        </div>
      )}
    </header>
  );
};
