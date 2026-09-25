import express from "express";

import {
  createSong,
  recommendSongs
} from "../controllers/song.controller.js";

import auth from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", auth, createSong);

// Recommendation API
router.get("/recommend", recommendSongs);

export default router;