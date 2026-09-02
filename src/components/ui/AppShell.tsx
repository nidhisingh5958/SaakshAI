import React from 'react';
import { Navigation, TabType } from './Navigation';
import { Footer } from './Footer';

export interface AppShellProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onReset: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  onTabChange,
  onReset,
  children,
}) => {
  return (
    <div className="min-h-screen bg-[#F5F1E8] text-[#11110F] flex flex-col font-sans selection:bg-[#2E7D50]/20 selection:text-[#11110F]">
      {/* Newspaper / Publication Masthead Navigation */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        onReset={onReset} 
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-12">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Publication Footer */}
      <Footer />
    </div>
  );
};
