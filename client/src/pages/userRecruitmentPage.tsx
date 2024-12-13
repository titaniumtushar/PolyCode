import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const userRecruitmentPage: React.FC = () => {
    const [recruitments, setRecruitments] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRecruitments = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/user/recruitment/all", {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                      },
                    
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch recruitment drives");
                }

                const data = await response.json();
                setRecruitments(data);
            } catch (err) {
                console.error("Error fetching recruitment drives:", err);
                setError("Could not fetch recruitment drives.");
            }
        };

        fetchRecruitments();
    }, []);

    const handleViewDetails = (recruitmentId: string) => {
        navigate(`/user/recruitment/${recruitmentId}`);
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-r from-purple-500 to-orange-600 p-6">
            {/* Page Header */}
            <header className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-4">Recruitment Drives</h1>
                {/* <Link
                    to="/community/recruitment/create"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-lg transition duration-300"
                >
                    + Create Recruitment
                </Link> */}
            </header>

            {/* Error Display */}
            {error && (
                <div className="text-red-500 font-semibold text-center mb-4">
                    {error}
                </div>
            )}

            {/* Recruitment Drives */}
            <div className="space-y-4">
                {recruitments.map((drive) => (
                    <div
                        key={drive._id}
                        className="p-6 rounded-lg shadow-lg bg-white/80 backdrop-blur-lg hover:shadow-xl hover:-translate-y-1 transition duration-300 flex flex-col items-start border-l-4 border-purple-500"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-2">{drive.drive_name}</h2>
                        <p className="text-sm text-gray-700 mb-4">
                            {drive.description || "No description available."}
                        </p>

                        <div className="text-sm text-gray-600 w-full">
                            <p className="mb-1">
                                <span className="font-semibold">Company ID:</span> {drive.company_id}
                            </p>
                            <p className="mb-1">
                                <span className="font-semibold">Start Date:</span> {new Date(drive.start_date).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="font-semibold">End Date:</span> {new Date(drive.end_date).toLocaleDateString()}
                            </p>
                        </div>

                        <button
                            className="mt-4 text-sm bg-gradient-to-r from-purple-500 to-orange-600 hover:from-purple-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg shadow"
                            onClick={() => handleViewDetails(drive._id)}
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default userRecruitmentPage;
