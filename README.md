# Sufyan & Jana

Wedding invitation website — single-page, static, ready for GitHub Pages.

## Deploying with GitHub Pages

1. Push this branch (or merge it into your default branch — GitHub Pages
   serves from a single branch, usually `main`).
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`,
   pick the branch that has this content, and folder `/ (root)`.
4. Save. GitHub gives you a URL like
   `https://ronysaadeh.github.io/SufyanAndJana/` within a minute or two.

## What's in here

- `index.html` — the entire site (markup, styles, and script inline).
- `music/face-in-the-photograph.mp3` — the background track. The page tries
  to start it automatically on load; if the visitor's browser blocks
  autoplay with sound (most do, until there's been some interaction), it
  starts the instant they scroll, tap, or click anywhere on the page.
- `google-apps-script/Code.gs` — the RSVP backend (see below).

## Editing the details

Open `index.html` and search for `var INVITATION = {` — the date, venue,
address, and map query are all set there in one place.

## RSVPs into a Google Sheet, plus an email copy

Each reply already asks for the replying guest's name, yes/no, a party size,
and, once the party size is more than one, the full name of every other
guest coming with them. Wiring that up takes one Apps Script deployment, no
server of your own required. Every RSVP does two independent things: it
appends a row to a Google Sheet, and it emails a copy to whoever is listed
in `NOTIFY_EMAIL` (currently **attarsufyan@gmail.com** and
**rony.saadehmisc@hotmail.com**) — so an email is always sent even if, say,
the sheet gets renamed or deleted later.

1. Create a new Google Sheet (any name, e.g. "Sufyan & Jana RSVPs").
2. In it, go to **Extensions → Apps Script**.
3. Delete the placeholder `Code.gs` content and paste in this repo's
   `google-apps-script/Code.gs`. (To send the email copy somewhere else
   instead, change the `NOTIFY_EMAIL` value at the top of that file before
   pasting it in.)
4. Click **Deploy → New deployment**, choose type **Web app**, and set:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**, then authorize it when prompted. This step now asks
   for an extra permission to send email as you, alongside editing the
   sheet — that's expected, it's what lets the script BCC-free-mail the
   notification.
6. Copy the **Web app URL** it gives you (it ends in `/exec`).
7. In `index.html`, find `rsvpEndpoint:null` inside `var INVITATION = {`
   and replace `null` with that URL in quotes, e.g.
   `rsvpEndpoint:"https://script.google.com/macros/s/AKfycb.../exec"`.
8. Commit and push. Every RSVP now appends a row to the sheet's `RSVPs`
   tab (timestamp, name, attending, party size, the other guests' names,
   and their note) and emails `NOTIFY_EMAIL` with who replied, whether
   they're attending, the total number of guests, and everyone's names.

If `rsvpEndpoint` is left as `null`, RSVPs still work, they're just kept in
the replying guest's own browser instead of reaching the sheet or the inbox.

If you ever need to change what the script does (including the notification
addresses), edit it directly in the Apps Script editor (script.google.com):

- **Edit the existing deployment, don't create a new one.** Use
  **Deploy → Manage deployments**, click the pencil on the deployment
  that's already live, and set **Version** to **New version** before
  clicking **Deploy**. That keeps the same `/exec` URL, so nothing in
  `index.html` needs to change. Using **Deploy → New deployment** instead
  gives you a *different* URL — the live site keeps hitting the old one
  (running the old code) until you update `rsvpEndpoint` to match, which
  looks exactly like "nothing happened."
- If that change adds a new permission (sending email is one; just editing
  the recipient list isn't), you'll be asked to re-authorize the same way
  as step 5. Skipping that prompt is the other classic cause of "the sheet
  updates but no email arrives," since the script silently can't act on a
  permission it was never granted.

**If an RSVP doesn't produce an email (or a row):** check the **Errors**
tab in the spreadsheet first — a failed sheet write or a failed send both
log a row there (When / Where / Error) instead of failing silently. If
that tab has nothing and the `RSVPs` tab also has nothing for your test,
the request isn't reaching the script at all — double-check `rsvpEndpoint`
in `index.html` matches the current deployment's URL exactly. You can also
open **Executions** in the Apps Script editor's left sidebar to see every
`doPost` call and, on failure, what threw.

**Sending on Google's free tier is capped at 100 emails/day** (1,500/day on
a Google Workspace account) — far more than a wedding will ever need, but
worth knowing if you ever reuse this script elsewhere.
