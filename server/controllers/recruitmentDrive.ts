import mongoose from "mongoose";
import { RecruitmentDriveModel } from "../models/recruitmentDrive";

interface RecruitmentDrive {
    drive_name: string;
    invitation_code: string;
    stages: {
        stage_name: string;
        stage_type: string; // e.g., "interview", "quiz", "assignment"
        stage_id: string;
        description?: string;
        participants?: string[]; // Optional field
    }[];
    company_id: string;
    start_date: number;
    end_date: number;
    description?: string;
}

async function createRecruitmentDrive(req: any, res: any) {
    const {
        drive_name,
        stages,
        start_date,
        end_date,
        description,
        company_id // Included directly in the request body
    } = req.body;

    // Validate required fields
    if (!drive_name || !stages || !Array.isArray(stages) || !start_date || !end_date || !company_id) {
        return res.status(400).json({ message: "All parameters are required" });
    }

    // Ensure all stages have necessary data; participants are optional
    const validatedStages = stages.map((stage: any) => ({
        stage_name: stage.stage_name,
        stage_type: stage.stage_type,
        stage_id: stage.stage_id,
        description: stage.description,
        participants: stage.participants || [], // Default to an empty array if not provided
    }));
    console.log(stages);

    const recruitmentDrive: RecruitmentDrive = {
        drive_name: drive_name,
        invitation_code: generateInvitationCode(),
        stages: validatedStages,
        company_id: company_id,
        start_date: start_date,
        end_date: end_date,
        description: description,
    };

    try {
        const newDrive = new RecruitmentDriveModel({
            meta: recruitmentDrive,
            start_date: recruitmentDrive.start_date,
            end_date: recruitmentDrive.end_date,
        });

        await newDrive.save();
        return res.status(200).json({ message: "Recruitment Drive Created!", drive_id: newDrive._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong while creating the recruitment drive." });
    }
}

function generateInvitationCode(length = 6): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}

export async function addParticipantToStageOne(req, res) {
    const { drive_id, user_id } = req.body;

    // Validate input
    if (!drive_id || !user_id) {
        return res.status(400).json({ message: "drive_id and user_id are required" });
    }

    try {
        // Find the recruitment drive by ID
        const recruitmentDrive = await RecruitmentDriveModel.findById(drive_id);

        if (!recruitmentDrive) {
            return res.status(404).json({ message: "Recruitment drive not found" });
        }

        // Access the first stage (stage-1)
        const stageOne = recruitmentDrive.meta.stages.find(stage => stage.stage_id === "stage-1");

        if (!stageOne) {
            return res.status(404).json({ message: "Stage-1 not found in the recruitment drive" });
        }

        // Check if the user is already a participant
        if (stageOne.participants.includes(user_id)) {
            return res.status(400).json({ message: "User is already a participant in Stage-1" });
        }

        // Add the user to the participants list
        stageOne.participants.push(user_id);

        // Save the updated recruitment drive
        await recruitmentDrive.save();

        return res.status(200).json({ message: "User added to Stage-1 participants", stage: stageOne });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while adding the participant." });
    }
}



export { createRecruitmentDrive };
