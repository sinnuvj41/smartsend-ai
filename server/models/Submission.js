import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30
    },
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000
    },
    files: [
      {
        originalName: String,
        fileName: String,
        filePath: String,
        mimeType: String,
        size: Number
      }
    ],
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new"
    },
    ipAddress: {
      type: String
    },
    userAgent: {
      type: String
    },
    country: {
  type: String,
  default: "Unknown"
},
city: {
  type: String,
  default: "Unknown"
}
  },
  {
    timestamps: true
  }
);

const Submission = mongoose.model("Submission", submissionSchema);

export default Submission;