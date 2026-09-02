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
import { Activity, History, Download } from 'lucide-react';

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
        <div className="space-y-12 sm:space-y-16 py-2">
          
          {/* Editorial Hero Experience */}
          <IntelligenceHero />

          {/* Research Input Workspace */}
          <AnalysisWorkspace
            inputText={inputText}
            onInputChange={setInputText}
            onAnalyze={handleAnalyze}
            isProcessing={status === 'processing'}
            error={error}
          />

          {/* Product Metadata Bar */}
          <AnalysisMetadata />

        </div>
      ) : status === 'processing' ? (
        /* Processing Telemetry */
        <ProcessingTelemetry />
      ) : result ? (
        <div className="space-y-8 pb-12">
          {/* Result View Header Bar */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFDF8] p-6 border border-[#D8D1C4] shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#2E7D50]/15 flex items-center justify-center text-[#2E7D50]">
                <Activity size={20} />
              </div>
              <div>
                <h2 className="text-xl font-serif font-bold text-[#11110F]">Investigation Briefing Report</h2>
                <p className="text-[#625E55] text-xs font-mono mt-0.5">
                  TARGET ID: TRX-{Math.random().toString(36).substr(2, 7).toUpperCase()} • {new Date().toLocaleDateString()}
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
                New investigation
              </Button>
              <Button 
                variant="primary"
                size="sm"
                icon={<Download size={14} />}
              >
                Export briefing
              </Button>
            </div>
          </header>

          {/* Intelligence Report */}
          <Dashboard result={result} onReset={reset} />
        </div>
      ) : null}
    </AppShell>
  );
};

export default App;
