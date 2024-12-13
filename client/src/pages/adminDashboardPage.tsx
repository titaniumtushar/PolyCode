import React, { useEffect, useState } from "react";
import Leaderboard from "../components/LeaderBoard";
import { API_URL } from "../App";

interface User {
    _id: string; // MongoDB ObjectId
    name: string;
    wallet_id: string;
}

const Dashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_URL}/api/community/users`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(`Failed to fetch users: ${errorData.message}`);
                    return;
                }

                const data = await response.json();
                setUsers(data.users); // Assuming `data.users` is an array of users.
            } catch (err) {
                console.error("Error fetching users:", err);
                setError("An error occurred while fetching users.");
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* Background Gradient */}
            <div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-black"
                style={{
                    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 80%)",
                    zIndex: -1,
                }}
            ></div>

            <div className="relative z-10 p-6">
                {/* Error Message */}
                {error && (
                    <h6 className="text-xl font-bold text-center mb-6 text-red-400">
                        {error}
                    </h6>
                )}

                <h1 className="text-3xl font-bold text-center mb-6 text-white">
                    User Dashboard
                </h1>

                {/* <div className="bg-black text-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold mb-4">All Users</h2>
                    <ul className="space-y-4">
                        {users.map((user, index) => (
                            <li
                                key={user._id}
                                className="flex justify-between items-center border-b border-gray-700 py-2"
                            >
                                <span>
                                    {index + 1}. {user.name}
                                </span>
                                <span>User ID: {user._id}</span>
                            </li>
                        ))}
                    </ul>
                </div> */}

                {/* Leaderboard (Optional) */}
                <Leaderboard
                    data={users.map((user, idx) => ({
                        rank: idx + 1,
                        name: user.name,
                        whitehatScore: parseInt(user.wallet_id, 10) || 0, // Placeholder score
                    }))}
                />
            </div>
        </div>
    );
};

export default Dashboard;
