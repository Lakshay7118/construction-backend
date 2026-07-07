const CareerPost = require("../models/CareerPost");
const JobApplication = require("../models/JobApplication");

// ==========================================
// CAREER POSTS CONTROLLERS (CRUD)
// ==========================================

// @desc    Get all open career posts
// @route   GET /api/careers
// @access  Public
const getCareers = async (req, res) => {
  try {
    const careers = await CareerPost.find({}).sort({ createdAt: -1 });
    res.json({ success: true, careers });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get career post by slug
// @route   GET /api/careers/:slug
// @access  Public
const getCareerBySlug = async (req, res) => {
  try {
    const career = await CareerPost.findOne({ slug: req.params.slug });
    if (!career) {
      return res.status(404).json({ success: false, error: "Career post not found" });
    }
    res.json({ success: true, career });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new career post
// @route   POST /api/careers
// @access  Private (Admin/Editor)
const createCareer = async (req, res) => {
  try {
    const career = await CareerPost.create(req.body);
    res.status(201).json({ success: true, career });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: "Slug must be unique" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update career post by slug
// @route   PUT /api/careers/:slug
// @access  Private (Admin/Editor)
const updateCareer = async (req, res) => {
  try {
    const career = await CareerPost.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!career) {
      return res.status(404).json({ success: false, error: "Career post not found" });
    }
    res.json({ success: true, career });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete career post by slug
// @route   DELETE /api/careers/:slug
// @access  Private (Admin)
const deleteCareer = async (req, res) => {
  try {
    const career = await CareerPost.findOneAndDelete({ slug: req.params.slug });
    if (!career) {
      return res.status(404).json({ success: false, error: "Career post not found" });
    }
    res.json({ success: true, message: "Career post deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==========================================
// JOB APPLICATIONS CONTROLLERS
// ==========================================

// @desc    Submit a job application
// @route   POST /api/careers/:slug/apply
// @access  Public
const createApplication = async (req, res) => {
  const { slug } = req.params;
  try {
    const career = await CareerPost.findOne({ slug });
    if (!career) {
      return res.status(404).json({ success: false, error: "Career position not found" });
    }

    const applicationData = {
      ...req.body,
      careerSlug: slug,
      roleTitle: career.title,
    };

    const application = await JobApplication.create(applicationData);
    res.status(201).json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get all job applications
// @route   GET /api/applications
// @access  Private (Admin/Editor)
const getApplications = async (req, res) => {
  try {
    const applications = await JobApplication.find({}).sort({ createdAt: -1 });
    res.json({ success: true, applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update job application status
// @route   PUT /api/applications/:id/status
// @access  Private (Admin/Editor)
const updateApplicationStatus = async (req, res) => {
  const { status } = req.body;
  
  if (!["new", "shortlisted", "rejected", "hired"].includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status value" });
  }

  try {
    const application = await JobApplication.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ success: false, error: "Application not found" });
    }

    res.json({ success: true, application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getCareers,
  getCareerBySlug,
  createCareer,
  updateCareer,
  deleteCareer,
  createApplication,
  getApplications,
  updateApplicationStatus,
};
