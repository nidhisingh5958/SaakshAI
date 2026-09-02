import React from 'react';
import { IntelligenceVisualization } from './IntelligenceVisualization';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export const IntelligenceHero: React.FC = () => {
  const scrollToWorkspace = () => {
    const el = document.getElementById('investigation-workspace');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-20 py-6 sm:py-10">
      
      {/* Full-Width Editorial Masthead Hero */}
      <div className="space-y-8 border-b border-[#D8D1C4] pb-16">
        <div className="flex items-center gap-3 text-xs font-mono text-[#8C877C] uppercase tracking-wider">
          <span>INTELLIGENCE / 01</span>
          <span>—</span>
          <span>INVESTIGATIVE RESEARCH DESK</span>
        </div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-serif font-extrabold text-[#11110F] leading-[0.98] tracking-tight">
          Information <br />
          moves fast. <br />
          <span className="italic font-normal text-[#2E7D50]">We look closer.</span>
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end pt-4">
          <p className="md:col-span-8 text-lg sm:text-xl text-[#625E55] leading-relaxed font-sans max-w-2xl">
            SaakshAI investigates claims, sources, language and narratives across the information people share.
          </p>

          <div className="md:col-span-4 flex items-center gap-4 flex-wrap">
            <Button onClick={scrollToWorkspace} variant="primary" size="lg" icon={<ArrowRight size={16} />}>
              Investigate a claim
            </Button>
          </div>
        </div>
      </div>

      {/* Section 01: The Information Problem */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 border-b border-[#D8D1C4] items-start">
        <div className="md:col-span-4 text-xs font-mono text-[#8C877C] uppercase tracking-wider">
          01 / THE INFORMATION PROBLEM
        </div>

        <div className="md:col-span-8 space-y-6">
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#11110F] leading-tight">
            A claim can be true and still tell the wrong story.
          </h2>

          <p className="text-base sm:text-lg text-[#625E55] leading-relaxed">
            Misinformation is rarely pure fiction. It spreads through selective framing, omitted context, urgent emotional triggers, and coordinated narrative amplification across social channels.
          </p>
        </div>
      </div>

      {/* Section 02: How We Investigate (Methodology Rows) */}
      <div className="space-y-8 py-10 border-b border-[#D8D1C4]">
        <div className="text-xs font-mono text-[#8C877C] uppercase tracking-wider">
          02 / HOW WE INVESTIGATE
        </div>

        <div className="divide-y divide-[#D8D1C4]">
          <div className="py-6 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
            <span className="md:col-span-2 font-mono text-xl font-bold text-[#2E7D50]">01 / CLAIM</span>
            <h3 className="md:col-span-4 text-xl font-bold text-[#11110F]">What exactly is being said?</h3>
            <p className="md:col-span-6 text-sm text-[#625E55] leading-relaxed">
              Isolate core statements and verify factual consistency against trusted news consensus.
            </p>
          </div>

          <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
            <span className="md:col-span-2 font-mono text-xl font-bold text-[#2E7D50]">02 / SOURCE</span>
            <h3 className="md:col-span-4 text-xl font-bold text-[#11110F]">Where did it come from?</h3>
            <p className="md:col-span-6 text-sm text-[#625E55] leading-relaxed">
              Trace original publication sources, author credibility ratings, and cross-reference citations.
            </p>
          </div>

          <div className="py-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
            <span className="md:col-span-2 font-mono text-xl font-bold text-[#2E7D50]">03 / LANGUAGE</span>
            <h3 className="md:col-span-4 text-xl font-bold text-[#11110F]">How is it being framed?</h3>
            <p className="md:col-span-6 text-sm text-[#625E55] leading-relaxed">
              Detect emotional manipulation, urgency phrasing, sensationalism, and biased linguistic patterns.
            </p>
          </div>

          <div className="py-6 last:pb-0 grid grid-cols-1 md:grid-cols-12 gap-4 items-baseline">
            <span className="md:col-span-2 font-mono text-xl font-bold text-[#2E7D50]">04 / NARRATIVE</span>
            <h3 className="md:col-span-4 text-xl font-bold text-[#11110F]">How is it spreading?</h3>
            <p className="md:col-span-6 text-sm text-[#625E55] leading-relaxed">
              Track virality indicators and emerging narrative clusters across Reddit and YouTube communities.
            </p>
          </div>
        </div>
      </div>

      {/* Section 03: Signature Visual Language — Example Investigation */}
      <div className="space-y-4 py-6">
        <div className="text-xs font-mono text-[#8C877C] uppercase tracking-wider">
          03 / SIGNATURE EVIDENCE MARKUP
        </div>
        <IntelligenceVisualization />
      </div>

    </div>
  );
};
