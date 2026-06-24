import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { BlogPostLayout } from "@/components/blog/BlogPostLayout";
import { getPost } from "@/lib/blog";

const post = getPost("image-to-text-online-free-ocr")!;

const FAQ_ITEMS = [
  {
    q: "Is the OCR tool completely free?",
    a: "Yes. The image-to-text tool on easyPhoto is free with no registration required. The Tesseract OCR engine runs as WebAssembly in your browser — there is no server involved and no upload happens.",
  },
  {
    q: "What image formats does the OCR tool support?",
    a: "JPG, PNG, WebP, BMP, and TIFF. Most phone photos are JPG or HEIC; if your camera saves HEIC, convert to JPG first using the format converter on this site.",
  },
  {
    q: "Why is the extracted text inaccurate?",
    a: "OCR accuracy depends on image quality. Use well-lit, straight, high-contrast images — minimum 150 DPI. Blurry, skewed, or low-contrast photos produce errors. Straighten the image and increase brightness before retrying.",
  },
  {
    q: "Can I extract text from a PDF?",
    a: "The current tool works on images only. To extract text from a PDF, first convert the PDF to JPG using the PDF to JPG tool on this site, then run OCR on the resulting image.",
  },
  {
    q: "Does it work for Hindi text?",
    a: "Yes. Select Hindi or English + Hindi from the language selector before clicking Extract Text. The Hindi (Devanagari) model is downloaded on first use — about 4 MB — and then cached in your browser.",
  },
];

export const metadata = pageMetadata({
  title: post.title,
  titleAbsolute: true,
  description: post.description,
  path: `/blog/${post.slug}/`,
  type: "article",
});

