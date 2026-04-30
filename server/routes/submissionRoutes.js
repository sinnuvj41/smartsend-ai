import express from "express";
import upload from "../middleware/upload.js";
import protect from "../middleware/auth.js";
import {
  createSubmission,
  getSubmissions,
  getSubmissionById,
  updateSubmissionStatus,
  deleteSubmission
} from "../controllers/submissionController.js";

const router = express.Router();

router.post("/", upload.array("files", 5), createSubmission);

// Admin protected routes
router.get("/", protect, getSubmissions);
router.get("/:id", protect, getSubmissionById);
router.patch("/:id/status", protect, updateSubmissionStatus);
router.delete("/:id", protect, deleteSubmission);

export default router;