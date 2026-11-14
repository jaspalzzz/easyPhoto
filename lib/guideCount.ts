import { BLOG_POSTS } from "@/lib/blog";
import { isDeindexed } from "@/lib/deindexed";

/**
 * Guides a visitor can open from /blog/. Server components read this and pass
 * it down, so the blog registry never enters a client bundle.
 */
export const GUIDE_COUNT = BLOG_POSTS.filter(
  (post) => !isDeindexed(`/blog/${post.slug}/`),
).length;
