import { AppFrame } from "@/components/AppFrame";
import { LogForm } from "@/components/LogForm";
import { formatDisplayDate, todayDate } from "@/lib/dates";
import { getEntry } from "@/lib/store";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const date = todayDate();
  const initial = getEntry(date);

  return (
    <AppFrame title={formatDisplayDate(date)} current="today">
      <LogForm date={date} displayDate={formatDisplayDate(date)} initial={initial} />
    </AppFrame>
  );
}
