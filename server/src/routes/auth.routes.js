import { registerUserController, loginUserController } from '../controllers/auth.controllers.js';

import express from 'express';
const router = express.Router()

router.post('/register', registerUserController);
router.post('/login', loginUserController)

export default router;

