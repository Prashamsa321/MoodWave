# MoodWave — Run Instructions

Three servers must run simultaneously.

## Terminal 1 — ML Service (Python, port 8000)
## IN CMD
cd /d C:\dev\Moodwave\ml-service
python -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn app:app --reload --port 8000

## Terminal 2 — Backend (Node.js, port 5000)
## In vs code terminal
cd /d C:\dev\Moodwave\Backend
npm install
npm run dev

## Terminal 3 — Frontend (React, port 5173)
## In vs code terminal
cd /d C:\dev\Moodwave\Frontend
npm install
npm run dev