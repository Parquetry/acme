import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { GAD7_ITEMS, PHQ9_ITEMS, type Entry } from "./metrics";
import { isValidScoreList } from "./scoring";
import { isIsoDate } from "./dates";

export function dataPath(): string {
  return resolve(process.env.DATA_PATH || "./data/entries.json");
}

type StoreFile = {
  entries: Entry[];
};

function emptyStore(): StoreFile {
  return { entries: [] };
}

export function readStore(path = dataPath()): StoreFile {
  try {
    const raw = readFileSync(path, "utf8");
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed || !Array.isArray(parsed.entries)) return emptyStore();
    return { entries: parsed.entries.filter(isEntry) };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return emptyStore();
    throw error;
  }
}

export function writeStore(store: StoreFile, path = dataPath()): void {
  mkdirSync(dirname(path), { recursive: true });
  const tempPath = `${path}.${process.pid}.tmp`;
  writeFileSync(tempPath, `${JSON.stringify(store, null, 2)}\n`, "utf8");
  renameSync(tempPath, path);
}

export function listEntries(path = dataPath()): Entry[] {
  return [...readStore(path).entries].sort((a, b) => a.date.localeCompare(b.date));
}

export function getEntry(date: string, path = dataPath()): Entry | null {
  return readStore(path).entries.find((entry) => entry.date === date) ?? null;
}

export function upsertEntry(input: unknown, path = dataPath(), now = new Date()): Entry {
  const entry = normalizeEntry(input, now);
  const store = readStore(path);
  const index = store.entries.findIndex((item) => item.date === entry.date);
  if (index === -1) {
    store.entries.push(entry);
  } else {
    entry.createdAt = store.entries[index].createdAt;
    store.entries[index] = entry;
  }
  writeStore(store, path);
  return entry;
}

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

function isEntry(value: unknown): value is Entry {
  try {
    normalizeEntry(value, new Date("2026-01-01T00:00:00.000Z"));
    return true;
  } catch {
    return false;
  }
}
