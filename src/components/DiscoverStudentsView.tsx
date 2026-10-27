import React, { useState, useMemo } from 'react';
import { Student } from '../types';
import { StudentCard } from './StudentCard';
import { Search, RotateCcw, Filter } from 'lucide-react';

interface DiscoverStudentsViewProps {
  students: Student[];
  onViewProfile: (student: Student) => void;
  onConnect: (student: Student) => void;
  onOpenMessage?: (student: Student) => void;
  onRespondRequest?: (student: Student) => void;
}

export const DiscoverStudentsView: React.FC<DiscoverStudentsViewProps> = ({
  students,
  onViewProfile,
  onConnect,
  onOpenMessage,
  onRespondRequest,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('All');

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Search matching name, major, courses, interests, or skills
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.major.toLowerCase().includes(q) ||
        s.dorm.toLowerCase().includes(q) ||
        s.courses.some((c) => c.toLowerCase().includes(q)) ||
        s.interests.some((i) => i.toLowerCase().includes(q)) ||
        s.skillsToTeach.some((st) => st.toLowerCase().includes(q)) ||
        s.skillsToLearn.some((sl) => sl.toLowerCase().includes(q));

      // Major filter
      const matchesMajor =
        selectedMajor === 'All' ||
        (selectedMajor === 'CS & Tech' && (s.major.includes('Computer Science') || s.major.includes('AI'))) ||
        (selectedMajor === 'Engineering' && (s.major.includes('Engineering') || s.major.includes('Robotics'))) ||
        (selectedMajor === 'Economics & Business' && (s.major.includes('Economics') || s.major.includes('Venture'))) ||
        (selectedMajor === 'Sciences' && (s.major.includes('Neuroscience') || s.major.includes('Environmental') || s.major.includes('Mathematics'))) ||
        (selectedMajor === 'Design & Arch' && (s.major.includes('Design') || s.major.includes('Architecture')));

      // Year filter
      const matchesYear =
        selectedYear === 'All' || s.year.toLowerCase().includes(selectedYear.toLowerCase());

      // Skills filter
      const matchesSkill =
        selectedSkillCategory === 'All' ||
        (selectedSkillCategory === 'Coding & Math' && (s.skillsToTeach.some((k) => /python|r|react|linear|matlab|math|proof/i.test(k)))) ||
        (selectedSkillCategory === 'Design & CAD' && (s.skillsToTeach.some((k) => /figma|cad|solidworks|design|rhino/i.test(k)))) ||
        (selectedSkillCategory === 'Science & Pre-Med' && (s.skillsToTeach.some((k) => /biochem|mcat|lab|biology/i.test(k)))) ||
        (selectedSkillCategory === 'Languages & Writing' && (s.skillsToTeach.some((k) => /writing|spanish|resume|latex/i.test(k))));

      return matchesSearch && matchesMajor && matchesYear && matchesSkill;
    });
  }, [students, searchQuery, selectedMajor, selectedYear, selectedSkillCategory]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedMajor('All');
    setSelectedYear('All');
    setSelectedSkillCategory('All');
  };

  const isFiltered = searchQuery || selectedMajor !== 'All' || selectedYear !== 'All' || selectedSkillCategory !== 'All';

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Discover Classmates & Study Partners
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Search demo student profiles by course code, major, interests, or peer skills.
          </p>
        </div>

        <div className="text-xs text-slate-500 font-mono tabular-nums">
          Showing {filteredStudents.length} of {students.length} students
        </div>
      </div>

      {/* Search and Filters Deck */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-2xs space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student name, course (e.g. CS 2110, CHEM 3570), skill, or interest..."
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-hidden transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Field of Study / Major
            </label>
            <select
              value={selectedMajor}
              onChange={(e) => setSelectedMajor(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Disciplines</option>
              <option value="CS & Tech">Computer Science & AI</option>
              <option value="Engineering">Engineering & Robotics</option>
              <option value="Economics & Business">Economics & Finance</option>
              <option value="Sciences">Natural Sciences & Math</option>
              <option value="Design & Arch">Design & Architecture</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Class Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Years</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Peer Skill Offering
            </label>
            <select
              value={selectedSkillCategory}
              onChange={(e) => setSelectedSkillCategory(e.target.value)}
              className="w-full text-xs p-2 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-hidden"
            >
              <option value="All">All Skills</option>
              <option value="Coding & Math">Coding, Data & Proofs</option>
              <option value="Design & CAD">Figma & CAD Modeling</option>
              <option value="Science & Pre-Med">Biochem & MCAT Prep</option>
              <option value="Languages & Writing">Languages & LaTeX</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Tag Buttons (Functional segmented controls) */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-medium flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Quick Filter:
            </span>
            {['CS 2110', 'ECON 3120', 'Organic Chemistry', 'Figma', 'Python'].map((tag) => (
              <button
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  searchQuery === tag
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>

          {isFiltered && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStudents.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onViewProfile={onViewProfile}
              onConnect={onConnect}
              onOpenMessage={onOpenMessage}
              onRespondRequest={onRespondRequest}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            No students found matching your criteria
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            Try adjusting your search keywords, clearing disciplinary filters, or exploring other majors.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};
