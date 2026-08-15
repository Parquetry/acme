import { todayDate } from "../src/lib/dates";
import { reminderPayload, sendNtfy } from "../src/lib/ntfy";
import { getEntry } from "../src/lib/store";

async function main() {
  const topic = process.env.NTFY_TOPIC;
  if (!topic) {
    throw new Error("Set NTFY_TOPIC");
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
  console.log(alreadyLogged ? "Sent already-logged notice" : "Sent daily reminder");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
