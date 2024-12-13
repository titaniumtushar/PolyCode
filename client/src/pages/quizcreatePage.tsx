import React, { useState } from "react";
import { API_URL } from "../App";

interface Question {
  question: string;
  options: string[];
  correct_option: string;
}

interface QuizData {
  quiz_name: string;
  description: string;
  start_time: string;
  end_time: string;
  question_set: Question[];
}

const QuizCreation: React.FC = () => {
  const [quizData, setQuizData] = useState<QuizData>({
    quiz_name: "",
    description: "",
    start_time: "",
    end_time: "",
    question_set: [
      {
        question: "",
        options: ["", "", "", ""],
        correct_option: "",
      },
    ],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    section: "quiz" | "questions",
    key: string,
    questionIndex?: number,
    optionIndex?: number
  ) => {
    const value = e.target.value; // Assume `value` is string by default
  
    setQuizData((prevState) => {
      const newState = { ...prevState };
  
      if (section === "quiz") {
        // Cast key to keyof QuizData and ensure value matches the expected type
        newState[key as keyof QuizData] = value as any;
      } else if (section === "questions" && questionIndex !== undefined) {
        const question = newState.question_set[questionIndex];
  
        if (optionIndex !== undefined) {
          // Ensure options exist and assign value
          question.options[optionIndex] = value;
        } else {
          // Assign to a property of Question, with proper type assertions
          question[key as keyof Question] = value as any;
        }
      }
  
      return newState;
    });
  };
  

  const handleAddQuestion = () => {
    setQuizData((prevState) => ({
      ...prevState,
      question_set: [
        ...prevState.question_set,
        { question: "", options: ["", "", "", ""], correct_option: "" },
      ],
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    setQuizData((prevState) => ({
      ...prevState,
      question_set: prevState.question_set.filter((_, i) => i !== index),
    }));
  };

  const convertToUnixTimestamp = (dateString: string): number => {
    const date = new Date(dateString);
    return Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Convert start and end times to Unix timestamps
    const startTimestamp = convertToUnixTimestamp(quizData.start_time);
    const endTimestamp = convertToUnixTimestamp(quizData.end_time);

    const payload = {
      ...quizData,
      start_time: startTimestamp,
      end_time: endTimestamp,
    };

    console.log("Form data:", JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`${API_URL}/api/community/create/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `BEARER ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        alert("Quiz created successfully!");
        window.location.href = "/community/quizzes";
      } else {
        alert(`Error: ${responseData.message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while creating the quiz.");
    }
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg w-3/4 mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Quiz Creation</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-lg mb-2">Quiz Name</label>
          <input
            type="text"
            value={quizData.quiz_name}
            onChange={(e) => handleChange(e, "quiz", "quiz_name")}
            className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg"
            placeholder="Enter quiz name"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg mb-2">Description</label>
          <textarea
            value={quizData.description}
            onChange={(e) => handleChange(e, "quiz", "description")}
            className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg"
            placeholder="Enter quiz description"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg mb-2">Start Time</label>
          <input
            type="datetime-local"
            value={quizData.start_time}
            onChange={(e) => handleChange(e, "quiz", "start_time")}
            className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg"
          />
        </div>

        <div className="mb-4">
          <label className="block text-lg mb-2">End Time</label>
          <input
            type="datetime-local"
            value={quizData.end_time}
            onChange={(e) => handleChange(e, "quiz", "end_time")}
            className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg"
          />
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-4">Questions</h2>
          {quizData.question_set.map((question, index) => (
            <div key={index} className="mb-6 p-4 bg-gray-800 rounded-lg">
              <label className="block text-lg mb-2">Question</label>
              <input
                type="text"
                value={question.question}
                onChange={(e) => handleChange(e, "questions", "question", index)}
                className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg"
                placeholder="Enter question"
              />

              <div className="mt-4">
                <label className="block text-lg mb-2">Options</label>
                {question.options.map((option, optionIndex) => (
                  <input
                    key={optionIndex}
                    type="text"
                    value={option}
                    onChange={(e) =>
                      handleChange(e, "questions", "options", index, optionIndex)
                    }
                    className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg mb-2"
                    placeholder={`Option ${optionIndex + 1}`}
                  />
                ))}
              </div>

              <label className="block text-lg mt-4">Correct Option</label>
              <input
                type="text"
                value={question.correct_option}
                onChange={(e) => handleChange(e, "questions", "correct_option", index)}
                className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg"
                placeholder="Enter correct option"
              />

              <button
                type="button"
                onClick={() => handleRemoveQuestion(index)}
                className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
              >
                Remove Question
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddQuestion}
            className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700"
          >
            Add Question
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizCreation;
