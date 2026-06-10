/**
 * Hindi / Hinglish SEO landing pages.
 * -----------------------------------
 * India is ~half our traffic and searches these tasks in Roman Hinglish
 * ("photo ka size 20kb kaise kare", "signature resize kaise kare"). These are
 * dedicated landing pages over the EXISTING tools — no i18n framework (wrong for
 * a static export). Copy is plain Roman Hinglish, which is how the audience reads
 * and searches online.
 */
import type { FaqItem } from "@/components/site/Faq";

export interface HinglishPage {
  slug: string;
  title: string; // SEO <title>
  description: string; // meta description
  h1: string; // on-page heading
  blurb: string; // intro line
  tool: "photo-kb" | "signature-kb" | "white-bg" | "pdf-compress";
  kb: number; // KB target (ignored for white-bg)
  faqs: FaqItem[];
}

const photoFaqs = (kb: number): FaqItem[] => [
  {
    q: `Photo ka size ${kb}kb kaise kare?`,
    a: `Apni photo upload kare, target size ${kb} KB set kare, aur "Compress to size" dabaye. Tool quality apne aap adjust karke photo ko ${kb} KB se kam kar deta hai. Sab kuch aapke browser me hota hai.`,
  },
  {
    q: "Kya yeh tool free hai aur photo upload hoti hai?",
    a: "Haan, bilkul free hai — koi watermark nahi, koi login nahi. Aapki photo kabhi server par upload nahi hoti; poora kaam aapke phone/computer ke browser me hota hai.",
  },
  {
    q: "Mobile se photo ka size kaise kam kare?",
    a: "Mobile browser me yeh page kholiye, gallery se photo choose kijiye, size set karke compress kijiye, aur download kar lijiye. Alag app ki zaroorat nahi.",
  },
  {
    q: "Photo ki quality kharab to nahi hogi?",
    a: "Tool sabse acchi quality rakhte hue size ghatata hai. Bahut chhota target chunne par thodi quality kam ho sakti hai, isliye form ki limit jitna hi size rakhe.",
  },
];

