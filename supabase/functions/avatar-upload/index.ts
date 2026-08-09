// supabase/functions/avatar-upload/index.ts
//
// Lets any logged-in user upload/replace their own profile photo. Uploads
// the image to the "avatars" Storage bucket and saves its public URL on
// their row in `users` (column avatar_url) — visible to every user in the
// system immediately, same as the Motion/Creative modules' pattern: an
// Edge Function with the service-role key doing the actual write, so it
// works regardless of the app's own (non-Supabase-Auth) login flow.
//
// POST body (JSON): { userId: string, imageBase64: string, fileExt: string }
//   - imageBase64 can be a raw base64 string OR a full data URL
//     (e.g. "data:image/png;base64,...") — both are handled.
//   - fileExt: "png" | "jpg" | "jpeg" | "webp" (no dot)
//
// ─── Required secrets (set with `supabase secrets set`) ───────────────────
//   AVATAR_UPLOAD_SECRET  -> any random string; the frontend sends it back
//                            as ?secret=... or X-App-Secret.
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are already available to every
//  Edge Function automatically — no need to set them yourself.)

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const API_SECRET = Deno.env.get("AVATAR_UPLOAD_SECRET")!;

const MAX_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXT = new Set(["png", "jpg", "jpeg", "webp"]);

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function decodeBase64(input: string): Uint8Array {
  const raw = input.includes(",") ? input.split(",")[1] : input;
  const binary = atob(raw);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const reqUrl = new URL(req.url);
  const incomingSecret = reqUrl.searchParams.get("secret") ?? req.headers.get("x-app-secret") ?? "";
  if (incomingSecret !== API_SECRET) {
    return json({ error: "unauthorized" }, 401);
  }

  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  try {
    const body = await req.json();
    const { userId, imageBase64, fileExt } = body;

    if (!userId) return json({ error: "missing userId" }, 400);
    if (!imageBase64) return json({ error: "missing imageBase64" }, 400);
    const ext = String(fileExt || "png").toLowerCase().replace(/[^a-z]/g, "");
    if (!ALLOWED_EXT.has(ext)) return json({ error: "unsupported file type" }, 400);

    const bytes = decodeBase64(imageBase64);
    if (bytes.length > MAX_BYTES) return json({ error: "file too large (max 5MB)" }, 400);

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
    const path = `${userId}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, bytes, {
        contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
        upsert: true,
      });
    if (upErr) throw upErr;

    const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
    // cache-bust so the new photo shows immediately everywhere (same path,
    // browsers/CDN would otherwise keep serving the old cached image)
    const url = `${pub.publicUrl}?v=${Date.now()}`;

    const { error: updErr } = await supabase
      .from("users")
      .update({ avatar_url: url })
      .eq("id", userId);
    if (updErr) throw updErr;

    return json({ ok: true, url });
  } catch (err) {
    console.error(err);
    return json({ error: String(err) }, 500);
  }
});
