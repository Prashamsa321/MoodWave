import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  predictAudio,
  recommendSongs,
  smartPredict,
  runPopularity,
  runMood,
  runGenre,
  runCluster,
  runPca,
  savePrediction,
  getPredictionHistory,
} from "../controllers/prediction.controller.js";
import { getClusters } from "../services/mlService.js";

const router = express.Router();

// Individual model endpoints
router.post("/popularity", runPopularity);
router.post("/mood", runMood);
router.post("/genre", runGenre);
router.post("/cluster", runCluster);
router.post("/pca", runPca);

// Combined / legacy
router.post("/predict", predictAudio);
router.post("/recommend", recommendSongs);
router.post("/smart", smartPredict);

// Clusters
router.get("/clusters", async (req, res) => {
  try {
    const data = await getClusters();
    res.status(200).json({ success: true, ...data });
  } catch (error) {
    console.error("Clusters error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});



// Protected
router.post("/", auth, savePrediction);
router.get("/", auth, getPredictionHistory);

export default router;