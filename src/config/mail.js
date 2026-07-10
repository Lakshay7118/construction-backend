// ==========================================
// NODEMAILER SMTP CONFIGURATION (COMMENTED)
// ==========================================
/*
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  secure: process.env.EMAIL_PORT === "465", // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendAdminNotification = async (options) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("⚠️ Mail functionality skipped: EMAIL_USER or EMAIL_PASS not set in .env");
    return null;
  }

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || "Kalpataru Notifications"}" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: options.attachments || [],
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  sendAdminNotification,
};
*/

// ==========================================
// EMAIL.JS REST API INTEGRATION
// ==========================================

/**
 * Send an email notification using EmailJS REST API
 * @param {Object} options
 * @param {string} options.templateId - EmailJS Template ID
 * @param {Object} options.templateParams - Template parameters matching the EmailJS template variables
 */
const sendEmailJSTemplate = async (options) => {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY; // server-side accessToken

  if (!serviceId || !publicKey || !privateKey) {
    console.warn("⚠️ EmailJS skipped: EMAILJS_SERVICE_ID, EMAILJS_PUBLIC_KEY, or EMAILJS_PRIVATE_KEY not set in .env");
    return null;
  }

  const payload = {
    service_id: serviceId,
    template_id: options.templateId,
    user_id: publicKey,
    accessToken: privateKey,
    template_params: options.templateParams,
  };

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS sending failed: Status ${response.status} - ${errorText}`);
  }

  return response;
};

module.exports = {
  sendEmailJSTemplate,
};
