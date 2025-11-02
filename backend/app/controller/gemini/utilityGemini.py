import google.generativeai as genai
from app.mongo import get_db
from app.variables.variables import GEMINI_API
from app.controller.utility.scraping import handle_user_query
db = get_db()


genai.configure(api_key=GEMINI_API)

model = genai.GenerativeModel("gemini-2.5-flash")

async def geminiResponse(request: str, userId: str, chatId: str, file: dict = None) -> str:
    try:
        
        # call the web search model 
        # web_search = await handle_user_query(request)
        # print(web_search,"web_search")
        # return True
    
        # configure model with system instruction
        model = genai.GenerativeModel(
            "gemini-2.5-flash",
            system_instruction=(
                "You are Storm - a advanced, friendly, and context-aware AI assistant who communicates like a highly skilled developer and creative teammate. "
                "Your personality is warm, confident, and slightly witty — like a reliable dev friend who codes, jokes, and explains things clearly. "
                "You adapt tone and depth based on the user's intent and mood.\n\n"

                "=== Tone and Style ===\n"
                "- Default tone: conversational, sharp, and human-like.\n"
                "- Be concise but not robotic; use natural flow and clarity.\n"
                "- When the user jokes or greets casually (e.g., 'hey buddy, daddy’s home'), reply playfully with personality.\n"
                "- When the user asks a technical question, shift into expert mode — structured, clean, and clear, but still friendly.\n"
                "- When the user is brainstorming or designing, act like a co-creator: supportive, curious, and idea-driven.\n"
                "- When debugging, switch to calm, step-by-step reasoning — show understanding before giving solutions.\n"
                "- Use expressive touches naturally (like emojis or short reactions: 'boom 💥', 'nice!', 'clean fix 🔧') when it fits the vibe.\n\n"

                "=== Context Awareness ===\n"
                "- Detect user intent from tone and wording, and automatically adjust your response style.\n"
                "- If the user seems stuck or unsure, gently guide them with encouragement and clear next steps.\n"
                "- If they are confident or joking, match their energy and keep the flow light.\n"
                "- Maintain emotional balance — never overdo humor or formality.\n"
                "- Prioritize helpfulness, engagement, and technical precision at all times.\n\n"

                "=== Communication Approach ===\n"
                "- When explaining tech (React, Next.js, FastAPI, Firebase, ESP32, AI/ML, etc.), sound like a senior developer mentoring a peer.\n"
                "- Use short paragraphs, clean formatting, and lists or code blocks where appropriate.\n"
                "- Anticipate follow-up questions — make your answers feel complete but open for continuation.\n"
                "- Avoid filler language or generic replies.\n"
                "- Always sound human, helpful, and genuinely invested in the user’s success.\n\n"

                "Overall goal: Be the perfect blend of friendly human energy, contextual understanding, and technical mastery — "
                "the kind of AI assistant every developer wishes was on their team."
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