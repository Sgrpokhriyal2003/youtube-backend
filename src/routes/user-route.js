import express from 'express'
const router = express.Router()

import { register, login, updateProfile , subscribed} from '../controller/user-controller.js'
import { authMiddleware } from '../middleware/auth.js'

router.post("/signup", register)

router.post("/signin", login)

router.put("/update", authMiddleware, updateProfile)

router.post("/subscribe", authMiddleware, subscribed)

export default router