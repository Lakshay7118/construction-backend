const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const connectDB = require("./src/config/db");

// Import route files
const authRoutes = require("./src/routes/authRoutes");
const cityRoutes = require("./src/routes/cityRoutes");
const projectRoutes = require("./src/routes/projectRoutes");
const serviceRoutes = require("./src/routes/serviceRoutes");
const blogRoutes = require("./src/routes/blogRoutes");
const testimonialRoutes = require("./src/routes/testimonialRoutes");
const careerRoutes = require("./src/routes/careerRoutes");
const awardRoutes = require("./src/routes/awardRoutes");
const inquiryRoutes = require("./src/routes/inquiryRoutes");
const settingsRoutes = require("./src/routes/settingsRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: "*", // Adjust origins as needed for security
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root verification route
app.get("/", (req, res) => {
  res.json({ message: "Kalpataru Constructions API is running..." });
});

// Map routes
app.use("/api/auth", authRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/careers", careerRoutes); // handles careers + applications
app.use("/api/awards", awardRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/upload", uploadRoutes);

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, error: "Resource not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler Catch-All:", err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);

  // ── Cloudinary credential check ──
  const cloudName  = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey     = process.env.CLOUDINARY_API_KEY;
  const apiSecret  = process.env.CLOUDINARY_API_SECRET;

  const missingOrWrong = [];
  if (!cloudName)  missingOrWrong.push("CLOUDINARY_CLOUD_NAME");
  if (!apiKey || apiKey === cloudName) missingOrWrong.push("CLOUDINARY_API_KEY (wrong — same as cloud name!)");
  if (!apiSecret)  missingOrWrong.push("CLOUDINARY_API_SECRET");

  if (missingOrWrong.length > 0) {
    console.warn("⚠️  Cloudinary NOT configured correctly. Missing / wrong values:");
    missingOrWrong.forEach((k) => console.warn("   •", k));
    console.warn("   Resume uploads will fail. Fix your .env file and restart.");
  } else {
    console.log(`✅  Cloudinary configured — cloud: ${cloudName}`);
  }
});
