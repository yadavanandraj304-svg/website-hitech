# 🌍 Publish this website to the world

Your site is **one Node.js server** that serves both the website (`dist/`) and the
inquiry API on the same port — so any host that runs Node.js can serve it in one step.

## What gets deployed

```
server/            the app: index.js + data/ (inquiries, settings, reviews, projects)
dist/              the built website — regenerate with: npm run build
package.json + package-lock.json
.env               GMAIL_USER + GMAIL_APP_PASSWORD (secrets — never commit)
```

Already done for you:
- `npm run build` works → `dist/` is generated and the server serves it ✅
- The server binds to `0.0.0.0` on hosts like Render/Railway/Fly (via `HOST` env) and
  stays localhost-only on your own PC ✅

---

## Option A — Render.com (recommended: free, no credit card)

1. Go to https://render.com → **Sign Up** (use hitechrajesh2023@gmail.com)
2. **New +** → **Web Service** → connect your GitHub repo (first push the code, see below)
3. Settings:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment variables:** add `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and `HOST=0.0.0.0`
   - **Disk** (important!): mount a disk at `server/data` so inquiries survive restarts
4. Deploy → you get a URL like `https://hitech-civil.onrender.com` — open it in Chrome anywhere in the world 🎉

## Option B — Railway.app (similar, slightly easier disk handling)

1. https://railway.app → sign in with GitHub → **New Project** → Deploy from repo
2. Add the same env vars; Railway auto-detects `npm start`
3. **Settings → Networking → Generate Domain** → your public URL

## Option C — Your own domain + hosting you pay for

Any "Node.js hosting" or a $3–5/mo VPS works. On a VPS:
```bash
npm install && npm run build
HOST=0.0.0.0 PORT=80 npm start     # then point your domain's A record at the server IP
```

## Custom domain (e.g. hitechcivil.com.np)

1. Buy the domain (e.g. mercantile.com.np or any registrar)
2. In Render/Railway → Settings → Custom Domain → enter it
3. At the registrar, add the CNAME/A record they show you
4. HTTPS is automatic

---

## First: put the code on GitHub (needed for Render/Railway)

```bash
# on your PC, in this folder:
git init
git add .
git commit -m "Hi-Tech Civil website"
git branch -M main
# create an empty repo on github.com first, then:
git remote add origin https://github.com/YOUR-USERNAME/hitech-civil.git
git push -u origin main
```

⚠️ `.gitignore` already excludes `.env`, `server/data/admin-auth.json` and the inquiry
database — keep it that way so passwords never reach GitHub.

## After deploying — checklist

- [ ] Submit a test inquiry from the live site → arrives at hitechrajesh2023@gmail.com
- [ ] Sign in at `your-url/#/admin` with your admin email + password
- [ ] Upload team photos + add projects from the admin dashboard
- [ ] Add the live URL to your Facebook page and Google Business Profile

## Notes

- Gmail email sending keeps working in production (same App Password) — no change needed.
- Data (leads, settings, reviews, projects) lives in `server/data/*.json`; keep the
  Render disk or Railway volume mounted, or you lose new leads on each restart.
- Admin passwords stay in `server/data/admin-auth.json` (gitignored, so NOT on
  GitHub). On a fresh server, all 3 admin emails sign in with the fallback password
  `HiTech@Birgunj#2073` — sign in and change it from the dashboard as soon as it's
  live. See DEPLOY-CHECKLIST.md for the full checklist.
