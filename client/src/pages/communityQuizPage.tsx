import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";

const QuizPageCommunity: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch(`${API_URL}/api/community/quizzes`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `BEARER ${localStorage.getItem("token")}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setQuizzes(data.quizzes || []); // Extract `quizzes` from response
        } else {
          console.error("Failed to fetch quizzes");
          setQuizzes([]);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
        setQuizzes([]);
      }
    };

    fetchQuizzes();
  }, []);

  const handleJoinQuiz = (quiz: any) => {
    navigate(`/community/quiz/${quiz._id}`);
  };

  const handleBackToList = () => {
    setSelectedQuiz(null);
  };

  const handleCopy = () => {
    if (selectedQuiz?.meta?.invitation_code) {
      navigator.clipboard.writeText(selectedQuiz.meta.invitation_code);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      {!selectedQuiz ? (
        <>
          <h1 className="text-2xl font-bold mb-4">My Quizzes</h1>
          <div
            onClick={() => navigate("/community/create/quiz")}
            className="border-dashed border-2 border-gray-500 p-10 text-center cursor-pointer mb-6"
          >
            <span className="text-3xl font-semibold text-gray-400">+ Create Quiz</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg shadow-md p-4 bg-gray-800 cursor-pointer hover:bg-gray-700"
                onClick={() => setSelectedQuiz(quiz)}
              >
                <h2 className="text-xl font-semibold">{quiz.meta.quiz_name}</h2>
                <p className="text-sm text-gray-400">
                  Start: {new Date(quiz.start_time * 1000).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">
                  End: {new Date(quiz.end_time * 1000).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            className="mb-4 py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={handleBackToList}
          >
            Back to List
          </button>
          <h1 className="text-2xl font-bold mb-4">{selectedQuiz.meta.quiz_name}</h1>
          <p className="text-sm text-gray-400">
            Start: {new Date(selectedQuiz.start_time * 1000).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">
            End: {new Date(selectedQuiz.end_time * 1000).toLocaleString()}
          </p>
          <p className="mt-4 text-gray-300">
            Description: {selectedQuiz.meta.description || "No description available."}
          </p>
          <p
            className="text-sm text-gray-300 py-2 rounded cursor-pointer transition-all"
            onClick={handleCopy}
            title="Click to copy"
          >
            Invitation Code:{" "}
            <span className="font-mono text-white bg-gray-700 px-8 py-2 rounded">
              {selectedQuiz.meta.invitation_code}
            </span>
          </p>
          {copied && (
            <span className="absolute left-0 top-full mt-1 text-xs text-green-500 bg-black px-2 py-1 rounded">
              Copied!
            </span>
          )}
          <div className="mt-4 flex justify-start gap-4">
            <button
              className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => handleJoinQuiz(selectedQuiz)}
            >
              Join
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizPageCommunity;
