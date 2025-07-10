import express from 'express'
const router = express.Router()

router.post("/signup", (req, res) => {
    res.json({message: "signup page"});
})

router.post("/signin", (req, res) => {
    res.json({message: "signin page"})
})

export default router