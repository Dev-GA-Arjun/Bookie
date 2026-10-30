import authRoutes from "./auth.routes.js";
import businessRoute from "./business.route.js";
import serviceRouter from "./services.route.js";
import staffRouter from './staff.route.js';
import holidayRouter from "./holidays.route.js";

import express from "express";
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/business', businessRoute);
router.use("/services", serviceRouter);
router.use("/staff", staffRouter);
router.use("/holidays", holidayRouter);

export default router;