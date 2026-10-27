import React from 'react';
import { X, CheckCircle2, Terminal, Users, BookOpen, Repeat, MessageSquare, ShieldCheck } from 'lucide-react';

interface TestingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tab: any) => void;
}

export const TestingGuideModal: React.FC<TestingGuideModalProps> = ({ isOpen, onClose, onNavigateTab }) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="guide-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h2 id="guide-modal-title" className="text-lg font-bold text-slate-900">
              CampusConnect · Project & Prototype Testing Guide
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              How to run this project and test all student networking features
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close test guide"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm text-slate-700">
          {/* Section 1: Running the Project */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <Terminal className="w-4 h-4 text-blue-600" />
              <span>1. How to Run the Project</span>
            </div>
            <p className="text-xs text-slate-600">
              This application is built with React 19, TypeScript, Vite, and Tailwind CSS.
            </p>
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs space-y-1">
              <p><span className="text-slate-500"># 1. Install dependencies</span></p>
              <p>npm install</p>
              <p><span className="text-slate-500"># 2. Run local development server (Port 3000)</span></p>
              <p>npm run dev</p>
              <p><span className="text-slate-500"># 3. Production build & type check</span></p>
              <p>npm run build</p>
            </div>
          </div>

          {/* Section 2: Interactive Prototype Testing Scenarios */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>2. Feature Testing Walkthrough</span>
            </div>
            <p className="text-xs text-slate-600">
              Every section has active event handlers, responsive states, and reactive mock data:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue-600" /> Connection Requests</span>
                  <button
                    onClick={() => { onClose(); onNavigateTab('requests'); }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Go to tab &rarr;
                  </button>
                </div>
                <p className="text-slate-600">
                  Open the <strong>Requests</strong> hub. Accept or decline incoming requests from Elena or Jordan. Accepted peers immediately appear in <strong>My Network</strong>.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5 text-indigo-600" /> Study Buddy Groups</span>
                  <button
                    onClick={() => { onClose(); onNavigateTab('study-buddy'); }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Go to tab &rarr;
                  </button>
                </div>
                <p className="text-slate-600">
                  Filter by subject (e.g. Computer Science, Chemistry). Click <strong>Join Group</strong> to increment member counts, or click <strong>Host a Study Group</strong> to post a new one.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5"><Repeat className="w-3.5 h-3.5 text-amber-600" /> Skill Exchange</span>
                  <button
                    onClick={() => { onClose(); onNavigateTab('skill-exchange'); }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Go to tab &rarr;
                  </button>
                </div>
                <p className="text-slate-600">
                  Toggle between <strong>Offering</strong> and <strong>Seeking</strong> listings. Filter by category, search by skill keyword, or click <strong>Post an Exchange</strong>.
                </p>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between font-semibold text-slate-900">
                  <span className="flex items-center gap-1.5"><MessageSquare className="w-3.5 h-3.5 text-purple-600" /> Community Board</span>
                  <button
                    onClick={() => { onClose(); onNavigateTab('community'); }}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Go to tab &rarr;
                  </button>
                </div>
                <p className="text-slate-600">
                  Upvote posts to see live counter updates. Expand comments to post real replies or click <strong>Ask Question / Post</strong> to add a new thread to the board.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Prototype Transparency */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg text-xs space-y-1 text-blue-900">
            <div className="flex items-center gap-1.5 font-semibold">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              <span>Prototype & Architecture Transparency</span>
            </div>
            <p className="text-blue-800 leading-relaxed">
              This application operates as a fully functional client-side prototype. All connection requests, group joins, skill postings, upvotes, and comments are reactive in-memory with optional local state. In a full production rollout, these endpoints would connect to Firebase Authentication and a Firestore/PostgreSQL database.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
          >
            Got it, Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
};
