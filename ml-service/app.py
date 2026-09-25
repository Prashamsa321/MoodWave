"""
MoodWave ML Service
FastAPI server that loads trained .joblib models and exposes prediction endpoints.
"""
from pathlib import Path
import json

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# ------------------------------------------------------------------
# Paths
# ------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parent.parent / "moodwave-ml"
MODELS_DIR = BASE_DIR / "models"
ARTIFACTS_DIR = BASE_DIR / "artifacts" / "dashboard"

# ------------------------------------------------------------------
# Load models
# ------------------------------------------------------------------
print("Loading models from:", MODELS_DIR)

popularity_model = joblib.load(MODELS_DIR / "popularity_regression.joblib")
mood_model = joblib.load(MODELS_DIR / "mood_classifier.joblib")
genre_model = joblib.load(MODELS_DIR / "genre_classifier.joblib")
kmeans_bundle = joblib.load(MODELS_DIR / "emotion_kmeans.joblib")
pca_bundle = joblib.load(MODELS_DIR / "emotion_pca.joblib")
similarity_bundle = joblib.load(MODELS_DIR / "similar_songs_nn.joblib")

print("Models loaded ✅")

# ------------------------------------------------------------------
# Load manifest
# ------------------------------------------------------------------
with open(ARTIFACTS_DIR / "model_manifest.json") as f:
    manifest = json.load(f)

POPULARITY_FEATURES = manifest["models"]["popularity"]["input_features"]
MOOD_FEATURES = manifest["models"]["mood"]["input_features"]
GENRE_FEATURES = manifest["models"]["genre"]["input_features"]

# ------------------------------------------------------------------
# Load tables
# ------------------------------------------------------------------
def _load_table(name: str) -> pd.DataFrame:
    parquet_path = ARTIFACTS_DIR / f"{name}.parquet"
    csv_path = ARTIFACTS_DIR / f"{name}.csv.gz"
    if parquet_path.exists():
        return pd.read_parquet(parquet_path)
    return pd.read_csv(csv_path)

similarity_catalog = _load_table("similarity_catalog")
yearly_mood_trends = _load_table("yearly_mood_trends")
genre_profiles = _load_table("genre_profiles")
cluster_points = _load_table("cluster_points")
track_catalog = _load_table("track_catalog")

with open(ARTIFACTS_DIR / "cluster_profiles.json") as f:
    cluster_profiles_data = json.load(f)

with open(ARTIFACTS_DIR / "mood_definition.json") as f:
    mood_definition = json.load(f)

print("Dashboard tables loaded ✅")

