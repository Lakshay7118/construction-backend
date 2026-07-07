const express = require("express");
const router = express.Router();
const {
  getProjects,
  getProjectBySlug,
  getProjectsByCity,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/auth");

router.route("/")
  .get(getProjects)
  .post(protect, authorize("Super Admin", "Editor"), createProject);

router.get("/city/:citySlug", getProjectsByCity);

router.route("/:slug")
  .get(getProjectBySlug)
  .put(protect, authorize("Super Admin", "Editor"), updateProject)
  .delete(protect, authorize("Super Admin"), deleteProject);

module.exports = router;
