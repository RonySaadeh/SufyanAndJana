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

## RSVPs into a Google Sheet

Each reply already asks for the replying guest's name, yes/no, a party size,
and — once the party size is more than one — the full name of every other
guest coming with them. Wiring that up to a Google Sheet takes one Apps
Script deployment, no server of your own required:

1. Create a new Google Sheet (any name — e.g. "Sufyan & Jana RSVPs").
2. In it, go to **Extensions → Apps Script**.
3. Delete the placeholder `Code.gs` content and paste in this repo's
   `google-apps-script/Code.gs`.
4. Click **Deploy → New deployment**, choose type **Web app**, and set:
   - **Execute as:** Me
   - **Who has access:** Anyone
5. Click **Deploy**, authorize it when prompted, then copy the **Web app
   URL** it gives you (it ends in `/exec`).
6. In `index.html`, find `rsvpEndpoint:null` inside `var INVITATION = {`
   and replace `null` with that URL in quotes, e.g.
   `rsvpEndpoint:"https://script.google.com/macros/s/AKfycb.../exec"`.
7. Commit and push. Every RSVP now appends a row to the sheet's `RSVPs`
   tab: timestamp, name, attending, party size, the other guests' names,
   and their note.

If `rsvpEndpoint` is left as `null`, RSVPs still work — they're just kept
in the replying guest's own browser instead of a shared sheet.

If you ever need to change what the script does, edit it directly in the
Apps Script editor (script.google.com) and choose **Deploy → Manage
deployments → Edit → New version** — the URL stays the same, so nothing in
`index.html` needs to change. `google-apps-script/Code.gs` in this repo is
kept in sync as the reference copy.
