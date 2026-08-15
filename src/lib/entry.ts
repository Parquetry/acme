import { GAD7_ITEMS, PHQ9_ITEMS, type Entry } from "./metrics";
import { isValidScoreList } from "./scoring";
import { isIsoDate } from "./dates";

export function normalizeEntry(input: unknown, now = new Date()): Entry {
  if (!input || typeof input !== "object") {
    throw new Error("Entry must be an object");
  }
  const value = input as Partial<Entry>;
  if (!isIsoDate(value.date)) {
    throw new Error("date must be YYYY-MM-DD");
  }
  if (!isValidScoreList(value.phq9, PHQ9_ITEMS.length)) {
    throw new Error(`phq9 must be ${PHQ9_ITEMS.length} scores from 0 to 3`);
  }
  if (!isValidScoreList(value.gad7, GAD7_ITEMS.length)) {
    throw new Error(`gad7 must be ${GAD7_ITEMS.length} scores from 0 to 3`);
  }
  const timestamp = now.toISOString();
  return {
    date: value.date,
    phq9: value.phq9,
    gad7: value.gad7,
    comment: typeof value.comment === "string" ? value.comment.trim() : "",
    createdAt: typeof value.createdAt === "string" ? value.createdAt : timestamp,
    updatedAt: timestamp,
  };
}

export function isEntry(value: unknown): value is Entry {
  try {
    normalizeEntry(value, new Date("2026-01-01T00:00:00.000Z"));
    return true;
  } catch {
    return false;
  }
}

export function upsertIntoList(entries: Entry[], input: unknown, now = new Date()): Entry[] {
  const entry = normalizeEntry(input, now);
  const next = [...entries];
  const index = next.findIndex((item) => item.date === entry.date);
  if (index === -1) {
    next.push(entry);
  } else {
    entry.createdAt = next[index].createdAt;
    next[index] = entry;
  }
  return next.sort((a, b) => a.date.localeCompare(b.date));
}
