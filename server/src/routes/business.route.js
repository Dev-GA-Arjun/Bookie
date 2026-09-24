import { updateBusinessProfile } from "../controllers/business.controller.js";
import { validateBusinessProfile } from "../middleware/validate.middleware.js";

import express from "express";
import authenticateToken from "../middleware/auth.middleware.js";
const router = express.Router()

router.patch("/profile", authenticateToken, validateBusinessProfile, updateBusinessProfile);


export default router;  