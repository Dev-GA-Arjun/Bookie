import { createServices, getServices, getOneService, updateServices, deleteServices } from "../controllers/services.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";
import { validateCreateService, validateUpdateService, validateServiceId } from "../middleware/validateServices.middleware.js";

import express from "express";
const router = express.Router();

router.post("/", authenticateToken, validateCreateService, createServices);
router.get("/", authenticateToken, getServices);
router.get("/:id", authenticateToken, validateServiceId, getOneService);
router.patch("/:id", authenticateToken, validateServiceId, validateUpdateService, updateServices);  
router.delete("/:id", authenticateToken, validateServiceId, deleteServices);

export default router;