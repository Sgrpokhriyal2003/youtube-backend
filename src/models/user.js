import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        unique: true,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    logoUrl:{
        type: String,
        required: true,
    },
    logoId:{
        type: String,
        required: true,
    },
    subscribedChannels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]    
}, {timestamps: true});

userSchema.virtual("subscribeCount").get(function (){
    return (this.subscribedChannels || []).length;
})


userSchema.set("toJSON", {
    virtuals: true,
})

const User = mongoose.model("User", userSchema)
export default User