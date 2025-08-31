import google.generativeai as genai
from app.mongo import get_db
from app.variables.variables import GEMINI_API
db = get_db()


genai.configure(api_key=GEMINI_API)

model = genai.GenerativeModel("gemini-2.5-flash")

async def geminiResponse(request: str, userId: str, chatId: str, file: dict = None) -> str:
    try:
        # configure model with system instruction
        model = genai.GenerativeModel(
            "gemini-2.5-flash",
            system_instruction=(
                "You are a friendly AI companion. "
                "Respond in a warm, conversational tone. "
                "If the user uploads a file, analyze it and provide helpful insights. "
                "Always ground your answers in the conversation history."
            )
        )
        
        # retrieve conversation memory
        chat_memory_ref = db["chat_memory"]
        latest_memory = chat_memory_ref.find_one(
            {"userId": userId, "chatId": chatId}, 
            sort=[("_id", -1)]
        )
        
        # Build history (only user/model allowed)
        history = []
        if latest_memory and "memory" in latest_memory:
            for msg in latest_memory["memory"]:
                history.append({"role": "user", "parts": [msg["request"]]})
                history.append({"role": "model", "parts": [msg["response"]]})
        
        # Start chat session with history
        chat = model.start_chat(history=history)

        # Build user input
        user_input = [{"text": request}]
        
        if file:
            user_input.append({
                "inline_data": {
                    "mime_type": file["content_type"],
                    "data": file["buffer"]
                }
            })

        # Send request
        response = chat.send_message(user_input)

        # Save memory
        if response:
            memory_entry = {"request": request, "response": response.text}

            if latest_memory:
                chat_memory_ref.update_one(
                    {"userId": userId, "chatId": chatId},
                    {"$push": {"memory": memory_entry}}
                )
            else:
                chat_memory_ref.insert_one({
                    "chatId": chatId,
                    "userId": userId,
                    "memory": [memory_entry]
                })

        return response.text if response and response.text else "Sorry, I couldn’t generate a response."

    except Exception as e:
        print(f"An exception occurred: {e}")
        return "Oops! Something went wrong."



async def generateChatSummary(message: str) -> str:
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = (
        "Summarize the following message into a clear, concise summary "
        "within 50 characters with only summary text no additional work and character dont mention and don't end with full stop :\n\n"
        f"{message}"
    )

    response = model.generate_content(prompt)

    summary = response.text.strip() if hasattr(response, "text") else ""
    return summary[:200]  # ensure max 200 chars