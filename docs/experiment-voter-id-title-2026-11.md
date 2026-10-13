# Voter ID page: search-title experiment (CLAUDE.md §2)

Status: **approved by the owner, 10 Oct 2026**: title A, with title and meta
as one change. Runs in the first release after 29 Oct.

Page: `/exam-requirements/voter-id/`. Nothing else changes.

## 1. Why

**Google Search Console, 26 Sep – 7 Oct 2026** (the 12 days since Google
restored the site): 119 clicks, 4,840 impressions, CTR 2.46%, average
position 7.2.

**What people search.** Google names the search for 2,750 of those
impressions; most are people who want to resize a photo:

| Kind of search | Impressions | Clicks | CTR | Avg position |
|---|---|---|---|---|
| Resize ("voter photo resize", "voter card photo resize", "voter id photo resizer", "voter document resize" …) | 2,109 (77%) | 24 | **1.1%** | 8.0 |
| Size ("voter id photo size in mb", "voter card photo size" …) | 528 | 10 | 1.9% | 7.3 |
| Other | 113 | 0 | 0% | 7.9 |

**The biggest single searches:**
- "voter photo resize": 477 impressions, 1 click, position 8.3.
- "voter id photo resizer": 186 impressions, 2 clicks.
- "voter card photo resize": 182 impressions, 1 click.
- By contrast, "voter id photo size in mb" ranks 4.9 and gets 5.8% CTR.

**Today's search result:**
- Title: "Voter ID Photo Size & Resizer 2026 — easyPhoto"
- Meta description: "Voter ID: photo under 2048 KB. Stored size for the form — confirm the
  current figures on the official source."

**Two problems with it:**
1. **The title doesn't match the searches.** It leads with "Photo Size",
   while most searchers type "resize". The title was itself an experiment
   added 10 Jul ("& Resizer"). Its 31 Jul review never happened, because
   Google's 25 Jul demotion wiped out the data.
2. **The meta description breaks our own rule.** ECI's Form 6 guidance
   publishes no upload file-size limit, yet the snippet says "under
   2048 KB". It also uses the internal word "Stored" (CLAUDE.md §3). It's on
   the list of known exceptions (`unpublished-claims-allowlist.json` →
   "voter-id: meta"), which may only shrink.

## 2. The change

**The title** (owner picks one; under 60 characters, no number ECI doesn't
publish):

| | Title | Note |
|---|---|---|
| **A (recommended)** | Voter ID Photo Resize (Form 6, 4.5 × 3.5 cm) — easyPhoto | Leads with the top searches' words; 4.5 × 3.5 cm is ECI's own figure |
| B | Voter Card Photo Resize & Size 2026 — easyPhoto | Uses "voter card", which many searchers type; keeps "size" |
| C | Resize Photo for Voter ID — Form 6 Size 4.5 × 3.5 cm — easyPhoto | Most explicit; 62 characters, may be cut on phones |

**The meta description** (draft; final wording only after step 3.1):

> Resize your photo for Voter ID Form 6: 4.5 × 3.5 cm, colour, white
> background, unsigned. ECI publishes no upload file-size limit, so check the
> upload screen on the Voters' Service Portal.

**Why title and meta go together.** Our rule says "one variable". But the meta
has to change anyway, because the rule forbids the 2048 KB claim, and
changing it separately would mean two disruptions and 4+ more weeks. So we
treat **the search snippet** (title + meta) as the one variable. If the
result is worse, we revert only the title; the meta fix stays, since it's
required.

**Not changed:**
- the H1 ("Voter ID (ECI Form 6) Photo Size"), the page body, the URL, the
  structured data;
- any other page.

We don't promise document resizing in the title: the page resizes photos
only (§3, no claims the tool can't back).

## 3. Steps

1. **Before writing the final meta:** re-check ECI's current official sources
   (the Form 6 guidelines PDF and the Voters' Service Portal upload help) for
   an upload size or format.
   - **If ECI now publishes one,** the meta states it with the source, the
     preset moves from "needs-review" to verified with the date, and the
     2048 KB default goes.
   - **If not,** the meta says none is published, as drafted.
2. Record the **baseline**: the 14 days before release day, for the page and
   for each kind of search in §1 (clicks, impressions, CTR, position), in
   `docs/weekly-log.md`.
3. Ship in **the first release after 29 Oct**. On the day, check
   status.search.google.com for a rolling update or one ended in the last 14
   days; if there is one, wait.
4. Read the result **14 days** after release and confirm at **28 days**.
   Nothing else on this page changes in that time; the Voter ID page
   rewrite, if we do one, waits until this experiment is judged.

## 4. How we judge it

The page gets about 10 clicks a day, so the numbers are noisy; the 28-day
reading decides.

**Success** (keep), at a similar average position (within ±0.5):
- the CTR on "resize" searches rises from 1.1% to **2% or more**, **and**
- page clicks per day rise **20% or more**, with impressions down no more
  than 15%.

**Failure** (revert the title, keep the meta):
- page clicks per day fall **15% or more**, **or**
- clicks on the "size" searches (now about 5% CTR at position 5) fall **30%
  or more**.

**Otherwise:** neutral. Keep the new title (it states ECI's own figure), and
note the result.

## 5. SEO-visible impact and risk

- **SEO-visible:** title and meta description of one page (plus their
  copies in the social-sharing tags). The SEO diff must show exactly that.
- **Risk is low:** same URL, same content, one page. Google sometimes rewrites
  titles; if it ignores ours, we'll see no change and record that.
- **Expected effect:** modest. At position 8, the title can lift CTR but won't
  move the ranking; ranking gains come from the page itself.

## 6. Tests and rollback

- **Tests:** a unit test pins the new title and meta. `npm run quality`
  must pass, with "voter-id: meta" deleted from the unpublished-claims
  exceptions (the ratchet shrinks). Then the SEO diff and the full gate (§6).
- **Rollback:** revert the one commit. For a failed result, restore only the
  old title line; keep the meta fix.

## Owner decisions

1. Plan approved, including treating title + meta as one change (owner,
   10 Oct 2026).
2. Title: **A, "Voter ID Photo Resize (Form 6, 4.5 × 3.5 cm) — easyPhoto"**
   (owner, 10 Oct 2026).
