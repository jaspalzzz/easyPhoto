# Search Console evidence for the final thin-route decisions

Recorded 3 August 2026 from the signed-in Google Search Console performance
export for `easyphoto.in`, covering 7 June through 1 August 2026. The property
reported 961 clicks and 36,902 impressions overall. The export file is retained
outside the repository; this document records the page-level figures used for
the reversible indexing decisions.

This evidence is not a claim that traffic makes content good. It is used only to
avoid deleting or deindexing a useful page on word count alone. Pages retained
in the index still have to meet the source and reader-value checks.

## Reversibly deindexed now

The standalone name/date page duplicates the fuller indexed SSC requirement
page and general name/date tool. It remains live and linked with
`noindex, follow`.

| Route | Clicks | Impressions |
|---|---:|---:|
| `/ssc-photo-with-name-date/` | 0 | 1 |

The twelve low-demand exam pages first considered for reversible deindexing
were retained after the redirect-parity test exposed that they are canonical
destinations for older tool URLs. The page export showed those legacy URLs still
earning demand: UPSSSC 1 click / 37 impressions, GPSC 1 / 12, Kerala PSC 0 / 41,
EPFO 0 / 31, BSF 0 / 10, BPSC 0 / 8, HPSC 0 / 6, ITBP 0 / 4, RBI 0 / 4 and WBPSC
0 / 1. No row appeared for the RPSC or CRPF legacy route, but their canonical
relationship is kept consistent. Those pages are remediated rather than
noindexed so existing search signals do not terminate at an excluded target.

## Retained because demand is already visible

| Route | Clicks | Impressions | Decision |
|---|---:|---:|---|
| `/tools/resume-photo/` | 36 | 1,157 | Keep indexed; improve the page rather than suppressing demonstrated demand. |
| `/exam-requirements/niacl/` | 5 | 26 | Keep; the application-specific document set has been corrected. |
| `/exam-requirements/tgpsc/` | 1 | 75 | Keep; existing demand is stronger than its current content depth. |
| `/exam-requirements/uppsc/` | 1 | 27 | Keep and strengthen. |
| `/exam-requirements/passport-seva/` | 1 | 21 | Keep; it explains the important live-capture distinction. |
| `/exam-requirements/ctet/` | 1 | 53 | Keep and strengthen. |
| `/exam-requirements/cuet/` | 0 | 170 | Keep; high impressions show useful query coverage even before clicks. |

The legacy `/tools/form-resizer/ccc-nielit/` route recorded 42 clicks and 284
impressions while its canonical `/exam-requirements/ccc-nielit/` route recorded
none. The canonical page stays indexed so the migration is not interrupted.

## Other below-target pages retained for remediation

The following are core country/application pages or had enough impressions that
deindexing would be a poor substitute for improving them:

| Route | Clicks | Impressions |
|---|---:|---:|
| `/exam-requirements/nta/` | 0 | 11 |
| `/exam-requirements/lic/` | 0 | 11 |
| `/exam-requirements/` | 0 | 0 |
| `/singapore-visa-photo-maker/` | 0 | 0 |
| `/exam-requirements/ds160/` | 0 | 0 |
| `/malaysia-visa-photo-maker/` | 0 | 3 |
| `/france-visa-photo-maker/` | 0 | 39 |
| `/exam-requirements/up-police/` | 0 | 22 |
| `/exam-requirements/kpsc/` | 0 | 11 |
| `/china-visa-photo-maker/` | 0 | 2 |
| `/pakistan-passport-photo-maker/` | 0 | 1 |
| `/nepal-passport-photo-maker/` | 0 | 2 |
| `/germany-visa-photo-maker/` | 0 | 48 |
| `/exam-requirements/cat/` | 0 | 31 |
| `/exam-requirements/gpsc/` | 0 | 9 |
| `/exam-requirements/wbpsc/` | 0 | 1 |
| `/exam-requirements/itbp/` | 0 | 6 |
| `/exam-requirements/rbi/` | 0 | 0 |
| `/exam-requirements/kerala-psc/` | 0 | 0 |
| `/exam-requirements/hpsc/` | 0 | 0 |
| `/exam-requirements/upsssc/` | 0 | 0 |
| `/exam-requirements/bsf/` | 0 | 0 |
| `/exam-requirements/bpsc/` | 0 | 4 |
| `/exam-requirements/epfo/` | 0 | 0 |
| `/exam-requirements/rpsc/` | 0 | 6 |
| `/exam-requirements/crpf/` | 0 | 0 |

## Reindex rule

Removing a path from `lib/deindexed.ts` and its matching header is allowed only
after one of these is recorded:

1. a current authority notice adds source-specific material that clears the
   readiness audit without repeated template copy; or
2. Search Console shows demand that justifies improving and reindexing it.

The sitemap/header parity test prevents a route from being reintroduced by only
changing one layer.
