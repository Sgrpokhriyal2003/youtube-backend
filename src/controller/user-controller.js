import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../config/cloudinary.js'
import jwt from 'jsonwebtoken'

export const register = async(req, res) => {
    try{
        console.log('request coming');
        const {email, phone, password, channelName} = req.body
        const hashCode = await bcrypt.hash(password, 10)
        const uploadImage = await cloudinary.uploader.upload(
            req.files.logoUrl.tempFilePath
        )

        console.log("uploadImage", uploadImage);

        const newUser = new User({
            email,
            password: hashCode,
            phone,
            channelName,
            logoUrl: uploadImage.secure_url,
            logoId: uploadImage.public_id
        })

        let user = await newUser.save()
        res.status(201).json({
            success: true,
            data: user
        })
    }
    catch(err){
        res.status(500).json({
            message: "server side error"
        })
    }
}

export const login = async(req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password){
            return res.status(400).json({
                message: "email and password are required!"
            })
        }

        const existUser = await User.findOne({email})
        if(!existUser){
            return res.status(404).json({
                success: false,
                error: "user not found!"
            })
        }

        const isValid = await bcrypt.compare(password, existUser.password)
        if(!isValid){
            return res.status(400).json({
                success: false,
                error: "invalid email or password!"
            })
        }

        const token = jwt.sign({
            _id: existUser._id,
            channelName: existUser.channelName,
            email: existUser.email,
            phone: existUser.phone,
            logoId: existUser.logoId
        }, process.env.JWT_SECRET, {expiresIn: "1h"})

        res.status(200).json({
            _id: existUser._id,
            channelName: existUser.channelName,
            email: existUser.email,
            phone: existUser.phone,
            logoId: existUser.logoId,
            logoUrl: existUser.logoUrl,
            subscribers: existUser.subscribers,
            subscribedChannels: existUser.subscribedChannels,
            accessToken: token
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            error: 'something went wrong, server side error!',
            error: err.message
        })
    }

}   

