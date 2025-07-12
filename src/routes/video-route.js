import express from 'express'
const router = express.Router()

import { authMiddleware } from '../middleware/auth.js';
import { upload, update, deleteVideo } from '../controller/video-controller.js';


router.post("/upload", authMiddleware, upload);
router.put("/update/:id", authMiddleware, update)
router.delete("/delete/:id", authMiddleware, deleteVideo)

export default router