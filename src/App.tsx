import { useEffect, useState } from 'react';
import { LayoutShell } from './components/LayoutShell';
import {
  INITIAL_NOTIFICATIONS,
  INITIAL_QUIZ_ATTEMPTS,
  INITIAL_STUDY_TASKS,
  INITIAL_SUBJECTS,
  INITIAL_TOPICS,
  INITIAL_USER_PROFILE,
  INITIAL_WEEKLY_PERFORMANCE,
} from './data/initialData';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { PracticeQuizPage } from './pages/PracticeQuizPage';
import { SettingsPage } from './pages/SettingsPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { TopicDetailsPage } from './pages/TopicDetailsPage';
import { WeakTopicsPage } from './pages/WeakTopicsPage';
import {
  AppNotification,
  PageRoute,
  QuizAttempt,
  StudyTask,
  Subject,
  SubjectIconName,
  Topic,
  UserProfile,
  WeeklyPerformancePoint,
} from './types';
import { generateAdaptiveStudyPlan } from './utils/bkt';

const STORAGE_KEY = 'adaptive_study_planner_state_v1';

interface PersistedState {
  isAuthenticated: boolean;
  route: PageRoute;
  user: UserProfile;
  subjects: Subject[];
  topics: Topic[];
  studyTasks: StudyTask[];
  quizAttempts: QuizAttempt[];
  weeklyPerformance: WeeklyPerformancePoint[];
  notifications: AppNotification[];
  selectedSubjectId: string;
  activeQuizTopicId: string | null;
}

function loadInitialState(): PersistedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PersistedState>;
      if (parsed && parsed.user && parsed.subjects && parsed.topics) {
        return {
          isAuthenticated: Boolean(parsed.isAuthenticated),
          route: parsed.route ?? (parsed.isAuthenticated ? 'dashboard' : 'landing'),
          user: parsed.user,
          subjects: parsed.subjects,
          topics: parsed.topics,
          studyTasks: parsed.studyTasks ?? INITIAL_STUDY_TASKS,
          quizAttempts: parsed.quizAttempts ?? INITIAL_QUIZ_ATTEMPTS,
          weeklyPerformance:
            parsed.weeklyPerformance ?? INITIAL_WEEKLY_PERFORMANCE,
          notifications: parsed.notifications ?? INITIAL_NOTIFICATIONS,
          selectedSubjectId:
            parsed.selectedSubjectId ?? parsed.subjects[0]?.id ?? 'subj-python',
          activeQuizTopicId: parsed.activeQuizTopicId ?? null,
        };
      }
    }
  } catch {
    // Ignore malformed localStorage
  }

  return {
    isAuthenticated: false,
    route: 'landing',
    user: INITIAL_USER_PROFILE,
    subjects: INITIAL_SUBJECTS,
    topics: INITIAL_TOPICS,
    studyTasks: INITIAL_STUDY_TASKS,
    quizAttempts: INITIAL_QUIZ_ATTEMPTS,
    weeklyPerformance: INITIAL_WEEKLY_PERFORMANCE,
    notifications: INITIAL_NOTIFICATIONS,
    selectedSubjectId: INITIAL_SUBJECTS[0].id,
    activeQuizTopicId: null,
  };
}

