# URL-level recovery plan — every page, with a reason

**Built:** 2026-08-30 · **Scope:** all 121 indexed URLs + all 73 already-deindexed = **194 total**

**Nothing here ships before the December gate** in [`ACTION-PLAN.md`](ACTION-PLAN.md). This is a
decision record, not a work queue.

---

## Methodology, and the limitation that shaped it

Each URL is scored on 90-day clicks/impressions, **pre-collapse** clicks/impressions
(24 May–24 Jul), impressions earned *since* the collapse, unshared-word share, and TF-IDF
similarity to its nearest sibling.

**The limitation:** 56 of 121 indexed pages have zero clicks in the last 90 days. That is
overwhelmingly a *symptom of the demotion*, not proof a page was ever weak. A first pass that cut
on recent clicks flagged 11 pages — including the SIR post, whose impressions **all arrived after**
the collapse. That pass was discarded.

A page is therefore only a removal candidate if it was weak **before 25 July** *and* has earned
nothing since. That took removals from 11 down to **5**.

| Action | Meaning |
|---|---|
| **KEEP** | No change. Earns, is a trust/hub page, or supports a kept tool. |
| **REWRITE** | Stays indexed; title/intent needs work. Not a composition problem. |
| **CROSS-LINK** | Similar to a sibling that *earns*. Link them — never merge into an earner. |
| **MERGE** | Genuine near-duplicate where neither side earns. 301 the weaker. |
| **NOINDEX** | Weak before the collapse, silent since. Page stays live and usable. |
| **DELETE** | **Not used. Nothing is deleted — every tool stays reachable.** |

## Summary

| | Indexed (121) | Already-deindexed (73) |
|---|---|---|
| KEEP | 92 | — |
| REWRITE | 18 | — |
| CROSS-LINK | 3 | — |
| MERGE | 3 | — |
| NOINDEX | 5 | — |
| STAY-NOINDEX | — | 59 |
| REVIEW | — | 11 |
| REVIVE-AS-ASSET | — | 3 |

**Net if fully executed:** sitemap 121 → ~116. Small by design — the evidence does not support
a large cut, and the previous two cuts (34 pages on 2 Aug, 27 on 14 Aug) are still unmeasured.

---

## Action required — indexed pages (29)

