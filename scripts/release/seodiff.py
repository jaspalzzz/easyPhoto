"""SEO-visible diff of two static exports (CLAUDE.md §6.3).

    python3 scripts/release/seodiff.py <base>/out <new>/out

Compares, for every index.html: <title>, meta description/robots, canonical,
H1/H2 text, JSON-LD, visible text (in order) and internal links; plus whether
sitemap.xml is identical. Prints each changed page with the text lines that
differ. Standard library only.
"""
import difflib
import os
import sys
from html.parser import HTMLParser


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.d = {"title": "", "meta": {}, "canon": "", "h": [], "ld": [], "text": [], "links": []}
        self.stack, self.skip, self.cur = [], 0, (None, {})

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.stack.append(tag)
        self.cur = (tag, a)
        if tag in ("script", "style", "noscript"):
            self.skip += 1
        if tag == "meta" and a.get("name") in ("description", "robots"):
            self.d["meta"][a["name"]] = a.get("content")
        if tag == "link" and a.get("rel") == "canonical":
            self.d["canon"] = a.get("href")
        if tag == "a" and a.get("href"):
            self.d["links"].append(a["href"])

    def handle_endtag(self, tag):
        if tag in ("script", "style", "noscript"):
            self.skip = max(0, self.skip - 1)
        if self.stack:
            self.stack.pop()

    def handle_data(self, data):
        top = self.stack[-1] if self.stack else ""
        if top == "script" and self.cur[1].get("type") == "application/ld+json":
            self.d["ld"].append(data.strip())
            return
        if self.skip:
            return
        if top == "title":
            self.d["title"] += data
        data = data.strip()
        if not data:
            return
        if "h1" in self.stack or "h2" in self.stack:
            self.d["h"].append(data)
        self.d["text"].append(data)


def load(root):
    pages = {}
    for dirpath, _, files in os.walk(root):
        if "index.html" in files:
            p = Page()
            with open(os.path.join(dirpath, "index.html"), encoding="utf8") as fh:
                p.feed(fh.read())
            pages[os.path.relpath(dirpath, root)] = p.d
    return pages


def main(base_dir, new_dir):
    a, b = load(base_dir), load(new_dir)
    with open(os.path.join(base_dir, "sitemap.xml")) as f1, open(os.path.join(new_dir, "sitemap.xml")) as f2:
        print("sitemap identical:", f1.read() == f2.read())
    changed = 0
    for key in sorted(set(a) | set(b)):
        if key not in a or key not in b:
            print("ONLY IN ONE", key)
            changed += 1
            continue
        fields = [f for f in ("title", "meta", "canon", "h", "ld") if a[key][f] != b[key][f]]
        if a[key]["text"] != b[key]["text"]:
            fields.append("text")
        if sorted(a[key]["links"]) != sorted(b[key]["links"]):
            fields.append("links")
        if fields:
            changed += 1
            print(key, fields)
            for line in difflib.ndiff(a[key]["text"], b[key]["text"]):
                if line[:2] in ("- ", "+ "):
                    print("   ", line[:110])
    print("pages changed:", changed)


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
