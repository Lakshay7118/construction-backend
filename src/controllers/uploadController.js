const cloudinary = require("../config/cloudinary");

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Private (Admin/Editor)
const uploadImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: "Please provide a file to upload" });
  }

  try {
    // Upload buffer to Cloudinary using upload_stream
    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "kalpataru",
            resource_type: "auto", // Automatically detect if image or pdf/raw
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );
        stream.end(fileBuffer);
      });
    };

    const result = await streamUpload(req.file.buffer);

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { uploadImage };