| Pri | Action | URL | Reason | 90d c/i | Pre c/i |
|---|---|---|---|---|---|
| P1 | **REWRITE** | `/blog/best-free-exam-photo-resizer-india/` | 295 impressions, 0 clicks — CTR/intent problem | 0/295 | 0/294 |
| P1 | **REWRITE** | `/exam-requirements/cuet/` | 188 impressions, 0 clicks — CTR/intent problem | 0/188 | 0/168 |
| P1 | **REWRITE** | `/tools/photo-signature-merge/` | 142 impressions, 0 clicks — CTR/intent problem | 0/142 | 0/140 |
| P1 | **REWRITE** | `/blog/passport-photo-size-by-country/` | 113 impressions, 0 clicks — CTR/intent problem | 0/113 | 0/113 |
| P1 | **REWRITE** | `/blog/upsc-cse-ias-photo-signature-guide-2026/` | 95 impressions, 0 clicks — CTR/intent problem | 0/95 | 0/94 |
| P1 | **REWRITE** | `/exam-requirements/pan/` | 68 impressions, 0 clicks — CTR/intent problem | 0/68 | 0/68 |
| P1 | **REWRITE** | `/tools/exam-package/` | 67 impressions, 0 clicks — CTR/intent problem | 0/67 | 0/63 |
| P1 | **REWRITE** | `/saudi-visa-photo-maker/` | 56 impressions, 0 clicks — CTR/intent problem | 0/56 | 0/54 |
| P1 | **REWRITE** | `/tools/background-removal/` | 55 impressions, 0 clicks — CTR/intent problem | 0/55 | 0/55 |
| P1 | **REWRITE** | `/canada-passport-photo/` | 52 impressions, 0 clicks — CTR/intent problem | 0/52 | 0/29 |
| P2 | **REWRITE** | `/oman-visa-photo-maker/` | 48 impressions, 0 clicks — real demand, weak conversion | 0/48 | 0/48 |
| P2 | **REWRITE** | `/germany-visa-photo-maker/` | 48 impressions, 0 clicks — real demand, weak conversion | 0/48 | 0/48 |
| P2 | **REWRITE** | `/china-visa-photo-maker/` | 44 impressions, 0 clicks — real demand, weak conversion | 0/44 | 0/44 |
| P2 | **REWRITE** | `/blog/how-to-take-a-passport-photo-at-home/` | 44 impressions, 0 clicks — real demand, weak conversion | 0/44 | 0/44 |
| P2 | **REWRITE** | `/italy-visa-photo-maker/` | 36 impressions, 0 clicks — real demand, weak conversion | 0/36 | 0/36 |
| P2 | **REWRITE** | `/exam-requirements/cat/` | 32 impressions, 0 clicks — real demand, weak conversion | 0/32 | 0/29 |
| P2 | **REWRITE** | `/exam-requirements/up-police/` | 22 impressions, 0 clicks — real demand, weak conversion | 0/22 | 0/22 |
| P2 | **REWRITE** | `/blog/sir-enumeration-form-photo-2026/` | All 12 impressions arrived AFTER the collapse — gaining, not dead | 0/12 | 0/0 |
| P2 | **MERGE** | `/france-visa-photo-maker/` | 0.47 similar to /schengen-visa-photo-maker/; neither earns | 0/39 | 0/39 |
| P2 | **MERGE** | `/exam-requirements/clat/` | 0.42 similar to /exam-requirements/cuet/; neither earns | 0/33 | 0/32 |
| P2 | **MERGE** | `/schengen-visa-photo-maker/` | 0.47 similar to /france-visa-photo-maker/; neither earns | 0/13 | 0/13 |
| P3 | **CROSS-LINK** | `/exam-requirements/navy-agniveer/` | 0.43 similar to /exam-requirements/airforce-agniveer/ which earns — link, never merge into an earner | 0/29 | 0/28 |
| P3 | **CROSS-LINK** | `/exam-requirements/afcat/` | 0.51 similar to /exam-requirements/airforce-agniveer/ which earns — link, never merge into an earner | 0/28 | 0/28 |
| P3 | **CROSS-LINK** | `/us-passport-photo-maker/` | 0.49 similar to /us-passport-photo/ which earns — link, never merge into an earner | 0/11 | 0/11 |
| P3 | **NOINDEX** | `/blog/image-to-text-online-free-ocr/` | 18 impressions pre-collapse AND 0 since — weak before the demotion, not just after | 0/18 | 0/18 |
| P3 | **NOINDEX** | `/schengen-visa-photo/` | 17 impressions pre-collapse AND 0 since — weak before the demotion, not just after | 0/17 | 0/17 |
| P3 | **NOINDEX** | `/baby-passport-photo/` | 17 impressions pre-collapse AND 0 since — weak before the demotion, not just after | 0/17 | 0/17 |
| P3 | **NOINDEX** | `/convert/` | 4 impressions pre-collapse AND 0 since — weak before the demotion, not just after | 0/4 | 0/4 |
| P3 | **NOINDEX** | `/blog/how-to-merge-pdf-free/` | 1 impressions pre-collapse AND 0 since — weak before the demotion, not just after | 0/1 | 0/1 |

## Already-deindexed — action required (14)

