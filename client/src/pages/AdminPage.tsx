import { useState } from "react";
import MainHeading from "../components/MainHeading";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminPage = () => {
    const [showForm, setShowForm] = useState(false);
    const [contestType, setContestType] = useState<"paid" | "credit" | null>(
        null
    );
    const [contestDetails, setContestDetails] = useState({
        contest_name: "",
        invitation_code: "",
        credit_1st: 0,
        credit_2nd: 0,
        credit_3rd: 0,
        wallet_address: "",
        amount_matic: 0,
    });
    const [questionSet, setQuestionSet] = useState([
        { question: "", test_cases: [{ input: "", expected_output: "" }] },
    ]);
    const [step, setStep] = useState(1);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContestDetails({
            ...contestDetails,
            [e.target.name]: e.target.value,
        });
    };

    // Handle changes in question or test cases
    const handleQuestionChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        index: number,
        testCaseIndex?: number
    ) => {
        const updatedQuestions = [...questionSet];
        const { name, value } = e.target;

        if (name === "question") {
            updatedQuestions[index].question = value;
        } else if (name === "input" && testCaseIndex !== undefined) {
            updatedQuestions[index].test_cases[testCaseIndex].input = value;
        } else if (name === "expected_output" && testCaseIndex !== undefined) {
            updatedQuestions[index].test_cases[testCaseIndex].expected_output =
                value;
        }

        setQuestionSet(updatedQuestions);
    };

    const addQuestion = () => {
        setQuestionSet([
            ...questionSet,
            { question: "", test_cases: [{ input: "", expected_output: "" }] },
        ]);
    };

    const addTestCase = (index: number) => {
        const updatedQuestions = [...questionSet];
        updatedQuestions[index].test_cases.push({
            input: "",
            expected_output: "",
        });
        setQuestionSet(updatedQuestions);
    };

    const handleSubmit = () => {
        const contestData = {
            contest_name: contestDetails.contest_name,
            invitation_code: contestDetails.invitation_code,
            question_set: questionSet,
            contest_type: contestType === "credit" ? "Credit" : "Paid",
            prize_distribution: {
                first_place: contestDetails.credit_1st,
                second_place: contestDetails.credit_2nd,
                third_place: contestDetails.credit_3rd,
            },
            active: true,
        };

        console.log(contestData);

        axios
            .post(
                "https://963c-103-108-5-75.ngrok-free.app/community/create/contest",
                JSON.stringify(contestData)
            )
            .then((res) => alert("Contest Created !"))
            .catch((err) => console.error(err));
    };

    return (
        <div>
            <MainHeading
                data={{
                    username: "User",
                    status: "loggedin",
                    items: [
                        { text: "Marketplace", link_path: "/marketplace" },
                        { text: "Store", link_path: "/arenastore" },
                        { text: "List Product", link_path: "/listproduct" },
                    ],
                }}
            />
            <div className="flex flex-col items-center mt-8">
                <div className="flex space-x-4">
                    <button
                        className="w-40 h-40 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg flex items-center justify-center text-lg font-bold shadow-lg"
                        onClick={() => setShowForm(true)}
                    >
                        Create Contest
                    </button>
                    <button className="w-40 h-40 bg-gradient-to-r from-purple-500 to-orange-500 text-white rounded-lg flex items-center justify-center text-lg font-bold shadow-lg">
                        Your Marketplace
                    </button>
                </div>

                {showForm && (
                    <div className="bg-black text-purple-400 p-6 rounded-lg shadow-lg w-full max-w-md mt-8">
                        {contestType === null && (
                            <>
                                <h3 className="text-lg font-bold mb-4">
                                    Select Contest Type
                                </h3>
                                <button
                                    className="bg-yellow-400 text-black py-2 px-4 rounded mr-4"
                                    onClick={() => setContestType("credit")}
                                >
                                    Credit Contest
                                </button>
                                <button
                                    className="bg-purple-600 text-white py-2 px-4 rounded"
                                    onClick={() => setContestType("paid")}
                                >
                                    Paid Contest
                                </button>
                            </>
                        )}

                        {contestType && step === 1 && (
                            <>
                                <h3 className="text-lg font-bold mb-4">
                                    Contest Details
                                </h3>
                                <div className="mb-4">
                                    <label className="block mb-1">
                                        Contest Name
                                    </label>
                                    <input
                                        type="text"
                                        name="contest_name"
                                        value={contestDetails.contest_name}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block mb-1">
                                        Invitation Code
                                    </label>
                                    <input
                                        type="text"
                                        name="invitation_code"
                                        value={contestDetails.invitation_code}
                                        onChange={handleChange}
                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                    />
                                </div>
                                <button
                                    className="bg-blue-500 text-white py-2 px-4 rounded"
                                    onClick={() => setStep(2)}
                                >
                                    Next: Add Questions
                                </button>
                            </>
                        )}

                        {/* Step 2: Add Questions */}
                        {step === 2 && (
                            <>
                                <h3 className="text-lg font-bold mb-4">
                                    Add Questions
                                </h3>
                                {questionSet.map((questionItem, index) => (
                                    <div key={index} className="mb-6">
                                        <label className="block mb-1">
                                            Question:
                                        </label>
                                        <input
                                            type="text"
                                            name="question"
                                            value={questionItem.question}
                                            onChange={(e) =>
                                                handleQuestionChange(e, index)
                                            }
                                            className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                        />

                                        {questionItem.test_cases.map(
                                            (testCase, testCaseIndex) => (
                                                <div key={testCaseIndex}>
                                                    <label className="block mb-1">
                                                        Test Case{" "}
                                                        {testCaseIndex + 1}{" "}
                                                        Input:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="input"
                                                        value={testCase.input}
                                                        onChange={(e) =>
                                                            handleQuestionChange(
                                                                e,
                                                                index,
                                                                testCaseIndex
                                                            )
                                                        }
                                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                                    />
                                                    <label className="block mb-1">
                                                        Expected Output:
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="expected_output"
                                                        value={
                                                            testCase.expected_output
                                                        }
                                                        onChange={(e) =>
                                                            handleQuestionChange(
                                                                e,
                                                                index,
                                                                testCaseIndex
                                                            )
                                                        }
                                                        className="w-full border border-gray-700 p-2 rounded bg-black text-purple-400"
                                                    />
                                                </div>
                                            )
                                        )}

                                        <button
                                            className="mt-2 bg-blue-500 text-white py-1 px-2 rounded"
                                            onClick={() => addTestCase(index)}
                                        >
                                            Add Test Case
                                        </button>
                                    </div>
                                ))}

                                <button
                                    className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
                                    onClick={addQuestion}
                                >
                                    Add Another Question
                                </button>

                                <button
                                    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded"
                                    onClick={handleSubmit}
                                >
                                    Submit Contest
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
