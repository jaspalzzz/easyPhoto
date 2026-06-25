import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getPost } from "@/lib/blog";

const post = getPost("how-to-print-passport-photos-at-home")!;

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${post.title} — easyPhoto`;

export default function Image() {
  return ogImage({ title: post.title, subtitle: post.description });
}
