const express = require("express");
const router = express.Router();
const {
  getAwards,
  createAward,
  updateAward,
  deleteAward,
} = require("../controllers/awardController");
const { protect, authorize } = require("../middleware/auth");

router.route("/")
  .get(getAwards)
  .post(protect, authorize("Super Admin", "Editor"), createAward);

router.route("/:id")
  .put(protect, authorize("Super Admin", "Editor"), updateAward)
  .delete(protect, authorize("Super Admin"), deleteAward);

module.exports = router;
