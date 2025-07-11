import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../config/cloudinary.js'


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
    res.json({message: "signin page"})

}   