export const HINGLISH_PAGES: HinglishPage[] = [
  {
    slug: "photo-resize-kaise-kare",
    title: "Photo Resize Kaise Kare — Free Online Photo Size Kam Kare",
    description:
      "Photo ka size online free me kam kare. Exam aur sarkari form (SSC, UPSC, Passport) ke liye photo ko KB me compress kare. Koi upload nahi, 100% private.",
    h1: "Photo Resize Kaise Kare",
    blurb:
      "Apni photo ka size seconds me kam kare — exam aur sarkari form ke liye. Sab kuch browser me, koi upload nahi.",
    tool: "photo-kb",
    kb: 50,
    faqs: photoFaqs(50),
  },
  {
    slug: "photo-ka-size-20kb-kaise-kare",
    title: "Photo Ka Size 20KB Kaise Kare — Free Online Tool",
    description:
      "Photo ka size 20 KB kaise kare? Online free me photo ko 20 KB se kam kare — SSC, UPSC aur form upload ke liye. Private, koi upload nahi.",
    h1: "Photo Ka Size 20KB Kaise Kare",
    blurb:
      "Photo ko 20 KB se kam karne ka sabse aasaan tarika — form upload ke liye perfect.",
    tool: "photo-kb",
    kb: 20,
    faqs: photoFaqs(20),
  },
  {
    slug: "photo-ka-size-50kb-kaise-kare",
    title: "Photo Ka Size 50KB Kaise Kare — Free Online Tool",
    description:
      "Photo ka size 50 KB kaise kare? Online free me photo ko 50 KB se kam kare — exam aur sarkari form ke liye. 100% private, koi upload nahi.",
    h1: "Photo Ka Size 50KB Kaise Kare",
    blurb: "Photo ko 50 KB se kam kare — exam aur form upload ke liye.",
    tool: "photo-kb",
    kb: 50,
    faqs: photoFaqs(50),
  },
  {
    slug: "photo-ka-size-100kb-kaise-kare",
    title: "Photo Ka Size 100KB Kaise Kare — Free Online Tool",
    description:
      "Photo ka size 100 KB kaise kare? Online free me photo ko 100 KB se kam kare. Private, koi upload nahi, koi watermark nahi.",
    h1: "Photo Ka Size 100KB Kaise Kare",
    blurb: "Photo ko 100 KB se kam kare — form aur document upload ke liye.",
    tool: "photo-kb",
    kb: 100,
    faqs: photoFaqs(100),
  },
  {
    slug: "signature-resize-kaise-kare",
    title: "Signature Resize Kaise Kare — Online Signature Size Kam Kare",
    description:
      "Signature ka size online free me kam kare. Form ke liye signature ko 10-20 KB me compress kare, background saaf kare. Private, koi upload nahi.",
    h1: "Signature Resize Kaise Kare",
    blurb:
      "Apne signature ka scan upload kare — background saaf hoke size form ki limit (10-20 KB) me aa jata hai.",
    tool: "signature-kb",
    kb: 20,
    faqs: [
      {
        q: "Signature ka size kaise kam kare?",
        a: "Signature ka photo/scan upload kare; tool background hata kar use crop karta hai aur target KB me compress kar deta hai. Download kar lijiye.",
      },
      {
        q: "Signature ka background white kaise kare?",
        a: "Tool kaagaz ka background apne aap hata deta hai — aap transparent PNG ya white background, dono choose kar sakte hai.",
      },
      {
        q: "Kya signature upload hota hai kahin?",
        a: "Nahi. Signature aapke browser me hi process hota hai, kabhi server par upload nahi hota.",
      },
    ],
  },
  {
    slug: "passport-photo-white-background-kaise-kare",
    title: "Passport Photo White Background Kaise Kare — Free Online Tool",
    description:
      "Passport ya form photo ka background white kaise kare? Online free me background hata kar white background banaye. 100% private, koi upload nahi.",
    h1: "Photo Ka White Background Kaise Kare",
    blurb:
      "Apni photo ka background ek click me saaf, white background me badle — passport aur form ke liye.",
    tool: "white-bg",
    kb: 50,
    faqs: [
      {
        q: "Photo ka background white kaise kare?",
        a: "Photo upload kare; tool background apne aap hata kar white laga deta hai. Phir download kar lijiye. Sab kuch browser me hota hai.",
      },
      {
        q: "Kya yeh free hai aur photo upload hoti hai?",
        a: "Haan, bilkul free. Photo kabhi server par upload nahi hoti — poora kaam aapke browser me hota hai.",
      },
      {
        q: "Passport ke liye kaunsa background chahiye?",
        a: "India aur US passport ke liye white background chahiye. Yeh tool clean white background bana deta hai jo aksar accept hota hai — phir bhi apne form ki guideline zaroor check kare.",
      },
    ],
  },
  {
    slug: "photo-ka-background-white-kaise-kare",
    title: "Photo Ka Background White Kaise Kare — Free Online Tool",
    description:
      "Photo ka background white kaise kare online free me? Ek click me background hata kar white kare — form aur ID ke liye. Private, koi upload nahi.",
    h1: "Photo Ka Background White Kaise Kare",
    blurb:
      "Kisi bhi photo ka background hata kar white background banaye — bilkul free, browser me.",
    tool: "white-bg",
    kb: 50,
    faqs: [
      {
        q: "Background white karne ke liye kya karna hoga?",
        a: "Bas photo upload kijiye — tool subject ko rakh kar background ko white kar deta hai. Download kar lijiye.",
      },
      {
        q: "Quality kharab to nahi hogi?",
        a: "Tool edges ko saaf rakhte hue background badalta hai. Achhi lighting wali photo me result sabse accha aata hai.",
      },
      {
        q: "Kya photo private rahti hai?",
        a: "Haan. Photo aapke device ke browser me hi process hoti hai, kahin upload nahi hoti.",
      },
    ],
  },
  {
    slug: "photo-resize-mobile-se",
    title: "Mobile Se Photo Resize Kaise Kare — Free Online Tool",
    description:
      "Mobile se photo resize kaise kare? Apne phone me hi photo ka size KB me kam kare — exam aur sarkari form ke liye. Koi app nahi, 100% private.",
    h1: "Mobile Se Photo Resize Kaise Kare",
    blurb:
      "Sirf apne mobile browser me photo ka size kam kare — exam aur form ke liye. Koi app install karne ki zaroorat nahi.",
    tool: "photo-kb",
    kb: 50,
    faqs: photoFaqs(50),
  },
  {
    slug: "photo-ka-size-kam-kaise-kare",
    title: "Photo Ka Size Kam Kaise Kare — Free Online Photo Compressor",
    description:
      "Photo ka size kam kaise kare online free me? Photo ko KB me compress kare — SSC, UPSC aur form upload ke liye. Private, koi upload nahi.",
    h1: "Photo Ka Size Kam Kaise Kare",
    blurb:
      "Apni photo ka size aasani se kam kare aur form ki KB limit me laaye. Sab kuch browser me, koi upload nahi.",
    tool: "photo-kb",
    kb: 50,
    faqs: photoFaqs(50),
  },
  {
    slug: "signature-ka-size-kaise-kam-kare",
    title: "Signature Ka Size Kaise Kam Kare — Online Signature Compressor",
    description:
      "Signature ka size kaise kam kare? Form ke liye signature ko 10-20 KB me compress kare aur background saaf kare. Private, koi upload nahi.",
    h1: "Signature Ka Size Kaise Kam Kare",
    blurb:
      "Apne signature ka scan upload kare — background saaf hoke size form ki limit (10-20 KB) me aa jata hai.",
    tool: "signature-kb",
    kb: 20,
    faqs: [
      {
        q: "Signature ka size kaise kam kare?",
        a: "Signature ka photo ya scan upload kare; tool background hata kar use crop karta hai aur target KB me compress kar deta hai. Phir download kar lijiye.",
      },
      {
        q: "Signature ka background white ya transparent kaise kare?",
        a: "Tool kaagaz ka background apne aap hata deta hai — aap transparent PNG ya white background, dono choose kar sakte hai.",
      },
      {
        q: "Kya signature kahin upload hota hai?",
        a: "Nahi. Signature aapke browser me hi process hota hai, kabhi server par upload nahi hota.",
      },
    ],
  },
  {
    slug: "pdf-ka-size-kaise-kam-kare",
    title: "PDF Ka Size Kaise Kam Kare — Free Online PDF Compressor",
    description:
      "PDF ka size kaise kam kare online free me? Marksheet, certificate ya koi bhi PDF ko 50-200 KB me compress kare — exam aur sarkari form ke liye. Private, koi upload nahi.",
    h1: "PDF Ka Size Kaise Kam Kare",
    blurb:
      "Apna PDF upload kare, target KB set kare — marksheet ya certificate seconds me compress ho jata hai. Sab kuch browser me, koi upload nahi.",
    tool: "pdf-compress",
    kb: 100,
    faqs: [
      {
        q: "PDF ka size kaise kam kare?",
        a: "PDF upload kare, target size (jaise 50 KB ya 100 KB) set kare, aur compress button dabaye. Tool PDF ko automatically us size me compress kar deta hai. Phir download kar lijiye.",
      },
      {
        q: "Exam form ke liye PDF kitne KB ka chahiye?",
        a: "Zyaadatar exam portals (UPSC, IBPS, SSC) marksheet aur certificate ke liye 50-100 KB maangte hain. Apne form ki instruction zaroor padhein — kuch portals 200 KB tak allow karte hain.",
      },
      {
        q: "Kya PDF compress karne se quality kharab hoti hai?",
        a: "Scanned documents (marksheet, certificate, Aadhaar) bahut achhe se compress hote hain — text readable rehta hai. Bahut tight target (jaise 50 KB 4-page document ke liye) pe thodi quality kam ho sakti hai.",
      },
      {
        q: "Kya PDF private rehta hai? Kahin upload hota hai?",
        a: "Nahi. Aapka PDF kabhi server par upload nahi hota — poora compression aapke browser me hota hai.",
      },
    ],
  },
  {
    slug: "pdf-compress-kaise-kare",
    title: "PDF Compress Kaise Kare — Online Free PDF Size Reducer",
    description:
      "PDF compress kaise kare? Certificate, marksheet ya koi bhi PDF ko online free me small kare — exam portal upload ke liye. 100% private, koi upload nahi.",
    h1: "PDF Compress Kaise Kare",
    blurb:
      "Kisi bhi PDF ko online compress kare — marksheet, certificate, Aadhaar — bilkul free, browser me.",
    tool: "pdf-compress",
    kb: 100,
    faqs: [
      {
        q: "PDF compress karne ka sabse aasaan tarika kya hai?",
        a: "PDF upload kare, target KB select kare (jaise 100 KB), aur 'Compress' dabaye. Tool apne aap best quality rakhte hue size ghatata hai. Download ho jata hai.",
      },
      {
        q: "Marksheet ya certificate ka PDF size kaise kam kare?",
        a: "Scanned marksheet ya certificate ka PDF upload kare, target 50 KB ya 100 KB set kare, aur compress kar lijiye. Scanned pages bahut achhe compress hote hain kyunki unme zyaadatar white space hota hai.",
      },
      {
        q: "Kya compressed PDF me se text selectable rehega?",
        a: "PDF compression pages ko images me convert karta hai, isliye text selectable nahi rehta. Lekin exam portal uploads ke liye yeh zaruri nahi hota — document dikhne me sahi rehta hai.",
      },
      {
        q: "Kya yeh mobile se bhi kaam karta hai?",
        a: "Haan. Mobile browser me yeh page kholen, PDF upload karen aur compress kar len. Alag app ki zaroorat nahi.",
      },
    ],
  },
];

export const HINGLISH_SLUGS = HINGLISH_PAGES.map((p) => p.slug);
export const getHinglishPage = (slug: string) =>
  HINGLISH_PAGES.find((p) => p.slug === slug);
