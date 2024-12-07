import mongoose, { Document, Schema } from "mongoose";


interface Reg extends Document {
    contest_name:string;
    contest_id:string;
    user_id:string;
    fcm_token:string;
    
}

const registeredSchema = new mongoose.Schema<Reg>({
    contest_name:String,
    contest_id:String,
    user_id:String,
    fcm_token:{
        type:String,
        default:""
    }
});

const RegisteredModel = mongoose.model<Reg>("Registered_User", registeredSchema);


export {RegisteredModel};
