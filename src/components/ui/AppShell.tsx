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
    <div className="min-h-screen bg-[#080B14] text-[#F4F5F8] flex flex-col font-sans selection:bg-[#5B8CFF]/20 selection:text-white">
      {/* Navigation Header */}
      <Navigation 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
        onReset={onReset} 
      />

      {/* Main Workspace Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12 py-8 sm:py-10">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
