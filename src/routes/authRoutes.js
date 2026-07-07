const express = require("express");
const router = express.Router();
const { login, getMe, getUsers } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/auth");

router.post("/login", login);
router.get("/me", protect, getMe);
router.get("/users", protect, authorize("Super Admin"), getUsers);

module.exports = router;
