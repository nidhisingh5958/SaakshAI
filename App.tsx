
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
  AlertTriangle,
  Radio,
  Youtube
} from 'lucide-react';
import { analyzeContent } from './services/geminiService';
import { AnalysisResult, AnalysisStatus } from './types';
import { Dashboard } from './components/Dashboard';
import { RedditMonitor } from './components/RedditMonitor';
import { YouTubeMonitor } from './components/YouTubeMonitor';

type TabType = 'intelligence' | 'reddit' | 'youtube';

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

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/70 backdrop-blur-xl sticky top-0 z-50 shadow-lg shadow-slate-900/20">
        <div className="max-w-7xl mx-auto px-4 h-18 flex items-center justify-between py-3">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={reset}>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500 rounded-xl blur-lg opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl group-hover:rotate-6 group-hover:scale-110 transition-all duration-300 shadow-lg">
                <Shield size={26} className="text-white" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">Saaksh<span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text">AI</span></span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest -mt-1">Intelligence Platform</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-1">
              <button 
                onClick={() => { setActiveTab('intelligence'); reset(); }} 
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                  activeTab === 'intelligence' 
                    ? 'text-white bg-slate-800/80 border border-slate-700' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                Intelligence
              </button>
              <button 
                onClick={() => { setActiveTab('reddit'); setResult(null); setStatus('idle'); }} 
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'reddit' 
                    ? 'text-white bg-slate-800/80 border border-slate-700' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Radio size={16} />
                Reddit Monitor
              </button>
              <button 
                onClick={() => { setActiveTab('youtube'); setResult(null); setStatus('idle'); }} 
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeTab === 'youtube' 
                    ? 'text-white bg-slate-800/80 border border-slate-700' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Youtube size={16} />
                YouTube Monitor
              </button>
            </nav>
            <div className="h-8 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
            <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all"><Settings size={20} /></button>
            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 rounded-xl">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
              <span className="text-sm font-semibold text-emerald-400">Systems Online</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {activeTab === 'reddit' ? (
          <RedditMonitor />
        ) : activeTab === 'youtube' ? (
          <YouTubeMonitor />
        ) : status === 'idle' || status === 'error' ? (
          <div className="max-w-4xl mx-auto space-y-12 pt-16">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-semibold mb-4 animate-in fade-in duration-500">
                <Cpu size={16} className="animate-pulse" />
                <span>Powered by Advanced AI Models</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight animate-in fade-in slide-in-from-top-4 duration-500">
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">Misinformation</span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Intelligence Engine</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
                Advanced transformer-based detection for <span className="text-blue-400">multilingual articles</span>, 
                <span className="text-purple-400"> social posts</span>, and <span className="text-emerald-400">linguistic manipulation</span>.
              </p>
            </div>

            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative">
                  <textarea
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Paste article text, social media URL, or headlines here for deep analysis..."
                    className="w-full h-72 bg-slate-900/80 border-2 border-slate-700/50 rounded-2xl p-6 text-white text-lg placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-slate-900 transition-all duration-300 resize-none shadow-2xl shadow-slate-900/50"
                  />
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-full text-[10px] font-bold text-slate-400 uppercase hover:border-blue-500/30 hover:text-blue-400 transition-all cursor-pointer">
                        <Globe2 size={12} /> Auto-Detect Language
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 backdrop-blur border border-slate-700/50 rounded-full text-[10px] font-bold text-slate-400 uppercase hover:border-purple-500/30 hover:text-purple-400 transition-all cursor-pointer">
                        <Cpu size={12} /> XLM-RoBERTa Pipeline
                      </div>
                    </div>
                    <span className="text-xs text-slate-600 font-mono">{inputText.length} chars</span>
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
                className="relative w-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:via-blue-500 disabled:hover:to-indigo-600 text-white font-bold py-5 rounded-2xl text-xl shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <Search className="relative group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                <span className="relative">Run Intelligence Analysis</span>
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
              </button>
            </div>

            {/* Quick Stats/Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-in fade-in duration-1000 delay-300">
              {[
                { icon: Layers, color: 'blue', title: 'Models', value: 'XLM-R / Gemini-3', gradient: 'from-blue-500/10 to-blue-500/5' },
                { icon: Database, color: 'emerald', title: 'RAG Source', value: 'Live News API', gradient: 'from-emerald-500/10 to-emerald-500/5' },
                { icon: Terminal, color: 'amber', title: 'Analysis', value: 'Linguistic Pattern', gradient: 'from-amber-500/10 to-amber-500/5' },
                { icon: Activity, color: 'rose', title: 'Status', value: 'Ready for Input', gradient: 'from-rose-500/10 to-rose-500/5' },
              ].map((item, idx) => (
                <div key={idx} className={`p-5 bg-gradient-to-br ${item.gradient} rounded-xl border border-slate-800/50 flex flex-col gap-2 hover:border-slate-700 transition-all duration-300 group cursor-default`}>
                  <item.icon size={20} className={`text-${item.color}-500 group-hover:scale-110 transition-transform`} />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.title}</span>
                  <span className="text-sm font-semibold text-slate-300">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : status === 'processing' ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-10 max-w-2xl mx-auto text-center">
            <div className="relative">
              {/* Outer glow rings */}
              <div className="absolute inset-0 w-40 h-40 border-2 border-blue-500/10 rounded-full animate-ping" style={{ animationDuration: '2s' }} />
              <div className="absolute inset-0 w-40 h-40 border-2 border-purple-500/10 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
              
              {/* Main spinner */}
              <div className="relative w-40 h-40">
                <div className="absolute inset-0 border-4 border-slate-800 rounded-full" />
                <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 border-r-purple-500 rounded-full animate-spin" />
                <div className="absolute inset-3 border-4 border-transparent border-b-indigo-500 border-l-cyan-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
                
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500 rounded-xl blur-xl opacity-50 animate-pulse" />
                    <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 p-4 rounded-xl">
                      <Shield size={32} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6 w-full">
              <div>
                <h2 className="text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Analyzing Intelligence...</h2>
                <p className="text-slate-500 mt-2">Running deep analysis on content</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm font-mono text-blue-400 justify-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                  <span>Initializing Multilingual Vector Map...</span>
                </div>
                
                <div className="relative w-full bg-slate-800/50 rounded-full h-3 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 animate-progress origin-left" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-6">
                  {['Sentiment Extraction', 'RAG News Alignment', 'Virality Scoring', 'Claim Verification'].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg border border-slate-700/30">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-lg shadow-blue-500/50" style={{ animationDelay: `${i * 0.2}s` }} />
                      <span className="text-xs uppercase font-semibold text-slate-400">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : result ? (
          <div className="space-y-8 pb-12">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-r from-slate-900/80 via-slate-800/50 to-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500 rounded-xl blur-lg opacity-30" />
                  <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-600 p-3 rounded-xl">
                    <Shield size={24} className="text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">Analysis Complete</h2>
                  <p className="text-slate-400 text-sm">Target ID: <span className="font-mono text-blue-400">TRX-{Math.random().toString(36).substr(2, 9).toUpperCase()}</span> • {new Date().toLocaleString()}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={reset}
                  className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold border border-slate-700/50 transition-all duration-300 flex items-center gap-2 hover:scale-105"
                >
                  <History size={16} /> New Analysis
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/30 transition-all duration-300 flex items-center gap-2 hover:scale-105">
                  <Info size={16} /> Export Intel
                </button>
              </div>
            </header>

            <Dashboard result={result} />
          </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-10 bg-gradient-to-t from-slate-900/80 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 p-2 rounded-lg">
              <Shield size={18} className="text-blue-400" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-slate-300">Saaksh AI Intelligence Platform</span>
              <span className="text-xs text-slate-600 block">© 2026 All rights reserved</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4 text-xs font-medium text-slate-500">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Documentation</a>
            </div>
            <div className="h-4 w-px bg-slate-800" />
            <p className="text-xs text-slate-500 font-medium text-center md:text-right">
              Powered by <span className="text-blue-400">XLM-RoBERTa</span> & <span className="text-purple-400">Gemini Pro</span>
            </p>
          </div>
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
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};

export default App;
