import { NextResponse } from "next/server";
import { todayDate } from "@/lib/dates";
import { scoreEntry } from "@/lib/scoring";
import { requireSession } from "@/lib/session";
import { listEntries, upsertEntry } from "@/lib/store";

export async function GET() {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const entries = listEntries().map(scoreEntry);
  return NextResponse.json({
    today: todayDate(),
    entries,
  });
}

export async function POST(request: Request) {
  if (!(await requireSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const entry = scoreEntry(upsertEntry(body));
    return NextResponse.json(entry);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid entry";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
