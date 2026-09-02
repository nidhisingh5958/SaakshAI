import React, { useState } from 'react';
import { Menu, X, Settings } from 'lucide-react';

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
    <header className="bg-[#FFFDF8] border-b border-[#D8D1C4] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-7 flex items-center justify-between">
        
        {/* Newsroom Publication Masthead Logo */}
        <div 
          onClick={handleBrandClick}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <span className="text-2xl sm:text-3xl font-serif font-extrabold tracking-tight text-[#11110F]">
            SAAKSHAI
          </span>
          <span className="hidden sm:inline-block text-xs font-mono text-[#8C877C] border-l border-[#D8D1C4] pl-3 py-0.5">
            Investigative Research Desk
          </span>
        </div>

        {/* Desktop Masthead Navigation Links */}
        <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
          <button
            onClick={() => handleNavClick('intelligence')}
            className={`relative py-2 transition-colors cursor-pointer ${
              activeTab === 'intelligence'
                ? 'text-[#11110F] font-semibold'
                : 'text-[#625E55] hover:text-[#11110F]'
            }`}
          >
            Intelligence
            {activeTab === 'intelligence' && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#2E7D50]" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('reddit')}
            className={`relative py-2 transition-colors cursor-pointer ${
              activeTab === 'reddit'
                ? 'text-[#11110F] font-semibold'
                : 'text-[#625E55] hover:text-[#11110F]'
            }`}
          >
            Reddit
            {activeTab === 'reddit' && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#2E7D50]" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('youtube')}
            className={`relative py-2 transition-colors cursor-pointer ${
              activeTab === 'youtube'
                ? 'text-[#11110F] font-semibold'
                : 'text-[#625E55] hover:text-[#11110F]'
            }`}
          >
            YouTube
            {activeTab === 'youtube' && (
              <span className="absolute -bottom-2 left-0 right-0 h-[2px] bg-[#2E7D50]" />
            )}
          </button>
        </nav>

        {/* Quiet Masthead Controls */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-mono text-[#625E55]">
            <span className="w-2 h-2 rounded-full bg-[#2E7D50]" />
            <span>Online</span>
          </div>

          <button 
            className="p-2 text-[#625E55] hover:text-[#11110F] hover:bg-[#EFE8DA] rounded transition-colors cursor-pointer"
            title="Settings"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-[#2E7D50]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D50]" />
            <span>Online</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-[#625E55] hover:text-[#11110F] rounded transition-colors"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FFFDF8] border-b border-[#D8D1C4] px-4 py-4 space-y-2 animate-fade-in">
          <button
            onClick={() => handleNavClick('intelligence')}
            className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'intelligence'
                ? 'bg-[#EFE8DA] text-[#11110F] font-semibold border-l-2 border-[#2E7D50]'
                : 'text-[#625E55] hover:text-[#11110F]'
            }`}
          >
            Intelligence
          </button>

          <button
            onClick={() => handleNavClick('reddit')}
            className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'reddit'
                ? 'bg-[#EFE8DA] text-[#11110F] font-semibold border-l-2 border-[#2E7D50]'
                : 'text-[#625E55] hover:text-[#11110F]'
            }`}
          >
            Reddit
          </button>

          <button
            onClick={() => handleNavClick('youtube')}
            className={`w-full text-left px-3 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'youtube'
                ? 'bg-[#EFE8DA] text-[#11110F] font-semibold border-l-2 border-[#2E7D50]'
                : 'text-[#625E55] hover:text-[#11110F]'
            }`}
          >
            YouTube
          </button>
        </div>
      )}
    </header>
  );
};
