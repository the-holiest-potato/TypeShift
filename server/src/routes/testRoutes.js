import express from "express";
import { saveTestResult, getTestHistory } from "../controllers/testController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// All test routes require authentication
router.use(authMiddleware);

router.post("/", saveTestResult);
router.get("/history", getTestHistory);

export default router;
