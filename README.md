# QMuraajah

Keep your hifz fresh, one quarter at a time.

QMuraajah (muraajah, مراجعة, is Arabic for revision) is a daily revision tracker for people who have memorised the Quran, or are memorising it. Each juz is split into 4 quarters, 120 in the whole Quran. You set how many quarters you revise a day, rate each one as you finish it, and QMuraajah keeps the streak, the history and the weak spots for you.

Live at **https://dawr.hifzapp.link**

## What it does

- **Today:** your portion for the day, picked up from where you left off. Rate each quarter Good, Okay or Weak as you read it; the day is done when you reach your goal.
- **Plan the day:** choose different quarters instead, by juz number or name.
- **Progress:** your streak (days in a row with the goal met) and a chart of the week.
- **History:** every day you revised, with each rating. A rating deleted by mistake can be undone.
- **Settings:** daily goal, light or dark theme, profile, password, delete your logs, or delete your account and everything in it.
- **Try it with sample data:** look around with 13 days of made-up revision, no account needed. Sample accounts are removed the next night.

Accounts need a confirmed email. A forgotten password is reset with a 6-digit code by email, and a reset signs you out everywhere else.

## How it's built

| piece | what |
| --- | --- |
| App | Next.js 15 (App Router, server actions), React 19, Tailwind CSS 4 |
| Database | PostgreSQL. Row level security on every table, so each account can only ever read its own rows |
| Sign-in | Its own: scrypt password hashes, sessions in httpOnly cookies, rate limits on every sign-in, sign-up and reset |
| Email | Resend, from `noreply@hifzapp.link` |
| Hosting | One Ubuntu server: nginx with Let's Encrypt in front, the app under systemd, nightly backups and clean-up by cron |
| Quran data | Quarter start points from [quran-meta](https://github.com/quran-center/quran-meta) (MIT), bundled with the app |

## Run it on your computer

Needs Node 22.

```bash
cd web
npm install
npm run dev
```

Open http://localhost:3000 and choose **Try it with sample data**, or create an account. Without a database the app keeps its data in `web/.data/dev-db.json`, and prints password-reset codes in the terminal instead of emailing them.

To run it on a real Postgres on your computer:

```bash
npm run db:local      # a local Postgres on port 54329, with the same roles as the server
```

Then, in a second terminal, put these in `web/.env.local` (local-only passwords, set by `db:local`) and run `npm run db:migrate` to create the tables and the 120 quarters:

```
DATABASE_URL=postgres://dawr_app:local-app@127.0.0.1:54329/dawr
MIGRATE_DATABASE_URL=postgres://dawr_owner:local-owner@127.0.0.1:54329/dawr
```

Every setting the app reads is listed, without values, in `web/.env.example`.

## Tests

```bash
npm run e2e            # every flow in a real browser (Playwright)
npm run e2e:postgres   # the same, against a throwaway Postgres
npm run db:test        # the database rules, including "a second user sees nothing"
```

## Deploying an update

Commit, then from Git Bash in the repo:

```bash
deploy/push.sh
```

It sends the last commit to the server, then migrates, rebuilds and restarts the app there. The server files (systemd unit, nginx site, cron jobs, backups) are in `deploy/`.

## Project layout

| path | what |
| --- | --- |
| `web/src/app` | the screens and server actions |
| `web/src/lib/data` | the data layer, the only code that touches storage |
| `web/src/lib/revision.ts` | revision logic: streaks, suggestions, stats |
| `web/supabase/migrations`, `web/db/postgres` | the database schema and rules |
| `web/e2e` | end-to-end tests |
| `deploy` | server setup and the update script |
