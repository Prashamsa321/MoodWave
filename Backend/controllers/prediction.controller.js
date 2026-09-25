import Prediction from "../models/Prediction.js";
import {
  predictAll,
  recommendByEnergyValence,
  predictSmart,
  predictPopularity,
  predictMood,
  predictGenre,
  predictCluster,
  predictPca,
} from "../services/mlService.js";

// ------------------------------------------------------------------
// Combined endpoints
// ------------------------------------------------------------------
export const predictAudio = async (req, res) => {
  try {
    const features = req.body;

    const required = [
      "danceability", "energy", "key", "loudness", "mode",
      "speechiness", "acousticness", "instrumentalness",
      "liveness", "valence", "tempo", "duration_ms", "time_signature",
    ];
    const missing = required.filter((k) => features[k] === undefined);
    if (missing.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing features: ${missing.join(", ")}`,
      });
    }

    const result = await predictAll(features);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("Predict error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recommendSongs = async (req, res) => {
  try {
    const { energy, valence, limit } = req.body;

    if (
      typeof energy !== "number" ||
      typeof valence !== "number" ||
      energy < 0 || energy > 1 ||
      valence < 0 || valence > 1
    ) {
      return res.status(400).json({
        success: false,
        message: "energy and valence must be numbers between 0 and 1",
      });
    }

    const safeLimit = Math.min(Math.max(Number(limit) || 10, 1), 50);
    const result = await recommendByEnergyValence(energy, valence, safeLimit);
    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("Recommend error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const smartPredict = async (req, res) => {
  try {
    const { energy, valence, limit } = req.body;

    if (
      typeof energy !== "number" ||
      typeof valence !== "number" ||
      energy < 0 || energy > 1 ||
      valence < 0 || valence > 1
    ) {
      return res.status(400).json({
        success: false,
        message: "energy and valence must be numbers between 0 and 1",
      });
    }

    const result = await predictSmart(
      energy,
      valence,
      Math.min(Number(limit) || 10, 50)
    );

    res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("smartPredict error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------------------------------------------------------
// Individual model endpoints
// ------------------------------------------------------------------
export const runPopularity = async (req, res) => {
  try {
    const data = await predictPopularity(req.body);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Popularity error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const runMood = async (req, res) => {
  try {
    const data = await predictMood(req.body);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Mood error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const runGenre = async (req, res) => {
  try {
    const data = await predictGenre(req.body);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Genre error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const runCluster = async (req, res) => {
  try {
    const data = await predictCluster(req.body);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Cluster error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const runPca = async (req, res) => {
  try {
    const data = await predictPca(req.body);
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("PCA error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ------------------------------------------------------------------
// Save / history (protected)
// ------------------------------------------------------------------
export const savePrediction = async (req, res) => {
  try {
    const { modelType, inputFeatures, output, songName, predictedMood, confidence } = req.body;

    if (!modelType) {
      return res.status(400).json({
        success: false,
        message: "modelType is required",
      });
    }

    const prediction = await Prediction.create({
      user: req.user._id,
      modelType,
      inputFeatures: inputFeatures || {},
      output: output || {},
      // legacy optional fields
      songName: songName || "",
      predictedMood: predictedMood || output?.mood || "",
      confidence: confidence ?? 0,
    });

    res.status(201).json({
      success: true,
      message: "Prediction saved",
      prediction,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPredictionHistory = async (req, res) => {
  try {
    const predictions = await Prediction.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: predictions.length,
      predictions,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};