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
    resume_url: {
        type: String,
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
        type: String, // Array of binary data for storing images
        required: false,
    },
    profile_pic: {
        type: String, // Array of binary data for storing images
        required: false,
    },
    certificates: {
        type: String, // Array of binary data for storing images
        required: false,
    },
});

export const UnverifiedUserModel = mongoose.model(
    "UnverifiedUser",
    UnverifiedUserSchema
);