| Pri | Action | URL | Reason | Pre c/i |
|---|---|---|---|---|
| P2 | **REVIVE-AS-ASSET** | `/tools/compliance-checker/` | Checker tool: value is being referenced, not ranking. Consolidate the three into one flagship, then re-index. | 2/30 |
| P2 | **REVIVE-AS-ASSET** | `/tools/photo-rejection-check/` | Checker tool: value is being referenced, not ranking. Consolidate the three into one flagship, then re-index. | 0/12 |
| P2 | **REVIVE-AS-ASSET** | `/tools/photo-validator/` | Checker tool: value is being referenced, not ranking. Consolidate the three into one flagship, then re-index. | 0/0 |
| P3 | **REVIEW** | `/kuwait-visa-photo-maker/` | Had real pre-collapse demand (2 clicks, 111 impr) — re-check before leaving out | 2/111 |
| P3 | **REVIEW** | `/portugal-visa-photo-maker/` | Had real pre-collapse demand (0 clicks, 110 impr) — re-check before leaving out | 0/110 |
| P3 | **REVIEW** | `/tools/linkedin-photo/` | Had real pre-collapse demand (1 clicks, 63 impr) — re-check before leaving out | 1/63 |
| P3 | **REVIEW** | `/tools/mask-aadhaar/` | Had real pre-collapse demand (3 clicks, 56 impr) — re-check before leaving out | 3/56 |
| P3 | **REVIEW** | `/tools/resize-dimensions/` | Had real pre-collapse demand (1 clicks, 42 impr) — re-check before leaving out | 1/42 |
| P3 | **REVIEW** | `/tools/photo/` | Had real pre-collapse demand (1 clicks, 34 impr) — re-check before leaving out | 1/34 |
| P3 | **REVIEW** | `/tools/signature/` | Had real pre-collapse demand (1 clicks, 30 impr) — re-check before leaving out | 1/30 |
| P3 | **REVIEW** | `/tools/auto-crop/` | Had real pre-collapse demand (3 clicks, 17 impr) — re-check before leaving out | 3/17 |
| P3 | **REVIEW** | `/tools/jpg-to-pdf/` | Had real pre-collapse demand (1 clicks, 10 impr) — re-check before leaving out | 1/10 |
| P3 | **REVIEW** | `/tools/document/` | Had real pre-collapse demand (1 clicks, 7 impr) — re-check before leaving out | 1/7 |
| P3 | **REVIEW** | `/tools/print-sheet/` | Had real pre-collapse demand (1 clicks, 2 impr) — re-check before leaving out | 1/2 |

## KEEP — no action (92)

On the record so the decision is auditable.

<details><summary>Expand all 92</summary>

