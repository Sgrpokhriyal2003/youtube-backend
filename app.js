import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
dotenv.config()

//local import 
import { connectDB } from './src/config/db.js'

const port = process.env.PORT || 3001
const app = express()

app.use(express.json());
app.use(morgan("dev"));

app.get("/home", (req, res) => {
    res.status(200).json({
        success: true,
        message: "welcome to youtube🧑‍💻"
    })
})

connectDB()
.then(() => {
    app.listen(port, () => {
    console.log(`server running on port: http://localhost:${port}`)
    })
})
.catch((err) => {
    console.log(err.message)
})
