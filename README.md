# وميض CRM — Wameed CRM

## Setup

### 1. Supabase
1. Create project at supabase.com
2. Go to SQL Editor → paste content of `supabase/migrations/001_init.sql` → Run
3. Copy your Project URL and anon key

### 2. Environment Variables
In Vercel dashboard → Settings → Environment Variables, add:
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Deploy to Vercel
1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import from GitHub
3. Add environment variables
4. Deploy ✅

### 4. Create first admin user
In Supabase → Authentication → Users → Add User
Then in SQL Editor:
```sql
INSERT INTO users (auth_id, name, email, role, avatar)
VALUES ('your-auth-uuid', 'أحمد علي', 'ahmed@wameed.sa', 'admin', 'أع');
```
Replace `your-auth-uuid` with the UUID from the Authentication tab.

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- Supabase (Auth + Database)
- React Router v6
- Recharts
- Vercel (Hosting)
