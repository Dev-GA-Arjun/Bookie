import express from "express";
import authenticateToken from "../middleware/auth.middleware.js";
import { validateHolidayId, validateCreateHoliday } from "../middleware/validateHoliday.middleware.js";
import { getHolidays, createHoliday, deleteHoliday } from "../controllers/holidays.controller.js";

const router = express.Router();

router.get("/", authenticateToken, getHolidays);
router.post("/", authenticateToken, validateCreateHoliday, createHoliday);
router.delete("/:id", authenticateToken, validateHolidayId, deleteHoliday);

export default router;
