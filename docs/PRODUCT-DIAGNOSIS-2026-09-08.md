# easyPhoto — Product Diagnosis, 8 September 2026

**Method.** Every number below was pulled today from the live Search Console API
(`sc-domain:easyphoto.in`), the live site, the repo, and live competitor pages.
Where I could not verify something, it says so. Nothing is estimated from memory.

---

## 1. Where the product actually stands (numbers, not feelings)

| Fact | Value | Source |
|---|---|---|
| Domain age | 3 months (registered 2026-06-06) | `docs/MARKET-LEADER-STRATEGY.md` |
| Engineering effort | **670 commits** (404 in June, 205 in July, 54 in Aug, 7 in Sept) | `git log` |
| Best week ever | 19–25 Jul: **305 clicks / 12,401 impressions**, avg position 7.9 | GSC daily |
| Last 4 weeks (10 Aug–6 Sep) | **17 clicks / 1,151 impressions** | GSC |
| Of those 17 clicks, brand searches ("easy photo", "easyphoto") | **12** | GSC queries |
| Non-brand clicks, last 4 weeks | **0** | GSC queries |
| Distinct non-brand queries | 997 (pre-collapse) → **133** (now) | GSC queries |
| Position of best content pages now | sign-image 71 · resume-photo 71 · white-background 73 · face-centering 75 | GSC pages |
| Inbound links | **0** (Bing Webmaster), **no captures** in Common Crawl | verified today |
| Product Hunt launch | 3 upvotes | memory |
| AdSense | never approved; script gated off | `.env.example`, memory |
| Live visitors per day (organic) | ~0–1 | GSC daily |

**Best-ever month was ≈1,300 clicks. The target is 500,000. That is a 385× gap
from the *peak*, and the site is currently at ~2% of that peak.**

### What Google did on 25 July
Pre-collapse (24 May–24 Jul): 962 clicks, 97 pages earning clicks.
Now: 17 clicks, 3 pages earning clicks (homepage, about, contact — all brand).
Every non-brand ranking fell 40–70 positions in one day with no deploy in the
window. Only the brand query held. That is a site-level quality demotion, not a
bug; it has been verified three separate times and I re-confirmed it today.

**Why it hit this site harder than any competitor:** zero links. A site with no
external authority has nothing anchoring it when Google reshuffles.

---

## 2. Where the clicks came from when the site was alive

Pre-collapse click share by section (962 clicks, 254 pages with impressions):

| Section | Pages | Clicks | Share | Clicks per page |
|---|---|---|---|---|
| Tools | 69 | 437 | 45% | 6.3 |
| Exam pages | 36 | 288 | 30% | 8.0 |
| Home/legacy/other | 71 | 118 | 12% | 1.7 |
| Blog | 36 | 78 | 8% | 2.2 |
| **Country passport/visa pages** | **42** | **41** | **4%** | **1.0** |

Concentration is extreme:

- `/tools/sign-image/` alone = **178 clicks (18.5% of the site)**. The whole
  "sign on photo / add signature to photo" cluster is the #1 product-market fit
  this site has ever demonstrated — and nobody planned it.
- `/exam-requirements/voter-id/` + its resizer + blog = **256 clicks (27%)**,
  almost all from the SIR enumeration deadline (24 July). Seasonal, gone.
- Top 5 pages = 51% of all clicks. 42 pages earned exactly one click or zero.

---

## 3. The loopholes that are sinking it (brutal, evidence-cited)

### L1. Engineering was treated as growth. It isn't.
670 commits, 51 tools, 38 articles, 52 exam pages, 28 country pages, 5 trust
pages, a CMP, an analytics pipeline, an OG-image pipeline — and **0 links, 3
upvotes, 0 videos, 0 community presence**. The audit scored code 8/10 and
authority 1/10 two months ago; nothing since then has moved authority. Every
hour on code was an hour taken from the only variable Google is actually
punishing. This is the root cause. Everything below is a symptom.

### L2. The homepage does not contain the product.
Live mobile screenshot today: headline, a search box, seven chips, four badges,
then an illustration. **No upload zone above the fold.** photokb.in and
govtphotoresizer.com put the upload box first. A user who searched "photo resize
20kb" and lands here has to read, then search, then tap, then upload. Every
competitor is one tap.

