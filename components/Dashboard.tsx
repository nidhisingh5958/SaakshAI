import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from 'recharts';
import { AnalysisResult } from '../types';
import { 
  Shield, AlertTriangle, Activity, Globe, MessageSquare, 
  TrendingUp, FileText, ArrowLeft
} from 'lucide-react';
import { RiskIndicator } from '../src/components/ui/RiskIndicator';
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
    <div className="space-y-8 animate-fade-in text-[#11110F]">
      
      {/* Report Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Main Research Content Column */}
        <div className="lg:col-span-9 space-y-8">
          
          {/* Section 01: Overall Assessment */}
          <section id="sec-01" className="bg-[#FFFDF8] border border-[#D8D1C4] p-6 sm:p-10 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D8D1C4] pb-4 font-mono text-xs text-[#625E55]">
              <div className="flex items-center gap-2">
                <Shield size={14} className="text-[#2E7D50]" />
                <span className="font-bold text-[#11110F] uppercase">01 / OVERALL ASSESSMENT</span>
              </div>
              <div className="flex items-center gap-2">
                <span>LANGUAGE:</span>
                <span className="font-bold uppercase text-[#11110F] bg-[#F5F1E8] px-2 py-0.5 border border-[#D8D1C4]">
                  {result.language}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Primary Score Focal Point */}
              <div className="md:col-span-5 p-6 bg-[#F5F1E8] border border-[#D8D1C4] flex flex-col items-center justify-center text-center space-y-2">
                <span className="text-xs font-mono text-[#625E55] uppercase">
                  MISINFORMATION RISK
                </span>
                <div className="flex items-baseline gap-1">
                  <span className={`text-6xl font-extrabold font-mono ${
                    result.fakeRiskScore >= 70 ? 'text-[#A83F3F]' :
                    result.fakeRiskScore >= 40 ? 'text-[#B0783C]' : 'text-[#2E7D50]'
                  }`}>
                    {Math.round(result.fakeRiskScore)}
                  </span>
                  <span className="text-xl text-[#625E55] font-mono">%</span>
                </div>
                <div className="pt-1">
                  <RiskIndicator level={getThreatRiskLevel(result.threatLevel)} label={`Threat: ${result.threatLevel}`} />
                </div>
              </div>

              {/* Assessment Narrative Summary */}
              <div className="md:col-span-7 space-y-3">
                <h3 className="text-2xl font-serif font-bold text-[#11110F]">
                  {result.fakeRiskScore >= 70 ? 'High misinformation risk detected' :
                   result.fakeRiskScore >= 40 ? 'Moderate credibility warnings identified' :
                   'High credibility statement verified'}
                </h3>
                <p className="text-sm text-[#625E55] leading-relaxed font-sans">
                  Target content analyzed across multilingual transformer vectors, linguistic indicators, claim verification databases, and viral propagation models. 
                  {result.fakeRiskScore >= 70 
                    ? ' Strong indicators of sensationalism and unsubstantiated claims detected.'
                    : ' Statement aligns closely with verified news facts and low manipulation patterns.'}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-[#8C877C] pt-1">
                  <span>Credibility: <strong className="text-[#11110F]">{Math.round(result.credibilityScore)}%</strong></span>
                  <span>•</span>
                  <span>Virality: <strong className="text-[#11110F]">{Math.round(result.viralityRisk.score)}%</strong></span>
                </div>
              </div>

            </div>
          </section>

          {/* Section 02: Risk Profile */}
          <section id="sec-02" className="bg-[#FFFDF8] border border-[#D8D1C4] p-6 sm:p-10 space-y-6 shadow-xs">
            <div className="border-b border-[#D8D1C4] pb-4 font-mono text-xs text-[#625E55]">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[#2E7D50]" />
                <span className="font-bold text-[#11110F] uppercase">02 / RISK PROFILE & SIGNAL SPECTRUM</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Signal Bar: Credibility */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#625E55]">Credibility score</span>
                  <span className="text-[#2E7D50] font-bold">{Math.round(result.credibilityScore)}%</span>
                </div>
                <div className="w-full bg-[#F5F1E8] h-2 rounded overflow-hidden">
                  <div className="h-full bg-[#2E7D50] transition-all duration-500" style={{ width: `${result.credibilityScore}%` }} />
                </div>
              </div>

              {/* Signal Bar: Fake Risk */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#625E55]">Misinformation risk</span>
                  <span className="text-[#A83F3F] font-bold">{Math.round(result.fakeRiskScore)}%</span>
                </div>
                <div className="w-full bg-[#F5F1E8] h-2 rounded overflow-hidden">
                  <div className="h-full bg-[#A83F3F] transition-all duration-500" style={{ width: `${result.fakeRiskScore}%` }} />
                </div>
              </div>

              {/* Signal Bar: Virality Risk */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#625E55]">Virality risk</span>
                  <span className="text-[#B0783C] font-bold">{Math.round(result.viralityRisk.score)}%</span>
                </div>
                <div className="w-full bg-[#F5F1E8] h-2 rounded overflow-hidden">
                  <div className="h-full bg-[#B0783C] transition-all duration-500" style={{ width: `${result.viralityRisk.score}%` }} />
                </div>
              </div>

              {/* Signal Bar: Threat Level */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-[#625E55]">Threat level ({result.threatLevel})</span>
                  <span className="text-[#2E7D50] font-bold">{threatNumeric}%</span>
                </div>
                <div className="w-full bg-[#F5F1E8] h-2 rounded overflow-hidden">
                  <div className="h-full bg-[#2E7D50] transition-all duration-500" style={{ width: `${threatNumeric}%` }} />
                </div>
              </div>
            </div>

            {/* Virality Impact Box */}
            <div className="p-5 bg-[#F5F1E8] border border-[#D8D1C4] space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#2E7D50]">
                <TrendingUp size={14} />
                <span>Virality impact & triggers</span>
              </div>
              <p className="text-xs text-[#625E55] leading-relaxed font-sans">
                {result.viralityRisk.potentialImpact}
              </p>
              {result.viralityRisk.triggers.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {result.viralityRisk.triggers.map((trigger, i) => (
                    <span key={i} className="text-[11px] font-mono px-2 py-0.5 bg-[#FFFDF8] border border-[#D8D1C4] text-[#625E55]">
                      #{trigger}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Section 03: Content Evidence & Highlighted Text */}
          <section id="sec-03" className="bg-[#FFFDF8] border border-[#D8D1C4] p-6 sm:p-10 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-[#D8D1C4] pb-4 font-mono text-xs text-[#625E55]">
              <div className="flex items-center gap-2">
                <MessageSquare size={14} className="text-[#2E7D50]" />
                <span className="font-bold text-[#11110F] uppercase">03 / CONTENT EVIDENCE & ANNOTATED TEXT</span>
              </div>
              <span className="text-xs text-[#8C877C]">Hover text for annotation</span>
            </div>

            <div className="bg-[#F5F1E8] p-6 sm:p-8 border border-[#D8D1C4] leading-relaxed text-base sm:text-lg font-serif">
              {result.highlightedText.map((part, i) => (
                <span 
                  key={i} 
                  className={`px-1 py-0.5 transition-colors ${
                    part.type === 'suspicious' 
                      ? 'bg-[#A83F3F]/15 text-[#11110F] border-b-2 border-[#A83F3F] hover:bg-[#A83F3F]/25 cursor-help' :
                    part.type === 'verified' 
                      ? 'bg-[#2E7D50]/15 text-[#11110F] border-b-2 border-[#2E7D50] hover:bg-[#2E7D50]/25 cursor-help' :
                    'text-[#11110F]'
                  }`}
                  title={part.tooltip}
                >
                  {part.text}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-6 text-xs font-mono text-[#625E55]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#A83F3F]/20 border-b-2 border-[#A83F3F]" />
                <span>Suspicious segment</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-[#2E7D50]/20 border-b-2 border-[#2E7D50]" />
                <span>Verified segment</span>
              </div>
            </div>
          </section>

          {/* Section 04: Fact Check & Claim Breakdown */}
          <section id="sec-04" className="bg-[#FFFDF8] border border-[#D8D1C4] p-6 sm:p-10 space-y-6 shadow-xs">
            <div className="border-b border-[#D8D1C4] pb-4 font-mono text-xs text-[#625E55]">
              <div className="flex items-center gap-2">
                <FileText size={14} className="text-[#2E7D50]" />
                <span className="font-bold text-[#11110F] uppercase">04 / FACT CHECK & CLAIM BREAKDOWN ({result.claims.length})</span>
              </div>
            </div>

            <div className="space-y-4">
              {result.claims.map((claim, i) => (
                <div key={i} className="p-5 sm:p-6 bg-[#F5F1E8] border border-[#D8D1C4] space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-mono text-[#625E55] uppercase block">
                        CLAIM 0{i + 1}
                      </span>
                      <h4 className="text-lg font-serif font-bold text-[#11110F]">
                        "{claim.claim}"
                      </h4>
                    </div>
                    <RiskIndicator 
                      level={claim.verdict === 'verified' ? 'verified' : claim.verdict === 'refuted' ? 'highRisk' : 'suspicious'} 
                      label={claim.verdict.toUpperCase()} 
                    />
                  </div>

                  <p className="text-xs text-[#625E55] leading-relaxed font-sans">
                    {claim.explanation}
                  </p>

                  <div className="flex items-center gap-3 pt-2 border-t border-[#D8D1C4] text-xs font-mono text-[#625E55]">
                    <span>Source relevance:</span>
                    <div className="flex-1 max-w-xs bg-[#FFFDF8] h-2 overflow-hidden border border-[#D8D1C4]">
                      <div className="h-full bg-[#2E7D50]" style={{ width: `${claim.sourceRelevance}%` }} />
                    </div>
                    <span className="text-[#2E7D50] font-bold">{claim.sourceRelevance}%</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 05: Linguistic Manipulation Signals */}
          <section id="sec-05" className="bg-[#FFFDF8] border border-[#D8D1C4] p-6 sm:p-10 space-y-6 shadow-xs">
            <div className="border-b border-[#D8D1C4] pb-4 font-mono text-xs text-[#625E55]">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-[#2E7D50]" />
                <span className="font-bold text-[#11110F] uppercase">05 / LINGUISTIC MANIPULATION SIGNALS ({result.linguisticRisks.length})</span>
              </div>
            </div>

            <div className="space-y-4">
              {result.linguisticRisks.map((risk, i) => (
                <div key={i} className="p-5 bg-[#F5F1E8] border border-[#D8D1C4] space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#11110F] capitalize font-sans text-sm">
                      {risk.type.replace(/-/g, ' ')}
                    </span>
                    <span className={`font-mono font-bold ${
                      risk.severity > 70 ? 'text-[#A83F3F]' :
                      risk.severity > 40 ? 'text-[#B0783C]' : 'text-[#2E7D50]'
                    }`}>
                      Severity {risk.severity}%
                    </span>
                  </div>

                  <p className="text-[#625E55] leading-relaxed font-sans">
                    {risk.description}
                  </p>

                  {risk.foundPhrases.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                      {risk.foundPhrases.map((phrase, pidx) => (
                        <span key={pidx} className="px-2 py-0.5 bg-[#B0783C]/15 text-[#625E55]">
                          "{phrase}"
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Section 06: Emotional Profile */}
          <section id="sec-06" className="bg-[#FFFDF8] border border-[#D8D1C4] p-6 sm:p-10 space-y-6 shadow-xs">
            <div className="border-b border-[#D8D1C4] pb-4 font-mono text-xs text-[#625E55]">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-[#2E7D50]" />
                <span className="font-bold text-[#11110F] uppercase">06 / EMOTIONAL MANIPULATION SPECTRUM</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-7 h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={emotionalData}>
                    <PolarGrid stroke="#D8D1C4" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#625E55', fontSize: 11 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: '#8C877C', fontSize: 9 }} />
                    <Radar
                      name="Intensity"
                      dataKey="A"
                      stroke="#2E7D50"
                      fill="#2E7D50"
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="md:col-span-5 space-y-3 text-xs">
                <h4 className="text-lg font-serif font-bold text-[#11110F]">Emotional tone analysis</h4>
                <p className="text-[#625E55] leading-relaxed font-sans">
                  Evaluates emotional triggering patterns across Anger, Fear, Urgency, Joy, and Neutrality.
                </p>
                <div className="space-y-1.5 pt-2 font-mono text-[#625E55]">
                  <div className="flex justify-between">
                    <span>Anger signal</span>
                    <span className="font-bold text-[#11110F]">{result.emotionalTone.anger}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fear signal</span>
                    <span className="font-bold text-[#11110F]">{result.emotionalTone.fear}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Urgency signal</span>
                    <span className="font-bold text-[#11110F]">{result.emotionalTone.urgency}%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 07: News RAG Verification */}
          <section id="sec-07" className="bg-[#FFFDF8] border border-[#D8D1C4] p-6 sm:p-10 space-y-6 shadow-xs">
            <div className="border-b border-[#D8D1C4] pb-4 font-mono text-xs text-[#625E55]">
              <div className="flex items-center gap-2">
                <Globe size={14} className="text-[#2E7D50]" />
                <span className="font-bold text-[#11110F] uppercase">07 / NEWS RAG VERIFICATION & CONSENSUS</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
              <div className="md:col-span-5 p-5 bg-[#F5F1E8] border border-[#D8D1C4] space-y-3">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-[#625E55]">Topic relevance match</span>
                  <span className="font-bold text-[#2E7D50] text-sm">{result.newsRelevance.topicMatch}%</span>
                </div>
                <div className="w-full bg-[#FFFDF8] h-2 overflow-hidden border border-[#D8D1C4]">
                  <div className="h-full bg-[#2E7D50]" style={{ width: `${result.newsRelevance.topicMatch}%` }} />
                </div>
                <div className="space-y-2 pt-1">
                  <span className="font-mono text-[#625E55] block">Associated sources</span>
                  <div className="flex flex-wrap gap-1.5">
                    {result.newsRelevance.topTrustedSources.map((s, i) => (
                      <span key={i} className="font-mono px-2 py-0.5 bg-[#FFFDF8] border border-[#D8D1C4] text-[#2E7D50]">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 p-5 bg-[#F5F1E8] border border-[#D8D1C4] space-y-2">
                <span className="font-mono text-[#625E55] block uppercase text-[11px]">VERIFIED FACT CONSENSUS</span>
                <p className="text-[#11110F] leading-relaxed font-sans text-sm">
                  {result.newsRelevance.summaryOfVerifiedFacts}
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Desktop Report Index Sidebar */}
        <div className="hidden lg:block lg:col-span-3 sticky top-24 space-y-4">
          <div className="bg-[#FFFDF8] border border-[#D8D1C4] p-6 space-y-4 shadow-xs">
            <span className="text-xs font-mono text-[#625E55] uppercase tracking-wider block border-b border-[#D8D1C4] pb-2">
              REPORT INDEX
            </span>
            <nav className="space-y-1.5 text-xs font-medium text-[#625E55]">
              {[
                { id: 'sec-01', label: '01 Overall assessment' },
                { id: 'sec-02', label: '02 Risk profile' },
                { id: 'sec-03', label: '03 Content evidence' },
                { id: 'sec-04', label: '04 Claim breakdown' },
                { id: 'sec-05', label: '05 Linguistic signals' },
                { id: 'sec-06', label: '06 Emotional profile' },
                { id: 'sec-07', label: '07 RAG evidence' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="w-full text-left py-1.5 px-2.5 rounded hover:text-[#11110F] hover:bg-[#F5F1E8] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {onReset && (
              <div className="pt-4 border-t border-[#D8D1C4]">
                <Button 
                  onClick={onReset}
                  variant="secondary"
                  size="sm"
                  icon={<ArrowLeft size={14} />}
                  className="w-full text-xs font-mono"
                >
                  New investigation
                </Button>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
