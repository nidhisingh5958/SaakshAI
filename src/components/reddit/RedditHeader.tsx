import React from 'react';
import { Radio } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';

export const RedditHeader: React.FC = () => {
  return (
    <div className="space-y-4">
      <SectionLabel icon={<Radio size={14} className="text-[#9B6DFF]" />}>
        REDDIT NARRATIVE TELEMETRY
      </SectionLabel>

      <div className="space-y-1">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F4F5F8] leading-[1.05]">
          REDDIT NARRATIVE
        </h1>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#9B6DFF] leading-[1.05]">
          INTELLIGENCE
        </h2>
      </div>

      <p className="text-base sm:text-lg text-[#8992A7] leading-relaxed max-w-2xl font-normal">
        Monitor discussions across subreddits, identify emerging manipulation campaigns, and evaluate misinformation risk across community posts and comment threads.
      </p>
    </div>
  );
};
