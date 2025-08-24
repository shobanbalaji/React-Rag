import google.generativeai as genai
from app.variables.variables import GEMINI_API


genai.configure(api_key=GEMINI_API)

model = genai.GenerativeModel("gemini-1.5-flash")

async def geminiResponse(request: str, file: dict = None) -> str:
    try:
        system_prompt = (
            "You are a friendly AI companion. "
            "Respond in a warm, conversational tone. "
            "If the user uploads a file, analyze it and provide helpful insights. "
            "Keep responses natural, not robotic."
        )

        # Base conversation
        contents = [system_prompt, f"User: {request}"]
        

        if file:
            
           contents.append({
                "mime_type": file["content_type"],
                "data": file["buffer"]
            })

        # Generate response
        response = model.generate_content(contents)
        return response.text if response.text else "Sorry, I couldn’t generate a response."

    except Exception as e:
        print(f"An exception occurred: {e}")
        return "Oops! Something went wrong."