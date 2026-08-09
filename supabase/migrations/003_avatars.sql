-- =============================================
-- WAMEED CRM — User Avatars (profile photos)
-- =============================================

-- ─── Column to hold the uploaded photo's public URL ───────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ─── Storage bucket (public read, so <img> tags can load photos
--     directly without auth) ─────────────────────────────────
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- All actual writes go through the avatar-upload Edge Function using the
-- service-role key (same pattern as the Motion/Creative sheet functions),
-- which bypasses Storage RLS entirely. We only need a policy that allows
-- public *read* access so the uploaded photos are visible to everyone.
CREATE POLICY "avatars_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');
