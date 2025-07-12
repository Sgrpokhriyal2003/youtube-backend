import Comment from '../models/comment.js'

export const createComment = async(req, res) => {
    try{
        const {video_id, commentText} = req.body
        if(!video_id || !commentText){
            return res.status(400).json({
                err: "video id and comment txt are required!"
            })
        }

        const newComment = new Comment({
            video_id,
            commentText,
            user_id: req.user._id
        })

        const saveComment = await newComment.save()
        res.status(201).json({
            message: "comment is added successfully!",
            data: saveComment
        })

    }
    catch(err){
        res.status(500).json({
            message: "something went wrong!"
        })
    }
}

export const getComment = async(req, res) => {
    try{
        const id = req.params.id
        const comments = await Comment.find({id: video_id})
        .populate("user_id", "channelName logoUrl")
        .sort({createdAt: -1})

        res.status(200).json({comments})
    }
    catch(err){
        res.status(500).json({
            message: "something went wrong!"
        })
    }
}

export const updateComment = async(req, res) => {
    try{
        const id = req.params.id
        const {commentText} = req.body

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

        comment.commentText = commentText
        await comment.save()
        res.status(200).json({message: "comment updated successfully!", data: comment});

    }
    catch(err){
         res.status(500).json({
            message: "something went wrong!"
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

