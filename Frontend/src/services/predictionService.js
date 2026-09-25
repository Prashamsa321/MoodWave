import api from "./api";

export const getPredictionHistory = async () => {
  const response = await api.get("/predictions");
  return response.data;
};

export const savePrediction = async (data) => {
  const response = await api.post("/predictions", data);
  return response.data;
};

// NEW: Call the ML prediction endpoint
export const predictAudio = async (features) => {
  const response = await api.post("/predictions/predict", features);
  return response.data;
};