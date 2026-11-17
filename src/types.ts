export type PageRoute =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'subjects'
  | 'topic-details'
  | 'practice-quiz'
  | 'weak-topics'
  | 'study-planner'
  | 'analytics'
  | 'settings';

export type MasteryStatus = 'Strong' | 'Improving' | 'Needs Practice' | 'Weak';

export type SubjectIconName =
  | 'code'
  | 'database'
  | 'brain'
  | 'network'
  | 'cpu'
  | 'calculator'
  | 'book'
  | 'layers';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type PriorityLevel = 'High' | 'Medium' | 'Low';

export interface UserProfile {
  name: string;
  email: string;
  major: string;
  semester: string;
  avatarUrl: string;
  dailyStudyGoalMinutes: number;
  preferredStudyHours: 'Morning (7AM - 12PM)' | 'Afternoon (12PM - 5PM)' | 'Evening (5PM - 9PM)' | 'Night (9PM - 12AM)';
  notifications: {
    quizReminders: boolean;
    weakTopicAlerts: boolean;
    weeklySummary: boolean;
  };
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  icon: SubjectIconName;
  description: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  mastery: number; // 0 to 100
  quizzesAttempted: number;
  lastPracticed: string; // e.g., "Nov 15, 2026"
  bktParams: {
    pTransit: number; // P(T) probability of learning
    pGuess: number;   // P(G) probability of guessing correctly
    pSlip: number;    // P(S) probability of careless error
  };
  studyMinutesLogged: number;
}

export interface QuizQuestion {
  id: string;
  topicId: string;
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface QuizAnswerRecord {
  questionId: string;
  prompt: string;
  options: [string, string, string, string];
  selectedIndex: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  topicId: string;
  topicName: string;
  subjectName: string;
  score: number; // 0 to 100
  correctCount: number;
  totalQuestions: number;
  date: string;
  masteryBefore: number;
  masteryAfter: number;
  answers: QuizAnswerRecord[];
}

export interface StudyTask {
  id: string;
  day: DayOfWeek;
  topicId: string;
  topicName: string;
  subjectName: string;
  durationMinutes: number;
  priority: PriorityLevel;
  completed: boolean;
  activityType: 'Concept Review' | 'Practice Quiz' | 'Problem Set' | 'Spaced Repetition';
}

export interface WeeklyPerformancePoint {
  week: string;
  quizScore: number;
  avgMastery: number;
  studyHours: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  targetRoute: PageRoute;
}
