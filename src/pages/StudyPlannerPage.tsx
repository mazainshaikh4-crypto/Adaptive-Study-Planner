import React, { useState } from 'react';
import {
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { StatusLabel } from '../components/ui/ChartsAndGauges';
import { DayOfWeek, StudyTask, Subject, Topic } from '../types';
import {
  DAYS_OF_WEEK,
  getRecommendedActivity,
  getRecommendedDurationMinutes,
} from '../utils/bkt';

interface StudyPlannerPageProps {
  subjects: Subject[];
  topics: Topic[];
  studyTasks: StudyTask[];
  dailyGoalMinutes: number;
  onToggleTask: (taskId: string) => void;
  onGeneratePlan: () => void;
  onPracticeTopic: (topicId: string) => void;
}

export const StudyPlannerPage: React.FC<StudyPlannerPageProps> = ({
  subjects,
  topics,
  studyTasks,
  dailyGoalMinutes,
  onToggleTask,
  onGeneratePlan,
  onPracticeTopic,
}) => {
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | 'All'>('All');
  const [planBanner, setPlanBanner] = useState(false);

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  const totalWeeklyMinutes = studyTasks.reduce(
    (sum, t) => sum + t.durationMinutes,
    0
  );
  const completedCount = studyTasks.filter((t) => t.completed).length;

  const priorityTopics = [...topics]
    .filter((t) => t.mastery < 75)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 5);

  const handleRegenerate = () => {
    onGeneratePlan();
    setPlanBanner(true);
    setTimeout(() => setPlanBanner(false), 4500);
  };

  const visibleDays =
    selectedDay === 'All' ? DAYS_OF_WEEK : [selectedDay];

  const priorityStyle = (priority: StudyTask['priority']) => {
    if (priority === 'High') return 'text-red-700 bg-red-50 border-red-200';
    if (priority === 'Medium') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-emerald-700 bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="space-y-6">
      {/* Header + Generate CTA */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-indigo-700">
            <CalendarDays className="w-4 h-4" />
            <span>Dynamic Mastery-Weighted Allocation · Goal {dailyGoalMinutes} min/day</span>
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900">
            Adaptive Weekly Study Planner
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Study time is dynamically allocated based on Bayesian Knowledge Tracing mastery: Weak topics receive longer concept reviews early in the week while Strong topics are scheduled for quick spaced repetition.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-500">Weekly Allocation</div>
            <div className="font-mono font-semibold text-sm tabular-nums text-slate-900">
              {Math.round((totalWeeklyMinutes / 60) * 10) / 10} hrs · {completedCount}/
              {studyTasks.length} done
            </div>
          </div>
          <button
            onClick={handleRegenerate}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Generate Study Plan</span>
          </button>
        </div>
      </div>

      {planBanner && (
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-sm text-emerald-900 flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            Weekly study plan regenerated using your latest BKT topic mastery scores and{' '}
            <strong className="font-mono">{dailyGoalMinutes} min/day</strong> goal.
          </span>
        </div>
      )}

      {/* Day Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg w-fit max-w-full overflow-x-auto">
        <button
          onClick={() => setSelectedDay('All')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
            selectedDay === 'All'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          All Week (Mon–Sun)
        </button>
        {DAYS_OF_WEEK.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              selectedDay === day
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Main Split: Calendar Grid + Recommendation Panel */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Monday to Sunday Schedule */}
        <div className="xl:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleDays.map((day) => {
            const dayTasks = studyTasks.filter((t) => t.day === day);
            const dayTotalMin = dayTasks.reduce(
              (acc, t) => acc + t.durationMinutes,
              0
            );
            const dayDone = dayTasks.filter((t) => t.completed).length;

            return (
              <div
                key={day}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <h3 className="font-display font-semibold text-base text-slate-900">
                      {day}
                    </h3>
                    <div className="text-xs text-slate-500 tabular-nums">
                      {dayTasks.length} sessions · {dayTotalMin} min total
                    </div>
                  </div>
                  <span className="text-xs font-mono tabular-nums text-slate-500">
                    {dayDone}/{dayTasks.length} done
                  </span>
                </div>

                <div className="space-y-3 flex-1">
                  {dayTasks.length > 0 ? (
                    dayTasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3.5 rounded-lg border transition-colors space-y-2 ${
                          task.completed
                            ? 'bg-slate-50 border-slate-200 opacity-75'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <label className="flex items-start gap-2.5 cursor-pointer min-w-0 flex-1">
                            <input
                              type="checkbox"
                              checked={task.completed}
                              onChange={() => onToggleTask(task.id)}
                              className="mt-0.5 rounded border-slate-300 text-indigo-700 focus:ring-indigo-600 cursor-pointer"
                            />
                            <div className="min-w-0">
                              <div
                                className={`text-sm font-medium leading-snug ${
                                  task.completed
                                    ? 'line-through text-slate-400'
                                    : 'text-slate-900'
                                }`}
                              >
                                {task.topicName}
                              </div>
                              <div className="text-xs text-slate-500 mt-0.5 truncate">
                                {task.subjectName}
                              </div>
                            </div>
                          </label>

                          <span
                            className={`px-2 py-0.5 rounded-md border text-[11px] font-medium whitespace-nowrap shrink-0 ${priorityStyle(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>

                        <div className="pl-6 flex items-center justify-between gap-2 text-xs text-slate-500">
                          <span className="inline-flex items-center gap-1 tabular-nums">
                            <Clock className="w-3 h-3" />
                            {task.durationMinutes} min · {task.activityType}
                          </span>
                          <button
                            onClick={() => onPracticeTopic(task.topicId)}
                            className="font-medium text-indigo-700 hover:text-indigo-900 whitespace-nowrap"
                          >
                            Quiz
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-slate-400">
                      Rest & light review day.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Study Recommendation Panel */}
        <aside className="xl:col-span-4 bg-white border border-slate-200 rounded-xl p-6 space-y-5 xl:sticky xl:top-24">
          <div className="flex items-start gap-3 pb-4 border-b border-slate-100">
            <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
              <BookOpenCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-base text-slate-900">
                Study Recommendations
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Suggested revision durations and activities based on BKT mastery
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {priorityTopics.map((topic) => {
              const duration = getRecommendedDurationMinutes(topic.mastery);
              const activity = getRecommendedActivity(topic.mastery);
              return (
                <div
                  key={topic.id}
                  className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/70 space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-slate-900 truncate">
                        {topic.name}
                      </div>
                      <div className="text-xs text-slate-500 truncate">
                        {subjectMap.get(topic.subjectId) ?? 'Coursework'}
                      </div>
                    </div>
                    <StatusLabel mastery={topic.mastery} />
                  </div>

                  <div className="flex items-center justify-between gap-2 text-xs text-slate-600 pt-1">
                    <span className="tabular-nums">
                      Suggested: <strong className="text-slate-900">{duration} min</strong> ·{' '}
                      {activity}
                    </span>
                    <button
                      onClick={() => onPracticeTopic(topic.id)}
                      className="font-semibold text-indigo-700 hover:text-indigo-900 whitespace-nowrap"
                    >
                      Practice →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
};
