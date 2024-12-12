import React, { useState, useEffect } from "react";
import { API_URL } from "../App";
import { useParams } from "react-router-dom";
import { request } from "http";

interface Question {
  question: string;
  options: string[];
  correct_option: string;
}

interface Quiz {
  quiz_name: string;
  description: string;
  question_set: Question[];
}

const QuizSolving: React.FC = () => {
  const { quiz_id } = useParams<{ quiz_id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch the quiz questions using the provided quiz_id
    const fetchQuiz = async () => {
      try {
        const response = await fetch(`${API_URL}/api/user/quiz/${quiz_id}/questions`, {
          method: "GET",
          headers: {
            Authorization: `BEARER ${localStorage.getItem("token")}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setQuiz({
            quiz_name: data.quiz_name || "Quiz",
            description: data.description || "",
            question_set: data.questions || [],
          });
        } else {
          alert("Failed to fetch quiz: " + data.message);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [quiz_id]);

  const handleOptionChange = (questionIndex: number, selectedOption: string) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionIndex]: selectedOption,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      
      answers,
    };

    try {
      const response = await fetch(`${API_URL}/api/user/submit/quiz`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `BEARER ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });
      console.log(response)

      const data = await response.json();

      if (response.ok) {
        alert("Quiz submitted successfully! Your results will be available soon.");
      } else {
        alert(`Error submitting quiz: ${data.message}`);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("An error occurred while submitting your quiz.");
    }
  };

  if (isLoading) {
    return <div className="text-white text-center mt-10">Loading quiz...</div>;
  }

  if (!quiz) {
    return <div className="text-white text-center mt-10">No quiz available to solve.</div>;
  }

  return (
    <div className="bg-black text-white p-6 rounded-lg shadow-lg w-3/4 mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4 text-center">{quiz.quiz_name}</h1>
      <p className="text-lg mb-6 text-center">{quiz.description}</p>

      <form onSubmit={handleSubmit}>
        {quiz.question_set.map((question, index) => (
          <div key={index} className="mb-6 p-4 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Question {index + 1}</h2>
            <p className="mb-4">{question.question}</p>

            {question.options.map((option, optionIndex) => (
              <label
                key={optionIndex}
                className="block mb-2 p-2 bg-gray-700 rounded-lg cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option}
                  onChange={() => handleOptionChange(index, option)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700"
        >
          Submit Quiz
        </button>
      </form>
    </div>
  );
};

export default QuizSolving;