export default function Page() {
  return (
    <BlogPostLayout
      slug={post.slug}
      ctaHref="/tools/image-to-text/"
      ctaLabel="Extract text from your image"
      faqItems={FAQ_ITEMS}
    >
      <p>
        A scanned mark sheet, a screenshot of an official notice, a photo of a
        printed government form — all have text locked inside a picture file.
        Retyping it is slow and error-prone. OCR (Optical Character Recognition)
        reads the image and gives you the text in under 10 seconds, ready to
        copy, edit, or paste anywhere.
      </p>

      <div className="my-7 rounded-xl border border-brand/20 bg-brand-soft/15 p-5">
        <p className="!mt-0 text-sm font-semibold text-ink">Quick answer</p>
        <ul className="!mt-2 text-[15px]">
          <li>
            Go to{" "}
            <Link href="/tools/image-to-text/" className="font-medium">
              easyPhoto Image to Text
            </Link>
            , upload your image, choose the language, click{" "}
            <strong>Extract Text</strong>.
          </li>
          <li>
            The result appears in a text box — copy it or download it as a{" "}
            <strong>.txt file</strong> in one click.
          </li>
          <li>
            Everything runs <strong>in your browser</strong>. Your image is
            never uploaded to any server.
          </li>
        </ul>
      </div>

      <h2>When do you need image-to-text?</h2>
      <p>
        The most common situations for Indian users:
      </p>
      <ul>
        <li>
          <strong>Scanned certificates and mark sheets</strong> — university
          certificates are often scanned PDFs or photos; extracting the text
          lets you fill forms without retyping roll numbers, grades, and dates.
        </li>
        <li>
          <strong>Government notices and circulars</strong> — PDFs or screenshots
          of exam notifications contain important dates, eligibility rules, and
          fee details you need to reference quickly.
        </li>
        <li>
          <strong>Business cards and visiting cards</strong> — photograph the card
          and extract the phone number, email, and address into your contacts app.
        </li>
        <li>
          <strong>Printed forms you need to fill digitally</strong> — scan the
          blank form, extract the field names, then fill the digital version.
        </li>
        <li>
          <strong>Screenshots of text messages or notifications</strong> — when
          you have a screenshot but need to search or quote the text.
        </li>
      </ul>

      <h2>Step-by-step: extract text from an image</h2>
      <p>
        Open the{" "}
        <Link href="/tools/image-to-text/">Image to Text tool</Link> and follow
        these steps:
      </p>
      <ol className="!mt-3 list-decimal space-y-2 pl-5 text-[16px]">
        <li>
          <strong>Upload your image.</strong> Drag and drop a JPG, PNG, WebP,
          BMP or TIFF file onto the drop zone, or tap it to pick from your
          device. A preview appears immediately.
        </li>
        <li>
          <strong>Select the language.</strong> Choose English, Hindi, or English
          + Hindi. Getting the language right is the single biggest factor in
          accuracy — Devanagari characters will not be read correctly with the
          English model.
        </li>
        <li>
          <strong>Click Extract Text.</strong> The OCR engine loads on first use
          (about 4–5 MB downloaded once, then cached). A progress bar shows the
          recognition stage.
        </li>
        <li>
          <strong>Copy or download the result.</strong> The extracted text
          appears in an editable text box. Click <em>Copy</em> to paste it
          anywhere, or click <em>.txt</em> to save it as a text file with your
          original filename.
        </li>
      </ol>

      <h2>Tips for better OCR accuracy</h2>
      <p>
        The quality of the extracted text depends almost entirely on the quality
        of the input image. These steps make a significant difference:
      </p>

      <table className="my-5 w-full border-collapse text-[14px]">
        <thead>
          <tr className="border-b border-hairline text-left">
            <th className="py-2 pr-3 font-semibold text-ink">Problem</th>
            <th className="py-2 font-semibold text-ink">Fix</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-hairline">
          <tr>
            <td className="py-2 pr-3 text-muted-foreground">Blurry or out of focus</td>
            <td className="py-2 text-muted-foreground">Retake the photo with better lighting; hold the camera steady</td>
          </tr>
          <tr>
            <td className="py-2 pr-3 text-muted-foreground">Skewed or tilted page</td>
            <td className="py-2 text-muted-foreground">
              Use the{" "}
              <Link href="/tools/straighten-photo/">Straighten Photo tool</Link>{" "}
              to level the image first
            </td>
          </tr>
          <tr>
            <td className="py-2 pr-3 text-muted-foreground">Low contrast (light ink on light paper)</td>
            <td className="py-2 text-muted-foreground">Scan in greyscale mode, or boost contrast with any photo editor</td>
          </tr>
          <tr>
            <td className="py-2 pr-3 text-muted-foreground">Small or dense text</td>
            <td className="py-2 text-muted-foreground">Scan at 300 DPI minimum; crop tightly to the text area before uploading</td>
          </tr>
          <tr>
            <td className="py-2 pr-3 text-muted-foreground">Mixed English + Hindi on the same page</td>
            <td className="py-2 text-muted-foreground">Select English + Hindi from the language dropdown</td>
          </tr>
          <tr>
            <td className="py-2 pr-3 text-muted-foreground">Handwritten text</td>
            <td className="py-2 text-muted-foreground">Tesseract handles print well but struggles with cursive handwriting — results will be partial</td>
          </tr>
        </tbody>
      </table>

      <h2>Is it safe? Does anything get uploaded?</h2>
      <p>
        Nothing is uploaded. The OCR engine — Tesseract, an open-source project
        from HP Labs that is now maintained by Google — is compiled to WebAssembly
        and runs entirely inside your browser tab. Your image data never leaves
        your device. The only network requests are the one-time downloads of the
        engine (~3 MB) and the language model (~4 MB for English, ~7 MB for
        Hindi) which are cached after the first use.
      </p>
      <p>
        This matters for sensitive documents: Aadhaar cards, mark sheets,
        salary slips, bank statements, and medical records can all be processed
        safely without the risk of a third-party server storing a copy.
      </p>

      <h2>What about extracting text from a PDF?</h2>
      <p>
        The image-to-text tool works on image files. If you have a PDF, use the{" "}
        <Link href="/tools/pdf-to-jpg/">PDF to JPG converter</Link> first to
        export each page as an image, then run OCR on the resulting JPG. For
        a digitally created PDF (not a scan), the text is already embedded —
        you can select and copy it directly without OCR.
      </p>

      <h2>Supported languages</h2>
      <p>
        The current tool supports three modes:
      </p>
      <ul>
        <li>
          <strong>English</strong> — Latin script documents, certificates, notices
        </li>
        <li>
          <strong>Hindi (Devanagari)</strong> — Hindi-language documents and
          government circulars in Hindi
        </li>
        <li>
          <strong>English + Hindi</strong> — Bilingual documents such as Indian
          government forms that mix both scripts on the same page
        </li>
      </ul>
      <p>
        More languages (Tamil, Telugu, Bengali, Marathi) will be added as the
        tool matures. The Tesseract engine supports over 100 languages — it is a
        matter of bundling the additional training data.
      </p>
    </BlogPostLayout>
  );
}
