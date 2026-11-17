import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  Target,
} from 'lucide-react';
import { BktVisualization } from '../components/BktVisualization';
import {
  CircularProgress,
  StatusLabel,
  WeeklyPerformanceChart,
} from '../components/ui/ChartsAndGauges';
import { QuizResultModal } from '../components/ui/QuizResultModal';
import {
  PageRoute,
  QuizAttempt,
  StudyTask,
  Subject,
  Topic,
  UserProfile,
  WeeklyPerformancePoint,
} from '../types';

interface DashboardPageProps {
  user: UserProfile;
  subjects: Subject[];
  topics: Topic[];
  studyTasks: StudyTask[];
  quizAttempts: QuizAttempt[];
  weeklyPerformance: WeeklyPerformancePoint[];
  onNavigate: (route: PageRoute, subjectId?: string) => void;
  onStartQuiz: (topicId: string) => void;
  onToggleTask: (taskId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  subjects,
  topics,
  studyTasks,
  quizAttempts,
  weeklyPerformance,
  onNavigate,
  onStartQuiz,
  onToggleTask,
}) => {
  const [selectedAttempt, setSelectedAttempt] = useState<QuizAttempt | null>(null);

  const firstName = user.name.split(' ')[0] || 'Alex';
  const totalSubjects = subjects.length;
  const completedTopics = topics.filter((t) => t.mastery >= 80).length;
  const avgMastery =
    topics.length > 0
      ? Math.round(topics.reduce((acc, t) => acc + t.mastery, 0) / topics.length)
      : 0;
  const totalQuizzesAttempted = topics.reduce(
    (acc, t) => acc + t.quizzesAttempted,
    0
  );

  const subjectNameMap = new Map(subjects.map((s) => [s.id, s.name]));

  const weakTopics = [...topics]
    .filter((t) => t.mastery < 60)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 4);

  const todaysTasks = studyTasks.filter((t) => t.day === 'Monday');
  const recentQuizzes = quizAttempts.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-2xl text-slate-900 [text-wrap:balance]">
            Welcome back, {firstName}! Ready to continue learning?
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {user.major} · {user.semester} · Daily Goal {user.dailyStudyGoalMinutes} min
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('study-planner')}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            View Study Plan
          </button>
          <button
            onClick={() => {
              const target = weakTopics[0] ?? topics[0];
              if (target) onStartQuiz(target.id);
              else onNavigate('practice-quiz');
            }}
            className="px-4 py-2 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Practice Weakest Topic
          </button>
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500">Total Subjects</div>
            <div className="font-display font-bold text-2xl tabular-nums text-slate-900 mt-1">
              {totalSubjects}
            </div>
            <div className="text-xs text-slate-500 mt-1 tabular-nums">
              {topics.length} active topics
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500">Topics Completed</div>
            <div className="font-display font-bold text-2xl tabular-nums text-slate-900 mt-1">
              {completedTopics} / {topics.length}
            </div>
            <div className="text-xs text-emerald-700 mt-1">
              Mastery ≥ 80% threshold
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500">Average Mastery</div>
            <div className="font-display font-bold text-2xl tabular-nums text-slate-900 mt-1">
              {avgMastery}%
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Estimated via BKT model
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-slate-500">Quizzes Attempted</div>
            <div className="font-display font-bold text-2xl tabular-nums text-slate-900 mt-1">
              {totalQuizzesAttempted}
            </div>
            <div className="text-xs text-slate-500 mt-1">
              Across all subjects
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Learning Progress + Today's Study Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Learning Progress */}
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-base text-slate-900">
                Learning Progress
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Overall topic mastery and 6-week quiz performance trend
              </p>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs font-medium text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 whitespace-nowrap shrink-0"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 pt-1">
            <div className="flex flex-col items-center text-center shrink-0 sm:pr-6 sm:border-r sm:border-slate-200">
              <CircularProgress value={avgMastery} size={136} strokeWidth={11} label="Overall Mastery" />
              <div className="mt-3 text-xs text-slate-600 tabular-nums">
                {completedTopics} Strong · {topics.filter((t) => t.mastery < 40).length} Weak
              </div>
            </div>

            <div className="flex-1 w-full min-w-0">
              <WeeklyPerformanceChart data={weeklyPerformance} height={195} />
            </div>
          </div>
        </section>

        {/* Today's Study Tasks */}
        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-display font-semibold text-base text-slate-900">
                  Today’s Study Tasks
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Monday schedule · Prioritized by mastery gap
                </p>
              </div>
              <button
                onClick={() => onNavigate('study-planner')}
                className="text-xs font-medium text-indigo-700 hover:text-indigo-900 whitespace-nowrap shrink-0"
              >
                Weekly Planner
              </button>
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
              {todaysTasks.length > 0 ? (
                todaysTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                  >
                    <label className="flex items-start gap-3 min-w-0 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => onToggleTask(task.id)}
                        className="mt-1 rounded border-slate-300 text-indigo-700 focus:ring-indigo-600 cursor-pointer"
                      />
                      <div className="min-w-0">
                        <div
                          className={`text-sm font-medium truncate ${
                            task.completed
                              ? 'line-through text-slate-400'
                              : 'text-slate-900'
                          }`}
                        >
                          {task.topicName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5 tabular-nums">
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {task.durationMinutes} min
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{task.activityType}</span>
                        </div>
                      </div>
                    </label>

                    <button
                      onClick={() => onStartQuiz(task.topicId)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                    >
                      <Play className="w-3 h-3" />
                      <span>Start Learning</span>
                    </button>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-slate-500">
                  No tasks scheduled for today. Generate an adaptive plan in Study Planner.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Weak Topics + Recent Quiz Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weak Topics */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-base text-slate-900">
                Weak Topics Requiring Attention
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Topics below 60% mastery prioritized for practice
              </p>
            </div>
            <button
              onClick={() => onNavigate('weak-topics')}
              className="text-xs font-medium text-indigo-700 hover:text-indigo-900 whitespace-nowrap shrink-0"
            >
              View All Weak Topics
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
            {weakTopics.length > 0 ? (
              weakTopics.map((topic) => (
                <div
                  key={topic.id}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-sm font-semibold text-slate-900 truncate">
                        {topic.name}
                      </span>
                      <StatusLabel mastery={topic.mastery} />
                    </div>
                    <div className="text-xs text-slate-500 tabular-nums">
                      {subjectNameMap.get(topic.subjectId) ?? 'General'} · Mastery{' '}
                      <span className="font-mono font-semibold text-slate-800">
                        {topic.mastery}%
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onStartQuiz(topic.id)}
                    className="px-3.5 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
                  >
                    Practice Now
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-emerald-700">
                All topics are currently at 60% mastery or higher. Great work!
              </div>
            )}
          </div>
        </section>

        {/* Recent Quiz Activity */}
        <section className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-base text-slate-900">
                Recent Quiz Activity
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest completed topic quizzes and scores
              </p>
            </div>
            <button
              onClick={() => onNavigate('practice-quiz')}
              className="text-xs font-medium text-indigo-700 hover:text-indigo-900 whitespace-nowrap shrink-0"
            >
              Take New Quiz
            </button>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
            {recentQuizzes.map((attempt) => (
              <div
                key={attempt.id}
                className="p-3.5 flex items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate">
                    {attempt.topicName}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5 tabular-nums">
                    Score{' '}
                    <span className="font-mono font-semibold text-slate-800">
                      {attempt.score}%
                    </span>{' '}
                    · {attempt.date}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAttempt(attempt)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  View Results
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* BKT Visualization Section */}
      <BktVisualization topics={topics} />

      <QuizResultModal
        attempt={selectedAttempt}
        onClose={() => setSelectedAttempt(null)}
        onPracticeAgain={onStartQuiz}
      />
    </div>
  );
};
