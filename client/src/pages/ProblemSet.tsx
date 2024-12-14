import { useState } from "react"; 
import ReactCodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { API_URL } from "../App";

interface TestCase {
    input: any;
    output: any;
}

interface Question {
    question_text: string;
    question_description: string;
    test_cases: {
        public: TestCase[];
    };
}

interface ProblemSetProps {
    questions: Question[];
    initialCode?: string;
    token: string;
    setOutput: (output: string) => void;
}

const ProblemSet = ({
    questions,
    initialCode = "",
    token,
    setOutput,
}: ProblemSetProps) => {
    const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [code, setCode] = useState<string>(initialCode);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [submissionResult, setSubmissionResult] = useState<any | null>(null);

    const handleSubmit = async () => {
        if (selectedQuestion === null) {
            return;
        }
        setIsSubmitting(true);
        try {
            const contest_token = token;
            const question_id = Number(selectedQuestion) + 1;

            const response = await fetch(`${API_URL}/api/user/submit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    contest_token: contest_token,
                    question_id: question_id,
                    code: code,
                }),
            });

            const data = await response.json();
            setSubmissionResult(data); // Save the submission result
            setOutput(data.output || "No output provided");
        } catch (error) {
            console.error("Submission Error:", error);
            alert("There was an error submitting your code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="h-screen overflow-hidden bg-black text-white flex">
            {/* Left Side: Problem List or Problem Details */}
            <div className="w-1/2 border-r border-gray-700 h-full flex flex-col">
                {selectedQuestion === null ? (
                    <div className="p-4">
                        <h2 className="text-lg font-bold mb-4">Problem Statements</h2>
                        <ul className="space-y-2">
                            {questions.map((question, index) => (
                                <li
                                    key={index}
                                    className={`p-4 bg-gray-800 rounded-lg shadow-md cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-indigo-600 ${
                                        hoveredIndex === index ? "shadow-lg" : ""
                                    }`}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                    onClick={() => setSelectedQuestion(index)}
                                >
                                    {question.question_text}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <div className="p-4">
                        <button
                            className="mb-4 text-sm bg-gray-700 px-3 py-1 rounded hover:bg-gray-600"
                            onClick={() => setSelectedQuestion(null)}
                        >
                            ← Back to Problems
                        </button>
                        <h2 className="text-xl font-bold mb-4">
                            {questions[selectedQuestion].question_text}
                        </h2>
                        <p className="text-m mb-4">
                            {questions[selectedQuestion].question_description}
                        </p>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Test Cases</h3>
                            <ul className="text-sm list-disc pl-5">
                                {questions[selectedQuestion].test_cases.public.map(
                                    (testCase, i) => (
                                        <li key={i} className="mb-2">
                                            <strong>Input:</strong> {JSON.stringify(testCase.input)} <br />
                                            <strong>Output:</strong> {JSON.stringify(testCase.output)}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side: Code Editor and Results */}
            <div className="w-1/2 h-full flex flex-col">
                <div className="flex-grow">
                    <ReactCodeMirror
                        value={code}
                        extensions={[loadLanguage("javascript")!]}
                        theme={tokyoNight}
                        onChange={(value) => setCode(value)}
                        width="100%"
                        height="100%"
                    />
                </div>
                <div className="p-4 bg-black border-t border-gray-700">
                    <button
                        className={`w-full py-2 rounded-md font-bold ${
                            isSubmitting
                                ? "bg-gray-600 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600"
                        }`}
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Submitting..." : "Submit Code"}
                    </button>
                </div>
                {submissionResult && (
                    <div className="p-4 bg-gray-800 mt-4 rounded-md">
                        <h3 className="text-lg font-bold mb-2">Submission Results:</h3>
                        <p><strong>Input:</strong> {submissionResult.input}</p>
                        <p><strong>Expected Output:</strong> {submissionResult.expected_output}</p>
                        <p><strong>Actual Output:</strong> {submissionResult.actual_output}</p>
                        <p><strong>Is Correct:</strong> {submissionResult.is_correct ? "Yes" : "No"}</p>
                        <p><strong>Execution Time:</strong> {submissionResult.execution_time}s</p>
                        {submissionResult.error && (
                            <p className="text-red-500"><strong>Error:</strong> {submissionResult.error}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProblemSet;
