import mongoose from "mongoose";

const internshipSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    skillsRequired: [
      {
        type: String,
      },
    ],

    duration: {
      type: String, // e.g. "3 Months"
    },

    stipend: {
      type: Number,
      default: 0,
    },

    location: {
      type: String,
    },

    status: {
      type: String,
      enum: ["OPEN", "CLOSED"],
      default: "OPEN",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Internship", internshipSchema);
