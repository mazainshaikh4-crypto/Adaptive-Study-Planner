import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Topic, WeeklyPerformancePoint } from '../../types';
import { getMasteryStatus } from '../../utils/bkt';

export const StatusLabel: React.FC<{ mastery: number }> = ({ mastery }) => {
  const meta = getMasteryStatus(mastery);

  const Icon =
    meta.status === 'Strong'
      ? CheckCircle2
      : meta.status === 'Improving'
        ? TrendingUp
        : meta.status === 'Needs Practice'
          ? AlertTriangle
          : AlertCircle;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium whitespace-nowrap shrink-0 ${meta.surfaceTint} ${meta.borderTint} ${meta.textColor}`}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{meta.status}</span>
    </span>
  );
};

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  colorHex?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 128,
  strokeWidth = 10,
  label,
  colorHex,
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(value)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const stroke = colorHex ?? getMasteryStatus(clamped).strokeColor;

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-300 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className={`font-display font-bold tabular-nums text-slate-900 ${
            size >= 110 ? 'text-2xl' : size >= 70 ? 'text-base' : 'text-xs'
          }`}
        >
          {clamped}%
        </span>
        {label && (
          <span className="text-[11px] text-slate-500 mt-0.5">{label}</span>
        )}
      </div>
    </div>
  );
};

interface MasteryBarProps {
  mastery: number;
  showPercent?: boolean;
  heightClass?: string;
}

export const MasteryBar: React.FC<MasteryBarProps> = ({
  mastery,
  showPercent = false,
  heightClass = 'h-2',
}) => {
  const clamped = Math.max(0, Math.min(100, Math.round(mastery)));
  const meta = getMasteryStatus(clamped);

  return (
    <div className="flex items-center gap-3 w-full">
      <div
        className={`flex-1 bg-slate-100 rounded-full overflow-hidden ${heightClass}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${meta.barColor} h-full rounded-full transition-[width] duration-300 ease-out`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showPercent && (
        <span className="text-xs font-mono font-medium tabular-nums text-slate-700 w-9 text-right shrink-0">
          {clamped}%
        </span>
      )}
    </div>
  );
};

interface WeeklyPerformanceChartProps {
  data: WeeklyPerformancePoint[];
  height?: number;
  showMasteryLine?: boolean;
}

export const WeeklyPerformanceChart: React.FC<WeeklyPerformanceChartProps> = ({
  data,
  height = 220,
  showMasteryLine = true,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const width = 560;
  const padLeft = 38;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 32;

  const innerW = width - padLeft - padRight;
  const innerH = height - padTop - padBottom;

  const getX = (idx: number) =>
    data.length <= 1
      ? padLeft + innerW / 2
      : padLeft + (idx / (data.length - 1)) * innerW;

  const getY = (val: number) =>
    padTop + innerH - (Math.max(0, Math.min(100, val)) / 100) * innerH;

  const quizPoints = data
    .map((d, i) => `${getX(i)},${getY(d.quizScore)}`)
    .join(' ');

  const masteryPoints = data
    .map((d, i) => `${getX(i)},${getY(d.avgMastery)}`)
    .join(' ');

  const areaPath =
    data.length > 0
      ? `M ${getX(0)},${getY(0)} ` +
        data.map((d, i) => `L ${getX(i)},${getY(d.quizScore)}`).join(' ') +
        ` L ${getX(data.length - 1)},${padTop + innerH} L ${getX(0)},${padTop + innerH} Z`
      : '';

  const yTicks = [0, 25, 50, 75, 100];

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
        <div className="flex items-center gap-5 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-3 h-0.5 bg-indigo-600 inline-block" />
            <span>Quiz Accuracy (%)</span>
          </div>
          {showMasteryLine && (
            <div className="flex items-center gap-2">
              <span className="w-3 h-0.5 bg-violet-500 border-t border-dashed border-violet-500 inline-block" />
              <span>BKT Avg Mastery (%)</span>
            </div>
          )}
        </div>
        {hoveredIndex !== null && data[hoveredIndex] && (
          <div className="text-xs font-mono tabular-nums text-slate-700">
            {data[hoveredIndex].week}: Quiz {data[hoveredIndex].quizScore}% · Mastery{' '}
            {data[hoveredIndex].avgMastery}%
          </div>
        )}
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        role="img"
        aria-label="Weekly quiz performance and mastery chart"
      >
        <defs>
          <linearGradient id="indigoAreaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.01" />
          </linearGradient>
        </defs>

        {yTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line
                x1={padLeft}
                x2={width - padRight}
                y1={y}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
              />
              <text
                x={padLeft - 8}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[10px] font-mono"
              >
                {tick}%
              </text>
            </g>
          );
        })}

        {areaPath && <path d={areaPath} fill="url(#indigoAreaFill)" />}

        {showMasteryLine && masteryPoints && (
          <polyline
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="2"
            strokeDasharray="4 4"
            points={masteryPoints}
          />
        )}

        {quizPoints && (
          <polyline
            fill="none"
            stroke="#4338CA"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={quizPoints}
          />
        )}

        {data.map((d, i) => {
          const cx = getX(i);
          const cyQuiz = getY(d.quizScore);
          const cyMastery = getY(d.avgMastery);
          const isHovered = hoveredIndex === i;

          return (
            <g
              key={d.week}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="cursor-pointer"
            >
              <rect
                x={cx - 24}
                y={padTop}
                width={48}
                height={innerH + padBottom}
                fill="transparent"
              />
              {isHovered && (
                <line
                  x1={cx}
                  x2={cx}
                  y1={padTop}
                  y2={padTop + innerH}
                  stroke="#CBD5E1"
                  strokeDasharray="3 3"
                />
              )}
              {showMasteryLine && (
                <circle
                  cx={cx}
                  cy={cyMastery}
                  r={isHovered ? 4.5 : 3}
                  fill="#FFFFFF"
                  stroke="#8B5CF6"
                  strokeWidth="2"
                />
              )}
              <circle
                cx={cx}
                cy={cyQuiz}
                r={isHovered ? 5.5 : 3.5}
                fill="#FFFFFF"
                stroke="#4338CA"
                strokeWidth="2.5"
              />
              <text
                x={cx}
                y={height - 8}
                textAnchor="middle"
                className="fill-slate-500 text-[11px]"
              >
                {d.week}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

interface WeakTopicsBarChartProps {
  topics: Topic[];
  targetThreshold?: number;
}

export const WeakTopicsBarChart: React.FC<WeakTopicsBarChartProps> = ({
  topics,
  targetThreshold = 80,
}) => {
  const sorted = [...topics].sort((a, b) => a.mastery - b.mastery).slice(0, 7);

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
        <span>Topic Mastery vs. {targetThreshold}% Target Benchmark</span>
        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-red-600 inline-block" />
            <span>Weak (&lt;40%)</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-amber-600 inline-block" />
            <span>Needs Practice (40–59%)</span>
          </span>
        </div>
      </div>

      {sorted.map((t) => {
        const meta = getMasteryStatus(t.mastery);
        return (
          <div key={t.id} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-medium text-slate-800 truncate">{t.name}</span>
              <span className="font-mono text-xs tabular-nums text-slate-700 shrink-0">
                {t.mastery}% / {targetThreshold}%
              </span>
            </div>
            <div className="relative h-3 bg-slate-100 rounded-md overflow-hidden">
              <div
                className={`${meta.barColor} h-full rounded-md transition-[width] duration-300`}
                style={{ width: `${t.mastery}%` }}
              />
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-slate-700/60"
                style={{ left: `${targetThreshold}%` }}
                title={`Target Mastery: ${targetThreshold}%`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