| URL | Family | Why | 90d c/i | Pre c/i |
|---|---|---|---|---|
| `/tools/sign-image/` | tool | Earns: 178 clicks/90d, 178 pre-collapse | 178/5118 | 178/4958 |
| `/exam-requirements/voter-id/` | exam | Earns: 166 clicks/90d, 166 pre-collapse | 166/4763 | 166/4754 |
| `/` | hub | Hub / entry point | 65/1293 | 53/868 |
| `/blog/voter-id-photo-requirements-2026/` | blog | Earns: 42 clicks/90d, 42 pre-collapse | 42/1120 | 42/1117 |
| `/tools/resume-photo/` | tool | Earns: 36 clicks/90d, 36 pre-collapse | 36/1233 | 36/1149 |
| `/exam-requirements/rrb/` | exam | Earns: 28 clicks/90d, 27 pre-collapse | 28/1623 | 27/1589 |
| `/exam-requirements/army-agniveer/` | exam | Earns: 27 clicks/90d, 27 pre-collapse | 27/2063 | 27/2014 |
| `/tools/face-centering/` | tool | Earns: 26 clicks/90d, 26 pre-collapse | 26/455 | 26/420 |
| `/tools/signature-cleaner/` | tool | Earns: 23 clicks/90d, 23 pre-collapse | 23/320 | 23/319 |
| `/exam-requirements/airforce-agniveer/` | exam | Earns: 22 clicks/90d, 22 pre-collapse | 22/1791 | 22/1786 |
| `/exam-requirements/ibps/` | exam | Earns: 14 clicks/90d, 14 pre-collapse | 14/766 | 14/762 |
| `/tools/photo-with-name-date/` | tool | Earns: 14 clicks/90d, 14 pre-collapse | 14/509 | 14/490 |
| `/passport-photo/` | hub | Hub / entry point | 12/81 | 12/79 |
| `/tools/signature-crop/` | tool | Earns: 11 clicks/90d, 11 pre-collapse | 11/185 | 11/183 |
| `/exam-requirements/upsc/` | exam | Earns: 10 clicks/90d, 10 pre-collapse | 10/1147 | 10/1132 |
| `/tools/dpi-converter/` | tool | Earns: 9 clicks/90d, 9 pre-collapse | 9/254 | 9/254 |
| `/exam-requirements/driving-licence/` | exam | Earns: 8 clicks/90d, 8 pre-collapse | 8/1003 | 8/987 |
| `/tools/white-background/` | tool | Earns: 8 clicks/90d, 8 pre-collapse | 8/417 | 8/376 |
| `/pakistan-passport-photo-maker/` | maker | Earns: 7 clicks/90d, 7 pre-collapse | 7/180 | 7/178 |
| `/blog/best-free-passport-photo-maker-india-2026/` | blog | Earns: 7 clicks/90d, 7 pre-collapse | 7/128 | 7/127 |
| `/tools/signature-background-removal/` | tool | Earns: 7 clicks/90d, 7 pre-collapse | 7/120 | 7/119 |
| `/tools/aadhaar-ocr/` | tool | Earns: 6 clicks/90d, 6 pre-collapse | 6/227 | 6/191 |
| `/blog/pan-card-photo-size/` | blog | Earns: 5 clicks/90d, 5 pre-collapse | 5/318 | 5/318 |
| `/tools/pan-card-ocr/` | tool | Earns: 5 clicks/90d, 5 pre-collapse | 5/319 | 5/309 |
| `/exam-requirements/niacl/` | exam | Earns: 5 clicks/90d, 5 pre-collapse | 5/27 | 5/26 |
| `/tools/signature-resize/` | tool | Earns: 4 clicks/90d, 4 pre-collapse | 4/136 | 4/136 |
| `/malaysia-visa-photo-maker/` | maker | Earns: 4 clicks/90d, 4 pre-collapse | 4/63 | 4/62 |
| `/blog/how-to-sign-exam-application-forms-india/` | blog | Earns: 3 clicks/90d, 3 pre-collapse | 3/289 | 3/287 |
| `/tools/resize-kb/` | tool | Earns: 3 clicks/90d, 3 pre-collapse | 3/257 | 3/256 |
| `/blog/driving-licence-photo-size-sarathi/` | blog | Earns: 3 clicks/90d, 3 pre-collapse | 3/217 | 3/216 |
| `/visa-photo/` | hub | Hub / entry point | 3/92 | 3/89 |
| `/blog/why-exam-photo-signature-rejected/` | blog | Earns: 2 clicks/90d, 2 pre-collapse | 2/415 | 2/409 |
| `/nepal-passport-photo-maker/` | maker | Earns: 2 clicks/90d, 2 pre-collapse | 2/407 | 2/406 |
| `/blog/indian-passport-photo-requirements/` | blog | Earns: 2 clicks/90d, 2 pre-collapse | 2/408 | 2/393 |
| `/exam-requirements/sbi/` | exam | Earns: 2 clicks/90d, 2 pre-collapse | 2/338 | 2/333 |
| `/blog/resume-photo-size-and-rules/` | blog | Earns: 2 clicks/90d, 2 pre-collapse | 2/234 | 2/234 |
| `/blog/what-is-dpi-and-how-to-change-it/` | blog | Earns: 2 clicks/90d, 1 pre-collapse | 2/209 | 1/204 |
| `/blog/indian-government-id-photo-requirements/` | blog | Earns: 2 clicks/90d, 2 pre-collapse | 2/182 | 2/178 |
| `/new-zealand-visa-photo-maker/` | maker | Earns: 2 clicks/90d, 2 pre-collapse | 2/138 | 2/138 |
| `/blog/visafoto-alternative-india-free/` | blog | Earns: 2 clicks/90d, 2 pre-collapse | 2/110 | 2/108 |
| `/exam-requirements/csir-net/` | exam | Earns: 1 clicks/90d, 1 pre-collapse | 1/395 | 1/393 |
| `/blog/exam-photo-signature-size-guide/` | blog | Earns: 1 clicks/90d, 1 pre-collapse | 1/341 | 1/340 |
| `/blog/why-passport-photos-get-rejected/` | blog | Earns: 1 clicks/90d, 1 pre-collapse | 1/238 | 1/237 |
| `/blog/passport-photo-background-color/` | blog | Earns: 1 clicks/90d, 1 pre-collapse | 1/231 | 1/231 |
| `/blog/ssc-cgl-chsl-photo-signature-guide-2026/` | blog | Earns: 1 clicks/90d, 1 pre-collapse | 1/200 | 1/198 |
| `/exam-requirements/ssc/` | exam | Earns: 1 clicks/90d, 1 pre-collapse | 1/176 | 1/172 |
| `/uae-visa-photo-maker/` | maker | Earns: 1 clicks/90d, 1 pre-collapse | 1/176 | 1/171 |
| `/exam-requirements/oci/` | exam | Earns: 1 clicks/90d, 1 pre-collapse | 1/195 | 1/165 |
| `/australia-passport-photo-maker/` | maker | Earns: 1 clicks/90d, 1 pre-collapse | 1/139 | 1/137 |
| `/blog/how-to-print-passport-photos-at-home/` | blog | Earns: 1 clicks/90d, 1 pre-collapse | 1/118 | 1/116 |
| `/netherlands-visa-photo-maker/` | maker | Earns: 1 clicks/90d, 1 pre-collapse | 1/113 | 1/108 |
| `/blog/how-to-sign-on-image-online/` | blog | Earns: 1 clicks/90d, 1 pre-collapse | 1/129 | 1/107 |
| `/exam-requirements/tgpsc/` | exam | Earns: 1 clicks/90d, 1 pre-collapse | 1/76 | 1/75 |
| `/aadhaar-photo/` | other | Earns: 1 clicks/90d, 1 pre-collapse | 1/75 | 1/70 |
| `/canada-visa-photo-maker/` | maker | Earns: 1 clicks/90d, 1 pre-collapse | 1/64 | 1/64 |
| `/india-passport-photo-maker/` | maker | Earns: 1 clicks/90d, 1 pre-collapse | 1/55 | 1/54 |
| `/exam-requirements/ctet/` | exam | Earns: 1 clicks/90d, 1 pre-collapse | 1/53 | 1/53 |
| `/tools/` | hub | Hub / entry point | 1/46 | 1/45 |
| `/uk-passport-photo/` | other | Earns: 1 clicks/90d, 1 pre-collapse | 1/50 | 1/45 |
| `/uk-passport-photo-maker/` | maker | Earns: 1 clicks/90d, 1 pre-collapse | 1/34 | 1/34 |
| `/exam-requirements/uppsc/` | exam | Earns: 1 clicks/90d, 1 pre-collapse | 1/27 | 1/27 |
| `/ireland-visa-photo-maker/` | maker | Earns: 1 clicks/90d, 1 pre-collapse | 1/23 | 1/22 |
| `/exam-requirements/passport-seva/` | exam | Earns: 1 clicks/90d, 1 pre-collapse | 1/21 | 1/21 |
| `/us-passport-photo/` | other | Earns: 1 clicks/90d, 1 pre-collapse | 1/8 | 1/8 |
| `/blog/how-to-compress-pdf/` | blog | Earns: 1 clicks/90d, 1 pre-collapse | 1/8 | 1/8 |
| `/exam-photo-size/` | hub | Hub / entry point | 0/49 | 0/49 |
| `/blog/how-to-reduce-passport-photo-size-for-online-forms/` | blog | Supports a kept tool/exam page with an in-body link | 0/46 | 0/46 |
| `/blog/how-to-prepare-documents-for-exam-applications-india/` | blog | Supports a kept tool/exam page with an in-body link | 0/45 | 0/45 |
| `/blog/pan-vs-voter-id-vs-driving-licence-photo/` | blog | Supports a kept tool/exam page with an in-body link | 0/44 | 0/43 |
| `/blog/ibps-po-2026-photo-signature-checklist/` | blog | Supports a kept tool/exam page with an in-body link | 0/41 | 0/41 |
| `/blog/how-to-mask-aadhaar-before-sharing/` | blog | Supports a kept tool/exam page with an in-body link | 0/48 | 0/41 |
| `/blog/add-name-date-on-exam-photo/` | blog | Supports a kept tool/exam page with an in-body link | 0/37 | 0/35 |
| `/blog/nda-cds-photo-signature-guide-2026/` | blog | Supports a kept tool/exam page with an in-body link | 0/29 | 0/29 |
| `/contact/` | trust | Trust page a quality reviewer looks for | 0/41 | 0/26 |
| `/about/` | trust | Trust page a quality reviewer looks for | 0/39 | 0/25 |
| `/privacy/` | trust | Trust page a quality reviewer looks for | 0/34 | 0/21 |
| `/blog/` | hub | Hub / entry point | 0/20 | 0/19 |
| `/blog/schengen-europe-visa-photo-size/` | blog | Supports a kept tool/exam page with an in-body link | 0/17 | 0/17 |
| `/disclaimer/` | trust | Trust page a quality reviewer looks for | 0/23 | 0/16 |
| `/terms/` | trust | Trust page a quality reviewer looks for | 0/14 | 0/7 |
| `/blog/how-to-compress-photo-to-50kb/` | blog | Supports a kept tool/exam page with an in-body link | 0/7 | 0/7 |
| `/how-photo-checking-works/` | trust | Trust page a quality reviewer looks for | 0/9 | 0/5 |
| `/exam-calendar/` | hub | Hub / entry point | 0/3 | 0/3 |
| `/authors/jaspal-kumar/` | trust | Trust page a quality reviewer looks for | 0/4 | 0/3 |
| `/blog/baby-and-infant-passport-photo-guide/` | blog | Supports a kept tool/exam page with an in-body link | 0/3 | 0/3 |
| `/editorial-policy/` | trust | Trust page a quality reviewer looks for | 0/5 | 0/2 |
| `/source-methodology/` | trust | Trust page a quality reviewer looks for | 0/1 | 0/1 |
| `/blog/how-to-remove-background-from-photo-free/` | blog | Supports a kept tool/exam page with an in-body link | 0/1 | 0/1 |
| `/exam-requirements/` | hub | Hub / entry point | 0/1 | 0/0 |
| `/corrections-policy/` | trust | Trust page a quality reviewer looks for | 0/3 | 0/0 |
| `/blog/cutout-pro-alternative-india/` | blog | Supports a kept tool/exam page with an in-body link | 0/0 | 0/0 |
| `/blog/linkedin-profile-photo-size-and-tips/` | blog | Supports a kept tool/exam page with an in-body link | 0/0 | 0/0 |

