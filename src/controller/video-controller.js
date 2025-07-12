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

export const update = async(req, res) => {
    try{
        const {title, description, category, tags} = req.body;
        const videoId = req.params.id;
        let video = await Video.findById(videoId);
        if(!video){
            return res.status(404).json({success: false, error: "video not found"})
        }

        if(video.user_id.toString() !== req.user._id.toString()){
            return res.status(403).json({error: "unauthorized"})
        }

        if(req.files && req.files.thumbnailUrl){
            await cloudinary.uploader.destroy(video.thumbnailId)
            const thumbnailUpload = await cloudinary.uploader.upload(req.files.thumbnailUrl.tempFilePath, {
                folder: "thumbnails"
            })

            video.thumbnailUrl = thumbnailUpload.secure_url
            video.thumbnailId = thumbnailUpload.public_id
        }

        video.title = title || video.title
        video.description = description || video.description
        video.category = category || video.category
        video.tags = tags ? tags.split(",") : video.tags

        await video.save()
        res.status(200).json({
            success: true,
            message: "video updated sucessfully!"
        })
    }
    catch(err){
        res.status(500).json({message: "something went wrong"});
    }
}

export const deleteVideo = async(req, res) => {
    try{
        const videoId = req.params.id;
        const video = await Video.findById(videoId)
        if(!video){
            return res.status(404).json({message: "video does not exists"})
        }

        if(video.user_id.toString() !== req.user._id.toString()){
            return res.status(403).json({error: "Unauthorized!"})
        }

        await cloudinary.uploader.destroy(video.videoId, {resource_type: "video"})
        await cloudinary.uploader.destroy(video.thumbnailId)

        await Video.findByIdAndDelete(videoId)
        res.status(200).json({message: "video deleted successfully!"});

    }
    catch(err){
        res.status(500).json({message: 'something went wrong!', error: err.message});
    }
}