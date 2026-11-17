import React, { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Play,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import {
  CircularProgress,
  StatusLabel,
} from '../components/ui/ChartsAndGauges';
import { getQuestionsForTopic } from '../data/initialData';
import { PageRoute, QuizAnswerRecord, QuizAttempt, Subject, Topic } from '../types';
import { runBktSequence } from '../utils/bkt';

interface PracticeQuizPageProps {
  subjects: Subject[];
  topics: Topic[];
  activeTopicId: string | null;
  onSelectTopic: (topicId: string) => void;
  onQuizCompleted: (attempt: QuizAttempt, updatedMastery: number) => void;
  onNavigate: (route: PageRoute) => void;
}

export const PracticeQuizPage: React.FC<PracticeQuizPageProps> = ({
  subjects,
  topics,
  activeTopicId,
  onSelectTopic,
  onQuizCompleted,
  onNavigate,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(
    activeTopicId ?? topics[0]?.id ?? ''
  );
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submittedAttempt, setSubmittedAttempt] = useState<QuizAttempt | null>(null);
  const [bktTrace, setBktTrace] = useState<
    { step: number; isCorrect: boolean; prior: number; updatedMastery: number }[]
  >([]);

  const effectiveTopicId = activeTopicId || selectedTopicId;
  const topic = topics.find((t) => t.id === effectiveTopicId) ?? topics[0];
  const subject = subjects.find((s) => s.id === topic?.subjectId);

  const questions = useMemo(() => {
    if (!topic) return [];
    return getQuestionsForTopic(topic, subject?.name ?? 'Coursework');
  }, [topic, subject]);

  const handleSwitchTopic = (newTopicId: string) => {
    setSelectedTopicId(newTopicId);
    onSelectTopic(newTopicId);
    setCurrentIdx(0);
    setAnswers({});
    setConfirmOpen(false);
    setSubmittedAttempt(null);
    setBktTrace([]);
  };

  if (!topic) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-10 text-center text-sm text-slate-500">
        Add a subject and topic first to start practicing quizzes.
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPct = Math.round(((currentIdx + 1) / totalQuestions) * 100);

  const finalizeQuizSubmission = () => {
    const answerRecords: QuizAnswerRecord[] = questions.map((q, idx) => {
      const selected = answers[idx] ?? -1;
      const isCorrect = selected === q.correctIndex;
      return {
        questionId: q.id,
        prompt: q.prompt,
        options: q.options,
        selectedIndex: selected,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const correctCount = answerRecords.filter((a) => a.isCorrect).length;
    const score = Math.round((correctCount / totalQuestions) * 100);
    const masteryBefore = topic.mastery;

    const bktResult = runBktSequence(
      masteryBefore,
      answerRecords.map((a) => a.isCorrect),
      topic.bktParams
    );

    const attempt: QuizAttempt = {
      id: `att-${Date.now()}`,
      topicId: topic.id,
      topicName: topic.name,
      subjectName: subject?.name ?? 'General',
      score,
      correctCount,
      totalQuestions,
      date: 'Nov 17, 2026',
      masteryBefore,
      masteryAfter: bktResult.finalMasteryPct,
      answers: answerRecords,
    };

    setBktTrace(bktResult.trace);
    setSubmittedAttempt(attempt);
    setConfirmOpen(false);
    onQuizCompleted(attempt, bktResult.finalMasteryPct);
  };

  // Post-Submission Results View
  if (submittedAttempt) {
    const delta = submittedAttempt.masteryAfter - submittedAttempt.masteryBefore;
    const incorrectCount =
      submittedAttempt.totalQuestions - submittedAttempt.correctCount;

    const feedback =
      submittedAttempt.score >= 75
        ? 'Strong conceptual recall! Your BKT posterior mastery climbed significantly. Keep spacing out reviews to lock in retention.'
        : submittedAttempt.score >= 50
          ? 'Solid partial understanding, though a few key concepts need reinforcement. Review the missed explanations below before re-testing.'
          : 'This topic needs focused concept review before another timed quiz. Check the explanations below and schedule a 45–60 min study block.';

    const nextAction =
      submittedAttempt.masteryAfter < 60
        ? {
            label: 'Schedule Extra Review in Study Planner',
            route: 'study-planner' as PageRoute,
          }
        : {
            label: 'Inspect Weak Topics Queue',
            route: 'weak-topics' as PageRoute,
          };

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <p className="text-xs text-slate-500">
                {submittedAttempt.subjectName} · Quiz Completed
              </p>
              <h2 className="font-display font-bold text-2xl text-slate-900 mt-0.5">
                {submittedAttempt.topicName}
              </h2>
            </div>
            <StatusLabel mastery={submittedAttempt.masteryAfter} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-4">
              <CircularProgress value={submittedAttempt.score} size={76} strokeWidth={7} />
              <div>
                <div className="text-xs text-slate-500">Total Score</div>
                <div className="font-display font-bold text-lg text-slate-900 tabular-nums">
                  {submittedAttempt.correctCount} / {submittedAttempt.totalQuestions}
                </div>
                <div className="text-xs text-slate-600 tabular-nums">
                  {submittedAttempt.correctCount} correct · {incorrectCount} incorrect
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-center">
              <div className="text-xs text-slate-500">Topic Mastery Update (BKT)</div>
              <div className="font-mono font-bold text-2xl tabular-nums text-indigo-700 mt-1">
                {submittedAttempt.masteryBefore}% → {submittedAttempt.masteryAfter}%
              </div>
              <div className="text-xs text-slate-600 mt-1 tabular-nums">
                {delta >= 0 ? `+${delta}% mastery gain` : `${delta}% mastery adjustment`}
              </div>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col justify-between gap-2">
              <div className="text-xs text-slate-500">Recommended Next Action</div>
              <p className="text-xs text-slate-700 leading-relaxed">{feedback}</p>
            </div>
          </div>

          {/* Step-by-step BKT Posterior Trace */}
          {bktTrace.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-900">
                Bayesian Knowledge Tracing Step-by-Step Update
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {bktTrace.map((step) => (
                  <div
                    key={step.step}
                    className="p-3 rounded-lg border border-slate-200 bg-white text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-700">Q{step.step}</span>
                      <span
                        className={
                          step.isCorrect
                            ? 'text-emerald-700 font-medium'
                            : 'text-red-700 font-medium'
                        }
                      >
                        {step.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                    <div className="font-mono tabular-nums text-slate-600">
                      {step.prior}% → <strong className="text-slate-900">{step.updatedMastery}%</strong>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Answer Review */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">
              Answer Explanations
            </h3>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-xl">
              {submittedAttempt.answers.map((ans, i) => (
                <div key={ans.questionId} className="p-4 space-y-2">
                  <div className="flex items-start gap-2.5">
                    {ans.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                    )}
                    <div className="text-sm font-medium text-slate-900">
                      {i + 1}. {ans.prompt}
                    </div>
                  </div>
                  <div className="pl-6 text-xs space-y-1 text-slate-600">
                    <div>
                      Selected:{' '}
                      <span
                        className={
                          ans.isCorrect
                            ? 'text-emerald-700 font-medium'
                            : 'text-red-700 font-medium'
                        }
                      >
                        {ans.selectedIndex >= 0
                          ? ans.options[ans.selectedIndex]
                          : 'No option selected'}
                      </span>
                    </div>
                    {!ans.isCorrect && (
                      <div>
                        Correct answer:{' '}
                        <span className="text-emerald-700 font-medium">
                          {ans.options[ans.correctIndex]}
                        </span>
                      </div>
                    )}
                    <p className="text-slate-500 pt-0.5">{ans.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => handleSwitchTopic(topic.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Quiz</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => onNavigate(nextAction.route)}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
              >
                <span>{nextAction.label}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Topic Selector Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-slate-500 truncate">
              {subject?.name ?? 'Subject'} · Current Mastery {topic.mastery}%
            </div>
            <div className="font-display font-semibold text-base text-slate-900 truncate">
              {topic.name}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="quiz-topic-select" className="text-xs text-slate-500">
            Topic:
          </label>
          <select
            id="quiz-topic-select"
            value={topic.id}
            onChange={(e) => handleSwitchTopic(e.target.value)}
            className="text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 max-w-[240px] focus:outline-none focus:border-indigo-600"
          >
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.mastery}%)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Interactive Quiz Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        {/* Progress Header */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs sm:text-sm">
            <span className="font-medium text-slate-700 tabular-nums">
              Question {currentIdx + 1} of {totalQuestions}
            </span>
            <span className="text-slate-500 font-mono tabular-nums">
              {answeredCount}/{totalQuestions} answered · {progressPct}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-700 rounded-full transition-[width] duration-200"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Question Prompt */}
        <div className="space-y-4 pt-2">
          <h2 className="font-display font-semibold text-lg sm:text-xl text-slate-900 leading-snug">
            {currentQuestion.prompt}
          </h2>

          {/* Four Answer Options */}
          <div className="space-y-3" role="radiogroup" aria-label="Answer options">
            {currentQuestion.options.map((opt, optIdx) => {
              const isSelected = answers[currentIdx] === optIdx;
              const letter = ['A', 'B', 'C', 'D'][optIdx];
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() =>
                    setAnswers((prev) => ({ ...prev, [currentIdx]: optIdx }))
                  }
                  className={`w-full text-left p-4 rounded-xl border transition-colors flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 text-slate-900'
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-semibold flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected
                        ? 'bg-indigo-700 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="text-sm sm:text-base leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3">
            {currentIdx < totalQuestions - 1 ? (
              <button
                type="button"
                onClick={() =>
                  setCurrentIdx((i) => Math.min(totalQuestions - 1, i + 1))
                }
                className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="inline-flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Submit Quiz</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quiz Completion Confirmation Modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirm quiz submission"
        >
          <div className="bg-white border border-slate-200 rounded-xl w-full max-w-md p-6 space-y-4 shadow-lg">
            <h3 className="font-display font-semibold text-lg text-slate-900">
              Submit Practice Quiz?
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              You have answered{' '}
              <span className="font-mono font-semibold text-slate-900">
                {answeredCount} of {totalQuestions}
              </span>{' '}
              questions for <span className="font-medium">{topic.name}</span>.
              {answeredCount < totalQuestions &&
                ' Unanswered questions will be marked incorrect in your Bayesian Knowledge Tracing update.'}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                Review Answers
              </button>
              <button
                type="button"
                onClick={finalizeQuizSubmission}
                className="px-4 py-2 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg"
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
