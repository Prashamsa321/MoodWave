import express from "express";

import {
  createSong,
  recommendSongs,
  searchSongs,
} from "../controllers/song.controller.js";

import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", auth, createSong);

// Search the ML catalog for type-ahead song suggestions
router.get("/search", searchSongs);

// Recommendation API
router.get("/recommend", recommendSongs);

export default router;