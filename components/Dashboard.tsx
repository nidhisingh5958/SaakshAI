
import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell
} from 'recharts';
import { AnalysisResult } from '../types';
import { 
  ShieldCheck, AlertTriangle, Activity, Globe, MessageSquare, 
  TrendingUp, Info, CheckCircle2, XCircle, HelpCircle
} from 'lucide-react';

interface Props {
  result: AnalysisResult;
}

const ScoreCard: React.FC<{ title: string; score: number; icon: React.ReactNode; color: string; gradient: string }> = ({ title, score, icon, color, gradient }) => (
  <div className={`relative overflow-hidden bg-gradient-to-br ${gradient} border border-slate-700/50 p-6 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 hover:scale-[1.02] hover:border-slate-600 group cursor-default`}>
    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500" />
    <div className={`relative p-4 rounded-2xl ${color} mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
      {icon}
    </div>
    <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{title}</span>
    <div className="flex items-baseline gap-1 mt-2">
      <span className="text-4xl font-black">{Math.round(score)}</span>
      <span className="text-lg text-slate-500">%</span>
    </div>
    <div className="w-full h-2 bg-slate-800/50 rounded-full mt-4 overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ease-out ${color.replace('bg-', 'bg-').replace('/20', '')} rounded-full`} 
        style={{ width: `${score}%` }}
      />
    </div>
  </div>
);

