const mongoose = require("mongoose");

const TimelineEntrySchema = new mongoose.Schema({
  phase: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
});

const GalleryItemSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: { type: String, required: true },
});

const BeforeAfterSchema = new mongoose.Schema({
  beforeUrl: { type: String, required: true },
  afterUrl: { type: String, required: true },
  label: { type: String, required: true },
});

const ProjectSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
    },
    citySlug: {
      type: String,
      required: [true, "City slug is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Project type is required"],
      enum: ["Residential", "Commercial", "Industrial", "Infrastructure"],
    },
    status: {
      type: String,
      required: [true, "Project status is required"],
      enum: ["completed", "ongoing"],
    },
    heroImage: {
      type: String,
      required: [true, "Hero image is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    scopeOfWork: {
      type: String,
      default: "",
    },
    materials: {
      type: [String],
      default: [],
    },
    sqft: {
      type: Number,
      required: [true, "Square footage is required"],
    },
    units: {
      type: Number,
    },
    client: {
      type: String,
      default: "",
    },
    year: {
      type: String,
      required: [true, "Year is required"],
    },
    gallery: {
      type: [GalleryItemSchema],
      default: [],
    },
    beforeAfter: {
      type: [BeforeAfterSchema],
      default: [],
    },
    timeline: {
      type: [TimelineEntrySchema],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);
