import Internship from "./../models/Internship.model.js";
import Application from "./../models/Application.model.js";
import Company from "../models/Company.model.js";
import { login } from "./auth.controller.js";

export const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user.id; // JWT user id from authMiddleware

        // Fetch the company document linked to this user
        const company = await Company.findOne({ userId });
        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        // 1️⃣ Total Internships
        const totalInternships = await Internship.countDocuments({ companyId: company._id });

        // 2️⃣ Active Internships
        // Make sure status in DB is 'ACTIVE' or 'Active'. Regex ensures case-insensitive match
        const activeInternships = await Internship.countDocuments({
            companyId: company._id,
            status: { $regex: /^OPEN$/i }
        });

        // 3️⃣ Total Applications
        // Get all internships of this company
        const internships = await Internship.find({ companyId: company._id }).select("_id");
        const internshipIds = internships.map((i) => i._id);
        console.log(internshipIds);
        
        const totalApplications = await Application.countDocuments({
            internshipId: { $in: internshipIds },
        });

        // Send response
        res.json({
            totalInternships,
            activeInternships,
            totalApplications,
        });
      

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
