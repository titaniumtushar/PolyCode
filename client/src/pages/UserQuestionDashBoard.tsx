import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import ProblemSet from "./ProblemSet";
import { useNavigate } from "react-router-dom";

interface Contest {
    question_set: any[];
    start_time: number;
    end_time: number;
}

const UserQuestionDashBoard: React.FC = () => {
    const navigate = useNavigate();
    const [contest, setContest] = useState<Contest | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [output, setOutput] = useState<string | any[]>(""); // Can be string or array
    const contestId = window.location.pathname.split("/").pop();
    const [error, setError] = useState<string | null>(null);

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
            navigate("/user/contests");
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
                    if (new Date().valueOf() / 1000 > data.contest.end_time) {
                        setError("Contest has been ended");
                        eventSource.close();
                    }
                    if (new Date().valueOf() / 1000 < data.contest.start_time) {
                        setError("Contest has not started yet");
                        eventSource.close();
                    }
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
        <>
            {error ? (
                <h1>{error}</h1>
            ) : (
                <div style={styles.container}>
                    {/* Part 1: Sidebar */}
                    <div style={styles.sidebar}>
                        <h4 style={styles.sectionHeader}>Submission Results</h4>
                        {output ? (
                            Array.isArray(output) ? (
                                output.map((out, index) => (
                                    <div key={index} style={styles.outputBlock}>
                                        <span style={styles.outputLabel}>
                                            Output {index + 1}:
                                        </span>
                                        <pre style={styles.outputText}>
                                            {JSON.stringify(out, null, 2)}
                                        </pre>
                                    </div>
                                ))
                            ) : (
                                <div style={styles.outputBlock}>
                                    <span style={styles.outputLabel}>
                                        Output:
                                    </span>
                                    <pre style={styles.outputText}>
                                        {output}
                                    </pre>
                                </div>
                            )
                        ) : (
                            <p style={styles.noResults}>
                                No results to display yet.
                            </p>
                        )}
                    </div>

                    {/* Part 2 and 3: Main Content */}
                    <div style={styles.mainContent}>
                        <div style={styles.problemSet}>
                            {contest && (
                                <ProblemSet
                                    questions={contest.question_set || []}
                                    token={token || ""}
                                    setOutput={setOutput}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const styles = {
    container: {
        display: "flex",
        height: "100%",
        backgroundColor: "#1f1f1f",
        color: "#f9f9f9",
    },
    sidebar: {
        flex: 1,
        padding: "20px",
        borderRight: "1px solid #333",
        backgroundColor: "#252525",
        overflowY: "auto" as const, // Explicitly specify the type
    },
    mainContent: {
        flex: 3,
        display: "flex",
        flexDirection: "column" as const, // Specify flexDirection type
        padding: "20px",
    },
    problemSet: {
        flex: 2,
        padding: "20px",
        borderBottom: "1px solid #333",
        backgroundColor: "#1f1f1f",
    },
    sectionHeader: {
        fontSize: "22px",
        fontWeight: "bold",
        marginBottom: "15px",
        color: "#22c55e",
    },
    outputBlock: {
        padding: "10px",
        backgroundColor: "#333",
        borderRadius: "4px",
        marginTop: "15px",
    },
    outputLabel: {
        fontWeight: "bold",
        fontSize: "16px",
        color: "#808080",
    },
    outputText: {
        marginTop: "10px",
        fontSize: "14px",
        color: "#f9f9f9",
        whiteSpace: "pre-wrap" as const,
        wordBreak: "break-word" as const,
    },
    noResults: {
        fontSize: "14px",
        color: "#808080",
    },
};

export default UserQuestionDashBoard;
