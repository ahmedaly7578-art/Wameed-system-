-- =============================================
-- WAMEED CRM — Department Heads (used by Media
-- Renewals now, and reusable later for HR approvals)
-- =============================================

-- An admin flagged here is the "head" of that department — e.g. 'media'.
-- NULL means this admin is not a department head (still a normal admin).
-- Values used so far: 'media'. Future: 'seo','social','account','sales'.
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_head_of TEXT;
