# easyphoto.in vs Google's guidelines — audit, 6 Oct 2026

Read-only audit of the live site against Google's current written guidance:
Search Essentials and all spam policies, "Creating helpful, reliable,
people-first content", the generative-AI content guidance, structured-data
policies, sitemaps/dates guidance, and page experience. Inputs: a fresh crawl
of all 123 sitemap pages (rendered main text, JSON-LD, raw HTML as Googlebot and
as Chrome), GSC / URL Inspection / CrUX data, and production code
(`origin/master` 157639f). The owner's independent spot checks confirmed the
main findings the same day.

## Outcome (decisions, 6 Oct)

- Guard rules and ratchet tests from this audit merged to dev (#81): CLAUDE.md
  §1/§2/§3/§6.9 additions, `npm run quality`, `test/fixtures/quality/*`.
- 15 Oct release split: only JavaScript fixes plus the Driving Licence
  wrong-output hotfix change what Google sees; calendar (#74) and blog images
  (#73) wait for the window (29 Oct).
- Exam-page honesty and de-templating: after the window, ≤ 3 pages per release
  (docs/NEXT-RELEASE.md items 7 and 9).

## Verdict

**No Google spam policy is broken.** No cloaking (Googlebot and browsers get the
same visible text on 123/123 pages), no sneaky redirects, hidden text, doorway
pages left in the index, fake reviews or ratings, thin affiliation or
back-button hijacking; structured data matches what is visible; who made the
site and how AI is used are disclosed honestly.

**What remains is a quality and trust risk** — the kind that most plausibly
contributed to the July 2026 demotion:

1. **Numbers presented as the requirement when the authority never published
   them.** 8 of the 23 indexed exam pages are `needs-review` in our own data
   (ssc, rrb, army-agniveer, voter-id, clat, passport-seva, tgpsc, up-police;
   451 clicks in 90 days). Their meta, first requirement card and FAQ still
   lead with a KB figure — e.g. Voter ID's "File size under 2048 KB" although
   our own preset says ECI publishes no upload cap. Google's self-assessment
   asks about "easily verified factual errors".
2. **Templated exam and country pages.** After normalising names and numbers,
   about 60% of each exam page's text is shared with siblings (max pairwise
   0.45); the same FAQ questions with the exam name swapped appear on 16–20 of
   the 23 exam pages; some generated answers read badly ("…a background that
   does not match White"). Country pages share about 46%. Not "scaled content
   abuse" at 42 sourced pages with working tools, but the low-effort pattern
   quality systems score down.
3. **Internal jargon** in copy: "stored" 241 times on exam pages, plus
   "selected stored target", "compatibility-only", "in this review".

## Guideline → status → evidence → fix (highest risk first)

| # | Guideline | Status | Evidence | Fix |
|---|---|---|---|---|
| 1 | Helpful content: accuracy, answer the question asked | At risk (highest) | The 8 `needs-review` exam pages above | Lead with what is published; show our value only as "easyPhoto default — not an official limit" |
| 2 | Scaled content abuse / mass-produced | At risk | Shingle similarity: exam ~60% shared, country ~46%; blog max 0.14, tools 0.19 | Exam-specific FAQs only; remove repeated facts; similarity ratchet |
| 3 | Generative-AI guidance: review AI text, avoid sloppy output | At risk | "stored" ×241 on exam pages; generated sentence fragments | Jargon ban + owner read-aloud pass |
| 4 | Misleading functionality | OK, one fix | Claims bounded ("can check / cannot check"); 0 "guaranteed/accepted" claims. Homepage demo shows a fixed "6/6 Checks Passed" without an "Example" label | Label the demo "Example" (homepage text — after the window) |
| 5 | Freshness / dates | OK but inconsistent | Some blog "Last reviewed" dates differ from dateModified and sitemap lastmod | Date-consistency ratchet |
| 6 | Stale "upcoming" content | At risk, low | /exam-calendar/ listed 5 of 8 past events as upcoming | #74, after the window |
| 7 | Structured data policies | OK | All 657 FAQ Q&As on 106 pages are visible verbatim; no Review/AggregateRating; free SoftwareApplication offers | Add no new FAQ markup |
| 8 | Doorway pages | OK | 125 redirects, all relevant; 70 linked off-sitemap URLs are all `noindex` | — |
| 9 | Site-wide quality signals | At risk (context) | 42 of 123 indexed pages are the templated exam/country pages | Items 1–3 |
| 10–13 | Cloaking, sneaky redirects, hidden text, keyword stuffing | OK | Same text for Googlebot and browsers; static export, no UA logic | — |
| 14 | Thin affiliation | OK | Affiliate map empty; when used: sponsored + disclosed | — |
| 15 | Reviews / self-comparisons | OK | Comparison posts disclose "easyPhoto is our product"; sourced, dated | Re-check competitor facts quarterly |
| 16 | Who / How / Why (E-E-A-T) | OK, strong | Author, contact, editorial, corrections and source-methodology pages | — |
| 17–18 | Scam/impersonation; back-button hijacking | OK | "Independent, not affiliated" notices; no history manipulation in code; strict CSP/HSTS | Guard test |
| 19 | Page experience / ads | OK, one loose end | CrUX passes (LCP ~2.0 s, INP 139 ms, CLS 0); AdSense + consent scripts still on 54 pages until the next build | Flag switched off 6 Oct — verify after the 15 Oct build |
| 20 | Technical requirements | OK | 123/123 return 200 with self-canonicals; 119/123 indexed; /tools/compliance-checker/ last crawled 14 Aug while noindex | Owner requested indexing 6 Oct |
| 21 | Expired domain, hacked content, link spam, UGC spam, site reputation abuse, policy circumvention | OK / N/A | Own domain, no third-party content | — |

## Top fixes and timing (CLAUDE.md §2)

| What | SEO-visible? | When |
|---|---|---|
| Guard rules + ratchet tests | No | Done 6 Oct (#81) |
| Stop presenting unpublished numbers as the requirement on the 8 exam pages | Yes | After the window; clat, up-police, tgpsc first; ssc and voter-id last, each a 14-day experiment |
| Replace name-swapped exam FAQs with exam-specific Q&As | Yes | Same pages, same releases |
| Remove jargon and repeated facts | Yes | Same pages, same releases |
| "Example" label on the homepage demo; blog date alignment | Yes | One change at a time after the window |
| Delete the unused `ComplianceEngine` component (fixed "10/10 Checks Passed") | No | Any cleanup PR |

## Not automated

"Never state the same fact twice on one page" and "text changed ⇒ date moves"
are rules, not tests. Similarity figures cover main content, not navigation or
footer. Blog facts were not re-checked against their sources in this audit.
