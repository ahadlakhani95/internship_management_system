import express from "express";
import { getDashboardStats } from "./../controller/CompanyController.js";
import authMiddleware, { authorize } from "./../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/dashboard-stats", authMiddleware, authorize("COMPANY"), getDashboardStats);

export default router;
