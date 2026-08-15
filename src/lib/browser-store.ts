import { isEntry, upsertIntoList } from "./entry";
import type { Entry } from "./metrics";

export const BROWSER_STORE_KEY = "daily-log-entries";

type StoreFile = {
  entries: Entry[];
};

export function readBrowserStore(): StoreFile {
  if (typeof window === "undefined") return { entries: [] };
  try {
    const raw = window.localStorage.getItem(BROWSER_STORE_KEY);
    if (!raw) return { entries: [] };
    const parsed = JSON.parse(raw) as StoreFile;
    if (!parsed || !Array.isArray(parsed.entries)) return { entries: [] };
    return { entries: parsed.entries.filter(isEntry) };
  } catch {
    return { entries: [] };
  }
}

export function listBrowserEntries(): Entry[] {
  return [...readBrowserStore().entries].sort((a, b) => a.date.localeCompare(b.date));
}

export function getBrowserEntry(date: string): Entry | null {
  return readBrowserStore().entries.find((entry) => entry.date === date) ?? null;
}

export function upsertBrowserEntry(input: unknown, now = new Date()): Entry {
  const entries = upsertIntoList(readBrowserStore().entries, input, now);
  window.localStorage.setItem(BROWSER_STORE_KEY, JSON.stringify({ entries }));
  const date = (input as { date: string }).date;
  return entries.find((entry) => entry.date === date) as Entry;
}
