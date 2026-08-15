# Daily mental health log

A personal PHQ-9 + GAD-7 tracker. GitHub Actions sends an **ntfy** push so the reminder pops on your phone. The questionnaire lives at a website you can open in Safari.

This is a screening log, not a diagnosis or a substitute for care. If you are in crisis in the US, call or text **988**.

## On your phone

1. Enable GitHub Pages once: repo **Settings → Pages → Source → GitHub Actions → Save**.
2. After **Actions → Deploy tracker** is green, open:

   **https://parquetry.github.io/acme/**

3. Fill today’s 0–3 scores and tap **Save today**. Scores stay on this phone (Safari storage).
4. Optional: Safari **Share → Add to Home Screen**.
5. ntfy alerts will open that same link when you tap them.

## Popups

1. Install [ntfy](https://apps.apple.com/app/ntfy/id1625396347) and subscribe to your `NTFY_TOPIC`.
2. Run **Actions → Daily log reminder** to test.
3. Nightly run is 9:00 PM Eastern (01:00 UTC).

## Laptop / local

```bash
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The GitHub Pages build uses `/acme` as the path prefix.
