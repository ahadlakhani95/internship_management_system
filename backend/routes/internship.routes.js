import express from "express";
import {
    createInternship,
    getAllInternships,
    getCompanyInternships,
    closeInternship,
} from "../controller/internship.controller.js";
import authMiddleware from "./../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route   POST /api/internships
 * @desc    Create a new internship (Company only)
 * @access  Private (Company)
 */
router.post("/", authMiddleware, createInternship);

/**
 * @route   GET /api/internships
 * @desc    Get all OPEN internships (Students only)
 * @access  Private (Student)
 */
router.get("/", authMiddleware, getAllInternships);

/**
 * @route   GET /api/internships/company
 * @desc    Get internships posted by logged-in company
 * @access  Private (Company)
 */
router.get("/company", authMiddleware, getCompanyInternships);

/**
 * @route   PUT /api/internships/:id/close
 * @desc    Close an internship (Company only)
 * @access  Private (Company)
 */
router.put("/:id/close", authMiddleware, closeInternship);

export default router;
