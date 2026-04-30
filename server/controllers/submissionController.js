import Submission from "../models/Submission.js";
import { sendMail } from "../config/mailer.js";
import {
  adminSubmissionEmail,
  userConfirmationEmail
} from "../utils/emailTemplates.js";

const getClientIp = (req) => {
  const forwardedFor = req.headers["x-forwarded-for"];
  const ip = forwardedFor
    ? forwardedFor.split(",")[0].trim()
    : req.socket.remoteAddress || req.ip;

  return ip?.replace("::ffff:", "") || "Unknown";
};

const getLocationFromIp = async (ip) => {
  if (
    !ip ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip === "localhost" ||
    ip === "Unknown"
  ) {
    return {
      country: "Localhost",
      city: "Local"
    };
  }

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    return {
      country: data.country_name || "Unknown",
      city: data.city || "Unknown"
    };
  } catch {
    return {
      country: "Unknown",
      city: "Unknown"
    };
  }
};

export const createSubmission = async (req, res, next) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, subject and message are required."
      });
    }

    const clientIp = getClientIp(req);
    const location = await getLocationFromIp(clientIp);

    const files =
      req.files?.map((file) => ({
        originalName: file.originalname,
        fileName: file.filename,
        filePath: file.path.replace(/\\/g, "/"),
        mimeType: file.mimetype,
        size: file.size
      })) || [];

    const submission = await Submission.create({
      fullName,
      email,
      phone,
      subject,
      message,
      files,
      ipAddress: clientIp,
      country: location.country,
      city: location.city,
      userAgent: req.get("user-agent")
    });

    const io = req.app.get("io");
    io.emit("new-submission", submission);

    const attachments = files.map((file) => ({
      filename: file.originalName,
      path: file.filePath
    }));

    // await sendMail({
//   to: process.env.ADMIN_RECEIVER_EMAIL,
//   subject: `New Contact Submission: ${submission.subject}`,
//   html: adminSubmissionEmail(submission),
//   attachments
// });

// await sendMail({
//   to: submission.email,
//   subject: `We received your message: ${submission.subject}`,
//   html: userConfirmationEmail(submission)
// });

    res.status(201).json({
      success: true,
      message: "Submission sent successfully.",
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissions = async (req, res, next) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: submissions.length,
      data: submissions
    });
  } catch (error) {
    next(error);
  }
};

export const getSubmissionById = async (req, res, next) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found."
      });
    }

    res.status(200).json({
      success: true,
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubmissionStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["new", "read", "archived"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status."
      });
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Submission status updated.",
      data: submission
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubmission = async (req, res, next) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.id);

    if (!submission) {
      return res.status(404).json({
        success: false,
        message: "Submission not found."
      });
    }

    res.status(200).json({
      success: true,
      message: "Submission deleted successfully."
    });
  } catch (error) {
    next(error);
  }
};