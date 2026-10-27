import React, { useState, useMemo } from 'react';
import { SkillListing, Student } from '../types';
import { Search, Plus, Repeat, ArrowRightLeft, Sparkles, X, MessageSquare } from 'lucide-react';

interface SkillExchangeViewProps {
  skillListings: SkillListing[];
  currentUser: Student;
  onPostSkill: (newSkill: Omit<SkillListing, 'id' | 'studentId' | 'studentName' | 'studentMajor' | 'studentYear' | 'studentAvatar' | 'date'>) => void;
  onProposeSwap: (listing: SkillListing) => void;
}

export const SkillExchangeView: React.FC<SkillExchangeViewProps> = ({
  skillListings,
  currentUser,
  onPostSkill,
  onProposeSwap,
}) => {
  const [filterType, setFilterType] = useState<'all' | 'offering' | 'seeking'>('all');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);

  // Form states
  const [type, setType] = useState<'offering' | 'seeking'>('offering');
  const [skillTitle, setSkillTitle] = useState('');
  const [category, setCategory] = useState<SkillListing['category']>('Computer Science');
  const [description, setDescription] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [proficiency, setProficiency] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');

  const categories = [
    'All',
    'Computer Science',
    'Languages',
    'Design & Creative',
    'Mathematics',
    'Writing & Comm',
  ];

  const filteredListings = useMemo(() => {
    return skillListings.filter((l) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        l.skillTitle.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        (l.lookingFor && l.lookingFor.toLowerCase().includes(q)) ||
        l.studentName.toLowerCase().includes(q) ||
        l.studentMajor.toLowerCase().includes(q);

      const matchesType = filterType === 'all' || l.type === filterType;
      const matchesCategory = selectedCategory === 'All' || l.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [skillListings, searchQuery, filterType, selectedCategory]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillTitle.trim() || !description.trim()) return;

    onPostSkill({
      type,
      skillTitle: skillTitle.trim(),
      category,
      description: description.trim(),
      lookingFor: lookingFor.trim() || 'Open to any peer skill swap',
      proficiency,
    });

    // Reset & close
    setSkillTitle('');
    setDescription('');
    setLookingFor('');
    setShowPostModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Title & Concept Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Peer-to-Peer Knowledge Economy</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Campus Skill Exchange
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Trade your strengths for what you want to learn. No fees, just college students helping each other excel.
            </p>
          </div>

          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Post Skill Listing</span>
          </button>
        </div>

        {/* Segmented Filter: Offering vs Seeking */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterType === 'all'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Listings
            </button>
            <button
              onClick={() => setFilterType('offering')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterType === 'offering'
                  ? 'bg-white text-blue-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Can Teach (Offering)
            </button>
            <button
              onClick={() => setFilterType('seeking')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                filterType === 'seeking'
                  ? 'bg-white text-amber-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Wants to Learn (Seeking)
            </button>
          </div>

          <div className="text-xs text-slate-500 font-mono tabular-nums">
            {filteredListings.length} active listings
          </div>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (e.g. Python, Figma, Spanish, LaTeX, SolidWorks)..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-lg focus:border-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Listings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredListings.map((listing) => {
          const isOffering = listing.type === 'offering';
          return (
            <div
              key={listing.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all p-5 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header Badge & Category */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`text-[11px] font-bold tracking-wide uppercase ${
                        isOffering ? 'text-blue-700' : 'text-amber-700'
                      }`}
                    >
                      {isOffering ? '● Offering to Teach' : '▲ Seeking to Learn'}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {listing.skillTitle}
                    </h3>
                  </div>

                  <span className="text-xs text-slate-500 font-medium">
                    {listing.category}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {listing.description}
                </p>

                {/* Desired Exchange */}
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                  <span className="font-semibold text-slate-700 block mb-0.5">
                    {isOffering ? 'Looking to Learn in Return:' : 'Can Offer in Return:'}
                  </span>
                  <p className="text-slate-600">
                    {listing.lookingFor}
                  </p>
                </div>
              </div>

              {/* Student info and propose swap */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={listing.studentAvatar}
                    alt={listing.studentName}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="text-xs truncate">
                    <span className="font-semibold text-slate-800 block truncate">
                      {listing.studentName}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {listing.studentMajor} · {listing.proficiency}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => onProposeSwap(listing)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>Propose Swap</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredListings.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <p className="text-sm font-semibold text-slate-800">
            No skill listings found
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try switching between Offering and Seeking or post your own listing.
          </p>
          <button
            onClick={() => setShowPostModal(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Post a Skill Listing
          </button>
        </div>
      )}

      {/* Post Skill Listing Modal */}
      {showPostModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">
                Post a Peer Skill Exchange
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Listing Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setType('offering')}
                    className={`py-2 px-3 rounded-lg border font-medium text-center transition-colors ${
                      type === 'offering'
                        ? 'bg-blue-50 border-blue-500 text-blue-700 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    I Can Teach (Offering)
                  </button>
                  <button
                    type="button"
                    onClick={() => setType('seeking')}
                    className={`py-2 px-3 rounded-lg border font-medium text-center transition-colors ${
                      type === 'seeking'
                        ? 'bg-amber-50 border-amber-500 text-amber-700 font-bold'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    I Want to Learn (Seeking)
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Skill Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Python Data Analysis (Pandas), Conversational French, Figma UI Design"
                  value={skillTitle}
                  onChange={(e) => setSkillTitle(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Computer Science">Computer Science</option>
                    <option value="Languages">Languages</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Writing & Comm">Writing & Comm</option>
                    <option value="Business & Finance">Business & Finance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Proficiency
                  </label>
                  <select
                    value={proficiency}
                    onChange={(e) => setProficiency(e.target.value as any)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced / Fluent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  What will you cover or what help do you need? *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="I can explain core syntax, work through problem sets, or review projects together..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {type === 'offering' ? 'What do you want to learn in return?' : 'What can you teach in return?'}
                </label>
                <input
                  type="text"
                  placeholder="e.g., Looking for someone to practice Spanish or explain linear algebra"
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
