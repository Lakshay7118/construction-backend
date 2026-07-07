const express = require("express");
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require("../controllers/testimonialController");
const { protect, authorize } = require("../middleware/auth");

router.route("/")
  .get(getTestimonials)
  .post(protect, authorize("Super Admin", "Editor"), createTestimonial);

router.route("/:id")
  .put(protect, authorize("Super Admin", "Editor"), updateTestimonial)
  .delete(protect, authorize("Super Admin"), deleteTestimonial);

module.exports = router;
