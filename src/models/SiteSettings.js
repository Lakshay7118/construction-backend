const mongoose = require("mongoose");

const SiteSettingsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      default: "Kalpataru Constructions",
    },
    tagline: {
      type: String,
      default: "Building What Lasts",
    },
    supportEmail: {
      type: String,
      default: "hello@kalpataruconstructions.in",
    },
    supportPhone: {
      type: String,
      default: "+91 22 4021 5566",
    },
    address: {
      type: String,
      default: "12th Floor, Blueprint House, Bandra Kurla Complex, Mumbai 400051",
    },
    instagram: {
      type: String,
      default: "",
    },
    linkedin: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SiteSettings", SiteSettingsSchema);
