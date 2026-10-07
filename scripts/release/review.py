"""Release review: Google (Search Console) + Bing, before vs after a release.

Run (Python with google-api-python-client + requests, e.g. the seo skill's venv):
    ~/.claude/skills/blog-google/.venv/bin/python scripts/release/review.py [RELEASE_DATE]

RELEASE_DATE defaults to 2026-10-01 (release #57). "Before" is the five days
before it; "after" runs from the release to yesterday (today is always partial —
and read yesterday as partial too if its clicks look low). Credentials stay on
the machine: GSC OAuth via the seo skill's google_auth, Bing's API key from
~/.config/claude-seo/backlinks-api.json. Nothing secret lives in this repo.
"""
import sys, json, re, datetime, requests
import os
sys.path.insert(0, os.path.expanduser('~/.claude/skills/seo/scripts'))
import gsc_query as g

SITE = 'sc-domain:easyphoto.in'
REL = datetime.date.fromisoformat(sys.argv[1]) if len(sys.argv) > 1 else datetime.date(2026, 10, 1)
BEFORE = (REL - datetime.timedelta(days=5), REL - datetime.timedelta(days=1))
AFTER = (REL, datetime.date.today() - datetime.timedelta(days=1))  # today is always partial
WATCH = ['/tools/photo-with-name-date/', '/tools/sign-image/', '/exam-requirements/voter-id/', '/exam-requirements/ssc/',
         '/tools/signature-cleaner/', '/exam-requirements/upsc/', '/exam-requirements/driving-licence/', '/tools/resize-kb/', '/']
svc = g._build_gsc_service()
def q(body):
    body.setdefault('dataState', 'all')
    return svc.searchanalytics().query(siteUrl=SITE, body=body).execute().get('rows', [])
def rng(a, b): return {'startDate': a.isoformat(), 'endDate': b.isoformat()}
print('== Google daily (* = after release) ==')
days = q({**rng(BEFORE[0], AFTER[1]), 'dimensions': ['date']})
for r in days:
    d = datetime.date.fromisoformat(r['keys'][0])
    print(f"  {d} {d:%a} {'*' if d >= REL else ' '} clk={int(r['clicks']):4d} imp={int(r['impressions']):6d} pos={r['position']:5.1f}")
def avg(a, b):
    rs = [r for r in days if a <= datetime.date.fromisoformat(r['keys'][0]) <= b]; n = max(len(rs), 1); imp = sum(r['impressions'] for r in rs)
    return sum(r['clicks'] for r in rs) / n, imp / n, sum(r['position'] * r['impressions'] for r in rs) / max(imp, 1), len(rs)
for lbl, (a, b) in [('before', BEFORE), ('after ', AFTER)]:
    c, i, p, n = avg(a, b); print(f"  {lbl}: {c:6.1f} clk/day {i:7.0f} imp/day pos {p:4.1f} ({n} days)")
print('== Watched pages, per-day avg (before -> after) ==')
for p in WATCH:
    out = []
    for a, b in (BEFORE, AFTER):
        rs = q({**rng(a, b), 'dimensions': ['date'], 'dimensionFilterGroups': [{'filters': [{'dimension': 'page', 'expression': 'https://easyphoto.in' + p}]}]})
        n = (b - a).days + 1; imp = sum(r['impressions'] for r in rs)
        out.append((sum(r['clicks'] for r in rs) / n, imp / n, sum(r['position'] * r['impressions'] for r in rs) / max(imp, 1)))
    (c0, i0, p0), (c1, i1, p1) = out
    flag = '  <-- CHECK' if (p1 - p0 > 1.5 or (c0 >= 3 and c1 < c0 * 0.7)) else ''
    print(f"  {p:38s} clk {c0:5.1f}->{c1:5.1f}  imp {i0:6.0f}->{i1:6.0f}  pos {p0:5.1f}->{p1:5.1f}{flag}")
qs = q({**rng(*AFTER), 'dimensions': ['query'], 'rowLimit': 25000})
t = sum(r['clicks'] for r in qs); br = sum(r['clicks'] for r in qs if 'easyphoto' in r['keys'][0].replace(' ', '').lower())
print(f"== Non-brand since release: {int(t - br)} of {int(t)} query-attributed clicks ==")
key = json.load(open(os.path.expanduser('~/.config/claude-seo/backlinks-api.json')))['bing_api_key']
def bing(m):
    return requests.get(f"https://ssl.bing.com/webmaster/api.svc/json/{m}", params={'apikey': key, 'siteUrl': 'https://easyphoto.in/'}, timeout=60).json().get('d') or []
bdt = lambda s: datetime.date(1970, 1, 1) + datetime.timedelta(milliseconds=int(re.search(r'-?\d+', s).group()))
bt = sorted(bing('GetRankAndTrafficStats'), key=lambda r: bdt(r['Date']))
print('== Bing ==')
for lbl, (a, b) in [('before', BEFORE), ('after ', AFTER)]:
    rs = [r for r in bt if a <= bdt(r['Date']) <= b]; n = max(len(rs), 1)
    print(f"  {lbl}: {sum(r['Clicks'] for r in rs)/n:6.1f} clk/day {sum(r['Impressions'] for r in rs)/n:7.0f} imp/day ({len(rs)} days, last {bdt(rs[-1]['Date']) if rs else '-'})")
c = sorted(bing('GetCrawlStats'), key=lambda r: bdt(r['Date']))[-1]
print(f"  crawl {bdt(c['Date'])}: index={c['InIndex']} 4xx={c['Code4xx']} 5xx={c['Code5xx']} errors={c['CrawlErrors']}")
