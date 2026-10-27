export type ConnectionStatus = 'none' | 'pending' | 'connected' | 'received';

export interface Student {
  id: string;
  name: string;
  avatar: string;
  major: string;
  year: string;
  bio: string;
  dorm: string;
  campusLocation: string;
  interests: string[];
  skillsToTeach: string[];
  skillsToLearn: string[];
  courses: string[];
  studyStyle: string; // e.g., 'Pomodoro / Quiet Library', 'Active Whiteboard Discussion'
  availability: string; // e.g., 'Weekday afternoons & Sunday mornings'
  connectionStatus: ConnectionStatus;
  mutualCount: number;
  badge?: string;
}

export interface StudyGroup {
  id: string;
  courseCode: string;
  courseTitle: string;
  subject: string;
  title: string;
  description: string;
  membersCount: number;
  maxMembers: number;
  meetingDays: string;
  location: string;
  difficulty: 'Introductory' | 'Intermediate' | 'Advanced';
  isJoined: boolean;
  host: {
    name: string;
    avatar: string;
    major: string;
  };
  nextSession: string;
  tags: string[];
}

export type SkillType = 'offering' | 'seeking';

export interface SkillListing {
  id: string;
  type: SkillType;
  skillTitle: string;
  category: 'Computer Science' | 'Languages' | 'Design & Creative' | 'Mathematics' | 'Writing & Comm' | 'Music & Arts' | 'Business & Finance';
  description: string;
  studentId: string;
  studentName: string;
  studentMajor: string;
  studentYear: string;
  studentAvatar: string;
  lookingFor?: string; // what they want in exchange
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
  date: string;
}

export interface Comment {
  id: string;
  author: string;
  major: string;
  text: string;
  date: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    major: string;
    year: string;
  };
  channel: 'Academics & Study' | 'Campus Life' | 'Career & Internships' | 'Housing & Roommates' | 'Advice & Questions';
  likes: number;
  isLiked: boolean;
  date: string;
  tags: string[];
  comments: Comment[];
}

export interface ConnectionRequestItem {
  id: string;
  student: Student;
  direction: 'incoming' | 'outgoing';
  note: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
}

export type ActiveTab = 'dashboard' | 'discover' | 'study-buddy' | 'skill-exchange' | 'community' | 'requests';
