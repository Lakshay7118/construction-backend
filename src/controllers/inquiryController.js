const Inquiry = require("../models/Inquiry");

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin/Editor)
const getInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Create new inquiry
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    res.status(201).json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id/status
// @access  Private (Admin/Editor)
const updateInquiryStatus = async (req, res) => {
  const { status } = req.body;

  if (!["new", "in-progress", "closed"].includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid status value" });
  }

  try {
    const inquiry = await Inquiry.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!inquiry) {
      return res.status(404).json({ success: false, error: "Inquiry not found" });
    }

    res.json({ success: true, inquiry });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private (Admin)
const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findByIdAndDelete(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ success: false, error: "Inquiry not found" });
    }
    res.json({ success: true, message: "Inquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  deleteInquiry,
};
