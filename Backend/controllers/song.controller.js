import Song from "../models/Song.js";
import { searchCatalogSongs } from "../services/mlService.js";

export const createSong = async (req, res) => {
  try {
    const song = await Song.create(req.body);

    res.status(201).json({
      success: true,
      message: "Song added successfully",
      song,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search the canonical ML track catalog. This powers the Win98 type-ahead
// selector in Find Similar Songs and does not depend on MongoDB being seeded.
export const searchSongs = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    if (!query) {
      return res.status(200).json({
        success: true,
        query: "",
        count: 0,
        songs: [],
      });
    }

    const safeLimit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 20);
    const requestedMode = String(req.query.mode || "2d").toLowerCase();
    const mode = requestedMode === "10d" ? "10d" : "2d";

    const result = await searchCatalogSongs(query, safeLimit, mode);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    console.error("Song catalog search error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.response?.data?.detail || error.message,
    });
  }
};


// Recommend songs based on energy and valence
export const recommendSongs = async (req, res) => {
  try {
    const energy = Number(req.query.energy);
    const valence = Number(req.query.valence);

    // Validate input
    if (
      isNaN(energy) ||
      isNaN(valence) ||
      energy < 0 ||
      energy > 1 ||
      valence < 0 ||
      valence > 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Energy and valence must be between 0 and 1",
      });
    }

    // Get songs from database
    const songs = await Song.find({
      energy: { $exists: true },
      valence: { $exists: true },
    });

    // Calculate distance between user's mood and every song
    const recommendedSongs = songs
      .map((song) => {
        const energyDifference = song.energy - energy;
        const valenceDifference = song.valence - valence;

        // Euclidean distance
        const distance = Math.sqrt(
          Math.pow(energyDifference, 2) +
          Math.pow(valenceDifference, 2)
        );

        return {
          ...song.toObject(),
          distance,
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 20);

    res.status(200).json({
      success: true,
      count: recommendedSongs.length,
      energy,
      valence,
      songs: recommendedSongs,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};