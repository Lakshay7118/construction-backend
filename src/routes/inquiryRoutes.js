const express = require("express");
const router = express.Router();
const {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
} = require("../controllers/inquiryController");
const { protect, authorize } = require("../middleware/auth");

router.route("/")
  .get(protect, authorize("Super Admin", "Editor"), getInquiries)
  .post(createInquiry);

router.route("/:id")
  .delete(protect, authorize("Super Admin"), deleteInquiry);

router.put("/:id/status", protect, authorize("Super Admin", "Editor"), updateInquiryStatus);

module.exports = router;
