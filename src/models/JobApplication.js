const mongoose = require("mongoose");

const JobApplicationSchema = new mongoose.Schema(
  {
    careerSlug: {
      type: String,
      required: [true, "Career slug is required"],
    },
    roleTitle: {
      type: String,
      required: [true, "Role title is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone is required"],
      trim: true,
    },
    resumeFileName: {
      type: String,
      required: [true, "Resume filename is required"],
    },
    resumeUrl: {
      type: String,
    },
    coverNote: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["new", "shortlisted", "rejected", "hired"],
      default: "new",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("JobApplication", JobApplicationSchema);
