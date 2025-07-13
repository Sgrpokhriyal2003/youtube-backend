import mongoose from 'mongoose'
import Comment from '../models/comment.js'
import Video  from '../models/video.js'

export const createComment = async(req, res) => {
    try{
        const {id, commentText} = req.body
        if(!id || !commentText){
            return res.status(400).json({
                err: "video id and comment txt are required!"
            })
        }

        const videoExists = await Video.findById(id)
        if(!videoExists){
            return res.status(404).json({
                error: "video not found!"
            })
        }

        const newComment = new Comment({
            video_id: id,
            commentText,
            user_id: req.user._id
        })

        const saveComment = await newComment.save()
        res.status(201).json({
            message: "comment is added successfully!",
            data: saveComment
        })

    }
    catch(error){
        res.status(500).json({
            message: "something went wrong!",
            error: error.message
        })
    }
}

export const getComment = async(req, res) => {
    try{
        const id = req.params.id
        console.log("recieved video_id: ", id)

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid video ID format" });
        }

        const comments = await Comment.find({video_id: id})
        .populate("user_id", "channelName logoUrl")
        .sort({createdAt: -1})

        res.status(200).json({comments})
    }
    catch(err){
        console.error('error while fetching comment: ', err),
        res.status(500).json({
            message: "something went wrong!",
            error: err.message
        })
    }
}

export const updateComment = async(req, res) => {
    try{
        const id = req.params.id
        const {commentText} = req.body

        if (!commentText || commentText.trim().length === 0) {
            return res.status(400).json({ error: "Comment text is required!" });
        }

        const comment = await Comment.findById(id)
        if(!comment){
            return res.status(404).json({
                message: "comment not found!"
            })
        }

        if(comment.user_id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                error: "unauthorized!"
            })
        }

        comment.commentText = commentText.trim()
        await comment.save()
        res.status(200).json({message: "comment updated successfully!", data: comment});

    }
    catch(err){

         res.status(500).json({
            message: "something went wrong!",
            error: err.message
        })
    }
}

export const deleteComment = async(req, res) => {
    try{
        const id = req.params.id;
        const comment = await Comment.findById(id)
        if(!comment){
            return res.status(404).json({
                err: "comment not found!"
            })
        }

        if(comment.user_id.toString() !== req.user._id.toString()){
            return res.status(403).json({
                err: "Unauthorized!"
            })
        }

        await Comment.findByIdAndDelete(id)
        res.status(200).json({
            message: "comment deleted successfully!"
        })

    }
    catch(err){
        res.status(500).json({
            message: "something went wrong!"
        })
    }
}

