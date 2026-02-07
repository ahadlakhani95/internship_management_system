import Internship from "../models/Internship.model.js";
import Company from "../models/Company.model.js";

/**
 * @desc Create a new internship
 * @route POST /api/internships
 * @access Company
 */
export const createInternship = async (req, res) => {
  try {
    // Get company profile from logged-in user
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const internship = await Internship.create({
      companyId: company._id,
      title: req.body.title,
      description: req.body.description,
      skillsRequired: req.body.skillsRequired,
      duration: req.body.duration,
      stipend: req.body.stipend,
      location: req.body.location,
    });

    res.status(201).json({
      message: "Internship created successfully",
      internship,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all OPEN internships (for students)
 * @route GET /api/internships
 * @access Student
 */
export const getAllInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ status: "OPEN" })
      .populate("companyId", "companyName logo website")
      .sort({ createdAt: -1 });

    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get internships posted by logged-in company
 * @route GET /api/internships/company
 * @access Company
 */
export const getCompanyInternships = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const internships = await Internship.find({ companyId: company._id })
      .sort({ createdAt: -1 });

    res.json(internships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Close an internship
 * @route PUT /api/internships/:id/close
 * @access Company
 */
export const closeInternship = async (req, res) => {
  try {
    const company = await Company.findOne({ userId: req.user.id });
    if (!company) {
      return res.status(404).json({ message: "Company profile not found" });
    }

    const internship = await Internship.findOne({
      _id: req.params.id,
      companyId: company._id,
    });

    if (!internship) {
      return res
        .status(403)
        .json({ message: "Not authorized to close this internship" });
    }

    internship.status = "CLOSED";
    await internship.save();

    res.json({
      message: "Internship closed successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
