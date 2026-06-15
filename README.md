# CybearbotsWeb

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
6. In the left sidebar, click **Settings** → **API**.
   - Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
   - Copy the **anon public** key (a long string)

## 2. Connect the site to Supabase

1. In this project folder, copy `.env.example` to a new file named `.env`
2. Paste in your Project URL and anon key:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Save the file.

## 3. Run it locally (optional, to preview before deploying)

```bash
npm install
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

## 4. Deploy for free (Netlify)

1. Build the site:
   ```bash
   npm run build
   ```
   This creates a `dist/` folder with the finished site.
2. Go to [netlify.com](https://netlify.com) and create a free account.
3. From your Netlify dashboard, drag and drop the `dist/` folder onto the
   page (look for "Deploy manually" / drag-and-drop area).
4. Netlify gives you a live URL immediately (like `random-name-123.netlify.app`).

### Important: add your environment variables to Netlify too

If you ever rebuild and redeploy through Netlify's Git integration (rather
than drag-and-drop), you'll need to add the same `VITE_SUPABASE_URL` and
`VITE_SUPABASE_ANON_KEY` values in **Site settings → Environment variables**
on Netlify, since `.env` files aren't committed to git.

### Connect your custom domain

1. In Netlify, go to **Site settings → Domain management → Add a domain**.
2. Enter your domain name.
3. Netlify will show you DNS records to add. Go to wherever you registered
   your domain (GoDaddy, Namecheap, Google Domains, etc.), find the DNS
   settings, and add the records Netlify shows you (usually a CNAME or A
   record).
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
