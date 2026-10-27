import React, { useState } from 'react';
import { Student } from '../types';
import { X, MapPin, BookOpen, Clock, Calendar, Check, Send, MessageSquare, Sparkles } from 'lucide-react';

interface StudentDetailModalProps {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
  onSendConnectionRequest: (student: Student, note: string) => void;
  onOpenMessage?: (student: Student) => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  isOpen,
  onClose,
  onSendConnectionRequest,
  onOpenMessage,
}) => {
  const [note, setNote] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!isOpen || !student) return null;

  const handleSend = () => {
    onSendConnectionRequest(student, note.trim() || `Hi ${student.name.split(' ')[0]}, I'd like to connect on CampusConnect!`);
    setShowNoteInput(false);
    setNote('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="student-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto"
    >
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Cover / Header backdrop */}
        <div className="h-28 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 p-4 flex justify-end items-start">
          <button
            onClick={onClose}
            aria-label="Close student profile"
            className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Info */}
        <div className="px-6 pb-6 pt-0 relative">
          {/* Avatar overlap */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
            <div className="flex items-end gap-4">
              <img
                src={student.avatar}
                alt={student.name}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow-md bg-white"
              />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 id="student-modal-title" className="text-xl font-bold text-slate-900">
                    {student.name}
                  </h2>
                  {student.badge && (
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-sm">
                      {student.badge}
                    </span>
                  )}
                </div>
                {/* Unboxed metadata with typographic separators */}
                <div className="flex items-center gap-2 text-xs text-slate-600 mt-1 flex-wrap">
                  <span className="font-medium text-slate-800">{student.major}</span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span>{student.year}</span>
                </div>
              </div>
            </div>

            {/* Status Button */}
            <div className="shrink-0">
              {student.connectionStatus === 'connected' ? (
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Connected
                  </span>
                  {onOpenMessage && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenMessage(student);
                      }}
                      className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" /> Message
                    </button>
                  )}
                </div>
              ) : student.connectionStatus === 'pending' ? (
                <span className="text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Request Pending
                </span>
              ) : (
                <button
                  onClick={() => setShowNoteInput(!showNoteInput)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" /> Connect with {student.name.split(' ')[0]}
                </button>
              )}
            </div>
          </div>

          {/* Quick Note Input (if sending request) */}
          {showNoteInput && (
            <div className="mb-5 p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg space-y-2">
              <label htmlFor="conn-note" className="block text-xs font-semibold text-slate-800">
                Personalize your connection note (Optional):
              </label>
              <textarea
                id="conn-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={`Hi ${student.name.split(' ')[0]}, I'm also taking courses in your field and would love to study together or swap tips!`}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-md focus:border-blue-500 focus:outline-hidden"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNoteInput(false)}
                  className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-2xs"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          )}

          {/* Details Tabs & Specs */}
          <div className="space-y-5 text-sm">
            {/* Bio */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                About & Academic Focus
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                {student.bio}
              </p>
            </div>

            {/* Campus & Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Dorm & Campus Area</span>
                </div>
                <p className="text-slate-600">{student.dorm}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Frequent spot: {student.campusLocation}</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-lg">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Study Style & Timing</span>
                </div>
                <p className="text-slate-600">{student.studyStyle}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Availability: {student.availability}</p>
              </div>
            </div>

            {/* Enrolled Courses */}
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                <span>Current Semester Courses</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {student.courses.map((course, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{course.split(':')[0]}</span>
                    <span className="text-slate-500 text-[11px] truncate ml-2">{course.split(':')[1]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills & Knowledge Exchange */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200">
              <div>
                <h4 className="text-xs font-bold text-blue-800 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Skills They Can Teach
                </h4>
                <ul className="space-y-1 text-xs text-slate-700">
                  {student.skillsToTeach.map((skill, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-amber-800 mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Skills They Want to Learn
                </h4>
                <ul className="space-y-1 text-xs text-slate-700">
                  {student.skillsToLearn.map((skill, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interests unboxed with separators */}
            <div className="pt-2 border-t border-slate-100 text-xs">
              <span className="font-semibold text-slate-700 mr-2">Interests:</span>
              <span className="text-slate-600">
                {student.interests.join('  ·  ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
