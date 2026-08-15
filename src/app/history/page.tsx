import { AppFrame } from "@/components/AppFrame";
import { HistoryView } from "@/components/HistoryView";
import { scoreEntry } from "@/lib/scoring";
import { listEntries } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function HistoryPage() {
  const entries = listEntries().map(scoreEntry);
  return (
    <AppFrame title="Scores over time" current="history">
      <HistoryView entries={entries} />
    </AppFrame>
  );
}
