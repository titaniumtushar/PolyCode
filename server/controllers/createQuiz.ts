import mongoose from "mongoose";
import { quizModel } from "../models/quiz";

interface Quiz {
    quiz_name: string;
    invitation_code: string;
    question_set: { question: string; options: string[]; correct_option: string }[];
    community_id: string;
    start_time: number;
    end_time: number;
    description?: string;
}

async function createQuiz(req: any, res: any) {
    const {
        quiz_name,
        question_set,
        start_time,
        end_time,
        description,
    } = req.body;

    if (!quiz_name || !question_set || !start_time || !end_time) {
        return res.status(400).json({ message: "All parameters are required" });
    }

    // Use mock community ID if req.decoded is not set (for testing)
    const community_id = req.decoded?.id || "test-community-id";

    const quiz: Quiz = {
        quiz_name: quiz_name,
        invitation_code: createInvitationCodes(),
        question_set: question_set,
        community_id: community_id,
        start_time: start_time,
        end_time: end_time,
        description: description,
    };

    try {
        const newQuiz = new quizModel({
            meta: quiz,
            start_time: quiz.start_time,
            end_time: quiz.end_time,
        });

        await newQuiz.save();
        return res.status(200).json({ message: "Quiz Created!", quiz_id: newQuiz._id });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Something went wrong" });
    }
}

function createInvitationCodes(length = 6): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let code = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }
    return code;
}

export { createQuiz };
