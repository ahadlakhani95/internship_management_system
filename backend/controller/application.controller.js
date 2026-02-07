import Application from "../models/Application.model.js";
import Internship from "../models/Internship.model.js";
import Company from "../models/Company.model.js";

/**
 * @desc Apply for an internship
 * @route POST /api/applications/apply
 * @access Student
 */
export const applyInternship = async (req, res) => {
  try {
    const { internshipId, resume } = req.body;
    const studentId = req.user.id;

    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).json({ message: "Internship not found" });
    }

    const alreadyApplied = await Application.findOne({
      internshipId,
      studentId,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      internshipId,
      studentId,
      resume,
    });

    res.status(201).json({
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all applications of a student
 * @route GET /api/applications/student
 * @access Student
 */
export const getStudentApplications = async (req, res) => {
  try {
    const studentId = req.user.id;

    const applications = await Application.find({ studentId })
      .populate("internshipId", "title duration stipend")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get applications for a company internship
 * @route GET /api/applications/internship/:id
 * @access Company
 */
export const getInternshipApplications = async (req, res) => {
  try {
    const { id } = req.params;

    const applications = await Application.find({ internshipId: id })
      .populate("studentId", "name email skills education")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all applications for company internships
 * @route GET /api/applications/company
 * @access Company
 */
export const getCompanyApplications = async (req, res) => {
  try {
    const companyUserId = req.user.id;

    // 1️⃣ Get company using logged-in user id
    const company = await Company.findOne({ userId: companyUserId });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // 2️⃣ Get internships created by company
    const internships = await Internship.find({
      companyId: company._id,
    }).select("_id");

    const internshipIds = internships.map(i => i._id);

    const applications = await Application.aggregate([
      {
        $match: {
          internshipId: { $in: internshipIds }
        }
      },
      {
        $lookup: {
          from: "students",          // collection name
          localField: "studentId",   // application.studentId (userId)
          foreignField: "userId",    // student.userId
          as: "student"
        }
      },
      {
        $unwind: {
          path: "$student",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "studentId",   // same userId
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $lookup: {
          from: "internships",
          localField: "internshipId",
          foreignField: "_id",
          as: "internship"
        }
      },
      {
        $unwind: "$internship"
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update application status
 * @route PUT /api/applications/:id/status
 * @access Company / Admin
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id);
    console.log(application);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    application.status = status;
    await application.save();

    res.json({
      message: "Application status updated",
      application,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
