import express from 'express'
const router = express.Router()

import { register, login } from '../controller/user-controller.js'

router.post("/signup", register)

router.post("/signin", login)

export default router