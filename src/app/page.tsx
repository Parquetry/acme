"use client";

import { useMemo } from "react";
import { AppFrame } from "@/components/AppFrame";
import { LogForm } from "@/components/LogForm";
import { formatDisplayDate, todayDate } from "@/lib/dates";

export default function HomePage() {
  const date = useMemo(() => todayDate(), []);
  return (
    <AppFrame title={formatDisplayDate(date)} current="today">
      <LogForm date={date} displayDate={formatDisplayDate(date)} />
    </AppFrame>
  );
}
