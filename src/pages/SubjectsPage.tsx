import React, { useState } from 'react';
import { ArrowRight, Plus, X } from 'lucide-react';
import { MasteryBar, StatusLabel } from '../components/ui/ChartsAndGauges';
import { SubjectIcon } from '../components/ui/SubjectIcon';
import { Subject, SubjectIconName, Topic } from '../types';

interface SubjectsPageProps {
  subjects: Subject[];
  topics: Topic[];
  onViewTopics: (subjectId: string) => void;
  onAddSubject: (
    name: string,
    code: string,
    icon: SubjectIconName,
    description: string,
    initialTopics: string[]
  ) => void;
}

const ICON_OPTIONS: { value: SubjectIconName; label: string }[] = [
  { value: 'code', label: 'Programming' },
  { value: 'database', label: 'Databases' },
  { value: 'brain', label: 'AI / ML' },
  { value: 'network', label: 'Networks' },
  { value: 'cpu', label: 'Systems' },
  { value: 'calculator', label: 'Mathematics' },
  { value: 'layers', label: 'Architecture' },
  { value: 'book', label: 'General Study' },
];

export const SubjectsPage: React.FC<SubjectsPageProps> = ({
  subjects,
  topics,
  onViewTopics,
  onAddSubject,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [icon, setIcon] = useState<SubjectIconName>('cpu');
  const [description, setDescription] = useState('');
  const [topicsInput, setTopicsInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const parsedTopics = topicsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    onAddSubject(
      name.trim(),
      code.trim() || 'CS 101',
      icon,
      description.trim() || 'Personalized college coursework and topic mastery.',
      parsedTopics.length > 0 ? parsedTopics : ['Core Fundamentals', 'Applied Concepts']
    );
    setName('');
    setCode('');
    setDescription('');
    setTopicsInput('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-bold text-xl text-slate-900">
            My Academic Subjects
          </h2>
          <p className="text-sm text-slate-600 mt-0.5">
            Select a course to inspect topic mastery states or add a new subject to your semester plan.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subject</span>
        </button>
      </div>

      {/* Subject Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {subjects.map((subject) => {
          const subjectTopics = topics.filter((t) => t.subjectId === subject.id);
          const avgMastery =
            subjectTopics.length > 0
              ? Math.round(
                  subjectTopics.reduce((sum, t) => sum + t.mastery, 0) /
                    subjectTopics.length
                )
              : 0;
          const weakCount = subjectTopics.filter((t) => t.mastery < 60).length;

          return (
            <div
              key={subject.id}
              className="bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between space-y-5 hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
                      <SubjectIcon name={subject.icon} className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-mono text-slate-500">
                        {subject.code} · {subjectTopics.length} topics
                      </div>
                      <h3 className="font-display font-semibold text-lg text-slate-900 truncate">
                        {subject.name}
                      </h3>
                    </div>
                  </div>
                  <StatusLabel mastery={avgMastery} />
                </div>

                <p className="text-sm text-slate-600 leading-relaxed">
                  {subject.description}
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">Overall Mastery</span>
                    <span className="font-mono font-semibold tabular-nums text-slate-900">
                      {avgMastery}%
                    </span>
                  </div>
                  <MasteryBar mastery={avgMastery} heightClass="h-2.5" />
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-500 tabular-nums">
                    {weakCount > 0
                      ? `${weakCount} topic${weakCount > 1 ? 's' : ''} below 60%`
                      : 'All topics on track'}
                  </span>
                  <button
                    onClick={() => onViewTopics(subject.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors whitespace-nowrap shrink-0"
                  >
                    <span>View Topics</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subject Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Add new subject"
        >
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-lg overflow-hidden shadow-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="font-display font-semibold text-lg text-slate-900">
                Add New Subject
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Operating Systems"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="CS 350"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Subject Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {ICON_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setIcon(opt.value)}
                      className={`p-2.5 rounded-lg border text-xs font-medium flex flex-col items-center gap-1.5 transition-colors ${
                        icon === opt.value
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <SubjectIcon name={opt.value} className="w-4 h-4" />
                      <span className="truncate max-w-full">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Initial Topics (comma-separated)
                </label>
                <input
                  type="text"
                  value={topicsInput}
                  onChange={(e) => setTopicsInput(e.target.value)}
                  placeholder="Process Scheduling, Deadlocks, Virtual Memory"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Key syllabus focus areas..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
                >
                  Create Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
