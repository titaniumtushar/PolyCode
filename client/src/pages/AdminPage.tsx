import React, { useState } from "react";
import { API_URL } from "../App";
import Leaderboard from "../components/Leaderboard";

interface TestCase {
  input: string;
  expected_output: string;
}

interface Question {
  question_id: number;
  question_text: string;
  test_cases: TestCase[];
}

interface ContestData {
  contest_name: string;
  invitation_code: string;
  question_set: Question[];
  prize_distribution: number[];
  start_time: string;
  end_time: string;
  description: string;
}

const AdminPage: React.FC = () => {
  const [contestData, setContestData] = useState<ContestData>({
    contest_name: "",
    invitation_code: "",
    question_set: [
      {
        question_id: 1,
        question_text: "",
        test_cases: [
          {
            input: "",
            expected_output: "",
          },
        ],
      },
    ],
    prize_distribution: [0, 0, 0],
    start_time: "",
    end_time: "",
    description: "",
  });

  // Updated handleChange
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: "contest" | "questions" | "prize",
    key: keyof ContestData | keyof Question | keyof TestCase,
    index?: number,
    testCaseIndex?: number
  ) => {
    const value = e.target.value;

    setContestData((prevState) => {
      const updatedData = { ...prevState };

      if (section === "contest") {
        // updatedData[key as keyof ContestData] = value;
      } else if (section === "questions" && index !== undefined) {
        updatedData.question_set = prevState.question_set.map((question, questionIndex) => {
          if (questionIndex === index) {
            if (testCaseIndex !== undefined) {
              return {
                ...question,
                test_cases: question.test_cases.map((testCase, testCaseIdx) =>
                  testCaseIdx === testCaseIndex
                    ? { ...testCase, [key as keyof TestCase]: value }
                    : testCase
                ),
              };
            } else {
              return {
                ...question,
                [key as keyof Question]: value,
              };
            }
          }
          return question;
        });
      } else if (section === "prize" && index !== undefined) {
        updatedData.prize_distribution = prevState.prize_distribution.map((prize, prizeIndex) =>
          prizeIndex === index ? Number(value) : prize
        );
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted", contestData);
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={contestData.contest_name}
          onChange={(e) => handleChange(e, "contest", "contest_name")}
        />
        {/* Additional form elements */}
        <button type="submit">Submit</button>
      </form>

    <div>
      <Leaderboard />
    </div>

    </div>

  );
};

export default AdminPage;
