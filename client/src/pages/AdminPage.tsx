import React, { useState } from "react";
import { API_URL } from "../App";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: "contest" | "questions" | "prize",
    key: string,
    index?: number,
    testCaseIndex?: number
  ) => {
    const value = e.target.value;
    setContestData((prevState) => {
      const newState = { ...prevState };
      if (section === "contest") {
        newState[key as keyof ContestData] = value;
      } else if (section === "questions") {
        if (testCaseIndex !== undefined) {
          newState.question_set[index!].test_cases[testCaseIndex!][key as keyof TestCase] = value;
        } else {
          newState.question_set[index!][key as keyof Question] = value;
        }
      } else if (section === "prize") {
        newState.prize_distribution[index!] = Number(value);
      }
      return newState;
    });
  };

  const handleTestCaseAdd = (questionIndex: number) => {
    setContestData((prevState) => {
      const newState = { ...prevState };
      newState.question_set[questionIndex].test_cases.push({ input: "", expected_output: "" });
      return newState;
    });
  };

  const handleQuestionAdd = () => {
    setContestData((prevState) => ({
      ...prevState,
      question_set: [
        ...prevState.question_set,
        {
          question_id: prevState.question_set.length + 1,
          question_text: "",
          test_cases: [
            {
              input: "",
              expected_output: "",
            },
          ],
        },
      ],
    }));
  };

  const convertToUnixTimestamp = (dateString: string): number => {
    const date = new Date(dateString);
    return Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startTimestamp = convertToUnixTimestamp(contestData.start_time);
    const endTimestamp = convertToUnixTimestamp(contestData.end_time);

    // Construct the payload to send to your API
    const payload = {
      ...contestData,
      start_time: startTimestamp,
      end_time: endTimestamp,
    };

    console.log("Form data as JSON:", JSON.stringify(payload, null, 2));

    // Example API call
    try {
      const response = await fetch(`${API_URL}/api/community/create/contest`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `BEARER ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });



      console.log(await response.json(),"this is the responsennnnnnnnnnnnn");

      if (response.ok) {
        // Handle success response
        alert("Contest created successfully!");
      } else {
        // Handle error response
        alert("Error creating contest.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error creating contest.");
    }
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg w-3/4 mx-auto mt-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold">Contest Creation Form</h1>
        <p className="text-gray-400 mt-2">Fill out the details to create a new coding contest.</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Contest Name and Description */}
        <div className="mb-6">
          <label htmlFor="contest-name" className="block text-lg mb-2">
            Contest Name
          </label>
          <input
            type="text"
            id="contest-name"
            value={contestData.contest_name}
            onChange={(e) => handleChange(e, "contest", "contest_name")}
            className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter Contest Name"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block text-lg mb-2">
            Description
          </label>
          <textarea
            id="description"
            value={contestData.description}
            onChange={(e) => handleChange(e, "contest", "description")}
            className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter Contest Description"
          />
        </div>

        {/* Questions */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Questions</h2>
          {contestData.question_set.map((question, questionIndex) => (
            <div key={questionIndex} className="mb-4">
              <label htmlFor={`question-text-${questionIndex}`} className="block text-lg mb-2">
                Question {questionIndex + 1}
              </label>
              <input
                type="text"
                id={`question-text-${questionIndex}`}
                value={question.question_text}
                onChange={(e) => handleChange(e, "questions", "question_text", questionIndex)}
                className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter Question Text"
              />

              {/* Test Cases */}
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Test Cases</h3>
                {question.test_cases.map((testCase, testCaseIndex) => (
                  <div key={testCaseIndex} className="mb-4">
                    <label className="block text-lg mb-2">Input</label>
                    <input
                      type="text"
                      value={testCase.input}
                      onChange={(e) => handleChange(e, "questions", "input", questionIndex, testCaseIndex)}
                      className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter Input"
                    />

                    <label className="block text-lg mt-2 mb-2">Expected Output</label>
                    <input
                      type="text"
                      value={testCase.expected_output}
                      onChange={(e) => handleChange(e, "questions", "expected_output", questionIndex, testCaseIndex)}
                      className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter Expected Output"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => handleTestCaseAdd(questionIndex)}
                  className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-all mt-4"
                >
                  Add Another Test Case
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleQuestionAdd}
            className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-all mt-4"
          >
            Add Another Question
          </button>
        </div>

        {/* Prize Distribution */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Prize Distribution</h2>
          {contestData.prize_distribution.map((prize, index) => (
            <div key={index} className="mb-4">
              <label htmlFor={`prize-${index}`} className="block text-lg mb-2">
                Rank {index + 1} Prize
              </label>
              <input
                type="number"
                id={`prize-${index}`}
                value={prize}
                onChange={(e) => handleChange(e, "prize", "prize_distribution", index)}
                className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder={`Enter Prize for Rank ${index + 1}`}
              />
            </div>
          ))}
        </div>

        {/* Start and End Time */}
        <div className="mb-6">
          <label htmlFor="start-time" className="block text-lg mb-2">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="start-time"
            value={contestData.start_time}
            onChange={(e) => handleChange(e, "contest", "start_time")}
            className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="end-time" className="block text-lg mb-2">
            End Time
          </label>
          <input
            type="datetime-local"
            id="end-time"
            value={contestData.end_time}
            onChange={(e) => handleChange(e, "contest", "end_time")}
            className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Submit Button */}
        <div className="text-center mt-6">
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-all"
          >
            Create Contest
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminPage;
