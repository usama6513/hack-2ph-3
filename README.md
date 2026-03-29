# 🚀 TaskFlow AI - Phase 3 COMPLETE

**AI-Powered Full-Stack Todo Application with Intelligent Chatbot**

---

## 🎯 Features

### Phase 1 ✅
- Python Console App
- Basic TODO management
- Memory-based storage

### Phase 2 ✅
- Full-Stack Web Application
- User Authentication (JWT)
- TODO CRUD Operations
- PostgreSQL Database
- Responsive UI

### **Phase 3 - NEW** 🆕
- **AI Chatbot Assistant** - Control todos with natural language
- **Multilingual Support** - English, Urdu, Sindhi
- **Conversation History** - Persistent chat sessions
- **Smart Task Management** - AI understands context
- **Voice Commands** - "Add a todo", "Show my tasks", etc.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI:** Glassmorphism Design

### Backend
- **Framework:** FastAPI
- **Language:** Python 3.11+
- **Database:** PostgreSQL (Neon) / SQLite
- **ORM:** SQLModel
- **Authentication:** JWT

### AI Integration 🤖
- **LLM Provider:** Groq API
- **Model:** Llama 3.1 8B Instant
- **Function Calling:** Tool-based architecture
- **Language Detection:** Automatic

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | https://frontend-theta-one-25.vercel.app |
| **Backend** | https://usama6513-project.hf.space |
| **GitHub** | https://github.com/usama6513/hack-2ph-3 |

---

## 🚀 Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/usama6513/hack-2ph-3.git
cd hack-2ph-3
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows

pip install -r requirements.txt

# Create .env file
copy .env.example .env
# Edit with your API keys
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Create .env.local
copy .env.example .env.local
# Set NEXT_PUBLIC_API_URL
```

### 4. Run Locally
```bash
# Terminal 1 - Backend
cd backend
uvicorn src.main:app --reload --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🤖 AI Chatbot Examples

### English
```
User: "Add a todo to buy groceries"
AI: "Successfully created your todo: buy groceries"

User: "Show me my todos"
AI: "You have 4 tasks total: 2 completed and 2 pending..."
```

### Urdu
```
User: "میرے ٹو ڈو دکھائیں"
AI: "آپ کے پاس کل 4 کام ہیں: 2 مکمل اور 2 زیر التواء..."
```

### Sindhi
```
User: "منهنجا ٽاسڪ ڏيکاريو"
AI: "توهان وٽ ڪل 4 ڪم آهن: 2 مڪمل ۽ 2 اڻ ٿيل..."
```

---

## 📊 Project Structure

```
hack-2ph-3/
├── backend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── auth.py
│   │   │   ├── todos.py
│   │   │   └── chat.py          # AI Chatbot
│   │   ├── agents/
│   │   │   ├── todo_agent.py    # AI Agent
│   │   │   └── language_detector.py
│   │   ├── models/
│   │   │   ├── user.py
│   │   │   ├── todo.py
│   │   │   ├── conversation.py
│   │   │   └── message.py
│   │   ├── services/
│   │   │   ├── conversation_service.py
│   │   │   └── message_service.py
│   │   └── tools/
│   │       └── todo_tools.py
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── chat.tsx         # Chat Page
│   │   │   └── dashboard-integrated.tsx
│   │   └── components/
│   │       └── Chat/            # Chat Components
│   └── package.json
└── README.md
```

---

## 🔒 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://...
SECRET_KEY=your_secret_key
GROQ_API_KEY=gsk_your_key_here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://your-backend.hf.space
```

---

## 📈 Hackathon Phases

- ✅ **Phase 1:** Python Console App
- ✅ **Phase 2:** Full-Stack Web App
- ✅ **Phase 3:** AI Chatbot Integration

---

## 👨‍💻 Author

**USAMA ARYAN**

Made with ❤️ using Next.js, FastAPI & Groq AI

---

## 🎉 Deployment

### Backend (Hugging Face Spaces)
```yaml
Platform: Hugging Face Spaces
SDK: Docker
Port: 7860
```

### Frontend (Vercel)
```yaml
Platform: Vercel
Framework: Next.js
Build: npm run build
```

---

**Happy Coding!** 🚀
