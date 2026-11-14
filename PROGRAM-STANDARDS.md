# HPO Tracker — Program Standards & Decision Log

This is the contract every program in the app follows. When a new program is added, it is built to this document. When a rule here changes, every existing program is updated to match, and the change is logged at the bottom.

Live app: https://muddledsoul.github.io/HPO-Tracker/  ·  Repo: `muddledsoul/HPO-Tracker`

---

## 1. App-wide rules

| Rule | Decision |
|---|---|
| Platform | Single-page PWA (`index.html` + one data file per program), hosted on GitHub Pages, installed to the iPhone home screen. No server, no accounts. |
| Data | Everything lives on the phone in `localStorage` under one key (`hpo-tracker-v1`); photos in IndexedDB. **App updates never touch data.** Backup/restore is a JSON file (photos included). |
| Updates | Service worker is network-first; the app checks for a new version on every open and reloads itself. Each release bumps `APP_VERSION` in `index.html` and the cache name in `sw.js`. |
| Lock | Password gate. Only a salted, slow hash of the password (PBKDF2-SHA256, 1,000,000 rounds) is in the page; the password itself is never written in this repo, in commit messages or in test files. Unlocked state lasts until 2 hours of inactivity. A **Lock** button sits in the top-right corner of every screen (and in More); it locks at once and the password is needed again. Add-to-home-screen instructions (iPhone + Android) sit under the password box and hide once installed. |
| Home screen | "DON'T BE A BITCH" header, then one card per program with a progress bar and an "Up next →" line that opens the next incomplete session. Below the cards: **+ Log an off-program workout**, **Training history**, and **Report a problem / request a change**. |
| Opening | App opens on Home. Tapping a card goes straight to that program's next incomplete session — no week/day navigation needed. |
| Tabs | Every program gets its own bottom tab bar; every bar ends with **History** and **More**. The bar is hidden on Home and the free-entry form. |
| Units | Global default lb/kg in More; any weighted lift can be flipped individually (logged weights convert). |
| Maxes | One set of 1RMs shared across all programs (`S.maxes`). A "work up to 1RM" line writes the tested max; heavy sets in the HPO log raise an *estimated* max; tested always beats estimated. %-based loads compute from these inline. |
| Scaling | Three levels everywhere: **Scaled / RX / RX+**. Chips set the whole workout; tapping a single line cycles only that movement. Each movement has its own three versions defined in the program's data file. *Exception:* HPO 24-Week is prescribed by weight and RPE with weights entered per set, so it has no scale chips. |
| Logging | "Mark complete" / "Finish session" is the single commit action. **The day's date is the moment it was marked complete** (local time, not UTC), not when it was first opened; it records the timer's elapsed time (if the timer ran) and advances the program's "next" pointer. Reopening a completed day un-marks it. Every Day page ends with a **Clear this day from history** button (confirm; removes the record and its photos). |
| Exercise help | Every movement line carries a **?** (definition where one exists + YouTube search). Mobility cards also carry the book page number. |
| History | The History tab compiles every session from every program plus off-program entries: totals, streak, weekly chart, PR board, monthly timeline (with that day's Bulletproof morning check beside it, when one was logged), and a Gap analysis of 15 movement categories. |
| Medical / PT report | Opened from More (and from Bulletproof Progress). The user picks the problem area from tiles (same body areas as Supple Leopard, plus Other), sets the side, and types their own description: when it started, what is happening, what makes it worse and better, what they have tried, questions for the visit. Daily check-in per issue: pain 0-10, swelling, note. Several issues can be kept at once. The report (PDF built on-device with bundled jsPDF, or HTML) carries the description, check-ins with the previous day's training, the worst days and what preceded them, full training history, strength baseline and the questions. For knee, shin, calf, ankle and foot issues it also carries the Bulletproof morning checks, reactions, photos and rehab adherence. **No personal health information is ever written in the code, this document, commit messages or test files** — it is typed in the app, stored on the phone under `S.med`, and leaves only in a report the user sends. |
| Report or request | Any user can send a problem, fix or feature request from Home or More. The form adds the screen they came from, app version and device type; name is optional. Each request is filed as a GitHub issue on this repo, and `.github/workflows/feedback-log.yml` copies it into `FEEDBACK.md` (and marks it closed when the issue is closed). The GitHub key is a fine-grained token limited to Issues on this repo, stored in `FB_BLOB` locked with the app password (PBKDF2 + AES-GCM) and unlocked on the phone at sign-in. With no signal or no key, requests wait on the phone and send on the next open. Requests are public; the form says so. The queue and key live outside the main data key, so backup/restore and "Delete all data" do not touch them. |

---

## 2. Timer standard (applies to every program)

All timers use one engine (`tmWidget` / `tmToggle` / `tmTick`). A program never ships its own countdown.

| Element | Decision |
|---|---|
| Structure | A workout is a list of **segments** `{l: label, s: seconds, k: kind, r: round label}`. Kinds: `work` (green), `rest` (amber), `warm` (slate), `prep` (slate, used for "Get ready" and switches). |
| Get ready | Every start begins with a **10 s "Get ready"** segment that does not count toward elapsed/remaining. |
| Display | Elapsed on top · big segment countdown with round label and what to do · "Next: …" · Remaining on the bottom · progress bar. Panel colour follows the segment kind; orange when finished. |
| Sounds | 3-2-1 quiet ticks · round start = two rising tones · into rest = descending two-note · other transition = one low tone · finish = three-note chime. Vibration on each transition. First tap unlocks audio. |
| Controls | Start / Pause / Resume / Reset. Only one timer runs at a time; starting another stops the first. Every widget has unique element ids (`tmw-<key>`) so two on one page never fight. |
| Exercise switch | When one work segment runs straight into a *different* exercise, a **10 s "Switch → next"** is inserted. Not inserted for left→right of the same movement, inside fixed EMOM/station slots, or where a rest already exists. **Per-workout toggle** under the widget (remembered; locked while running) and a global default in More. Shown totals include the switch time when it is on. |
| Rep prompts | When a work segment ends, a box asks for reps done (or seconds held). Blank = the prescribed number. Max-effort segments ask for the number. Entries are logged per set, summed into the day's score, and test-day numbers flow into the program's test comparison. **Prompts appear only where the program saves them** (No Excuses main + second workout); other timers run silently. |
| Time budget | Programs that promise "≤ 10 min" are validated so **every day, with switches on, is ≤ 600 s**. Any edit re-runs that check before pushing. |
| Reading a workout into a timer | • EMOM / "every N sec for M rounds" → fixed slots, round label `Min x / y`. • Tabata → 8 × 20/10, 60 s between two Tabatas (NE uses an *active* break instead of rest). • "N rounds" with stated station times → continuous stations. • AMRAP / for-time / ladder / "work up to 1RM" → a single capped block you stop when done. • "X on / Y off × N" → intervals. • Interval runs → warm-up, intervals (work estimated from distance), cool-down. • Numbered blocks (1)(2)(3) get a 30 s transition between them. |

### Per-program timer behaviour

- **HPO 24-Week (lifting):** warm-up 6 min → each block as 3 rounds of A/B/C at 40 s with 60 s between rounds → 45 s between blocks → 5-min recovery. Finish session stores elapsed.
- **HPO Run tab:** each session has "▶ Guided timer" built from the prescription text.
- **4 Horsemen:** timer parsed from the workout's `#` headers (see table above). Marking complete fills the time field if empty.
- **No Excuses:** hand-built timer per day (`NE_TIMERS`), fills every minute (EMOM fillers, active breaks, continuous rounds). Second workout has its own timer.
- **Bulletproof:** hand-built per day template; plus Feet morning routine and plantar-loading timers.
- **Road Work (running):** every session carries its own timer built from the prescription — run/walk ladders as work/rest intervals, easy runs as one block timed from distance × easy pace, tempo/cruise and interval days as warm-up → work/recovery intervals → cool-down, race day as warm-up → predicted race time → cool-down. Marking complete fills the time field if empty. **GPS run** (`gps.js`) sits under the timer on every Road Work session: Start GPS run begins tracking and starts the guided timer; it shows a live map (Leaflet + OpenStreetMap tiles, Leaflet bundled in `lib/`), distance, time, pace now (last ~12 s), average pace, per-mile/km splits and a 5K estimate (Riegel projection of the run so far). A banner and the track on the map are colour coded against the target for the timer's current segment — green on pace, blue speed up, red slow down, slate no target (get-ready, warm-up, recovery, walk, strides, cool-down); always with words and arrows as well as colour, plus a two-tone cue (rising = speed up, falling = slow down) at most every 20 s. Targets: easy = the easy range, marathon/tempo/interval/race = pace ±3%. Finish & save writes distance and time into the run's fields and stores the track (encoded polyline, ≤500 points) and splits under `S.run.log[key].gps`; the run in progress is stashed every 10 s so a closed app can Resume / Save / Discard. The screen is kept awake while tracking; web GPS stops if the phone is locked or the app is backgrounded.
- **Supple Leopard:** 2:00 per mobilization (2:00 left → 2:00 right when "each side"), one shared widget pinned at the top of the page.

---

## 3. Program page standard

Every program's "Day" page is laid out in this order:

1. Title line: `Day N` + week/phase + "· up next" when it is the next incomplete day.
2. Chips: focus, "≤ N min" (if time-boxed), "Up next → Day N" when you've navigated away.
3. Day strip (1…N, phase dividers, done dots, rest days faded).
4. Program-specific checks (Bulletproof: morning check + photos; No Excuses: no-bar toggle on pull days).
5. Warm-up (collapsible) if the program has one.
6. The workout card: title, format line, Scaled/RX/RX+ chips, blocks with headers in caps, one line per movement showing the rep target and the **version for the current scale** underneath.
7. The guided timer.
8. Logging fields (time, score/rounds, load, pain — whatever the program tracks), notes.
9. **Mark complete** button (orange when done, shows date).
10. Optional second workout (No Excuses only), unlocked after step 9.

Plan tab: rules → equipment → every day grouped by week/phase (tap to open) → the full Scaled/RX/RX+ movement table.
Progress tab: the program's own score (test comparison, pain/swelling trend, bests), never duplicated into History.

---

## 4. Adding a new program — checklist

1. **Data file** `<name>.js` loaded from `index.html` and added to the service-worker cache list.
2. Movements as `{s, r, p}` triplets (Scaled / RX / RX+). Bands are text, not weight.
3. Days as `{t, f, fmt, b:[{h, lines}], …}` with a hand-built or parsed timer (`tm()` → segments). Run the ≤ 600 s check if the program is time-boxed.
4. State under `S.<id> = {days:{}, d:1}` (generated programs like Road Work keep `{setup, log, w}` instead) with a migration line in `load()` and a reset line in "Delete all data".
5. Card on Home (`PROGRAMS` entry + card block in `vHome`) with progress % and "Up next".
6. Tab bar entry in `render()` with **History** and **More** at the end.
7. Day / Plan / Progress views following §3; timer via `tmWidget(segs, '<id>'+day, 0)`.
8. `rptEvents()` and `gapLines()` updated so the program shows in History, Gap analysis, and the Medical / PT report.
9. Bump `APP_VERSION` and the SW cache name; run the test scripts; push.

---

## 5. Decision log

| Date | Change |
|---|---|
| 2026-10-30 | App created from the HPO 24-week PDF; 4/3/2-day plans switchable; running/ESD program and pace guide included. |
| 2026-10-30 | Per-set weight/reps entry, PRs (est. 1RM), progress charts. Made a PWA; data in localStorage; backup/restore. |
| 2026-10-30 | Pushed to GitHub Pages. Password gate; 2-hour unlock. Added install instructions to the lock screen. |
| 2026-10-30 | Train tab re-laid out by rounds (superset = one set of each, then round 2, then round 3). |
| 2026-10-30 | Per-exercise lb/kg; band exercises take a band description instead of a weight. |
| 2026-10-30 | Opens at the next workout; plan selectable per week; Finish = mark complete. |
| 2026-10-30 | Home screen with program cards. Self-updating service worker + version in More. |
| 2026-10-30 | 4 Horsemen added (152 workouts, 4-month schedule) with Scaled/RX/RX+ and per-line override; glossary + video links; 1RM inputs with %-loads computed inline; maxes global across programs. |
| 2026-10-30 | Supple Leopard mobility: what-hurts picker → areas up/downstream, 68 mobilizations matched to the book's chapters, page numbers, video links, 2-min timers. |
| 2026-11-12 | No Excuses: 30-day ≤10-min bodyweight program, baseline/retest, bodyweight Scaled/RX/RX+ versions, no-bar/no-table toggle. |
| 2026-11-12 | **Timer engine**: automatic interval timers per workout, elapsed/remaining, beeps, 10 s get-ready, rep prompts during rest defaulting to prescribed. |
| 2026-11-12 | Optional second 10-min workout per No Excuses day (core; upper body on core days), unlocked after the first is complete. Per-widget ids fixed so two timers coexist. |
| 2026-11-12 | Bulletproof (knees/ankles) built as a joint-protective track: shallow range, no lunges, morning swelling/catching check with hard stop, left/right/both, Motion+Flush swap. |
| 2026-11-12 | Feet add-on (before-first-steps routine daily, foot loading alternate days), heel check in the morning check. Morning photos with side-by-side compare, included in backups. |
| 2026-11-12 | Provider report (HTML, then PDF with bundled jsPDF). Free-entry off-program workout log with pace. |
| 2026-11-12 | History tab across all programs; Gap analysis with push/pull, squat/hinge, interval/easy balance and specific fixes. |
| 2026-11-13 | No Excuses days 3–29 densified to fill every minute (EMOM fillers, active breaks, continuous rounds). Push 1 kept as logged. |
| 2026-11-13 | **All programs moved onto the one timer engine** (HPO lifting + running, 4 Horsemen parsed from headers, Supple Leopard). |
| 2026-11-13 | 10 s exercise switch inserted between back-to-back different exercises; circuit days re-trimmed to 10 min; **per-workout toggle** + global default in More. |
| 2026-11-13 | This document created. |
| 2026-11-13 | Medical / PT report / History descriptions rewritten in plain words: what the session was, the actual movement versions used, reps/loads/results, notes — readable by someone who has never seen the app. |
| 2026-11-13 | Completion date = time marked complete, all dates local not UTC; **Clear this day** button on every Day page (HPO, Horsemen, No Excuses, Bulletproof, today's mobility). |
| 2026-11-13 | **Road Work running plan** (`run.js`): goals Return-to-running 5K / 5K / 10K / Half / Marathon. Paces from one race or time trial via Daniels' VDOT (E/M/T/I/R); predicted times for every distance. Plan generated from current weekly volume, runs/week (3–5), start date and either a race date (plan compresses/stretches within each goal's min–max weeks) or a default length that yields an estimated race-ready date. Volume +8%/wk, cutback every 4th week, two-week taper; long run ~1/3 of volume; 80/20 easy/hard; marathon long runs with MP finish. Adapts: a logged run flagged "race / all-out" re-sets paces; <60% of a week done → next week −10%; two runs at effort ≥8 → next week −8%. "Did it on the bike" option per the swap rule. Logged into History, Gaps and the Medical / PT report. |
| 2026-11-13 | Standards audit: rep prompts limited to programs that save them; **?** help added to No Excuses, Bulletproof and HPO lines; mobility sessions now counted in History / Gaps / Medical / PT report; No Excuses and Bulletproof store the timer's elapsed on completion; HPO scaling exception documented. |
| 2026-11-13 | Pace display: round total seconds first, then split into min:sec, so a pace never shows as x:60 (Road Work chips and free-logged run pace in History). |
| 2026-11-13 | **Report a problem / request a change** added (Home + More): in-app form → GitHub issue → `FEEDBACK.md` via workflow. Admin setup in More locks the GitHub key with the app password. App password removed from this document. |
| 2026-11-13 | App password changed; check moved from plain SHA-256 to salted PBKDF2 (1,000,000 rounds). The request-list key must be connected with the new password. |
| 2026-11-13 | **Lock** button added to the top-right corner of every screen (added once in `render()`, so new programs get it automatically). |
| 2026-11-13 | **Medical / PT report generalized**: area tiles, user-typed description and questions, per-issue daily check-ins, multiple issues. All personal health text removed from the code and docs, and the repository history replaced with a single commit so earlier versions are no longer on the branch. |
| 2026-11-14 | **GPS run tracking for Road Work** (`gps.js`, v1.49): live map and route, distance, pace now / average (min per mile or km), splits, 5K estimate, colour-coded speed-up / slow-down coaching tied to the timer segment, saved track with review map, GPS run log on the Fitness tab, unfinished-run recovery. |

---

## 6. Open items / ideas not yet built

- Switch length other than 10 s (e.g. 15 s) if gym logistics need it.
- Per-program "pain during" field on HPO/Horsemen days.
- Export of History as CSV.
