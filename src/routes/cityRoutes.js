const express = require("express");
const router = express.Router();
const {
  getCities,
  getCityBySlug,
  createCity,
  updateCity,
  deleteCity,
} = require("../controllers/cityController");
const { protect, authorize } = require("../middleware/auth");

router.route("/")
  .get(getCities)
  .post(protect, authorize("Super Admin", "Editor"), createCity);

router.route("/:slug")
  .get(getCityBySlug)
  .put(protect, authorize("Super Admin", "Editor"), updateCity)
  .delete(protect, authorize("Super Admin"), deleteCity);

module.exports = router;
