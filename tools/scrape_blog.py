import re
import sys
import html as html_lib
from html.parser import HTMLParser
from urllib.request import Request, urlopen


def configure_stdout():
    try:
        # Windows console can be cp1252; enforce utf-8 to avoid UnicodeEncodeError
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")  # type: ignore[attr-defined]
    except Exception:
        pass


BLOCK_TAGS = {
    "p",
    "div",
    "section",
    "article",
    "br",
    "hr",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "li",
    "ul",
    "ol",
    "table",
    "tr",
    "td",
    "th",
    "blockquote",
}


class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self._skip_depth = 0  # inside script/style

    def handle_starttag(self, tag, attrs):
        t = tag.lower()
        if t in ("script", "style"):
            self._skip_depth += 1
            return
        if self._skip_depth:
            return
        if t == "br":
            self.parts.append("\n")
        elif t in ("p", "div", "li", "h1", "h2", "h3", "h4", "h5", "h6", "tr"):
            self.parts.append("\n")

    def handle_endtag(self, tag):
        t = tag.lower()
        if t in ("script", "style"):
            if self._skip_depth:
                self._skip_depth -= 1
            return
        if self._skip_depth:
            return
        if t in ("p", "div", "li", "h1", "h2", "h3", "h4", "h5", "h6", "tr"):
            self.parts.append("\n")

    def handle_data(self, data):
        if self._skip_depth:
            return
        # Keep data as-is; we normalize later
        self.parts.append(data)

    def text(self) -> str:
        s = "".join(self.parts)
        s = html_lib.unescape(s)
        s = s.replace("\r", "")
        # normalize whitespace but preserve paragraph breaks
        s = re.sub(r"[ \t\f\v]+", " ", s)
        s = re.sub(r"\n[ ]+\n", "\n\n", s)
        s = re.sub(r"\n{3,}", "\n\n", s)
        return s.strip()


def html_to_text(html: str) -> str:
    p = TextExtractor()
    p.feed(html)
    return p.text()


def fetch(url: str) -> str:
    req = Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urlopen(req, timeout=60) as resp:
        raw = resp.read()
    return raw.decode("utf-8", errors="replace")


def extract_h1(html: str) -> str:
    m = re.search(r"<h1[^>]*>([\\s\\S]*?)</h1>", html, re.I)
    return html_to_text(m.group(1)) if m else ""


def extract_date_author(html: str) -> tuple[str, str]:
    # Matches e.g. "24 October 2025 by ... CA Sandesh Jaiman"
    text = html_to_text(html)
    # Try a tighter regex first to avoid picking up footer
    m = re.search(
        r"\\b(\\d{1,2}\\s+[A-Za-z]+\\s+\\d{4})\\s+by\\s+([A-Za-z .]+)",
        text,
    )
    if m:
        return m.group(1).strip(), m.group(2).strip()
    return "", ""


def slice_element_by_class(html: str, class_name: str) -> str | None:
    # Find the first element containing the class, then take a best-effort slice until its closing tag.
    # We bias towards <div ... class="...class_name...">
    m = re.search(
        rf"<(?P<tag>div|article|section)\\b[^>]*class=\"[^\"]*\\b{re.escape(class_name)}\\b[^\"]*\"[^>]*>",
        html,
        re.I,
    )
    if not m:
        return None
    tag = m.group("tag").lower()
    start = m.start()
    i = m.end()
    depth = 1
    # scan forward counting nested same tags (good enough for Odoo templates)
    open_re = re.compile(rf"<{tag}\\b", re.I)
    close_re = re.compile(rf"</{tag}>", re.I)
    while i < len(html) and depth > 0:
        mo = open_re.search(html, i)
        mc = close_re.search(html, i)
        if mc is None:
            break
        if mo is not None and mo.start() < mc.start():
            depth += 1
            i = mo.end()
            continue
        depth -= 1
        i = mc.end()
    return html[start:i]


