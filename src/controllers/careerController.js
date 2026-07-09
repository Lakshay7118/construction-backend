const CareerPost = require("../models/CareerPost");
const JobApplication = require("../models/JobApplication");
const cloudinary = require("../config/cloudinary");

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

/**
 * Helper: upload a Buffer to Cloudinary as a raw file (PDF, DOCX, etc.)
 *
 * IMPORTANT: For resource_type "raw", the file extension MUST be included in
 * the public_id so the Cloudinary URL ends with .pdf / .docx etc., which lets
 * the browser know the file type and download it with the correct name.
 */
const uploadResumeToCloudinary = (fileBuffer, originalName) => {
  return new Promise((resolve, reject) => {
    const path    = require("path");
    const { Readable } = require("stream");

    // Extract extension (.pdf, .docx, .doc) and sanitize the base name
    const ext      = path.extname(originalName).toLowerCase();           // e.g. ".pdf"
    const baseName = path.basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")                                   // safe chars only
      .slice(0, 60);                                                       // limit length

    // Include extension in public_id — Cloudinary will serve the URL with the extension
    // e.g. kalpataru/resumes/resume_1720500000_MyCV.pdf
    const publicId = `kalpataru/resumes/resume_${Date.now()}_${baseName}${ext}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",     // serve file as-is (correct MIME type)
        public_id: publicId,      // full path including extension
        overwrite: false,
      },
      (error, result) => {
        if (result) resolve(result);
        else reject(error || new Error("Cloudinary upload failed with no error info"));
      }
    );

    // Convert buffer → Readable stream and pipe into Cloudinary upload stream
    const readable = new Readable();
    readable.push(fileBuffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// @desc    Submit a job application (with optional resume file upload)
// @route   POST /api/careers/:slug/apply
// @access  Public
// Body: multipart/form-data with fields: name, email, phone, coverNote + file field "resume"
const createApplication = async (req, res) => {
  const { slug } = req.params;
  try {
    const career = await CareerPost.findOne({ slug });
    if (!career) {
      return res.status(404).json({ success: false, error: "Career position not found" });
    }

    // Debug log — helps diagnose missing body fields during development
    console.log("[Apply] req.body:", req.body);
    console.log("[Apply] req.file:", req.file ? req.file.originalname : "none");

    // Safely extract text fields (req.body populated by multer for multipart/form-data)
    const name      = (req.body.name      || "").trim();
    const email     = (req.body.email     || "").trim();
    const phone     = (req.body.phone     || "").trim();
    const coverNote = (req.body.coverNote || "").trim();

    // Validate required fields manually so we return a clear error
    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        error: "name, email and phone are required fields.",
      });
    }

    let resumeUrl = "";
    let resumeFileName = req.body.resumeFileName || "No file uploaded";

    // If a resume file was attached via multer, upload it to Cloudinary
    if (req.file) {
      try {
        const result = await uploadResumeToCloudinary(req.file.buffer, req.file.originalname);
        resumeUrl = result.secure_url;
        resumeFileName = req.file.originalname;
      } catch (uploadError) {
        console.error("Cloudinary resume upload failed:", uploadError.message);
        // Don't block the application submission if Cloudinary upload fails
        resumeFileName = req.file.originalname || resumeFileName;
        resumeUrl = "";
      }
    }

    const applicationData = {
      name,
      email,
      phone,
      coverNote,
      resumeFileName,
      resumeUrl,
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
// @route   GET /api/careers/applications/all
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
// @route   PUT /api/careers/applications/:id/status
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
