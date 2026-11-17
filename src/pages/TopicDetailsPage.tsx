import React, { useState } from 'react';
import { ArrowLeft, Calendar, HelpCircle, Play, Plus, X } from 'lucide-react';
import {
  CircularProgress,
  MasteryBar,
  StatusLabel,
} from '../components/ui/ChartsAndGauges';
import { SubjectIcon } from '../components/ui/SubjectIcon';
import { Subject, Topic } from '../types';
import { getMasteryStatus } from '../utils/bkt';

interface TopicDetailsPageProps {
  subjects: Subject[];
  selectedSubjectId: string;
  topics: Topic[];
  onSelectSubject: (subjectId: string) => void;
  onBackToSubjects: () => void;
  onPracticeQuiz: (topicId: string) => void;
  onAddTopic: (subjectId: string, topicName: string, initialMastery: number) => void;
}

export const TopicDetailsPage: React.FC<TopicDetailsPageProps> = ({
  subjects,
  selectedSubjectId,
  topics,
  onSelectSubject,
  onBackToSubjects,
  onPracticeQuiz,
  onAddTopic,
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | 'Strong' | 'Improving' | 'Needs Practice' | 'Weak'>('All');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState('');
  const [initialMastery, setInitialMastery] = useState(40);

  const subject =
    subjects.find((s) => s.id === selectedSubjectId) ?? subjects[0];

  const subjectTopics = topics.filter((t) => t.subjectId === subject?.id);

  const filteredTopics = subjectTopics.filter((t) => {
    if (filterStatus === 'All') return true;
    return getMasteryStatus(t.mastery).status === filterStatus;
  });

  const avgMastery =
    subjectTopics.length > 0
      ? Math.round(
          subjectTopics.reduce((sum, t) => sum + t.mastery, 0) /
            subjectTopics.length
        )
      : 0;

  const handleAddTopicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !newTopicName.trim()) return;
    onAddTopic(subject.id, newTopicName.trim(), initialMastery);
    setNewTopicName('');
    setInitialMastery(40);
    setAddModalOpen(false);
  };

  if (!subject) return null;

  return (
    <div className="space-y-6">
      {/* Top Back & Subject Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={onBackToSubjects}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to My Subjects</span>
        </button>

        <div className="flex items-center gap-3">
          <label htmlFor="subject-switcher" className="text-xs text-slate-500">
            Switch Subject:
          </label>
          <select
            id="subject-switcher"
            value={subject.id}
            onChange={(e) => onSelectSubject(e.target.value)}
            className="text-sm bg-white border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-600"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Subject Summary Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <SubjectIcon name={subject.icon} className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-mono text-slate-500">
              {subject.code} · {subjectTopics.length} topics tracked
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mt-0.5">
              {subject.name}
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              {subject.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-5 shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
          <CircularProgress value={avgMastery} size={84} strokeWidth={8} label="Avg" />
          <button
            onClick={() => setAddModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Topic</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-200/70 rounded-lg">
          {(['All', 'Strong', 'Improving', 'Needs Practice', 'Weak'] as const).map(
            (tab) => (
              <button
                key={tab}
                onClick={() => setFilterStatus(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                  filterStatus === tab
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-emerald-600" /> Strong (≥80%)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-blue-600" /> Improving (60–79%)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-amber-600" /> Needs Practice (40–59%)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-red-600" /> Weak (&lt;40%)
          </span>
        </div>
      </div>

      {/* Topics List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <h3 className="font-display font-semibold text-base text-slate-900">
                    {topic.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 tabular-nums">
                    <span className="inline-flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5" />
                      {topic.quizzesAttempted} quizzes attempted
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Last practiced {topic.lastPracticed}
                    </span>
                  </div>
                </div>
                <StatusLabel mastery={topic.mastery} />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">BKT Mastery Estimate</span>
                  <span className="font-mono font-semibold tabular-nums text-slate-900">
                    {topic.mastery}%
                  </span>
                </div>
                <MasteryBar mastery={topic.mastery} heightClass="h-2.5" />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs font-mono text-slate-400 tabular-nums">
                  Study logged: {topic.studyMinutesLogged}m
                </span>
                <button
                  onClick={() => onPracticeQuiz(topic.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Practice Quiz</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
            No topics match the selected filter status in {subject.name}.
          </div>
        )}
      </div>

      {/* Add Topic Modal */}
      {addModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-display font-semibold text-lg text-slate-900">
                Add Topic to {subject.name}
              </h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddTopicSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Topic Name
                </label>
                <input
                  type="text"
                  required
                  value={newTopicName}
                  onChange={(e) => setNewTopicName(e.target.value)}
                  placeholder="e.g., ACID Transactions & Locking"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <label className="font-medium text-slate-700">
                    Initial Confidence P(L₀)
                  </label>
                  <span className="font-mono font-semibold tabular-nums text-indigo-700">
                    {initialMastery}%
                  </span>
                </div>
                <input
                  type="range"
                  min={15}
                  max={85}
                  value={initialMastery}
                  onChange={(e) => setInitialMastery(Number(e.target.value))}
                  className="w-full accent-indigo-700"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                >
                  Add Topic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
