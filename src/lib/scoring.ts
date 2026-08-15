import type { Entry, ScoredEntry, Severity } from "./metrics";

export function sumScores(scores: number[]): number {
  return scores.reduce((total, value) => total + value, 0);
}

export function phq9Severity(total: number): Severity {
  if (total <= 4) return "Minimal";
  if (total <= 9) return "Mild";
  if (total <= 14) return "Moderate";
  if (total <= 19) return "Moderately severe";
  return "Severe";
}

export function gad7Severity(total: number): Severity {
  if (total <= 4) return "Minimal";
  if (total <= 9) return "Mild";
  if (total <= 14) return "Moderate";
  return "Severe";
}

export function scoreEntry(entry: Entry): ScoredEntry {
  const phq9Total = sumScores(entry.phq9);
  const gad7Total = sumScores(entry.gad7);
  return {
    ...entry,
    phq9Total,
    gad7Total,
    phq9Severity: phq9Severity(phq9Total),
    gad7Severity: gad7Severity(gad7Total),
  };
}

export function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((total, value) => total + value, 0) / values.length;
}

export function rollingAverage(values: number[], window: number): Array<number | null> {
  return values.map((_, index) => {
    if (index + 1 < window) return null;
    const slice = values.slice(index + 1 - window, index + 1);
    return average(slice);
  });
}

export function isValidScore(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 3;
}

export function isValidScoreList(values: unknown, length: number): values is number[] {
  return Array.isArray(values) && values.length === length && values.every(isValidScore);
}
