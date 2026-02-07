// routes/application.routes.js
import express from "express";
import {
    applyInternship,
    getStudentApplications,
    getInternshipApplications,
    getCompanyApplications,
    updateApplicationStatus
} from "../controller/application.controller.js";
import authMiddleware, { authorize } from "../middlewares/auth.middleware.js";
import upload from "./../middlewares/upload.middleware.js"; // Multer middleware

const router = express.Router();

/**
 * @route   POST /api/applications/apply
 * @desc    Apply for an internship (PDF upload)
 * @access  Student
 */
router.post(
    "/apply",
    authMiddleware,               // protect route
    authorize("STUDENT"),         // only STUDENT can access
    upload.single("resume"),      // handle PDF upload, "resume" is field name
    async (req, res) => {
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        // Save the file path to request body for controller
        req.body.resume = req.file.path;
        await applyInternship(req, res);
    }
);
router.get(
    "/company",
    authMiddleware,
    authorize("COMPANY"),
    getCompanyApplications
);


/**
 * @route   GET /api/applications/student
 * @desc    Get all applications for logged-in student
 * @access  Student
 */
router.get("/student", authMiddleware, authorize("STUDENT"), getStudentApplications);

/**
 * @route   GET /api/applications/internship/:id
 * @desc    Get all applications for a specific internship (company view)
 * @access  Company
 */
router.get("/internship/:id", authMiddleware, authorize("COMPANY"), getInternshipApplications);

/**
 * @route   PUT /api/applications/:id/status
 * @desc    Update the status of an application
 * @access  Company / Admin
 */
router.put("/:id/status", authMiddleware, authorize("COMPANY", "ADMIN"), updateApplicationStatus);

export default router;
