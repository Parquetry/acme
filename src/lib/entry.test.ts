import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { upsertIntoList } from "./entry";

const sample = {
  date: "2026-08-15",
  phq9: [1, 1, 2, 1, 0, 1, 1, 0, 0],
  gad7: [2, 1, 1, 2, 0, 1, 1],
  comment: "phone",
};

describe("entry list", () => {
  it("inserts and updates by date", () => {
    const first = upsertIntoList([], sample, new Date("2026-08-15T12:00:00.000Z"));
    const second = upsertIntoList(
      first,
      { ...sample, comment: "updated" },
      new Date("2026-08-15T13:00:00.000Z"),
    );
    assert.equal(second.length, 1);
    assert.equal(second[0]?.comment, "updated");
    assert.equal(second[0]?.createdAt, first[0]?.createdAt);

    const twoDays = upsertIntoList(second, { ...sample, date: "2026-08-14", comment: "" });
    assert.deepEqual(
      twoDays.map((entry) => entry.date),
      ["2026-08-14", "2026-08-15"],
    );
  });
});
