import { formatShortDate } from "@/lib/dates";
import type { ScoredEntry } from "@/lib/metrics";
import { rollingAverage } from "@/lib/scoring";

type TrendChartProps = {
  entries: ScoredEntry[];
  valueKey: "phq9Total" | "gad7Total";
  max: number;
  color: string;
  label: string;
};

export function TrendChart({ entries, valueKey, max, color, label }: TrendChartProps) {
  if (entries.length === 0) {
    return <p className="empty">No scores yet. Save today to start the chart.</p>;
  }

  const width = 640;
  const height = 220;
  const pad = { top: 16, right: 16, bottom: 36, left: 36 };
  const innerWidth = width - pad.left - pad.right;
  const innerHeight = height - pad.top - pad.bottom;
  const values = entries.map((entry) => entry[valueKey]);
  const averages = rollingAverage(values, Math.min(7, values.length));

  const x = (index: number) => {
    if (entries.length === 1) return pad.left + innerWidth / 2;
    return pad.left + (index / (entries.length - 1)) * innerWidth;
  };
  const y = (value: number) => pad.top + innerHeight - (value / max) * innerHeight;
  const line = (points: Array<number | null>) =>
    points
      .map((value, index) => (value === null ? "" : `${index === points.findIndex((item) => item !== null) ? "M" : "L"}${x(index)} ${y(value)}`))
      .join(" ")
      .trim();

  const ticks = [0, Math.round(max / 2), max];

  return (
    <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label}>
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={pad.left} x2={width - pad.right} y1={y(tick)} y2={y(tick)} stroke="#ddd4c4" />
          <text x={4} y={y(tick) + 4} fill="#6d6258" fontSize="11">
            {tick}
          </text>
        </g>
      ))}
      <path d={line(values)} className="chart-line" stroke={color} />
      {averages.some((value) => value !== null) ? (
        <path d={line(averages)} className="chart-line" stroke={color} strokeDasharray="5 5" opacity="0.7" />
      ) : null}
      {entries.map((entry, index) => (
        <circle key={entry.date} cx={x(index)} cy={y(entry[valueKey])} r="4" fill={color} />
      ))}
      {entries.map((entry, index) =>
        index === 0 || index === entries.length - 1 || entries.length < 8 ? (
          <text key={`${entry.date}-label`} x={x(index)} y={height - 10} textAnchor="middle" fill="#6d6258" fontSize="11">
            {formatShortDate(entry.date)}
          </text>
        ) : null,
      )}
    </svg>
  );
}
