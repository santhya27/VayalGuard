
const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },
    village: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    district: {
      type: String,
      trim: true,
      default: "",
    },
    crop: {
      type: String,
      required: true,
      trim: true,
    },
    sowingDate: {
      type: Date,
      default: null,
    },
    growthStage: {
      type: String,
      default: "",
    },
    irrigation: {
      type: String,
      default: "",
    },
    harvestDate: {
      type: Date,
      default: null,
    },
    language: {
      type: String,
      enum: ["en", "ta"],
      default: "en",
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Farmer ||
  mongoose.model("Farmer", farmerSchema);
