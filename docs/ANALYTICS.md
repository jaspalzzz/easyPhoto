# Privacy-Safe Analytics

EasyPhoto collects **anonymous, aggregate tool-usage events only** — never document
content, file names, image bytes, or PII. This is how we get the funnel/quality
data the product needs *without* third-party trackers, cookies, or a consent banner.

## How it works

```
browser  →  track(event)              lib/analytics.ts (strict event union, DNT-aware)
         →  beaconSink(event)         lib/analyticsBeacon.ts (sendBeacon, fire-and-forget)
         →  POST /api/event           functions/api/event.ts (Cloudflare Pages Function)
         →  Analytics Engine          dataset: easyphoto_events
```

- **Same-origin** POST to our own domain → no CSP change, no third party.
- **No cookies, no IP stored.** Only coarse country (from Cloudflare's edge).
- **Respects Do-Not-Track** and an explicit opt-out (`setAnalyticsOptOut`).
- If the Analytics Engine binding is missing, the function **accepts-and-drops**
  (returns 204), so the site keeps working before setup is done.

### Why this is not "Google Analytics"
| | GA / GTM | This (first-party) |
|---|---|---|
| Data goes to | Google | Our own domain |
| Cookies | Yes | None |
| Third-party JS / CSP change | Yes | No |
| Consent banner | Required | Not required |
| Personal data | IP, fingerprint, ID graph | None — counts + device class |

## One-time setup (Cloudflare dashboard)

1. **Pages project → Settings → Functions → Analytics Engine bindings → Add binding**
   - Variable name: `ANALYTICS`
   - Dataset: `easyphoto_events`
2. Redeploy (or it binds on the next deploy). That's it — events start flowing.

*(No `wrangler.toml` is committed so the existing dashboard build config is left
untouched. If you prefer config-as-code, add an `[[analytics_engine_datasets]]`
binding there instead.)*

## What's collected per event

| Field | Example | Notes |
|---|---|---|
| `name` | `tool_success` | one of: tool_view, tool_start, tool_success, tool_failure, download |
| `tool` | `background-removal` | tool slug (index) |
| `device` | `android` | desktop / android / ios |
| `engine` | `wasm-fp32` | which on-device engine ran |
| `reason` | `oom` | failure reason code (no PII) |
| `format` | `png` | download format |
| `ms` | `1240` | processing time |
| `country` | `IN` | coarse, from edge; not stored with anything else |

## Dashboard / queries

Analytics Engine is queryable via the **SQL API**
(`https://api.cloudflare.com/client/v4/accounts/<ACCOUNT_ID>/analytics_engine/sql`,
`Authorization: Bearer <API_TOKEN>` with *Account Analytics Read*). Column mapping:
`blob1=name, blob2=tool, blob3=device, blob4=engine, blob5=reason, blob6=format,
blob7=country, double1=ms, double2=count`.

**Most-used tools (last 7 days)**
```sql
SELECT blob2 AS tool, SUM(_sample_interval) AS events
FROM easyphoto_events
WHERE blob1 = 'tool_start' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY tool ORDER BY events DESC;
```

**Success vs failure rate per tool**
```sql
SELECT blob2 AS tool,
       SUM(IF(blob1='tool_success', _sample_interval, 0)) AS ok,
       SUM(IF(blob1='tool_failure', _sample_interval, 0)) AS fail
FROM easyphoto_events
WHERE blob1 IN ('tool_success','tool_failure') AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY tool ORDER BY fail DESC;
```

**Top failure reasons (where to fix first)**
```sql
SELECT blob2 AS tool, blob5 AS reason, blob3 AS device, SUM(_sample_interval) AS n
FROM easyphoto_events
WHERE blob1 = 'tool_failure' AND timestamp > NOW() - INTERVAL '14' DAY
GROUP BY tool, reason, device ORDER BY n DESC;
```

**Processing time (avg ms) by tool & device**
```sql
SELECT blob2 AS tool, blob3 AS device, AVG(double1) AS avg_ms
FROM easyphoto_events
WHERE blob1 = 'tool_success' AND double1 > 0 AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY tool, device ORDER BY avg_ms DESC;
```

**Funnel for one tool (view → start → success → download)**
```sql
SELECT blob1 AS step, SUM(_sample_interval) AS n
FROM easyphoto_events
WHERE blob2 = 'background-removal' AND timestamp > NOW() - INTERVAL '7' DAY
GROUP BY step;
```

For an always-on dashboard, point **Grafana** (Cloudflare Analytics Engine
datasource) or a small internal page (server-side, holding the API token as a
secret — never client-side) at these queries.
