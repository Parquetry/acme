import { mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { isEntry, upsertIntoList } from "./entry";
import type { Entry } from "./metrics";

export { normalizeEntry } from "./entry";

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
  const store = readStore(path);
  store.entries = upsertIntoList(store.entries, input, now);
  writeStore(store, path);
  return store.entries.find((entry) => entry.date === (input as Entry).date) as Entry;
}
