// supabase/functions/campaigns-sync/index.ts
//
// Pulls last week's numbers (Saturday → Friday) for every linked, connected
// ad account and upserts them into `campaigns` — same table the manual
// "إضافة بيانات حملة" form writes to, so nothing else in the app needs to
// change to display synced data.
//
// Two ways this gets called:
//   1. On a daily Cron Trigger (no ?accountId= param) → syncs EVERY
//      connected account across both platforms.
//   2. From the "🔄 مزامنة دلوقتي" button in the البيزنسات tab, admin-only
//      (?accountId=<ad_accounts.id>) → syncs just that one account.
//
// ─── Required secrets ───────────────────────────────────────────────────
//   CAMPAIGNS_SYNC_SECRET -> random string, same call-secret pattern as the
//                            other functions. The frontend sends it as ?secret=
//   META_APP_ID, META_APP_SECRET               -> already set (from meta-oauth-exchange)
//   SNAP_CLIENT_ID, SNAP_CLIENT_SECRET          -> already set (from snap-oauth-exchange)
// (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are automatic)

import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const API_SECRET = Deno.env.get("CAMPAIGNS_SYNC_SECRET")!;

const META_APP_ID = Deno.env.get("META_APP_ID")!;
const META_APP_SECRET = Deno.env.get("META_APP_SECRET")!;
const SNAP_CLIENT_ID = Deno.env.get("SNAP_CLIENT_ID")!;
const SNAP_CLIENT_SECRET = Deno.env.get("SNAP_CLIENT_SECRET")!;

const GRAPH = "https://graph.facebook.com/v19.0";
const SNAP_ACCOUNTS = "https://accounts.snapchat.com/login/oauth2";
const SNAP_ADS = "https://adsapi.snapchat.com/v1";

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

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Last COMPLETED Saturday→Saturday week, matching how the manual entry
// form is used (weekly, Saturday-based). If today is Saturday, that
// counts as the boundary — we sync the week that just finished.
function lastCompletedWeek() {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun ... 6=Sat
  const daysSinceSat = (day - 6 + 7) % 7;
  const thisWeekStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceSat));
  const weekStart = new Date(thisWeekStart); weekStart.setUTCDate(thisWeekStart.getUTCDate() - 7);
  const weekEndExclusive = thisWeekStart; // next Saturday, exclusive
  const weekEndInclusive = new Date(weekEndExclusive); weekEndInclusive.setUTCDate(weekEndExclusive.getUTCDate() - 1);
  return { start: weekStart, endInclusive: weekEndInclusive };
}

// ─── META ──────────────────────────────────────────────────────────────
async function getMetaToken(db: ReturnType<typeof supa>) {
  const { data, error } = await db
    .from("meta_connections")
    .select("access_token")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error || !data) throw new Error("مفيش اتصال بميتا محفوظ");
  return data.access_token as string;
}

function pickAction(actions: any[] | undefined, types: string[]) {
  if (!actions) return 0;
  const hit = actions.find((a) => types.includes(a.action_type));
  return hit ? Number(hit.value) : 0;
}

async function fetchMetaWeek(accountId: string, accessToken: string, start: Date, endInclusive: Date) {
  const url = new URL(`${GRAPH}/${accountId}/insights`);
  url.searchParams.set("fields", "spend,impressions,clicks,ctr,cpc,cpm,actions,action_values");
  url.searchParams.set("time_range", JSON.stringify({ since: ymd(start), until: ymd(endInclusive) }));
  url.searchParams.set("access_token", accessToken);
  const res = await fetch(url.toString());
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  const row = data.data?.[0];
  if (!row) return null; // no spend that week — nothing to write
  const purchases = pickAction(row.actions, ["omni_purchase", "purchase", "offsite_conversion.fb_pixel_purchase"]);
  const purchaseValue = pickAction(row.action_values, ["omni_purchase", "purchase", "offsite_conversion.fb_pixel_purchase"]);
  const checkout = pickAction(row.actions, ["omni_initiated_checkout", "initiate_checkout"]);
  const addToCart = pickAction(row.actions, ["omni_add_to_cart", "add_to_cart"]);
  const spend = Number(row.spend || 0);
  return {
    spend,
    clicks: Number(row.clicks || 0),
    impressions: Number(row.impressions || 0),
    purchases, purchase_value: purchaseValue,
    roas: spend > 0 ? +(purchaseValue / spend).toFixed(2) : 0,
    ctr: Number(row.ctr || 0),
    cpm: Number(row.cpm || 0),
    cpc: Number(row.cpc || 0),
    checkout, add_to_cart: addToCart,
  };
}

