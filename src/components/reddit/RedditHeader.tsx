import React from 'react';
import { Radio } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';

export const RedditHeader: React.FC = () => {
  return (
    <div className="space-y-2 pb-4 border-b border-[#E3D5C0]">
      <SectionLabel icon={<Radio size={14} className="text-[#2EA334]" />}>
        Community research
      </SectionLabel>

      <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight text-[#0D0B09]">
        Reddit conversations
      </h1>

      <p className="text-base text-[#5A4434] max-w-2xl leading-relaxed font-sans">
        Monitor discussions, identify emerging narratives, and evaluate misinformation risk across subreddits.
      </p>
    </div>
  );
};
