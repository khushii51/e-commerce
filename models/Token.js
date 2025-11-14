import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    accessToken: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        required: true,
        unique: true
    },
    isRevoked: {
        type: Boolean,
        default: false
    }
}, {timeStamps : true})


tokenSchema.index ({ createdAt: 1}, { expireAfterSeconds: 7 * 24 * 60 * 60});

export default mongoose.model("Token", tokenSchema);