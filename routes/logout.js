import express from 'express';
import { logout } from '../controllers/loginController.js';

const router = express.Router();

router.get('/',logout);

export default router;