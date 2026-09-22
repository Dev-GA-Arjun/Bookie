import { registerUserController, loginUserController, getUserInfo } from '../controllers/auth.controllers.js';

import express from 'express';
import authenticateToken from '../middleware/auth.middleware.js';
const router = express.Router()

router.post('/register', registerUserController);
router.post('/login', loginUserController)
router.get("/me", authenticateToken, getUserInfo)

export default router;

