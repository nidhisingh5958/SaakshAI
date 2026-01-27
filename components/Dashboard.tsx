
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

const ScoreCard: React.FC<{ title: string; score: number; icon: React.ReactNode; color: string }> = ({ title, score, icon, color }) => (
  <div className="bg-slate-800/50 border border-slate-700 p-5 rounded-xl flex flex-col items-center justify-center transition-all hover:bg-slate-800">
    <div className={`p-3 rounded-full ${color} mb-3`}>
      {icon}
    </div>
    <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</span>
    <span className="text-3xl font-bold mt-1">{Math.round(score)}%</span>
    <div className="w-full h-1.5 bg-slate-700 rounded-full mt-4 overflow-hidden">
      <div 
        className={`h-full transition-all duration-1000 ${color.replace('bg-', 'bg-')}`} 
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
    low: 'text-green-400 bg-green-400/10 border-green-400/20',
    medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    high: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
    critical: 'text-red-400 bg-red-400/10 border-red-400/20',
  }[result.threatLevel];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ScoreCard 
          title="Credibility" 
          score={result.credibilityScore} 
          icon={<ShieldCheck size={24} />} 
          color="bg-emerald-500" 
        />
        <ScoreCard 
          title="Fake Risk" 
          score={result.fakeRiskScore} 
          icon={<AlertTriangle size={24} />} 
          color="bg-rose-500" 
        />
        <ScoreCard 
          title="Virality Risk" 
          score={result.viralityRisk.score} 
          icon={<TrendingUp size={24} />} 
          color="bg-indigo-500" 
        />
        <div className={`border p-5 rounded-xl flex flex-col items-center justify-center ${threatColor}`}>
          <Activity size={32} className="mb-2" />
          <span className="text-sm font-medium uppercase tracking-wider opacity-80">Threat Level</span>
          <span className="text-2xl font-black uppercase mt-1">{result.threatLevel}</span>
          <span className="text-xs mt-3 text-center opacity-70 leading-tight">Detected Language: <span className="font-bold">{result.language.toUpperCase()}</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Highlighted Content & Claims */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MessageSquare size={20} className="text-blue-400" />
              Intelligence Analysis & Highlighted Text
            </h3>
            <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 leading-relaxed text-lg">
              {result.highlightedText.map((part, i) => (
                <span 
                  key={i} 
                  className={`px-1 rounded cursor-help transition-colors ${
                    part.type === 'suspicious' ? 'bg-rose-900/40 text-rose-200 border-b-2 border-rose-500' :
                    part.type === 'verified' ? 'bg-emerald-900/40 text-emerald-200 border-b-2 border-emerald-500' :
                    ''
                  }`}
                  title={part.tooltip}
                >
                  {part.text}
                </span>
              ))}
            </div>
            <p className="text-sm text-slate-400 mt-4 italic">Hover over highlighted segments to see detailed intelligence notes.</p>
          </section>

          <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-400" />
              Fact Check & Claim Breakdown
            </h3>
            <div className="space-y-4">
              {result.claims.map((claim, i) => (
                <div key={i} className="flex gap-4 p-4 bg-slate-900/40 rounded-lg border border-slate-800">
                  <div className="mt-1">
                    {claim.verdict === 'verified' && <CheckCircle2 className="text-emerald-500" />}
                    {claim.verdict === 'refuted' && <XCircle className="text-rose-500" />}
                    {claim.verdict === 'unverified' && <HelpCircle className="text-slate-500" />}
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-100">{claim.claim}</h4>
                    <p className="text-sm text-slate-400 mt-1">{claim.explanation}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="h-1 w-24 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${claim.sourceRelevance}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Source Relevance: {claim.sourceRelevance}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right: Charts & Risks */}
        <div className="space-y-6">
          <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Emotional Manipulation Profile</h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={emotionalData}>
                  <PolarGrid stroke="#334155" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Radar
                    name="Intensity"
                    dataKey="A"
                    stroke="#6366f1"
                    fill="#6366f1"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <TrendingUp size={20} className="text-indigo-400" />
              Virality & Impact
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                <span className="text-xs uppercase text-indigo-400 font-bold block mb-1">Impact Forecast</span>
                <p className="text-sm text-indigo-100">{result.viralityRisk.potentialImpact}</p>
              </div>
              <div>
                <span className="text-xs uppercase text-slate-400 font-bold block mb-2">Spread Triggers</span>
                <div className="flex flex-wrap gap-2">
                  {result.viralityRisk.triggers.map((t, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-slate-700 text-slate-300 rounded-full">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle size={20} className="text-orange-400" />
              Linguistic Risks
            </h3>
            <div className="space-y-3">
              {result.linguisticRisks.map((risk, i) => (
                <div key={i} className="group cursor-help relative">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-medium text-slate-300 capitalize">{risk.type.replace('-', ' ')}</span>
                    <span className="text-xs font-bold text-slate-500">{risk.severity}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-orange-500 transition-all duration-500" 
                      style={{ width: `${risk.severity}%` }}
                    />
                  </div>
                  <div className="hidden group-hover:block absolute z-20 top-full left-0 right-0 mt-2 p-3 bg-slate-900 border border-slate-700 rounded shadow-xl text-xs text-slate-400">
                    {risk.description}
                    <div className="mt-2 text-orange-300">Phrases: "{risk.foundPhrases.join('", "')}"</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer / Sources */}
      <section className="bg-slate-800/40 border border-slate-700 rounded-xl p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe size={20} className="text-cyan-400" />
          News RAG Verification (Trusted Sources)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Simulated Topic Relevance</span>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-black text-cyan-400">{result.newsRelevance.topicMatch}%</span>
              <p className="text-sm text-slate-300 leading-tight">Match with high-credibility news stream (Reuters, AP, BBC, etc.)</p>
            </div>
            <div className="mt-4">
              <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Associated Outlets</span>
              <div className="flex flex-wrap gap-3">
                {result.newsRelevance.topTrustedSources.map((s, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Verified Consensus Summary</span>
            <p className="text-sm text-slate-300 leading-relaxed">{result.newsRelevance.summaryOfVerifiedFacts}</p>
          </div>
        </div>
      </section>
    </div>
  );
};
