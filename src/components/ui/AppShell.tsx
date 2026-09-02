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
    <div className="min-h-screen bg-[#F4EBDD] text-[#0D0B09] flex flex-col font-sans selection:bg-[#2EA334]/20 selection:text-[#0D0B09]">
      {/* Navigation Header */}
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

      {/* Footer */}
      <Footer />
    </div>
  );
};
