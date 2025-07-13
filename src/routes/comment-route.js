import express from 'express'
const router = express.Router()

import { authMiddleware } from '../middleware/auth.js'
import { createComment, deleteComment, getComment, updateComment } from '../controller/comment-controller.js'


router.post("/new-comment", authMiddleware, createComment)
router.get("/:id", authMiddleware, getComment)
router.put("/:id", authMiddleware, updateComment)
router.delete("/:id", authMiddleware, deleteComment)

export default router