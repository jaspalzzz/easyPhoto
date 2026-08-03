# Verification discipline

Written after a remediation round in which an external reviewer found real
defects in seven consecutive submissions. In almost every case the *fix* was
correct and the *verification* was not. This file exists so the checks do not
depend on anyone remembering them.

Each rule below is followed by the incident that produced it. They are not
hypotheticals.

---

## 1. A data change is not a behaviour change. Find the consumer.

After editing a spec, constant, list or registry entry, locate the code that
reads it and prove the **output** changed. Print the before and after.

> **Singapore.** The registry was corrected to a 400x514 upload. The export still
> produced 413x531, because `recommendedDigitalDpi()` reads only `pxMin` and the
> record used `px`. The Saudi eVisa was worse: 602x602 against a required
> 200x200. The data was right and the product was wrong.
>
> **UGC-NET.** A disputed signature limit was disclosed in the page copy while
> `sigLimitKb` stayed at 50, so the tool kept generating files the stricter
> reading forbids. Prose changed; behaviour did not.
>
> **Deindexing 34 pages.** The sitemap shrank and `_headers` gained rules — but
> written without the trailing slash the site serves, and with no `<meta
> name="robots">` anywhere. Nothing would have left the index. The work was
> reported as done.

**Check:** `grep` the field name across `app/ lib/ components/ store/`. If a
consumer exists, exercise it and diff the result.

## 2. Write the guard from the rule, not from the instances you fixed.

A regex or list built out of the strings you happened to find will pass every
phrasing you did not.

> A guard was added to stop the claim "the UK rejects white backgrounds" from
> returning. It was assembled from the eleven instances just corrected. Eight
> more were live at the time — "white is the wrong choice", "a pure white
> background will fail", "pure white rejected" — and the guard passed all of
> them. Rewriting it from the verb set immediately found two further instances
> that were in nobody's list.

**Check:** before trusting a new guard, write down three phrasings of the same
error it has never seen, and confirm it catches them.

## 3. A guard that passes proves nothing. Break the code, three ways.

Prove the guard fails on the regression it was written for — then on two
regressions you did *not* have in mind.

> One test filtered records by a predicate and then asserted that same
> predicate — true by construction, and it would have passed with the bug fully
> restored.
>
> Another asserted `specForDocumentKind()` behaved correctly, but never checked
> that the page *called* it. Reverting `page.tsx` to the old inline logic left
> every test green.
>
> A third read a fixed three-line window of `_headers`, so deleting one route's
> rule let it borrow the next route's and pass.

**Check:** `cp file /tmp/bak`, break it, run the test, confirm red, restore.
Do it for the obvious regression and for the sideways one.

## 4. Any sentence of the form "all X now Y" is a claim. Count it.

> "All sitemap groups now filter deindexed paths." Only two of six did. The
> other four happened to contain nothing on the list, so the sitemap looked
> correct. The fix was one filter over the assembled output — an invariant that
> survives someone adding a group.
>
> "Both preset builders are covered." Only the manual path was tested.

**Check:** grep for every site of the pattern and count them. If the number is
not in the report, the claim is not verified.

## 5. Measure before recommending, and publish the number.

State the figure that justifies the action, not an adjective.

> "These tool pages are thin" is unactionable. "44 of 51 under 500 visible
> words, median 379, and the 34 lowest carry 1.7% of site impressions" decides
> the question — and revealed that the single best-earning tool page, at 405
> words, would have been deleted by a word-count rule.

## 6. Do not overshoot away from the last correction.

The opposite of a wrong claim is usually also wrong.

> After learning that the UK does *not* reject white backgrounds, the copy was
> changed to say a digitally replaced background "does not meet" the rule and is
> "print only". The examiner standard in fact permits an edited background where
> the edit does not affect the image of the customer. The correction was as
> unsupported as the error.

**Check:** when reversing a claim, find the source for the *new* claim too. Both
directions need evidence.

## 7. Distinguish "the gate passes" from "the work is done".

A gate is set where it can currently pass. That is a regression floor, not a
standard of quality, and reporting a green build as readiness is misleading.

> `npm run verify` passes. `npm run audit:adsense-readiness` exits 2 with
> "NOT READY … 72 page(s) remain below the target. A passing `npm run verify`
> does not mean otherwise." Both statements are true simultaneously and both
> belong in any status report.

## 8. Verify against the deployed artefact, not the build output.

> A page's `noindex` was confirmed in `out/` and would still not have reached
> Google, because delivery depended on edge path matching that did not match.
> The only sufficient check was `curl` against the live URL — with a
> cache-busting query, since an edge copy served mid-propagation reported a
> false negative.

## 9. Say what was not done, in the same breath as what was.

Incomplete work reported as complete is the failure this file is about. Name the
untouched surface explicitly, with its number.

> Seventy-eight template-generated pages remain: 53 exam pages at a median of
> 134 unshared words and 25 country makers at 105. Nothing in eleven rounds of
> remediation has touched them.

---

## The underlying failure

Verification shaped by what you already believe. The instinct is to confirm the
fix works; the discipline is to look for the path you did not check, the
phrasing you did not imagine, and the consumer you did not open.

When in doubt, the cheapest useful question is: **if this were still broken,
where would the evidence be — and have I actually looked there?**
