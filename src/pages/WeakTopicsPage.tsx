import React, { useState } from 'react';
import { Clock, Play } from 'lucide-react';
import {
  MasteryBar,
  StatusLabel,
  WeakTopicsBarChart,
} from '../components/ui/ChartsAndGauges';
import { Subject, Topic } from '../types';
import {
  getMasteryStatus,
  getRecommendedActivity,
  getRecommendedDurationMinutes,
} from '../utils/bkt';

interface WeakTopicsPageProps {
  subjects: Subject[];
  topics: Topic[];
  onPracticeNow: (topicId: string) => void;
}

export const WeakTopicsPage: React.FC<WeakTopicsPageProps> = ({
  subjects,
  topics,
  onPracticeNow,
}) => {
  const [thresholdFilter, setThresholdFilter] = useState<'below60' | 'below80'>('below60');
  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));

  const maxThreshold = thresholdFilter === 'below60' ? 60 : 80;
  const weakList = [...topics]
    .filter((t) => t.mastery < maxThreshold)
    .sort((a, b) => a.mastery - b.mastery);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900">
            Weak & Priority Topics
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Topics identified by Bayesian Knowledge Tracing as needing targeted study sessions.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-lg self-start sm:self-center">
          <button
            onClick={() => setThresholdFilter('below60')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              thresholdFilter === 'below60'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Weak & Needs Practice (&lt;60%)
          </button>
          <button
            onClick={() => setThresholdFilter('below80')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
              thresholdFilter === 'below80'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Below Strong (&lt;80%)
          </button>
        </div>
      </div>

      {/* Chart showing weakest topics */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <h3 className="font-display font-semibold text-base text-slate-900">
            Weakest Topics Benchmark Chart
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Comparing lowest BKT mastery topics against the 80% Strong mastery threshold
          </p>
        </div>
        <WeakTopicsBarChart topics={topics} targetThreshold={80} />
      </div>

      {/* Weak Topic Cards */}
      {weakList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weakList.map((topic) => {
            const meta = getMasteryStatus(topic.mastery);
            const recDuration = getRecommendedDurationMinutes(topic.mastery);
            const recActivity = getRecommendedActivity(topic.mastery);

            return (
              <div
                key={topic.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1">
                    <div className="text-xs text-slate-500">
                      {subjectMap.get(topic.subjectId) ?? 'Coursework'} · Priority{' '}
                      <span
                        className={
                          meta.priority === 'High'
                            ? 'text-red-700 font-semibold'
                            : 'text-amber-700 font-semibold'
                        }
                      >
                        {meta.priority}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-base text-slate-900">
                      {topic.name}
                    </h3>
                  </div>
                  <StatusLabel mastery={topic.mastery} />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Current Mastery</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-900">
                      {topic.mastery}%
                    </span>
                  </div>
                  <MasteryBar mastery={topic.mastery} heightClass="h-2.5" />
                </div>

                <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-slate-600 flex items-center gap-2 tabular-nums">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Recommended: {recDuration} min · {recActivity}</span>
                  </div>

                  <button
                    onClick={() => onPracticeNow(topic.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Practice Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-emerald-700">
          Every topic in your curriculum meets or exceeds this mastery threshold!
        </div>
      )}
    </div>
  );
};
