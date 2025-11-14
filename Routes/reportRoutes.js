import express from "express";
import { getTotalSalesByDateRange } from "../controller/reportController.js";
import authMiddleware from "../middleware/auth.js";
import roleMiddleware from "../middleware/role.js";

const router = express.Router();

router.use(authMiddleware);
router.get('/sales',roleMiddleware("admin"), getTotalSalesByDateRange);

export default router;