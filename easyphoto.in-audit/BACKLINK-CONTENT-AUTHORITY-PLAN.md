# Backlink & Content-Authority Plan — easyphoto.in

_Drafted 2026-06-20. Horizon: 90 days, then ongoing. Owner: founder + (optional) one VA/writer._

## 0. The honest starting position

- **Clean-slate domain.** Parked until 2023, absent from Common Crawl → ~0 referring domains. Nothing toxic to clean up; everything to build.
- **On-page/technical is already strong** (this is the differentiator vs. competitors): full schema, GEO answer-first prose, llms.txt, HSTS/HTTP3/Brotli, internal-link mesh, fixed LCP. So **off-site authority is now the rate-limiting factor**, not the site.
- **Asset type = free, no-signup, privacy-first tools + a cited spec reference.** This dictates strategy: the link types that actually work here are **tool directories, resource/reference pages, and community citations** — NOT cold guest-post farms. Free utilities earn links by being *referenced as the answer*, not pitched.
- **GSC baseline:** ~15 clicks / 279 impressions / avg pos 29.5. Goal isn't "more pages" — it's pushing the existing ranking pages from page-3 to page-1, which authority unlocks.

**North-star metric:** referring **domains** (not raw links). Target: **25–40 quality referring domains in 90 days**, branded-search volume trending up.

---

## 1. Phase 0 — Foundation citations (Week 1, ~1 day of work)

Low-effort, durable, no outreach. Do all of these once.

| Action | Why | Notes |
|---|---|---|
| Submit to free-tool directories | Easy do-follow/no-follow citations + referral traffic | AlternativeTo (as a visafoto/cutout.pro/iLovePDF alternative), SaaSHub, Product Hunt (launch post), Toolify/There's-an-AI-for-that, "free online tools" lists |
| Complete brand profiles + add to `sameAs` | Entity consolidation (Google/AI "what is easyPhoto?") | Currently only Pinterest in Organization schema. Add **YouTube, X, Instagram, LinkedIn, Facebook** once created, then list them in `organizationSchema().sameAs` (lib/schema.ts) |
| Wikidata item | Establishes easyPhoto as a known entity for AI/Google | Create a neutral, factual item (free document-photo web app). Don't spam Wikipedia. |
| Ping IndexNow + submit sitemap to Bing | Faster indexation = faster authority signals | You already have `scripts/indexnow.mjs` — wire it into deploys if not already |
| Answer-engine presence | GEO authority | llms.txt is live ✅. Add a short YouTube how-to (YouTube mentions correlate strongest with AI visibility, per the GEO audit) |

---

## 2. Phase 1 — Build 2–3 linkable "hero" assets (Weeks 2–6)

You already own the rarest thing in this niche: **accurate, officially-cited spec data for 40+ exams.** Package it as references people *cite*.

1. **"The complete India exam photo & signature size guide (40+ exams, official sources)."**
   - You already render this data; turn `/exam-requirements/` into the canonical, linkable reference (it largely is). Add a "cite this page / embed this table" affordance.
   - **Embeddable spec widget**: a tiny iframe/snippet (e.g. "SSC photo size" table) that coaching blogs can paste — every embed = a backlink. This is the single highest-leverage linkable asset for this niche.
   - Outreach target: coaching institutes, exam-prep blogs, "how to apply for X" guides.

2. **"Why exam photos & signatures get rejected" — data/visual asset.**
   - You now have rejection-reason content on every exam page. Consolidate into one definitive, illustrated guide (before/after examples, the top 10 rejection causes). Visual + data assets earn the most natural links and HARO pickups.

3. **Before/after sample images** (also closes the SXO trust gap on `/passport-photo/`).
   - Doubles as shareable/embeddable proof. Needs a designed asset.

> Each hero asset is the *thing you point outreach at*. Don't do outreach without one.

---

## 3. Phase 2 — Targeted outreach (Weeks 3–12, the ongoing engine)

Ranked by realistic ROI for a free-tool site:

1. **Resource-page & "niche edit" link building (highest ROI).**
   - Find pages that already list exam photo/signature requirements or "free passport photo" tools and lack a great reference.
   - Search operators: `"SSC photo size" inurl:resources`, `"passport photo size" + "useful links"`, `intitle:"how to apply" SSC photo`, coaching-site blogs, college placement-cell pages.
   - Pitch: "you reference photo specs — here's a free, source-cited tool/reference that keeps your readers from getting rejected." Value-first, not "please link."

