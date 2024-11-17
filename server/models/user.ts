import mongoose, { Document, Schema } from "mongoose";

interface DUser extends Document {
    name: string;
    email: string;
    password: string;
    wallet_id:string;
    
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
    wallet_id:{
        type:String,
        required:true
    }
    
   
});

const UserModel = mongoose.model<DUser>("User", userSchema);

const CommunityModel = mongoose.model<DUser>("Community",userSchema);

export {UserModel,CommunityModel};
