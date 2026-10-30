import { getAllStaff, createStaff, updateStaff, deleteStaff, assignStaffServices } from "../controllers/staff.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";
import { validateCreateStaff, validateUpdateStaff, validateStaffId, validateStaffServices } from "../middleware/validateStaff.middleware.js";


import express from "express";
const router = express.Router();

router.get("/", authenticateToken, getAllStaff);
router.post("/", authenticateToken, validateCreateStaff, createStaff);
router.patch("/:id", authenticateToken, validateStaffId, validateUpdateStaff, updateStaff);
router.delete("/:id", authenticateToken, validateStaffId, deleteStaff)
router.post("/:id/services", authenticateToken, validateStaffId, validateStaffServices, assignStaffServices);

export default router;