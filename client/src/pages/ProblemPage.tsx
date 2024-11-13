import React, { useState } from "react";
import ReactCodeMirror from "@uiw/react-codemirror";
import { loadLanguage } from "@uiw/codemirror-extensions-langs";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";

const ProblemPage = ({
  problemName,
  description,
  testCases,
  initialCode = "",
  onSubmit,
}: {
  problemName: string;
  description: string;
  testCases: string[];
  initialCode?: string;
  onSubmit: (code: string) => void;
}) => {
  const [code, setCode] = useState<string>(initialCode);
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
    <div className="h-screen bg-black text-white flex flex-col">
      {/* Problem Header */}
      <div className="p-4 bg-black border-b border-white">
        <h1 className="text-xl font-bold">{problemName}</h1>
      </div>

      <div className="flex-grow flex overflow-hidden">
        {/* Left Panel: Problem Description and Test Cases */}
        <div className="w-1/2 h-full flex flex-col border-r border-white">
          <div className="p-4 flex-grow overflow-auto">
            {/* Problem Description */}
            <h2 className="text-lg font-semibold mb-2">Problem Description</h2>
            <p className="text-sm leading-relaxed">{description}</p>

            {/* Test Cases */}
            <h2 className="text-lg font-semibold mt-6 mb-2">Test Cases</h2>
            <ul className="text-sm list-disc pl-5">
              {testCases.map((testCase, index) => (
                <li key={index} className="mb-2">
                  {testCase}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="w-1/2 h-full flex flex-col">
          {/* Code Editor */}
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

          {/* Submit Button */}
          <div className="p-4 bg-black border-t border-white">
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
    </div>
  );
};

export default ProblemPage;