export default function App() {
  const [state, setState] = useState<PersistedState>(loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage quota errors
    }
  }, [state]);

  const navigate = (route: PageRoute, subjectId?: string) => {
    setState((prev) => ({
      ...prev,
      route,
      selectedSubjectId: subjectId ?? prev.selectedSubjectId,
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDemoLogin = () => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      route: 'dashboard',
    }));
  };

  const handleLoginSuccess = (email: string) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      route: 'dashboard',
      user: {
        ...prev.user,
        email,
      },
    }));
  };

  const handleRegisterSuccess = (fullName: string, email: string) => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      route: 'dashboard',
      user: {
        ...prev.user,
        name: fullName,
        email,
      },
    }));
  };

  const handleLogout = () => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      route: 'landing',
    }));
  };

  const handleStartQuiz = (topicId: string) => {
    setState((prev) => ({
      ...prev,
      activeQuizTopicId: topicId,
      route: 'practice-quiz',
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuizCompleted = (
    attempt: QuizAttempt,
    updatedMastery: number
  ) => {
    setState((prev) => {
      const updatedTopics = prev.topics.map((t) =>
        t.id === attempt.topicId
          ? {
              ...t,
              mastery: updatedMastery,
              quizzesAttempted: t.quizzesAttempted + 1,
              lastPracticed: attempt.date,
              studyMinutesLogged: t.studyMinutesLogged + 15,
            }
          : t
      );

      const newAvgMastery = Math.round(
        updatedTopics.reduce((sum, t) => sum + t.mastery, 0) /
          Math.max(1, updatedTopics.length)
      );

      const updatedWeekly = prev.weeklyPerformance.map((pt, idx, arr) =>
        idx === arr.length - 1
          ? {
              ...pt,
              quizScore: Math.round((pt.quizScore + attempt.score) / 2),
              avgMastery: newAvgMastery,
            }
          : pt
      );

      const newNotif: AppNotification = {
        id: `notif-${Date.now()}`,
        title: `BKT Mastery Updated: ${attempt.topicName}`,
        message: `Mastery shifted from ${attempt.masteryBefore}% to ${updatedMastery}% after scoring ${attempt.score}%.`,
        time: 'Just now',
        read: false,
        targetRoute: 'analytics',
      };

      return {
        ...prev,
        topics: updatedTopics,
        quizAttempts: [attempt, ...prev.quizAttempts],
        weeklyPerformance: updatedWeekly,
        notifications: [newNotif, ...prev.notifications],
      };
    });
  };

  const handleToggleTask = (taskId: string) => {
    setState((prev) => ({
      ...prev,
      studyTasks: prev.studyTasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      ),
    }));
  };

  const handleGenerateStudyPlan = () => {
    setState((prev) => ({
      ...prev,
      studyTasks: generateAdaptiveStudyPlan(
        prev.subjects,
        prev.topics,
        prev.user.dailyStudyGoalMinutes
      ),
    }));
  };

  const handleAddSubject = (
    name: string,
    code: string,
    icon: SubjectIconName,
    description: string,
    initialTopicNames: string[]
  ) => {
    const newSubjectId = `subj-${Date.now()}`;
    const newSubject: Subject = {
      id: newSubjectId,
      name,
      code,
      icon,
      description,
    };

    const newTopics: Topic[] = initialTopicNames.map((tName, idx) => ({
      id: `top-${Date.now()}-${idx}`,
      subjectId: newSubjectId,
      name: tName,
      mastery: 35 + idx * 10,
      quizzesAttempted: 0,
      lastPracticed: 'Not yet practiced',
      bktParams: { pTransit: 0.24, pGuess: 0.2, pSlip: 0.1 },
      studyMinutesLogged: 0,
    }));

    setState((prev) => ({
      ...prev,
      subjects: [...prev.subjects, newSubject],
      topics: [...prev.topics, ...newTopics],
    }));
  };

  const handleAddTopic = (
    subjectId: string,
    topicName: string,
    initialMastery: number
  ) => {
    const newTopic: Topic = {
      id: `top-${Date.now()}`,
      subjectId,
      name: topicName,
      mastery: initialMastery,
      quizzesAttempted: 0,
      lastPracticed: 'Not yet practiced',
      bktParams: { pTransit: 0.24, pGuess: 0.2, pSlip: 0.1 },
      studyMinutesLogged: 0,
    };

    setState((prev) => ({
      ...prev,
      topics: [...prev.topics, newTopic],
    }));
  };

  const handleResetDemoData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      isAuthenticated: true,
      route: 'dashboard',
      user: INITIAL_USER_PROFILE,
      subjects: INITIAL_SUBJECTS,
      topics: INITIAL_TOPICS,
      studyTasks: INITIAL_STUDY_TASKS,
      quizAttempts: INITIAL_QUIZ_ATTEMPTS,
      weeklyPerformance: INITIAL_WEEKLY_PERFORMANCE,
      notifications: INITIAL_NOTIFICATIONS,
      selectedSubjectId: INITIAL_SUBJECTS[0].id,
      activeQuizTopicId: null,
    });
  };

  // Public Routes
  if (!state.isAuthenticated || state.route === 'landing') {
    if (state.route === 'login' || state.route === 'register') {
      return (
        <AuthPage
          initialMode={state.route}
          onSwitchMode={(m) => navigate(m)}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          onDemoLogin={handleDemoLogin}
          onBackToLanding={() => navigate('landing')}
        />
      );
    }

    return (
      <LandingPage
        onGetStarted={() => navigate('register')}
        onLogin={() => navigate('login')}
        onDemoLogin={handleDemoLogin}
      />
    );
  }

  // Page Titles & Breadcrumbs for Authenticated Shell
  const activeSubject = state.subjects.find(
    (s) => s.id === state.selectedSubjectId
  );

  const pageMeta: Record<
    Exclude<PageRoute, 'landing' | 'login' | 'register'>,
    { title: string; breadcrumb: string[] }
  > = {
    dashboard: {
      title: 'Student Dashboard',
      breadcrumb: ['Adaptive Study Planner', 'Dashboard'],
    },
    subjects: {
      title: 'My Subjects',
      breadcrumb: ['Adaptive Study Planner', 'My Subjects'],
    },
    'topic-details': {
      title: activeSubject ? activeSubject.name : 'Topic Details',
      breadcrumb: [
        'Adaptive Study Planner',
        'My Subjects',
        activeSubject?.name ?? 'Topics',
      ],
    },
    'practice-quiz': {
      title: 'Practice Quiz',
      breadcrumb: ['Adaptive Study Planner', 'Practice Quizzes'],
    },
    'weak-topics': {
      title: 'Weak Topics',
      breadcrumb: ['Adaptive Study Planner', 'Weak Topics'],
    },
    'study-planner': {
      title: 'Adaptive Study Planner',
      breadcrumb: ['Adaptive Study Planner', 'Study Planner'],
    },
    analytics: {
      title: 'Progress Analytics',
      breadcrumb: ['Adaptive Study Planner', 'Progress Analytics'],
    },
    settings: {
      title: 'Settings & Profile',
      breadcrumb: ['Adaptive Study Planner', 'Settings'],
    },
  };

  const currentMeta =
    pageMeta[
      state.route as Exclude<PageRoute, 'landing' | 'login' | 'register'>
    ] ?? pageMeta.dashboard;

  return (
    <LayoutShell
      currentRoute={state.route}
      pageTitle={currentMeta.title}
      breadcrumb={currentMeta.breadcrumb}
      user={state.user}
      subjects={state.subjects}
      topics={state.topics}
      notifications={state.notifications}
      onNavigate={navigate}
      onStartQuiz={handleStartQuiz}
      onMarkAllNotificationsRead={() =>
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((n) => ({ ...n, read: true })),
        }))
      }
      onMarkNotificationRead={(id) =>
        setState((prev) => ({
          ...prev,
          notifications: prev.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      }
      onLogout={handleLogout}
    >
      {state.route === 'dashboard' && (
        <DashboardPage
          user={state.user}
          subjects={state.subjects}
          topics={state.topics}
          studyTasks={state.studyTasks}
          quizAttempts={state.quizAttempts}
          weeklyPerformance={state.weeklyPerformance}
          onNavigate={navigate}
          onStartQuiz={handleStartQuiz}
          onToggleTask={handleToggleTask}
        />
      )}

      {state.route === 'subjects' && (
        <SubjectsPage
          subjects={state.subjects}
          topics={state.topics}
          onViewTopics={(subjectId) => navigate('topic-details', subjectId)}
          onAddSubject={handleAddSubject}
        />
      )}

      {state.route === 'topic-details' && (
        <TopicDetailsPage
          subjects={state.subjects}
          selectedSubjectId={state.selectedSubjectId}
          topics={state.topics}
          onSelectSubject={(subjectId) =>
            setState((prev) => ({ ...prev, selectedSubjectId: subjectId }))
          }
          onBackToSubjects={() => navigate('subjects')}
          onPracticeQuiz={handleStartQuiz}
          onAddTopic={handleAddTopic}
        />
      )}

      {state.route === 'practice-quiz' && (
        <PracticeQuizPage
          subjects={state.subjects}
          topics={state.topics}
          activeTopicId={state.activeQuizTopicId}
          onSelectTopic={(topicId) =>
            setState((prev) => ({ ...prev, activeQuizTopicId: topicId }))
          }
          onQuizCompleted={handleQuizCompleted}
          onNavigate={navigate}
        />
      )}

      {state.route === 'weak-topics' && (
        <WeakTopicsPage
          subjects={state.subjects}
          topics={state.topics}
          onPracticeNow={handleStartQuiz}
        />
      )}

      {state.route === 'study-planner' && (
        <StudyPlannerPage
          subjects={state.subjects}
          topics={state.topics}
          studyTasks={state.studyTasks}
          dailyGoalMinutes={state.user.dailyStudyGoalMinutes}
          onToggleTask={handleToggleTask}
          onGeneratePlan={handleGenerateStudyPlan}
          onPracticeTopic={handleStartQuiz}
        />
      )}

      {state.route === 'analytics' && (
        <AnalyticsPage
          subjects={state.subjects}
          topics={state.topics}
          quizAttempts={state.quizAttempts}
          studyTasks={state.studyTasks}
          weeklyPerformance={state.weeklyPerformance}
        />
      )}

      {state.route === 'settings' && (
        <SettingsPage
          user={state.user}
          onSaveProfile={(updated) =>
            setState((prev) => ({ ...prev, user: updated }))
          }
          onResetDemoData={handleResetDemoData}
          onLogout={handleLogout}
        />
      )}
    </LayoutShell>
  );
}
