import React, { useState } from 'react';
import { ConnectionRequestItem, Student } from '../types';
import { UserCheck, UserX, Clock, MessageSquare, ArrowRight, ShieldCheck } from 'lucide-react';

interface ConnectionRequestsViewProps {
  incomingRequests: ConnectionRequestItem[];
  outgoingRequests: ConnectionRequestItem[];
  connectedStudents: Student[];
  onAcceptRequest: (requestId: string, studentId: string) => void;
  onDeclineRequest: (requestId: string, studentId: string) => void;
  onCancelOutgoing: (requestId: string, studentId: string) => void;
  onViewProfile: (student: Student) => void;
  onOpenMessage: (student: Student) => void;
  onNavigateDiscover: () => void;
}

export const ConnectionRequestsView: React.FC<ConnectionRequestsViewProps> = ({
  incomingRequests,
  outgoingRequests,
  connectedStudents,
  onAcceptRequest,
  onDeclineRequest,
  onCancelOutgoing,
  onViewProfile,
  onOpenMessage,
  onNavigateDiscover,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'incoming' | 'outgoing' | 'network'>('incoming');

  return (
    <div className="space-y-6 pb-12">
      {/* Header Deck */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Interactive Request System</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 mt-1">
              Connections & Network Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Manage incoming invitations from study partners, track sent requests, and message connected peers.
            </p>
          </div>

          <button
            onClick={onNavigateDiscover}
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 shrink-0 shadow-xs"
          >
            <span>Discover More Students</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sub-Tabs: Zero-pill functional segmented buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="inline-flex p-1 bg-slate-100 rounded-lg text-xs">
            <button
              onClick={() => setActiveSubTab('incoming')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubTab === 'incoming'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Incoming Requests</span>
              {incomingRequests.length > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] font-bold text-white bg-blue-600 rounded-full font-mono tabular-nums">
                  {incomingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveSubTab('outgoing')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubTab === 'outgoing'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Sent Requests</span>
              <span className="font-mono tabular-nums text-slate-400">({outgoingRequests.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('network')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubTab === 'network'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>My Network</span>
              <span className="font-mono tabular-nums text-slate-400">({connectedStudents.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Subtab 1: Incoming Requests */}
      {activeSubTab === 'incoming' && (
        <div className="space-y-4">
          {incomingRequests.length > 0 ? (
            incomingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:border-slate-300"
              >
                <div className="flex items-start gap-4 min-w-0">
                  <img
                    src={req.student.avatar}
                    alt={req.student.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3
                        onClick={() => onViewProfile(req.student)}
                        className="text-base font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition-colors"
                      >
                        {req.student.name}
                      </h3>
                      {req.student.badge && (
                        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-sm">
                          {req.student.badge}
                        </span>
                      )}
                    </div>

                    {/* Unboxed metadata with typographic separators */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span>{req.student.major}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{req.student.year}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span>{req.student.dorm}</span>
                    </div>

                    {/* Note attached to connection request */}
                    <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-slate-700 leading-relaxed">
                      <span className="font-semibold text-blue-900 block mb-0.5">Note:</span>
                      "{req.note}"
                    </div>

                    <div className="text-[11px] text-slate-400">
                      Received {req.date} · {req.student.mutualCount} mutual connections
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  <button
                    onClick={() => onAcceptRequest(req.id, req.student.id)}
                    className="w-full px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Accept Invitation</span>
                  </button>

                  <button
                    onClick={() => onDeclineRequest(req.id, req.student.id)}
                    className="w-full px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Decline</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                No pending incoming requests
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                You're all caught up! Reach out to classmates in Discover Students to build your study network.
              </p>
              <button
                onClick={onNavigateDiscover}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg"
              >
                Browse Student Directory
              </button>
            </div>
          )}
        </div>
      )}

      {/* Subtab 2: Sent Requests */}
      {activeSubTab === 'outgoing' && (
        <div className="space-y-4">
          {outgoingRequests.length > 0 ? (
            outgoingRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <img
                    src={req.student.avatar}
                    alt={req.student.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <h3
                      onClick={() => onViewProfile(req.student)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer"
                    >
                      {req.student.name}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {req.student.major} · {req.student.year}
                    </div>
                    <p className="text-xs text-slate-600 italic">
                      "{req.note}"
                    </p>
                    <div className="text-[11px] text-slate-400">
                      Sent {req.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-3 py-1.5 text-xs text-slate-500 bg-slate-100 rounded-lg flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Pending Peer Review</span>
                  </span>

                  <button
                    onClick={() => onCancelOutgoing(req.id, req.student.id)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:text-rose-600 font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8 space-y-2">
              <p className="text-sm font-bold text-slate-900">No pending sent requests</p>
              <p className="text-xs text-slate-500">You haven't sent any invitations that are currently pending.</p>
            </div>
          )}
        </div>
      )}

      {/* Subtab 3: My Network */}
      {activeSubTab === 'network' && (
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Connected classmates you can study with, message, and exchange skills.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connectedStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0">
                    <h3
                      onClick={() => onViewProfile(student)}
                      className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer truncate"
                    >
                      {student.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                      {student.major}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {student.dorm}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenMessage(student)}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>

                  <button
                    onClick={() => onViewProfile(student)}
                    className="px-2.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg"
                  >
                    Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
