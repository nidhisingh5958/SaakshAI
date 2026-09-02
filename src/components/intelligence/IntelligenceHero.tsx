import React from 'react';
import { IntelligenceVisualization } from './IntelligenceVisualization';
import { Cpu, Terminal, ArrowDown } from 'lucide-react';

export const IntelligenceHero: React.FC = () => {
  return (
    <div className="space-y-12 sm:space-y-16">
      
      {/* Editorial Headline & Telemetry Signal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        
        {/* Left Column: Asymmetrical Display Title & Supporting Copy */}
        <div className="lg:col-span-7 space-y-6 sm:space-y-8">
          
          {/* System Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#5B8CFF]/10 border border-[#5B8CFF]/20 rounded-full text-[#5B8CFF] text-xs font-mono font-medium tracking-wider">
            <Cpu size={14} />
            <span>TRANSFORMER MULTILINGUAL ENGINE v2.4</span>
          </div>

          {/* Editorial Display Heading */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#F4F5F8] leading-[1.02]">
              MISINFORMATION
            </h1>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#5B8CFF] leading-[1.02]">
              INTELLIGENCE
            </h2>
            <h3 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#8992A7] leading-[1.05]">
              ENGINE
            </h3>
          </div>

          {/* Authoritative Analytical Copy */}
          <p className="text-base sm:text-xl text-[#8992A7] leading-relaxed max-w-xl font-normal">
            Automated deep-learning evaluation platform for multilingual statements, media articles, and viral content. Detect linguistic manipulation, emotion bias, fact claims, and narrative threat scores in seconds.
          </p>

          {/* Direct CTA anchor indicator */}
          <div className="pt-2 flex items-center gap-3 text-xs font-mono text-[#5F687C] uppercase tracking-wider">
            <ArrowDown size={14} className="text-[#5B8CFF] animate-bounce" />
            <span>PASTE STATEMENT BELOW TO BEGIN INVESTIGATION</span>
          </div>
        </div>

        {/* Right Column: Visual System Telemetry Grid */}
        <div className="lg:col-span-5 w-full">
          <IntelligenceVisualization />
        </div>

      </div>

    </div>
  );
};
