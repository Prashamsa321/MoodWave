import axios from "axios";

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:8000";

const mlClient = axios.create({
  baseURL: ML_SERVICE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ------------------------------------------------------------------
// Combined / smart predictions
// ------------------------------------------------------------------
export const predictAll = async (features) => {
  const { data } = await mlClient.post("/predict/all", features);
  return data;
};

export const predictSmart = async (energy, valence, limit = 10) => {
  const { data } = await mlClient.post("/predict/smart", {
    energy,
    valence,
    limit,
  });
  return data;
};

// ------------------------------------------------------------------
// Individual model endpoints
// ------------------------------------------------------------------
export const predictPopularity = async (features) => {
  const { data } = await mlClient.post("/predict/popularity", features);
  return data;
};

export const predictMood = async (features) => {
  const { data } = await mlClient.post("/predict/mood", features);
  return data;
};

export const predictGenre = async (features) => {
  const { data } = await mlClient.post("/predict/genre", features);
  return data;
};

export const predictCluster = async (features) => {
  const { data } = await mlClient.post("/predict/cluster", features);
  return data;
};

export const predictPca = async (features) => {
  const { data } = await mlClient.post("/project/pca", features);
  return data;
};

// ------------------------------------------------------------------
// Similarity
// ------------------------------------------------------------------
export const predictSimilar = async (features, n = 5) => {
  const { data } = await mlClient.post(`/predict/similar?n=${n}`, features);
  return data;
};

export const recommendByEnergyValence = async (energy, valence, limit = 10) => {
  const { data } = await mlClient.post("/recommend", {
    energy,
    valence,
    limit,
  });
  return data;
};

// ------------------------------------------------------------------
// Analytical / data endpoints
// ------------------------------------------------------------------
export const getTimeline = async () => {
  const { data } = await mlClient.get("/timeline");
  return data;
};

export const getGenres = async () => {
  const { data } = await mlClient.get("/genres");
  return data;
};

export const getClusters = async () => {
  const { data } = await mlClient.get("/clusters");
  return data;
};