import React from 'react';
import { CheckCircle2, X, XCircle } from 'lucide-react';
import { QuizAttempt } from '../../types';
import { StatusLabel } from './ChartsAndGauges';

interface QuizResultModalProps {
  attempt: QuizAttempt | null;
  onClose: () => void;
  onPracticeAgain: (topicId: string) => void;
}

export const QuizResultModal: React.FC<QuizResultModalProps> = ({
  attempt,
  onClose,
  onPracticeAgain,
}) => {
  if (!attempt) return null;

  const delta = attempt.masteryAfter - attempt.masteryBefore;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-[1px] p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Quiz results details"
    >
      <div className="bg-white border border-slate-200 rounded-xl w-full max-w-2xl max-h-[88vh] flex flex-col overflow-hidden shadow-lg">
        <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-slate-200">
          <div>
            <p className="text-xs text-slate-500">
              {attempt.subjectName} · {attempt.date}
            </p>
            <h3 className="text-lg font-display font-semibold text-slate-900 mt-0.5">
              {attempt.topicName} — Quiz Summary
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <div className="text-xs text-slate-500">Quiz Score</div>
              <div className="text-2xl font-display font-bold tabular-nums text-slate-900 mt-1">
                {attempt.score}%
              </div>
              <div className="text-xs text-slate-600 mt-0.5 tabular-nums">
                {attempt.correctCount} of {attempt.totalQuestions} correct
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50">
              <div className="text-xs text-slate-500">BKT Mastery Update</div>
              <div className="text-2xl font-display font-bold tabular-nums text-indigo-700 mt-1">
                {attempt.masteryBefore}% → {attempt.masteryAfter}%
              </div>
              <div className="text-xs text-slate-600 mt-0.5 tabular-nums">
                {delta >= 0 ? `+${delta}% posterior gain` : `${delta}% posterior shift`}
              </div>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between">
              <div className="text-xs text-slate-500">Updated Status</div>
              <div className="mt-1">
                <StatusLabel mastery={attempt.masteryAfter} />
              </div>
              <div className="text-xs text-slate-500 mt-1">Bayesian estimate</div>
            </div>
          </div>

          {attempt.answers.length > 0 ? (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-900">
                Question-by-Question Review
              </h4>
              <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg">
                {attempt.answers.map((ans, idx) => (
                  <div key={ans.questionId} className="p-4 space-y-2">
                    <div className="flex items-start gap-2.5">
                      {ans.isCorrect ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                      )}
                      <div className="text-sm font-medium text-slate-900">
                        {idx + 1}. {ans.prompt}
                      </div>
                    </div>
                    <div className="pl-6 text-xs space-y-1 text-slate-600">
                      <div>
                        Your answer:{' '}
                        <span
                          className={
                            ans.isCorrect
                              ? 'text-emerald-700 font-medium'
                              : 'text-red-700 font-medium'
                          }
                        >
                          {ans.options[ans.selectedIndex] ?? 'Unanswered'}
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
          ) : (
            <div className="p-4 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-600">
              Detailed answer breakdown is recorded for quizzes completed in the current session. Click{' '}
              <span className="font-medium text-slate-900">Retake Topic Quiz</span> to review all questions live.
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/70 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onPracticeAgain(attempt.topicId);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Retake Topic Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
