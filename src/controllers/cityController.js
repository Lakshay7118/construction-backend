const City = require("../models/City");

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
const getCities = async (req, res) => {
  try {
    const cities = await City.find({}).sort({ createdAt: -1 });
    res.json({ success: true, cities });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get city by slug
// @route   GET /api/cities/:slug
// @access  Public
const getCityBySlug = async (req, res) => {
  try {
    const city = await City.findOne({ slug: req.params.slug });
    if (!city) {
      return res.status(404).json({ success: false, error: "City not found" });
    }
    res.json({ success: true, city });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new city
// @route   POST /api/cities
// @access  Private (Admin/Editor)
const createCity = async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json({ success: true, city });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, error: "Slug must be unique" });
    }
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update city by slug
// @route   PUT /api/cities/:slug
// @access  Private (Admin/Editor)
const updateCity = async (req, res) => {
  try {
    const city = await City.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!city) {
      return res.status(404).json({ success: false, error: "City not found" });
    }
    res.json({ success: true, city });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete city by slug
// @route   DELETE /api/cities/:slug
// @access  Private (Admin)
const deleteCity = async (req, res) => {
  try {
    const city = await City.findOneAndDelete({ slug: req.params.slug });
    if (!city) {
      return res.status(404).json({ success: false, error: "City not found" });
    }
    res.json({ success: true, message: "City deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getCities,
  getCityBySlug,
  createCity,
  updateCity,
  deleteCity,
};