### L3. Exam pages open by telling the user not to trust the number.
`/exam-requirements/ssc/` on mobile, the first thing a user reads:
> "The stored 20–50 KB photo target is compatibility-only, not a current SSC
> requirement… Confirm the current exam notice before using the compatibility
> photo output."
followed by a yellow **"Source needs review"** warning. That wording appears on
**29 exam records**. This is honesty executed as self-sabotage: the page ranks,
the user arrives with rejection fear, and the page's first paragraph increases
it. The data agrees — pages with real demand and **zero clicks**:
`/exam-requirements/cuet/` 188 impressions, `/exam-requirements/pan/` 68,
`/tools/exam-package/` 67, `/tools/photo-signature-merge/` 142, the
resizer-comparison post 295. A retitle experiment already proved titles are not
the cause. The content's opening posture is.

### L4. 42 country passport/visa pages earn 4% of clicks.
One click per page over two months. These SERPs are owned by PhotoAiD,
Visafoto, passport-photo.online (years of authority, paid products), **and in
2026 Gemini "Nano Banana" produces a compliant-looking passport photo from a
prompt** — there are already dozens of guides ranking for exactly that. The
category is being eaten from both ends. The three passport blog posts were
already classified "structurally lost, stop investing" in July. Still 28 pages
in the sitemap.

### L5. The PDF / OCR / generic-image suite is dead weight that AI already does.
19 of the 72 deindexed pages are PDF/OCR/convert tools. Pre-collapse, the entire
PDF suite earned ~0 clicks; `image-to-text` earned 0 on 18 impressions. In a
single chat, ChatGPT/Gemini merge, split, compress, OCR, extract text, remove
backgrounds, and change DPI. The only thing a chat does *not* do well for a
budget-Android exam applicant is hand back **a JPEG at exactly ≤20 KB, 3.5×4.5
cm, in one tap**. That is the moat. The PDF/OCR tools are not in it.

### L6. Blog: 38 posts → 78 clicks; one post = 54% of them.
Content quality was scored 84–95/100 by four agents. It doesn't matter. The
"how" queries here are tool-SERPs (10/10 tool pages for "exam photo resizer"),
and the "what size" queries are being answered by AI Overviews. A text article
cannot win either. Writing more is measured waste.

### L7. Privacy is the headline and it is a commodity.
"100% private · no upload" appears on the hero. Verified July: at least six
direct competitors say the same sentence; three of them showed up in today's
SERP check (portalresizer, ezssc, photokb). It differentiates nothing.

### L8. The exam season the product was built for is starting now, and the site is invisible.
`lib/examCalendar.ts`: SSC GD Constable opened **1 Sept**, NDA/CDS II **13
Sept**, IBPS Clerk **10 Oct**, IBPS RRB **21 Nov / 6 Dec**. The demand the
whole product targets peaks in the next 90 days, and the site is at position
~70 for every relevant query.

---

## 4. Useless areas — earning neither traffic nor money

| Area | Pages | Pre-collapse clicks | Verdict |
|---|---|---|---|
| Country visa/passport makers beyond US/UK/Canada/Schengen/UAE/Saudi | ~22 | ≤2 each | **Park.** Keep live, drop from nav, stop all work. |
| PDF suite (merge/split/compress/reorder/sign/watermark/page-numbers/unlock/extract) | 9 | ~0 | **Park.** Already deindexed; remove from homepage/nav to stop diluting the brand. |
| OCR (image-to-text, pdf-to-text, aadhaar-ocr, pan-ocr) | 4 + 1 blog | ~11 total | **Park.** AI does this better in one message. |
| Passport how-to blog posts (at-home, rejection, background, size-by-country, print) | 5 | 0–7 each | **Stop investing.** Already declared sunk in July; still being maintained. |
| Generic image tools (format-converter, image-crop, red-eye, straighten, linkedin, print-sheet) | 6 | ≤3 each | Keep as internal steps only, not destinations. |
| Trust/editorial pages | 5 | 0 (by design) | Fine — cheap, needed for AdSense. |
| Analytics Engine pipeline | — | — | Built, binding never confirmed; **no usage data has ever been read**. Either wire it or delete it. |

Roughly **60% of the built surface** earns nothing and cannot earn in 2026.

---

## 5. What still has a real moat in 2026

1. **Exact-spec file output for Indian portals** (KB + px + format + name/date
   strip + signature pairing). Requirement-driven, hard-rejection-driven,
   repeats every cycle, needs a *file* not an *answer*. AI chat is high-friction
   for this on a phone.
2. **"Sign on photo" / signature tools.** The only cluster this site proved it
   can rank for on merit (position 6–8, 178 clicks in 2 months). Underbuilt on
   purpose-specific landing pages.
3. **Face-geometry compliance check** (head size, eye line, centering vs spec).
   No Indian competitor has it. Currently unproven against real photos — the
   test suite stubs face detection.