2. **Community seeding (value-first, slow-drip).**
   - Quora (answer "what is the photo size for SSC/UPSC/IBPS"), Reddit (r/india, r/UPSC, r/SSC, exam subs), Telegram exam groups, college/exam forums.
   - Rule: answer the question *fully* in the post; the tool/reference is the supporting link, not the pitch. 1–2 genuine contributions/week, not blasts.

3. **HARO / journalist queries (#journorequest, Qwoted, Featured).**
   - Angles that get picked up: data privacy ("photo tools that don't upload your face"), passport-photo cost-saving, exam-application tips. High-DR links.

4. **Tool roundups & "best free X" lists.**
   - Pitch inclusion in "best free passport photo maker / PDF compressor / background remover" articles. Many are updated annually — easy adds.

5. **Guest posts (selective).**
   - Career/exam-prep blogs, not generic link farms. One strong placement > ten weak ones. Topic: "how to avoid exam-form rejection," linking naturally to the reference.

**What to AVOID (penalty risk, wasted spend):** paid link packages, PBNs, mass directory blasts, comment/forum-signature spam, exact-match anchor over-optimization, fiverr "1000 backlinks." A clean-slate domain is *more* vulnerable to a spammy-link penalty — keep the profile natural.

---

## 4. Phase 3 — Content-authority engine (ongoing, wired to the freshness automation)

Authority isn't just links — it's **topical depth + freshness cadence**, which you now have tooling for.

- **Publish/refresh on the exam cycle** using the new `npm run freshness` audit + weekly GitHub issue. As a notification drops, refresh that exam's page + publish a timely "X 2026 photo & signature size + how to avoid rejection" post. Timely content during a traffic spike earns the most natural links and social shares.
- **Deepen the clusters** (exam / passport / pdf / professional) — each pillar should link to and be linked from its spokes (mesh now in place). Fill gaps the freshness audit + GSC surface.
- **Comparison/alternative pages** (you have cutout-pro / visafoto alternatives) — extend to the highest-volume competitor queries; these capture commercial-intent + earn comparison links.
- **One YouTube short per top tool** — strongest AI-visibility correlation; embeds back to the tool page.

---

## 5. Anchor-text & link-profile safety

Natural distribution for a brand-led profile (let it skew branded — you're a tool, not a keyword):

| Anchor type | Target share |
|---|---|
| Branded ("easyPhoto", "easyphoto.in") | 40–55% |
| Naked URL / "here" / generic | 20–30% |
| Partial-match ("free passport photo tool") | 10–20% |
| Exact-match ("ssc photo resizer") | **< 8%** (over this = Penguin risk) |

---

## 6. KPIs & cadence

Track monthly (free tools: GSC + Bing Webmaster + Ahrefs/Moz free tier + the Common Crawl check you already scripted):

- **Referring domains** (primary) — target 25–40 by day 90
- **Branded search impressions** (GSC) — should rise as entity/authority grows
- **Avg position** on the ~15 tracked queries — target sub-15, then page-1
- **Indexed pages** (GSC coverage)
- **AI citations** — spot-check ChatGPT/Perplexity for "free SSC photo resizer" etc.

---

## 7. 90-day rollout at a glance

| Window | Focus | Concrete deliverables |
|---|---|---|
| Week 1 | Foundation | Directories, brand profiles + `sameAs`, Wikidata, IndexNow wired |
| Weeks 2–4 | Hero asset #1 + #2 | Embeddable spec widget; "why rejected" guide; before/after samples |
| Weeks 3–8 | Outreach engine on | Resource-page pitches, 2 community posts/wk, HARO daily, roundup pitches |
| Weeks 4–12 | Authority engine | Cycle-timed content via freshness audit; 1 YouTube short/wk; cluster fills |
| Ongoing | Measure + iterate | Monthly KPI review; double down on what earns referring domains |

---

### The one-line strategy
**You already built the best-cited, fastest, most privacy-respecting tool in the niche — now make the embeddable spec reference the thing every Indian exam blog links to, and let the freshness engine keep it timely.** Links will follow the reference, not the pitch.
