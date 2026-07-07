const express = require("express");
const router = express.Router();
const {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
} = require("../controllers/serviceController");
const { protect, authorize } = require("../middleware/auth");

router.route("/")
  .get(getServices)
  .post(protect, authorize("Super Admin", "Editor"), createService);

router.route("/:slug")
  .get(getServiceBySlug)
  .put(protect, authorize("Super Admin", "Editor"), updateService)
  .delete(protect, authorize("Super Admin"), deleteService);

module.exports = router;
