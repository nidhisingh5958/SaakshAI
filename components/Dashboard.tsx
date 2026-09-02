import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { AnalysisResult } from '../types';
import { 
  Shield, AlertTriangle, Activity, Globe, MessageSquare, 
  TrendingUp, CheckCircle2, XCircle, HelpCircle, FileText, ArrowLeft
} from 'lucide-react';
import { RiskIndicator } from '../src/components/ui/RiskIndicator';
import { SectionLabel } from '../src/components/ui/SectionLabel';
import { Button } from '../src/components/ui/Button';

interface Props {
  result: AnalysisResult;
  onReset?: () => void;
}

export const Dashboard: React.FC<Props> = ({ result, onReset }) => {
  const emotionalData = [
    { subject: 'Anger', A: result.emotionalTone.anger, fullMark: 100 },
    { subject: 'Fear', A: result.emotionalTone.fear, fullMark: 100 },
    { subject: 'Urgency', A: result.emotionalTone.urgency, fullMark: 100 },
    { subject: 'Neutral', A: result.emotionalTone.neutrality, fullMark: 100 },
    { subject: 'Joy', A: result.emotionalTone.joy, fullMark: 100 },
  ];

  const getThreatRiskLevel = (threat: string) => {
    switch (threat) {
      case 'critical':
      case 'high':
        return 'highRisk';
      case 'medium':
        return 'suspicious';
      default:
        return 'verified';
    }
  };

  const threatNumeric = {
    low: 25,
    medium: 50,
    high: 75,
    critical: 100,
  }[result.threatLevel];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 animate-fade-in text-[#F4F5F8]">
      
      {/* Report Quick Index Header & Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Intelligence Report Content Column */}
        <div className="lg:col-span-9 space-y-10">
          
          {/* Section 01: Overall Assessment */}
          <section id="sec-01" className="bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <SectionLabel icon={<Shield size={14} />}>
                01 OVERALL ASSESSMENT
              </SectionLabel>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#8992A7]">LANG:</span>
                <span className="text-xs font-mono text-[#F4F5F8] font-bold uppercase bg-white/5 px-2 py-0.5 rounded">
                  {result.language}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Primary Visual Score Focal Point */}
              <div className="md:col-span-5 p-6 bg-[#121827] border border-white/5 rounded-xl flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-xs font-mono text-[#8992A7] uppercase tracking-wider">
                  MISINFORMATION RISK
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-6xl font-extrabold font-mono ${
                    result.fakeRiskScore >= 70 ? 'text-[#FF5F6D]' :
                    result.fakeRiskScore >= 40 ? 'text-[#FFB84D]' : 'text-[#35D49A]'
                  }`}>
                    {Math.round(result.fakeRiskScore)}
                  </span>
                  <span className="text-xl text-[#8992A7] font-mono">%</span>
                </div>
                <div className="pt-2">
                  <RiskIndicator level={getThreatRiskLevel(result.threatLevel)} label={`THREAT: ${result.threatLevel.toUpperCase()}`} />
                </div>
              </div>

              {/* Assessment Narrative Summary */}
              <div className="md:col-span-7 space-y-4">
                <h3 className="text-xl font-bold text-[#F4F5F8]">
                  {result.fakeRiskScore >= 70 ? 'High Misinformation Threat Detected' :
                   result.fakeRiskScore >= 40 ? 'Moderate Credibility Warnings Identified' :
                   'High Credibility Statement Verified'}
                </h3>
                <p className="text-sm text-[#8992A7] leading-relaxed">
                  Target content analyzed across multilingual transformer vectors, linguistic indicators, claim verification databases, and viral propagation models. 
                  {result.fakeRiskScore >= 70 
                    ? ' Strong indicators of sensationalism and unsubstantiated claims detected.'
                    : ' Statement aligns closely with verified news facts and low manipulation patterns.'}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-[#5F687C] pt-2">
                  <span>CREDIBILITY: <strong className="text-[#F4F5F8]">{Math.round(result.credibilityScore)}%</strong></span>
                  <span>•</span>
                  <span>VIRALITY: <strong className="text-[#F4F5F8]">{Math.round(result.viralityRisk.score)}%</strong></span>
                </div>
              </div>

            </div>
          </section>

          {/* Section 02: Risk Profile */}
          <section id="sec-02" className="bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <SectionLabel icon={<Activity size={14} />}>
                02 RISK PROFILE & SIGNAL SPECTRUM
              </SectionLabel>
            </div>

            <div className="space-y-4">
              {/* Signal Bar: Credibility */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#8992A7]">CREDIBILITY SCORE</span>
                  <span className="text-[#35D49A] font-bold">{Math.round(result.credibilityScore)}%</span>
                </div>
                <div className="w-full bg-[#121827] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#35D49A] transition-all duration-700" style={{ width: `${result.credibilityScore}%` }} />
                </div>
              </div>

              {/* Signal Bar: Fake Risk */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#8992A7]">MISINFORMATION RISK</span>
                  <span className="text-[#FF5F6D] font-bold">{Math.round(result.fakeRiskScore)}%</span>
                </div>
                <div className="w-full bg-[#121827] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FF5F6D] transition-all duration-700" style={{ width: `${result.fakeRiskScore}%` }} />
                </div>
              </div>

              {/* Signal Bar: Virality Risk */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#8992A7]">VIRALITY RISK</span>
                  <span className="text-[#9B6DFF] font-bold">{Math.round(result.viralityRisk.score)}%</span>
                </div>
                <div className="w-full bg-[#121827] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#9B6DFF] transition-all duration-700" style={{ width: `${result.viralityRisk.score}%` }} />
                </div>
              </div>

              {/* Signal Bar: Threat Level */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#8992A7]">THREAT INTENSITY ({result.threatLevel.toUpperCase()})</span>
                  <span className="text-[#38D9FF] font-bold">{threatNumeric}%</span>
                </div>
                <div className="w-full bg-[#121827] h-2 rounded-full overflow-hidden">
                  <div className="h-full bg-[#38D9FF] transition-all duration-700" style={{ width: `${threatNumeric}%` }} />
                </div>
              </div>
            </div>

            {/* Virality Impact Box */}
            <div className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-[#9B6DFF]">
                <TrendingUp size={14} />
                <span className="uppercase tracking-wider">Virality Impact & Spread Triggers</span>
              </div>
              <p className="text-xs text-[#8992A7] leading-relaxed">
                {result.viralityRisk.potentialImpact}
              </p>
              {result.viralityRisk.triggers.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.viralityRisk.triggers.map((trigger, i) => (
                    <span key={i} className="text-[11px] font-mono px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[#8992A7]">
                      #{trigger}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Section 03: Content Evidence & Highlighted Text */}
          <section id="sec-03" className="bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <SectionLabel icon={<MessageSquare size={14} />}>
                03 CONTENT EVIDENCE & ANNOTATED TEXT
              </SectionLabel>
              <span className="text-xs font-mono text-[#5F687C]">HOVER ANNOTATION FOR TOOLTIP</span>
            </div>

            <div className="bg-[#121827] p-6 rounded-xl border border-white/5 leading-relaxed text-base sm:text-lg font-sans">
              {result.highlightedText.map((part, i) => (
                <span 
                  key={i} 
                  className={`px-1 py-0.5 rounded transition-colors ${
                    part.type === 'suspicious' 
                      ? 'bg-[#FF5F6D]/15 text-[#F4F5F8] border-b-2 border-[#FF5F6D] hover:bg-[#FF5F6D]/25 cursor-help' :
                    part.type === 'verified' 
                      ? 'bg-[#35D49A]/15 text-[#F4F5F8] border-b-2 border-[#35D49A] hover:bg-[#35D49A]/25 cursor-help' :
                    'text-[#F4F5F8]'
                  }`}
                  title={part.tooltip}
                >
                  {part.text}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 pt-2 text-xs font-mono text-[#8992A7]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#FF5F6D]/20 border-b-2 border-[#FF5F6D] rounded-sm" />
                <span>Suspicious Segment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#35D49A]/20 border-b-2 border-[#35D49A] rounded-sm" />
                <span>Verified Segment</span>
              </div>
            </div>
          </section>

          {/* Section 04: Fact Check & Claim Breakdown */}
          <section id="sec-04" className="bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <SectionLabel icon={<FileText size={14} />}>
                04 FACT CHECK & CLAIM BREAKDOWN ({result.claims.length})
              </SectionLabel>
            </div>

            <div className="space-y-4">
              {result.claims.map((claim, i) => (
                <div key={i} className="p-5 bg-[#121827] border border-white/5 rounded-xl space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-mono text-[#5F687C] uppercase tracking-wider block">
                        CLAIM 0{i + 1}
                      </span>
                      <h4 className="text-base font-semibold text-[#F4F5F8]">
                        "{claim.claim}"
                      </h4>
                    </div>
                    <RiskIndicator 
                      level={claim.verdict === 'verified' ? 'verified' : claim.verdict === 'refuted' ? 'highRisk' : 'suspicious'} 
                      label={claim.verdict.toUpperCase()} 
                    />
                  </div>

                  <p className="text-xs text-[#8992A7] leading-relaxed">
                    {claim.explanation}
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-white/5 text-xs font-mono">
                    <span className="text-[#5F687C]">SOURCE RELEVANCE:</span>
                    <div className="flex-1 max-w-xs bg-white/5 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#5B8CFF] rounded-full" style={{ width: `${claim.sourceRelevance}%` }} />
                    </div>
                    <span className="text-[#5B8CFF] font-bold">{claim.sourceRelevance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 05: Linguistic Manipulation Signals */}
          <section id="sec-05" className="bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <SectionLabel icon={<AlertTriangle size={14} />}>
                05 LINGUISTIC MANIPULATION SIGNALS ({result.linguisticRisks.length})
              </SectionLabel>
            </div>

            <div className="space-y-4">
              {result.linguisticRisks.map((risk, i) => (
                <div key={i} className="p-4 bg-[#121827] border border-white/5 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#F4F5F8] capitalize font-sans">
                      {risk.type.replace(/-/g, ' ')}
                    </span>
                    <span className={`text-xs font-mono font-bold ${
                      risk.severity > 70 ? 'text-[#FF5F6D]' :
                      risk.severity > 40 ? 'text-[#FFB84D]' : 'text-[#35D49A]'
                    }`}>
                      SEVERITY {risk.severity}%
                    </span>
                  </div>

                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${
                      risk.severity > 70 ? 'bg-[#FF5F6D]' :
                      risk.severity > 40 ? 'bg-[#FFB84D]' : 'bg-[#35D49A]'
                    }`} style={{ width: `${risk.severity}%` }} />
                  </div>

                  <p className="text-xs text-[#8992A7] leading-relaxed pt-1">
                    {risk.description}
                  </p>

                  {risk.foundPhrases.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="text-[11px] font-mono text-[#5F687C]">FOUND PHRASES:</span>
                      {risk.foundPhrases.map((phrase, pidx) => (
                        <span key={pidx} className="text-[11px] font-mono px-2 py-0.5 bg-[#FFB84D]/10 border border-[#FFB84D]/20 text-[#FFB84D] rounded">
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 06: Emotional Manipulation Profile */}
          <section id="sec-06" className="bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <SectionLabel icon={<Activity size={14} />}>
                06 EMOTIONAL MANIPULATION SPECTRUM
              </SectionLabel>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={emotionalData}>
                    <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#8992A7', fontSize: 11, fontFamily: 'JetBrains Mono' }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#5F687C', fontSize: 9 }} />
                    <Radar
                      name="Intensity"
                      dataKey="A"
                      stroke="#9B6DFF"
                      fill="#9B6DFF"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="md:col-span-5 space-y-3">
                <h4 className="text-base font-bold text-[#F4F5F8]">Emotional Tone Analysis</h4>
                <p className="text-xs text-[#8992A7] leading-relaxed">
                  Evaluates emotional triggering patterns across Anger, Fear, Urgency, Joy, and Neutrality. High emotional intensity often correlates with viral misinformation tactics.
                </p>
                <div className="space-y-2 pt-2 text-xs font-mono">
                  <div className="flex justify-between text-[#8992A7]">
                    <span>ANGER SIGNAL</span>
                    <span className="text-[#F4F5F8]">{result.emotionalTone.anger}%</span>
                  </div>
                  <div className="flex justify-between text-[#8992A7]">
                    <span>FEAR SIGNAL</span>
                    <span className="text-[#F4F5F8]">{result.emotionalTone.fear}%</span>
                  </div>
                  <div className="flex justify-between text-[#8992A7]">
                    <span>URGENCY SIGNAL</span>
                    <span className="text-[#F4F5F8]">{result.emotionalTone.urgency}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 07: News RAG Evidence & Sources */}
          <section id="sec-07" className="bg-[#0E1320] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="border-b border-white/5 pb-4">
              <SectionLabel icon={<Globe size={14} />}>
                07 NEWS RAG VERIFICATION & CONSENSUS
              </SectionLabel>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-5 p-5 bg-[#121827] border border-white/5 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#5F687C] uppercase">TOPIC RELEVANCE</span>
                  <span className="text-lg font-mono font-bold text-[#38D9FF]">{result.newsRelevance.topicMatch}%</span>
                </div>
                <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#38D9FF]" style={{ width: `${result.newsRelevance.topicMatch}%` }} />
                </div>
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-mono text-[#5F687C] uppercase block">ASSOCIATED SOURCES</span>
                  <div className="flex flex-wrap gap-2">
                    {result.newsRelevance.topTrustedSources.map((s, i) => (
                      <span key={i} className="text-xs font-mono px-2.5 py-1 bg-white/5 border border-white/10 rounded text-[#35D49A]">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 p-5 bg-[#121827] border border-white/5 rounded-xl space-y-2">
                <span className="text-xs font-mono text-[#5F687C] uppercase block">VERIFIED FACT CONSENSUS</span>
                <p className="text-sm text-[#8992A7] leading-relaxed">
                  {result.newsRelevance.summaryOfVerifiedFacts}
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Desktop Report Index Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6">
          <div className="bg-[#0E1320] border border-white/10 rounded-xl p-5 space-y-4">
            <span className="text-xs font-mono text-[#5F687C] uppercase tracking-wider block border-b border-white/5 pb-2">
              REPORT INDEX
            </span>
            <nav className="space-y-2 text-xs font-mono">
              {[
                { id: 'sec-01', label: '01 Assessment' },
                { id: 'sec-02', label: '02 Risk Profile' },
                { id: 'sec-03', label: '03 Content Evidence' },
                { id: 'sec-04', label: '04 Claim Breakdown' },
                { id: 'sec-05', label: '05 Linguistic Signals' },
                { id: 'sec-06', label: '06 Emotional Profile' },
                { id: 'sec-07', label: '07 RAG Evidence' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left py-1 px-2 rounded text-[#8992A7] hover:text-[#F4F5F8] hover:bg-white/5 transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {onReset && (
              <div className="pt-4 border-t border-white/5">
                <Button 
                  onClick={onReset}
                  variant="secondary"
                  size="sm"
                  icon={<ArrowLeft size={14} />}
                  className="w-full text-xs font-mono"
                >
                  NEW ANALYSIS
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
