import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    education: {
      type: String,
    },

    skills: [
      {
        type: String,
      },
    ],

    resume: {
      type: String, // file path / URL
    },

    phone: {
      type: String,
    },

    profileStatus: {
      type: String,
      enum: ["INCOMPLETE", "COMPLETE"],
      default: "INCOMPLETE",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Student", studentSchema);
