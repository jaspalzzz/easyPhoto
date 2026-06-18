import { ogImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og";
import { getPost } from "@/lib/blog";

const post = getPost("best-free-passport-photo-maker-india-2026")!;

export const dynamic = "force-static";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = `${post.title} — easyPhoto`;

export default function Image() {
  return ogImage({ title: post.title, subtitle: post.description });
}
