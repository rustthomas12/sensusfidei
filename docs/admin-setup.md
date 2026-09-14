# Setting up /admin

The site has a content editor at `/admin` (Sveltia CMS — a Decap/Netlify CMS-compatible
admin UI, loaded from a CDN, no build step of its own). It lets you sign in with GitHub and
edit posts, the About page, and sitewide settings (footer links, tagline) from a form in the
browser instead of hand-editing files.

**How it actually works, in one paragraph:** hitting "Save" in `/admin` makes a real git
commit to this repo (or, since editorial workflow is on, opens a pull request first).
Vercel's existing GitHub integration picks that up and redeploys automatically — nothing new
to host, no database, and every edit is a normal, revertable commit you can see in
`git log` or on GitHub.

## One-time setup: register the GitHub OAuth App

This part has to happen in GitHub's own UI — there's no API for creating OAuth apps, so it
can't be scripted.

1. Go to **github.com/settings/developers → OAuth Apps → New OAuth App**.
2. Fill in:
   - **Application name**: anything, e.g. `Sensus Fidei Admin`
   - **Homepage URL**: `https://sensusfidei-mauve.vercel.app`
   - **Authorization callback URL**: `https://sensusfidei-mauve.vercel.app/api/auth/callback`
     (must match exactly, including no trailing slash)
3. Click **Register application**.
4. Copy the **Client ID** shown on the resulting page.
5. Click **Generate a new client secret** and copy it immediately — GitHub only shows it once.

## One-time setup: add the two secrets to Vercel

Both values from above need to become environment variables on the Vercel project
(`thomas-rusts-projects/sensusfidei`), scoped to Production:

- `GITHUB_OAUTH_CLIENT_ID`
- `GITHUB_OAUTH_CLIENT_SECRET`

Either add them in the Vercel dashboard (Project → Settings → Environment Variables), or
from the CLI:

```bash
vercel env add GITHUB_OAUTH_CLIENT_ID production
vercel env add GITHUB_OAUTH_CLIENT_SECRET production
```

Then redeploy (`vercel --prod`, or just push a commit) so the running deployment picks up
the new values — Vercel doesn't hot-reload env vars into an already-built deployment.

## Using it day to day

- Go to `/admin`, click **Login with GitHub**, approve the app the first time.
- Access is controlled entirely by GitHub repo permissions — anyone who can push to this
  repo can sign in and edit; no separate password to manage. Adding a co-author later is
  just adding them as a GitHub collaborator, nothing to reconfigure here.
- **Essays** collection: edit any past post, or click "New Essay" for a new one. Fields
  cover title, section, dek, date, an optional pull quote, an optional hero photo (with alt
  text), a draft toggle, and three optional SEO overrides (title/description/share image) —
  each SEO field falls back to the equivalent editorial field when left blank, so you only
  need to touch them when the ideal search/share phrasing differs from what a reader sees.
- **Pages → About page**: edits the About page's title and body directly.
- **Site settings → Sitewide settings**: the footer's Substack/Pinterest/LinkedIn links and
  blurb, and the header's tagline. Replace the three `REPLACE-WITH-...` placeholder links
  here whenever the real handles are ready.
- Every save goes through **editorial workflow**: it opens a pull request rather than
  publishing straight to master, and Vercel auto-builds a preview link for that PR so you
  can read the finished page for real before merging it live.

## If you add a sixth section later

Sections (`faith`, `stewardship`, …) are still a fixed list in two places —
`src/data/sections.ts` and the `section` field's `options` in `public/admin/config.yml` —
so adding one is a small code change, not something to do from `/admin` itself. Ask for it
whenever you're ready to add one; it's a five-minute change.
