import express from 'express'
const router = express.Router()

import { authMiddleware } from '../middleware/auth.js'
import { createComment, deleteComment, getComment, updateComment } from '../controller/comment-controller.js'


router.post("/new-comment", createComment)
router.get("/comment/:id", getComment)
router.put("/comment/:id", updateComment)
router.delete("comment/:id", authMiddleware, deleteComment)

export default router