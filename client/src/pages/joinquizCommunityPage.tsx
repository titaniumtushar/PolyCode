import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../App";

interface Ranking {
    user_id: string;
    name: string;
    total_marks: number;
    marks: { [questionId: number]: number };
}

interface QuizUpdate {
    rankings?: Record<string, Ranking>;
    participants?: Ranking[];
    show_message?: string;
}

const QuizAdminDashboard: React.FC = () => {
    const { quiz_id } = useParams<{ quiz_id: string }>();
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [participants, setParticipants] = useState<Ranking[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Function to distribute rewards to quiz participants
    const distributeRewards = async () => {
        try {
            const response = await fetch(`${API_URL}/api/admin/quiz/${quiz_id}/distribute-rewards`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                alert(`Rewards distributed successfully: ${data.message}`);
            } else {
                alert(`Failed to distribute rewards: ${data.message}`);
            }
        } catch (error) {
            console.error("Error distributing rewards:", error);
            alert("An error occurred while distributing rewards.");
        }
    };

    useEffect(() => {
        const fetchQuizData = async () => {
            if (!quiz_id) {
                setError("Quiz ID is missing in the URL!");
                return;
            }

            try {
                const response = await fetch(`${API_URL}/api/community/quiz/${quiz_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(`Failed to fetch quiz data: ${errorData.message}`);
                    return;
                }

                const data: QuizUpdate = await response.json();
                
                if (data.rankings) {
                    setRankings(Object.values(data.rankings));
                }

                if (data.participants) {
                    setParticipants(data.participants);
                }

                if (data.show_message) {
                    setError(data.show_message);
                }
            } catch (err) {
                console.error("Error fetching quiz data:", err);
                setError("An error occurred while fetching the quiz data.");
            }
        };

        fetchQuizData();
    }, [quiz_id]);

    return (
        <div className="relative min-h-screen">
            <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"
                style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 80%)",
                    zIndex: -1,
                }}
            ></div>

            <div className="relative z-10 p-6">
                {error && <h6 className="text-xl font-bold text-center mb-4 text-red-600">{error}</h6>}

                <h1 className="text-3xl font-bold text-center mb-6 text-white">
                    Quiz Admin Dashboard: {quiz_id}
                </h1>

                <div className="flex space-x-8">
                    {/* Leaderboard */}
                    <div className="w-1/3 bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Leaderboard</h2>
                        <ul className="space-y-4">
                            {rankings.map((ranking, index) => (
                                <li
                                    key={ranking.user_id}
                                    className="flex justify-between items-center border-b py-2"
                                >
                                    <span>
                                        {index + 1}. {ranking.name}
                                    </span>
                                    <span>Total Marks: {ranking.total_marks}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Participants */}
                    <div className="w-2/3 bg-gray-800 text-white p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">Participants</h2>
                        <ul className="space-y-4">
                            {participants.map((participant) => (
                                <li
                                    key={participant.user_id}
                                    className="flex justify-between items-center border-b py-2"
                                >
                                    <span>{participant.name}</span>
                                    <span>User ID: {participant.user_id}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Reward Distribution Button */}
                
            </div>
        </div>
    );
};

export default QuizAdminDashboard;


// http://localhost:3000/community/quiz/675cb015c8bf31701bae90c6
