import { quizModel } from "../models/quiz";
import jwt from "jsonwebtoken";
import { QUIZ_SECRET } from "../server";

// Define the types
interface RankingEntry {
  user_id: string;
  name: string;
  marks: { [key: string]: number };
  total_marks: number;
  wallet_id: string;
}

interface Rankings {
  [userId: string]: RankingEntry;
}

// Helper function to update rankings
function updateRankings(
  rankings: Rankings,
  userId: string,
  questionId: string,
  isCorrect: boolean,
  walletId: string,
  userName: string
): Rankings {
  let user = rankings[userId];

  if (!user) {
    rankings[userId] = {
      user_id: userId,
      name: userName,
      marks: { [questionId]: isCorrect ? 1 : 0 },
      total_marks: isCorrect ? 1 : 0,
      wallet_id: walletId,
    };
    return rankings;
  }

  const marks = user.marks;
  const existingMark = marks[questionId];

  if (existingMark === undefined || existingMark < (isCorrect ? 1 : 0)) {
    user.total_marks += (isCorrect ? 1 : 0) - (existingMark || 0);
    marks[questionId] = isCorrect ? 1 : 0;
  }

  user.wallet_id = walletId;
  user.name = userName;

  return rankings;
}

// Helper function to sort rankings
function sortRankings(rankings: Rankings): Rankings {
  const rankingsArray = Object.entries(rankings);

  rankingsArray.sort(([, a], [, b]) => b.total_marks - a.total_marks);

  const sortedRankings: Rankings = {};
  rankingsArray.forEach(([key, value]) => {
    sortedRankings[key] = value;
  });

  return sortedRankings;
}

// Function to handle quiz submission
async function submitQuiz(req, res) {
    const { quiz_token, answers } = req.body;
  
    if (!quiz_token || !answers) {
      return res.status(400).json({ message: "All fields are required." });
    }
  
    let verify;
    try {
      // Verify the JWT token
      verify = jwt.verify(quiz_token, String(QUIZ_SECRET));
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token." });
    }
  
    // Check if the quiz session is still active
    if (verify.end_time < new Date().valueOf() / 1000) {
      return res.status(402).json({ message: "This quiz is over now." });
    }
  
    try {
      // Find the quiz using the ID in the token payload
      const quiz = await quizModel.findById(verify.quiz_id);
  
      if (!quiz) {
        return res.status(404).json({ message: "Quiz not found." });
      }
  
      const questionSet = quiz.meta.question_set;
      const user = req.decoded; // Assuming `req.decoded` contains the authenticated user details
  
      let correctAnswersCount = 0;
  
      // Validate answers and update the score
      for (const [questionIndex, userAnswer] of Object.entries(answers)) {
        const question = questionSet[parseInt(questionIndex)];
        if (question && question.correct_option === userAnswer) {
          correctAnswersCount++;
        }
  
        quiz.rankings = updateRankings(
          quiz.rankings,
          user.id,
          parseInt(questionIndex),
          question && question.correct_option === userAnswer,
          user.wallet_id,
          user.name
        );
      }
  
      // Sort rankings and save the quiz data
      quiz.rankings = sortRankings(quiz.rankings);
      quiz.markModified("rankings");
  
      await quiz.save();
  
      return res.status(200).json({
        message: "Quiz submitted successfully.",
        correctAnswers: correctAnswersCount,
        totalQuestions: questionSet.length,
      });
    } catch (error) {
      console.error("Error during quiz submission:", error);
      return res.status(500).json({ message: "Something went wrong." });
    }
  }

export { submitQuiz };
