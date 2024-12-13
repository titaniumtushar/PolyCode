import mongoose from "mongoose";

const StageSchema = new mongoose.Schema({
    stage_name: { type: String, required: true },
    stage_type: { type: String, required: true }, // e.g., "quiz", "interview", "assignment"
    stage_id: {type: String, required:false},
    description: { type: String },
    participants: { type: [String], default: [] }, // Optional field for participants
});


const RecruitmentDriveSchema = new mongoose.Schema({
    meta: {
        drive_name: { type: String, required: true },
        invitation_code: { type: String, required: true, unique: true },
        stages: { type: [StageSchema], required: true },
        company_id: { type: String, required: true },
        start_date: { type: Number, required: true }, // UNIX timestamp
        end_date: { type: Number, required: true },   // UNIX timestamp
        description: { type: String },
    },
    start_date: { type: Number, required: true },
    end_date: { type: Number, required: true },
}, { timestamps: true });

export const RecruitmentDriveModel = mongoose.model("RecruitmentDrive", RecruitmentDriveSchema);