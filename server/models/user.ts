import mongoose, { Document } from "mongoose";

interface DUser extends Document {
    name: string;
    email: string;
    password: string;
    wallet_id: string;
    resume_url?: string;
    description?: string;
    tag?: string;
    badges?: Buffer[];
    profile_pic?: string;
    certificates?: string;
}

const userSchema = new mongoose.Schema<DUser>({
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
    wallet_id: {
        type: String,
        required: true,
    },
    resume_url: {
        type: String,
        required: false,
    },
    description: {
        type: String,
        required: false,
    },
    tag: {
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

const UserModel = mongoose.model<DUser>("User", userSchema);
const CommunityModel = mongoose.model<DUser>("Community", userSchema);

export { UserModel, CommunityModel };
