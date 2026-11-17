import {
  DayOfWeek,
  MasteryStatus,
  PriorityLevel,
  StudyTask,
  Subject,
  Topic,
} from '../types';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export interface MasteryStyleMeta {
  status: MasteryStatus;
  textColor: string;
  barColor: string;
  strokeColor: string;
  surfaceTint: string;
  borderTint: string;
  priority: PriorityLevel;
}

export function getMasteryStatus(mastery: number): MasteryStyleMeta {
  if (mastery >= 80) {
    return {
      status: 'Strong',
      textColor: 'text-emerald-700',
      barColor: 'bg-emerald-600',
      strokeColor: '#16A34A',
      surfaceTint: 'bg-emerald-50',
      borderTint: 'border-emerald-200',
      priority: 'Low',
    };
  }
  if (mastery >= 60) {
    return {
      status: 'Improving',
      textColor: 'text-blue-700',
      barColor: 'bg-blue-600',
      strokeColor: '#2563EB',
      surfaceTint: 'bg-blue-50',
      borderTint: 'border-blue-200',
      priority: 'Medium',
    };
  }
  if (mastery >= 40) {
    return {
      status: 'Needs Practice',
      textColor: 'text-amber-700',
      barColor: 'bg-amber-600',
      strokeColor: '#D97706',
      surfaceTint: 'bg-amber-50',
      borderTint: 'border-amber-200',
      priority: 'Medium',
    };
  }
  return {
    status: 'Weak',
    textColor: 'text-red-700',
    barColor: 'bg-red-600',
    strokeColor: '#DC2626',
    surfaceTint: 'bg-red-50',
    borderTint: 'border-red-200',
    priority: 'High',
  };
}

export interface BktStepTrace {
  step: number;
  isCorrect: boolean;
  prior: number;
  posteriorGivenObs: number;
  updatedMastery: number;
}

/**
 * Standard Bayesian Knowledge Tracing (BKT) posterior mastery updater.
 *
 * Given P(L_{t-1}), P(T), P(G), P(S) and a sequence of binary quiz responses:
 * - P(L_{t-1} | Correct)   = [P(L) * (1 - P(S))] / [P(L)*(1 - P(S)) + (1 - P(L))*P(G)]
 * - P(L_{t-1} | Incorrect) = [P(L) * P(S)] / [P(L)*P(S) + (1 - P(L))*(1 - P(G))]
 * - P(L_t)                 = P(L_{t-1} | Obs) + (1 - P(L_{t-1} | Obs)) * P(T)
 */
export function runBktSequence(
  initialMasteryPct: number,
  responses: boolean[],
  params: { pTransit: number; pGuess: number; pSlip: number }
): { finalMasteryPct: number; trace: BktStepTrace[] } {
  let pL = Math.max(0.05, Math.min(0.99, initialMasteryPct / 100));
  const { pTransit, pGuess, pSlip } = params;
  const trace: BktStepTrace[] = [];

  responses.forEach((isCorrect, index) => {
    const prior = pL;
    let pLGivenObs: number;

    if (isCorrect) {
      const numerator = pL * (1 - pSlip);
      const denominator = numerator + (1 - pL) * pGuess;
      pLGivenObs = denominator > 0 ? numerator / denominator : pL;
    } else {
      const numerator = pL * pSlip;
      const denominator = numerator + (1 - pL) * (1 - pGuess);
      pLGivenObs = denominator > 0 ? numerator / denominator : pL;
    }

    const updated = pLGivenObs + (1 - pLGivenObs) * pTransit;
    pL = Math.max(0.08, Math.min(0.99, updated));

    trace.push({
      step: index + 1,
      isCorrect,
      prior: Math.round(prior * 100),
      posteriorGivenObs: Math.round(pLGivenObs * 100),
      updatedMastery: Math.round(pL * 100),
    });
  });

  return {
    finalMasteryPct: Math.round(pL * 100),
    trace,
  };
}

export function getRecommendedDurationMinutes(mastery: number): number {
  if (mastery < 40) return 60;
  if (mastery < 60) return 45;
  if (mastery < 80) return 30;
  return 20;
}

export function getRecommendedActivity(
  mastery: number
): 'Concept Review' | 'Practice Quiz' | 'Problem Set' | 'Spaced Repetition' {
  if (mastery < 40) return 'Concept Review';
  if (mastery < 60) return 'Problem Set';
  if (mastery < 80) return 'Practice Quiz';
  return 'Spaced Repetition';
}

/**
 * Generates a balanced, adaptive 7-day study schedule (Monday - Sunday)
 * allocating more sessions and longer blocks to weaker topics while keeping
 * strong topics refreshed via spaced repetition.
 */
export function generateAdaptiveStudyPlan(
  subjects: Subject[],
  topics: Topic[],
  dailyGoalMinutes: number
): StudyTask[] {
  if (topics.length === 0) return [];

  const subjectMap = new Map(subjects.map((s) => [s.id, s.name]));
  const sortedByWeakness = [...topics].sort((a, b) => a.mastery - b.mastery);

  // Build weighted session pool: weak topics appear 3x, needs-practice 2x, improving 1-2x, strong 1x
  const pool: Topic[] = [];
  for (const topic of sortedByWeakness) {
    if (topic.mastery < 40) {
      pool.push(topic, topic, topic);
    } else if (topic.mastery < 60) {
      pool.push(topic, topic);
    } else if (topic.mastery < 80) {
      pool.push(topic, topic);
    } else {
      pool.push(topic);
    }
  }

  const tasks: StudyTask[] = [];
  let poolIndex = 0;

  DAYS_OF_WEEK.forEach((day, dayIdx) => {
    let remaining = Math.max(45, dailyGoalMinutes);
    const usedTopicsToday = new Set<string>();
    let safetyCounter = 0;

    // Sunday is lighter review day (70% of daily goal)
    if (day === 'Sunday') {
      remaining = Math.round(remaining * 0.7);
    }

    while (remaining >= 20 && safetyCounter < pool.length * 2) {
      const candidate = pool[poolIndex % pool.length];
      poolIndex += 1;
      safetyCounter += 1;

      if (usedTopicsToday.has(candidate.id) && usedTopicsToday.size < topics.length) {
        continue;
      }

      const idealDuration = getRecommendedDurationMinutes(candidate.mastery);
      const duration = Math.min(idealDuration, Math.max(20, remaining));
      const meta = getMasteryStatus(candidate.mastery);

      usedTopicsToday.add(candidate.id);
      remaining -= duration;

      tasks.push({
        id: `plan-${day.toLowerCase()}-${candidate.id}-${dayIdx}-${tasks.length}`,
        day,
        topicId: candidate.id,
        topicName: candidate.name,
        subjectName: subjectMap.get(candidate.subjectId) ?? 'General',
        durationMinutes: duration,
        priority: meta.priority,
        completed: false,
        activityType: getRecommendedActivity(candidate.mastery),
      });

      if (usedTopicsToday.size >= 3) break; // keep each day focused (max 3 tasks/day)
    }
  });

  return tasks;
}
