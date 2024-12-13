import React, { useState } from "react";
import { API_URL } from "../App";

interface TestCase {
    input: string;
    expected_output: string;
}

interface Question {
    question_id: number;
    question_text: string;
    question_description: string;
    max_marks: number;
    test_cases: {
        public: TestCase[];
        hidden: TestCase[];
    };
}

interface ContestData {
    contest_name: string;
    invitation_code: string;
    question_set: Question[];
    prize_distribution: number[];
    start_time: string;
    end_time: string;
    description: string;
    private: boolean;
}

const AdminPage: React.FC = () => {
    const [contestData, setContestData] = useState<ContestData>({
        contest_name: "",
        invitation_code: "",
        question_set: [
            {
                question_id: 1,
                question_text: "",
                question_description: "",
                max_marks: 0,
                test_cases: {
                    public: [
                        {
                            input: "",
                            expected_output: "",
                        },
                    ],
                    hidden: [
                        {
                            input: "",
                            expected_output: "",
                        },
                    ],
                },
            },
        ],
        prize_distribution: [0, 0, 0],
        start_time: "",
        end_time: "",
        description: "",
        private: false,
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
        section: "contest" | "questions" | "prize",
        key: string,
        index?: number,
        type?: "public" | "hidden",
        testCaseIndex?: number
    ) => {
        const value =
            e.target.type === "checkbox" ? e.target.checked : e.target.value;
        setContestData((prevState) => {
            const newState = { ...prevState };
            if (section === "contest") {
                newState[key as keyof ContestData] = value;
            } else if (section === "questions") {
                if (type && testCaseIndex !== undefined) {
                    newState.question_set[index!].test_cases[type][
                        testCaseIndex!
                    ][key as keyof TestCase] = value;
                } else {
                    newState.question_set[index!][key as keyof Question] =
                        key === "max_marks" ? Number(value) : value;
                }
            } else if (section === "prize") {
                newState.prize_distribution[index!] = Number(value);
            }
            return newState;
        });
    };

    const handleTestCaseAdd = (
        questionIndex: number,
        type: "public" | "hidden"
    ) => {
        setContestData((prevState) => {
            const newState = { ...prevState };
            newState.question_set[questionIndex].test_cases[type].push({
                input: "",
                expected_output: "",
            });
            return newState;
        });
    };

    const handleQuestionAdd = () => {
        setContestData((prevState) => ({
            ...prevState,
            question_set: [
                ...prevState.question_set,
                {
                    question_id: prevState.question_set.length + 1,
                    question_text: "",
                    question_description: "",
                    max_marks: 0,
                    test_cases: {
                        public: [
                            {
                                input: "",
                                expected_output: "",
                            },
                        ],
                        hidden: [
                            {
                                input: "",
                                expected_output: "",
                            },
                        ],
                    },
                },
            ],
        }));
    };

    const convertToUnixTimestamp = (dateString: string): number => {
        const date = new Date(dateString);
        return Math.floor(date.getTime() / 1000); // Convert milliseconds to seconds
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Calculate total prize distribution sum
        const totalPrize = contestData.prize_distribution.reduce(
            (acc, prize) => acc + prize,
            0
        );
        const deductionAmount = totalPrize + 20; // Deduct 20 from the account

        // Show alert with deduction amount
        const userConfirmed = window.confirm(
            `The total prize distribution is ${totalPrize}. An additional 20 will be deducted from your account. Total deduction: ${deductionAmount}. Do you wish to proceed?`
        );

        if (!userConfirmed) {
            // If the user clicks "Cancel", stop the function execution
            return;
        }

        // Convert start and end times to Unix timestamps
        const startTimestamp = convertToUnixTimestamp(contestData.start_time);
        const endTimestamp = convertToUnixTimestamp(contestData.end_time);

        // Prepare the payload
        const payload = {
            ...contestData,
            start_time: startTimestamp,
            end_time: endTimestamp,
        };

        console.log("Form data as JSON:", JSON.stringify(payload, null, 2));

        try {
            // Send the request to the backend
            const response = await fetch(
                `${API_URL}/api/community/create/contest`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        authorization: `BEARER ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            const responseData = await response.json();

            console.log(responseData, "this is the response");

            if (response.ok) {
                alert("Contest created successfully!");
            } else {
                alert("Error creating contest.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error creating contest.");
        }
    };

    return (
        <div className="bg-black text-white p-6 rounded-lg shadow-lg w-3/4 mx-auto mt-10">
            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold">Contest Creation Form</h1>
                <p className="text-gray-400 mt-2">
                    Fill out the details to create a new coding contest.
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                {/* Contest Name and Description */}
                <div className="mb-6">
                    <label
                        htmlFor="contest-name"
                        className="block text-lg mb-2"
                    >
                        Contest Name
                    </label>
                    <input
                        type="text"
                        id="contest-name"
                        value={contestData.contest_name}
                        onChange={(e) =>
                            handleChange(e, "contest", "contest_name")
                        }
                        className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter Contest Name"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="description" className="block text-lg mb-2">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={contestData.description}
                        onChange={(e) =>
                            handleChange(e, "contest", "description")
                        }
                        className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="Enter Contest Description"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-lg mb-2">
                        Private Contest
                    </label>
                    <input
                        type="checkbox"
                        checked={contestData.private}
                        onChange={(e) => handleChange(e, "contest", "private")}
                        className="mr-2"
                    />
                    <span>{contestData.private ? "Yes" : "No"}</span>
                </div>

                {/* Questions */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Questions</h2>
                    {contestData.question_set.map((question, questionIndex) => (
                        <div key={questionIndex} className="mb-4">
                            <label
                                htmlFor={`question-text-${questionIndex}`}
                                className="block text-lg mb-2"
                            >
                                Question {questionIndex + 1}
                            </label>
                            <input
                                type="text"
                                id={`question-text-${questionIndex}`}
                                value={question.question_text}
                                onChange={(e) =>
                                    handleChange(
                                        e,
                                        "questions",
                                        "question_text",
                                        questionIndex
                                    )
                                }
                                className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter Question Text"
                            />

                            <label
                                htmlFor={`question-description-${questionIndex}`}
                                className="block text-lg mt-4 mb-2"
                            >
                                Question Description
                            </label>
                            <textarea
                                id={`question-description-${questionIndex}`}
                                value={question.question_description}
                                onChange={(e) =>
                                    handleChange(
                                        e,
                                        "questions",
                                        "question_description",
                                        questionIndex
                                    )
                                }
                                className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter Question Description"
                            />

                            <label
                                htmlFor={`max-marks-${questionIndex}`}
                                className="block text-lg mt-4 mb-2"
                            >
                                Max Marks
                            </label>
                            <input
                                type="number"
                                id={`max-marks-${questionIndex}`}
                                value={question.max_marks}
                                onChange={(e) =>
                                    handleChange(
                                        e,
                                        "questions",
                                        "max_marks",
                                        questionIndex
                                    )
                                }
                                className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="Enter Maximum Marks"
                            />

                            {/* Test Cases */}
                            {["public", "hidden"].map((type) => (
                                <div key={type} className="mt-4">
                                    <h3 className="text-lg font-semibold capitalize">
                                        {type} Test Cases
                                    </h3>
                                    {question.test_cases[
                                        type as "public" | "hidden"
                                    ].map((testCase, testCaseIndex) => (
                                        <div
                                            key={testCaseIndex}
                                            className="mb-4"
                                        >
                                            <label className="block text-lg mb-2">
                                                Input
                                            </label>
                                            <input
                                                type="text"
                                                value={testCase.input}
                                                onChange={(e) =>
                                                    handleChange(
                                                        e,
                                                        "questions",
                                                        "input",
                                                        questionIndex,
                                                        type as
                                                            | "public"
                                                            | "hidden",
                                                        testCaseIndex
                                                    )
                                                }
                                                className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Enter Input"
                                            />

                                            <label className="block text-lg mt-2 mb-2">
                                                Expected Output
                                            </label>
                                            <input
                                                type="text"
                                                value={testCase.expected_output}
                                                onChange={(e) =>
                                                    handleChange(
                                                        e,
                                                        "questions",
                                                        "expected_output",
                                                        questionIndex,
                                                        type as
                                                            | "public"
                                                            | "hidden",
                                                        testCaseIndex
                                                    )
                                                }
                                                className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                placeholder="Enter Expected Output"
                                            />
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleTestCaseAdd(
                                                questionIndex,
                                                type as "public" | "hidden"
                                            )
                                        }
                                        className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-all mt-4"
                                    >
                                        Add Another{" "}
                                        {type.charAt(0).toUpperCase() +
                                            type.slice(1)}{" "}
                                        Test Case
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleQuestionAdd}
                        className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-all mt-4"
                    >
                        Add Another Question
                    </button>
                </div>

                {/* Prize Distribution */}
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold mb-4">
                        Prize Distribution
                    </h2>
                    {contestData.prize_distribution.map((prize, index) => (
                        <div key={index} className="mb-4">
                            <label
                                htmlFor={`prize-${index}`}
                                className="block text-lg mb-2"
                            >
                                Rank {index + 1} Prize
                            </label>
                            <input
                                type="number"
                                id={`prize-${index}`}
                                value={prize}
                                onChange={(e) =>
                                    handleChange(
                                        e,
                                        "prize",
                                        "prize_distribution",
                                        index
                                    )
                                }
                                className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder={`Enter Prize for Rank ${
                                    index + 1
                                }`}
                            />
                        </div>
                    ))}
                </div>

                {/* Start and End Time */}
                <div className="mb-6">
                    <label htmlFor="start-time" className="block text-lg mb-2">
                        Start Time
                    </label>
                    <input
                        type="datetime-local"
                        id="start-time"
                        value={contestData.start_time}
                        onChange={(e) =>
                            handleChange(e, "contest", "start_time")
                        }
                        className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="end-time" className="block text-lg mb-2">
                        End Time
                    </label>
                    <input
                        type="datetime-local"
                        id="end-time"
                        value={contestData.end_time}
                        onChange={(e) => handleChange(e, "contest", "end_time")}
                        className="w-full p-3 bg-black border border-gray-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="text-center mt-6">
                    <button
                        type="submit"
                        className="bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-all"
                    >
                        Create Contest
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminPage;
