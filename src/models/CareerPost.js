const mongoose = require("mongoose");

const CareerPostSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Job type is required"], // e.g. Full-time, Contract, etc.
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CareerPost", CareerPostSchema);
