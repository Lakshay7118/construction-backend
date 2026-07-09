const express = require("express");
const router = express.Router();
const {
  getCareers,
  getCareerBySlug,
  createCareer,
  updateCareer,
  deleteCareer,
  createApplication,
  getApplications,
  updateApplicationStatus,
} = require("../controllers/careerController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// ── Application review routes (MUST be before /:slug to avoid conflict) ──
router.get(
  "/applications/all",
  protect,
  authorize("Super Admin", "Editor"),
  getApplications
);
router.put(
  "/applications/:id/status",
  protect,
  authorize("Super Admin", "Editor"),
  updateApplicationStatus
);

// ── Career post CRUD ──
router
  .route("/")
  .get(getCareers)
  .post(protect, authorize("Super Admin", "Editor"), createCareer);

router
  .route("/:slug")
  .get(getCareerBySlug)
  .put(protect, authorize("Super Admin", "Editor"), updateCareer)
  .delete(protect, authorize("Super Admin"), deleteCareer);

// ── Public application submission — accepts multipart/form-data with optional "resume" file ──
// Multer handles up to 10MB PDF/DOCX; the controller then streams it to Cloudinary
router.post("/:slug/apply", upload.single("resume"), createApplication);

module.exports = router;
