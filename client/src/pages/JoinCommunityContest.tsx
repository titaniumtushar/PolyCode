import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from "../App";
import Leaderboard from "../components/LeaderBoard";

interface Ranking {
    user_id: string;
    name: string;
    wallet_id: string;
    total_marks: number;
    marks: { [questionId: number]: number };
}

interface ContestUpdate {
    message?: string;
    rankings?: any;
    timestamp?: string;
    participants?: any;
    show_message?: any;
}

const leaderboardData = [
    {
        rank: 1,
        name: "Barracuda3172",
        whitehatScore: 959,
        totalEarnings: "$14,439,800",
        paidReports: 7,
    },
    {
        rank: 2,
        name: "RetailDdene2946",
        whitehatScore: 661,
        totalEarnings: "$10,020,000",
        paidReports: 2,
    },
    {
        rank: 3,
        name: "PwningEth",
        whitehatScore: 537,
        totalEarnings: "$8,000,000",
        paidReports: 8,
    },
    {
        rank: 4,
        name: "GothicShanon89238",
        whitehatScore: 296,
        totalEarnings: "$4,181,150",
        paidReports: 16,
    },
    {
        rank: 5,
        name: "LonelySloth",
        whitehatScore: 273,
        totalEarnings: "$3,462,409",
        paidReports: 57,
    },
];

const JoinContestCommunity: React.FC = () => {
    const { contest_id } = useParams<{ contest_id: string }>();
    const [rankings, setRankings] = useState<Ranking[]>([]);
    const [participants, setParticipants] = useState<Ranking[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const joinContest = async () => {
            if (!contest_id) {
                setError("Contest ID is missing in the URL!");
                return;
            }

            try {
                // Make the POST request to join the contest
                const response = await fetch(${API_URL}/api/community/join, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({ contest_id }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(Failed to join contest: ${errorData.message});
                    return;
                }

                const data = await response.json();
                const { token } = data;

                if (!token) {
                    setError("Token is missing in the server response.");
                    return;
                }

                // Establish the SSE connection using the token
                const eventSource = new EventSource(
                    ${API_URL}/api/community/join/${token}
                );

                eventSource.onmessage = (event) => {
                    const update: ContestUpdate = JSON.parse(event.data);
                    console.log("Received update:", update);
                    if (update.rankings) {
                        setRankings(Object.values(update.rankings));
                    } else if (update.participants) {
                        setParticipants(update.participants);
                    } else if (update.show_message) {
                        setError(update.show_message);
                    }

                    // Update list of all participants
                };

                eventSource.onerror = () => {
                    // setError(
                    //   "Failed to connect to the live updates. Please try again later."
                    // );

                    eventSource.close();
                };

                return () => {
                    eventSource.close();
                };
            } catch (err) {
                console.error("Error joining contest:", err);
                setError("An error occurred while joining the contest.");
            }
        };

        joinContest();
    }, [contest_id]);

    // absolute top-0 left-0 h-full w-full bg-gradient-to-r from-pink-500 via-red-500 to-black text-white min-h-screen

    return (
        <div className="relative min-h-screen">
            {/* Background Gradient */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-black"
                style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 80%)",
                    zIndex: -1, // Ensures background stays behind the content
                }}
            ></div>

            {/* Main Content */}
            <div className="relative z-10 p-6">
                {/* Error message */}
                <h6 className="text-3xl font-bold text-center mb-6 text-white">
                    {error}
                </h6>

                {/* Contest Title */}
                <h1 className="text-3xl font-bold text-center mb-6 text-white">
                    Contest: {contest_id}
                </h1>

                {/* Flex container for Leaderboard and Participants */}
                <div className="flex space-x-8">
                    {/* Leaderboard on Left */}
                    <div className="w-1/3 bg-black text-white p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            Leaderboard
                        </h2>
                        <ul className="space-y-4">
                            {rankings.map((ranking, index) => (
                                <li
                                    key={ranking.user_id}
                                    className="flex justify-between items-center border-b py-2"
                                >
                                    <span>
                                        {index + 1}. {ranking.name}
                                    </span>
                                    <span>
                                        Total Marks: {ranking.total_marks}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Participants List on Right */}
                    <div className="w-2/3 bg-black text-white p-4 rounded-lg shadow-md">
                        <h2 className="text-2xl font-semibold mb-4">
                            Participants
                        </h2>
                        <ul className="space-y-4">
                            {participants.map((participant) => (
                                <li
                                    key={participant.user_id}
                                    className="flex justify-between items-center border-b py-2"
                                >
                                    <span>User ID: {participant.user_id}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Leaderboard Data Component */}
                <Leaderboard data={leaderboardData} />
            </div>
        </div>
    );
};

export default JoinContestCommunity;