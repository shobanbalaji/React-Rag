# =========================
# hybrid_scraper_pipeline_v2.py
# =========================

import json
import re
import asyncio
import time
from typing import List
from bs4 import BeautifulSoup
import httpx
from ddgs import DDGS

import google.generativeai as genai
from app.mongo import get_db
from app.variables.variables import GEMINI_API

# -------------------------
# 0️⃣ Configure Gemini API
# -------------------------
genai.configure(api_key=GEMINI_API)
model = genai.GenerativeModel("gemini-2.5-flash")
db = get_db()  # MongoDB instance for caching

# -------------------------
# 1️⃣ Throttled LLM call
# -------------------------
GEMINI_DELAY = 6  # Free-tier: 10 requests/min → 1 call every 6s
_last_call_time = 0

async def throttled_generate(prompt: str):
    global _last_call_time
    elapsed = time.time() - _last_call_time
    if elapsed < GEMINI_DELAY:
        await asyncio.sleep(GEMINI_DELAY - elapsed)
    response = model.generate_content(prompt)
    _last_call_time = time.time()
    return response

# -------------------------
# 2️⃣ AI Plan Query
# -------------------------
async def ai_plan_query(user_query: str) -> dict:
    prompt = f"""
    You are a smart web search agent.
    Given a user query, decide the best strategy.
    Return JSON with:
    - search_query: what to search online (prefer reliable sources)
    - extract_fields: list of fields to extract from pages
    - summary_goal: type of output (markdown, table, etc.)
    - category: content category (ecommerce, news, books, weather, tech)

    User query: "{user_query}"
    """
    response = await throttled_generate(prompt)
    content_obj = response.candidates[0].content.parts[0]
    generated_text = content_obj.text.strip()
    cleaned_text = re.sub(r"^```json|```$", "", generated_text, flags=re.MULTILINE).strip()
    plan = json.loads(cleaned_text)
    return plan

# -------------------------
# 3️⃣ Web Search
# -------------------------
async def search_web(query: str, limit: int = 5) -> List[str]:
    urls = []
    try:
        with DDGS() as ddgs:
            results = ddgs.text(query, max_results=limit)
            for r in results:
                urls.append(r["href"])
        return urls
    except Exception as e:
        print(f"[search_web] Error: {e}")
        return []

# -------------------------
# 4️⃣ Fetch HTML
# -------------------------
async def fetch_html(url: str) -> str:
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            res = await client.get(url, headers={"User-Agent": "Mozilla/5.0"})
            return res.text
    except Exception as e:
        print(f"[fetch_html] Failed for {url}: {e}")
        return ""

# -------------------------
# 5️⃣ Rule-based extraction
# -------------------------
def extract_field_from_html(field: str, soup: BeautifulSoup):
    print(soup,"soup")
    print(field,"field")
    return True
    field = field.lower()
    try:
        if field in ["name", "title"] and soup.find("h1"):
            return soup.find("h1").text.strip()
        if field == "price" and soup.find(class_="price"):
            return soup.find(class_="price").text.strip()
        if field in ["description", "summary"] and soup.find("p"):
            return soup.find("p").text.strip()
        if field in ["image", "img", "image_url"] and soup.find("img"):
            return soup.find("img")["src"]
        if field in ["buy_link", "link"] and soup.find("a", href=True):
            return soup.find("a")["href"]
        # Generic fallback
        el = soup.find(class_=field)
        if el:
            return el.text.strip()
    except:
        return None
    return None

# -------------------------
# 6️⃣ AI Fallback Extraction (batched per page)
# -------------------------
async def ai_extract_fields(html_snippet: str, fields: List[str]) -> dict:
    if not fields:
        return {}
    prompt = f"""
    Extract the following fields from this HTML snippet: {fields}
    Return pure JSON. If a value is not found, use null.

    HTML snippet:
    {html_snippet[:5000]}
    """
    response = await throttled_generate(prompt)
    content_obj = response.candidates[0].content.parts[0]
    text = content_obj.text.strip()
    cleaned = re.sub(r"^```json|```$", "", text, flags=re.MULTILINE).strip()
    return json.loads(cleaned)

# -------------------------
# 7️⃣ Dynamic Scraper
# -------------------------
async def dynamic_scraper(search_query: str, extract_fields: List[str]) -> List[dict]:
    urls = await search_web(search_query, limit=1)
    scraped_data = []

    async def scrape_url(url: str):
        html = await fetch_html(url)
        soup = BeautifulSoup(html, "html.parser").body
        
        body_content_string = BeautifulSoup(html, "html.parser").prettify()
        with open("body_output.html", "w", encoding="utf-8") as file:
            file.write(body_content_string)
        data = {}
        print(extract_fields,"extract_fields")

        # Rule-based extraction first
        missing_fields = []
        for field in extract_fields:
            value = extract_field_from_html(field, soup)
            if value is None:
                missing_fields.append(field)
            data[field] = value

        # LLM fallback only for missing fields
        if missing_fields:
            print("render")
            ai_data = await ai_extract_fields(str(soup), missing_fields)
            data.update(ai_data)

        data["source_url"] = url

        # Save to cache
        db.scraped_data.update_one({"source_url": url}, {"$set": {"data": data}}, upsert=True)

        return data

    tasks = [scrape_url(url) for url in urls]
    scraped_data = await asyncio.gather(*tasks)
    return scraped_data

# -------------------------
# 8️⃣ Markdown Generation
# -------------------------
async def ai_generate_markdown(query: str, scraped_data: List[dict], summary_goal: str):
    prompt = f"""
    You are a content generator AI. 
    Based on the user's query and extracted web data,
    write the output in markdown format.

    User query: {query}
    Summary goal: {summary_goal}
    Data: {json.dumps(scraped_data[:5], indent=2)}

    Return clean markdown — include tables, lists, or sections as relevant.
    """
    response = await throttled_generate(prompt)
    content_obj = response.candidates[0].content.parts[0]
    return content_obj.text.strip()

# -------------------------
# 9️⃣ Main Handler
# -------------------------
async def handle_user_query(user_query: str):
    # Step 1: AI plan
    plan = await ai_plan_query(user_query)
    print("[Step 1] Plan:", plan)

    # Step 2: Dynamic scraping
    scraped_data = await dynamic_scraper(plan["search_query"], plan["extract_fields"])
    print(f"[Step 2] Scraped {len(scraped_data)} pages")
    print(scraped_data,"dynamic_scraper")

    # Step 3: Markdown generation
    markdown = await ai_generate_markdown(user_query, scraped_data, plan["summary_goal"])
    print("[Step 3] Markdown generated")
    return markdown

# -------------------------
# 10️⃣ Example Usage
# -------------------------
if __name__ == "__main__":
    query = "Best mobile phones under 20000 INR India trusted brands 2025"
    result = asyncio.run(handle_user_query(query))
    print(result)
