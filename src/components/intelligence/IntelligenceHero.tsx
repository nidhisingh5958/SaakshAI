import React from 'react';
import { IntelligenceVisualization } from './IntelligenceVisualization';

export const IntelligenceHero: React.FC = () => {
  return (
    <div className="space-y-16 py-4 sm:py-8">
      
      {/* Editorial Hero Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        
        {/* Left Column: Expressive Serif Headline & Intro */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EED4AC]/50 border border-[#B19C7A]/40 text-[#5A4434] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2EA334]" />
            <span>Fact-checking & narrative research</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#0D0B09] leading-[1.08] tracking-tight">
            Read between <br className="hidden sm:inline" />
            the <span className="italic font-normal text-[#2EA334]">claims.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5A4434] leading-relaxed max-w-xl font-sans">
            SaakshAI examines claims, language, emotional manipulation, and narrative patterns to help you understand whether information deserves your trust.
          </p>
        </div>

        {/* Right Column: Asymmetrical Evidence Composition */}
        <div className="lg:col-span-5">
          <IntelligenceVisualization />
        </div>

      </div>

      {/* Storytelling Problem Statement Section */}
      <div className="bg-[#181614] text-[#F4EBDD] rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-mono text-[#B19C7A] uppercase tracking-wider">
            THE INFORMATION CHALLENGE
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-bold leading-tight">
            Information moves fast. Context doesn't.
          </h2>
          <p className="text-sm sm:text-base text-[#B9A78D] leading-relaxed">
            SaakshAI helps you slow down long enough to understand what a claim actually says, where it comes from, and how it is being framed across digital channels.
          </p>
        </div>

        {/* 3 Core Capabilities */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10 text-xs">
          <div className="space-y-2">
            <span className="text-sm font-mono text-[#2EA334] font-bold">01</span>
            <h4 className="text-sm font-bold text-[#FFFDF9]">VERIFY THE CLAIM</h4>
            <p className="text-[#B9A78D] leading-relaxed">
              Check claims against trusted news sources and verified factual consensus.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-mono text-[#2EA334] font-bold">02</span>
            <h4 className="text-sm font-bold text-[#FFFDF9]">READ THE LANGUAGE</h4>
            <p className="text-[#B9A78D] leading-relaxed">
              Detect urgency, manipulation, emotional framing, and suspicious phrasing.
            </p>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-mono text-[#2EA334] font-bold">03</span>
            <h4 className="text-sm font-bold text-[#FFFDF9]">UNDERSTAND THE NARRATIVE</h4>
            <p className="text-[#B9A78D] leading-relaxed">
              Identify virality patterns and emerging narrative clusters across Reddit and YouTube.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
