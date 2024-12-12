import { quizModel } from "../models/quiz";
import jwt from "jsonwebtoken";
import { QUIZ_SECRET } from "../server";

async function populateQuiz(req: any, res: any) {
    console.log(req.body);
    try {
        // Find the quiz by its ID from the request body
        let quiz = await quizModel.findOne({
            _id: req.body.quiz_id,
        });

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found!" });
        } else if (quiz.meta.community_id !== req.decoded.id) {
            return res.status(403).json({ message: "Forbidden to access." });
        }

        // Create a payload for the token
        const payload = {
            user_id: req.decoded.user_id,
            quiz_id: quiz._id,
            community_id: quiz.meta.community_id,
        };

        // Sign a token with the payload
        const token = jwt.sign(payload, QUIZ_SECRET, { expiresIn: '1h' });

        // Return success response with the token
        return res.status(200).json({ message: "Access granted.", token: token });
    } catch (error) {
        console.error("Error populating quiz:", error);
        return res.status(500).json({ message: "Something went wrong!" });
    }
}

export { populateQuiz };