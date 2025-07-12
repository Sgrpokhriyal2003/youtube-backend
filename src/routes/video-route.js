import express from 'express'
const router = express.Router()

import { authMiddleware } from '../middleware/auth.js';
import { upload, update } from '../controller/video-controller.js';


router.post("/upload", authMiddleware, upload);
router.put("/update/:id", authMiddleware, update)


export default router