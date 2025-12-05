

import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url: str):
    headers = {
        "User-Agent": (
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/120.0 Safari/537.36"
        )
    }

    try:
        response = requests.get(url, headers=headers, timeout=20, verify=True)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch URL: {url} (Status {response.status_code})")

        soup = BeautifulSoup(response.text, "html.parser")

        # ✅ Extract title
        title_tag = soup.find("h1", {"id": "firstHeading"})
        title = title_tag.get_text() if title_tag else "Untitled"

        # ✅ Extract content
        content_div = soup.find("div", {"id": "mw-content-text"})
        if not content_div:
            raise Exception("Wikipedia page content not found!")

        # ✅ Clean unwanted tags
        for tag in content_div(["sup", "table", "style", "script"]):
            tag.decompose()

        paragraphs = content_div.find_all("p")
        text = "\n".join(
            [p.get_text().strip() for p in paragraphs if p.get_text().strip()]
        )

        if not text:
            raise Exception("No text content extracted from Wikipedia page.")

        return title, text

    except Exception as e:
        raise Exception(f"Failed to fetch URL: {url} ({str(e)})")
