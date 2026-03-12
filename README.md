# UOG Past Papers — Hafiz Hayat Campus
## Complete Deployment Guide (Zero Cost)

---

## STEP 1 — Set Up Supabase Database (10 minutes)

1. Go to https://supabase.com → Sign in → New Project
2. Name it: `uog-past-papers`
3. Choose a strong password → Select region: Southeast Asia
4. Wait 2 minutes for project to spin up

**Run the database schema:**
1. Click **SQL Editor** in left sidebar
2. Click **New Query**
3. Copy the entire contents of `supabase-schema.sql`
4. Paste it in and click **Run**
5. You should see "Success" ✅

**Get your API keys:**
1. Go to **Project Settings → API**
2. Copy:
   - `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## STEP 2 — Set Up the Project Locally (5 minutes)

```bash
# Clone or download this project
cd uog-past-papers

# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Edit .env.local and fill in your Supabase keys
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx

# Run locally to test
npm run dev
```

Open http://localhost:3000 — your app is running!

---

## STEP 3 — Push to GitHub (3 minutes)

```bash
git init
git add .
git commit -m "UOG Past Papers - initial commit"
git branch -M main

# Create a new repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/uog-past-papers.git
git push -u origin main
```

---

## STEP 4 — Deploy to Vercel (5 minutes)

1. Go to https://vercel.com → New Project
2. Import your GitHub repo `uog-past-papers`
3. Click **Environment Variables** and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL      = your supabase URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY = your anon key
   NEXT_PUBLIC_ADMIN_EMAIL       = your-email@gmail.com
   ```
4. Click **Deploy**
5. Your app is live! 🎉

Every time you push to GitHub, Vercel auto-deploys.

---

## STEP 5 — How to Approve Papers (Admin)

When a student uploads a paper, it goes into a queue.
To approve it, visit: `https://your-app.vercel.app/admin`

OR approve directly in Supabase:
1. Supabase → Table Editor → papers
2. Find the paper
3. Set `is_approved` to `true`

---

## Project Structure

```
uog-papers/
├── app/
│   ├── page.tsx          ← Homepage
│   ├── browse/page.tsx   ← Browse & filter papers
│   ├── upload/page.tsx   ← Upload form
│   ├── login/page.tsx    ← Magic link login
│   ├── admin/page.tsx    ← Admin approval panel
│   └── auth/callback/    ← Supabase auth callback
├── lib/
│   ├── supabase.ts       ← Supabase client
│   ├── uog-data.ts       ← All UOG departments/degrees
│   └── types.ts          ← TypeScript types
├── supabase-schema.sql   ← Run this in Supabase
└── .env.local.example    ← Copy to .env.local
```

---

## Features

- ✅ Browse papers without login
- ✅ Filter by Faculty → Department → Degree → Semester → Shift → Exam Type → Year
- ✅ Search by course name (debounced)
- ✅ Magic link login (no password)
- ✅ PDF upload with drag & drop
- ✅ 5MB limit + PDF validation
- ✅ Admin approval queue
- ✅ Mobile responsive
- ✅ 100% Free (Vercel + Supabase free tier)

---

## Cost: Rs. 0 Forever

| Service  | Free Limit        | Your Usage         |
|----------|-------------------|--------------------|
| Vercel   | Unlimited deploys | ✅ Fine             |
| Supabase | 500MB DB, 1GB storage | ✅ Fine for years |
| GitHub   | Unlimited public repos | ✅ Free          |
