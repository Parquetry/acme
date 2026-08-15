import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  average,
  gad7Severity,
  isValidScoreList,
  phq9Severity,
  rollingAverage,
  scoreEntry,
  sumScores,
} from "./scoring";

describe("scoring", () => {
  it("sums item scores", () => {
    assert.equal(sumScores([1, 2, 3, 0]), 6);
  });

  it("maps PHQ-9 totals to severity bands", () => {
    assert.equal(phq9Severity(0), "Minimal");
    assert.equal(phq9Severity(4), "Minimal");
    assert.equal(phq9Severity(5), "Mild");
    assert.equal(phq9Severity(10), "Moderate");
    assert.equal(phq9Severity(15), "Moderately severe");
    assert.equal(phq9Severity(20), "Severe");
    assert.equal(phq9Severity(27), "Severe");
  });

  it("maps GAD-7 totals to severity bands", () => {
    assert.equal(gad7Severity(4), "Minimal");
    assert.equal(gad7Severity(9), "Mild");
    assert.equal(gad7Severity(14), "Moderate");
    assert.equal(gad7Severity(15), "Severe");
    assert.equal(gad7Severity(21), "Severe");
  });

  it("scores a full entry", () => {
    const scored = scoreEntry({
      date: "2026-08-14",
      phq9: [1, 1, 2, 1, 0, 1, 1, 0, 0],
      gad7: [2, 1, 1, 2, 0, 1, 1],
      comment: "slept poorly",
      createdAt: "2026-08-14T21:00:00.000Z",
      updatedAt: "2026-08-14T21:00:00.000Z",
    });
    assert.equal(scored.phq9Total, 7);
    assert.equal(scored.gad7Total, 8);
    assert.equal(scored.phq9Severity, "Mild");
    assert.equal(scored.gad7Severity, "Mild");
  });

  it("validates 0-3 score lists", () => {
    assert.equal(isValidScoreList([0, 1, 2, 3], 4), true);
    assert.equal(isValidScoreList([0, 1, 4], 3), false);
    assert.equal(isValidScoreList([0, 1], 3), false);
  });

  it("computes rolling averages after the window fills", () => {
    assert.deepEqual(rollingAverage([2, 4, 6, 8], 3), [null, null, 4, 6]);
    assert.equal(average([]), null);
    assert.equal(average([2, 4]), 3);
  });
});
