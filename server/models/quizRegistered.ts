import mongoose, { Document, Schema } from "mongoose";

interface QuizRegistration extends Document {
    quiz_name: string;
    quiz_id: string;
    user_id: string;
    fcm_token?: string;
}

const quizRegisteredSchema = new mongoose.Schema<QuizRegistration>({
    quiz_name: { type: String, required: true },
    quiz_id: { type: String, required: true },
    user_id: { type: String, required: true },
    fcm_token: {
        type: String,
        default: "",
    },
});

const QuizRegisteredModel = mongoose.model<QuizRegistration>("QuizRegistered", quizRegisteredSchema);

export { QuizRegisteredModel };
