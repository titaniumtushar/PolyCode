import React, { useEffect, useState } from "react";
import { API_URL } from "../App";
import { useNavigate } from "react-router-dom";

// Modal Component for Invitation Code
const ContestPageCommunity: React.FC = () => {
  const [contests, setContests] = useState<any[]>([]);
  const [selectedContest, setSelectedContest] = useState<any | null>(null); // Track selected contest for details view
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Track modal visibility
  const [contestToRegister, setContestToRegister] = useState<any | null>(null); // Track contest to register for

  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch(`${API_URL}/api/community/contest`, {
          headers: {
            "Content-Type": "application/json",
            authorization: `BEARER ${localStorage.getItem("token")}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setContests(data.data);
        } else {
          console.error("Failed to fetch contests");
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
    };

    fetchContests();
  }, []);

  const handleJoinContest = (contest: any) => {
    console.log("Joining contest:", contest.meta.contest_name);

    navigate(`/community/join/${contest._id}`);
  };

  

  const handleBackToList = () => {
    setSelectedContest(null); // Reset to contest list view
  };

  
  

  return (
    <div className="p-6 bg-black text-white min-h-screen">
      {/* Create New Contest Button */}
      

      {!selectedContest ? (
        <>
          <h1 className="text-2xl font-bold mb-4">My Contests</h1>
          <div
        onClick={() => navigate("/community/create")}
        className="border-dashed border-2 border-gray-500 p-10 text-center cursor-pointer mb-6"
      >
        <span className="text-3xl font-semibold text-gray-400">+ Create Contest</span>
      </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {contests.map((contest, index) => (
              <div
                key={index}
                className="border border-gray-700 rounded-lg shadow-md p-4 bg-gray-800 cursor-pointer hover:bg-gray-700"
                onClick={() => setSelectedContest(contest)} // Set selected contest
              >
                <h2 className="text-xl font-semibold">{contest.meta.contest_name}</h2>
                <p className="text-sm text-gray-400">
                  Start: {new Date(contest.start_time * 1000).toLocaleString()}
                </p>
                <p className="text-sm text-gray-400">
                  End: {new Date(contest.end_time * 1000).toLocaleString()}
                </p>
                <p className="text-sm text-gray-300">
                  Prize Distribution: {contest.meta.prize_distribution.join(", ")}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            className="mb-4 py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700"
            onClick={handleBackToList}
          >
            Back to List
          </button>
          <h1 className="text-2xl font-bold mb-4">
            {selectedContest.meta.contest_name}
          </h1>
          <p className="text-sm text-gray-400">
            Start: {new Date(selectedContest.start_time * 1000).toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">
            End: {new Date(selectedContest.end_time * 1000).toLocaleString()}
          </p>
          <p className="text-sm text-gray-300">
            Prize Distribution: {selectedContest.meta.prize_distribution.join(", ")}
          </p>
          <p className="mt-4 text-gray-300">
            Description: {selectedContest.meta.description || "No description available."}
          </p>
          <div className="mt-4 flex justify-start gap-4">
            <button
              className="py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => handleJoinContest(selectedContest)}
            >
              Join
            </button>
          </div>
        </div>
      )}

      {/* Modal for entering invitation code */}
      
    </div>
  );
};

export default ContestPageCommunity;
