// supabase/functions/snap-oauth-exchange/index.ts
//
// Same job as meta-oauth-exchange, but for Snapchat's Marketing API.
//   1. Exchanges the ?code= for an access_token + refresh_token
//   2. Stores both in `snap_connections` (locked-down table, service_role only)
//   3. Lists every Organization the connected person can see, then every
//      Ad Account under each Organization
//   4. Upserts them into `ad_accounts` with platform='Snapchat',
//      client_id left NULL if new ("unlinked" until assigned in the UI)
//   5. Returns the full Snapchat account list
//
// ─── Required secrets ───────────────────────────────────────────────────
//   SNAP_CLIENT_ID      -> not sensitive, but kept here for convenience
//   SNAP_CLIENT_SECRET  -> NEVER expose this to the frontend
//   SNAP_REDIRECT_URI   -> must match EXACTLY what's registered in Snap Business Manager
//                          e.g. https://wameed-system.vercel.app/api/auth/callback/snapchat
//   SNAP_OAUTH_SECRET   -> any random string, same pattern as meta-oauth-exchange's
//                          META_OAUTH_SECRET — the frontend sends it back as ?secret=

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const CLIENT_ID = Deno.env.get("SNAP_CLIENT_ID")!;
const CLIENT_SECRET = Deno.env.get("SNAP_CLIENT_SECRET")!;
const REDIRECT_URI = Deno.env.get("SNAP_REDIRECT_URI")!;
const API_SECRET = Deno.env.get("SNAP_OAUTH_SECRET")!;

const ACCOUNTS_BASE = "https://accounts.snapchat.com/login/oauth2";
const ADS_API_BASE = "https://adsapi.snapchat.com/v1";

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

async function tokenRequest(params: Record<string, string>) {
  const body = new URLSearchParams(params);
  const res = await fetch(`${ACCOUNTS_BASE}/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await res.json();
  if (!res.ok || data.error) {
    throw new Error(`Snapchat token error: ${data.error_description || data.error || res.status}`);
  }
  return data;
}

async function adsGet(path: string, accessToken: string) {
  const res = await fetch(`${ADS_API_BASE}${path}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok || data.request_status === "ERROR") {
    throw new Error(`Snapchat Ads API error at ${path}: ${JSON.stringify(data).slice(0, 300)}`);
  }
  return data;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const reqUrl = new URL(req.url);
  const incomingSecret = reqUrl.searchParams.get("secret") ?? req.headers.get("x-app-secret") ?? "";
  if (incomingSecret !== API_SECRET) {
    return json({ error: "unauthorized" }, 401);
  }

  const code = reqUrl.searchParams.get("code");
  const connectedBy = reqUrl.searchParams.get("userId");
  if (!code) return json({ error: "missing code" }, 400);

  try {
    // 1) code -> access_token + refresh_token
    const tok = await tokenRequest({
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    });

    const accessToken = tok.access_token as string;
    const refreshToken = tok.refresh_token as string;
    const expiresInSec = tok.expires_in as number | undefined;
    const tokenExpiresAt = expiresInSec
      ? new Date(Date.now() + expiresInSec * 1000).toISOString()
      : null;

    const db = supa();

    // 2) store the connection
    const { error: connErr } = await db.from("snap_connections").insert({
      connected_by: connectedBy || null,
      access_token: accessToken,
      refresh_token: refreshToken,
      token_expires_at: tokenExpiresAt,
    });
    if (connErr) throw new Error(`saving connection failed: ${connErr.message}`);

    // 3) discover organizations, then ad accounts under each
    const orgsRes = await adsGet("/me/organizations", accessToken);
    const orgs: any[] = (orgsRes.organizations ?? [])
      .map((o: any) => o.organization)
      .filter(Boolean);

    const allAccounts: any[] = [];
    for (const org of orgs) {
      const accRes = await adsGet(`/organizations/${org.id}/adaccounts`, accessToken);
      const accs = (accRes.adaccounts ?? [])
        .map((a: any) => a.adaccount)
        .filter(Boolean);
      allAccounts.push(...accs);
    }

    // 4) upsert into ad_accounts
    if (allAccounts.length > 0) {
      const rows = allAccounts.map((a) => ({
        platform: "Snapchat",
        account_id: a.id,
        account_name: a.name,
        business_name: null,
        is_active: a.status === "ACTIVE",
      }));
      const { error: upsertErr } = await db
        .from("ad_accounts")
        .upsert(rows, { onConflict: "platform,account_id" });
      if (upsertErr) throw new Error(`saving ad accounts failed: ${upsertErr.message}`);
    }

    // 5) return the full up-to-date Snapchat list
    const { data: fullList, error: listErr } = await db
      .from("ad_accounts")
      .select("id,account_id,account_name,business_name,client_id,status,is_active,last_synced_at")
      .eq("platform", "Snapchat")
      .order("account_name");
    if (listErr) throw new Error(listErr.message);

    return json({ ok: true, accounts: fullList });
  } catch (e) {
    return json({ error: String(e instanceof Error ? e.message : e) }, 500);
  }
});
