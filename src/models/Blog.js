const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
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
    excerpt: {
      type: String,
      required: [true, "Excerpt is required"],
    },
    content: {
      type: [String],
      required: [true, "Content paragraphs are required"],
    },
    coverImage: {
      type: String,
      required: [true, "Cover image is required"],
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      default: "Editorial Team",
    },
    date: {
      type: String,
      required: [true, "Date is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", BlogSchema);
