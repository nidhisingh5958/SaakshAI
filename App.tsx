import React, { useState } from 'react';
import { analyzeContent } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import { Dashboard } from './components/Dashboard';
import { RedditMonitor } from './components/RedditMonitor';
import { YouTubeMonitor } from './components/YouTubeMonitor';

// UI Design System Imports
import { AppShell } from './src/components/ui/AppShell';
import { TabType } from './src/components/ui/Navigation';
import { Button } from './src/components/ui/Button';

// Intelligence Landing Experience Components
import { IntelligenceHero } from './src/components/intelligence/IntelligenceHero';
import { AnalysisWorkspace } from './src/components/intelligence/AnalysisWorkspace';
import { AnalysisMetadata } from './src/components/intelligence/AnalysisMetadata';
import { ProcessingTelemetry } from './src/components/intelligence/ProcessingTelemetry';
import { Activity, History, Info } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('intelligence');
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<AnalysisStatus>('idle');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setStatus('processing');
    setError(null);
    try {
      const report = await analyzeContent(inputText);
      setResult(report);
      setStatus('completed');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to analyze content. Please try again.');
      setStatus('error');
    }
  };

  const reset = () => {
    setActiveTab('intelligence');
    setStatus('idle');
    setResult(null);
    setInputText('');
    setError(null);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'intelligence') {
      reset();
    } else {
      setResult(null);
      setStatus('idle');
    }
  };

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={handleTabChange}
      onReset={reset}
    >
      {activeTab === 'reddit' ? (
        <RedditMonitor />
      ) : activeTab === 'youtube' ? (
        <YouTubeMonitor />
      ) : status === 'idle' || status === 'error' ? (
        <div className="space-y-12 sm:space-y-16 py-4">
          
          {/* Phase 3 Hero Experience */}
          <IntelligenceHero />

          {/* Phase 3 Investigation Workspace */}
          <AnalysisWorkspace
            inputText={inputText}
            onInputChange={setInputText}
            onAnalyze={handleAnalyze}
            isProcessing={status === 'processing'}
            error={error}
          />

          {/* Phase 3 Product Telemetry Metadata */}
          <AnalysisMetadata />

        </div>
      ) : status === 'processing' ? (
        /* Phase 3 Processing Telemetry */
        <ProcessingTelemetry />
      ) : result ? (
        <div className="space-y-8 pb-12">
          {/* Result View Header Bar */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0E1320] p-6 rounded-xl border border-white/10 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#35D49A]/10 border border-[#35D49A]/30 flex items-center justify-center text-[#35D49A]">
                <Activity size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#F4F5F8]">Analysis Intelligence Report</h2>
                <p className="text-[#8992A7] text-xs font-mono mt-0.5">
                  TARGET ID: TRX-{Math.random().toString(36).substr(2, 9).toUpperCase()} • {new Date().toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                onClick={reset}
                variant="secondary"
                size="sm"
                icon={<History size={14} />}
              >
                New Analysis
              </Button>
              <Button 
                variant="primary"
                size="sm"
                icon={<Info size={14} />}
              >
                Export Intel
              </Button>
            </div>
          </header>

          {/* Phase 4 Intelligence Report */}
          <Dashboard result={result} onReset={reset} />
        </div>
      ) : null}
    </AppShell>
  );
};

export default App;
