import express from 'express'
const router = express.Router()

import { authMiddleware } from '../middleware/auth.js';
import { upload, update, deleteVideo, getVideos, myVideo, getVideoByCategory, getVideoByTag, getVideoById, likeVideo, dislikeVideo, getViewsCount} from '../controller/video-controller.js';


router.post("/upload", authMiddleware, upload);
router.put("/update/:id", authMiddleware, update)
router.delete("/delete/:id", authMiddleware, deleteVideo)
router.get("/all", authMiddleware, getVideos)
router.get("/myVideo", authMiddleware, myVideo)
router.get("/category/:category", getVideoByCategory)
router.get("/tags/:tag", getVideoByTag)
router.get("/:id", authMiddleware, getVideoById)
router.post("/like", authMiddleware, likeVideo)
router.post("/dislike", authMiddleware, dislikeVideo)
router.post('/view', authMiddleware, getViewsCount)

//router.get("/:id", authMiddleware, getViewsCount);

export default router