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
      "For an ordinary adult fresh or reissue application, Passport Seva takes your photograph and biometrics at the PSK or POPSK, and its visit guidance says you do not need to bring a photo. This maker is for the white-background print a child below four must carry, or for a photo an Indian mission abroad asks for.",
    sections: [
      {
        h: "What the under-four print must show",
        p: "Passport Seva's fresh and reissue instructions ask a child below four to carry a recent colour photograph. Its minor-photo guidance writes the size as 45 mm × 35 mm, height first, which is the same portrait print as the 35 × 45 mm this maker prepares. It asks for a close-up of the head and the top of the shoulders, and its sample pictures show how tight that framing is.",
      },
      {
        h: "What the minor-photo guidance rules out",
        p: "The child should look straight at the camera with eyes open and no hair across them, with the full head showing from the top of the hair to the bottom of the chin, centred in the frame. Lighting must be even: no shadows on the face or the background, no flash reflections and no red eye. Skin tones should look natural, with appropriate brightness and contrast, and the expression should look natural too. A head covering is allowed only for religious reasons, and even then the face from the bottom of the chin to the top of the forehead, and both edges of the face, must be clearly shown.",
      },
      {
        h: "Overseas, OCI and e-Visa are separate",
        p: "Indian missions abroad follow separate ICAO guidance that asks for a 630 × 810 pixel photograph. OCI and the Indian e-Visa use square photos with their own rules; the e-Visa, for example, takes a square JPEG between 350 × 350 and 1000 × 1000 pixels. Follow the instructions of the office handling your application.",
      },
    ],
    faqs: [],
  },

  "us-passport-photo-maker": {
    intro:
      "A US passport photo is 2 × 2 inches (51 × 51 mm), in colour, on a plain white or off-white background. The State Department uses the same photo for the DS-11 passport form, online renewal and the DS-160 visa form; what differs is how you submit it.",
    sections: [
      {
        h: "Printing at home, at a pharmacy or for online renewal",
        p: "Print the 2 × 2 photo at home on photo paper, take the downloaded file to a pharmacy photo kiosk, or upload it when you renew online. The maker gives you the single photo and a 4 × 6 sheet with several copies, so one print gives you spares.",
      },
      {
        h: "What gets a photo refused",
        p: "Shadows on your face or the background, a head that is too large or too small for the frame, and a non-neutral expression can all get a photo sent back. The maker sizes your head and replaces the background; check the lighting and your expression yourself before you print.",
      },
      {
        h: "The same photo for a US visa (DS-160) and the DV Lottery",
        p: "A DS-160 visa photo uses the same 2 × 2 inch composition, but it is uploaded rather than printed: a square JPEG from 600 × 600 to 1200 × 1200 pixels, no larger than 240 KB. The Diversity Visa Lottery entry uses the same limits. Make the photo here, then compress it to fit under 240 KB.",
      },
      {
        h: "Checking the file and the print",
        p: "The online renewal uploader takes JPEG, PNG, HEIC or HEIF files, while the DS-160 and the DV entry want a JPEG. On a printed copy, measure from the bottom edge of the photo up to your eyes: the State Department's range is 28–35 mm (1⅛ to 1⅜ inches).",
      },
    ],
    faqs: [
      {
        q: "How recent does my US passport photo have to be?",
        a: "It must have been taken within the last six months and show how you look now.",
      },
    ],
  },

  "canada-visa-photo-maker": {
    intro:
      "IRCC asks visitor visa, study permit and work permit applicants for two identical photos, taken within the last six months, at least 35 × 45 mm, on a plain white or light-coloured background.",
    sections: [
      {
        h: "If you apply online",
        p: "IRCC's photo specification describes printed photos and says a digital photo must not be altered in any way. It publishes no file-size limit, so if your online application asks for a photo file, follow the size shown in the application.",
      },
    ],
    faqs: [],
  },

  "uk-passport-photo-maker": {
    intro:
      "A UK passport photo is 35 × 45 mm on a plain light-coloured background, taken within the last month. HM Passport Office gives shades of white, cream, ivory and light grey as examples, so a white background is fine.",
    sections: [
      {
        h: "What background a UK passport photo needs",
        p: "What fails is a background that is dark, coloured, patterned or textured, or one with a shadow behind your head. This maker starts with a light cream background, which keeps your outline visible if you wear a pale top; you can change it.",
      },
      {
        h: "Glasses",
        p: "gov.uk asks you not to wear glasses in the photo unless you have to. If you do, they cannot be sunglasses or tinted, and both eyes must stay clearly visible without glare.",
      },
      {
        h: "Online photo code or printed photo",
        p: "When you apply online you can upload a digital photo or use a code from a photo booth. The gov.uk service says the photo must be unedited, while HMPO's examiner standard allows a digitally edited background if the edit does not change how you look. Because the two do not read alike, a photo taken against a suitable plain wall is the safer choice for the online code. For a printed photo, download the 6 × 4 sheet and print it on photo paper.",
      },
      {
        h: "A UK visa needs a different photo",
        p: "UK Visas and Immigration uses the same 35 × 45 mm frame and plain light background, but it says the photo you submit must not be the one already in your passport or identity card. Take a fresh photo to the same rules, and check the upload limits on the visa application screen.",
      },
    ],
    faqs: [
      {
        q: "Can I take a UK passport photo at home for the online application?",
        a: "Yes, but gov.uk says you need someone to help you take it. Stand against a plain light wall in even light, then size the photo here before you upload it.",
      },
    ],
  },

  "australia-passport-photo-maker": {
    intro:
      "The Australian Passport Office accepts a photo 35–40 mm wide and 45–50 mm high, with the head 32–36 mm from chin to crown, on a plain white or light grey background. This maker prepares 35 × 45 mm, the smallest size in that range.",
    sections: [
      {
        h: "Printing your Australian photo",
        p: "You need two prints, no more than six months old. The Passport Office wants good-quality colour prints made by dye sublimation, not on an inkjet printer, on heavy-weight glossy paper of at least 200 gsm. Ask a pharmacy or photo lab to print the 6 × 4 sheet that way, then measure the printed head with a ruler before you hand a copy to your guarantor.",
      },
      {
        h: "What the Passport Office turns away",
        p: "Its examples of unacceptable photos include retouching or skin smoothing, an edited background, a parent's hand or any object in shot, wireless earbuds, a patterned head covering, heavy make-up, red eye, ink marks, and a blurred or grainy image. Because an edited background is on that list, photograph yourself against a plain white or light grey wall rather than relying on the maker to replace it. Poor eyesight alone is not a medical reason to keep glasses on; hearing aids may stay in. Anyone over three must look straight at the camera with eyes open and a neutral expression, while a child under three may have their mouth open. If a medical condition stops you meeting a rule, you need a medical certificate or a completed B-11 form.",
      },
      {
        h: "Professional photos and online services",
        p: "The Passport Office recommends a professional passport photo provider, such as a post office, chemist or camera store, and advises against online photo services and mobile apps because of the risk of identity fraud. This maker runs on your device and sends your photo nowhere, but your prints still have to meet every rule above.",
      },
      {
        h: "If you are applying for a visa rather than a passport",
        p: "Visa applications are run by Home Affairs, and what they ask for depends on the visa: some subclasses collect your photograph and biometrics at a collection centre, and the ones that take a photo state their own requirements in the application. We have not found one published specification covering visitor, student, work and partner visas, so open the requirements for your subclass in ImmiAccount and work to those.",
      },
    ],
    faqs: [
      {
        q: "Does an Australian visa photo need a guarantor signature?",
        a: "No. The guarantor endorsement belongs to the passport application, not to a visa application.",
      },
    ],
  },

  "pakistan-passport-photo-maker": {
    intro:
      "For an online Pakistani passport renewal, the DGI&P e-services page asks for a photo file of 350 × 467 pixels, JPEG or JPG, no larger than 3 MB, on a plain white background.",
    sections: [
      {
        h: "Checking the file before you upload",
        p: "The “JPG for upload” download is made at exactly 350 × 467 pixels and saved as a JPEG (.jpg); the print download is a separate file sized for a 35 × 45 mm print, so upload the JPG, not the print file. Before you upload, open the file's details — Properties on Windows, Get Info on a Mac, or the info view in your phone's gallery — and confirm it reads 350 × 467. DGI&P sets a 3 MB ceiling and no minimum, so a well-compressed JPEG of a few hundred kilobytes is fine. Look at the photo at its real size as well: at 350 × 467 pixels, a shadow beside the nose or hair over an eyebrow is easy to miss in a large preview.",
      },
    ],
    faqs: [
      {
        q: "Do I also need a printed photo for the online renewal?",
        a: "No. On the e-services route the photo goes through the website as a file and is never handed over on paper, so the pixel size is what matters, not a print size.",
      },
    ],
  },

  "nepal-passport-photo-maker": {
    intro:
      "Use this maker for any form that asks for an MRP size photo, or for the one Nepali ePassport case that needs a printed photo, explained below.",
    sections: [
      {
        h: "How the ePassport photo is taken",
        p: "You start with the online pre-enrolment form, which you can fill in at home on a computer or with the mobile app. While filling it in you choose an enrolment centre — your District or Area Administration Office, the Department of Passports, or the embassy or consulate if you are abroad — and book an appointment. After you submit it you get the full form with a barcode and QR code: print it, or bring the original form on your phone, not a screenshot. At the centre the steps are a form check, the fee payment, then registration, where staff take your photo and biometrics. You hear by email or SMS when the passport is ready, and you collect it where you applied. A renewal follows the same steps as a new passport.",
      },
    ],
    faqs: [],
  },

  "uae-visa-photo-maker": {
    intro:
      "Prepare a UAE visa photo for a typing-centre or GDRFA Dubai application on a plain white background. Check the size with your channel first: the UAE has no single photo size for every application.",
    sections: [],
    faqs: [],
  },

  "india-visa-photo-maker": {
    intro:
      "Visiting India? The Indian e-Visa photo isn't the same as a passport photo. It's a square image (350–1000px), JPEG, on a plain white or light background, uploaded to the e-Visa portal. This maker prepares that square photo; confirm the current upload instructions before use.",
    sections: [
      {
        h: "Indian e-Visa photo requirements",
        p: "The official e-Visa photo is square (height must equal width), between 350×350 and 1000×1000 pixels, saved as JPEG, on a plain light-coloured or white background with no border and no shadows. It has to show your full face, front view, with eyes open and no spectacles, and your head centred showing the full head from the top of your hair to the bottom of your chin.",
      },
      {
        h: "It's square, not the 35×45mm passport size",
        p: "Don't confuse this with the ordinary domestic Indian passport process, where an adult is photographed at the PSK/POPSK. The 35×45mm passport print applies to a child below four, while the e-Visa photo for foreign visitors is a separate square upload.",
      },
      {
        h: "File size and uploading",
        p: "The e-Visa image has to be at least 10 KB. The official upload PDF caps it at 300 KB while the live registration form allows up to 1 MB, so aim for 300 KB or under to satisfy both. Make the square photo here, then use the resize-to-KB tool if you need to bring the file under the limit.",
      },
    ],
    faqs: [
      {
        q: "What size should an Indian e-Visa photo be?",
        a: "A square JPEG, between 350×350 and 1000×1000 pixels, on a plain white or light background with no border. Height must equal width.",
      },
      {
        q: "Is the Indian e-Visa photo the same as a passport photo?",
        a: "No. Ordinary adult Indian passport applicants are photographed at the PSK/POPSK, and the 35×45mm print is the below-four exception. The e-Visa photo for foreign visitors is a separate square digital upload.",
      },
      {
        q: "What file size does the Indian e-Visa photo need?",
        a: "At least 10 KB. The official PDF caps it at 300 KB and the live form allows up to 1 MB, so 300 KB or under is the safe target. Use the resize-to-KB tool to fit it.",
      },
      {
        q: "Can I wear glasses in an Indian e-Visa photo?",
        a: "No, spectacles aren't allowed. The photo has to show your full face front-on, eyes open, head centred, on a plain white or light background with no shadows or border.",
      },
    ],
  },

  "schengen-visa-photo-maker": {
    intro:
      "A Schengen visa photo uses the 35×45mm frame recorded here, with the face at about 70–80% of the image. This generic maker defaults to light grey, but member-state missions can publish different background examples, so confirm the destination consulate's current sheet.",
    sections: [
      {
        h: "Schengen / ICAO photo specification",
        p: "Schengen visa photos are 35×45mm, taken recently, with the face filling roughly 70–80% of the frame and measuring 32–36mm chin to crown. The ICAO biometric standard requires a neutral expression, mouth closed, both eyes open and visible, and no glasses. Even lighting with no shadows is essential.",
      },
      {
        h: "Background: check the handling mission",
        p: "This maker uses a plain light-grey background as its generic default. That is a tool choice, not a claim that every Schengen mission mandates or accepts the same shade. Compare the preview with the current photo guidance published by the consulate or visa centre handling your application.",
      },
      {
        h: "One photo for any Schengen country",
        p: "Many Schengen applications use the same 35×45mm frame, but background and composition instructions can vary by member state and consulate. Prepare the selected light-grey version here, then check the destination consulate's current notes before submitting.",
      },
    ],
    faqs: [
      {
        q: "What background colour should a Schengen visa photo have?",
        a: "Light grey is the safest choice. Some states accept white (e.g. France), but Switzerland requires grey and rejects white, so the tool defaults to light grey, which meets the requirement across the Schengen states. Confirm your consulate's current guidance before submitting.",
      },
      {
        q: "Does the same photo work for every Schengen country?",
        a: "Do not assume one file works everywhere. Many Schengen applications use a 35×45mm frame, but each destination consulate can publish additional background or composition instructions. Confirm each application before reusing a photo.",
      },
      {
        q: "Are glasses allowed in a Schengen visa photo?",
        a: "No. The ICAO biometric standard requires glasses to be removed, with both eyes clearly visible and no glare.",
      },
    ],
  },
  "ireland-visa-photo-maker": {
    intro:
      "An Irish visa needs two printed colour photos, not a digital upload, and each one has writing on the back. This maker prepares the image for you to print.",
    sections: [],
    faqs: [
      {
        q: "Can I use my Irish passport photo for a visa application?",
        a: "The image can meet both sets of rules, but the visa needs two printed copies with your name and transaction number on the back, while the online passport service takes one digital file. Print the copies for the visa rather than reusing an upload.",
      },
    ],
  },
};

export function getMakerContent(slug: string): MakerContent | undefined {
  return MAKER_CONTENT[slug];
}
