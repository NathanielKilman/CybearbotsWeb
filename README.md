# CyBearBots #7504 Website

A full website for FRC Team 7504 (CyBearBots, Brewster High School). Built with
React + Vite + Tailwind CSS, backed by Supabase for content storage, image
uploads, news posts, sponsors, team members, competitions, robot gallery, and
a password-protected "Team Access" build season task board.

## What you get

- 11 pages: Home, Our Story, What is FIRST, Meet the Team, Competitions,
  Robot Gallery, News, Outreach, Sponsors, Contact, Team Access
- Light & dark mode toggle (persists per-browser)
- Every image on the site is an upload slot — click to upload your own photos
- Once unlocked with the shared "Team Access" password, team members can edit
  any text on the site inline, add/edit/delete news posts, team members,
  sponsors, competitions, robot entries, and manage the build season task board
- Sponsor inquiry form and general contact form (both save to the database)
- Robot Gallery page can be hidden from navigation without losing its content

---

## 1. Set up Supabase (free database + image storage)

1. Go to [supabase.com](https://supabase.com) and create a free account
   (no credit card required).
2. Click **New Project**. Pick any name/region, and set a database password
   (save it somewhere — you likely won't need it again, but just in case).
3. Wait ~2 minutes for the project to finish setting up.
4. In the left sidebar, click **SQL Editor** → **New query**.
5. Open the file `supabase-setup.sql` in this project, copy its ENTIRE
   contents, paste into the SQL editor, and click **Run**.
   - This creates all the tables, sets up security rules, creates the image
     storage bucket, and adds some starter data (the 8 competition seasons,
     default task board sections, etc.)
6. In the left sidebar, click **Settings** → **Data API**.
   - Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
7. In the left sidebar, click **Settings** → **API Keys**.
   - Copy the **Publishable key** (starts with `sb_publishable_...`)

## 2. Connect the site to Supabase

1. In this project folder, copy `.env.example` to a new file named `.env`
2. Paste in your Project URL and publishable key:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=sb_publishable_xxxxxxxxxxxxxxxx
   ```
3. Save the file.

## 3. Run it locally (optional, to preview before deploying)

```
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## 4. Deploy for free (Cloudflare Pages)

Cloudflare Pages gives you unlimited bandwidth on the free plan — your site
will never get throttled or hit a traffic cap, no matter how many people visit.

### Option A — connect your GitHub repo (recommended)

1. Push this entire project to a GitHub repository. Make sure the `src/`
   folder (with all its subfolders — `components`, `pages`, `context`, `lib`)
   actually ends up in the repo. The repo's root should contain `index.html`,
   `package.json`, `vite.config.js`, and a `src/` folder side by side.
   - If you're not comfortable with git commands, **GitHub Desktop** (free
     app) is the most reliable way to upload a whole project folder including
     subfolders — drag-and-drop uploads on github.com sometimes drop nested
     folders.
2. Go to [dash.cloudflare.com](https://dash.cloudflare.com), sign in (or
   create a free account).
3. From the dashboard, choose **Workers & Pages** (or the "Connect git repo
   or use template" tile on the main "start building" screen).
4. Connect your GitHub account and select your repository.
5. When asked for build settings, use:
   - **Framework preset**: Vite (or None, if Vite isn't listed)
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. **Before clicking deploy**, add your environment variables (important —
   otherwise the site won't connect to Supabase):
   - Find **Environment variables** in the setup screen (or in
     **Settings → Environment variables** after the project is created)
   - Add:
     - `VITE_SUPABASE_URL` = `https://xxxxx.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `sb_publishable_xxxxxxxxxxxxxxxx`
7. Click **Save and Deploy**. Cloudflare will install dependencies, run the
   build, and give you a live URL like `your-project.pages.dev`.

After this initial setup, every time you push changes to GitHub, Cloudflare
automatically rebuilds and redeploys the site.

### Option B — direct upload (no GitHub)

1. On your computer, run:
   ```
   npm install
   npm run build
   ```
   This creates a `dist/` folder with the finished site.
2. In Cloudflare's **Workers & Pages** section, look for an option to create
   a project via **direct upload** (sometimes labeled "Upload assets" or
   "Deploy without git").
3. Upload the contents of the `dist/` folder.
4. Since direct uploads don't run a build step, your `.env` values get baked
   in at build time on your machine — make sure your local `.env` file has
   the correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` *before*
   running `npm run build`.

Option A is recommended since it handles rebuilds automatically and keeps
your environment variables managed in one place.

### Connect your custom domain

1. In your Cloudflare Pages project, go to **Custom domains**.
2. Click **Set up a custom domain** and enter your domain name.
3. If your domain's DNS is already managed by Cloudflare, this is close to
   instant. If your domain is registered elsewhere (GoDaddy, Namecheap,
   etc.), Cloudflare will show you the DNS records to add at your registrar
   (usually a CNAME record).
4. DNS changes can take a few minutes to 24 hours to take effect.

---

## Using the site

### Team Access (password-protected admin)

- Go to `/team-access` (link is in the nav bar).
- The default password is **`cybearbots7504`**.
- Once unlocked, you can:
  - **Change the team password** in the Site Settings panel at the top of
    the Team Access page
  - **Show/hide the Robot Gallery** page from navigation
  - **Edit any text** across the site — hover over text and click the small
    pencil icon that appears
  - **Upload/replace any image** — click any "upload" box, or hover over an
    existing image and click "Replace image"
  - **Add/edit/delete** news posts, team members, sponsors, competition
    seasons, and robot gallery entries (look for "+ Add..." buttons)
  - **Manage the task board** — add sections, add tasks, click a task's
    status badge to cycle between To Do → In Progress → Done

"Unlocking" lasts for your browser session (until you close the tab or click
"Lock"). Anyone with the password can edit — there are no individual logins,
matching how a small team typically operates.

### If Supabase pauses (free tier)

Supabase free projects pause automatically after 7 days with no database
activity. If your site stops loading dynamic content (news, sponsors, task
board, etc.):

1. Log into [supabase.com](https://supabase.com)
2. Open your project — you'll see a "Restore" or "Resume" button
3. Click it; the project wakes up in under a minute

The static parts of the site (layout, navigation) will still load even if
the database is paused — only the dynamic content will be temporarily empty.

---

## Project structure

```
src/
  components/   Shared UI: Navbar, Footer, PageHero, ImageUpload, EditableText...
  context/      Theme (light/dark) and Team Access auth state
  lib/          Supabase client, data-fetching hooks
  pages/        One file per page/route
supabase-setup.sql   Run once in Supabase's SQL editor to set up the database
```

## Making design changes later

If you want to change colors, fonts, or styling, the main place to look is
`src/index.css` — it defines CSS variables (`--bg`, `--accent`, `--text`,
etc.) for both light and dark mode near the top of the file.
