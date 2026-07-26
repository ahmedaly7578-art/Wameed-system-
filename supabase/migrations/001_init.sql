-- =============================================
-- WAMEED CRM — Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS (team members) ───────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'media_buyer', 'social_media', 'account_manager')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CLIENTS ────────────────────────────────
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  password TEXT,
  pkg_amount NUMERIC NOT NULL DEFAULT 0,
  platforms TEXT[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'hold', 'cancelled')),
  mb_id UUID REFERENCES users(id),
  sm_id UUID REFERENCES users(id),
  am_id UUID REFERENCES users(id),
  start_date DATE,
  end_date DATE,
  roas NUMERIC DEFAULT 0,
  total_spend NUMERIC DEFAULT 0,
  notes TEXT,
  cancel_reason TEXT,
  cancel_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── AD ACCOUNTS (per client per platform) ──
CREATE TABLE ad_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('Meta', 'TikTok', 'Snapchat', 'Google', 'YouTube', 'X')),
  account_id TEXT NOT NULL,
  account_name TEXT,
  access_token TEXT,
  refresh_token TEXT,
  token_expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CAMPAIGNS (weekly data per account) ────
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  ad_account_id UUID REFERENCES ad_accounts(id),
  platform TEXT NOT NULL,
  week_start DATE NOT NULL,
  spend NUMERIC DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  reach INTEGER DEFAULT 0,
  purchases INTEGER DEFAULT 0,
  purchase_value NUMERIC DEFAULT 0,
  roas NUMERIC DEFAULT 0,
  ctr NUMERIC DEFAULT 0,
  cpm NUMERIC DEFAULT 0,
  cpc NUMERIC DEFAULT 0,
  checkout INTEGER DEFAULT 0,
  add_to_cart INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(client_id, platform, week_start)
);

-- ─── FOLLOW UPS ─────────────────────────────
CREATE TABLE follow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  text TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TASKS ──────────────────────────────────
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  assigned_to UUID REFERENCES users(id),
  client_id UUID REFERENCES clients(id),
  due_date DATE,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'inprogress', 'done', 'late')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── NOTIFICATIONS ──────────────────────────
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  user_id UUID REFERENCES users(id),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── PAYROLL ────────────────────────────────
CREATE TABLE payroll (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  month TEXT NOT NULL,
  base_salary NUMERIC DEFAULT 0,
  commission NUMERIC DEFAULT 0,
  bonus NUMERIC DEFAULT 0,
  deductions NUMERIC DEFAULT 0,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- ─── TARGETS ────────────────────────────────
CREATE TABLE targets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  month TEXT NOT NULL,
  target_clients INTEGER DEFAULT 0,
  target_roas NUMERIC DEFAULT 0,
  target_upsell INTEGER DEFAULT 0,
  target_renewal INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, month)
);

-- ─── SATISFACTION ────────────────────────────
CREATE TABLE satisfaction (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  month TEXT NOT NULL,
  score_overall INTEGER CHECK (score_overall BETWEEN 1 AND 5),
  score_roas INTEGER CHECK (score_roas BETWEEN 1 AND 5),
  score_speed INTEGER CHECK (score_speed BETWEEN 1 AND 5),
  score_reports INTEGER CHECK (score_reports BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── CLIENT NOTES ────────────────────────────
CREATE TABLE client_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id),
  type TEXT DEFAULT 'note' CHECK (type IN ('note', 'call', 'deal', 'meeting', 'issue')),
  title TEXT NOT NULL,
  content TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INDEXES ─────────────────────────────────
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_mb ON clients(mb_id);
CREATE INDEX idx_campaigns_client ON campaigns(client_id);
CREATE INDEX idx_campaigns_week ON campaigns(week_start);
CREATE INDEX idx_follow_ups_client ON follow_ups(client_id);
CREATE INDEX idx_follow_ups_date ON follow_ups(date);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);

-- ─── ROW LEVEL SECURITY ──────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE satisfaction ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE targets ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read their own data
-- (Full policies will be added in next migration)
CREATE POLICY "allow_all_authenticated" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_all_authenticated" ON clients FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_all_authenticated" ON campaigns FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_all_authenticated" ON follow_ups FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_all_authenticated" ON tasks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_all_authenticated" ON notifications FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_all_authenticated" ON payroll FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_all_authenticated" ON ad_accounts FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_all_authenticated" ON satisfaction FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_all_authenticated" ON client_notes FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "allow_all_authenticated" ON targets FOR ALL USING (auth.role() = 'authenticated');

-- ─── UPDATED AT TRIGGER ──────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
