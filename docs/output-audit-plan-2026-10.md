# Exam output audit — plan (CLAUDE.md §4, §7)

Status: **approved by the owner, 10 Oct 2026**; started the same day.

## 1. Why

On 10 Oct we found that the UPSC signature tool passed every test yet made
files UPSC's form would refuse:
- **The rule:** UPSC requires 350–500 px on each side.
- **What we made:** a three-signature sheet came out 384 × 534 (fixed in #99).
- **Why the tests missed it:** they checked the file size (KB) but not the
  pixels. The rule was in the exam's description text but not in the data the
  tool reads.

A person whose file is refused rarely tells us; they leave. Right output is
the product (§4), and the first growth lever (§8).

A quick scan of the exam data (10 Oct) already shows more leads like it. These
are **unverified**; the audit confirms or clears each against the official
source:

| Exam | Indexed page? | Lead |
|---|---|---|
| OCI | yes | Description says 900 × 900 px; the tool enforces no pixel size |
| RRB | yes | Description says 100 DPI; the tool doesn't set DPI |
| GATE | no (tool menus only) | Description says 530 × 690 (photo) and 580 × 180 (signature); the tool uses 350 × 450 and 400 × 130 |
| CCC (NIELIT) | no (tool menus only) | Description gives 300 and 200 DPI; the tool sets none |

## 2. Scope

- **All 52 exam presets.** Order:
  - **Tier 1:** the 23 exams with a page in Google's index (they get the
    traffic).
  - **Tier 2:** the other 29, which appear in tool menus (exam package,
    compliance checker, resizers).
- **The tools that read them:**
  - **Resizers:** the photo and signature resizers on each exam page;
  - **Other exam tools:** the exam package, the name-and-date tool, the
    compliance checker and the photo validator.
- **Not in this audit:** passport and visa photo makers by country. Same idea,
  separate audit later.

## 3. Two checks per exam

### A. Is our rule right? (against the official source)

For each exam:
1. Open the current official notice or portal instructions.
2. Record every published rule:
   - photo and signature size in KB (minimum **and** maximum);
   - pixels (exact, range or minimum), shape, DPI, format, background;
   - name/date strip, number of signatures, required file names;
   - live photo.
3. Compare with our data.

**Results**, one row per exam with the source link and date checked:
- **Wrong number:** fix it.
- **Published but not enforced** (like UPSC's 350–500 px): add it so the tool
  enforces it.
- **Dead or outdated link:** repoint it.
- **"Needs review" that can now be confirmed** (17 exams): mark it verified,
  with the date.
- **Authority publishes no figure:** say so on the page and keep our default
  labelled as ours (§3).

### B. Does our tool produce it? (automated, in a real browser)

A test harness drives the real tools, as a person would, for every exam with a
standard set of inputs:
- **Photos:** a phone portrait (3000 × 4000), a small photo (300 × 400), a
  landscape shot, a HEIC from an iPhone.
- **Signatures:** a phone photo of a paper signature, a tight scan, a very wide
  signature; three stacked signatures where the exam asks for them.

Each downloaded file is checked against the exam's rules:
- **Size:** inside the KB band, counting 1 KB as 1,000 or 1,024 bytes, as
  portals differ.
- **Pixels:** exact size, shape or side range, whichever the exam publishes.
- **Format:** JPG (or whatever the exam requires), with the declared DPI.
- **Strip:** the name/date strip present when the exam asks for it.
- **No damage:** the face and signature not cut off.

**Output:** a pass/fail grid (exam × input × check), plus a short report of
every failure with the file we made.

**Afterwards:** the harness stays as a permanent check (`npm run
audit:outputs`). A future change that breaks an exam's output fails it before
release.

## 4. How findings get fixed

- **One fix per PR,** each with a test that fails on the old behaviour (§4).
  Spec data changes carry the source link and date (§4).
- **Tool-only fixes** (like #99) are JavaScript. Google can't see them, so they
  can go in any release.
- **Fixes that change numbers shown on a page** are SEO-visible. They follow
  the batching rules: a few pages per release, never during an update or the
  14 days after one, and owner review of the wording.
- **Hotfix rule** (owner decision 3 below): if a tier-1 tool makes files the
  form definitely refuses, CLAUDE.md §5 allows a same-day fix after the full
  gate.

## 5. SEO-visible impact and performance

- **The audit:** no SEO-visible change. It's test code and a docs report,
  with nothing on the site.
- **Fixes:** each PR lists its page changes; most will be tool-only.
- **Performance:** none for visitors; the harness runs only on our machines
  and against the dev preview.

## 6. Proving the harness works

- **It must catch the UPSC bug:** with #99 temporarily reverted, the UPSC row
  must fail with 384 × 534.
- **It must catch a planted mistake:** a deliberately wrong test preset (e.g.
  a cap of 1 KB) must fail.
- It must run green on SSC, UPSC, PAN and the Driving Licence, which already
  have tests, before we trust it elsewhere.

## 7. Rollback

- **The harness:** test code only; delete it to remove it.
- **Each fix:** its own PR, revertible on its own.

## 8. Effort and order

| Step | What | Effort |
|---|---|---|
| 1 | Build the harness (B) and run it on all 52 exams | 1–2 days |
| 2 | Source check (A) for the 23 indexed exams (SSC and UPSC already done this month) | 2–3 days |
| 3 | Fixes, most important first: indexed exams with refused files → wrong numbers → missing rules → tier 2 | depends on findings |
| 4 | Source check (A) for the 29 tier-2 exams | 2–3 days |

**Proposal:**
- Start steps 1–2 **now**. They ship nothing, so there's no release risk.
- Tool-only fixes ready and checked on the dev preview by 20 Oct join the
  22 Oct release; later ones go in the next.
- The UPSC face-coverage check and the Voter ID title test keep their slots
  (after 22 Oct and after 29 Oct).

## Owner decisions (10 Oct 2026)

1. Plan approved.
2. Start now.
3. **Hotfix: yes.** A tool on an indexed page that makes files the form
   definitely refuses gets a same-day hotfix to production after the full gate
   (CLAUDE.md §5). Everything else waits for the next planned release.