def extract_main_text(html: str) -> str:
    # Odoo blog pages: the readable content is typically within o_wblog_post_content.
    for cls in ["o_wblog_post_content", "o_wblog_post", "o_blog_post_complete", "blog_post"]:
        chunk = slice_element_by_class(html, cls)
        if chunk:
            txt = html_to_text(chunk)
            # filter out clearly wrong extraction (menus, etc.)
            if "All Blogs" in txt and len(txt) > 500:
                # try to cut off at "in Blogs" footer marker
                cut = txt.split("\n\nin Blogs\n\n", 1)[0].strip()
                return cut
            if len(txt) > 500:
                return txt

    # fallback: whole page, but still HTML-parser based (prevents broken words)
    return html_to_text(html)


def clean_post_from_text(txt: str) -> dict[str, str]:
    """
    Turn the extracted page text into {title, date, author, body}.
    This is a best-effort heuristic for Odoo blog pages.
    """
    lines = [ln.strip() for ln in txt.split("\n")]
    lines = [ln for ln in lines if ln != ""]

    # Find first occurrence of the title after the breadcrumb area if possible
    title = ""
    date = ""
    author = ""

    # Look for a date line like "24 October 2025"
    date_idx = -1
    for i, ln in enumerate(lines):
        if re.fullmatch(r"\d{1,2}\s+[A-Za-z]+\s+\d{4}", ln):
            date = ln
            date_idx = i
            break

    # Author usually follows "by" then name
    if date_idx != -1:
        for j in range(date_idx + 1, min(date_idx + 8, len(lines))):
            if lines[j].lower() == "by":
                if j + 1 < len(lines):
                    author = lines[j + 1]
                break

        # Title is usually just before date (and repeated once)
        for k in range(date_idx - 1, max(-1, date_idx - 6), -1):
            if len(lines[k]) > 6 and lines[k].lower() not in ("blogs", "all blogs"):
                title = lines[k]
                break

    # Body: start at first meaningful heading after metadata
    start = 0
    if date_idx != -1:
        start = date_idx + 1
    # Find first content heading (Introduction/While/etc.)
    for i in range(start, len(lines)):
        if lines[i] in ("Introduction",) or lines[i].startswith("##") or len(lines[i]) > 20:
            start = i
            break

    # End before footer markers
    end = len(lines)
    for i in range(start, len(lines)):
        if lines[i] in ("in Blogs", "About us", "Connect with us", "Sign in to leave a comment"):
            end = i
            break

    body_lines = lines[start:end]
    body = "\n".join(body_lines).strip()

    # If body contains "BY :" treat that as end marker and remove signature duplication
    if "BY :" in body:
        body = body.split("BY :", 1)[0].strip()

    return {"title": title, "date": date, "author": author, "body": body}


def main():
    configure_stdout()
    if len(sys.argv) < 2:
        print("Usage: python tools/scrape_blog.py [--json] <url> [<url>...]")
        raise SystemExit(2)

    args = sys.argv[1:]
    as_json = False
    if args and args[0] == "--json":
        as_json = True
        args = args[1:]
    if not args:
        print("Usage: python tools/scrape_blog.py [--json] <url> [<url>...]")
        raise SystemExit(2)

    results = []
    for url in args:
        html = fetch(url)
        page_txt = extract_main_text(html)
        cleaned = clean_post_from_text(page_txt)
        title = cleaned["title"] or extract_h1(html)
        date = cleaned["date"]
        author = cleaned["author"]
        body = cleaned["body"]

        if as_json:
            results.append(
                {
                    "url": url,
                    "title": title,
                    "date": date,
                    "author": author,
                    "body": body,
                }
            )
        else:
            print("=" * 80)
            print(url)
            print("TITLE:", title)
            print("DATE:", date)
            print("AUTHOR:", author)
            print("-" * 80)
            print(body)

    if as_json:
        import json

        print(json.dumps(results, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()

