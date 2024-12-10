import React from "react";

type LeaderboardEntry = {
    rank: number;
    name: string;
    whitehatScore: number;
    totalEarnings: string;
    paidReports: number;
};

const Leaderboard = ({ data }: { data: LeaderboardEntry[] }) => {
    return (
        <div className="text-white w-full p-4 top-100">
            {data.map((entry) => (
                <div
                    key={entry.rank}
                    className="flex justify-between items-center bg-gray-800 p-4 rounded-lg mb-4 shadow-lg"
                >
                    {/* Rank */}
                    <div className="w-1/12 text-lg font-bold">{entry.rank}</div>

                    {/* Name */}
                    <div className="w-4/12 text-xl font-semibold text-orange-400">
                        {entry.name}
                        <p className="text-sm text-gray-400">Name</p>
                    </div>

                    {/* Whitehat Score */}
                    <div className="w-2/12 text-right">
                        <p className="text-lg font-bold">
                            {entry.whitehatScore}
                        </p>
                        <p className="text-sm text-gray-400">Credit Score</p>
                    </div>

                    {/* Total Earnings */}
                    {/* <div className="w-3/12 text-right">
                        <p className="text-lg font-bold">
                            {entry.totalEarnings}
                        </p>
                        <p className="text-sm text-gray-400">Total Earnings</p>
                    </div> */}

                    {/* Paid Reports */}
                    {/* <div className="w-2/12 text-right">
                        <p className="text-lg font-bold">{entry.paidReports}</p>
                        <p className="text-sm text-gray-400">Paid Reports</p>
                    </div> */}
                </div>
            ))}
        </div>
    );
};

export default Leaderboard;