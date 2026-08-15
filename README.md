# Daily mental health log

A personal PHQ-9 + GAD-7 tracker. GitHub Actions sends an **ntfy** push to your phone and laptop every evening so the reminder actually pops up — unlike Gemini’s in-chat “Everyday by 9 PM” card.

This is a screening log, not a diagnosis or a substitute for care. If you are in crisis in the US, call or text **988**.

## What you get

- Today’s form with the same 0–3 scale as the Gemini template
- Full PHQ-9 (9 items) and GAD-7 (7 items), plus an optional comment
- History page with daily totals, severity labels, streak, and trend charts
- A 9:00 PM reminder via [ntfy](https://ntfy.sh) that can open this app when you tap it

## 1. Get popups on your phone and laptop

1. Install **ntfy** on your iPhone ([App Store](https://apps.apple.com/app/ntfy/id1625396347)) and on your laptop ([desktop apps](https://ntfy.sh/docs/subscribe/phone/) or [ntfy.sh](https://ntfy.sh) in the browser).
2. In both apps, subscribe to the **same secret topic**. Use a long random name, not `health` or your name. Anyone who knows the topic can publish to the public `ntfy.sh` server.
3. Allow notifications for ntfy in iOS Settings and in your laptop OS.
4. In this GitHub repo: **Settings → Secrets and variables → Actions**, add:
   - `NTFY_TOPIC` — the secret topic name
   - `APP_URL` — the public URL of this app once it is deployed (optional, but this is what makes the notification open the log)
5. Open the **Actions** tab and run **Daily log reminder** once. You should get a lock-screen / desktop popup on every device subscribed to that topic.

The scheduled job runs at **01:00 UTC** (9:00 PM Eastern during EDT). Edit [`.github/workflows/daily-reminder.yml`](.github/workflows/daily-reminder.yml) if you want a different time.

## 2. Run the tracker

```bash
cp .env.example .env.local
# set NTFY_TOPIC, and APP_PASSWORD if you will put this on the internet
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Entries are stored in `data/entries.json`.

```bash
npm run seed          # optional sample week for the charts
npm run remind        # send a test ntfy from your machine
```

## 3. Deploy

The reminder workflow does **not** need the app to be online. Deploy the tracker when you want to fill the form from the notification.

```bash
docker compose up --build
```

Keep `data/` on a persistent volume. Set `APP_PASSWORD` so the log is not public. Point `APP_URL` and the `APP_URL` GitHub secret at the deployed address.

## API

- `GET /api/entries` — all scored days
- `POST /api/entries` — create or update one day (`date`, `phq9[9]`, `gad7[7]`, `comment`)
- `POST /api/remind` — send ntfy now (skips the “fill it out” copy if today is already saved)
- `POST /api/login` — sets the session cookie when `APP_PASSWORD` is set
