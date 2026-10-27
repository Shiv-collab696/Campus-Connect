import React from 'react';
import { Student } from '../types';
import { UserCheck, Clock, UserPlus, MessageSquare, MapPin } from 'lucide-react';

interface StudentCardProps {
  student: Student;
  onViewProfile: (student: Student) => void;
  onConnect: (student: Student) => void;
  onOpenMessage?: (student: Student) => void;
  onRespondRequest?: (student: Student) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onViewProfile,
  onConnect,
  onOpenMessage,
  onRespondRequest,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden group">
      <div className="p-5 space-y-4">
        {/* Top Header Row */}
        <div className="flex items-start gap-3.5">
          <div className="relative shrink-0">
            <img
              src={student.avatar}
              alt={student.name}
              referrerPolicy="no-referrer"
              className="w-14 h-14 rounded-full object-cover border border-slate-200"
              onError={(e) => {
                // styled fallback container if image fails
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            {student.badge && (
              <span className="absolute -bottom-1 -right-1 bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded-sm border border-amber-200">
                {student.badge}
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              onClick={() => onViewProfile(student)}
              className="text-base font-bold text-slate-900 truncate hover:text-blue-600 cursor-pointer transition-colors"
            >
              {student.name}
            </h3>

            {/* Unboxed metadata with typographic separators */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 flex-wrap">
              <span className="font-medium text-slate-800">{student.major}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{student.year}</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 truncate">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{student.dorm}</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {student.bio}
        </p>

        {/* Course highlights */}
        <div className="space-y-1.5 text-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Enrolled Courses
          </div>
          <div className="flex items-center gap-1.5 text-slate-700 flex-wrap">
            {student.courses.slice(0, 2).map((c, i) => (
              <span key={i} className="text-slate-700">
                {c.split(':')[0]}
                {i < 1 && student.courses.length > 1 && (
                  <span aria-hidden="true" className="text-slate-300 ml-1.5">/</span>
                )}
              </span>
            ))}
            {student.courses.length > 2 && (
              <span className="text-slate-400 text-[11px]">+{student.courses.length - 2} more</span>
            )}
          </div>
        </div>

        {/* Skills Offering & Seeking breakdown */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] font-semibold text-blue-700 block">Can Teach</span>
            <span className="text-slate-700 truncate block mt-0.5">
              {student.skillsToTeach[0] || 'Peer study'}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-semibold text-amber-700 block">Wants to Learn</span>
            <span className="text-slate-700 truncate block mt-0.5">
              {student.skillsToLearn[0] || 'Exam prep'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewProfile(student)}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 py-1.5 transition-colors"
        >
          View Profile
        </button>

        <div>
          {student.connectionStatus === 'connected' ? (
            <button
              onClick={() => onOpenMessage && onOpenMessage(student)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Message</span>
            </button>
          ) : student.connectionStatus === 'pending' ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200 rounded-lg whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Pending</span>
            </span>
          ) : student.connectionStatus === 'received' ? (
            <button
              onClick={() => onRespondRequest && onRespondRequest(student)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-colors whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Respond</span>
            </button>
          ) : (
            <button
              onClick={() => onConnect(student)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Connect</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
