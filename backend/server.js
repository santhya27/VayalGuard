
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Farmer = require("./models/Farmer");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// 1. Check whether the backend is running
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "VayalGuard backend is running!",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// 2. Save a new farmer profile
app.post("/api/farmers", async (req, res) => {
  try {
    const {
      name,
      village,
      state,
      district,
      crop,
      sowingDate,
      growthStage,
      irrigation,
      harvestDate,
      language,
    } = req.body;

    if (
      !village?.trim() ||
      !state?.trim() ||
      !crop?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Village, state, and crop are required.",
      });
    }

    const farmer = await Farmer.create({
      name,
      village: village.trim(),
      state: state.trim(),
      district,
      crop: crop.trim(),
      sowingDate: sowingDate || null,
      growthStage,
      irrigation,
      harvestDate: harvestDate || null,
      language,
    });

    res.status(201).json({
      success: true,
      message: "Farmer profile saved successfully.",
      farmer,
    });
  } catch (error) {
    console.error("Save farmer error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not save farmer profile.",
    });
  }
});

// 3. Get all farmer profiles (development/testing)
app.get("/api/farmers", async (req, res) => {
  try {
    const farmers = await Farmer.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: farmers.length,
      farmers,
    });
  } catch (error) {
    console.error("Get farmers error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not retrieve farmer profiles.",
    });
  }
});

// 4. Get one farmer profile by its MongoDB ID
app.get("/api/farmers/:id", async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid farmer ID.",
      });
    }

    const farmer = await Farmer.findById(req.params.id);

    if (!farmer) {
      return res.status(404).json({
        success: false,
        message: "Farmer profile not found.",
      });
    }

    res.json({
      success: true,
      farmer,
    });
  } catch (error) {
    console.error("Get farmer error:", error.message);

    res.status(500).json({
      success: false,
      message: "Could not retrieve farmer profile.",
    });
  }
});

// Start server only after MongoDB connects
async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from the .env file.");
    }

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(
        `VayalGuard backend running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error("Backend startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
