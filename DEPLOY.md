# easyPhoto — Go-Live & SEO Submission Checklist

Everything in the codebase is done. These are the **operational** steps that can
only be performed by you, after deploy. Work top to bottom.

---

## 1. Pre-deploy (in the repo)

- [ ] **Set the real contact email.** `hello@easyphoto.in` in `app/contact/page.tsx`
      is a placeholder — point it at a real inbox.
- [ ] **Confirm aggregator-sourced specs** against primary government sources
      before trusting them in production: UK, Schengen, India, Australia (these
      are marked `verified: "aggregator"` in `lib/countrySpecs.ts`). US and
      Canada are `verified: "gov"`.
- [ ] **Set env vars** (copy `.env.example` → your host's dashboard):
  - `NEXT_PUBLIC_SITE_URL=https://easyphoto.in` (no trailing slash)
  - Leave the two verification vars empty for now (filled in step 4).

## 2. Deploy

- [ ] Build command `next build`, output is a static export in `out/`.
- [ ] Host on Vercel or Netlify (recommended — they serve the extension-less
      `opengraph-image` files with the correct `image/png` content-type).
      `vercel.json` and `public/_headers` (CSP) are already in the repo.
  - *Bare Nginx/Apache:* add a rule so `*/opengraph-image` is served as
    `Content-Type: image/png`, or the social cards won't render.
- [ ] Point the `easyphoto.in` DNS at the host and enable HTTPS.
- [ ] Smoke-test live: home, `/india/`, `/passport-photo/`, a tool page, a blog
      post. Confirm no console errors and the photo flow works.

## 3. Verify the live SEO plumbing

- [ ] `https://easyphoto.in/sitemap.xml` loads and lists every page.
- [ ] `https://easyphoto.in/robots.txt` loads and references the sitemap.
- [ ] View-source on a country page → `<link rel="canonical">` matches the URL.
- [ ] Paste a page URL into the
      [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
      and [X Card Validator] — confirm the **per-page** OG card image shows.
- [ ] Run [Rich Results Test](https://search.google.com/test/rich-results) on a
      country page (SoftwareApplication + Breadcrumb) and a blog post (BlogPosting).

## 4. Search Console & Bing

- [ ] **Google Search Console** → add property `https://easyphoto.in` →
      verification → "HTML tag" → copy the `content="..."` value →
      set `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` → **rebuild & redeploy** →
      click Verify.
- [ ] **Bing Webmaster Tools** → add site → "Meta tag" → copy the
      `msvalidate.01` content → set `NEXT_PUBLIC_BING_SITE_VERIFICATION` →
      rebuild & redeploy → Verify. (Or just import the verified GSC property.)
- [ ] In **both**, submit `https://easyphoto.in/sitemap.xml`.
- [ ] Request indexing for the homepage and the top country pages.

## 5. Measure

- [ ] Run **Lighthouse** (or PageSpeed Insights) on the live homepage and a
      country page. Target green Core Web Vitals — this is what ticks the last
      "Fast Loading" box. Note the heavy libraries (MediaPipe, background
      removal) load lazily on interaction, so first paint should stay fast.

## 6. Authority / growth (ongoing, off-platform)

- [ ] **Backlinks:** list on relevant directories, answer questions on forums
      where passport-photo specs come up, reach out to immigration/visa blogs.
- [ ] After ~2–4 weeks, use **GSC's Performance report** to find queries where
      you rank 5–20 and refine those page titles/descriptions (CTR tuning).
- [ ] Keep publishing: each blog post is a registry entry in `lib/blog.ts` plus
      `app/blog/<slug>/page.tsx` and `opengraph-image.tsx` — it then flows into
      the index, sitemap and internal links automatically.

---

### Already done in code (no action needed)
Sitemap · robots · canonicals · 10 structured-data types · **per-page OG images
(every route)** · verification `<meta>` slot · **keyword-rich programmatic URLs**
(`/india-passport-photo-maker/`, `/us-visa-photo-maker/`, `/tools/resize-kb/`
…) · country/visa/blog pages · 15+ FAQ pages with FAQPage schema ·
internal-link mesh · privacy/terms/about/contact.

> URL note: the old short routes (`/india/`, `/tools/resize-image-to-20kb/`) were
> **replaced**, not duplicated — there is one canonical URL per page. Since the
> site has never been deployed, there are no live URLs to 301. If you had already
> indexed the old paths, add host redirects before launch.
