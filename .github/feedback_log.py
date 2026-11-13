"""Keep FEEDBACK.md in step with the repo's issues. Run by .github/workflows/feedback-log.yml.

Issue text is untrusted: it is read from environment variables only and written as quoted text.
"""
import os
import re

PATH = "FEEDBACK.md"
HEADER = (
    "# Requests and problem reports\n\n"
    "Sent from the app (Home or More > Report a problem / request a change). "
    "Newest at the bottom. This file is written automatically; do not edit it by hand.\n"
)


def clean(text, limit):
    text = (text or "").replace("\r\n", "\n").replace("\r", "\n")
    text = "".join(ch for ch in text if ch == "\n" or ch == "\t" or ord(ch) >= 32)
    text = text.replace("<", "&lt;").replace(">", "&gt;")
    return text[:limit].strip()


def main():
    action = os.environ.get("ACTION", "")
    num = int(os.environ["NUM"])
    doc = open(PATH, encoding="utf-8").read() if os.path.exists(PATH) else HEADER
    marker = f"<!-- request {num} -->"

    if action == "opened":
        if marker in doc:
            return
        title = " ".join(clean(os.environ.get("TITLE"), 200).split()) or "(no title)"
        title = title.replace("#", "\\#").replace("|", "\\|")
        body = clean(os.environ.get("BODY"), 4000) or "(no details)"
        quoted = "\n".join(("> " + line).rstrip() for line in body.split("\n"))
        date = (os.environ.get("CREATED") or "")[:10]
        url = os.environ.get("URL", "")
        entry = (
            f"\n{marker}\n## {num}. {title}\n\n"
            f"- Received: {date}\n- Status: open\n- Link: {url}\n\n{quoted}\n"
        )
        doc = doc.rstrip("\n") + "\n" + entry
    else:
        start = doc.find(marker)
        if start < 0:
            return
        end = doc.find("<!-- request ", start + len(marker))
        end = len(doc) if end < 0 else end
        if action == "closed":
            status = "- Status: closed " + (os.environ.get("CLOSED") or "")[:10]
        else:
            status = "- Status: open"
        block = re.sub(r"^- Status: .*$", status.rstrip(), doc[start:end], count=1, flags=re.M)
        doc = doc[:start] + block + doc[end:]

    with open(PATH, "w", encoding="utf-8") as fh:
        fh.write(doc)


if __name__ == "__main__":
    main()
