import { quizModel } from "../models/quiz";
import { QuizRegisteredModel } from "../models/quizRegistered";

async function registerQuiz(req, res) {
    const { quiz_id, invitation_code } = req.body;

    if (!quiz_id || !invitation_code) {
        return res.status(400).json({ message: "All parameters are required." });
    }

    try {
        const quiz = await quizModel.findOne({ _id: quiz_id });
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        } else if (invitation_code !== quiz.meta.invitation_code) {
            return res.status(403).json({ message: "Incorrect invitation code." });
        }

        const registered = await QuizRegisteredModel.findOne({ user_id: req.decoded.id, quiz_id });
        if (registered) {
            return res.status(200).json({ message: "User already registered." });
        }

        const regUser = new QuizRegisteredModel({
            quiz_name: quiz.meta.quiz_name,
            quiz_id: quiz._id,
            user_id: req.decoded.id,
        });
        await regUser.save();

        return res.status(200).json({ message: "User registered successfully." });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong." });
    }
}

export { registerQuiz };
