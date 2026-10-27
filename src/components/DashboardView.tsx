import React from 'react';
import { Student, StudyGroup, CommunityPost, ActiveTab } from '../types';
import { StudentCard } from './StudentCard';
import { Users, BookOpen, Repeat, MessageSquare, ArrowRight, Calendar, Sparkles } from 'lucide-react';

interface DashboardViewProps {
  currentUser: Student;
  students: Student[];
  studyGroups: StudyGroup[];
  communityPosts: CommunityPost[];
  pendingRequestsCount: number;
  onNavigateTab: (tab: ActiveTab) => void;
  onViewProfile: (student: Student) => void;
  onConnectStudent: (student: Student) => void;
  onOpenMessage: (student: Student) => void;
  onToggleJoinGroup: (groupId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  students,
  studyGroups,
  communityPosts,
  pendingRequestsCount,
  onNavigateTab,
  onViewProfile,
  onConnectStudent,
  onOpenMessage,
  onToggleJoinGroup,
}) => {
  // Suggested peers: non-connected students with mutual matches
  const suggestedStudents = students
    .filter((s) => s.id !== currentUser.id && s.connectionStatus !== 'connected')
    .slice(0, 3);

  // User's joined groups + active group highlights
  const upcomingGroups = studyGroups.slice(0, 3);

  const connectedCount = students.filter((s) => s.connectionStatus === 'connected').length + 12; // Base demo count

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Card with Quad Photography */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-900 text-white">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/campus_quad_hero_1793083590762.jpg"
            alt="Campus Quad"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-30 brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-blue-950/50" />
        </div>

        <div className="relative p-6 sm:p-8 lg:p-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span>Welcome back to campus, {currentUser.name.split(' ')[0]}</span>
            <span aria-hidden="true">·</span>
            <span>Fall Term 2026</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Build meaningful study circles and exchange skills across campus.
          </h1>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
            Find peer study partners for your current courses, collaborate on weekly problem sets, and swap knowledge with passionate classmates.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => onNavigateTab('discover')}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              <Users className="w-4 h-4 text-blue-600" />
              <span>Discover Study Partners</span>
            </button>

            <button
              onClick={() => onNavigateTab('study-buddy')}
              className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Browse Study Groups</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row (Tabular Figures) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('requests')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Connections</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {connectedCount}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Classmates in your network</p>
        </div>

        <div
          onClick={() => onNavigateTab('study-buddy')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Study Groups</span>
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {studyGroups.filter((g) => g.isJoined).length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Active weekly circles</p>
        </div>

        <div
          onClick={() => onNavigateTab('skill-exchange')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-amber-300 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Skill Swaps</span>
            <Repeat className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            6
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Peer listings available</p>
        </div>

        <div
          onClick={() => onNavigateTab('requests')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-purple-300 cursor-pointer transition-all shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Requests</span>
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-slate-900 font-mono tabular-nums">
            {pendingRequestsCount}
          </div>
          <p className="text-[11px] text-blue-600 font-medium mt-1">Awaiting your response</p>
        </div>
      </div>

      {/* Suggested Students Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Suggested Study Partners
            </h2>
            <p className="text-xs text-slate-500">
              Matched with your enrolled courses (CS 2110, MATH 2940) and interests
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('discover')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            <span>View all students</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {suggestedStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onViewProfile={onViewProfile}
              onConnect={onConnectStudent}
              onOpenMessage={onOpenMessage}
              onRespondRequest={() => onNavigateTab('requests')}
            />
          ))}
        </div>
      </section>

      {/* 2-Column Split: Active Study Groups + Community Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Study Groups (7 cols) */}
        <section className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Active Study Groups
              </h2>
              <p className="text-xs text-slate-500">
                Small study pods meeting regularly on campus
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('study-buddy')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Explore all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {upcomingGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 min-w-0">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-blue-700 font-mono">{group.courseCode}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">{group.subject}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500 font-mono tabular-nums">{group.membersCount}/{group.maxMembers} members</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 truncate">
                    {group.title}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{group.meetingDays}</span>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-2">
                  <button
                    onClick={() => onToggleJoinGroup(group.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      group.isJoined
                        ? 'text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100'
                        : 'text-white bg-slate-900 hover:bg-slate-800'
                    }`}
                  >
                    {group.isJoined ? 'Joined ✓' : 'Join Group'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Community Activity (5 cols) */}
        <section className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Community Activity
              </h2>
              <p className="text-xs text-slate-500">
                Latest discussions & questions
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('community')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              <span>Board</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {communityPosts.slice(0, 2).map((post) => (
              <div
                key={post.id}
                onClick={() => onNavigateTab('community')}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs cursor-pointer space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-blue-700">{post.channel}</span>
                  <span>{post.date}</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-blue-600 transition-colors">
                  {post.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {post.content}
                </p>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span>{post.author.name}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono tabular-nums">{post.likes} likes</span>
                    <span>·</span>
                    <span className="font-mono tabular-nums">{post.comments.length} replies</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="p-4 bg-blue-50/60 border border-blue-200/80 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Ready to start a peer skill exchange?</span>
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Offer a skill like Python, Figma, or Spanish and find someone to tutor you in calculus or writing.
              </p>
              <button
                onClick={() => onNavigateTab('skill-exchange')}
                className="text-xs font-bold text-blue-700 hover:underline inline-block pt-1"
              >
                Explore Skill Exchange &rarr;
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