# ------------------------------------------------------------------
# FastAPI app
# ------------------------------------------------------------------
app = FastAPI(title="MoodWave ML Service", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ------------------------------------------------------------------
# Request schemas
# ------------------------------------------------------------------
class AudioFeatures(BaseModel):
    """Full 13-feature set — used by popularity, genre, predict/all."""
    danceability: float = Field(..., ge=0, le=1)
    energy: float = Field(..., ge=0, le=1)
    key: int = Field(..., ge=0, le=11)
    loudness: float
    mode: int = Field(..., ge=0, le=1)
    speechiness: float = Field(..., ge=0, le=1)
    acousticness: float = Field(..., ge=0, le=1)
    instrumentalness: float = Field(..., ge=0, le=1)
    liveness: float = Field(..., ge=0, le=1)
    valence: float = Field(..., ge=0, le=1)
    tempo: float = Field(..., gt=0)
    duration_ms: int = Field(..., gt=0)
    time_signature: int = Field(..., ge=0)

    def to_dict(self):
        return self.model_dump()


class MoodFeatures(BaseModel):
    """11-feature set — mood classifier excludes energy + valence."""
    danceability: float = Field(..., ge=0, le=1)
    key: int = Field(..., ge=0, le=11)
    loudness: float
    mode: int = Field(..., ge=0, le=1)
    speechiness: float = Field(..., ge=0, le=1)
    acousticness: float = Field(..., ge=0, le=1)
    instrumentalness: float = Field(..., ge=0, le=1)
    liveness: float = Field(..., ge=0, le=1)
    tempo: float = Field(..., gt=0)
    duration_ms: int = Field(..., gt=0)
    time_signature: int = Field(..., ge=0)

    def to_dict(self):
        return self.model_dump()


class ContinuousFeatures(BaseModel):
    """10 continuous features — used by KMeans, PCA, Similarity."""
    danceability: float = Field(..., ge=0, le=1)
    energy: float = Field(..., ge=0, le=1)
    loudness: float
    speechiness: float = Field(..., ge=0, le=1)
    acousticness: float = Field(..., ge=0, le=1)
    instrumentalness: float = Field(..., ge=0, le=1)
    liveness: float = Field(..., ge=0, le=1)
    valence: float = Field(..., ge=0, le=1)
    tempo: float = Field(..., gt=0)
    duration_ms: int = Field(..., gt=0)

    def to_dict(self):
        return self.model_dump()


class RecommendRequest(BaseModel):
    energy: float = Field(..., ge=0, le=1)
    valence: float = Field(..., ge=0, le=1)
    limit: int = Field(default=10, ge=1, le=50)


class SmartPredictRequest(BaseModel):
    energy: float = Field(..., ge=0, le=1)
    valence: float = Field(..., ge=0, le=1)
    limit: int = Field(default=10, ge=1, le=50)


# ------------------------------------------------------------------
# Quadrant averages + helpers
# ------------------------------------------------------------------
QUADRANT_AVERAGES = {
    "Euphoric":    {"danceability": 0.72, "energy": 0.75, "key": 5, "loudness": -6,  "mode": 1, "speechiness": 0.08, "acousticness": 0.20, "instrumentalness": 0.02, "liveness": 0.16, "valence": 0.70, "tempo": 121, "duration_ms": 210000, "time_signature": 4},
    "Peaceful":    {"danceability": 0.55, "energy": 0.35, "key": 5, "loudness": -12, "mode": 1, "speechiness": 0.05, "acousticness": 0.65, "instrumentalness": 0.15, "liveness": 0.14, "valence": 0.65, "tempo": 110, "duration_ms": 200000, "time_signature": 4},
    "Aggressive":  {"danceability": 0.50, "energy": 0.85, "key": 5, "loudness": -5,  "mode": 0, "speechiness": 0.10, "acousticness": 0.08, "instrumentalness": 0.20, "liveness": 0.20, "valence": 0.30, "tempo": 140, "duration_ms": 240000, "time_signature": 4},
    "Melancholic": {"danceability": 0.45, "energy": 0.30, "key": 5, "loudness": -14, "mode": 0, "speechiness": 0.04, "acousticness": 0.60, "instrumentalness": 0.10, "liveness": 0.15, "valence": 0.25, "tempo": 100, "duration_ms": 220000, "time_signature": 4},
}


def _quadrant_from_ev(energy: float, valence: float) -> str:
    if valence >= 0.5 and energy >= 0.5:
        return "Euphoric"
    if valence >= 0.5 and energy < 0.5:
        return "Peaceful"
    if valence < 0.5 and energy >= 0.5:
        return "Aggressive"
    return "Melancholic"


def _clean_records(df: pd.DataFrame) -> list:
    """Convert df to JSON-safe records (NaN/Inf -> None)."""
    df = df.copy()
    df = df.replace([np.inf, -np.inf], np.nan)
    records = df.to_dict(orient="records")
    for rec in records:
        for k, v in rec.items():
            if isinstance(v, float) and (np.isnan(v) or np.isinf(v)):
                rec[k] = None
            elif pd.isna(v):
                rec[k] = None
    return records


# ------------------------------------------------------------------
# Health
# ------------------------------------------------------------------
@app.get("/health")
def health():
    return {"status": "ok", "service": "moodwave-ml"}


# ------------------------------------------------------------------
# Model 1 — Popularity (13 features)
# ------------------------------------------------------------------
@app.post("/predict/popularity")
def predict_popularity(f: AudioFeatures):
    df = pd.DataFrame([f.to_dict()])[POPULARITY_FEATURES]
    score = float(popularity_model.predict(df)[0])
    score = max(0.0, min(100.0, score))
    return {"popularity": round(score, 2)}


# ------------------------------------------------------------------
# Model 2 — Mood (11 features, NO energy/valence)
# ------------------------------------------------------------------
@app.post("/predict/mood")
def predict_mood(f: MoodFeatures):
    df = pd.DataFrame([f.to_dict()])[MOOD_FEATURES]
    label = mood_model.predict(df)[0]
    probs = mood_model.predict_proba(df)[0]
    classes = mood_model.classes_
    return {
        "mood": str(label),
        "probabilities": {str(c): float(p) for c, p in zip(classes, probs)},
    }


# ------------------------------------------------------------------
# Model 3 — Genre (13 features)
# ------------------------------------------------------------------
@app.post("/predict/genre")
def predict_genre(f: AudioFeatures):
    df = pd.DataFrame([f.to_dict()])[GENRE_FEATURES]
    probs = genre_model.predict_proba(df)[0]
    classes = genre_model.classes_
    top_idx = np.argsort(probs)[-3:][::-1]
    return {
        "top_genres": [
            {"genre": str(classes[i]), "probability": float(probs[i])}
            for i in top_idx
        ]
    }


# ------------------------------------------------------------------
# Model 4 — Cluster (10 continuous features)
# ------------------------------------------------------------------
@app.post("/predict/cluster")
def predict_cluster(f: ContinuousFeatures):
    df = pd.DataFrame([f.to_dict()])
    features = kmeans_bundle["features"]
    X = kmeans_bundle["scaler"].transform(df[features])
    cid = int(kmeans_bundle["model"].predict(X)[0])
    profile = next(
        (p for p in cluster_profiles_data if p["cluster_id"] == cid),
        None,
    )
    return {
        "cluster_id": cid,
        "description": profile["description"] if profile else "",
        "profile": profile,
    }


# ------------------------------------------------------------------
# Model 5 — PCA (10 continuous features)
# ------------------------------------------------------------------
@app.post("/project/pca")
def project_pca(f: ContinuousFeatures):
    df = pd.DataFrame([f.to_dict()])
    features = pca_bundle["features"]
    X = pca_bundle["scaler"].transform(df[features])
    coords = pca_bundle["model"].transform(X)[0]
    return {"pca_1": float(coords[0]), "pca_2": float(coords[1])}


# ------------------------------------------------------------------
# Model 6 — Similarity (10 continuous features)
# ------------------------------------------------------------------
@app.post("/predict/similar")
def predict_similar(f: ContinuousFeatures, n: int = 5):
    bundle = similarity_bundle
    features = bundle["features"]
    X = bundle["scaler"].transform(pd.DataFrame([f.to_dict()])[features])
    idx = bundle["model"].kneighbors(X, n_neighbors=n, return_distance=False)[0]
    tracks = _clean_records(similarity_catalog.iloc[idx])
    return {"tracks": tracks}


# ------------------------------------------------------------------
# Combined endpoints
# ------------------------------------------------------------------
@app.post("/predict/all")
def predict_all(f: AudioFeatures):
    """Returns mood + popularity + genre + cluster + PCA + similar songs."""
    df = pd.DataFrame([f.to_dict()])

    mood_label = mood_model.predict(df[MOOD_FEATURES])[0]
    mood_probs = mood_model.predict_proba(df[MOOD_FEATURES])[0]
    mood_classes = mood_model.classes_

    popularity_score = float(popularity_model.predict(df[POPULARITY_FEATURES])[0])
    popularity_score = max(0.0, min(100.0, popularity_score))

    genre_probs = genre_model.predict_proba(df[GENRE_FEATURES])[0]
    genre_classes = genre_model.classes_
    top_idx = np.argsort(genre_probs)[-3:][::-1]

    cluster_features = kmeans_bundle["features"]
    X_cluster = kmeans_bundle["scaler"].transform(df[cluster_features])
    cluster_id = int(kmeans_bundle["model"].predict(X_cluster)[0])

    pca_features = pca_bundle["features"]
    X_pca = pca_bundle["scaler"].transform(df[pca_features])
    pca_coords = pca_bundle["model"].transform(X_pca)[0]

    sim_features = similarity_bundle["features"]
    X_sim = similarity_bundle["scaler"].transform(df[sim_features])
    sim_idx = similarity_bundle["model"].kneighbors(
        X_sim, n_neighbors=5, return_distance=False
    )[0]
    similar_tracks = _clean_records(similarity_catalog.iloc[sim_idx])

    return {
        "mood": str(mood_label),
        "mood_probabilities": {str(c): float(p) for c, p in zip(mood_classes, mood_probs)},
        "popularity": round(popularity_score, 2),
        "top_genres": [
            {"genre": str(genre_classes[i]), "probability": float(genre_probs[i])}
            for i in top_idx
        ],
        "cluster_id": cluster_id,
        "pca": {"x": float(pca_coords[0]), "y": float(pca_coords[1])},
        "similar_songs": similar_tracks,
    }


# ------------------------------------------------------------------
# Recommendation by energy + valence
# ------------------------------------------------------------------
@app.post("/recommend")
def recommend(req: RecommendRequest):
    df = track_catalog
    d2 = (df["energy"] - req.energy) ** 2 + (df["valence"] - req.valence) ** 2
    nearest = df.assign(_d2=d2).nsmallest(req.limit, "_d2")
    nearest = nearest.assign(distance=nearest["_d2"].pow(0.5)).drop(columns=["_d2"])

    wanted = [
        "track_id", "track_name", "artist_name", "album_name",
        "primary_genre", "genres", "mood_label",
        "energy", "valence", "danceability", "tempo", "distance",
    ]
    cols = [c for c in wanted if c in nearest.columns]
    songs = _clean_records(nearest[cols])

    return {
        "query": {"energy": req.energy, "valence": req.valence},
        "mood": _quadrant_from_ev(req.energy, req.valence),
        "count": len(songs),
        "recommendations": songs,
    }


# ------------------------------------------------------------------
# Smart predict (energy + valence only → all models)
# ------------------------------------------------------------------
@app.post("/predict/smart")
def predict_smart(req: SmartPredictRequest):
    quadrant = _quadrant_from_ev(req.energy, req.valence)
    base = QUADRANT_AVERAGES[quadrant].copy()
    base["energy"] = req.energy
    base["valence"] = req.valence

    features = AudioFeatures(**base)
    df = pd.DataFrame([features.to_dict()])

    mood_label = mood_model.predict(df[MOOD_FEATURES])[0]
    mood_probs = mood_model.predict_proba(df[MOOD_FEATURES])[0]
    mood_classes = mood_model.classes_

    popularity_score = float(popularity_model.predict(df[POPULARITY_FEATURES])[0])
    popularity_score = max(0.0, min(100.0, popularity_score))

    genre_probs = genre_model.predict_proba(df[GENRE_FEATURES])[0]
    genre_classes = genre_model.classes_
    top_idx = np.argsort(genre_probs)[-3:][::-1]

    cluster_features = kmeans_bundle["features"]
    X_cluster = kmeans_bundle["scaler"].transform(df[cluster_features])
    cluster_id = int(kmeans_bundle["model"].predict(X_cluster)[0])

    pca_features = pca_bundle["features"]
    X_pca = pca_bundle["scaler"].transform(df[pca_features])
    pca_coords = pca_bundle["model"].transform(X_pca)[0]

    d2 = (track_catalog["energy"] - req.energy) ** 2 + (track_catalog["valence"] - req.valence) ** 2
    nearest = track_catalog.assign(_d2=d2).nsmallest(req.limit, "_d2")
    nearest = nearest.assign(distance=nearest["_d2"].pow(0.5)).drop(columns=["_d2"])
    wanted = [
        "track_id", "track_name", "artist_name", "primary_genre", "genres",
        "mood_label", "energy", "valence", "danceability", "tempo", "distance",
    ]
    cols = [c for c in wanted if c in nearest.columns]
    recommendations = _clean_records(nearest[cols])

    profile = next(
        (p for p in cluster_profiles_data if p["cluster_id"] == cluster_id),
        None,
    )

    return {
        "query": {"energy": req.energy, "valence": req.valence},
        "quadrant": quadrant,
        "mood": str(mood_label),
        "mood_probabilities": {str(c): float(p) for c, p in zip(mood_classes, mood_probs)},
        "popularity": round(popularity_score, 2),
        "top_genres": [
            {"genre": str(genre_classes[i]), "probability": float(genre_probs[i])}
            for i in top_idx
        ],
        "cluster_id": cluster_id,
        "cluster_profile": profile,
        "pca": {"x": float(pca_coords[0]), "y": float(pca_coords[1])},
        "recommendations": recommendations,
    }


# ------------------------------------------------------------------
# Analytical endpoints
# ------------------------------------------------------------------
@app.get("/timeline")
def timeline():
    return _clean_records(yearly_mood_trends)


@app.get("/genres")
def genres():
    return _clean_records(genre_profiles)


@app.get("/clusters")
def clusters():
    df = cluster_points.copy()
    if len(df) > 2000:
        df = df.sample(2000, random_state=42)
    return {
        "points": _clean_records(df),
        "profiles": cluster_profiles_data,
    }


@app.get("/mood-definition")
def mood_definition_route():
    return mood_definition