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

// job application review routes (admin) must be registered before /:slug
router.get("/applications/all", protect, authorize("Super Admin", "Editor"), getApplications);
router.put("/applications/:id/status", protect, authorize("Super Admin", "Editor"), updateApplicationStatus);

// career posts routes
router.route("/")
  .get(getCareers)
  .post(protect, authorize("Super Admin", "Editor"), createCareer);

router.route("/:slug")
  .get(getCareerBySlug)
  .put(protect, authorize("Super Admin", "Editor"), updateCareer)
  .delete(protect, authorize("Super Admin"), deleteCareer);

// job application submission route
router.post("/:slug/apply", createApplication);

module.exports = router;
