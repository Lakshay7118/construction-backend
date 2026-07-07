const Award = require("../models/Award");

// @desc    Get all awards
// @route   GET /api/awards
// @access  Public
const getAwards = async (req, res) => {
  try {
    const awards = await Award.find({}).sort({ year: -1 });
    res.json({ success: true, awards });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create an award
// @route   POST /api/awards
// @access  Private (Admin/Editor)
const createAward = async (req, res) => {
  try {
    const award = await Award.create(req.body);
    res.status(201).json({ success: true, award });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update an award
// @route   PUT /api/awards/:id
// @access  Private (Admin/Editor)
const updateAward = async (req, res) => {
  try {
    const award = await Award.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!award) {
      return res.status(404).json({ success: false, error: "Award not found" });
    }
    res.json({ success: true, award });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete an award
// @route   DELETE /api/awards/:id
// @access  Private (Admin)
const deleteAward = async (req, res) => {
  try {
    const award = await Award.findByIdAndDelete(req.params.id);
    if (!award) {
      return res.status(404).json({ success: false, error: "Award not found" });
    }
    res.json({ success: true, message: "Award deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAwards,
  createAward,
  updateAward,
  deleteAward,
};
