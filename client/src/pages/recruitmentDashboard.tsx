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
                    })),
                    company_id: data.recruitmentDrive.meta.company_id,
                    start_date: data.recruitmentDrive.meta.start_date,
                    end_date: data.recruitmentDrive.meta.end_date,
                    description: data.recruitmentDrive.meta.description,
                };


                console.log(formattedDrive);
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
        <div className="min-h-screen bg-gradient-to-r from-purple-500 to-orange-600 text-white p-6">
            <div className="container mx-auto bg-black bg-opacity-70 rounded-lg shadow-lg p-6">
                {recruitmentDrive ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-3xl font-bold mb-4">Stages</h2>
                            <div className="accordion space-y-4">
                                {recruitmentDrive.stages?.map((stage) => (
                                    <div
                                        key={stage.stage_id}
                                        className="border border-purple-500 rounded-lg overflow-hidden shadow-md"
                                    >
                                        <div className="p-4 bg-purple-600 font-semibold">
                                            {stage.stage_name} - {stage.stage_type}
                                        </div>
                                        <button onClick={()=>{navigate(`/community/join/${stage.stage_id}`,{state:{contest_name:stage.stage_name,contest_id:stage.stage_id}})}}>Connect</button>
                                        <div className="p-4 bg-black bg-opacity-50">
                                            <p className="text-sm text-gray-300">
                                                {stage.description || "No description provided."}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 rounded-lg shadow-md bg-gradient-to-t from-black via-purple-800 to-black">
                            <h2 className="text-3xl font-bold mb-4">Recruitment Details</h2>
                            <ul className="space-y-2">
                                <li><strong>Drive Name:</strong> {recruitmentDrive.drive_name}</li>
                                <li><strong>Invitation Code:</strong> {recruitmentDrive.invitation_code}</li>
                                <li><strong>Company ID:</strong> {recruitmentDrive.company_id}</li>
                                <li><strong>Start Date:</strong> {new Date(recruitmentDrive.start_date * 1000).toLocaleDateString()}</li>
                                <li><strong>End Date:</strong> {new Date(recruitmentDrive.end_date * 1000).toLocaleDateString()}</li>
                                <li><strong>Description:</strong> {recruitmentDrive.description || "N/A"}</li>
                            </ul>
                            <button
                                onClick={redirectToAddParticipants}
                                className="mt-4 w-full px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-700"
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
