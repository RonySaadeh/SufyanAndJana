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

## Editing the details

Open `index.html` and search for `var INVITATION = {` — the date, venue,
address, and map query are all set there in one place.
