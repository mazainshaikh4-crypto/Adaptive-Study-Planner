import React, { useState } from 'react';
import { Clock, HelpCircle, Target, TrendingUp } from 'lucide-react';
import {
  CircularProgress,
  MasteryBar,
  StatusLabel,
  WeeklyPerformanceChart,
} from '../components/ui/ChartsAndGauges';
import {
  QuizAttempt,
  StudyTask,
  Subject,
  Topic,
  WeeklyPerformancePoint,
} from '../types';

interface AnalyticsPageProps {
  subjects: Subject[];
  topics: Topic[];
  quizAttempts: QuizAttempt[];
  studyTasks: StudyTask[];
  weeklyPerformance: WeeklyPerformancePoint[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  subjects,
  topics,
  quizAttempts,
  studyTasks,
  weeklyPerformance,
}) => {
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  const avgMastery =
    topics.length > 0
      ? Math.round(topics.reduce((s, t) => s + t.mastery, 0) / topics.length)
      : 0;

  const avgQuizAccuracy =
    quizAttempts.length > 0
      ? Math.round(
          quizAttempts.reduce((s, a) => s + a.score, 0) / quizAttempts.length
        )
      : 0;

  const totalStudyMinutes = topics.reduce(
    (s, t) => s + t.studyMinutesLogged,
    0
  );
  const completedTaskMinutes = studyTasks
    .filter((t) => t.completed)
    .reduce((s, t) => s + t.durationMinutes, 0);

  const strongCount = topics.filter((t) => t.mastery >= 80).length;
  const improvingCount = topics.filter(
    (t) => t.mastery >= 60 && t.mastery < 80
  ).length;
  const needsPracticeCount = topics.filter(
    (t) => t.mastery >= 40 && t.mastery < 60
  ).length;
  const weakCount = topics.filter((t) => t.mastery < 40).length;

  const filteredTopics =
    subjectFilter === 'all'
      ? topics
      : topics.filter((t) => t.subjectId === subjectFilter);

  const totalTopics = Math.max(1, topics.length);
  const firstWeekMastery = weeklyPerformance[0]?.avgMastery ?? avgMastery;
  const masteryImprovement = avgMastery - firstWeekMastery;

  return (
    <div className="space-y-6">
      {/* Top KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">Overall Mastery</div>
            <div className="font-display font-bold text-2xl tabular-nums text-slate-900 mt-1">
              {avgMastery}%
            </div>
            <div className="text-xs text-emerald-700 mt-1 tabular-nums">
              {masteryImprovement >= 0 ? `+${masteryImprovement}%` : `${masteryImprovement}%`} over 6 weeks
            </div>
          </div>
          <CircularProgress value={avgMastery} size={56} strokeWidth={5} />
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">Quiz Accuracy</div>
            <div className="font-display font-bold text-2xl tabular-nums text-slate-900 mt-1">
              {avgQuizAccuracy}%
            </div>
            <div className="text-xs text-slate-500 mt-1 tabular-nums">
              Across {quizAttempts.length} recorded quizzes
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">Study Time Logged</div>
            <div className="font-display font-bold text-2xl tabular-nums text-slate-900 mt-1">
              {Math.round((totalStudyMinutes / 60) * 10) / 10} hrs
            </div>
            <div className="text-xs text-slate-500 mt-1 tabular-nums">
              +{completedTaskMinutes}m completed this week
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500">Strong vs Weak Ratio</div>
            <div className="font-display font-bold text-2xl tabular-nums text-slate-900 mt-1">
              {strongCount} : {weakCount}
            </div>
            <div className="text-xs text-slate-500 mt-1 tabular-nums">
              {strongCount} Strong · {weakCount} Weak
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Target className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Weekly Quiz Performance Line Chart + Strong vs Weak Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-semibold text-base text-slate-900">
                Weekly Quiz Performance & Improvement Over Time
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comparing weekly quiz scores against average BKT topic mastery
              </p>
            </div>
            <TrendingUp className="w-5 h-5 text-indigo-700 shrink-0" />
          </div>
          <WeeklyPerformanceChart data={weeklyPerformance} height={240} />
        </section>

        <section className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5">
          <div>
            <h3 className="font-display font-semibold text-base text-slate-900">
              Strong vs. Weak Topics Comparison
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Distribution of all {topics.length} tracked topics across mastery tiers
            </p>
          </div>

          {/* Stacked Segmented Comparison Bar */}
          <div className="space-y-2">
            <div className="h-5 w-full rounded-lg overflow-hidden flex bg-slate-100">
              {strongCount > 0 && (
                <div
                  className="bg-emerald-600 h-full"
                  style={{ width: `${(strongCount / totalTopics) * 100}%` }}
                  title={`Strong: ${strongCount}`}
                />
              )}
              {improvingCount > 0 && (
                <div
                  className="bg-blue-600 h-full"
                  style={{ width: `${(improvingCount / totalTopics) * 100}%` }}
                  title={`Improving: ${improvingCount}`}
                />
              )}
              {needsPracticeCount > 0 && (
                <div
                  className="bg-amber-600 h-full"
                  style={{
                    width: `${(needsPracticeCount / totalTopics) * 100}%`,
                  }}
                  title={`Needs Practice: ${needsPracticeCount}`}
                />
              )}
              {weakCount > 0 && (
                <div
                  className="bg-red-600 h-full"
                  style={{ width: `${(weakCount / totalTopics) * 100}%` }}
                  title={`Weak: ${weakCount}`}
                />
              )}
            </div>
          </div>

          {/* Explicit Legend Rows */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg text-sm">
            {[
              {
                label: 'Strong (80–100%)',
                count: strongCount,
                color: 'bg-emerald-600',
              },
              {
                label: 'Improving (60–79%)',
                count: improvingCount,
                color: 'bg-blue-600',
              },
              {
                label: 'Needs Practice (40–59%)',
                count: needsPracticeCount,
                color: 'bg-amber-600',
              },
              {
                label: 'Weak (<40%)',
                count: weakCount,
                color: 'bg-red-600',
              },
            ].map((row) => (
              <div
                key={row.label}
                className="px-4 py-2.5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5 text-slate-700">
                  <span className={`w-2.5 h-2.5 rounded-xs ${row.color}`} />
                  <span>{row.label}</span>
                </div>
                <div className="font-mono text-xs tabular-nums text-slate-900 font-semibold">
                  {row.count} topics ({Math.round((row.count / totalTopics) * 100)}%)
                </div>
              </div>
            ))}
          </div>

          {/* Weekly Study Time Summary */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <span>Latest Weekly Study Volume</span>
            <span className="font-mono font-semibold text-slate-900 tabular-nums">
              {weeklyPerformance[weeklyPerformance.length - 1]?.studyHours ?? 12.6} hrs/week
            </span>
          </div>
        </section>
      </div>

      {/* Topic-wise Mastery Breakdown */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-display font-semibold text-base text-slate-900">
              Topic-Wise Mastery Chart
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Detailed topic mastery percentages and logged study time across courses
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="analytics-subject-filter" className="text-xs text-slate-500">
              Filter Subject:
            </label>
            <select
              id="analytics-subject-filter"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-600"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center py-2 border-b border-slate-100 last:border-b-0"
            >
              <div className="md:col-span-4 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">
                  {topic.name}
                </div>
                <div className="text-xs text-slate-500 tabular-nums">
                  {topic.quizzesAttempted} quizzes · {topic.studyMinutesLogged}m studied
                </div>
              </div>

              <div className="md:col-span-5">
                <MasteryBar mastery={topic.mastery} showPercent heightClass="h-2.5" />
              </div>

              <div className="md:col-span-3 flex md:justify-end">
                <StatusLabel mastery={topic.mastery} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
