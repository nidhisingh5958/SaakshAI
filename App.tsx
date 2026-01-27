
import React, { useState, useCallback } from 'react';
import { 
  Shield, 
  Search, 
  Terminal, 
  Database, 
  Layers, 
  Cpu, 
  Globe2, 
  Activity,
  History,
  Settings,
  Info,
  AlertTriangle
} from 'lucide-react';
import { analyzeContent } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import { Dashboard } from './components/Dashboard';

const App: React.FC = () => {
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
    setStatus('idle');
    setResult(null);
    setInputText('');
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={reset}>
            <div className="bg-blue-600 p-1.5 rounded-lg group-hover:rotate-12 transition-transform">
              <Shield size={24} className="text-white" />
            </div>
            <span className="text-xl font-black tracking-tight text-white">SAKSH<span className="text-blue-500">AI</span></span>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex items-center gap-4 text-sm font-medium text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Intelligence</a>
              <a href="#" className="hover:text-white transition-colors">RAG Stream</a>
              <a href="#" className="hover:text-white transition-colors">OSINT</a>
              <a href="#" className="hover:text-white transition-colors">API</a>
            </nav>
            <div className="h-6 w-px bg-slate-800" />
            <button className="text-slate-400 hover:text-white"><Settings size={20} /></button>
            <button className="bg-slate-800 px-4 py-2 rounded-lg text-sm font-bold border border-slate-700 hover:bg-slate-700 transition-colors">
              Systems Normal
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {status === 'idle' || status === 'error' ? (
          <div className="max-w-3xl mx-auto space-y-12 pt-12">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white animate-in fade-in slide-in-from-top-4 duration-500">
                Misinformation Intelligence <span className="text-blue-500">Engine</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                Advanced transformer-based detection for multilingual articles, social posts, and linguistic manipulation.
              </p>
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste article text, social media URL, or headlines here for deep analysis..."
                  className="w-full h-64 bg-slate-800/50 border-2 border-slate-700 rounded-2xl p-6 text-white text-lg placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-none shadow-2xl"
                />
                <div className="absolute bottom-4 right-4 flex gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                    <Globe2 size={12} /> Auto-Detect Language
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-full text-[10px] font-bold text-slate-500 uppercase">
                    <Cpu size={12} /> XLM-RoBERTa Pipeline
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex items-center gap-3">
                  {/* Fixed: AlertTriangle is now imported */}
                  <AlertTriangle size={20} />
                  <span className="text-sm font-medium">{error}</span>
                </div>
              )}

              <button
                onClick={handleAnalyze}
                disabled={!inputText.trim() || status === 'processing'}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-5 rounded-2xl text-xl shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 transition-all group"
              >
                <Search className="group-hover:scale-110 transition-transform" />
                Run Intelligence Analysis
              </button>
            </div>

            {/* Quick Stats/Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-1000 delay-300">
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col gap-1">
                <Layers size={18} className="text-blue-500 mb-1" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Models</span>
                <span className="text-sm font-medium text-slate-300">XLM-R / Gemini-3</span>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col gap-1">
                <Database size={18} className="text-emerald-500 mb-1" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">RAG Source</span>
                <span className="text-sm font-medium text-slate-300">Live News API</span>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col gap-1">
                <Terminal size={18} className="text-amber-500 mb-1" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Analysis</span>
                <span className="text-sm font-medium text-slate-300">Linguistic Pattern</span>
              </div>
              <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col gap-1">
                <Activity size={18} className="text-rose-500 mb-1" />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</span>
                <span className="text-sm font-medium text-slate-300">Ready for Input</span>
              </div>
            </div>
          </div>
        ) : status === 'processing' ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-8 max-w-xl mx-auto text-center">
            <div className="relative">
              <div className="w-32 h-32 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <Shield size={48} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500 animate-pulse" />
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl font-black">Processing Pipeline...</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm font-mono text-blue-400 justify-center">
                  <span className="animate-pulse">Initializing Multilingual Vector Map...</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-blue-500 animate-progress origin-left" />
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-[10px] uppercase font-black text-slate-500">
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" /> Sentiment Extraction</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" /> RAG News Alignment</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" /> Virality Scoring</div>
                  <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" /> Claim Verification</div>
                </div>
              </div>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/40 p-6 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-2xl font-black text-white">System Analysis Report</h2>
                <p className="text-slate-400 text-sm">Target ID: <span className="font-mono text-blue-400">TRX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span> • {new Date().toLocaleString()}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={reset}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-bold border border-slate-700 transition-colors flex items-center gap-2"
                >
                  <History size={16} /> New Analysis
                </button>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold shadow-lg shadow-blue-900/20 transition-colors flex items-center gap-2">
                  <Info size={16} /> Export Intel
                </button>
              </div>
            </header>

            <Dashboard result={result} />
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 opacity-50">
            <Shield size={18} className="text-blue-500" />
            <span className="text-sm font-bold tracking-tight">SAKSH AI Intelligence Platform</span>
          </div>
          <p className="text-xs text-slate-500 font-medium text-center md:text-right">
            Proprietary XLM-RoBERTa based verification system. <br />
            Powered by advanced RAG pipelines and Gemini 3 Pro transformer models.
          </p>
        </div>
      </footer>

      <style>{`
        @keyframes progress {
          0% { transform: scaleX(0); }
          50% { transform: scaleX(0.7); }
          100% { transform: scaleX(1); }
        }
        .animate-progress {
          animation: progress 3s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default App;
