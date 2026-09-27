import axios from "axios";

const api = axios.create({
  // macOS AirPlay Receiver commonly occupies port 5000.
  // Override with VITE_API_URL if a different backend URL is needed.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/api",
});

// Automatically attach JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
