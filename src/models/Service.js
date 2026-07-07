const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    tagline: {
      type: String,
      required: [true, "Tagline is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    capabilities: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      required: [true, "Image URL is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", ServiceSchema);
