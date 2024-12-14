import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { API_URL } from "../App";

interface Stage {
    stage_name: string;
    stage_type: string;
    stage_id: string;
    description?: string;
    participants?: string[];
}

interface RecruitmentDrive {
    drive_name: string;
    invitation_code: string;
    stages: Stage[];
    company_id: string;
    start_date: number;
    end_date: number;
    description?: string;
}

const RecruitmentDashboard: React.FC = () => {
    const { recruitment_id } = useParams<{ recruitment_id: string }>();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [recruitmentDrive, setRecruitmentDrive] = useState<RecruitmentDrive | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchRecruitmentDrive = async () => {
            try {
                const response = await fetch(`${API_URL}/api/community/recruitment/${recruitment_id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    setError(`Failed to fetch recruitment data: ${errorData.message}`);
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                const formattedDrive = {
                    drive_name: data.recruitmentDrive.meta.drive_name,
                    invitation_code: data.recruitmentDrive.meta.invitation_code,
                    stages: data.recruitmentDrive.meta.stages.map((stage: any) => ({
                        ...stage,
                        stage_id: stage._id,
                    })),
                    company_id: data.recruitmentDrive.meta.company_id,
                    start_date: data.recruitmentDrive.meta.start_date,
                    end_date: data.recruitmentDrive.meta.end_date,
                    description: data.recruitmentDrive.meta.description,
                };

                setRecruitmentDrive(formattedDrive);
            } catch (err) {
                console.error("Error fetching recruitment drive:", err);
                setError("An error occurred while fetching the recruitment data.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecruitmentDrive();
    }, [recruitment_id]);

    const redirectToAddParticipants = () => {
        if (recruitment_id) {
            navigate(`/community/recruitment/${recruitment_id}/inviteusers`);
        } else {
            setError("Recruitment ID is missing.");
        }
    };

    if (loading) {
        return <div className="text-center text-gray-300">Loading recruitment drive data...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-4">{error}</div>;
    }

    return (
        <div
            className="min-h-screen p-6 flex items-center justify-center"
            style={{
                background: "linear-gradient(to right, #9b5de5, #f15bb5)",
                color: "#fff",
            }}
        >
            <div
                className="container mx-auto rounded-lg shadow-lg p-6"
                style={{
                    background: "linear-gradient(to bottom, #111, #222)",
                    boxShadow: "0 0 10px rgba(0, 255, 255, 0.2)",
                }}
            >
                {recruitmentDrive ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Stages Section */}
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Stages</h2>
                            <div className="accordion space-y-4">
                                {recruitmentDrive.stages?.map((stage) => (
                                    <div
                                        key={stage.stage_id}
                                        className="rounded-lg overflow-hidden shadow-md"
                                        style={{
                                            background: "linear-gradient(to right, #111, #333)",
                                            border: "1px solid rgba(0, 255, 255, 0.2)",
                                            boxShadow: "0 0 5px rgba(0, 255, 255, 0.2)",
                                        }}
                                    >
                                        <div
                                            className="p-4 font-semibold"
                                            style={{
                                                backgroundColor: "#000",
                                                color: "#0ff",
                                            }}
                                        >
                                            {stage.stage_name} - {stage.stage_type}
                                        </div>
                                        <div
                                            className="p-4"
                                            style={{
                                                backgroundColor: "#222",
                                                color: "#ccc",
                                            }}
                                        >
                                            <p>{stage.description || "No description provided."}</p>
                                            {stage.participants && stage.participants.length > 0 ? (
                                                <div className="mt-4">
                                                    <h4 style={{ color: "#0ff" }}>Participants:</h4>
                                                    <ul className="list-disc list-inside">
                                                        {stage.participants.map((participant) => (
                                                            <li key={participant}>{participant}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <p className="mt-4 text-gray-400">No participants yet.</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recruitment Details Section */}
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Recruitment Details</h2>
                            <div
                                className="rounded-lg overflow-hidden shadow-md"
                                style={{
                                    background: "linear-gradient(to right, #111, #333)",
                                    border: "1px solid rgba(0, 255, 255, 0.2)",
                                    boxShadow: "0 0 5px rgba(0, 255, 255, 0.2)",
                                }}
                            >
                                <div
                                    className="p-4"
                                    style={{
                                        backgroundColor: "#000",
                                    }}
                                >
                                    {Object.entries({
                                        "Drive Name": recruitmentDrive.drive_name,
                                        "Invitation Code": recruitmentDrive.invitation_code,
                                        "Company ID": recruitmentDrive.company_id,
                                        "Start Date": new Date(recruitmentDrive.start_date * 1000).toLocaleDateString(),
                                        "End Date": new Date(recruitmentDrive.end_date * 1000).toLocaleDateString(),
                                        Description: recruitmentDrive.description || "N/A",
                                    }).map(([key, value]) => (
                                        <div
                                            className="flex flex-col items-center py-2"
                                            key={key}
                                            style={{
                                                color: "#0ff",
                                                textAlign: "center",
                                            }}
                                        >
                                            <div
                                                className="w-full py-2 mb-2 text-lg font-semibold rounded-md"
                                                style={{
                                                    backgroundColor: "#111",
                                                }}
                                            >
                                                {key}
                                            </div>
                                            <div
                                                className="w-full py-2 px-4 rounded-md text-lg"
                                                style={{
                                                    backgroundColor: "#333",
                                                    color: "#fff",
                                                }}
                                            >
                                                {value}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button
                                onClick={redirectToAddParticipants}
                                className="mt-6 w-full px-6 py-3 rounded-lg font-bold"
                                style={{
                                    background: "linear-gradient(to right, #34d399, #059669)",
                                    color: "#000",
                                    border: "1px solid rgba(0, 255, 0, 0.4)",
                                    boxShadow: "0 0 5px rgba(0, 255, 0, 0.4)",
                                    transition: "all 0.3s ease-in-out",
                                }}
                                onMouseOver={(e) =>
                                    (e.currentTarget.style.background = "linear-gradient(to right, #059669, #34d399)")
                                }
                                onMouseOut={(e) =>
                                    (e.currentTarget.style.background = "linear-gradient(to right, #34d399, #059669)")
                                }
                            >
                                Add Participant
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center text-gray-300">No recruitment drive data found.</div>
                )}
            </div>
        </div>
    );
};

export default RecruitmentDashboard;
