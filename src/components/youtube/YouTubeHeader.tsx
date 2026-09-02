import React from 'react';

export const YouTubeHeader: React.FC = () => {
  return (
    <div className="space-y-2 pb-6 border-b border-[#D8D1C4]">
      <div className="text-xs font-mono text-[#8C877C] uppercase tracking-wider">
        MEDIA RESEARCH DESK
      </div>

      <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight text-[#11110F]">
        YouTube monitoring
      </h1>

      <p className="text-base text-[#625E55] max-w-2xl leading-relaxed font-sans">
        Track video narratives, credibility signals, manipulation patterns, and audience reactions.
      </p>
    </div>
  );
};
