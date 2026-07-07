const express = require("express");
const router = express.Router();
const { uploadImage } = require("../controllers/uploadController");
const upload = require("../middleware/upload");
const { protect, authorize } = require("../middleware/auth");

// We protect the upload route so only logged in admins/editors can upload files
router.post("/", protect, authorize("Super Admin", "Editor"), upload.single("file"), uploadImage);

module.exports = router;
