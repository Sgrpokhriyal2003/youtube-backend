import express from 'express'
const router = express.Router()

import { authMiddleware } from '../middleware/auth.js';
import { upload } from '../controller/video-controller.js';


router.post("/upload", authMiddleware, upload);

export default router