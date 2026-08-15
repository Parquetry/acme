import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { getEntry, listEntries, normalizeEntry, upsertEntry } from "./store";

const sample = {
  date: "2026-08-14",
  phq9: [1, 0, 2, 1, 0, 1, 0, 0, 0],
  gad7: [1, 1, 0, 2, 0, 1, 0],
  comment: "long day",
};

describe("store", () => {
  it("normalizes and rejects invalid entries", () => {
    const entry = normalizeEntry(sample, new Date("2026-08-14T21:05:00.000Z"));
    assert.equal(entry.comment, "long day");
    assert.equal(entry.updatedAt, "2026-08-14T21:05:00.000Z");
    assert.throws(() => normalizeEntry({ ...sample, date: "08/14/2026" }), /YYYY-MM-DD/);
    assert.throws(() => normalizeEntry({ ...sample, phq9: [1, 2] }), /phq9/);
    assert.throws(() => normalizeEntry({ ...sample, gad7: [1, 2, 3, 4, 5, 6, 7] }), /gad7/);
  });

  it("upserts by date and preserves createdAt", () => {
    const path = join(mkdtempSync(join(tmpdir(), "daily-log-")), "entries.json");
    const first = upsertEntry(sample, path, new Date("2026-08-14T21:00:00.000Z"));
    const second = upsertEntry(
      { ...sample, comment: "updated", phq9: [2, 0, 2, 1, 0, 1, 0, 0, 0] },
      path,
      new Date("2026-08-14T22:00:00.000Z"),
    );

    assert.equal(first.createdAt, second.createdAt);
    assert.equal(second.comment, "updated");
    assert.equal(second.updatedAt, "2026-08-14T22:00:00.000Z");
    assert.equal(getEntry("2026-08-14", path)?.comment, "updated");
    assert.equal(listEntries(path).length, 1);

    upsertEntry({ ...sample, date: "2026-08-15", comment: "" }, path, new Date("2026-08-15T21:00:00.000Z"));
    assert.deepEqual(
      listEntries(path).map((entry) => entry.date),
      ["2026-08-14", "2026-08-15"],
    );

    const saved = JSON.parse(readFileSync(path, "utf8")) as { entries: unknown[] };
    assert.equal(saved.entries.length, 2);
  });
});
