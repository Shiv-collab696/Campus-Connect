import React, { useState, useMemo } from 'react';
import { StudyGroup, Student } from '../types';
import { Search, Plus, Calendar, MapPin, Check, X } from 'lucide-react';

interface StudyBuddyViewProps {
  studyGroups: StudyGroup[];
  currentUser: Student;
  onToggleJoin: (groupId: string) => void;
  onCreateGroup: (newGroup: Omit<StudyGroup, 'id' | 'membersCount' | 'isJoined' | 'host'>) => void;
}

export const StudyBuddyView: React.FC<StudyBuddyViewProps> = ({
  studyGroups,
  currentUser,
  onToggleJoin,
  onCreateGroup,
}) => {
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form states for hosting a new study group
  const [courseCode, setCourseCode] = useState('');
  const [courseTitle, setCourseTitle] = useState('');
  const [subject, setSubject] = useState('Computer Science');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [meetingDays, setMeetingDays] = useState('');
  const [location, setLocation] = useState('');
  const [difficulty, setDifficulty] = useState<'Introductory' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [maxMembers, setMaxMembers] = useState(6);

  const subjects = ['All', 'Computer Science', 'Mathematics', 'Chemistry', 'Economics', 'Biology & Medicine', 'Architecture & Design'];

  const filteredGroups = useMemo(() => {
    return studyGroups.filter((g) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        g.courseCode.toLowerCase().includes(q) ||
        g.courseTitle.toLowerCase().includes(q) ||
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.location.toLowerCase().includes(q) ||
        g.tags.some((t) => t.toLowerCase().includes(q));

      const matchesSubject = selectedSubject === 'All' || g.subject === selectedSubject;

      return matchesSearch && matchesSubject;
    });
  }, [studyGroups, searchQuery, selectedSubject]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseCode.trim() || !title.trim() || !description.trim()) return;

    onCreateGroup({
      courseCode: courseCode.trim().toUpperCase(),
      courseTitle: courseTitle.trim() || 'Course Study Circle',
      subject,
      title: title.trim(),
      description: description.trim(),
      meetingDays: meetingDays.trim() || 'Weekly TBD · 2 hours',
      location: location.trim() || 'Campus Library / Study Rooms',
      difficulty,
      maxMembers: Number(maxMembers) || 5,
      nextSession: 'Upcoming Session',
      tags: [subject, 'Study Group', 'Exam Prep'],
    });

    // Reset & close
    setCourseCode('');
    setCourseTitle('');
    setTitle('');
    setDescription('');
    setMeetingDays('');
    setLocation('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Visual Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-sm">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/student_study_group_1793083591582.jpg"
            alt="Library Study Group"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/85 to-indigo-950/60" />
        </div>

        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-300">
              <span>Collaborative Learning Pods</span>
              <span aria-hidden="true">·</span>
              <span>Peer-Led Review</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Study Buddy & Course Working Groups
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              Never tackle tough problem sets or prelim exams alone. Browse active subject pods, compare notes, or host your own circle.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 bg-white hover:bg-slate-100 rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Host a Study Group</span>
          </button>
        </div>
      </div>

      {/* Subject Filter Bar (Zero-pill functional segmented buttons) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {subjects.map((sub) => (
          <button
            key={sub}
            onClick={() => setSelectedSubject(sub)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              selectedSubject === sub
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {sub}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by subject, course code (e.g. CS 2110, CHEM 3570), or topic..."
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-hidden"
        />
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGroups.map((group) => (
          <div
            key={group.id}
            className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all p-5 shadow-xs flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Header: Course Code & Subject */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-bold text-blue-700 font-mono text-sm tracking-tight">
                      {group.courseCode}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-medium text-slate-600">{group.subject}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-1">
                    {group.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    {group.courseTitle}
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-sm shrink-0">
                  {group.difficulty}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed">
                {group.description}
              </p>

              {/* Logistics */}
              <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{group.meetingDays}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{group.location}</span>
                </div>
              </div>

              {/* Tags unboxed */}
              <div className="text-[11px] text-slate-500 pt-1">
                {group.tags.join('  ·  ')}
              </div>
            </div>

            {/* Footer with Host info and Join button */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <img
                  src={group.host.avatar}
                  alt={group.host.name}
                  referrerPolicy="no-referrer"
                  className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                />
                <div className="text-xs truncate">
                  <span className="font-medium text-slate-800 block truncate">
                    Host: {group.host.name}
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono tabular-nums">
                    {group.membersCount}/{group.maxMembers} members joined
                  </span>
                </div>
              </div>

              <button
                onClick={() => onToggleJoin(group.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors shrink-0 flex items-center gap-1.5 ${
                  group.isJoined
                    ? 'text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100'
                    : 'text-white bg-slate-900 hover:bg-slate-800'
                }`}
              >
                {group.isJoined ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Joined Pod</span>
                  </>
                ) : (
                  <span>Join Group</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            No study groups found for "{searchQuery || selectedSubject}"
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Be the first to host a study circle for this course and invite your peers!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Host Study Circle
          </button>
        </div>
      )}

      {/* Create / Host Study Group Modal */}
      {showCreateModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Host a Campus Study Group
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Course Code (e.g., CS 2110) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MATH 2940"
                    value={courseCode}
                    onChange={(e) => setCourseCode(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Subject Field
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Economics">Economics</option>
                    <option value="Biology & Medicine">Biology & Medicine</option>
                    <option value="Architecture & Design">Architecture & Design</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Course Name
                </label>
                <input
                  type="text"
                  placeholder="Linear Algebra for Engineers"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Study Group Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Sunday P-Set Proofs & Midterm Prep"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Goal & Agenda Description *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="We meet weekly to work through proofs and collaborate on problem sets..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Meeting Schedule
                  </label>
                  <input
                    type="text"
                    placeholder="Wednesdays · 6:00 PM"
                    value={meetingDays}
                    onChange={(e) => setMeetingDays(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Campus Location
                  </label>
                  <input
                    type="text"
                    placeholder="Uris Hall Room 204"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Introductory">Introductory</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Max Capacity (Students)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={12}
                    value={maxMembers}
                    onChange={(e) => setMaxMembers(Number(e.target.value))}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs"
                >
                  Publish Study Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
