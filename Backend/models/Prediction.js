import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Which model produced this prediction
    modelType: {
      type: String,
      enum: ["mood", "genre", "popularity", "cluster", "pca", "similar"],
      required: true,
    },

    // Free-form input features (subset of 13 audio features)
    inputFeatures: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Free-form model output (structure varies by model)
    output: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    // Legacy fields (kept for backward compatibility)
    songName: {
      type: String,
      default: "",
      trim: true,
    },
    predictedMood: {
      type: String,
      default: "",
    },
    confidence: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Prediction", predictionSchema);