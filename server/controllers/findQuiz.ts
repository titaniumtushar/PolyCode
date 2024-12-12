import { quizModel } from "../models/quiz";

export async function findQuiz(req: any, res: any) {
    try {
        let quizzes: any;
        if (req.decoded.role === "C") {
            quizzes = await quizModel.find({ "meta.community_id": req.decoded.id });
        } else {
            quizzes = await quizModel.find({});
        }

        if (quizzes.length === 0) {
            return res.status(404).json({ message: "Quiz not found!" });
        }

        return res.status(200).json({ data: quizzes, message: "Found" });
    } catch (error) {
        return res.status(500).json({ message: "Something went wrong!" });
    }
}
