const multer = require("multer");

const storage = multer.memoryStorage();

// Allow PDFs, DOC/DOCX, and images.
// Note: browsers sometimes send PDFs/DOCX as application/octet-stream,
// so we also check the original filename extension as a fallback.
const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "application/msword",                                                         // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",    // .docx
  "application/octet-stream",                                                   // generic binary (browser fallback)
]);

const ALLOWED_EXTENSIONS = new Set([".pdf", ".doc", ".docx"]);

const fileFilter = (req, file, cb) => {
  const ext = file.originalname
    ? "." + file.originalname.split(".").pop().toLowerCase()
    : "";

  const mimeOk = file.mimetype.startsWith("image/") || ALLOWED_MIME_TYPES.has(file.mimetype);
  const extOk  = ALLOWED_EXTENSIONS.has(ext);

  if (mimeOk || extOk) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, DOC, DOCX, or image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB limit
  },
});

module.exports = upload;
