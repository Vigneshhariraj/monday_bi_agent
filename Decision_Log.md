# Project Decision Log
**Developer:** VIGNESH VH

This log explains the technical choices I made while building the Monday BI tool.

---

## 1. Tech Stack Selection
I decided to use **FastAPI** for the backend because it is fast and handles API requests efficiently. For the frontend, I chose **React with Vite** and **Tailwind CSS**. This combination allowed me to build a responsive, high-performance dashboard that feels modern and professional.

---

## 2. Handling Data Inconsistencies
The data provided for the assignment had inconsistent column names (like different labels for revenue or company). To handle this, I built a detection system in the backend that samples the data to find the right columns automatically. This makes the dashboard more flexible if the board setup changes.

---

## 3. Real-Time Data Fetching
Following the requirements, I chose not to cache any data. Every time a user asks a question, the app makes a live call to Monday.com. This ensures that the answers are always based on the most up-to-date information.

---

## 4. UI/UX Design
I went with a **fixed-viewport layout** for the dashboard. Instead of a scrolling chat page, I wanted something that looks like an executive command center. 
*   **Left Column:** All configurations and the question area are always visible.
*   **Right Column:** The answer and the technical details are displayed side-by-side. 
This layout makes it easier to use the tool without losing track of your configuration.

---

## 5. Adding Context to Converations
To make the tool easier to use, I added a way for it to remember previous questions. This allows the user to ask follow-up questions without having to repeat their previous context every time.

---
**Summary:** The project was built with a focus on ease of use, data accuracy, and professional design.
