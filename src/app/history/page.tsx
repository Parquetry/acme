"use client";

import { useEffect, useState } from "react";
import { AppFrame } from "@/components/AppFrame";
import { HistoryView } from "@/components/HistoryView";
import { listBrowserEntries } from "@/lib/browser-store";
import type { ScoredEntry } from "@/lib/metrics";
import { scoreEntry } from "@/lib/scoring";

export default function HistoryPage() {
  const [entries, setEntries] = useState<ScoredEntry[]>([]);

  useEffect(() => {
    setEntries(listBrowserEntries().map(scoreEntry));
  }, []);

  return (
    <AppFrame title="Scores over time" current="history">
      <HistoryView entries={entries} />
    </AppFrame>
  );
}
