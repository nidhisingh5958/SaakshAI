import React from 'react';
import { Youtube } from 'lucide-react';
import { SectionLabel } from '../ui/SectionLabel';

export const YouTubeHeader: React.FC = () => {
  return (
    <div className="space-y-4">
      <SectionLabel icon={<Youtube size={14} className="text-[#FF5F6D]" />}>
        YOUTUBE VIDEO TELEMETRY
      </SectionLabel>

      <div className="space-y-1">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#F4F5F8] leading-[1.05]">
          YOUTUBE VIDEO
        </h1>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#FF5F6D] leading-[1.05]">
          INTELLIGENCE
        </h2>
      </div>

      <p className="text-base sm:text-lg text-[#8992A7] leading-relaxed max-w-2xl font-normal">
        Monitor video narratives, credibility signals, manipulation patterns, and emerging misinformation across YouTube content and audience comment streams.
      </p>
    </div>
  );
};