export const Dashboard: React.FC<Props> = ({ result }) => {
  const emotionalData = [
    { subject: 'Anger', A: result.emotionalTone.anger, fullMark: 100 },
    { subject: 'Fear', A: result.emotionalTone.fear, fullMark: 100 },
    { subject: 'Urgency', A: result.emotionalTone.urgency, fullMark: 100 },
    { subject: 'Neutral', A: result.emotionalTone.neutrality, fullMark: 100 },
    { subject: 'Joy', A: result.emotionalTone.joy, fullMark: 100 },
  ];

  const threatColor = {
    low: 'text-green-400 bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-500/30',
    medium: 'text-yellow-400 bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-500/30',
    high: 'text-orange-400 bg-gradient-to-br from-orange-500/20 to-orange-600/10 border-orange-500/30',
    critical: 'text-red-400 bg-gradient-to-br from-red-500/20 to-red-600/10 border-red-500/30',
  }[result.threatLevel];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <ScoreCard 
          title="Credibility" 
          score={result.credibilityScore} 
          icon={<ShieldCheck size={28} className="text-white" />} 
          color="bg-emerald-500" 
          gradient="from-emerald-500/10 via-slate-800/50 to-slate-900/50"
        />
        <ScoreCard 
          title="Fake Risk" 
          score={result.fakeRiskScore} 
          icon={<AlertTriangle size={28} className="text-white" />} 
          color="bg-rose-500" 
          gradient="from-rose-500/10 via-slate-800/50 to-slate-900/50"
        />
        <ScoreCard 
          title="Virality Risk" 
          score={result.viralityRisk.score} 
          icon={<TrendingUp size={28} className="text-white" />} 
          color="bg-indigo-500" 
          gradient="from-indigo-500/10 via-slate-800/50 to-slate-900/50"
        />
        <div className={`relative overflow-hidden border p-6 rounded-2xl flex flex-col items-center justify-center ${threatColor} transition-all duration-300 hover:scale-[1.02] group cursor-default`}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute top-2 right-2 flex gap-1">
            {[...Array(result.threatLevel === 'critical' ? 4 : result.threatLevel === 'high' ? 3 : result.threatLevel === 'medium' ? 2 : 1)].map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full bg-current animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
            ))}
          </div>
          <Activity size={36} className="mb-3 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-wider opacity-70">Threat Level</span>
          <span className="text-3xl font-black uppercase mt-2">{result.threatLevel}</span>
          <div className="mt-4 px-3 py-1.5 bg-black/20 rounded-full">
            <span className="text-[10px] uppercase font-bold tracking-wide opacity-80">Lang: {result.language.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Highlighted Content & Claims */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <MessageSquare size={20} className="text-blue-400" />
              </div>
              <span>Intelligence Analysis & Highlighted Text</span>
            </h3>
            <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800/50 leading-relaxed text-lg">
              {result.highlightedText.map((part, i) => (
                <span 
                  key={i} 
                  className={`px-1.5 py-0.5 rounded cursor-help transition-all duration-200 ${
                    part.type === 'suspicious' ? 'bg-rose-900/40 text-rose-200 border-b-2 border-rose-500 hover:bg-rose-900/60' :
                    part.type === 'verified' ? 'bg-emerald-900/40 text-emerald-200 border-b-2 border-emerald-500 hover:bg-emerald-900/60' :
                    ''
                  }`}
                  title={part.tooltip}
                >
                  {part.text}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-800/50">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 bg-rose-500/40 border-b-2 border-rose-500 rounded" />
                <span>Suspicious</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 bg-emerald-500/40 border-b-2 border-emerald-500 rounded" />
                <span>Verified</span>
              </div>
              <span className="text-xs text-slate-600 ml-auto italic">Hover for details</span>
            </div>
          </section>

          <section className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
              <div className="p-2 bg-emerald-500/20 rounded-lg">
                <CheckCircle2 size={20} className="text-emerald-400" />
              </div>
              <span>Fact Check & Claim Breakdown</span>
            </h3>
            <div className="space-y-4">
              {result.claims.map((claim, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800/50 hover:border-slate-700 transition-all duration-300 group">
                  <div className="mt-1">
                    <div className={`p-2 rounded-lg ${
                      claim.verdict === 'verified' ? 'bg-emerald-500/20' :
                      claim.verdict === 'refuted' ? 'bg-rose-500/20' : 'bg-slate-700/50'
                    }`}>
                      {claim.verdict === 'verified' && <CheckCircle2 className="text-emerald-400" size={18} />}
                      {claim.verdict === 'refuted' && <XCircle className="text-rose-400" size={18} />}
                      {claim.verdict === 'unverified' && <HelpCircle className="text-slate-400" size={18} />}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-100 group-hover:text-white transition-colors">{claim.claim}</h4>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{claim.explanation}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${claim.sourceRelevance}%` }} />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{claim.sourceRelevance}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Charts & Risks */}
        <div className="space-y-6">
          <section className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 text-center">Emotional Manipulation Profile</h3>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={emotionalData}>
                  <PolarGrid stroke="#334155" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                  <Radar
                    name="Intensity"
                    dataKey="A"
                    stroke="#8b5cf6"
                    fill="url(#radarGradient)"
                    fillOpacity={0.7}
                    strokeWidth={2}
                  />
                  <defs>
                    <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#6366f1" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <TrendingUp size={18} className="text-indigo-400" />
              </div>
              <span>Virality & Impact</span>
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl">
                <span className="text-xs uppercase text-indigo-400 font-bold block mb-2">Impact Forecast</span>
                <p className="text-sm text-indigo-100 leading-relaxed">{result.viralityRisk.potentialImpact}</p>
              </div>
              <div>
                <span className="text-xs uppercase text-slate-400 font-bold block mb-3">Spread Triggers</span>
                <div className="flex flex-wrap gap-2">
                  {result.viralityRisk.triggers.map((t, i) => (
                    <span key={i} className="text-xs px-3 py-1.5 bg-slate-800/80 text-slate-300 rounded-full border border-slate-700/50 hover:border-indigo-500/30 hover:text-indigo-300 transition-all cursor-default">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
              <div className="p-2 bg-orange-500/20 rounded-lg">
                <AlertTriangle size={18} className="text-orange-400" />
              </div>
              <span>Linguistic Risks</span>
            </h3>
            <div className="space-y-4">
              {result.linguisticRisks.map((risk, i) => (
                <div key={i} className="group cursor-help relative">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-300 capitalize">{risk.type.replace('-', ' ')}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      risk.severity > 70 ? 'bg-red-500/20 text-red-400' :
                      risk.severity > 40 ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>{risk.severity}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        risk.severity > 70 ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                        risk.severity > 40 ? 'bg-gradient-to-r from-orange-500 to-amber-500' : 'bg-gradient-to-r from-yellow-500 to-lime-500'
                      }`}
                      style={{ width: `${risk.severity}%` }}
                    />
                  </div>
                  <div className="hidden group-hover:block absolute z-20 top-full left-0 right-0 mt-2 p-4 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-xs">
                    <p className="text-slate-400 leading-relaxed">{risk.description}</p>
                    <div className="mt-3 pt-3 border-t border-slate-800">
                      <span className="text-orange-300 font-medium">Phrases: </span>
                      <span className="text-slate-300">"{risk.foundPhrases.join('", "')}"</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer / Sources */}
      <section className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 shadow-xl">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">
            <Globe size={20} className="text-cyan-400" />
          </div>
          <span>News RAG Verification</span>
          <span className="ml-auto text-xs px-3 py-1 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">Trusted Sources</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
                  <circle 
                    cx="48" cy="48" r="40" 
                    stroke="url(#progressGradient)" 
                    strokeWidth="8" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeDasharray={`${result.newsRelevance.topicMatch * 2.51} 251`}
                    className="transition-all duration-1000"
                  />
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-black text-cyan-400">{result.newsRelevance.topicMatch}%</span>
                </div>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase block mb-1">Topic Relevance</span>
                <p className="text-sm text-slate-300 leading-relaxed">Match with high-credibility news stream</p>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-3">Associated Outlets</span>
              <div className="flex flex-wrap gap-3">
                {result.newsRelevance.topTrustedSources.map((s, i) => (
                  <span key={i} className="flex items-center gap-2 px-3 py-2 bg-slate-800/80 rounded-lg border border-slate-700/50 text-sm font-semibold text-slate-200 hover:border-emerald-500/30 transition-all">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-slate-900/70 p-5 rounded-xl border border-slate-800/50">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-3">Verified Consensus Summary</span>
            <p className="text-sm text-slate-300 leading-relaxed">{result.newsRelevance.summaryOfVerifiedFacts}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
