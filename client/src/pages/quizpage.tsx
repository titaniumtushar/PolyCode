import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";
import CodeBlock from "../components/CodeBlock";

const QuizPage: React.FC = () => {
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null); //  Track selected quiz for details view
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Track modal visibility
    const [quizToRegister, setQuizToRegister] = useState<any | null>(null); // Track quiz to register for

    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`${API_URL}/api/user/quizzes`, {
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `BEARER ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setQuizzes(data.quizzes);
                } else {
                    console.error("Failed to fetch quizzes.");
                }
            } catch (error) {
                console.error("Error fetching quizzes:", error);
            }
        };

        fetchQuizzes();
    }, []);

    const handleJoinQuiz = (quiz: any) => {
        navigate(`/user/quiz/join/${quiz._id}`);
    };

    const handleRegisterQuiz = (quiz: any) => {
        setQuizToRegister(quiz); // Store quiz to register
        setIsModalOpen(true); // Open the modal
    };

    const handleBackToList = () => {
        setSelectedQuiz(null); // Reset to quiz list view
    };

    const handleRegisterSubmit = async (invitationCode: string) => {
        try {
            const response = await fetch(`${API_URL}/api/user/quiz/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `BEARER ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    invitation_code: invitationCode,
                    quiz_id: quizToRegister._id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Successfully registered:", data);
                localStorage.setItem(`quiz_${selectedQuiz._id}`, data.token);
                setIsModalOpen(false); // Close the modal after registration
                setQuizToRegister(null); // Reset the quiz to register for
            } else {
                console.error("Registration failed:", data.message);
            }

            alert(data.message);
        } catch (error) {
            console.error("Error registering quiz:", error);
            alert("An error occurred. Please try again.");
        }
    };

    const Modal: React.FC<{
        isOpen: boolean;
        onClose: () => void;
        onSubmit: (invitationCode: string) => void;
    }> = ({ isOpen, onClose, onSubmit }) => {
        const [invitationCode, setInvitationCode] = useState<string>("");

        const handleSubmit = () => {
            if (invitationCode.trim() === "") {
                alert("Please enter an invitation code.");
                return;
            }
            onSubmit(invitationCode);
            onClose(); // Close the modal after submission
        };

        // Return null when the modal is closed, or the modal itself when open
        if (!isOpen) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div className="bg-black p-6 rounded-lg w-1/3">
                    <h2 className="text-xl font-semibold mb-4">
                        Enter Invitation Code
                    </h2>
                    <input
                        type="text"
                        className="w-full p-2 border text-black border-gray-300 rounded mb-4"
                        placeholder="Enter Invitation Code"
                        value={invitationCode}
                        onChange={(e) => setInvitationCode(e.target.value)}
                    />
                    <div className="flex justify-end gap-4">
                        <button
                            className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleSubmit}
                        >
                            Submit
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 bg-black text-white min-h-screen">
            {!selectedQuiz ? (
                <>
                    <h1 className="text-2xl font-bold mb-4">
                        Available Quizzes
                    </h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {quizzes.map((quiz, index) => (
                            <div
                                key={index}
                                className="border border-gray-700 rounded-lg shadow-md p-4 bg-gray-800 cursor-pointer hover:bg-gray-700"
                                onClick={() => setSelectedQuiz(quiz)} // Set selected quiz
                            >
                                <h2 className="text-xl font-semibold">
                                    {quiz.meta.quiz_name}
                                </h2>
                                <p className="text-sm text-gray-400">
                                    Start:{" "}
                                    {new Date(
                                        quiz.start_time * 1000
                                    ).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-400">
                                    End:{" "}
                                    {new Date(
                                        quiz.end_time * 1000
                                    ).toLocaleString()}
                                </p>
                                <p className="text-sm text-gray-300">
                                    Total Questions: {quiz.meta.total_questions}
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
                    <h1 className="text-2xl font-bold mb-4">
                        {selectedQuiz.meta.quiz_name}
                    </h1>
                    <p className="text-sm text-gray-400">
                        Start:{" "}
                        {new Date(
                            selectedQuiz.start_time * 1000
                        ).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-400">
                        End:{" "}
                        {new Date(
                            selectedQuiz.end_time * 1000
                        ).toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-300">
                        Total Questions: {selectedQuiz.meta.total_questions}
                    </p>
                    <p className="mt-4 text-gray-300">
                        Description:{" "}
                        {selectedQuiz.meta.description ||
                            "No description available."}
                    </p>
                    {selectedQuiz.start_time < new Date().valueOf() / 1000 &&
                    selectedQuiz.end_time > new Date().valueOf() / 1000 ? (
                        <div className="mt-4 flex justify-start gap-4">
                            <button
                                className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
                                onClick={() => handleJoinQuiz(selectedQuiz)}
                            >
                                Join
                            </button>
                            <button
                                className="py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
                                onClick={() => handleRegisterQuiz(selectedQuiz)}
                            >
                                Register
                            </button>
                        </div>
                    ) : (
                        <CodeBlock
                            input="This quiz is not live"
                            status="error"
                        />
                    )}
                </div>
            )}

            {/* Modal for entering invitation code */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleRegisterSubmit}
            />
        </div>
    );
};

export default QuizPage;
