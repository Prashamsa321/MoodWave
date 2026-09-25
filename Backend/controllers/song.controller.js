import Song from "../models/Song.js";

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
      .slice(0, 10);

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