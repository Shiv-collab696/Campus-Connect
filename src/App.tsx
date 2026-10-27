/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActiveTab, Student, StudyGroup, SkillListing, CommunityPost, ConnectionRequestItem } from './types';
import {
  CURRENT_USER,
  INITIAL_STUDENTS,
  INITIAL_STUDY_GROUPS,
  INITIAL_SKILL_EXCHANGES,
  INITIAL_COMMUNITY_POSTS,
  INITIAL_REQUESTS,
} from './data/mockData';
import { Header } from './components/Header';
import { PrototypeBanner } from './components/PrototypeBanner';
import { DashboardView } from './components/DashboardView';
import { DiscoverStudentsView } from './components/DiscoverStudentsView';
import { StudyBuddyView } from './components/StudyBuddyView';
import { SkillExchangeView } from './components/SkillExchangeView';
import { CommunityBoardView } from './components/CommunityBoardView';
import { ConnectionRequestsView } from './components/ConnectionRequestsView';
import { StudentDetailModal } from './components/StudentDetailModal';
import { MessagePrototypeModal } from './components/MessagePrototypeModal';
import { TestingGuideModal } from './components/TestingGuideModal';
import { Check, CheckCircle2, GraduationCap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [currentUser] = useState<Student>(CURRENT_USER);
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>(INITIAL_STUDY_GROUPS);
  const [skillListings, setSkillListings] = useState<SkillListing[]>(INITIAL_SKILL_EXCHANGES);
  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(INITIAL_COMMUNITY_POSTS);

  // Connection Requests state
  const [incomingRequests, setIncomingRequests] = useState<ConnectionRequestItem[]>(
    INITIAL_REQUESTS.filter((r) => r.direction === 'incoming')
  );
  const [outgoingRequests, setOutgoingRequests] = useState<ConnectionRequestItem[]>(
    INITIAL_REQUESTS.filter((r) => r.direction === 'outgoing')
  );

  // Modals state
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeChatStudent, setActiveChatStudent] = useState<Student | null>(null);
  const [testingGuideOpen, setTestingGuideOpen] = useState(false);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Connected students list
  const connectedStudents = students.filter((s) => s.connectionStatus === 'connected');

  // Connection Actions
  const handleConnectStudent = (student: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, connectionStatus: 'pending' } : s))
    );

    const newOutgoing: ConnectionRequestItem = {
      id: `req-out-${Date.now()}`,
      student: { ...student, connectionStatus: 'pending' },
      direction: 'outgoing',
      note: `Hi ${student.name.split(' ')[0]}, I'd like to connect on CampusConnect!`,
      date: 'Just now',
      status: 'pending',
    };

    setOutgoingRequests((prev) => [newOutgoing, ...prev]);
    showToast(`Connection invitation sent to ${student.name}!`);
  };

  const handleSendConnectionWithNote = (student: Student, note: string) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === student.id ? { ...s, connectionStatus: 'pending' } : s))
    );

    const newOutgoing: ConnectionRequestItem = {
      id: `req-out-${Date.now()}`,
      student: { ...student, connectionStatus: 'pending' },
      direction: 'outgoing',
      note,
      date: 'Just now',
      status: 'pending',
    };

    setOutgoingRequests((prev) => [newOutgoing, ...prev]);
    setSelectedStudent(null);
    showToast(`Personalized invitation sent to ${student.name}!`);
  };

  const handleAcceptRequest = (requestId: string, studentId: string) => {
    const targetStudent = students.find((s) => s.id === studentId);
    const studentName = targetStudent ? targetStudent.name : 'Classmate';

    // Remove from incoming
    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));

    // Update status in students list
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, connectionStatus: 'connected' } : s))
    );

    showToast(`Connected with ${studentName}! They are now in My Network.`);
  };

  const handleDeclineRequest = (requestId: string, studentId: string) => {
    setIncomingRequests((prev) => prev.filter((r) => r.id !== requestId));
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, connectionStatus: 'none' } : s))
    );
    showToast('Invitation declined.');
  };

  const handleCancelOutgoing = (requestId: string, studentId: string) => {
    setOutgoingRequests((prev) => prev.filter((r) => r.id !== requestId));
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, connectionStatus: 'none' } : s))
    );
    showToast('Connection invitation cancelled.');
  };

  // Study Groups Actions
  const handleToggleJoinGroup = (groupId: string) => {
    setStudyGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const newJoined = !g.isJoined;
          showToast(newJoined ? `Joined ${g.title}!` : `Left ${g.title}.`);
          return {
            ...g,
            isJoined: newJoined,
            membersCount: newJoined ? g.membersCount + 1 : Math.max(1, g.membersCount - 1),
          };
        }
        return g;
      })
    );
  };

  const handleCreateGroup = (
    newGroupData: Omit<StudyGroup, 'id' | 'membersCount' | 'isJoined' | 'host'>
  ) => {
    const newGroup: StudyGroup = {
      ...newGroupData,
      id: `group-${Date.now()}`,
      membersCount: 1,
      isJoined: true,
      host: {
        name: currentUser.name,
        avatar: currentUser.avatar,
        major: currentUser.major,
      },
    };

    setStudyGroups((prev) => [newGroup, ...prev]);
    showToast(`Published study group: "${newGroup.title}"!`);
  };

  // Skill Exchange Actions
  const handlePostSkill = (
    newSkillData: Omit<SkillListing, 'id' | 'studentId' | 'studentName' | 'studentMajor' | 'studentYear' | 'studentAvatar' | 'date'>
  ) => {
    const newListing: SkillListing = {
      ...newSkillData,
      id: `skill-${Date.now()}`,
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentMajor: currentUser.major,
      studentYear: currentUser.year.split(',')[0],
      studentAvatar: currentUser.avatar,
      date: 'Just now',
    };

    setSkillListings((prev) => [newListing, ...prev]);
    showToast(`Published "${newListing.skillTitle}" to the Skill Exchange!`);
  };

  const handleProposeSwap = (listing: SkillListing) => {
    // Find matching student or construct peer for message modal
    const matched = students.find((s) => s.id === listing.studentId);
    if (matched) {
      setActiveChatStudent(matched);
    } else {
      setActiveChatStudent({
        id: listing.studentId,
        name: listing.studentName,
        avatar: listing.studentAvatar,
        major: listing.studentMajor,
        year: listing.studentYear,
        bio: `Interested in exchanging knowledge in ${listing.skillTitle}`,
        dorm: 'Campus Living',
        campusLocation: 'Central Campus',
        interests: [listing.category],
        skillsToTeach: [listing.skillTitle],
        skillsToLearn: [listing.lookingFor || 'General study'],
        courses: [],
        studyStyle: 'Collaborative peer learning',
        availability: 'Flexible',
        connectionStatus: 'connected',
        mutualCount: 4,
      });
    }
  };

  // Community Actions
  const handleToggleLike = (postId: string) => {
    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const nextLiked = !p.isLiked;
          return {
            ...p,
            isLiked: nextLiked,
            likes: nextLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );
  };

  const handleAddComment = (postId: string, text: string) => {
    const newComment = {
      id: `comment-${Date.now()}`,
      author: currentUser.name,
      major: currentUser.major,
      text,
      date: 'Just now',
    };

    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          };
        }
        return p;
      })
    );
    showToast('Your reply was posted to the thread!');
  };

  const handleCreatePost = (
    newPostData: Omit<CommunityPost, 'id' | 'likes' | 'isLiked' | 'date' | 'comments'>
  ) => {
    const newPost: CommunityPost = {
      ...newPostData,
      id: `post-${Date.now()}`,
      likes: 1,
      isLiked: true,
      date: 'Just now',
      comments: [],
    };

    setCommunityPosts((prev) => [newPost, ...prev]);
    showToast('Your post has been published to the Community Board!');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Banner indicating prototype status & test instructions */}
      <PrototypeBanner onOpenGuide={() => setTestingGuideOpen(true)} />

      {/* Top Navigation Bar adhering to the Top Bar Contract */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        pendingRequestsCount={incomingRequests.length}
        currentUser={currentUser}
        onOpenGuide={() => setTestingGuideOpen(true)}
        onOpenCurrentUserProfile={() => setSelectedStudent(currentUser)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        {activeTab === 'dashboard' && (
          <DashboardView
            currentUser={currentUser}
            students={students}
            studyGroups={studyGroups}
            communityPosts={communityPosts}
            pendingRequestsCount={incomingRequests.length}
            onNavigateTab={setActiveTab}
            onViewProfile={(s) => setSelectedStudent(s)}
            onConnectStudent={handleConnectStudent}
            onOpenMessage={(s) => setActiveChatStudent(s)}
            onToggleJoinGroup={handleToggleJoinGroup}
          />
        )}

        {activeTab === 'discover' && (
          <DiscoverStudentsView
            students={students}
            onViewProfile={(s) => setSelectedStudent(s)}
            onConnect={handleConnectStudent}
            onOpenMessage={(s) => setActiveChatStudent(s)}
            onRespondRequest={() => setActiveTab('requests')}
          />
        )}

        {activeTab === 'study-buddy' && (
          <StudyBuddyView
            studyGroups={studyGroups}
            currentUser={currentUser}
            onToggleJoin={handleToggleJoinGroup}
            onCreateGroup={handleCreateGroup}
          />
        )}

        {activeTab === 'skill-exchange' && (
          <SkillExchangeView
            skillListings={skillListings}
            currentUser={currentUser}
            onPostSkill={handlePostSkill}
            onProposeSwap={handleProposeSwap}
          />
        )}

        {activeTab === 'community' && (
          <CommunityBoardView
            posts={communityPosts}
            currentUser={currentUser}
            onToggleLike={handleToggleLike}
            onAddComment={handleAddComment}
            onCreatePost={handleCreatePost}
          />
        )}

        {activeTab === 'requests' && (
          <ConnectionRequestsView
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            connectedStudents={connectedStudents}
            onAcceptRequest={handleAcceptRequest}
            onDeclineRequest={handleDeclineRequest}
            onCancelOutgoing={handleCancelOutgoing}
            onViewProfile={(s) => setSelectedStudent(s)}
            onOpenMessage={(s) => setActiveChatStudent(s)}
            onNavigateDiscover={() => setActiveTab('discover')}
          />
        )}
      </main>

      {/* Student Profile Detail Modal */}
      <StudentDetailModal
        student={selectedStudent}
        isOpen={Boolean(selectedStudent)}
        onClose={() => setSelectedStudent(null)}
        onSendConnectionRequest={handleSendConnectionWithNote}
        onOpenMessage={(s) => {
          setSelectedStudent(null);
          setActiveChatStudent(s);
        }}
      />

      {/* Interactive Chat / Message Modal Prototype */}
      <MessagePrototypeModal
        student={activeChatStudent}
        isOpen={Boolean(activeChatStudent)}
        onClose={() => setActiveChatStudent(null)}
      />

      {/* How to Run & Test Guide Modal */}
      <TestingGuideModal
        isOpen={testingGuideOpen}
        onClose={() => setTestingGuideOpen(false)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          setTestingGuideOpen(false);
        }}
      />

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 text-xs flex items-center gap-2.5 max-w-md animate-in fade-in slide-in-from-bottom-3 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="flex-1 leading-snug">{toastMessage}</span>
        </aside>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              <GraduationCap className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-800">CampusConnect</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Student Networking & Peer Learning Platform</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => setTestingGuideOpen(true)}
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              How to Test All Features
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              onClick={() => setActiveTab('study-buddy')}
              className="hover:text-slate-800"
            >
              Study Pods
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              onClick={() => setActiveTab('skill-exchange')}
              className="hover:text-slate-800"
            >
              Skill Swaps
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Fall Semester 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
