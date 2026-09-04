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
appends a row to a Google Sheet, and it emails a copy to
**attarsufyan@gmail.com** — so an email is always sent even if, say, the
sheet gets renamed or deleted later.

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
   and their note) and sends attarsufyan@gmail.com an email with who
   replied, whether they're attending, the total number of guests, and
   everyone's names.

If `rsvpEndpoint` is left as `null`, RSVPs still work, they're just kept in
the replying guest's own browser instead of reaching the sheet or the inbox.

If you ever need to change what the script does (including the notification
email address), edit it directly in the Apps Script editor (script.google.com)
and choose **Deploy → Manage deployments → Edit → New version** — the URL
stays the same, so nothing in `index.html` needs to change.
`google-apps-script/Code.gs` in this repo is kept in sync as the reference
copy. If that change adds a new permission (it won't, for just changing the
address), you'll be asked to re-authorize the same way as step 5.

**Sending on Google's free tier is capped at 100 emails/day** (1,500/day on
a Google Workspace account) — far more than a wedding will ever need, but
worth knowing if you ever reuse this script elsewhere.
