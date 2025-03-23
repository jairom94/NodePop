import express from 'express';
// import users from '../models/user.js';
import { profile } from '../controllers/homeController.js';

const router = express.Router();

router.get('/',profile);

export default router;