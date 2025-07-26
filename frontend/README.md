# 🤖 RAG-Based AI Assistant (React + FastAPI + MongoDB)

This is a full-stack Retrieval-Augmented Generation (RAG) application powered by **React**, **TypeScript**, **FastAPI**, **MongoDB**, and **Sentence Transformers**. It integrates with large language models like **Gemini** and **OpenAI GPT** to generate intelligent responses from retrieved documents.

---

## 🧠 Key Features

- **RAG Mode**: Uses Sentence Transformers to find relevant context and then sends it to an LLM.
- **Normal Mode**: Directly sends the user's input to the LLM (no retrieval).
- **Model Toggle**: Switch between Gemini and GPT API dynamically.
- **React + TypeScript UI**: Clean and modern chat interface.
- **FastAPI Backend**: Handles embedding, retrieval, and communication with LLMs.
- **MongoDB**: Stores source documents and vector embeddings.

---

## ⚙️ Setup Instructions

### ✅ Prerequisites

- Node.js >= 16
- Python >= 3.9
- MongoDB running locally or via Atlas
- API keys for Gemini and/or OpenAI

---

### 🔌 Backend Setup (FastAPI + Python)

1. Navigate to the backend folder:
    ```bash
    cd backend
    ```

2. Create and activate virtual environment:
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    ```

3. Install Python dependencies:
    ```bash
    pip install -r requirements.txt
    ```

4. Create a `.env` file in `backend/`:

    ```env
    GEMINI_API_KEY=your-gemini-api-key
    OPENAI_API_KEY=your-openai-api-key
    MONGO_URI=mongodb://localhost:27017
    ```

5. Start FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```

---

### 💻 Frontend Setup (React + TypeScript)

1. Navigate to frontend folder:
    ```bash
    cd frontend
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm start
    ```

The app will run at `http://localhost:3000`.

---

## 🧪 API Usage

### Endpoint: `POST /generate`

#### Request:
```json
{
  "query": "What is RAG?",
  "mode": "rag",          // Options: "rag" or "normal"
  "model": "gemini"       // Options: "gemini" or "gpt"
}


