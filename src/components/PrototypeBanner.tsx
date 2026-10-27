import React, { useState } from 'react';
import { Info, HelpCircle, X } from 'lucide-react';

interface PrototypeBannerProps {
  onOpenGuide: () => void;
}

export const PrototypeBanner: React.FC<PrototypeBannerProps> = ({ onOpenGuide }) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <aside aria-label="Prototype demo status" className="bg-slate-900 text-white text-xs py-2 px-4 border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong className="text-white font-semibold">CampusConnect Prototype:</strong> All student networking features (requests, study buddy groups, skill swaps, discussions) run reactively in memory.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenGuide}
            className="text-blue-300 hover:text-white font-semibold underline flex items-center gap-1 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>How to run & test guide</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss banner"
            className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
