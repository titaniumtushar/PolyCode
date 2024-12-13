import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import ProblemSet from "../pages/ProblemSet";
import { useNavigate } from "react-router-dom";

const UserQuestionDashBoard: React.FC = () => {
    const navigate = useNavigate();
    const [contest, setContest] = useState({});
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [output, setOutput] = useState<string | null>(null);
    const contestId = window.location.pathname.split("/").pop();

    const checkAuthentication = async () => {
        try {
            const response = await fetch(`${API_URL}/api/user/auth`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `BEARER ${localStorage.getItem("token")}`,
                },
            });

            if (response.ok) {
                setIsAuthenticated(true);
                const data = await response.json();
                if (data.token) {
                    setToken(data.token);
                }
            } else {
                setIsAuthenticated(false);
                console.error("User authentication failed");
            }
        } catch (error) {
            console.error("Error during authentication:", error);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem(`contest_${contestId}`)) {
            navigate("/user");
        }

        setToken(localStorage.getItem(`contest_${contestId}`));
        checkAuthentication();
    }, []);

    useEffect(() => {
        if (isAuthenticated && token) {
            const eventSource = new EventSource(
                `${API_URL}/api/user/join/${token}`
            );

            eventSource.onmessage = (event: MessageEvent) => {
                const data = JSON.parse(event.data);
                console.log(data, "this is data");

                if (data.contest) {
                    setContest(data.contest);
                }
            };

            eventSource.onerror = (err) => {
                console.error("SSE connection error:", err);
                eventSource.close();
            };

            return () => {
                eventSource.close();
            };
        }
    }, [isAuthenticated, token]);

    return (
        <div className="flex h-screen bg-gray-900 text-gray-100">
            {/* Part 1: Sidebar */}
            <div className="flex-1 p-5 border-r border-gray-800 bg-gray-800 overflow-y-auto">
                <h4 className="text-xl font-bold mb-4 text-green-500">
                    Submission Results
                </h4>
                {output ? (
                    <div className="p-3 bg-gray-700 rounded mt-4">
                        <span className="font-bold text-lg text-gray-400">
                            Output:
                        </span>
                        <pre className="mt-2 text-sm text-gray-100 whitespace-pre-wrap break-words">
                            {output}
                        </pre>
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">
                        No results to display yet.
                    </p>
                )}
            </div>

            {/* Part 2 and 3: Main Content */}
            {/* <div className="flex-3 flex flex-col p-5">
                <div className="flex-2 p-5 border-b border-gray-800 bg-gray-900">
                    {contest && (
                        <ProblemSet
                            questions={contest.question_set || []}
                            token={token}
                            setOutput={setOutput}
                        />
                    )}
                </div>
            </div> */}
        </div>
    );
};

export default UserQuestionDashBoard;
