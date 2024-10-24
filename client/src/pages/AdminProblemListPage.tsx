import { useState, useEffect } from "react";
import MainHeading from "../components/MainHeading";
import axios from "axios";

// Define the interface for the problem details
interface Problem {
  id: string;
  name: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  publicTestCases: string;
  hiddenTestCases: string;
  imageUrl: string;
}

// Define the Admin Problem Page component
const AdminProblemListPage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [newProblem, setNewProblem] = useState<Problem>({
    id: "",
    name: "",
    description: "",
    difficulty: "Easy",
    publicTestCases: "",
    hiddenTestCases: "",
    imageUrl: "",
  });

  // Fetch problems from the database (You can connect this with your backend)
  useEffect(() => {
    axios.get("/api/problems").then((response) => {
      setProblems(response.data);
    });
  }, []);

  // Handle form changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setNewProblem({ ...newProblem, [e.target.name]: e.target.value });
  };

  // Handle form submission (saving problem to the database)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Add logic to save the new problem to the database
    axios.post("/api/problems", newProblem).then((response) => {
      setProblems([...problems, response.data]); // Add new problem to the state
      setNewProblem({
        id: "",
        name: "",
        description: "",
        difficulty: "Easy",
        publicTestCases: "",
        hiddenTestCases: "",
        imageUrl: "",
      }); // Reset form after submission
    });
  };

  return (
    <div>
      {/* Main Heading */}
      <MainHeading
        data={{
          username: "Admin",
          status: "loggedin",
          items: [
            { text: "Dashboard", link_path: "/dashboard" },
            { text: "Problem Management", link_path: "/admin/problems" },
          ],
        }}
      />

      <div className="container mx-auto py-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Problem Management</h2>

        {/* Form to add a new problem */}
        <form onSubmit={handleSubmit} className="space-y-4 bg-black p-6 rounded-lg border border-neon-blue">
          <div>
            <label className="block mb-2 text-white">Problem Name</label>
            <input
              type="text"
              name="name"
              value={newProblem.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-black text-white"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-white">Description</label>
            <textarea
              name="description"
              value={newProblem.description}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-black text-white"
              style={{ minHeight: "250px" }} // Increased height
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-2 text-white">Difficulty</label>
            <select
              name="difficulty"
              value={newProblem.difficulty}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-black text-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-white">Public Test Cases</label>
            <textarea
              name="publicTestCases"
              value={newProblem.publicTestCases}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-black text-white"
              style={{ minHeight: "200px" }} // Increased height
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-2 text-white">Hidden Test Cases</label>
            <textarea
              name="hiddenTestCases"
              value={newProblem.hiddenTestCases}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-black text-white"
              style={{ minHeight: "200px" }} // Increased height
              required
            ></textarea>
          </div>
          <div>
            <label className="block mb-2 text-white">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={newProblem.imageUrl}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded bg-black text-white"
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-6 rounded-full hover:shadow-lg transform transition-transform duration-200 hover:scale-105"
          >
            Add Problem
          </button>
        </form>

        {/* Display list of problems */}
        <div className="mt-8">
          <h3 className="text-xl font-bold text-white mb-4">All Problems:</h3>
          {problems.map((problem) => (
            <div
              key={problem.id}
              className="border border-neon-blue rounded p-4 mb-4 bg-black text-white"
            >
              <h4 className="text-lg font-bold">{problem.name}</h4>
              <p>{problem.description}</p>
              <p>Difficulty: {problem.difficulty}</p>
              <p>Public Test Cases: {problem.publicTestCases}</p>
              <p>Hidden Test Cases: {problem.hiddenTestCases}</p>
              <p>Image URL: <a href={problem.imageUrl} className="text-blue-500" target="_blank" rel="noopener noreferrer">{problem.imageUrl}</a></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminProblemListPage;
