import {
    getAllStaff,
    createStaff,
    updateStaff,
    deleteStaff,
    assignStaffServices,
    getStaffWorkingHours,
    setStaffWorkingHours,
    updateStaffWorkingHours
} from "../controllers/staff.controller.js";
import authenticateToken from "../middleware/auth.middleware.js";
import {
    validateCreateStaff,
    validateUpdateStaff,
    validateStaffId,
    validateStaffServices,
    validateSetWorkingHours,
    validatePatchWorkingHours
} from "../middleware/validateStaff.middleware.js";


import express from "express";
const router = express.Router();

router.get("/", authenticateToken, getAllStaff);
router.post("/", authenticateToken, validateCreateStaff, createStaff);
router.patch("/:id", authenticateToken, validateStaffId, validateUpdateStaff, updateStaff);
router.delete("/:id", authenticateToken, validateStaffId, deleteStaff)
router.post("/:id/services", authenticateToken, validateStaffId, validateStaffServices, assignStaffServices);
router.get("/:id/hours", authenticateToken, validateStaffId, getStaffWorkingHours);
router.post("/:id/hours", authenticateToken, validateStaffId, validateSetWorkingHours, setStaffWorkingHours);
router.patch("/:id/hours", authenticateToken, validateStaffId, validatePatchWorkingHours, updateStaffWorkingHours);

export default router;