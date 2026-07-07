const mongoose = require("mongoose");

const AwardSchema = new mongoose.Schema(
  {
    year: {
      type: String,
      required: [true, "Year is required"],
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, "Issuer is required"],
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Award", AwardSchema);
