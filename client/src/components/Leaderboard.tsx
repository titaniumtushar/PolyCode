import React, { useState } from "react";

// Define the types for the leaderboard data
interface LeaderboardItem {
  position: number;
  username: string;
  profilePic: string; // URL for the profile picture
  score: number; // Optional score if needed
}

const Leaderboard: React.FC = () => {
  // Define the initial leaderboard data (internal state)
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardItem[]>([
    {
      position: 1,
      username: "john_doe",
      profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
      score: 1500,
    },
    {
      position: 2,
      username: "jane_doe",
      profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
      score: 1400,
    },
    {
      position: 3,
      username: "will_smith",
      profilePic: "https://randomuser.me/api/portraits/men/3.jpg",
      score: 1300,
    },
    {
      position: 4,
      username: "mark_zuckerberg",
      profilePic: "https://randomuser.me/api/portraits/men/4.jpg",
      score: 1200,
    },
  ]);

  return (
    <div className="bg-black text-white rounded-lg shadow-lg p-6 w-96 mx-auto mt-6">
      <h2 className="text-3xl font-bold text-center mb-6">Leaderboard</h2>
      <div className="space-y-4">
        {leaderboardData.map((item) => (
          <div
            key={item.position}
            className="flex items-center justify-between bg-gray-800 rounded-lg p-4"
          >
            <span className="text-xl font-semibold text-yellow-500">{`#${item.position}`}</span>

            {/* Profile Picture */}
            <div className="flex items-center space-x-4">
              <img
                src={item.profilePic}
                alt={`${item.username}'s profile`}
                className="w-10 h-10 rounded-full"
              />
              <span className="text-lg">{item.username}</span>
            </div>

            {/* Score or other info (optional) */}
            <span className="text-xl font-semibold">{item.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
