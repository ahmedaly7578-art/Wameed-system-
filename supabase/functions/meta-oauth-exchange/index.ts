// supabase/functions/meta-oauth-exchange/index.ts
//
// Finishes the "ربط حساب ميتا" flow. The frontend sends the ?code= that
// Facebook redirected back with; this function:
//   1. Exchanges it for a short-lived user access token
//   2. Exchanges that for a long-lived token (~60 days)
//   3. Stores the token in `meta_connections` (locked-down table, never
//      readable by the frontend — see migration 005)
//   4. Lists every ad account the connected person can see
//   5. Upserts them into `ad_accounts` (client_id left NULL if new —
//      "unlinked" until an admin assigns them to a client in the UI)
//   6. Returns the full list (with any existing client links) so the
//      "البيزنسات" tab can render immediately.
//
// The App Secret NEVER reaches the browser — it only lives here as a
// Supabase secret.
//
// ─── Required secrets (set with `supabase secrets set`) ───────────────────
//   META_APP_ID        -> the app's App ID (not sensitive, but kept here too)
//   META_APP_SECRET     -> the app's App Secret. NEVER expose this to the frontend.
//   META_REDIRECT_URI    -> must match EXACTLY what's registered in the Meta app
//                          e.g. https://wameed-system.vercel.app/api/auth/callback/facebook
//   META_OAUTH_SECRET   -> any random string; the frontend sends it back as
//                          ?secret=... or X-App-Secret, same pattern as the
//                          other Edge Functions in this project.
// (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are already available to every
//  Edge Function automatically.)

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const APP_ID = Deno.env.get("META_APP_ID")!;
const APP_SECRET = Deno.env.get("META_APP_SECRET")!;
const REDIRECT_URI = Deno.env.get("META_REDIRECT_URI")!;
const API_SECRET = Deno.env.get("META_OAUTH_SECRET")!;

const GRAPH = "https://graph.facebook.com/v19.0";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

function supa() {
  return createClient(SUPABASE_URL, SERVICE_ROLE_KEY);
}

async function graphGet(path: string, params: Record<string, string>) {
  const url = new URL(`${GRAPH}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.error) throw new Error(`Meta API error: ${data.error.message}`);
  return data;
}

async function fetchAllAdAccounts(accessToken: string) {
  const accounts: any[] = [];
  let path = "/me/adaccounts";
  let params: Record<string, string> = {
    fields: "id,name,account_status,business",
    limit: "200",
    access_token: accessToken,
  };
  for (let page = 0; page < 10; page++) { // hard safety cap
    const data = await graphGet(path, params);
    accounts.push(...(data.data ?? []));
    const next = data.paging?.next;
    if (!next) break;
    const nextUrl = new URL(next);
    path = nextUrl.pathname.replace(/^\/v[\d.]+/, "");
    params = Object.fromEntries(nextUrl.searchParams.entries());
  }
  return accounts;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const reqUrl = new URL(req.url);
  const incomingSecret = reqUrl.searchParams.get("secret") ?? req.headers.get("x-app-secret") ?? "";
  if (incomingSecret !== API_SECRET) {
    return json({ error: "unauthorized" }, 401);
  }

  const code = reqUrl.searchParams.get("code");
  const connectedBy = reqUrl.searchParams.get("userId"); // Wameed team-member id, optional

  if (!code) return json({ error: "missing code" }, 400);

  try {
    // 1) code -> short-lived token
    const shortLived = await graphGet("/oauth/access_token", {
      client_id: APP_ID,
      client_secret: APP_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
    });

    // 2) short-lived -> long-lived (~60 days)
    const longLived = await graphGet("/oauth/access_token", {
      grant_type: "fb_exchange_token",
      client_id: APP_ID,
      client_secret: APP_SECRET,
      fb_exchange_token: shortLived.access_token,
    });

    const accessToken = longLived.access_token as string;
    const expiresInSec = longLived.expires_in as number | undefined;
    const tokenExpiresAt = expiresInSec
      ? new Date(Date.now() + expiresInSec * 1000).toISOString()
      : null;

    // 3) who is this
    const me = await graphGet("/me", { fields: "id,name", access_token: accessToken });

    const db = supa();

    // 4) store the connection (kept in an isolated, locked-down table)
    const { error: connErr } = await db.from("meta_connections").insert({
      fb_user_id: me.id,
      fb_user_name: me.name,
      connected_by: connectedBy || null,
      access_token: accessToken,
      token_expires_at: tokenExpiresAt,
    });
    if (connErr) throw new Error(`saving connection failed: ${connErr.message}`);

    // 5) discover every ad account this person can see
    const adAccounts = await fetchAllAdAccounts(accessToken);

    if (adAccounts.length > 0) {
      const rows = adAccounts.map((a) => ({
        platform: "Meta",
        account_id: a.id, // e.g. "act_123456789"
        account_name: a.name,
        business_name: a.business?.name ?? null,
        is_active: a.account_status === 1,
      }));
      const { error: upsertErr } = await db
        .from("ad_accounts")
        .upsert(rows, { onConflict: "platform,account_id" });
      if (upsertErr) throw new Error(`saving ad accounts failed: ${upsertErr.message}`);
    }

    // 6) return the full up-to-date list (including any existing client links)
    const { data: fullList, error: listErr } = await db
      .from("ad_accounts")
      .select("id,account_id,account_name,business_name,client_id,status,is_active,last_synced_at")
      .eq("platform", "Meta")
      .order("account_name");
    if (listErr) throw new Error(listErr.message);

    return json({ ok: true, fbUserName: me.name, accounts: fullList });
  } catch (e) {
    return json({ error: String(e instanceof Error ? e.message : e) }, 500);
  }
});
