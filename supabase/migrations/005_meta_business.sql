-- ─────────────────────────────────────────────────────────────────────────
-- 005_meta_business.sql
--
-- Adds support for linking each client to a Meta (Facebook) ad account and
-- syncing campaign performance automatically instead of manual entry.
--
-- How it works:
--   1. One Wameed admin connects their Meta account once (OAuth login).
--      Their access token is stored ONLY in `meta_connections`, a table
--      locked down so no frontend user (not even an authenticated team
--      member) can read it — only Supabase Edge Functions (service_role)
--      can touch it.
--   2. The `meta-oauth-exchange` edge function uses that token to list every
--      ad account the connected person can see, and upserts them into the
--      existing `ad_accounts` table with client_id = NULL ("unlinked").
--   3. From the "البيزنسات" tab, an admin picks which client owns each
--      discovered account. That just sets client_id + status='connected'.
--   4. The `meta-campaigns-sync` edge function (added later) reads linked,
--      connected accounts and upserts weekly numbers into `campaigns`.
-- ─────────────────────────────────────────────────────────────────────────

-- ─── META CONNECTION (single shared OAuth token) ───────────────────────
CREATE TABLE meta_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fb_user_id TEXT,
  fb_user_name TEXT,
  connected_by UUID REFERENCES users(id),
  access_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE meta_connections ENABLE ROW LEVEL SECURITY;
-- Deliberately NO policies here. With RLS enabled and zero policies, the
-- anon/authenticated roles used by the frontend get ZERO access — only
-- service_role (used inside Edge Functions) can read/write this table.

-- ─── SECURE THE EXISTING ad_accounts TOKEN COLUMNS ─────────────────────
-- These columns already existed but were readable by any logged-in user
-- through the "allow_all_authenticated" policy. Lock them down at the
-- column level regardless of which row-level policy applies.
REVOKE SELECT (access_token, refresh_token) ON ad_accounts FROM authenticated;
GRANT SELECT (access_token, refresh_token) ON ad_accounts TO service_role;

-- ─── LET ad_accounts REPRESENT "DISCOVERED BUT NOT YET LINKED" ROWS ────
-- client_id was NOT NULL, which meant we couldn't store an account until
-- someone manually assigned it to a client. Make it nullable so discovery
-- can persist the full list immediately; linking just fills client_id in.
ALTER TABLE ad_accounts ALTER COLUMN client_id DROP NOT NULL;

ALTER TABLE ad_accounts ADD COLUMN IF NOT EXISTS business_name TEXT;
ALTER TABLE ad_accounts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'unlinked'
  CHECK (status IN ('unlinked','connected','error','paused'));
ALTER TABLE ad_accounts ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

-- Never discover/store the exact same Meta account twice.
ALTER TABLE ad_accounts ADD CONSTRAINT ad_accounts_platform_account_unique
  UNIQUE (platform, account_id);

-- Enforce "كل عميل في بيزنس واحد" — at most one LINKED account per client
-- per platform. Multiple unlinked (client_id IS NULL) rows are still fine.
CREATE UNIQUE INDEX ad_accounts_one_per_client_platform
  ON ad_accounts(client_id, platform) WHERE client_id IS NOT NULL;
