import mongoose from "mongoose";

const UnverifiedUserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    collegeYear: {
        type: Number,
        required: true,
    },
    cgpa: {
        type: Number,
        required: true,
    },
    tag: {
        type: String,
        required: false,
    },
    resume: {
        type: [Buffer],
        required: false,
    },
    
    wallet_id: {
        type: String,
        required: true,
    },
    
    description: {
        type: String,
        required: false,
    },
    
    badges: {
        type: [Buffer], // Array of binary data for storing images
        required: false,
    },
    profile_pic: {
        type: [Buffer], // Array of binary data for storing images
        required: false,
    },
    certificates: {
        type: [Buffer], // Array of binary data for storing images
        required: false,
    },
});

export const UnverifiedUserModel = mongoose.model("UnverifiedUser", UnverifiedUserSchema);
