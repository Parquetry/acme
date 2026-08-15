import { upsertEntry } from "../src/lib/store";

const days = [
  { date: "2026-08-08", phq9: [1, 1, 2, 1, 1, 1, 1, 0, 0], gad7: [2, 1, 2, 1, 0, 1, 1], comment: "Busy week start" },
  { date: "2026-08-09", phq9: [1, 0, 1, 1, 0, 1, 1, 0, 0], gad7: [1, 1, 1, 1, 0, 1, 0], comment: "" },
  { date: "2026-08-10", phq9: [2, 1, 2, 2, 1, 1, 1, 1, 0], gad7: [2, 2, 2, 2, 1, 1, 1], comment: "Poor sleep" },
  { date: "2026-08-11", phq9: [1, 1, 1, 1, 0, 1, 0, 0, 0], gad7: [1, 1, 1, 1, 0, 1, 1], comment: "" },
  { date: "2026-08-12", phq9: [0, 1, 1, 1, 0, 0, 0, 0, 0], gad7: [1, 0, 1, 1, 0, 0, 0], comment: "Walked after work" },
  { date: "2026-08-13", phq9: [1, 1, 2, 1, 1, 1, 1, 0, 0], gad7: [2, 1, 1, 2, 0, 1, 1], comment: "" },
  { date: "2026-08-14", phq9: [1, 1, 2, 1, 0, 1, 1, 0, 0], gad7: [2, 1, 1, 2, 0, 1, 1], comment: "Gemini template day" },
];

for (const day of days) {
  upsertEntry(day, undefined, new Date(`${day.date}T21:00:00.000Z`));
}

console.log(`Seeded ${days.length} sample days into ${process.env.DATA_PATH || "./data/entries.json"}`);
