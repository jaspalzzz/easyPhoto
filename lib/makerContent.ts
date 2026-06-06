/**
 * Per-page editorial content for the maker pages.
 * -----------------------------------------------
 * This is what makes each /[country]-[kind]-photo-maker/ page genuinely unique
 * (not a template clone): a distinct intro, a few country/kind-specific body
 * sections, and page-specific FAQs. Keyed by the maker slug. Pages without an
 * entry fall back to the generic spec-driven copy.
 *
 * Keep facts accurate; aggregator-sourced numbers still need primary-source
 * verification before production (see DEPLOY.md).
 */
import type { FaqItem } from "@/components/site/Faq";

export interface MakerSection {
  h: string;
  p: string;
}

export interface MakerContent {
  /** Unique lead paragraph that replaces the generic intro. */
  intro: string;
  /** Unique editorial body sections (rendered as h2 + paragraph). */
  sections: MakerSection[];
  /** Page-specific FAQs, merged ahead of the spec-driven ones. */
  faqs: FaqItem[];
}

export const MAKER_CONTENT: Record<string, MakerContent> = {
  "india-passport-photo-maker": {
    intro:
      "Applying through Passport Seva? An Indian passport photo is 35×45mm on a plain white background, with your face filling most of the frame — and online portals cap the file size tightly. This maker sets all of that automatically, in your browser.",
    sections: [
      {
        h: "India passport photo requirements",
        p: "The Passport Seva specification is a 35×45mm photo on a plain white background, taken with a neutral expression and both eyes open. India expects a large face — roughly 80–85% of the frame from chin to crown — so a tightly framed photo is essential. Shadows on the face or the wall behind you are the most common reasons a photo is sent back.",
      },
      {
        h: "Printing vs. online upload",
        p: "For the older pasted application form you need a genuine photo-lab print on photo paper; a home inkjet printout is often refused. For the online Passport Seva application you upload a digital photo, and the portal limits the file size — usually a small number of kilobytes — so the image has to be compressed without going blurry.",
      },
      {
        h: "Works for Tatkal, re-issue and police verification",
        p: "The same 35×45mm white-background photo is used for fresh passports, Tatkal, re-issue and the photo many applicants attach for police verification. Portal caps change, so always confirm the current size and file limit on passportindia.gov.in before you submit.",
      },
    ],
    faqs: [
      {
        q: "What is the passport photo size for the Passport Seva online application?",
        a: "35×45mm with a plain white background. The online portal also limits the file size, so compress the finished photo to the kilobyte cap shown on your application.",
      },
      {
        q: "Why does an Indian passport photo need a white background?",
        a: "Passport Seva requires a plain white, evenly lit background with no shadows so the face can be verified. This tool replaces the background with the correct white automatically.",
      },
      {
        q: "How much of the frame should my face fill?",
        a: "Indian passport photos expect a large face — about 80–85% of the frame from chin to crown. The maker crops to that proportion so the photo isn't rejected for a small head size.",
      },
      {
        q: "Can I get my Indian passport photo under 20 KB for upload?",
        a: "Yes. After making the photo, use the resize-to-KB tool to compress it to your portal's exact limit (often 10–50 KB for government forms) while keeping it sharp.",
      },
    ],
  },

  "us-passport-photo-maker": {
    intro:
      "A US passport photo is 2×2 inches (51×51mm) on a plain white or off-white background — the size set by the US Department of State for Form DS-11. This maker crops your head to the exact required range and sets the background, ready to print or upload.",
    sections: [
      {
        h: "US passport photo specification",
        p: "The photo must be 2×2 inches square, in colour, taken within the last six months, on a plain white or off-white background. Your head, from the bottom of the chin to the top of the head, must be between 1 and 1⅜ inches (25–35mm). A neutral expression with both eyes open is required, and glasses are no longer allowed.",
      },
      {
        h: "Printing at home, a pharmacy, or online",
        p: "You can print the 2×2 photo at home on photo paper, take the downloaded file to a CVS, Walgreens or Costco kiosk, or upload it directly when you renew online. The maker gives you a correctly sized 2×2 image plus a 4×6 print sheet so you don't waste paper.",
      },
      {
        h: "Common reasons US passport photos are rejected",
        p: "Most rejections come from shadows on the face or background, the head being too large or too small in the frame, wearing glasses, or a non-neutral expression. Sizing the head automatically and replacing the background removes the two biggest causes.",
      },
    ],
    faqs: [
      {
        q: "What size is a US passport photo?",
        a: "Exactly 2×2 inches (51×51mm), square, with the head 1 to 1⅜ inches (25–35mm) from chin to crown.",
      },
      {
        q: "Can I print a US passport photo at home?",
        a: "Yes. Download the photo and the 4×6 sheet and print on photo paper, or take the file to a pharmacy photo kiosk. The State Department accepts home-printed photos that meet the spec.",
      },
      {
        q: "Does a US passport photo need a white background?",
        a: "It needs a plain white or off-white background with no shadows. The tool applies a compliant white background for you.",
      },
      {
        q: "How recent does my US passport photo have to be?",
        a: "It must be taken within the last six months and reflect your current appearance.",
      },
    ],
  },

  "us-visa-photo-maker": {
    intro:
      "US visa applications (the DS-160) use the same 2×2 inch composition as a passport, but the digital upload has its own rules: a square image at least 600×600 pixels, in JPEG, under 240 KB. This maker produces a compliant photo you can then compress to the upload limit.",
    sections: [
      {
        h: "DS-160 digital photo requirements",
        p: "For the online DS-160 form the photo must be square, between 600×600 and 1200×1200 pixels, saved as JPEG, and under 240 KB. The composition matches a US passport photo — 2×2 inch proportions, white background, neutral expression, no glasses — but it's the file specifications that usually trip people up.",
      },
      {
        h: "Is a US visa photo the same as a passport photo?",
        p: "Visually, yes — both use the 2×2 inch / square format on a white background. The difference is delivery: a passport photo is usually printed, while the DS-160 visa photo is uploaded as a pixel-perfect JPEG under 240 KB. Make the photo here, then resize it to fit.",
      },
      {
        h: "DV Lottery (Green Card) photos are stricter",
        p: "The Diversity Visa Lottery uses the same square photo but strictly enforces 600×600 pixels minimum, under 240 KB, and recent photos only. The same maker plus the resize-to-KB tool will get you within those limits.",
      },
    ],
    faqs: [
      {
        q: "What are the DS-160 photo requirements?",
        a: "A square colour photo, 600×600 to 1200×1200 pixels, JPEG, under 240 KB, on a plain white background with a neutral expression and no glasses.",
      },
      {
        q: "Is a US visa photo the same size as a passport photo?",
        a: "The composition is identical (2×2 inch / square, white background). The visa photo is uploaded digitally, so it must also meet the 600×600-pixel, under-240 KB JPEG rule.",
      },
      {
        q: "What file size does the US visa photo upload need?",
        a: "Under 240 KB as a JPEG. Make the photo, then compress it with the resize-to-KB tool to land under the limit while staying sharp.",
      },
      {
        q: "Can I use this photo for the DV Lottery / Green Card?",
        a: "Yes — it produces the square, white-background photo the DV Lottery needs; use the resize tool to meet the 600×600-pixel, under-240 KB requirement.",
      },
    ],
  },

  "canada-passport-photo-maker": {
    intro:
      "This maker produces the 35×45mm photo Canada accepts for visas, study and work permits, PR and Express Entry, and online passport renewal. Note: the printed passport booklet photo (50×70mm) must come from a commercial photographer, so this tool covers the digital and renewal uses — not the certified booklet print.",
    sections: [
      {
        h: "What this Canada photo works for",
        p: "A 35×45mm photo on a plain white or light background covers Canadian visitor, study and work visa applications, PR card and Express Entry, citizenship, and the online passport-renewal upload. The maker sets that size and background and checks the head proportion automatically.",
      },
      {
        h: "The printed passport booklet caveat",
        p: "For the physical Canadian passport, IRCC requires a 50×70mm print produced by a commercial photographer, who certifies the photo while a guarantor signs the back. A self-serve tool can't provide that certification, so for the booklet passport use a registered photographer — this maker is for the digital and renewal uses above.",
      },
      {
        h: "Background and expression",
        p: "Canada wants a plain white or light-coloured uniform background with no shadows, a neutral expression and your full face visible. Glasses are allowed only if there's no glare and your eyes are clearly visible, though removing them is safest.",
      },
    ],
    faqs: [
      {
        q: "Can I use this for a Canadian passport (booklet) photo?",
        a: "Not for the printed booklet — that requires a commercial photographer's certification and a guarantor signature on the back. Use this for Canada visas, PR/Express Entry, citizenship and online passport renewal (35×45mm).",
      },
      {
        q: "What size is a Canada PR or Express Entry photo?",
        a: "35×45mm on a plain white or light background, with the head 31–36mm from chin to crown. The maker applies this automatically.",
      },
      {
        q: "Why does Canada's printed passport need a certified photographer?",
        a: "IRCC requires the photographer to certify and date the photo and a guarantor to sign the back — checks a DIY tool can't perform. That applies to the booklet passport, not to visa, PR or online-renewal photos.",
      },
      {
        q: "Can I use this Canada photo for citizenship?",
        a: "Yes — the 35×45mm white-background photo suits citizenship applications and the other digital uses; confirm current file requirements on the IRCC page before submitting.",
      },
    ],
  },

  "canada-visa-photo-maker": {
    intro:
      "Canadian visitor, study and work visa photos are 35×45mm on a plain white or light background, following IRCC's requirements. This maker sizes the head, sets the background and checks compliance — all in your browser.",
    sections: [
      {
        h: "Canada visa photo specification",
        p: "IRCC asks for a 35×45mm photo with the face (chin to crown) measuring 31–36mm, on a plain white or light-coloured background with even lighting and no shadows. A neutral expression with the mouth closed is required, and the photo must be recent.",
      },
      {
        h: "Digital upload vs. printed photo",
        p: "Some applications take a printed 35×45mm photo, while online IRCC portals accept a digital file with their own size limits. The maker produces both a print-ready file and an image you can compress to the portal's file-size cap with the resize tool.",
      },
      {
        h: "Same photo for study and work permits",
        p: "The 35×45mm white-background photo works across Canadian visitor visas, study permits and work permits. Always verify the latest photo and file requirements on the IRCC website, as digital caps can differ by stream.",
      },
    ],
    faqs: [
      {
        q: "What size is a Canada visa photo?",
        a: "35×45mm with the head 31–36mm from chin to crown, on a plain white or light background.",
      },
      {
        q: "Does a Canada visa photo need a white background?",
        a: "A plain white or light-coloured, evenly lit background with no shadows. The tool applies a compliant background automatically.",
      },
      {
        q: "Can I use the same photo for a study or work permit?",
        a: "Yes — Canadian visitor visas, study permits and work permits use the same 35×45mm photo specification.",
      },
      {
        q: "How do I meet the IRCC online file-size limit?",
        a: "Make the 35×45mm photo here, then use the resize-to-KB tool to compress it to the limit shown on your IRCC application.",
      },
    ],
  },

  "uk-passport-photo-maker": {
    intro:
      "A UK passport photo is 35×45mm — and crucially, the background must be light grey or cream, not white. This maker applies the correct background for HM Passport Office and sizes your head to the required band automatically.",
    sections: [
      {
        h: "Why a UK passport photo isn't white",
        p: "Plain white is one of the most common UK rejection reasons. HM Passport Office wants a plain light grey or cream background with no shadows or patterns. This maker defaults to a compliant light background, so you don't fail the most avoidable check.",
      },
      {
        h: "UK passport photo specification",
        p: "The photo is 35×45mm with the head (chin to crown) between 29 and 34mm. You need a neutral expression with your mouth closed, both eyes open and visible, nothing covering the face, and no glasses unless you must wear them for medical reasons.",
      },
      {
        h: "Online photo code vs. printed photo",
        p: "When you apply online you can either upload a digital photo or use a code from a photo booth. This maker creates a digital photo you can upload directly; for a printed photo, download the 6×4 sheet and print it on photo paper.",
      },
    ],
    faqs: [
      {
        q: "Why can't a UK passport photo have a white background?",
        a: "HM Passport Office requires a plain light grey or cream background — pure white is a frequent rejection reason. The tool applies the correct light background for you.",
      },
      {
        q: "What size is a UK passport photo?",
        a: "35×45mm, with the head measuring 29–34mm from chin to crown.",
      },
      {
        q: "Can I take a UK passport photo at home for the online application?",
        a: "Yes — take a front-facing photo against a plain wall in even light, then use this maker to set the correct size and light grey background and upload it.",
      },
      {
        q: "Are glasses allowed in a UK passport photo?",
        a: "Generally no — glasses should be removed unless you must wear them for medical reasons, and there must be no glare.",
      },
    ],
  },

  "uk-visa-photo-maker": {
    intro:
      "UK visa (UKVI) photos follow a 45×35mm digital standard with a plain light background and a neutral expression. This maker produces a compliant photo you can upload or compress to the required file size.",
    sections: [
      {
        h: "UK visa photo requirements",
        p: "UK Visas and Immigration expects a recent colour photo with a plain light-coloured background, a neutral expression, mouth closed and eyes open, and nothing covering the face. For digital uploads the photo should be clear, in focus and meet the portal's pixel and file-size requirements.",
      },
      {
        h: "Background colour matters here too",
        p: "As with UK passports, a plain light grey or cream background is the safe choice — avoid pure white and any pattern or shadow. The maker sets a compliant light background automatically so the photo isn't bounced for the background.",
      },
      {
        h: "Uploading your UK visa photo",
        p: "Online UK visa applications and the biometric process accept a digital photo within set size limits. Make the photo here, then use the resize-to-KB tool to bring it under the file-size cap while keeping it sharp.",
      },
    ],
    faqs: [
      {
        q: "What size is a UK visa photo?",
        a: "A 45×35mm digital standard with a plain light background and a neutral expression; online uploads must also meet the portal's pixel and file-size limits.",
      },
      {
        q: "What background does a UK visa photo need?",
        a: "A plain light-coloured background — light grey or cream is safest. Avoid pure white, patterns and shadows. The tool applies a compliant background for you.",
      },
      {
        q: "Is a UK visa photo the same as a UK passport photo?",
        a: "They share the 35/45mm light-background format and neutral-expression rules; the visa photo is uploaded digitally, so it must also meet the file-size limit.",
      },
      {
        q: "How do I reduce my UK visa photo file size?",
        a: "Use the resize-to-KB tool after making the photo to compress it under the upload limit without visible quality loss.",
      },
    ],
  },

  "australia-passport-photo-maker": {
    intro:
      "An Australian passport photo is 35×45mm on a plain white or light grey background, following the Australian Passport Office. There's one extra step: your guarantor signs the back of the printed photo — this maker creates the compliant image; the endorsement is added after printing.",
    sections: [
      {
        h: "Australia passport photo specification",
        p: "The Australian Passport Office requires a 35×45mm photo with the head (chin to crown) 32–36mm, on a plain white or light grey background with even lighting. A neutral expression with mouth closed and both eyes open is required, and glasses should be removed unless medically necessary.",
      },
      {
        h: "The guarantor declaration",
        p: "For a new Australian passport, one of your two printed photos must be endorsed on the back by your guarantor confirming it's a true likeness, signed and dated. This maker produces the correctly sized photo to print; the endorsement is written by hand after you print it.",
      },
      {
        h: "Printing your Australian photo",
        p: "Download the 35×45mm photo and the 6×4 print sheet, and print on photo paper at a pharmacy or photo lab. Make sure the printed size is exact, since the passport office measures the head height against the 32–36mm band.",
      },
    ],
    faqs: [
      {
        q: "Does an Australian passport photo need a guarantor's signature?",
        a: "Yes — your guarantor must endorse the back of one printed photo confirming it's a true likeness, signed and dated. This tool makes the compliant photo; the signature is added by hand after printing.",
      },
      {
        q: "What size is an Australian passport photo?",
        a: "35×45mm, with the head 32–36mm from chin to crown, on a plain white or light grey background.",
      },
      {
        q: "Can the background be white for an Australian passport?",
        a: "Plain white or light grey are both acceptable, as long as it's uniform with no shadows. The tool applies a compliant background for you.",
      },
      {
        q: "Can I take an Australian passport photo at home?",
        a: "Yes — take a front-facing photo in even light against a plain wall, size it here, print it, and have your guarantor endorse the back.",
      },
    ],
  },

  "australia-visa-photo-maker": {
    intro:
      "Australian visa photos (visitor, student, work and partner visas) are a passport-sized 35×45mm image on a plain white or light grey background. Unlike the passport, a visa photo needs no guarantor endorsement — this maker sizes and backgrounds it, ready to upload to ImmiAccount.",
    sections: [
      {
        h: "Australia visa photo specification",
        p: "Use a recent colour photo, 35×45mm, with the head 32–36mm from chin to crown on a plain white or light grey background with even lighting and no shadows. A neutral expression with the mouth closed and both eyes open is required, and glasses should be removed unless medically necessary.",
      },
      {
        h: "No guarantor needed for a visa photo",
        p: "The back-of-photo guarantor declaration applies to the Australian passport, not to visa applications. For an online visa you simply attach a compliant digital photo in ImmiAccount, so there's nothing to sign — just upload the file this maker produces.",
      },
      {
        h: "Uploading to ImmiAccount",
        p: "Online Australian visa applications accept a clear, recent digital photo. Make the photo here, then if the portal caps the file size, compress it with the resize-to-KB tool so it uploads without losing sharpness.",
      },
    ],
    faqs: [
      {
        q: "What size is an Australian visa photo?",
        a: "A passport-sized 35×45mm photo with the head 32–36mm from chin to crown, on a plain white or light grey background.",
      },
      {
        q: "Does an Australian visa photo need a guarantor signature?",
        a: "No — the guarantor endorsement on the back applies only to the Australian passport. A visa photo is simply uploaded to ImmiAccount, with no signature required.",
      },
      {
        q: "Can I upload this photo to ImmiAccount?",
        a: "Yes — it produces a compliant digital photo. If the application limits the file size, use the resize-to-KB tool to fit the cap while keeping the photo clear.",
      },
      {
        q: "Is an Australian visa photo the same as a passport photo?",
        a: "The size and background are the same (35×45mm, white or light grey), but the visa photo needs no guarantor endorsement and is uploaded digitally rather than printed.",
      },
    ],
  },

  "india-visa-photo-maker": {
    intro:
      "Visiting India? The Indian e-Visa photo is different from a passport photo — it's a square image (350–1000px), JPEG, on a plain white or light background, uploaded to the e-Visa portal. This maker produces a compliant square photo you can then size to the file limit.",
    sections: [
      {
        h: "Indian e-Visa photo requirements",
        p: "The official e-Visa photo is square (height must equal width), between 350×350 and 1000×1000 pixels, saved as JPEG, on a plain light-coloured or white background with no border and no shadows. It must show your full face, front view, with eyes open and no spectacles, and your head centred showing the full head from the top of your hair to the bottom of your chin.",
      },
      {
        h: "It's square — not the 35×45mm passport size",
        p: "Don't confuse this with an Indian passport photo. The passport photo (for Indian citizens) is a 35×45mm rectangle; the e-Visa photo (for foreign visitors) is square. Using the wrong shape is an easy way to get an upload rejected, so this page is set specifically to the square e-Visa format.",
      },
      {
        h: "File size and uploading",
        p: "The e-Visa image must be at least 10 KB. The official upload PDF caps it at 300 KB while the live registration form allows up to 1 MB, so aim for 300 KB or under to satisfy both. Make the square photo here, then use the resize-to-KB tool if you need to bring the file under the limit.",
      },
    ],
    faqs: [
      {
        q: "What size should an Indian e-Visa photo be?",
        a: "A square JPEG, between 350×350 and 1000×1000 pixels, on a plain white or light background with no border. Height must equal width.",
      },
      {
        q: "Is the Indian e-Visa photo the same as a passport photo?",
        a: "No. The Indian passport photo is a 35×45mm rectangle (for citizens); the e-Visa photo (for foreign visitors) is square. They are different specifications — use the right one for your application.",
      },
      {
        q: "What file size does the Indian e-Visa photo need?",
        a: "At least 10 KB. The official PDF caps it at 300 KB and the live form allows up to 1 MB, so 300 KB or under is the safe target. Use the resize-to-KB tool to fit it.",
      },
      {
        q: "Can I wear glasses in an Indian e-Visa photo?",
        a: "No — spectacles are not allowed. The photo must show your full face front-on, eyes open, head centred, on a plain white or light background with no shadows or border.",
      },
    ],
  },

  "schengen-visa-photo-maker": {
    intro:
      "A Schengen visa photo is 35×45mm and follows the ICAO biometric standard used across all 29 Schengen countries. The safe background is light grey — some states accept white, but Switzerland requires grey — and your face should fill about 70–80% of the frame. This maker sets all of it automatically.",
    sections: [
      {
        h: "Schengen / ICAO photo specification",
        p: "Schengen visa photos are 35×45mm, taken recently, with the face filling roughly 70–80% of the frame and measuring 32–36mm chin to crown. The ICAO biometric standard requires a neutral expression, mouth closed, both eyes open and visible, and no glasses. Even lighting with no shadows is essential.",
      },
      {
        h: "Background: light grey, not white",
        p: "Some states officially accept white (France, for example), but others are stricter — Switzerland requires a grey background and rejects pure white. A plain light grey is the safest universal choice across the Schengen area, and this maker defaults to it so one photo works for any member state.",
      },
      {
        h: "One photo for any Schengen country",
        p: "Because the standard is shared, the same 35×45mm light-grey photo is accepted whether you apply through Germany, France, Italy, Spain or any other Schengen member. Still check your specific consulate's notes, as a few add their own preferences.",
      },
    ],
    faqs: [
      {
        q: "What size is a Schengen visa photo?",
        a: "35×45mm, following the ICAO biometric standard, with the head 32–36mm from chin to crown and the face filling about 70–80% of the frame.",
      },
      {
        q: "What background colour should a Schengen visa photo have?",
        a: "Light grey is the safest universal choice. Some states accept white (e.g. France), but Switzerland requires grey and rejects white — so the tool defaults to light grey, which every consulate accepts.",
      },
      {
        q: "Does the same photo work for every Schengen country?",
        a: "Yes — the 35×45mm ICAO standard is shared across all 29 Schengen countries, so one compliant photo works whether you apply through Germany, France, Italy, Spain and so on.",
      },
      {
        q: "Are glasses allowed in a Schengen visa photo?",
        a: "No — the ICAO biometric standard requires glasses to be removed, with both eyes clearly visible and no glare.",
      },
    ],
  },
};

export function getMakerContent(slug: string): MakerContent | undefined {
  return MAKER_CONTENT[slug];
}
