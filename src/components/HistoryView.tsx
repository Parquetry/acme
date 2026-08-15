import { formatDisplayDate } from "@/lib/dates";
import type { ScoredEntry } from "@/lib/metrics";
import { average } from "@/lib/scoring";
import { TrendChart } from "./TrendChart";

export function HistoryView({ entries }: { entries: ScoredEntry[] }) {
  const recent = entries.slice(-7);
  const phqAvg = average(recent.map((entry) => entry.phq9Total));
  const gadAvg = average(recent.map((entry) => entry.gad7Total));
  const streak = currentStreak(entries);

  return (
    <>
      <section className="card">
        <h2>Trends</h2>
        <p className="lede">
          Solid line is the daily total. Dashed line is a 7-day average once enough days exist.
        </p>
        <div className="totals" style={{ margin: "16px 0 8px" }}>
          <div className="stat phq">
            <span>7-day PHQ-9 avg</span>
            <strong>{phqAvg === null ? "—" : phqAvg.toFixed(1)}</strong>
            <span className="meta">{streak} day streak</span>
          </div>
          <div className="stat gad">
            <span>7-day GAD-7 avg</span>
            <strong>{gadAvg === null ? "—" : gadAvg.toFixed(1)}</strong>
            <span className="meta">{entries.length} days logged</span>
          </div>
        </div>
        <h3>PHQ-9</h3>
        <TrendChart entries={entries} valueKey="phq9Total" max={27} color="#b45309" label="PHQ-9 trend" />
        <h3>GAD-7</h3>
        <TrendChart entries={entries} valueKey="gad7Total" max={21} color="#0369a1" label="GAD-7 trend" />
      </section>

      <section className="card">
        <h2>Past days</h2>
        {entries.length === 0 ? (
          <p className="empty">Nothing saved yet.</p>
        ) : (
          <ol className="history-list">
            {[...entries].reverse().map((entry) => (
              <li key={entry.date}>
                <div>
                  <strong>{formatDisplayDate(entry.date)}</strong>
                  {entry.comment ? <div className="hint">{entry.comment}</div> : null}
                </div>
                <div className="meta">
                  PHQ-9 {entry.phq9Total} ({entry.phq9Severity})
                  <br />
                  GAD-7 {entry.gad7Total} ({entry.gad7Severity})
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>
    </>
  );
}

function currentStreak(entries: ScoredEntry[]): number {
  if (entries.length === 0) return 0;
  const dates = new Set(entries.map((entry) => entry.date));
  const cursor = new Date(`${entries[entries.length - 1].date}T00:00:00Z`);
  let streak = 0;
  while (dates.has(cursor.toISOString().slice(0, 10))) {
    streak += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }
  return streak;
}
