import { contestModel } from "../models/contest";
import { CONTEST_SECRET } from "../server";
import jwt from "jsonwebtoken";

function getRandomMarks(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function submitProblems(req: any, res: any) {
  const { contest_token, question_id } = req.body;

  if (!contest_token || !question_id) {
    return res.status(400).json({ message: "All fields are required." });
  }

  let verify;
  try {
    verify = jwt.verify(contest_token, String(CONTEST_SECRET));
  } catch (error) {
    return res.status(403).json({ message: "Not allowed." });
  }

  if (verify.endTime < new Date().valueOf() / 1000) {
    return res.status(402).json({ message: "This contest is over now." });
  }

  const questionSet = verify.question_set;
  const question = questionSet.find((q: any) => q.question_id === question_id);

  if (!question) {
    return res.status(404).json({ message: "Question not found." });
  }


  const marks = getRandomMarks(1, question.max_marks);
  console.log(marks);

  

  try {
    let contest: any = await contestModel.findOne({ _id: verify.contest_id });

    if (!contest) {
      return res.status(500).json({ message: "Contest not found." });
    }

    const user = req.decoded;
    const updatedRankings = doFunctionsOnRanking(contest.rankings, user.id, question_id, marks, user.wallet_id);

    const sortedRankings = sortRankingsByTotalMarks(updatedRankings);

    contest.markModified('rankings');

    contest.rankings = sortedRankings;
    await contest.save();

    return res.status(200).json({ message: "Question submitted succesfully!" });

  } catch (error) {
    console.error('Error during submission:', error);
    return res.status(500).json({ message: "Something went wrong." });
  }
}

function doFunctionsOnRanking(
  arr: { [key: string]: any },
  userId: string,
  questionId: number,
  givenMarks: any,
  walletId: string
): { [key: string]: any } {
  let user = arr[userId];

  if (!user) {
    arr[userId] = {
      user_id: userId,
      marks: { [questionId]: givenMarks },
      total_marks: givenMarks,
      wallet_id: walletId,
    };
    return arr;
  }

  const marks = user.marks;
  const existing_mark = marks[questionId];

  if (!existing_mark) {
    marks[questionId] = givenMarks;
    user.total_marks += givenMarks;
  }
  else if(existing_mark<givenMarks){
    user.total_marks -= marks[questionId];
    marks[questionId] = givenMarks;
    user.total_marks += givenMarks;
  }

  user.wallet_id = walletId;



  return arr;
}

function sortRankingsByTotalMarks(rankings: { [key: string]: any }): { [key: string]: any } {
  const rankingsArray = Object.entries(rankings);

  rankingsArray.sort((a, b) => b[1].total_marks - a[1].total_marks);

  const sortedRankings: { [key: string]: any } = {};
  rankingsArray.forEach(([key, value]) => {
    sortedRankings[key] = value;
  });

  return sortedRankings;
}

export { submitProblems };
