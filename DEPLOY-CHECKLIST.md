# ✅ Deploy Checklist — fill in as you go

## What I (Buffy) already did
- [x] Project builds for production (`npm run build` works)
- [x] Server serves the website + API on one port (`npm start`)
- [x] Private data protected from git (.env, passwords, client leads)
- [x] `push-to-github.txt` — exact commands to push
- [x] `DEPLOY.md` — full hosting guide

## Step 1 — GitHub (10 min)
- [ ] Sign up: https://github.com/signup  → use yadavanandraj304@gmail.com
- [ ] Verify your email (click the link GitHub sends)
- [ ] Open PowerShell in the project folder, run the commands in `push-to-github.txt`
- [ ] My repo URL: ______________________________________

## Step 2 — Render.com (10 min)
- [ ] Sign up: https://dashboard.render.com/register → "Sign in with Google"
- [ ] New + → Web Service → pick your `freebuff` repo → Connect
- [ ] Fill exactly:
  - Name: `hitech-civil`
  - Region: Singapore (closest to Nepal)
  - Branch: `main`
  - Build Command: `npm install && npm run build`
  - Start Command: `npm start`
  - Instance type: Free
- [ ] Environment (Advanced → Add Environment Variable):
  - `GMAIL_USER` = your Gmail address
  - `GMAIL_APP_PASSWORD` = your 16-char App Password (never your normal password)
  - `HOST` = `0.0.0.0`
- [ ] Disks → Add Disk: name `data`, Mount Path `server/data`, 1 GB
- [ ] Create Web Service → wait ~5 min for "Live"

## Step 3 — Your URLs (fill in after deploy)
- Website: `https://______________.onrender.com`
- Admin dashboard: `https://______________.onrender.com/#/admin`

## Step 4 — Admin logins (after first deploy, set fresh ones)
The password file is NOT uploaded (it's gitignored — by design). On the fresh server:
- All 3 emails work as usernames:
  - yadavanandraj304@gmail.com
  - codework143@gmail.com
  - hitechrajesh2023@gmail.com
- Default fallback password until you change it: `HiTech@Birgunj#2073`
- [ ] Sign in → Settings → confirm phone/email/links/team → Save
- [ ] Upload team photos → Save
- [ ] Test: submit an inquiry on the live site → check it lands in hitechrajesh2023@gmail.com

## Step 5 — Tell the world
- [ ] Add the URL to your Facebook page + TikTok bio
- [ ] Google Business Profile → website field
- [ ] WhatsApp status / SMS signature