</details>

## Already-deindexed — stay as they are (59)

<details><summary>Expand all 59</summary>

| URL | Reason |
|---|---|
| `/exam-requirements/nabard/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/cisf/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/irdai/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/appsc/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/dsssb/` | Seasonal recruitment board — reverse when a notification window opens |
| `/ssc-photo-with-name-date/` | 0 clicks, 1 impressions pre-collapse |
| `/qatar-visa-photo-maker/` | 0 clicks, 0 impressions pre-collapse |
| `/bahrain-visa-photo-maker/` | 0 clicks, 0 impressions pre-collapse |
| `/spain-visa-photo-maker/` | 0 clicks, 24 impressions pre-collapse |
| `/unlock-aadhaar-pdf/` | 0 clicks, 0 impressions pre-collapse |
| `/tools/camera-capture/` | 0 clicks, 1 impressions pre-collapse |
| `/tools/compress-document/` | 0 clicks, 1 impressions pre-collapse |
| `/tools/extract-pages/` | 0 clicks, 15 impressions pre-collapse |
| `/tools/form-fill/` | 0 clicks, 21 impressions pre-collapse |
| `/tools/format-converter/` | 0 clicks, 5 impressions pre-collapse |
| `/tools/image-crop/` | 0 clicks, 0 impressions pre-collapse |
| `/tools/image-to-text/` | 0 clicks, 16 impressions pre-collapse |
| `/tools/ocr/` | 0 clicks, 9 impressions pre-collapse |
| `/tools/pdf/` | 0 clicks, 1 impressions pre-collapse |
| `/tools/pdf-compress/` | 0 clicks, 9 impressions pre-collapse |
| `/tools/pdf-merge/` | 0 clicks, 11 impressions pre-collapse |
| `/tools/pdf-page-numbers/` | 0 clicks, 13 impressions pre-collapse |
| `/tools/pdf-reorder/` | 0 clicks, 1 impressions pre-collapse |
| `/tools/pdf-split/` | 0 clicks, 1 impressions pre-collapse |
| `/tools/pdf-to-jpg/` | 0 clicks, 0 impressions pre-collapse |
| `/tools/pdf-to-text/` | 0 clicks, 13 impressions pre-collapse |
| `/tools/red-eye-removal/` | 0 clicks, 0 impressions pre-collapse |
| `/tools/sign-pdf/` | 0 clicks, 22 impressions pre-collapse |
| `/tools/straighten-photo/` | 0 clicks, 0 impressions pre-collapse |
| `/tools/transparent-signature/` | 0 clicks, 0 impressions pre-collapse |
| `/tools/unlock-pdf/` | 0 clicks, 13 impressions pre-collapse |
| `/tools/watermark-pdf/` | 0 clicks, 9 impressions pre-collapse |
| `/exam-requirements/bpsc/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/bsf/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/ccc-nielit/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/cds/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/crpf/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/ds160/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/epfo/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/fci/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/gate/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/gpsc/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/hpsc/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/itbp/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/kerala-psc/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/kpsc/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/lic/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/mpsc/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/nda/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/nta/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/rbi/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/rpsc/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/tnpsc/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/ugc-net/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/upsssc/` | Seasonal recruitment board — reverse when a notification window opens |
| `/exam-requirements/wbpsc/` | Seasonal recruitment board — reverse when a notification window opens |
| `/india-visa-photo-maker/` | 0 clicks, 1 impressions pre-collapse |
| `/japan-visa-photo-maker/` | 0 clicks, 14 impressions pre-collapse |
| `/singapore-visa-photo-maker/` | 0 clicks, 0 impressions pre-collapse |

</details>

---

## What this plan deliberately refuses to do

- **No deletions.** Every tool stays live and usable regardless of index status.

- **No merging into an earner.** Three pages are similar to a sibling that earns clicks
  (`afcat`→`airforce-agniveer`, `sbi`→`niacl` and similar). Merging a weak page into a working
  one risks the working one. They get a cross-link instead.

- **No cutting on word count or unshared-word share.** Every indexed page clears the 300-word
  target, and the pages the demotion hit hardest sit *above* the site median.

- **No large cut.** Two cuts are already in flight and unmeasured. A third before the December
  gate would destroy attribution for all three.

