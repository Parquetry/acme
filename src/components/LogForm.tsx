"use client";

import { useMemo, useState } from "react";
import { GAD7_ITEMS, PHQ9_ITEMS, SCALE_LABELS, type Entry, type MetricItem } from "@/lib/metrics";
import { gad7Severity, phq9Severity, sumScores } from "@/lib/scoring";

type LogFormProps = {
  date: string;
  displayDate: string;
  initial: Entry | null;
};

const emptyPhq9 = () => Array(PHQ9_ITEMS.length).fill(null) as Array<number | null>;
const emptyGad7 = () => Array(GAD7_ITEMS.length).fill(null) as Array<number | null>;

export function LogForm({ date, displayDate, initial }: LogFormProps) {
  const [phq9, setPhq9] = useState<Array<number | null>>(initial?.phq9 ?? emptyPhq9());
  const [gad7, setGad7] = useState<Array<number | null>>(initial?.gad7 ?? emptyGad7());
  const [comment, setComment] = useState(initial?.comment ?? "");
  const [status, setStatus] = useState<string>(initial ? "Loaded today's saved log." : "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const phqTotal = useMemo(() => (phq9.every(isScore) ? sumScores(phq9) : null), [phq9]);
  const gadTotal = useMemo(() => (gad7.every(isScore) ? sumScores(gad7) : null), [gad7]);
  const selfHarm = typeof phq9[8] === "number" ? phq9[8] : 0;
  const complete = phq9.every(isScore) && gad7.every(isScore);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!complete) {
      setError("Rate every item from 0 to 3 before saving.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/entries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, phq9, gad7, comment }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(payload.error || "Could not save");
      }
      setStatus("Saved. You can update this day anytime.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <section className="card">
        <h2>Daily mental health metrics</h2>
        <p className="lede">{displayDate}. Rate each item for today on a scale of 0 to 3.</p>
        <ul className="scale">
          {([0, 1, 2, 3] as const).map((value) => (
            <li key={value}>
              <strong>{value}</strong> = {SCALE_LABELS[value]}
            </li>
          ))}
        </ul>
      </section>

      <MetricSection title="Depression metrics (PHQ-9)" items={PHQ9_ITEMS} values={phq9} onChange={setPhq9} />
      <MetricSection title="Anxiety metrics (GAD-7)" items={GAD7_ITEMS} values={gad7} onChange={setGad7} />

      {selfHarm > 0 ? (
        <section className="card crisis">
          <h3>If you are in crisis</h3>
          <p>
            You marked thoughts of self-harm. This log is not a substitute for care. In the US, call or text{" "}
            <strong>988</strong>. If you are in immediate danger, call emergency services.
          </p>
        </section>
      ) : null}

      <section className="card">
        <h2>Notes</h2>
        <textarea
          className="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Optional comments for today"
        />
        <div className="totals" style={{ marginTop: 16 }}>
          <div className="stat phq">
            <span>PHQ-9</span>
            <strong>{phqTotal ?? "—"}</strong>
            <span className="meta">{phqTotal === null ? "Finish the section" : phq9Severity(phqTotal)}</span>
          </div>
          <div className="stat gad">
            <span>GAD-7</span>
            <strong>{gadTotal ?? "—"}</strong>
            <span className="meta">{gadTotal === null ? "Finish the section" : gad7Severity(gadTotal)}</span>
          </div>
        </div>
        <div className="row" style={{ marginTop: 18 }}>
          <p className={error ? "crisis" : "hint"} style={{ margin: 0, padding: error ? "8px 12px" : 0, borderRadius: 12 }}>
            {error || status}
          </p>
          <button className="primary" type="submit" disabled={saving || !complete}>
            {saving ? "Saving…" : initial ? "Update today" : "Save today"}
          </button>
        </div>
      </section>
    </form>
  );
}

function isScore(value: number | null): value is number {
  return typeof value === "number";
}

function MetricSection({
  title,
  items,
  values,
  onChange,
}: {
  title: string;
  items: MetricItem[];
  values: Array<number | null>;
  onChange: (next: Array<number | null>) => void;
}) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {items.map((item, index) => (
        <div className="item" key={item.id}>
          <div className="item-label">
            {index + 1}. {item.label}
          </div>
          <div className="hint">{item.prompt}</div>
          <div className="scores" role="group" aria-label={item.label}>
            {([0, 1, 2, 3] as const).map((score) => (
              <button
                key={score}
                type="button"
                className="score"
                aria-pressed={values[index] === score}
                onClick={() => {
                  const next = [...values];
                  next[index] = score;
                  onChange(next);
                }}
              >
                {score}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
