# 🎵 MoodWave

Music emotion analysis powered by 6 machine learning models. 
A full-stack web app that classifies, predicts, and visualizes how music makes us feel.

---

## 📖 What Is This?

MoodWave is a data science and web development project built for a 6th semester BCA.
It trains 6 machine learning models on ~115,000 Spotify tracks and serves them through an interactive web app.

Users can:
- Drag sliders and get live predictions from any model
- Find which of 4 mood quadrants a song belongs to
- Discover the 10 closest songs by energy and valence
- Visualize 5 emotional clusters on a 2D map
- Save and revisit their prediction history

---

## 🏗️ Architecture

Frontend (React) -> Backend (Express) -> ML Service (FastAPI) -> Trained Models

- Frontend (port 5173): Retro-themed UI
- Backend (port 5000): API + MongoDB + Auth
- ML Service (port 8000): Loads .joblib models, serves predictions
- moodwave-ml: Static folder with trained models and data

Why a separate Python service? The ML models were trained in scikit-learn and saved as .joblib, which Node.js cannot read.
FastAPI loads them and exposes predictions as REST endpoints.

---

## 🧠 The 6 Models

| # | Model | Algorithm | Task | Metric |
|---|---|---|---|---|
| 1 | Popularity Predictor | Linear Regression | Score 0-100 | R2 = -0.014 |
| 2 | Mood Detector | Decision Tree | 4 mood quadrants | 65.2% accuracy |
| 3 | Genre Classifier | Random Forest | 112 genres | 34.4% acc, 52.8% top-3 |
| 4 | Emotion Grouping | K-Means | 5 clusters | Silhouette = 0.16 |
| 5 | Emotion Map | PCA | 2D projection | 43.9% variance |
| 6 | Find Similar Songs | Nearest Neighbors | 10 closest tracks | - |

Key insight: The Mood Detector uses 11 features but deliberately excludes valence and energy - 
the very features used to define mood quadrants. 
This makes the task a genuine test: can we infer mood without seeing the defining variables?

---

## 🛠️ Tech Stack

Frontend: React 19, Vite 8, Tailwind CSS, Recharts, React Router 7, Axios

Backend: Node.js 20, Express 5, MongoDB, Mongoose, JWT, bcryptjs

ML Service: Python 3.12, FastAPI, scikit-learn, pandas, numpy, pyarrow, joblib

Data Science: Jupyter Notebook, matplotlib, seaborn, Parquet

---

## 🚀 Getting Started

Prerequisites:
- Python 3.12+
- Node.js 20+
- MongoDB running on localhost:27017

Three servers must run simultaneously. See SETUP.md for details.

Terminal 1 - ML Service:
    cd ml-service
    python -m venv .venv
    .venv\Scripts\activate.bat
    pip install -r requirements.txt
    uvicorn app:app --reload --port 8000

Terminal 2 - Backend:
    cd Backend
    npm install
    npm run dev

Terminal 3 - Frontend:
    cd Frontend
    npm install
    npm run dev

Open http://localhost:5173/

---

## 📁 Project Structure

    MoodWave/
    |-- Backend/          Express API (port 5000)
    |-- Frontend/         React UI (port 5173)
    |-- ml-service/       FastAPI (port 8000)
    |-- moodwave-ml/      Trained ML artifacts
    |-- SETUP.md          Detailed setup guide
    |-- README.md         This file

---

## 🔌 API Endpoints

ML Service (localhost:8000):
- GET  /health
- POST /predict/popularity
- POST /predict/mood
- POST /predict/genre
- POST /predict/cluster
- POST /project/pca
- POST /predict/similar
- POST /predict/all
- POST /recommend
- GET  /clusters
- GET  /timeline

Backend (localhost:5000):
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/user/profile (protected)
- PUT  /api/user/update (protected)
- POST /api/predictions (protected, save)
- GET  /api/predictions (protected, history)

---

## 🎨 UI Design

MoodWave uses a retro Y2K desktop-inspired theme with purple sparkle background, fake OS windows, title bars, 
menu bars, and an icon-based sidebar.

---

## 📊 Data Source

- Spotify Tracks Dataset (Kaggle) - ~600,000 tracks
- Country chart data - global, top 50 per country
- Historical dataset - 2000 to 2023
- After cleaning: 115,657 canonical tracks across 114 genres

---


##  Acknowledgements

- Russell Circumplex Model of Affect (1980) - theoretical backbone for mood classification
- Mauch et al. (2015) - inspiration for historical trend analysis
- Kaggle - Spotify Tracks Dataset
- scikit-learn, FastAPI, React - the tools that made this possible

---

## 📄 License

This project is for academic use only as part of BCA curriculum requirements.
