import React, { useState } from 'react';
import { ActiveTab, Student } from '../types';
import { GraduationCap, HelpCircle, Menu, X, Users, BookOpen, Repeat, MessageSquare, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  pendingRequestsCount: number;
  currentUser: Student;
  onOpenGuide: () => void;
  onOpenCurrentUserProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  pendingRequestsCount,
  currentUser,
  onOpenGuide,
  onOpenCurrentUserProfile,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'discover', label: 'Discover Students', icon: <Users className="w-4 h-4" /> },
    { id: 'study-buddy', label: 'Study Buddy', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'skill-exchange', label: 'Skill Exchange', icon: <Repeat className="w-4 h-4" /> },
    { id: 'community', label: 'Community Board', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'requests', label: 'Requests', icon: <Users className="w-4 h-4" />, badge: pendingRequestsCount },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Desktop & Mobile Main Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Single element wordmark */}
          <button
            onClick={() => {
              onTabChange('dashboard');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left focus:outline-hidden group"
          >
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold shadow-xs transition-transform group-hover:scale-105">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap leading-tight">
                CampusConnect
              </span>
              <span className="text-[10px] text-slate-500 font-medium whitespace-nowrap leading-none hidden sm:block">
                College Networking & Study Hub
              </span>
            </div>
          </button>

          {/* Zone 2: Single-line navigation links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onTabChange(link.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                    isActive
                      ? 'text-blue-700 bg-blue-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold tabular-nums text-white bg-blue-600 rounded-full">
                      {link.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + Profile shortcut */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenGuide}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200/80 rounded-lg transition-colors whitespace-nowrap"
              title="View test guide and commands"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span className="hidden sm:inline">Testing Guide</span>
            </button>

            <button
              onClick={onOpenCurrentUserProfile}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-lg hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all text-left"
              title="Your student profile (Alex Rivera)"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-8 h-8 rounded-full object-cover border border-slate-300"
              />
              <div className="hidden xl:flex flex-col text-xs leading-tight">
                <span className="font-semibold text-slate-800">{currentUser.name}</span>
                <span className="text-[11px] text-slate-500">Junior · CS</span>
              </div>
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onTabChange(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'text-blue-700 bg-blue-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {link.icon}
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold tabular-nums text-white bg-blue-600 rounded-full">
                    {link.badge} new
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
