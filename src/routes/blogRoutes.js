const express = require("express");
const router = express.Router();
const {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/blogController");
const { protect, authorize } = require("../middleware/auth");

router.route("/")
  .get(getBlogs)
  .post(protect, authorize("Super Admin", "Editor"), createBlog);

router.route("/:slug")
  .get(getBlogBySlug)
  .put(protect, authorize("Super Admin", "Editor"), updateBlog)
  .delete(protect, authorize("Super Admin"), deleteBlog);

module.exports = router;
