# Monday Business Intelligence Dashboard

A custom data visualization and analysis tool for Monday.com boards. 

Developed by **VIGNESH VH**

---

## 🚀 Overview
This project is a dashboard built to help teams quickly get answers from their Monday.com boards. It connects directly to your boards and uses a language model to analyze data and provide summaries.

---

## 🛠️ Project Structure
- `/` (Root): Backend logic (Python, FastAPI)
- `/monday-bi-executive`: Frontend dashboard (React, Vite, Tailwind CSS)

---

## 🏃 Setup

### 1. Variables
Create a `.env` file in the root directory and add your keys:
```env
MONDAY_API_KEY=your_api_key
DEALS_BOARD_ID=your_deals_id
WORK_ORDERS_BOARD_ID=your_work_orders_id
GEMINI_API_KEY=your_gemini_key
```

### 2. Run the App
**Start the Backend:**
```bash
pip install fastapi uvicorn google-genai requests python-dotenv
uvicorn main:app --reload
```

**Start the Frontend:**
```bash
cd monday-bi-executive
npm install
npm run dev
```

---

## ✨ Main Actions
- **Live Connection**: Fetches data directly from your boards whenever you ask a question.
- **Easy Config**: You can update board IDs and keys directly in the UI.
- **Conversational**: It remembers your previous questions so you can ask follow-ups.
- **Trace View**: Shows exactly what data was pulled and which columns were found.

---
## Developer Contact
**Vignesh Hariraj**
- 📞 Phone: +91 9487768253
- 📧 LinkedIn: [vigneshhariraj](https://www.linkedin.com/in/vigneshhariraj/)
- 💻 GitHub: [Vigneshhariraj](https://github.com/Vigneshhariraj)
- 🌐 Portfolio: [vigneshhariraj.netlify.app](https://vigneshhariraj.netlify.app/)
