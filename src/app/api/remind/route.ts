import { NextResponse } from "next/server";
import { todayDate } from "@/lib/dates";
import { reminderPayload, sendNtfy } from "@/lib/ntfy";
import { requireSession } from "@/lib/session";
import { getEntry } from "@/lib/store";

export async function POST() {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const topic = process.env.NTFY_TOPIC;
  if (!topic) {
    return NextResponse.json(
      { error: "NTFY_TOPIC is not configured on the server" },
      { status: 400 },
    );
  }
  const alreadyLogged = Boolean(getEntry(todayDate()));
  await sendNtfy(
    reminderPayload({
      topic,
      server: process.env.NTFY_SERVER,
      appUrl: process.env.APP_URL,
      alreadyLogged,
    }),
  );
  return NextResponse.json({ ok: true, alreadyLogged });
}
