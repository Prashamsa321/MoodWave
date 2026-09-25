import mongoose from "mongoose";

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    artist: {
      type: String,
      required: true,
      trim: true,
    },

    genre: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
    },

    popularity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    energy: {
      type: Number,
      min: 0,
      max: 1,
    },

    valence: {
      type: Number,
      min: 0,
      max: 1,
    },

    danceability: {
      type: Number,
      min: 0,
      max: 1,
    },

    tempo: {
      type: Number,
    },

    loudness: {
      type: Number,
    },

    speechiness: {
      type: Number,
      min: 0,
      max: 1,
    },

    acousticness: {
      type: Number,
      min: 0,
      max: 1,
    },

    instrumentalness: {
      type: Number,
      min: 0,
      max: 1,
    },

    liveness: {
      type: Number,
      min: 0,
      max: 1,
    },

    duration_ms: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Song", songSchema);