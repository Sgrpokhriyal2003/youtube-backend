import Video from '../models/video.js'
import User from '../models/user.js'
import cloudinary from '../config/cloudinary.js'

export const upload = async(req, res) => {
    try{
        const {title, description, category, tags} = req.body
        if(!req.files || !req.files.videoUrl || !req.files.thumbnailUrl){
            return res.status(400).json({
                message: "Video and thumbnail are required!"
            })
        }

        const videoUpload  = await cloudinary.uploader.upload(req.files.videoUrl.tempFilePath, {
            resource_type: "video",
            folder: "videos"
        })
        const thumbnailUpload = await cloudinary.uploader.upload(req.files.thumbnailUrl.tempFilePath, {
            folder: "thumbnails"
        })

        console.log("video: ", videoUpload)
        console.log("thumbnail: ", thumbnailUpload);

        const newVideo = new Video({
            title,
            description,
            user_id: req.user._id,
            videoUrl: videoUpload.secure_url,
            videoId: videoUpload.public_id,
            thumbnailUrl: thumbnailUpload.secure_url,
            thumbnailId: thumbnailUpload.public_id,
            category,
            tags: tags ? tags.split(",") : []
        })

        await newVideo.save()
        res.status(201).json({
            message: "Video Uploaded Successfully!",
            videoData: newVideo
        })
    }
    catch(err){
        res.status(500).json({
            error: "something went wrong",
            error: err.message
        })
    }
}