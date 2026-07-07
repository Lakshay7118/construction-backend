const mongoose = require("mongoose");

const CitySchema = new mongoose.Schema(
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
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    totalSqft: {
      type: Number,
      required: [true, "Total square feet (in lakh) is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("City", CitySchema);
