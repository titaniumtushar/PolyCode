import { useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";

const ProblemSet = ({ 
  questions,
  initialCode = "",
  onSubmit 
}: { 
  questions: {
    question_id: number;
    question_text: string;
    test_cases: { input: any; output: any }[];
    correct_option?: string;
  }[];
  initialCode?: string;
  onSubmit: (code: string) => void;
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null); // Track selected question index
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [code, setCode] = useState<string>(initialCode); // Track code in the editor
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit(code);
      alert("Code submitted successfully!");
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
                  onClick={() => setSelectedQuestion(index)} // Set selected question
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
              onClick={() => setSelectedQuestion(null)} // Go back to problem list
            >
              ← Back to Problems
            </button>
            <h2 className="text-xl font-bold mb-4">
              {questions[selectedQuestion].question_text}
            </h2>
            <div className="mb-4">
              <h3 className="text-lg font-semibold">Test Cases</h3>
              <ul className="text-sm list-disc pl-5">
                {questions[selectedQuestion].test_cases.map((testCase, i) => (
                  <li key={i} className="mb-2">
                    <strong>Input:</strong> {JSON.stringify(testCase.input)} <br />
                    <strong>Output:</strong> {JSON.stringify(testCase.output)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Right Side: Code Editor */}
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
      </div>
    </div>
  );
};

export default ProblemSet;
