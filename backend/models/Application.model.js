import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    internshipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true,
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    resume: {
      type: String, // resume file path
    },

    status: {
      type: String,
      enum: ["APPLIED", "SELECTED", "REJECTED"],
      default: "APPLIED",
    },

    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application ", applicationSchema);
