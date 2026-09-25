import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import songRoutes from "./routes/song.routes.js";
import predictionRoutes from "./routes/prediction.routes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Try connecting to MongoDB, but don't crash the server if it fails
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection warning:", err.message));

// Start the server regardless of DB state
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/songs", songRoutes);
app.use("/api/predictions", predictionRoutes);

app.get("/", (req, res) => {
  res.send("Moodwave Backend Running ");
});