import authRoutes from "./auth.routes.js";
import businessRoute from "./business.route.js";
import serviceRouter from "./services.route.js";

import express from "express";
const router = express.Router();

router.use('/auth', authRoutes);
router.use('/business', businessRoute);
router.use("/services", serviceRouter);

export default router;