// ─── SNAPCHAT ──────────────────────────────────────────────────────────
async function getFreshSnapToken(db: ReturnType<typeof supa>) {
  const { data, error } = await db
    .from("snap_connections")
    .select("id,refresh_token")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error || !data) throw new Error("مفيش اتصال بسناب شات محفوظ");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: SNAP_CLIENT_ID,
    client_secret: SNAP_CLIENT_SECRET,
    refresh_token: data.refresh_token,
  });
  const res = await fetch(`${SNAP_ACCOUNTS}/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const tok = await res.json();
  if (!res.ok || tok.error) throw new Error(tok.error_description || "فشل تجديد توكن سناب شات");

  // Snapchat sometimes rotates the refresh token — keep the stored one current.
  await db.from("snap_connections").update({
    access_token: tok.access_token,
    refresh_token: tok.refresh_token || data.refresh_token,
    token_expires_at: tok.expires_in ? new Date(Date.now() + tok.expires_in * 1000).toISOString() : null,
  }).eq("id", data.id);

  return tok.access_token as string;
}

async function fetchSnapWeek(accountId: string, accessToken: string, start: Date, endInclusive: Date) {
  const endExclusive = new Date(endInclusive); endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
  const url = new URL(`${SNAP_ADS}/adaccounts/${accountId}/stats`);
  url.searchParams.set("granularity", "TOTAL");
  url.searchParams.set("start_time", `${ymd(start)}T00:00:00.000-00:00`);
  url.searchParams.set("end_time", `${ymd(endExclusive)}T00:00:00.000-00:00`);
  url.searchParams.set("fields", "spend,impressions,swipes,conversion_purchases,conversion_purchases_value");
  const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${accessToken}` } });
  const data = await res.json();
  if (!res.ok || data.request_status === "ERROR") throw new Error(JSON.stringify(data).slice(0, 300));
  const stats = data.total_stats?.[0]?.total_stat?.stats;
  if (!stats) return null;
  // Snapchat returns money fields in micro-currency units (millionths).
  const spend = Number(stats.spend || 0) / 1_000_000;
  const purchaseValue = Number(stats.conversion_purchases_value || 0) / 1_000_000;
  const purchases = Number(stats.conversion_purchases || 0);
  const clicks = Number(stats.swipes || 0);
  const impressions = Number(stats.impressions || 0);
  return {
    spend, clicks, impressions,
    purchases, purchase_value: purchaseValue,
    roas: spend > 0 ? +(purchaseValue / spend).toFixed(2) : 0,
    ctr: impressions > 0 ? +((clicks / impressions) * 100).toFixed(2) : 0,
    cpm: impressions > 0 ? +((spend / impressions) * 1000).toFixed(2) : 0,
    cpc: clicks > 0 ? +(spend / clicks).toFixed(2) : 0,
    checkout: 0, add_to_cart: 0, // not requested — Snapchat needs a pixel-specific breakdown for these
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });

  const reqUrl = new URL(req.url);
  const incomingSecret = reqUrl.searchParams.get("secret") ?? req.headers.get("x-app-secret") ?? "";
  if (incomingSecret !== API_SECRET) return json({ error: "unauthorized" }, 401);

  const onlyAccountId = reqUrl.searchParams.get("accountId"); // ad_accounts.id (uuid), optional
  const fromParam = reqUrl.searchParams.get("from"); // YYYY-MM-DD, optional — start of backfill range
  const toParam = reqUrl.searchParams.get("to");     // YYYY-MM-DD, optional — end of backfill range (inclusive)

  const db = supa();

  // Build the list of weeks to sync. Normal daily-cron call (no from/to) = just
  // last week. Backfill call (from/to given) = every Saturday→Saturday week
  // between them, oldest first.
  const weeks: { start: Date; endInclusive: Date }[] = [];
  if (fromParam) {
    const rangeStart = new Date(fromParam + "T00:00:00Z");
    const rangeEnd = toParam ? new Date(toParam + "T00:00:00Z") : lastCompletedWeek().endInclusive;
    // snap rangeStart back to the nearest Saturday on/before it
    const d = rangeStart.getUTCDay();
    const backToSat = (d - 6 + 7) % 7;
    let cursor = new Date(Date.UTC(rangeStart.getUTCFullYear(), rangeStart.getUTCMonth(), rangeStart.getUTCDate() - backToSat));
    let guard = 0;
    while (cursor <= rangeEnd && guard < 520) { // 520 weeks ≈ 10 years, hard safety cap
      const endInclusive = new Date(cursor); endInclusive.setUTCDate(cursor.getUTCDate() + 6);
      weeks.push({ start: new Date(cursor), endInclusive });
      cursor = new Date(cursor); cursor.setUTCDate(cursor.getUTCDate() + 7);
      guard++;
    }
  } else {
    weeks.push(lastCompletedWeek());
  }

  let q = db.from("ad_accounts").select("id,account_id,platform,client_id,status")
    .not("client_id", "is", null);
  if (onlyAccountId) q = q.eq("id", onlyAccountId);
  else if (!fromParam) q = q.in("status", ["connected", "error"]); // daily run also retries errored ones

  const { data: accounts, error: accErr } = await q;
  if (accErr) return json({ error: accErr.message }, 500);
  if (!accounts?.length) return json({ ok: true, synced: 0, message: "مفيش حسابات مربوطة" });

  let metaToken: string | null = null;
  let snapToken: string | null = null;
  const results: any[] = [];

  for (const acc of accounts) {
    for (const { start, endInclusive } of weeks) {
      const weekStart = ymd(start);
      try {
        let numbers = null;
        if (acc.platform === "Meta") {
          metaToken = metaToken || await getMetaToken(db);
          numbers = await fetchMetaWeek(acc.account_id, metaToken, start, endInclusive);
        } else if (acc.platform === "Snapchat") {
          snapToken = snapToken || await getFreshSnapToken(db);
          numbers = await fetchSnapWeek(acc.account_id, snapToken, start, endInclusive);
        } else {
          continue; // unsupported platform for now
        }

        if (numbers) {
          const { error: upsertErr } = await db.from("campaigns").upsert({
            client_id: acc.client_id,
            ad_account_id: acc.id,
            platform: acc.platform,
            week_start: weekStart,
            ...numbers,
          }, { onConflict: "client_id,platform,week_start" });
          if (upsertErr) throw new Error(upsertErr.message);
        }
        results.push({ id: acc.id, platform: acc.platform, week: weekStart, ok: true, hadData: !!numbers });
      } catch (e) {
        results.push({ id: acc.id, platform: acc.platform, week: weekStart, ok: false, error: String(e instanceof Error ? e.message : e) });
      }
    }
    const accResults = results.filter(r => r.id === acc.id);
    const accOk = accResults.every(r => r.ok);
    await db.from("ad_accounts").update({
      status: accOk ? "connected" : "error",
      last_synced_at: new Date().toISOString(),
    }).eq("id", acc.id);
  }

  return json({
    ok: true,
    weeksSynced: weeks.length,
    synced: results.filter(r => r.ok).length,
    failed: results.filter(r => !r.ok).length,
    results,
  });
});
