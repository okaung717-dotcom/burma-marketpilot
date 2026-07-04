# Burma MarketPilot

Masterpiece-level onboarding website starter for Myanmar online business owners.

## Tech Stack

- React + Vite + TypeScript
- Supabase Auth, Postgres, Row Level Security, Storage
- Pure CSS design system with 4 main colors
  - Premium Teal: `#006159`
  - Warm Gold: `#ffb957`
  - Soft Canvas: `#f9f9f6`
  - Ink Black: `#1a1c1b`

## Pages Included

1. Sign Up
   - Account Name
   - Password
   - Supabase Auth connection
2. Business DNA Setup — Step 1
   - Business logo upload
   - Business name
   - Industry category
   - Business description
   - Product details
   - Product image uploads
   - Brand voice
3. Business DNA Setup — Step 2
   - Facebook Page
   - Instagram
   - TikTok
   - Messenger
   - Viber
   - Telegram
   - Website
   - Google Business
   - Posting habits
   - AI assistance needs
4. Ready Screen
   - Next feature direction for content calendar, captions, PDF/Google Sheet export, Burma Ai Studio recommendation

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open the local URL shown by Vite, usually:

```bash
http://localhost:5173
```

## Supabase Setup

1. Create a new Supabase project.
2. Go to **SQL Editor**.
3. Open `supabase/schema.sql` from this project.
4. Paste the SQL and click **Run**.
5. Go to **Project Settings > API**.
6. Copy:
   - Project URL
   - anon public key
7. Put them in `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

8. Restart Vite:

```bash
npm run dev
```

## Important Auth Note

The UI keeps the requested “Account Name + Password” sign up style. For Supabase MVP testing, the app converts the account name into an internal email like:

```text
brandname@burmamarketpilot.local
```

For production, add a real email or phone field for password recovery and account verification.

## GitHub Upload

```bash
git init
git add .
git commit -m "Initial Burma MarketPilot starter"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/burma-marketpilot.git
git push -u origin main
```

## Suggested Next Features

- AI content calendar generator
- Caption and copy generator
- PDF export
- Google Sheets export
- Burma Ai Studio image/video creation recommendation
- Real OAuth connections for Facebook, Instagram, TikTok, and Google Business
