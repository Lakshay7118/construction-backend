const Service = require("../models/Service");

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
  try {
    const services = await Service.find({}).sort({ createdAt: 1 });
    res.json({ success: true, services });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get service by slug
// @route   GET /api/services/:slug
// @access  Public
const getServiceBySlug = async (req, res) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug });
    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin/Editor)
const createService = async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json({ success: true, service });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: "Slug must be unique" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update service by slug
// @route   PUT /api/services/:slug
// @access  Private (Admin/Editor)
const updateService = async (req, res) => {
  try {
    const service = await Service.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }
    res.json({ success: true, service });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete service by slug
// @route   DELETE /api/services/:slug
// @access  Private (Admin)
const deleteService = async (req, res) => {
  try {
    const service = await Service.findOneAndDelete({ slug: req.params.slug });
    if (!service) {
      return res.status(404).json({ success: false, error: "Service not found" });
    }
    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
};
