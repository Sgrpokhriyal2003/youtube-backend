import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import fileUpload from 'express-fileupload'

dotenv.config()

//local import 
import { connectDB } from './src/config/db.js'
import  userRoutes  from './src/routes/user-route.js'
import  videoRoutes from './src/routes/video-route.js'

const port = process.env.PORT || 3001
const app = express()

app.use(express.json());
app.use(morgan("dev"));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}))

app.get("/home", (req, res) => {
    res.status(200).json({
        success: true,
        message: "welcome to youtube🧑‍💻"
    })
})

//routes
app.use("/api/v1/user", userRoutes)
app.use("/api/v1/video", videoRoutes)

connectDB()
.then(() => {
    app.listen(port, () => {
    console.log(`server running on port: http://localhost:${port}`)
    })
})
.catch((err) => {
    console.log(err.message)
})
