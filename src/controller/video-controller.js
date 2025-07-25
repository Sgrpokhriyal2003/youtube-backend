import Video from '../models/video.js'
import User from '../models/user.js'
import cloudinary from '../config/cloudinary.js'
import { truncates } from 'bcryptjs'

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
        const Id = req.params.id;
        const video = await Video.findById(Id)
        if(!video){
            return res.status(404).json({message: "video does not exists"})
        }

        if(video.user_id.toString() !== req.user._id.toString()){
            return res.status(403).json({error: "Unauthorized!"})
        }

        await cloudinary.uploader.destroy(video.videoId, {resource_type: "video"})
        await cloudinary.uploader.destroy(video.thumbnailId)

        await Video.findByIdAndDelete(Id)
        res.status(200).json({message: "video deleted successfully!"});

    }
    catch(err){
        res.status(500).json({message: 'something went wrong!', error: err.message});
    }
}

export const getVideos = async(req, res) => {
    try{
        const videos = await Video.find().sort({createdAt:-1})
        res.status(200).json({
            success: true,
            data: videos
        })
    }
    catch(error){
        res.status(500).json({
            message: "something went wrong!",
            error: error.message
        })
    }
}

export const myVideo = async(req, res) => {
    try{
        const videos = await Video.find({user_id: req.user._id}).sort({createdAt:-1})
        if(!videos){
            return res.status(404).json({message: "No Video Found With This User Id"})
        }

        res.status(200).json(videos)
    }   
    catch(error){
        res.status(500).json({
            message: "something went wrong!",
            error: error.message
        })
    }
}

export const getVideoByCategory = async(req, res) => {
    try{
        const category = req.params.category //url parameter
        const videos = await Video.find({category}).sort({createdAt: -1})
        res.status(200).json(videos)
    }
    catch(error){
        res.status(500).json({
            message: 'something went wrong',
            fetchError: error.message
        })
    }
}

export const getVideoByTag = async(req, res) => {
    try{
        const tag = req.params.tag;
        const video = await Video.find({tags: tag}).sort({createdAt: -1})
        res.status(200).json(video)
    }
    catch(error){
        res.status(500).json({
            message: "something went wrong!",
            err: error.message
        })
    }
}

export const getVideoById = async(req, res) => {
    try{
       const Id = req.params.id
       const userId = req.user._id

       const video = await Video.findById(Id)

       if(!video){
        return res.status(404).json({message: "video not found!"})
       }

       if(video.user_id.toString() !== userId.toString()){
            await Video.findByIdAndUpdate(
            Id,
            {
                $addToSet: {viewedBy: userId},
            },
            {new: true}
        )
       }

       const updatedVideo = await Video.findById(Id)
       res.status(200).json(updatedVideo)
    }
    catch(error){
        res.status(500).json({
            message: "something went wrong",
            error: error.message
        })
    }
}

export const likeVideo = async(req, res) => {
    try{

        const {id} = req.body

        const video = await Video.findById(id);

         if(!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if(video.user_id.toString() === req.user._id.toString()){
            return res.status(403).json({message: "you can't like your own video"});
        }

        const updatedVideo = await Video.findByIdAndUpdate(id, 
            {
            $addToSet: {likedBy: req.user._id},
            $pull: {dislikedBy: req.user._id}
        }, {new: true})
          
       

        res.status(200).json({message: "liked the video", updatedVideo})
    }
    catch(error){
        res.status(500).json({
            message: "something went wrong",
            error: error.message
        })
    }
}

export const dislikeVideo = async(req, res) => {
    try{
        const {Id} = req.body

        const video = await Video.findById(Id);
        if(!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        if(video.user_id.toString() === req.user._id.toString()){
            return res.status(403).json({message: "you can't dislike your own video"});
        }

        await Video.findByIdAndUpdate(Id,{
            $addToSet: {dislikedBy: req.user._id},
            $pull: {likedBy: req.user._id}
        })

        res.status(200).json({message: "dislike the video"})
    }
    catch(error){
        res.status(500).json({
            message: "something went wrong",
            error: error.message
        })
    }
}

export const getViewsCount = async(req, res) => {
    try{
        const {id} = req.body
        const video = await Video.findById(id)

        const userId = req.user._id;
        if(!video){
            return res.status(404).json({message: 'video not found!'})
        }

        if(video.user_id.toString() !== userId.toString()){
            const updatedVideo = await Video.findByIdAndUpdate(id, {
                $addToSet: {viewedBy: userId}
            }, {new: true})
        }

        res.status(200).json(updatedVideo)
    }
    catch(error){
        res.status(500).json({
            message: "something went wrong",
            error: error.message
        })
    }
}