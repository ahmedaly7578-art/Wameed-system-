-- =============================================
-- WAMEED CRM — Creative Module + Google Sheet Sync
-- =============================================

-- ─── Allow 'designer' role ───────────────────
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('admin', 'media_buyer', 'social_media', 'account_manager', 'designer'));

-- ─── CREATIVE TASKS ───────────────────────────
-- Mirrors the "Creative" Google Sheet columns 1:1 so sync is trivial.
CREATE TABLE creative_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- sheet linkage — every row synced from/to the sheet carries this id
  -- in a hidden column so we can match rows both ways.
  sheet_row_id TEXT UNIQUE,

  n_o INTEGER,                          -- N.O column in the sheet
  agency TEXT,                          -- Agency
  department TEXT,                      -- Department (Social/Design/etc)
  strategy_link TEXT,                   -- Strategy Link
  client_id UUID REFERENCES clients(id),
  client_name TEXT,                     -- raw text fallback (sheet may have free text)
  website_link TEXT,                    -- Website Link
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,  -- Task Date (creation/kickoff date)
  notes TEXT,                           -- Notes / Data
  dead_line DATE,                       -- Dead Line — auto = task_date + 4 days if not set
  designer_id UUID REFERENCES users(id),
  designer_name TEXT,                   -- raw text fallback
  forum TEXT,                           -- e.g. "From-Scratch"
  no_of_sizes TEXT,                     -- e.g. "2 Platforms"
  size TEXT,                            -- e.g. "Snap+Insta"
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'in_progress', 'review', 'done', 'late')),
  upload_folder TEXT,                   -- link to uploaded creative
  upload_date DATE,
  done BOOLEAN DEFAULT FALSE,
  director_approved BOOLEAN DEFAULT FALSE,  -- "Director" checkbox
  time_note TEXT,                       -- "Same" / free text Time column

  -- late-notification bookkeeping so we don't spam the same alert
  late_notified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-compute the deadline as task_date + 4 days unless the sheet/user
-- explicitly supplied one.
CREATE OR REPLACE FUNCTION set_creative_deadline()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.dead_line IS NULL THEN
    NEW.dead_line := NEW.task_date + INTERVAL '4 days';
  END IF;
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER creative_tasks_deadline
  BEFORE INSERT OR UPDATE ON creative_tasks
  FOR EACH ROW EXECUTE FUNCTION set_creative_deadline();

CREATE INDEX idx_creative_designer ON creative_tasks(designer_id);
CREATE INDEX idx_creative_deadline ON creative_tasks(dead_line);
CREATE INDEX idx_creative_status ON creative_tasks(status);

ALTER TABLE creative_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_authenticated" ON creative_tasks FOR ALL USING (auth.role() = 'authenticated');

-- ─── SYNC LOG (debugging the two-way Google Sheet sync) ─────
CREATE TABLE creative_sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  direction TEXT CHECK (direction IN ('to_sheet', 'from_sheet')),
  creative_task_id UUID REFERENCES creative_tasks(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('ok', 'error')),
  detail TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE creative_sync_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "allow_all_authenticated" ON creative_sync_log FOR ALL USING (auth.role() = 'authenticated');

-- ─── DATABASE WEBHOOK TARGET NOTE ────────────
-- After running this migration, create a Supabase Database Webhook:
--   Table: creative_tasks | Events: INSERT, UPDATE
--   URL: <your-project>.functions.supabase.co/creative-sync-to-sheet
-- This is configured in the Supabase Dashboard (Database → Webhooks),
-- not in SQL, so it isn't included here.