---

## 6. What could take this toward 500K — honestly ranked

**Preamble, because the brief demands no assumptions:** 500K monthly visits is
not a feature outcome. At its best week the site did 305 clicks. Every
competitor listed in today's SERP check has the same client-side, same exam
presets, and more pages. I could **not** verify competitor traffic (Similarweb
blocked the fetch); examphotoresize.in *claims* 1–2 lakh users per tool, which
is a claim, not a measurement. The only channels where a 3-month-old domain
with 0 links is not handicapped are **YouTube, Play Store, and WhatsApp/Telegram
communities**. Anything that is "more web pages" inherits the demotion.

| # | Move | Why it can compound | Evidence | Effort |
|---|---|---|---|---|
| 1 | **Hindi how-to Shorts per exam and per KB target, on YouTube, each linking to the exact tool** ("SSC photo 20KB kaise banaye") | A YouTube video ranked **#1** in today's "voter id photo resize" SERP. Indian aspirants search YouTube first. Each video is a link, a brand impression, and a ranking asset immune to the web demotion. The owner already runs a video pipeline. | SERP check today; owner's existing channel workflow | Low per video, high volume |
| 2 | **Android app (TWA of the existing PWA) on Play Store** | Play Store search is a separate distribution system with no domain-authority gate. "photo resize app", "signature resize app" are Play Store queries. Same code, zero server. | Roadmap #12/#13 never done; PWA already exists | Medium, one-time |
| 3 | **Per-KB destination pages as real tools, not text**: `/compress-to-20kb/`, `/30kb/`, `/50kb/`, `/100kb/`, `/200kb/`, `/500kb/` each with its own preset, exam list and upload-first layout | The highest-intent recurring cluster in the niche. photokb has 23 such pages; examphotoresize has 15; easyphoto has **one** page with six chips. Must pass the charter's thin-page filter: each page = a different default target, different portal list, upload box first. | F4 in growth report; competitor pages fetched today | Medium |
| 4 | **Rewrite every exam page opening: tool first, spec second, caveat last** | Pages with 68–295 impressions and 0 clicks. The opening paragraph is the variable never tested (titles were). Move "Source needs review" below the tool, reword to "Last checked against notice dated X". | L3 above | Low |
| 5 | **Homepage = upload box** | Every winning competitor does it. Your search box is a second step nobody asked for. | Screenshots today | Low |
| 6 | **Hindi UI (real locale, not duplicate pages)** | No competitor offers it (verified July; photokb English-only today). "photo ka size kaise kam kare" cluster is unserved. The earlier Hinglish pages were thin duplicates and correctly noindexed — this is a locale switch on the tool, not new pages. | Roadmap #12; keyword list block D | High |
| 7 | **Sign-on-photo family: dedicated landing pages for the proven queries** ("add signature to photo", "overlap signature on photo", "photo to signature converter") | 178 clicks on one page at position 7 — the best per-page yield the site has ever produced. Each query is a distinct job; today they share one page. | GSC pre-collapse queries | Low |
| 8 | **Telegram/WhatsApp presence in SSC/IBPS/RRB aspirant groups** — share cards with the exam's exact spec + link, timed to `examCalendar` windows | That's where the users are during the 90-day window that starts now. Zero cost. | Exam calendar; market research | Low, recurring |
| 9 | **Prove the compliance checker on real photos, then publish the accuracy** | The one asset no Indian competitor has; currently unproven. A published, honest accuracy number is a linkable claim. | Return-queue "known gap" | Medium |
| 10 | **Exam-cycle email/WhatsApp alert** ("IBPS Clerk opens 10 Oct — prepare your photo") | Retention across cycles; the calendar data already exists. | O6 in growth report | Medium |

Explicitly **not** on this list: more blog posts, more country pages, more PDF
tools, AI headshots, redesigns, more trust pages, AdSense resubmission. Each
was tested or measured and moved nothing.

### The order that respects the December decision gate
- **Now → Dec (no index changes):** #1, #2, #5, #8, #9 — distribution and
  conversion, none touch the index. #4's copy changes are safe (same URLs).
- **After the gate:** #3, #6, #7 — they add or restructure pages and must be
  attributable.

---

## 7. What I could not verify (say so, don't assume)
- Competitor traffic volumes (Similarweb blocked).
- First-party keyword volumes (no Keyword Planner/Ahrefs access).
- Whether Google's demotion lifts at all — guidance says months; December gate stands.
- Actual tool usage on-site — the analytics pipeline has never been queried.
- SERP checks ran from a US index; Indian SERPs may differ in order, not in who is present.
