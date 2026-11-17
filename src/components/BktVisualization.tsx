import React, { useState } from 'react';
import { Brain, CheckCircle2, RotateCcw, XCircle } from 'lucide-react';
import { Topic } from '../types';
import { runBktSequence } from '../utils/bkt';
import { CircularProgress, MasteryBar, StatusLabel } from './ui/ChartsAndGauges';

interface BktVisualizationProps {
  topics?: Topic[];
  compact?: boolean;
}

const REFERENCE_BKT_ROWS = [
  { name: 'Python Basics', mastery: 90, status: 'Strong' },
  { name: 'OOP', mastery: 45, status: 'Needs Practice' },
  { name: 'SQL', mastery: 75, status: 'Improving' },
  { name: 'Machine Learning', mastery: 30, status: 'Weak' },
];

export const BktVisualization: React.FC<BktVisualizationProps> = ({
  topics,
  compact = false,
}) => {
  // Interactive BKT Simulator state
  const [simPrior, setSimPrior] = useState(45);
  const [simResponses, setSimResponses] = useState<boolean[]>([true, false, true]);

  const simResult = runBktSequence(simPrior, simResponses, {
    pTransit: 0.22,
    pGuess: 0.2,
    pSlip: 0.1,
  });

  const displayRows =
    topics && topics.length > 0
      ? [
          topics.find((t) => t.id === 'top-python-basics') ?? topics[0],
          topics.find((t) => t.id === 'top-oop') ?? topics[1],
          topics.find((t) => t.id === 'top-sql') ?? topics[2],
          topics.find((t) => t.id === 'top-ml') ?? topics[3],
        ].filter(Boolean)
      : null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-semibold text-base text-slate-900">
              Bayesian Knowledge Tracing (BKT) Mastery Engine
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Estimates latent topic mastery P(L) after every quiz response using learning transition P(T), guess P(G), and slip P(S) probabilities.
            </p>
          </div>
        </div>
        <div className="font-mono text-xs text-slate-500 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 shrink-0">
          P(T)=0.22 · P(G)=0.20 · P(S)=0.10
        </div>
      </div>

      <div className={`grid grid-cols-1 ${compact ? '' : 'lg:grid-cols-12'} gap-6 items-start`}>
        {/* Left: Mastery Table with Circular + Horizontal Bars */}
        <div className={compact ? '' : 'lg:col-span-7'}>
          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500">
                  <th className="py-2.5 px-4">Topic</th>
                  <th className="py-2.5 px-4">Mastery</th>
                  <th className="py-2.5 px-4 hidden sm:table-cell w-40">Progress</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {(displayRows ?? REFERENCE_BKT_ROWS).map((row) => {
                  const name = 'id' in row ? row.name : row.name;
                  const mastery = row.mastery;
                  return (
                    <tr key={name} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {name}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <CircularProgress value={mastery} size={40} strokeWidth={4} />
                        </div>
                      </td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <MasteryBar mastery={mastery} />
                      </td>
                      <td className="py-3 px-4">
                        <StatusLabel mastery={mastery} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Interactive BKT Posterior Simulator */}
        <div className={`${compact ? '' : 'lg:col-span-5'} bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-slate-900">
              Interactive BKT Posterior Simulator
            </span>
            <button
              onClick={() => {
                setSimPrior(45);
                setSimResponses([true, false, true]);
              }}
              className="text-xs text-slate-600 hover:text-indigo-700 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <label htmlFor="bkt-prior-slider">Initial Prior P(L₀)</label>
              <span className="font-mono font-semibold tabular-nums text-slate-900">
                {simPrior}%
              </span>
            </div>
            <input
              id="bkt-prior-slider"
              type="range"
              min={15}
              max={85}
              value={simPrior}
              onChange={(e) => setSimPrior(Number(e.target.value))}
              className="w-full accent-indigo-700 cursor-pointer"
            />
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-600">
              Simulate Quiz Answers (click to toggle Correct / Incorrect):
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {simResponses.map((isCorrect, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setSimResponses((prev) =>
                      prev.map((v, i) => (i === idx ? !v : v))
                    )
                  }
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-red-50 border-red-200 text-red-800 hover:bg-red-100'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  <span>Q{idx + 1}: {isCorrect ? 'Correct' : 'Wrong'}</span>
                </button>
              ))}
              {simResponses.length < 5 && (
                <button
                  onClick={() => setSimResponses((prev) => [...prev, true])}
                  className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  + Add Q
                </button>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-500">Posterior Mastery P(Lₙ)</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-xl font-bold tabular-nums text-indigo-700">
                  {simPrior}% → {simResult.finalMasteryPct}%
                </span>
                <StatusLabel mastery={simResult.finalMasteryPct} />
              </div>
            </div>
            <CircularProgress value={simResult.finalMasteryPct} size={64} strokeWidth={6} />
          </div>
        </div>
      </div>
    </div>
  );
};
