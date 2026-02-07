import express from "express";
import { register, login } from "../controller/auth.controller.js";

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user (STUDENT / COMPANY / ADMIN)
// @access  Public
router.post("/register", register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", login);

export default router;
