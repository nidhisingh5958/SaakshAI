import React from 'react';
import { Youtube } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';

export const YouTubeHeader: React.FC = () => {
  return (
    <div className="space-y-2 pb-4 border-b border-[#E3D5C0]">
      <SectionLabel icon={<Youtube size={14} className="text-[#2EA334]" />}>
        Media research
      </SectionLabel>

      <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#0D0B09]">
        YouTube monitoring
      </h1>

      <p className="text-base text-[#5A4434] max-w-2xl leading-relaxed font-sans">
        Track video narratives, credibility signals, manipulation patterns, and audience comment reactions.
      </p>
    </div>
  );
};
