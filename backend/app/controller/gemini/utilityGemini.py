import google.generativeai as genai
from app.variables.variables import GEMINI_API


genai.configure(api_key=GEMINI_API)

model = genai.GenerativeModel("gemini-1.5-flash")

async def geminiResponse(request: str) -> str:
    try:
        response = model.generate_content(f"Give relevant information about {request}")
        return response.text
    except Exception as e:
        print(f'An exception occurred: {e}')
        return "Error"
